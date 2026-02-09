import React, { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuthToken(savedToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  // Helper to set token in axios headers
  const setAPIToken = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  };

  // Login: save token in state, axios, and localStorage
  const login = (newToken) => {
    setAuthToken(newToken);
    localStorage.setItem("authToken", newToken);
    setAPIToken(newToken);
  };

  // Logout: remove token
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    setAPIToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
