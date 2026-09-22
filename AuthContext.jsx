import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("civicai_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("civicai_token");
    if (!token) { setLoading(false); return; }
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("civicai_user", JSON.stringify(data.user));
        if (data.user.preferredLanguage) i18n.changeLanguage(data.user.preferredLanguage);
      })
      .catch(() => {
        localStorage.removeItem("civicai_token");
        localStorage.removeItem("civicai_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("civicai_token", token);
    localStorage.setItem("civicai_user", JSON.stringify(userData));
    setUser(userData);
    if (userData.preferredLanguage) i18n.changeLanguage(userData.preferredLanguage);
  };

  const logout = () => {
    localStorage.removeItem("civicai_token");
    localStorage.removeItem("civicai_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
