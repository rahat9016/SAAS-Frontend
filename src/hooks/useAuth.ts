import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { IUserInformation } from "../lib/redux/features/auth/authTypes";
import { clearRbacPermissions } from "../lib/redux/features/rbac/rbacSlice";
import { useAppDispatch } from "../lib/redux/hooks";
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
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Set accessToken & refreshToken as cookies
      Cookies.set("accessToken", data.accessToken, { expires: 1 });
      Cookies.set("refreshToken", data.refreshToken, { expires: 2 });
      window.dispatchEvent(new Event("auth-token-updated"));

      // Reset any cached RBAC permissions from a previous session so the
      // sidebar/guards re-derive for THIS user (no stale "all routes").
      dispatch(clearRbacPermissions());
      queryClient.removeQueries({ queryKey: ["rbac-permissions"] });

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
