import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.patch("/notifications/read-all");
    load();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative p-2 rounded-full hover:bg-gray-100">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-medium">Notifications</span>
            <button onClick={markAll} className="text-xs text-primary">Mark all read</button>
          </div>
          {notifications.length === 0 && <div className="p-4 text-sm text-gray-400">No notifications yet.</div>}
          {notifications.map((n) => (
            <div key={n._id} className={`p-3 border-b text-sm ${n.isRead ? "" : "bg-primary/5"}`}>
              <div className="font-medium">{n.title}</div>
              <div className="text-gray-500">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
