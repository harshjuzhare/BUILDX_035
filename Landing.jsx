import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";

const CATEGORIES = [
  { icon: "🕳️", key: "pothole", label: "Potholes & Road Damage" },
  { icon: "🗑️", key: "garbage", label: "Garbage & Waste" },
  { icon: "💡", key: "streetlight", label: "Broken Streetlights" },
  { icon: "💧", key: "water", label: "Water Leakage" },
  { icon: "🌊", key: "drainage", label: "Drainage Issues" },
  { icon: "🧹", key: "sanitation", label: "Sanitation & Cleanliness" },
];

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              AI-Powered · Multilingual · Real-time Tracking
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{t("landing.hero_title")}</h1>
            <p className="text-gray-600 text-lg mb-8">{t("landing.hero_subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary text-base px-6 py-3">{t("landing.report_btn")}</Link>
              <Link to="/track" className="btn-secondary text-base px-6 py-3">{t("landing.track_btn")}</Link>
            </div>
          </div>
          <div className="card p-8">
            <div className="text-sm font-semibold text-gray-500 mb-3">Live Platform Snapshot</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Complaints Resolved", value: "12,480+" },
                { label: "Avg. Resolution Time", value: "3.2 days" },
                { label: "Departments Onboarded", value: "18" },
                { label: "Languages Supported", value: "13" },
              ].map((s) => (
                <div key={s.label} className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How AI works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-2">{t("landing.how_ai_title")}</h2>
        <p className="text-gray-600 max-w-2xl">{t("landing.how_ai_body")}</p>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">{t("landing.categories_title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <div key={c.key} className="card flex items-center gap-3">
                <span className="text-3xl">{c.icon}</span>
                <span className="font-medium">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8">{t("landing.how_it_works_title")}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {["step1", "step2", "step3", "step4"].map((s, i) => (
            <div key={s} className="card">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">{i + 1}</div>
              <div className="font-semibold mb-1">{t(`landing.${s}`)}</div>
              <div className="text-sm text-gray-500">{t(`landing.${s}_body`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Multilingual */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-2">Available in your language</h2>
          <p className="text-gray-600 mb-6">CivicAI supports major Indian languages across the entire platform.</p>
          <LanguageSelector />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="text-white font-bold text-lg mb-2">CivicAI</div>
            <p className="text-gray-400">{t("tagline")}</p>
          </div>
          <div>
            <div className="text-white font-medium mb-2">Platform</div>
            <ul className="space-y-1 text-gray-400">
              <li><Link to="/register">Report a Problem</Link></li>
              <li><Link to="/track">Track Complaint</Link></li>
              <li><Link to="/login">Officer / Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-medium mb-2">Departments</div>
            <ul className="space-y-1 text-gray-400">
              <li>Road Department</li><li>Waste Management</li><li>Water & Drainage</li><li>Electricity</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-medium mb-2">Contact</div>
            <p className="text-gray-400">support@civicai.gov.in</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-8">© {new Date().getFullYear()} CivicAI. Built for citizens.</div>
      </footer>
    </div>
  );
}
