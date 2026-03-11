"use client";

import { logoutUser } from "@/src/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { UserRole } from "@/src/utils/UserRoleEnum";
import { ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

export function ProfileDropdown() {
  const dispatch = useAppDispatch();
  const {
    userInformation: { firstName, role },
  } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 text-sm text-gray-700 focus:outline-none"
          aria-label="Open profile menu"
        >
          <User size={20} />
          <span className="font-medium">{firstName}</span>
          <ChevronDown size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="z-9999 min-w-40 shadow-lg rounded-md bg-white"
      >
        <DropdownMenuLabel className="text-gray-700 font-semibold">
          My Account
        </DropdownMenuLabel>

        {role === UserRole.SUPER_ADMIN && (
          <DropdownMenuItem
            onClick={() => router.push("/admin")}
            className="cursor-pointer"
          >
            Admin
          </DropdownMenuItem>
        )}

        {role === UserRole.ADMIN && (
          <DropdownMenuItem
            onClick={() => router.push("/organization-list")}
            className="cursor-pointer"
          >
            Admin
          </DropdownMenuItem>
        )}

        {role === UserRole.USER && (
          <DropdownMenuItem
            onClick={() => router.push("/user-dashboard")}
            className="cursor-pointer"
          >
            Dashboard
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
