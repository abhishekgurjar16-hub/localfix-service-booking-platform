import React, { createContext, useContext, useEffect, useState } from "react";import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("localfix_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("localfix_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
        localStorage.setItem("localfix_user", JSON.stringify(response.data.user));
      } catch {
        localStorage.removeItem("localfix_token");
        localStorage.removeItem("localfix_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("localfix_token", response.data.token);
    localStorage.setItem("localfix_user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    localStorage.setItem("localfix_token", response.data.token);
    localStorage.setItem("localfix_user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("localfix_token");
    localStorage.removeItem("localfix_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
