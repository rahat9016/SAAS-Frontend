"use client";

import { googleClientId } from "@/src/config/envConfig";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleAuthClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
