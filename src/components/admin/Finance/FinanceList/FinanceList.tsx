"use client";

import { useState } from "react";
import { orderPaymentRows, overviewStats, ledgerEntries } from "@/src/data/financeData";
import { FileText, CheckCircle, AlertCircle, Clock, Wallet } from "lucide-react";
import LedgerTable from "@/src/components/admin/Finance/LedgerTable";
import { GetLedgerColumns } from "@/src/components/admin/Finance/TableColumns/LedgerColumns";
import { toast } from "react-toastify";

export default function FinanceList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const totalPaid = orderPaymentRows.reduce((sum, r) => sum + r.paid, 0);
  const totalUnpaid = orderPaymentRows.filter(r => r.paid === 0).reduce((sum, r) => sum + r.total, 0);
  const totalDue = orderPaymentRows.filter(r => r.paid > 0 && r.paid < r.total).reduce((sum, r) => sum + r.due, 0);
  const netBalance = overviewStats.netBalance;

  // Filter and paginated data for DataTable
  const filteredData = ledgerEntries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(search.toLowerCase()) ||
      entry.type.toLowerCase().includes(search.toLowerCase())
  );
  
  // DataTable usually shows recent first
  const displayData = [...filteredData].reverse();
  const totalItems = displayData.length;
  
  const paginatedData =
    itemsPerPage === -1
      ? displayData
      : displayData.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const columns = GetLedgerColumns();

  // Common CSV download utility
  const downloadCSV = (filename: string, csvData: string) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateSalesReport = () => {
    try {
      const headers = ["ID", "Date", "Type", "Description", "Debit", "Credit", "Balance"];
      const rows = ledgerEntries.map((e) => [
        e.id,
        new Date(e.date).toLocaleDateString(),
        e.type,
        `"${e.description.replace(/"/g, '""')}"`,
        e.debit,
        e.credit,
        e.balance,
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      downloadCSV("finance_sales_report.csv", csvContent);
      toast.success("Sales Report downloaded successfully!");
    } catch {
      toast.error("Failed to generate Sales Report");
    }
  };

  const handleGenerateOrdersReport = () => {
    try {
      const headers = ["Order Number", "Customer", "Date", "Total", "Paid", "Due", "Status"];
      const rows = orderPaymentRows.map((e) => [
        e.orderNumber,
        `"${e.customer.replace(/"/g, '""')}"`,
        new Date(e.date).toLocaleDateString(),
        e.total,
        e.paid,
        e.due,
        e.status,
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      downloadCSV("finance_orders_report.csv", csvContent);
      toast.success("Orders Report downloaded successfully!");
    } catch {
      toast.error("Failed to generate Orders Report");
    }
  };

  const summaryCards = [
    {
      label: "Total Paid",
      value: `৳${totalPaid.toLocaleString()}`,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-400",
      description: "Fully collected payments",
    },
    {
      label: "Total Unpaid",
      value: `৳${totalUnpaid.toLocaleString()}`,
      icon: AlertCircle,
      gradient: "from-rose-500 to-red-400",
      description: "Orders with zero payment",
    },
    {
      label: "Total Due",
      value: `৳${totalDue.toLocaleString()}`,
      icon: Clock,
      gradient: "from-amber-500 to-yellow-400",
      description: "Partial payments remaining",
    },
    {
      label: "Net Balance",
      value: `৳${netBalance.toLocaleString()}`,
      icon: Wallet,
      gradient: "from-blue-500 to-indigo-400",
      description: "Revenue minus refunds",
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Finance & Accounting
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of transactions, payments, and account balance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerateSalesReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Generate Sales Report
          </button>
          <button
            onClick={handleGenerateOrdersReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-white" />
            Generate Orders Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div
                className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-linear-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />
              <div
                className={`absolute top-4 right-4 w-9 h-9 rounded-lg bg-linear-to-br ${card.gradient} flex items-center justify-center shadow-lg z-10`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>

              <div className="relative z-10 pr-12">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {card.label}
                </p>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ledger Table Wrapper using DataTable */}
      <LedgerTable
        columns={columns}
        data={paginatedData}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        search={search}
        handleSearchChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
        showSearch={true}
      />
    </div>
  );
}
