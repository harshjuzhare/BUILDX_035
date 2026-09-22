import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";
import PriorityBadge from "./PriorityBadge.jsx";

export default function ComplaintTable({ complaints, basePath }) {
  if (!complaints?.length) {
    return <div className="card text-center text-gray-500 py-10">No complaints found.</div>;
  }
  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-left">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Reported</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link to={`${basePath}/${c._id}`} className="text-primary font-medium">{c.complaintId}</Link>
              </td>
              <td className="px-4 py-3 capitalize">{c.aiCategory?.replace("_", " ")}</td>
              <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
              <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
              <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{c.location?.address}</td>
              <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
