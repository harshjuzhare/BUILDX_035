import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">CA</span>
          {t("app_name")}
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/track" className="hover:text-primary">{t("nav.track")}</Link>
          {!user && <Link to="/login" className="hover:text-primary">{t("nav.login")}</Link>}
          {!user && <Link to="/register" className="btn-primary text-sm">{t("nav.register")}</Link>}
          {user && (
            <>
              <Link
                to={{ citizen: "/citizen", officer: "/officer", worker: "/worker", admin: "/admin" }[user.role]}
                className="hover:text-primary"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="btn-secondary text-sm"
              >
                {t("nav.logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
