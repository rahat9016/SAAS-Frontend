import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { usePost } from "./usePost";

interface JwtPayload {
  role?: string;
  id?: string;
  userId?: string;
  sub?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export const useGoogleAuth = (onSuccessCallback?: (role: string) => void) => {
  return usePost<AuthResponse>("/auth/google/", (data) => {
    console.log(data);
    // Set accessToken & refreshToken as cookies
    Cookies.set("accessToken", data.accessToken, { expires: 1 });
    Cookies.set("refreshToken", data.refreshToken, { expires: 2 });
    window.dispatchEvent(new Event("auth-token-updated"));

    // Decode role from JWT
    let role = "user";
    try {
      const decoded = jwtDecode<JwtPayload>(data.accessToken);
      role = decoded.role || "user";
    } catch {
      console.error("Failed to decode JWT");
    }

    toast.success(data.message || "Google Login successful");
    if (onSuccessCallback) {
      onSuccessCallback(role);
    }
  });
};
