import { logoutUser } from "@/src/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { LogOut } from "lucide-react";
import { Button } from "../../ui/button";

interface SidebarLogoutProps {
  onLogout?: () => void;
}

export default function SidebarLogout({ onLogout }: SidebarLogoutProps) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    onLogout?.();
  };

  return (
    <div className="pb-2 mt-4">
      <Button
        onClick={handleLogout}
        className="w-full bg-[#fde2e2] hover:bg-[#FDECEC] text-[#A8A8A8] hover:text-[#EB5757] flex items-center justify-start gap-2 h-10 sm:h-12 px-3! sm:px-4! text-sm sm:text-base"
      >
        <LogOut className="h-4 w-4 sm:h-6 sm:w-6" />
        Logout
      </Button>
    </div>
  );
}
