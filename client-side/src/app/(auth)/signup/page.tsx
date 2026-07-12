"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { registerSchema, type RegisterInput } from "../schema";
import { useAuth } from "@/lib/auth-context";
import { API_BASE } from "@/lib/property-api";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setServerError("");
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        const errorMsg = json.message || "Registration failed. Please try again.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const { user, accessToken, refreshToken } = json.data;
      login(accessToken, refreshToken, user);
      toast.success("Account created successfully! Welcome to NirMix.");
      router.push("/");
      router.refresh();
    } catch {
      const networkError = "Network error. Please try again.";
      setServerError(networkError);
      toast.error(networkError);
    }
  }

  return (
    <div className="relative flex w-full lg:w-1/2 flex-col justify-center px-8 py-6 sm:px-12 h-full z-10 animate-fade-in">
      {/* Heading */}
      <div className="mb-4 text-center">
        <h1 className="font-sans text-3xl font-extrabold uppercase tracking-wider text-ink">
          Join NirMix
        </h1>
        <p className="mt-1.5 text-xs text-slate">
          Start your journey in Nepal&apos;s premium real estate ecosystem.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
            <input
              type="text"
              placeholder="Arjun Thapa"
              {...register("name")}
              className="w-full rounded-lg border border-mist bg-sand/30 py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-slate/50 transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember"
            />
          </div>
          {errors.name && (
            <p className="mt-0.5 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
            <input
              type="email"
              placeholder="arjun@example.com"
              {...register("email")}
              className="w-full rounded-lg border border-mist bg-sand/30 py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-slate/50 transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember"
            />
          </div>
          {errors.email && (
            <p className="mt-0.5 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-lg border border-mist bg-sand/30 py-2.5 pl-10 pr-12 text-xs text-ink placeholder:text-slate/50 transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/50 hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-0.5 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink">
            Contact
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
            <input
              type="tel"
              placeholder="98XXXXXXXX"
              {...register("contact")}
              className="w-full rounded-lg border border-mist bg-sand/30 py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-slate/50 transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember"
            />
          </div>
          {errors.contact && (
            <p className="mt-0.5 text-xs text-red-500">
              {errors.contact.message}
            </p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <p className="text-xs text-red-500">{serverError}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ember py-2.5 text-sm font-bold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember/90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating Account..." : "Create My Account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-mist" />
        <span className="text-[11px] font-semibold text-slate">
          Or register with
        </span>
        <div className="h-px flex-1 bg-mist" />
      </div>

      {/* Social Register Buttons */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-mist bg-paper px-6 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sand"
        >
          <span className="text-base font-bold text-[#4285F4]">G</span>
          Google
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-mist bg-paper px-6 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sand"
        >
          <span className="text-base font-bold">🍎</span>
          Apple
        </button>
      </div>

      {/* Mobile-only: Sign In link */}
      <p className="mt-4 text-center text-xs text-slate lg:hidden">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-ember hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

