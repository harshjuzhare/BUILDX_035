/**
 * Seeds realistic demo data: departments, an admin, officers, workers, citizens,
 * and a handful of complaints across various statuses, so the whole system can be
 * demoed without manually creating every record.
 *
 * Usage: npm run seed   (make sure MONGO_URI is set in server/.env)
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import Complaint from "../models/Complaint.js";
import ComplaintStatusHistory from "../models/ComplaintStatusHistory.js";
import Notification from "../models/Notification.js";
import { COMPLAINT_STATUS, PRIORITY } from "../config/constants.js";
import { generateComplaintId } from "../utils/generateComplaintId.js";

dotenv.config();

const run = async () => {
  await connectDB();
  console.log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Complaint.deleteMany({}),
    ComplaintStatusHistory.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log("Creating departments...");
  const departments = await Department.insertMany([
    { name: "Road Department", code: "ROAD", categories: ["pothole", "road_damage"], description: "Handles potholes and road damage" },
    { name: "Waste Management Department", code: "WASTE", categories: ["garbage", "waste_accumulation"], description: "Handles garbage and waste accumulation" },
    { name: "Electricity Department", code: "ELEC", categories: ["broken_streetlight"], description: "Handles streetlights and public electrical faults" },
    { name: "Water Department", code: "WATER", categories: ["water_leakage"], description: "Handles water leakage and supply issues" },
    { name: "Drainage Department", code: "DRAIN", categories: ["drainage_issue"], description: "Handles drainage and sewage issues" },
    { name: "Sanitation Department", code: "SANI", categories: ["sanitation_issue", "public_cleanliness"], description: "Handles public sanitation and cleanliness" },
    { name: "General Department", code: "GEN", categories: ["other"], description: "Handles uncategorized civic issues" },
  ]);
  const dept = Object.fromEntries(departments.map((d) => [d.code, d]));

  console.log("Creating admin...");
  const admin = await User.create({
    name: "Central Administrator",
    email: "admin@civicai.gov.in",
    password: "Admin@123",
    role: "admin",
  });

  console.log("Creating officers & workers...");
  const roadOfficer = await User.create({ name: "Officer Raj Kumar", email: "officer.road@civicai.gov.in", password: "Officer@123", role: "officer", department: dept.ROAD._id, designation: "Road Inspector", createdBy: admin._id });
  const wasteOfficer = await User.create({ name: "Officer Priya Singh", email: "officer.waste@civicai.gov.in", password: "Officer@123", role: "officer", department: dept.WASTE._id, designation: "Sanitation Supervisor", createdBy: admin._id });

  const roadWorker = await User.create({ name: "Worker Suresh Patil", email: "worker.road@civicai.gov.in", password: "Worker@123", role: "worker", department: dept.ROAD._id, skills: ["road repair"], createdBy: roadOfficer._id });
  const wasteWorker = await User.create({ name: "Worker Anita Devi", email: "worker.waste@civicai.gov.in", password: "Worker@123", role: "worker", department: dept.WASTE._id, skills: ["waste collection"], createdBy: wasteOfficer._id });

  console.log("Creating citizens...");
  const citizen1 = await User.create({ name: "Aarav Sharma", email: "citizen1@example.com", password: "Citizen@123", role: "citizen", preferredLanguage: "en" });
  const citizen2 = await User.create({ name: "Meena Iyer", email: "citizen2@example.com", password: "Citizen@123", role: "citizen", preferredLanguage: "hi" });

  console.log("Creating demo complaints...");
  const sampleImage = "https://images.unsplash.com/photo-1584448097639-99f9d1cf6b9b?w=800";

  const complaintsData = [
    {
      citizen: citizen1._id, department: dept.ROAD._id, aiCategory: "pothole", priority: PRIORITY.HIGH,
      originalDescription: "Large pothole near the market causing traffic issues.",
      status: COMPLAINT_STATUS.RESOLVED, assignedOfficer: roadOfficer._id, assignedWorker: roadWorker._id,
      feedback: { rating: 5, comment: "Fixed quickly, thank you!", submittedAt: new Date() },
    },
    {
      citizen: citizen1._id, department: dept.ROAD._id, aiCategory: "road_damage", priority: PRIORITY.MEDIUM,
      originalDescription: "Cracked road surface near the school.",
      status: COMPLAINT_STATUS.WORK_IN_PROGRESS, assignedOfficer: roadOfficer._id, assignedWorker: roadWorker._id,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      citizen: citizen2._id, department: dept.WASTE._id, aiCategory: "garbage", priority: PRIORITY.MEDIUM,
      originalDescription: "कचरा जमा हो गया है, कृपया साफ करें।",
      originalLanguage: "hi", translatedDescription: "Garbage has accumulated, please clean it up.",
      status: COMPLAINT_STATUS.SUBMITTED,
    },
    {
      citizen: citizen2._id, department: dept.WASTE._id, aiCategory: "waste_accumulation", priority: PRIORITY.CRITICAL,
      originalDescription: "Overflowing dumpster attracting stray animals, urgent.",
      status: COMPLAINT_STATUS.VERIFICATION_PENDING, assignedOfficer: wasteOfficer._id, assignedWorker: wasteWorker._id,
      completionProofUrl: sampleImage, completionDescription: "Dumpster cleared and sanitized.",
    },
    {
      citizen: citizen1._id, department: dept.ELEC._id, aiCategory: "broken_streetlight", priority: PRIORITY.LOW,
      originalDescription: "Streetlight outside house #24 not working for a week.",
      status: COMPLAINT_STATUS.UNDER_REVIEW,
    },
    {
      citizen: citizen2._id, department: dept.DRAIN._id, aiCategory: "drainage_issue", priority: PRIORITY.HIGH,
      originalDescription: "Open drain overflowing after rain, health hazard.",
      status: COMPLAINT_STATUS.WORKER_ASSIGNED,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // overdue example
    },
  ];

  let i = 0;
  for (const c of complaintsData) {
    i += 1;
    const complaintId = await generateComplaintId();
    const complaint = await Complaint.create({
      complaintId,
      imageUrl: sampleImage,
      aiConfidence: 0.85,
      aiExplanation: "Demo seed data",
      location: { lat: 21.1458 + i * 0.01, lng: 79.0882 + i * 0.01, address: `Demo Location ${i}, Nagpur, Maharashtra` },
      ...c,
    });
    await ComplaintStatusHistory.create({ complaint: complaint._id, newStatus: c.status, actor: c.citizen, actorRole: "citizen", comment: "Seed data" });
    await Notification.create({ user: c.citizen, complaint: complaint._id, title: `Complaint ${complaintId}`, message: `Status: ${c.status}`, type: "status_update" });
  }

  console.log("\nSeed complete. Demo credentials:");
  console.log("  Admin:    admin@civicai.gov.in / Admin@123");
  console.log("  Officer:  officer.road@civicai.gov.in / Officer@123 (Road Dept)");
  console.log("  Officer:  officer.waste@civicai.gov.in / Officer@123 (Waste Dept)");
  console.log("  Worker:   worker.road@civicai.gov.in / Worker@123");
  console.log("  Worker:   worker.waste@civicai.gov.in / Worker@123");
  console.log("  Citizen:  citizen1@example.com / Citizen@123");
  console.log("  Citizen:  citizen2@example.com / Citizen@123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
