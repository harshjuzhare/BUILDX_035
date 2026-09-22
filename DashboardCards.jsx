import React from "react";

export default function DashboardCards({ cards }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="card">
          <div className="text-2xl font-bold" style={{ color: c.color || "#0B6E4F" }}>{c.value}</div>
          <div className="text-sm text-gray-500 mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
