import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http from "../api/http.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ethara_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ethara_token");
    if (!token) {
      setLoading(false);
      return;
    }
    http
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("ethara_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("ethara_token");
        localStorage.removeItem("ethara_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, nextUser) => {
    localStorage.setItem("ethara_token", token);
    localStorage.setItem("ethara_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("ethara_token");
    localStorage.removeItem("ethara_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
