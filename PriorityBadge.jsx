import React from "react";

const COLORS = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

export default function PriorityBadge({ priority }) {
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${COLORS[priority] || COLORS.Medium}`}>{priority}</span>;
}
