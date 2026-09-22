import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";

// Public registration is citizen-only by design — role is never sent from this form,
// and the backend hardcodes it server-side regardless.
export default function Register() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, preferredLanguage: i18n.language });
      login(data.user, data.token);
      toast.success("Account created!");
      navigate("/citizen");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <label className="label">{t("auth.select_language")}</label>
          <LanguageSelector />
        </div>
        <div className="card">
          <h1 className="text-2xl font-bold mb-1">{t("auth.register")}</h1>
          <p className="text-gray-500 text-sm mb-6">Create your citizen account to report and track civic problems.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">{t("auth.name")}</label>
              <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("auth.email")}</label>
              <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("auth.phone")}</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("auth.password")}</label>
              <input type="password" required minLength={6} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button disabled={loading} className="btn-primary w-full">{loading ? "Creating account..." : t("auth.register")}</button>
          </form>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account? <Link to="/login" className="text-primary font-medium">{t("auth.login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
