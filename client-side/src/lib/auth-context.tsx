"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  avatar?: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load from localStorage on mount safely (no SSR hydration error)
    const storedUser = localStorage.getItem("nirmix_user");
    const storedToken = localStorage.getItem("nirmix_token");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem("nirmix_token", token);
    localStorage.setItem("nirmix_refresh_token", refreshToken);
    localStorage.setItem("nirmix_user", JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("nirmix_token");
      if (token) {
        await fetch("http://localhost:5001/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      localStorage.removeItem("nirmix_token");
      localStorage.removeItem("nirmix_refresh_token");
      localStorage.removeItem("nirmix_user");
      setAccessToken(null);
      setUser(null);
      toast.success("Logged out successfully.");
      router.push("/");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
