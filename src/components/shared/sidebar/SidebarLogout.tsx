import { logoutUser } from "@/src/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { cn } from "@/src/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "../../ui/button";

interface SidebarLogoutProps {
  isCollapsed?: boolean;
  onLogout?: () => void;
}

export default function SidebarLogout({
  isCollapsed = false,
  onLogout,
}: SidebarLogoutProps) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    onLogout?.();
  };

  return (
    <div className="pb-2 mt-4">
      <Button
        onClick={handleLogout}
        aria-label="Logout"
        title="Logout"
        className={cn(
          "w-full bg-[#fde2e2] hover:bg-[#FDECEC] text-[#A8A8A8] hover:text-[#EB5757] flex items-center justify-start gap-2 h-10 sm:h-12 px-3! sm:px-4! text-sm sm:text-base",
          isCollapsed && "justify-center gap-0 px-0! sm:px-0!"
        )}
      >
        <LogOut className="h-4 w-4 sm:h-6 sm:w-6" />
        {!isCollapsed && "Logout"}
      </Button>
    </div>
  );
}
