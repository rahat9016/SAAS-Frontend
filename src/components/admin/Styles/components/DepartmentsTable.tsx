"use client";

import { ColumnDef, DataTable } from "@/src/components/ui/data-table";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { IDepartmentItem, mockDepartmentsList } from "../data/mockStyleData";

interface DepartmentsTableProps {
  seasonId: string;
}

export default function DepartmentsTable({ seasonId }: DepartmentsTableProps) {
  const columns: ColumnDef<IDepartmentItem>[] = [
    {
      header: "Department",
      accessorKey: "department",
      cell: (value, row) => (
        <Link
          href={`/admin/styles/${seasonId}/${row.id}`}
          className="font-semibold text-primary hover:underline"
        >
          {value as string}
        </Link>
      ),
    },
    {
      header: "Number of Styles",
      accessorKey: "numberOfStyles",
      align: "center",
      cell: (value) => (
        <span className="font-semibold text-secondary-dark">
          {value as number}
        </span>
      ),
    },
    {
      header: "Number of Colorways",
      accessorKey: "numberOfColorways",
      align: "center",
      cell: (value) => (
        <span className="font-semibold text-secondary-dark">
          {value as number}
        </span>
      ),
    },
    {
      header: "Categories",
      accessorKey: "categories",
      wrap: true,
      cell: (value) => (
        <span className="text-xs leading-relaxed text-secondary-gary">
          {(value as string[]).join(", ")}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={mockDepartmentsList}
      title="Departments"
      icon={<LayoutGrid />}
      totalItems={mockDepartmentsList.length}
      itemsPerPage={mockDepartmentsList.length || 10}
      currentPage={1}
      showSearch={false}
      isShowStatus={false}
    />
  );
}
