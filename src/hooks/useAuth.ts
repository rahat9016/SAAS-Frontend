import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { IUserInformation } from "../lib/redux/features/auth/authTypes";
import { authService } from "../services/auth";
import { IGenericErrorResponse } from "../types/common/common";

interface JwtPayload {
  role?: string;
  isSuperAdmin?: boolean;
  branchId?: string | null;
  id?: string;
  userId?: string;
  sub?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
  user?: Partial<IUserInformation>;
}

export const useAuth = (
  onSuccess?: (data: AuthResponse, role: string) => void
) => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Set accessToken & refreshToken as cookies
      Cookies.set("accessToken", data.accessToken, { expires: 1 });
      Cookies.set("refreshToken", data.refreshToken, { expires: 2 });
      window.dispatchEvent(new Event("auth-token-updated"));

      // Decode identity from JWT. RBAC users (super admin or any branch
      // member) are admin-panel users → route to /admin.
      let role = "user";
      try {
        const decoded = jwtDecode<JwtPayload>(data.accessToken);
        if (decoded.isSuperAdmin) role = "SUPER_ADMIN";
        else if (decoded.branchId) role = "BRANCH_USER";
        else role = decoded.role || "user";
      } catch {
        console.error("Failed to decode JWT");
      }

      toast.success(data.message || "Login successful");
      if (onSuccess) {
        onSuccess(data, role);
      }
    },
    onError: (error: IGenericErrorResponse) => {
      console.log(error);
      toast.error(error.message);
      throw error;
    },
  });
};
