import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

// Public-ish tracking entry: requires login (complaints are tied to accounts) but gives
// a quick "jump straight to a complaint by ID" path from the landing page.
export default function TrackComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaintId, setComplaintId] = useState("");

  const go = () => {
    if (!user) { toast("Please log in to track your complaint"); navigate("/login"); return; }
    navigate("/citizen"); // citizen dashboard lists all complaints; detail search happens there
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Track Your Complaint</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your Complaint ID or log in to see your full complaint history.</p>
        <input className="input mb-3" placeholder="e.g. CIV-2026-000001" value={complaintId} onChange={(e) => setComplaintId(e.target.value)} />
        <button className="btn-primary w-full" onClick={go}>Continue</button>
      </div>
    </div>
  );
}
