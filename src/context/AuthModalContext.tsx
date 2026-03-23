"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

interface AuthModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: (onSuccess?: () => void) => void;
  closeLoginModal: () => void;
  onLoginSuccess?: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [onLoginSuccess, setOnLoginSuccess] = useState<(() => void) | undefined>();

  const openLoginModal = useCallback((onSuccess?: () => void) => {
    setOnLoginSuccess(() => onSuccess);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setOnLoginSuccess(undefined);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{ isLoginModalOpen, openLoginModal, closeLoginModal, onLoginSuccess }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);
