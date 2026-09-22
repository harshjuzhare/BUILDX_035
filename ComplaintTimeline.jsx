import React from "react";
import StatusBadge from "./StatusBadge.jsx";

export default function ComplaintTimeline({ history }) {
  return (
    <ol className="relative border-l border-gray-200 ml-3">
      {history.map((h, idx) => (
        <li key={h._id || idx} className="mb-6 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3">
            <span className="w-2.5 h-2.5 bg-primary rounded-full" />
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={h.newStatus} />
            <span className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {h.comment} — <span className="text-gray-400">by {h.actor?.name || "system"} ({h.actorRole})</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
