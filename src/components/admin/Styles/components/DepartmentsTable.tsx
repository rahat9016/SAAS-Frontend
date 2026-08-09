"use client";

import Link from "next/link";
import { mockDepartmentsList } from "../data/mockStyleData";

interface DepartmentsTableProps {
  seasonId: string;
}

const seasonNames: Record<string, string> = {
  "0000-dummy": "0000 Dummy",
  "786-summer": "786 NOOS/Summer",
  "786-winter": "786 NOOS/Winter",
  "2027-main": "2027 Main Collection",
  "2028-main": "2028 Main Collection",
};

export default function DepartmentsTable({ seasonId }: DepartmentsTableProps) {
  const seasonName = seasonNames[seasonId] || "2027 Main Collection";

  return (
    <div className="w-full space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 font-medium">
        <Link href="/admin/styles" className="hover:underline">Style</Link> &gt;{" "}
        <span className="text-gray-900">{seasonName}</span>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Departments</h2>

        <div className="overflow-x-auto border-2 border-orange-400 rounded-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-orange-400 font-bold text-black bg-orange-50/30">
                <th className="py-2.5 px-3 border-r-2 border-orange-400 w-1/6">Department</th>
                <th className="py-2.5 px-3 border-r-2 border-orange-400 w-1/12 text-center">Number of Styles</th>
                <th className="py-2.5 px-3 border-r-2 border-orange-400 w-1/12 text-center">Number of Colorways</th>
                <th className="py-2.5 px-3 w-2/3">Categories</th>
              </tr>
            </thead>
            <tbody>
              {/* Row "All ▼" */}
              <tr className="border-b-2 border-orange-400 bg-[#e3f6ff] font-semibold">
                <td className="py-2 px-3 border-r-2 border-orange-400 text-black">
                  All ▼
                </td>
                <td className="py-2 px-3 border-r-2 border-orange-400"></td>
                <td className="py-2 px-3 border-r-2 border-orange-400"></td>
                <td className="py-2 px-3"></td>
              </tr>

              {mockDepartmentsList.map((item) => (
                <tr
                  key={item.id}
                  className="border-b-2 border-orange-400 hover:bg-orange-50/20 transition-colors"
                >
                  <td className="py-3 px-3 border-r-2 border-orange-400 font-bold text-gray-900 align-top">
                    <Link
                      href={`/admin/styles/${seasonId}/${item.id}`}
                      className="text-blue-700 hover:underline block"
                    >
                      {item.department}
                    </Link>
                  </td>
                  <td className="py-3 px-3 border-r-2 border-orange-400 font-bold text-gray-900 text-center align-top">
                    {item.numberOfStyles}
                  </td>
                  <td className="py-3 px-3 border-r-2 border-orange-400 font-bold text-gray-900 text-center align-top">
                    {item.numberOfColorways}
                  </td>
                  <td className="py-3 px-3 text-gray-700 text-xs leading-relaxed align-top">
                    {item.categories.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
