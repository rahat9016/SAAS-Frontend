"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useAuthModal } from "@/src/context/AuthModalContext";
import { Eye, EyeOff, Lock, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import styles from "./LoginModal.module.css";

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
    // Login succeeded — close modal and run callback
    closeLoginModal();
    onLoginSuccess?.();
  });

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setFormError("");
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isLoginModalOpen) resetForm();
  }, [isLoginModalOpen, resetForm]);

  // Close on Escape key
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
    // TODO: integrate real Google OAuth
    // For now, redirect to backend Google auth endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className={styles.overlay} onClick={closeLoginModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={closeLoginModal} aria-label="Close">
          <X size={16} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to continue your shopping</p>
        </div>

        {/* Google Sign In */}
        <button className={styles.googleBtn} onClick={handleGoogleSignIn} type="button">
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or sign in with email</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>
              Email <span className={styles.labelRequired}>*</span>
            </label>
            <input
              className={styles.input}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Password <span className={styles.labelRequired}>*</span>
            </label>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                className={styles.inputPasswordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Link href="/forgot-password" className={styles.forgotLink} onClick={closeLoginModal}>
              Forgot password?
            </Link>
          </div>

          {formError && <div className={styles.error}>{formError}</div>}

          <button className={styles.submitBtn} type="submit" disabled={isPending}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
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
        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" onClick={closeLoginModal}>
            Sign Up
          </Link>
        </p>

        {/* Trust */}
        <div className={styles.trust}>
          <ShieldCheck size={13} />
          <span>Secure, encrypted connection</span>
        </div>
      </div>
    </div>
  );
}
