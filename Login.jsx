import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      const home = { citizen: "/citizen", officer: "/officer", worker: "/worker", admin: "/admin" }[data.user.role] || "/";
      toast.success(`Welcome back, ${data.user.name}`);
      navigate(home);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4"><LanguageSelector compact /></div>
        <div className="card">
          <h1 className="text-2xl font-bold mb-1">{t("auth.login")}</h1>
          <p className="text-gray-500 text-sm mb-6">Citizens, Officers, Workers, and Administrators all sign in here.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">{t("auth.email")}</label>
              <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("auth.password")}</label>
              <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button disabled={loading} className="btn-primary w-full">{loading ? "Signing in..." : t("auth.login")}</button>
          </form>
          <p className="text-sm text-gray-500 mt-4 text-center">
            New citizen? <Link to="/register" className="text-primary font-medium">{t("auth.register")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
