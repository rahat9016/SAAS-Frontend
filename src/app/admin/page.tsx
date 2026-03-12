import BestSellingProducts from "@/src/components/admin/Dashboard/BestSellingProducts";
import RecentOrders from "@/src/components/admin/Dashboard/RecentOrders";
import RevenueChart from "@/src/components/admin/Dashboard/RevenueChart";
import StatsCards from "@/src/components/admin/Dashboard/StatsCards";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-3 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your business
          today.
        </p>
      </div>
      <StatsCards />
      <RevenueChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <BestSellingProducts />
        <RecentOrders />
      </div>
    </div>
  );
}
