"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "farmer" | "buyer" | "admin" | "guest";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  preferredLanguage?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: (role: "farmer" | "buyer" | "admin") => void;
  logout: () => void;
  isAuthenticated: boolean;
  isFarmer: boolean;
  isBuyer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ACCOUNTS: Record<"farmer" | "buyer" | "admin", AuthUser> = {
  farmer: {
    id: 1,
    name: "Ramesh Reddy (Farmer)",
    email: "farmer@smartkrishi.in",
    role: "farmer",
    phone: "+91 98480 22334",
    location: "Warangal, Telangana",
    preferredLanguage: "te",
  },
  buyer: {
    id: 2,
    name: "AgriFresh Agro Foods (Buyer)",
    email: "buyer@smartkrishi.in",
    role: "buyer",
    phone: "+91 94401 55667",
    location: "Bowenpally, Hyderabad, Telangana",
    preferredLanguage: "en",
  },
  admin: {
    id: 3,
    name: "Dr. K. Srinivas (Agronomist / Admin)",
    email: "admin@smartkrishi.in",
    role: "admin",
    phone: "+91 98499 88771",
    location: "Marketing Directorate, Hyderabad",
    preferredLanguage: "en",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("smartkrishi_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to demo farmer for convenient first impression
        setUser(DEMO_ACCOUNTS.farmer);
        localStorage.setItem("smartkrishi_user", JSON.stringify(DEMO_ACCOUNTS.farmer));
      }
    } catch {
      setUser(DEMO_ACCOUNTS.farmer);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("smartkrishi_user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || "Invalid credentials" };
    } catch {
      // Fallback matching
      const lower = email.toLowerCase();
      if (lower.includes("farmer")) {
        demoLogin("farmer");
        return { success: true };
      } else if (lower.includes("buyer")) {
        demoLogin("buyer");
        return { success: true };
      } else if (lower.includes("admin")) {
        demoLogin("admin");
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    }
  };

  const demoLogin = (role: "farmer" | "buyer" | "admin") => {
    const acc = DEMO_ACCOUNTS[role];
    setUser(acc);
    localStorage.setItem("smartkrishi_user", JSON.stringify(acc));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartkrishi_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        demoLogin,
        logout,
        isAuthenticated: !!user,
        isFarmer: user?.role === "farmer",
        isBuyer: user?.role === "buyer",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
