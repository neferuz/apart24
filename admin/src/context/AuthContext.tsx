"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isInitialized, pathname, router]);

  const login = (email: string, pass: string) => {
    if (email === "notferuz@gmail.com" && pass === "admin1234A") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    router.push("/login");
  };

  if (!isInitialized) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
