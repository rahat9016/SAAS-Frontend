import BestSellingProducts from "@/src/components/admin/Dashboard/BestSellingProducts";
import RecentOrders from "@/src/components/admin/Dashboard/RecentOrders";
import RevenueChart from "@/src/components/admin/Dashboard/RevenueChart";
import StatsCards from "@/src/components/admin/Dashboard/StatsCards";
import WeeklyRevenueChart from "@/src/components/admin/Finance/WeeklyRevenueChart";
import DailySalesChart from "@/src/components/admin/Finance/DailySalesChart";
import TransactionTable from "@/src/components/admin/Finance/TransactionTable";
import PaymentMethodBreakdown from "@/src/components/admin/Finance/PaymentMethodBreakdown";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-3 lg:space-y-6">
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <BestSellingProducts />
        <RecentOrders />
      </div>
      <RevenueChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <WeeklyRevenueChart />
        <DailySalesChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <TransactionTable />
        </div>
        <PaymentMethodBreakdown />
      </div>
    </div>
  );
}
