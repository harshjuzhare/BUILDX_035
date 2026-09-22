import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Guards a route to a set of allowed roles. Redirects unauthenticated users to /login
// and authenticated-but-wrong-role users back to their own dashboard, so citizens can
// never reach officer/admin data and vice versa.
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const home = { citizen: "/citizen", officer: "/officer", worker: "/worker", admin: "/admin" }[user.role] || "/";
    return <Navigate to={home} replace />;
  }
  return children;
}
