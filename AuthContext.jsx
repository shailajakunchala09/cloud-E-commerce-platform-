import React, { createContext, useContext, useState, useCallback } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    persistSession(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    persistSession(data);
    return data;
  }, []);

  const persistSession = (data) => {
    const sessionUser = {
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ROLE_ADMIN";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
