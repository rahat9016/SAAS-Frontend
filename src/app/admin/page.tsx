import BestSellingProducts from "@/src/components/admin/Dashboard/BestSellingProducts";
import RecentOrders from "@/src/components/admin/Dashboard/RecentOrders";
import StatsCards from "@/src/components/admin/Dashboard/StatsCards";
import DailySalesChart from "@/src/components/admin/Dashboard/DailySalesChart";
import WeeklyRevenueChart from "@/src/components/admin/Dashboard/WeeklyRevenueChart";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-3 lg:space-y-6">
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <WeeklyRevenueChart />
        <DailySalesChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <BestSellingProducts />
        <RecentOrders />
      </div>
    </div>
  );
}
