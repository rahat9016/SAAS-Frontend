"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useAuthModal } from "@/src/context/AuthModalContext";
import { Eye, EyeOff, Lock, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, onLoginSuccess } = useAuthModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    mutateAsync: login,
    isPending,
  } = useAuth((/* role */) => {
    closeLoginModal();
    onLoginSuccess?.();
  });

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setFormError("");
  }, []);

  useEffect(() => {
    if (!isLoginModalOpen) resetForm();
  }, [isLoginModalOpen, resetForm]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLoginModal();
    };
    if (isLoginModalOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password.trim()) {
      setFormError("Please enter both email and password.");
      return;
    }

    try {
      await login({ email, password });
    } catch {
      setFormError("Invalid email or password. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.location.href = `${backendUrl}/auth/google`;
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={closeLoginModal}
    >
      <div
        className="relative w-full max-w-sm bg-card rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          onClick={closeLoginModal}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">Welcome back</h2>
          <p className="text-xs text-muted-foreground mt-1">Sign in to continue your shopping</p>
        </div>

        {/* Google Sign In */}
        <button
          className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg border border-border bg-white text-sm font-medium text-foreground hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={handleGoogleSignIn}
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground">or sign in with email</span>
          <span className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Link href="/forgot-password" className="text-[11px] text-primary hover:underline mt-1 inline-block" onClick={closeLoginModal}>
              Forgot password?
            </Link>
          </div>

          {formError && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}

          <button
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isPending}
          >
            <span className="flex items-center justify-center gap-2">
              {isPending ? (
                "Signing in..."
              ) : (
                <>
                  <Lock size={15} />
                  Sign In
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" onClick={closeLoginModal} className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Trust */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck size={13} />
          <span>Secure, encrypted connection</span>
        </div>
      </div>
    </div>
  );
}
