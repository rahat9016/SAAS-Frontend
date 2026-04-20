"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useAuthModal } from "@/src/context/AuthModalContext";
import { Eye, EyeOff, Lock, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import GoogleSignInButton from "@/src/components/shared/GoogleSignInButton/GoogleSignInButton";
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
        <GoogleSignInButton
          label="Continue with Google"
          onSuccess={() => {
            closeLoginModal();
            onLoginSuccess?.();
          }}
        />

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
