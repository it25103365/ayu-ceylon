"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ShieldAlert, ArrowRight, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const { checkAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        throw new Error(data.error || "Login verification failed");
      }

      // Refresh auth context so header shows admin buttons
      await checkAuth();

      // Navigate to callback or /admin
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in as owner admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#e6dfd1] shadow-xl">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-md border border-[#c5a059]/40 bg-[#0c281c]">
          <img
            src="/branding/logo.png"
            alt="Ayu Zeylan Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#143d2b]">
          Owner Admin Login
        </h2>
        <p className="text-xs text-gray-500">
          Restricted to Ayu Zeylan business owner only.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            {remainingAttempts !== null && remainingAttempts > 0 && !errorMsg.includes("Remaining attempts") && (
              <p className="mt-1 text-red-600">
                Remaining attempts: {remainingAttempts}
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Admin Email
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ayuceylon.lk"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-[#143d2b] hover:bg-[#1b4f38] text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span>Verifying...</span>
          ) : (
            <>
              <span>Login to Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <Link
          href="/"
          className="flex items-center space-x-1 hover:text-[#143d2b] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span>SSL Secured</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#faf7f0]">
      <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
