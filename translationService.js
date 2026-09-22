/**
 * Language detection + translation-to-English.
 * Uses Gemini text generation when a key is available; otherwise assumes English
 * (the citizen's original text is always preserved regardless).
 */
export const detectAndTranslate = async (text) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key") {
    return { detectedLanguage: "en", translatedText: text };
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const prompt = `Detect the language of this text and translate it to English. Respond ONLY with strict JSON: {"language": "<ISO 639-1 code>", "translation": "<English translation>"}.\n\nText: """${text}"""`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0 } }),
    });
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return { detectedLanguage: parsed.language || "en", translatedText: parsed.translation || text };
  } catch (err) {
    console.error("Translation failed, using original text:", err.message);
    return { detectedLanguage: "en", translatedText: text };
  }
};
