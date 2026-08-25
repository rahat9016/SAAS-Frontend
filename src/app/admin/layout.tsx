import DashboardHeader from "@/src/components/layout/dashboardLayout/DashboardHeader";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="flex-1 min-w-0 w-full flex flex-col overflow-hidden">
        <div className="w-full overflow-y-auto flex-1 min-h-0 scrollbar-hide bg-light">
          <div className="w-full bg-white">
            <DashboardHeader />
          </div>
          <div className="p-3 sm:p-4 lg:p-6 w-full max-w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
