import React from "react";
import { useTranslation } from "react-i18next";

const COLORS = {
  Submitted: "bg-gray-100 text-gray-700",
  "Under Review": "bg-blue-100 text-blue-700",
  "Assigned to Officer": "bg-indigo-100 text-indigo-700",
  "Worker Assigned": "bg-purple-100 text-purple-700",
  "Work in Progress": "bg-amber-100 text-amber-700",
  "Work Completed": "bg-teal-100 text-teal-700",
  "Verification Pending": "bg-orange-100 text-orange-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-200 text-gray-600",
  Reopened: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${COLORS[status] || "bg-gray-100 text-gray-700"}`}>
      {t(`status.${status}`, status)}
    </span>
  );
}
