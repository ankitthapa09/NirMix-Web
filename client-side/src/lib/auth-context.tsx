"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AUTH_REFRESHED_EVENT, AUTH_EXPIRED_EVENT } from "./api-client";
import { API_BASE } from "./property-api";

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
  updateUser: (updates: Partial<User>) => void;
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
    
    // Defer state updates to avoid synchronous cascading renders warning
    setTimeout(() => {
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedToken);
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
      setIsLoading(false);
    }, 0);
  }, []);

  // React to token changes driven by apiFetch's transparent refresh flow.
  useEffect(() => {
    const onRefreshed = (e: Event) => {
      const token = (e as CustomEvent<{ accessToken: string }>).detail?.accessToken;
      if (token) setAccessToken(token);
    };
    const onExpired = () => {
      localStorage.removeItem("nirmix_token");
      localStorage.removeItem("nirmix_refresh_token");
      localStorage.removeItem("nirmix_user");
      setAccessToken(null);
      setUser(null);
      toast.error("Your session has expired. Please log in again.");
      router.push("/login");
    };
    window.addEventListener(AUTH_REFRESHED_EVENT, onRefreshed);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => {
      window.removeEventListener(AUTH_REFRESHED_EVENT, onRefreshed);
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    };
  }, [router]);

  const login = (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem("nirmix_token", token);
    localStorage.setItem("nirmix_refresh_token", refreshToken);
    localStorage.setItem("nirmix_user", JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("nirmix_user", JSON.stringify(next));
      return next;
    });
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("nirmix_token");
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
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
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, updateUser, isAuthenticated }}>
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
