import React from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n/i18n.js";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LanguageSelector({ compact = false }) {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const handleChange = async (code) => {
    i18n.changeLanguage(code);
    if (user) {
      try { await api.patch("/auth/language", { language: code }); } catch { /* non-fatal */ }
    }
  };

  if (compact) {
    return (
      <select value={i18n.language} onChange={(e) => handleChange(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-2 py-1">
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => handleChange(l.code)}
          className={`p-4 rounded-xl border text-left transition-colors ${
            i18n.language === l.code ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
          }`}
        >
          <div className="font-medium">{l.label}</div>
        </button>
      ))}
    </div>
  );
}
