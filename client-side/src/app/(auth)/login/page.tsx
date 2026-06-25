"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { loginSchema, type LoginInput } from "../schema";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError("");
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || "Invalid credentials. Please try again.");
        return;
      }

      const { user, accessToken, refreshToken } = json.data;
      login(accessToken, refreshToken, user);
      router.push("/");
      router.refresh();
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  return (
    <div className="relative flex w-full lg:w-1/2 lg:ml-auto flex-col justify-center px-8 py-8 sm:px-12 h-full z-10 animate-fade-in">
      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="font-sans text-3xl font-extrabold uppercase tracking-wider text-ink">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-jade">
          Sign in to manage your property.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            {...register("email")}
            className="w-full rounded-lg border border-mist bg-sand/30 px-4 py-2.5 text-sm text-ink placeholder:text-slate/50 transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              {...register("password")}
              className="w-full rounded-lg border border-mist bg-sand/30 px-4 py-2.5 pr-12 text-sm text-ink placeholder:text-slate/50 transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember"
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
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Server Error + Forgot Password */}
        <div className="flex items-center justify-between">
          {serverError ? (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {serverError}
            </p>
          ) : (
            <span />
          )}
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-ember hover:underline"
          >
            Forgot Password ?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-ink/90 disabled:opacity-60"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-mist" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-mist" />
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-mist bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-sand"
        >
          <span className="text-base font-bold text-[#4285F4]">G</span>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-mist bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-sand"
        >
          <span className="text-base font-bold">🍎</span>
          Apple
        </button>
      </div>

      {/* Mobile-only: Create Account link */}
      <p className="mt-5 text-center text-sm text-slate lg:hidden">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold text-ember hover:underline">
          Create Account
        </Link>
      </p>
    </div>

  );
}
