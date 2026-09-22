// server/services/aiService.js

const TABITOKEN_URL = "https://tabitoken.com/v1/chat/completions";
const TABITOKEN_MODEL = "claude-opus-5";

/**
 * CivicAI complaint categories.
 * These should match the categories already used by the application.
 */
const CATEGORIES = [
  "pothole",
  "garbage",
  "streetlight",
  "drainage",
  "water_leakage",
  "sanitation",
  "road_damage",
  "other",
];

/**
 * Maps AI category to CivicAI department name.
 */
export const resolveDepartmentName = (category) => {
  const map = {
    pothole: "Roads & Infrastructure",
    road_damage: "Roads & Infrastructure",
    streetlight: "Electrical",
    garbage: "Waste Management",
    sanitation: "Sanitation",
    drainage: "Water & Drainage",
    water_leakage: "Water & Drainage",
    other: "General",
  };

  return map[category] || "General";
};

/**
 * Extract JSON safely from an AI response.
 */
const extractJSON = (text) => {
  if (!text) {
    throw new Error("AI returned an empty response");
  }

  // Remove markdown code fences if model adds them.
  let cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Find the first JSON object.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return JSON.parse(cleaned);
};

/**
 * Keyword fallback.
 * Used if TabiToken fails, so the CivicAI demo does not completely break.
 */
const fallbackAnalysis = (description = "") => {
  const text = description.toLowerCase();

  let category = "other";
  let priority = "Medium";

  if (
    text.includes("pothole") ||
    text.includes("gadda") ||
    text.includes("road hole")
  ) {
    category = "pothole";
  } else if (
    text.includes("garbage") ||
    text.includes("kuda") ||
    text.includes("kachra") ||
    text.includes("waste")
  ) {
    category = "garbage";
  } else if (
    text.includes("streetlight") ||
    text.includes("street light") ||
    text.includes("lamp")
  ) {
    category = "streetlight";
  } else if (
    text.includes("drain") ||
    text.includes("drainage") ||
    text.includes("nali")
  ) {
    category = "drainage";
  } else if (
    text.includes("water leak") ||
    text.includes("water leakage") ||
    text.includes("pipe leak")
  ) {
    category = "water_leakage";
  } else if (
    text.includes("sanitation") ||
    text.includes("toilet") ||
    text.includes("dirty")
  ) {
    category = "sanitation";
  } else if (
    text.includes("broken road") ||
    text.includes("damaged road") ||
    text.includes("road damage")
  ) {
    category = "road_damage";
  }

  if (
    text.includes("danger") ||
    text.includes("accident") ||
    text.includes("urgent") ||
    text.includes("emergency") ||
    text.includes("open manhole")
  ) {
    priority = "High";
  }

  return {
    category,
    confidence: 0.65,
    priority,
    explanation:
      "The complaint was classified using the CivicAI fallback classifier based on the reported description.",
  };
};

/**
 * Analyze a civic complaint using TabiToken.
 *
 * Keeps the same function signature used by complaintController.js:
 *
 * analyzeComplaint({
 *   imageBase64,
 *   mimeType,
 *   description
 * })
 */
export const analyzeComplaint = async ({
  imageBase64,
  mimeType,
  description,
}) => {
  const apiKey = process.env.TABITOKEN_API_KEY;

  // If API key is missing, use fallback.
  if (!apiKey) {
    console.warn(
      "TABITOKEN_API_KEY is missing. Using fallback classifier."
    );

    return fallbackAnalysis(description);
  }

  const systemPrompt = `
You are CivicAI, an AI system for classifying Indian civic complaints.

Analyze the user's complaint description and the attached civic-problem image.

Return ONLY valid JSON.
Do not use markdown.
Do not add any text outside the JSON.

Allowed categories:
${CATEGORIES.join(", ")}

Return exactly this structure:

{
  "category": "one allowed category",
  "confidence": 0.0,
  "priority": "Low | Medium | High",
  "explanation": "short explanation"
}

Rules:
- confidence must be between 0 and 1.
- Use the image and description together.
- If the image does not clearly show the problem, rely more on the description.
- High priority means the issue may create immediate public safety risk.
- Medium means normal civic service issue.
- Low means minor/non-urgent issue.
- Never invent a category outside the allowed list.
`;

  const userContent = [
    {
      type: "text",
      text: `${systemPrompt}

Citizen complaint description:
${description || "No description provided."}`,
    },
  ];

  /*
   * Send image to the OpenAI-compatible endpoint.
   *
   * The endpoint may support multimodal content using:
   * {
   *   type: "image_url",
   *   image_url: {
   *     url: "data:image/jpeg;base64,..."
   *   }
   * }
   */
  if (imageBase64 && mimeType) {
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:${mimeType};base64,${imageBase64}`,
      },
    });
  }

  try {
    const response = await fetch(TABITOKEN_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: TABITOKEN_MODEL,

        messages: [
          {
            role: "user",
            content: userContent,
          },
        ],

        temperature: 0.2,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "TabiToken API error:",
        response.status,
        responseText
      );

      throw new Error(
        `TabiToken API returned ${response.status}`
      );
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Invalid JSON from TabiToken:", responseText);
      throw new Error("Invalid response from TabiToken");
    }

    const aiText =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "";

    if (!aiText) {
      throw new Error("No AI content returned by TabiToken");
    }

    const parsed = extractJSON(aiText);

    // Validate category.
    const category = CATEGORIES.includes(parsed.category)
      ? parsed.category
      : "other";

    // Validate confidence.
    let confidence = Number(parsed.confidence);

    if (Number.isNaN(confidence)) {
      confidence = 0.75;
    }

    confidence = Math.max(0, Math.min(1, confidence));

    // Validate priority.
    const allowedPriorities = ["Low", "Medium", "High"];

    const priority = allowedPriorities.includes(parsed.priority)
      ? parsed.priority
      : "Medium";

    return {
      category,
      confidence,
      priority,
      explanation:
        parsed.explanation ||
        "The complaint was analyzed using CivicAI AI classification.",
    };
  } catch (error) {
    console.error(
      "TabiToken analysis failed:",
      error.message
    );

    console.warn(
      "Using CivicAI fallback classifier..."
    );

    return fallbackAnalysis(description);
  }
};