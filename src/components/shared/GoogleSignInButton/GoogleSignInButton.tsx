"use client";

import { useGoogleAuth } from "@/src/hooks/useGoogleAuth";
import { isAdminRole } from "@/src/utils/UserRoleEnum";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface GoogleSignInButtonProps {
  label?: string; // Kept for compatibility, though GoogleLogin has its own text
  onSuccess?: (role: string) => void;
}

export default function GoogleSignInButton({
  onSuccess,
}: GoogleSignInButtonProps) {
  const router = useRouter();

  const { mutateAsync: authenticateWithBackend, isPending } = useGoogleAuth(
    (role: string) => {
      if (onSuccess) {
        onSuccess(role);
        return;
      }

      router.push(isAdminRole(role) ? "/admin" : "/");
    }
  );

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (credentialResponse.credential) {
            try {
              await authenticateWithBackend({
                token: credentialResponse.credential,
              });
            } catch (error) {
              console.error("Backend Google Auth Error:", error);
            }
          }
        }}
        onError={() => {
          toast.error("Google login failed. Please try again.");
        }}
        useOneTap
        theme="outline"
        size="large"
        width="384" // Max width to match max-w-md if needed, or similar
      />
    </div>
  );
}
