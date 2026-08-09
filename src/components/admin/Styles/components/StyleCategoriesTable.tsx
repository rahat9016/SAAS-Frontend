"use client";

import Link from "next/link";
import { mockCategoryStylesList } from "../data/mockStyleData";

interface StyleCategoriesTableProps {
  seasonId: string;
  departmentId: string;
}

const seasonNames: Record<string, string> = {
  "0000-dummy": "0000 Dummy",
  "786-summer": "786 NOOS/Summer",
  "786-winter": "786 NOOS/Winter",
  "2027-main": "2027 Main Collection",
  "2028-main": "2028 Main Collection",
};

const deptNames: Record<string, string> = {
  women: "Women",
  men: "Men",
  kids: "Kids",
  home: "Home",
  specials: "Specials",
  gifts: "Gifts",
};

export default function StyleCategoriesTable({
  seasonId,
  departmentId,
}: StyleCategoriesTableProps) {
  const seasonName = seasonNames[seasonId] || "2027 Main Collection";
  const deptName = deptNames[departmentId] || "Men";

  return (
    <div className="w-full space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 font-medium">
        <Link href="/admin/styles" className="hover:underline">Style</Link> &gt;{" "}
        <Link href={`/admin/styles/${seasonId}`} className="hover:underline">{seasonName}</Link> &gt;{" "}
        <span className="text-gray-900">{deptName}</span>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
        <div className="overflow-x-auto border border-blue-300 rounded-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#5097d5] text-white font-bold">
                <th className="py-3 px-4 border-r border-blue-300 w-1/4">Category</th>
                <th className="py-3 px-4 border-r border-blue-300 w-1/6">Number of Styles</th>
                <th className="py-3 px-4 border-r border-blue-300 w-1/6">Number of Colorways</th>
                <th className="py-3 px-4 border-r border-blue-300 w-1/4">Season</th>
                <th className="py-3 px-4 w-1/6">Department</th>
              </tr>
            </thead>
            <tbody>
              {/* All ▼ Row */}
              <tr className="bg-[#dbeeff] font-bold text-gray-900 border-b border-blue-200">
                <td className="py-2.5 px-4 border-r border-blue-200">All ▼</td>
                <td className="py-2.5 px-4 border-r border-blue-200"></td>
                <td className="py-2.5 px-4 border-r border-blue-200"></td>
                <td className="py-2.5 px-4 border-r border-blue-200"></td>
                <td className="py-2.5 px-4"></td>
              </tr>

              {mockCategoryStylesList.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-blue-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="py-2.5 px-4 border-r border-blue-200 font-bold text-gray-900">
                    <Link
                      href={`/admin/styles/${seasonId}/${departmentId}/${item.id}`}
                      className="text-blue-700 hover:underline block"
                    >
                      {item.category}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 border-r border-blue-200 font-semibold text-gray-800">
                    {item.numberOfStyles}
                  </td>
                  <td className="py-2.5 px-4 border-r border-blue-200 font-semibold text-gray-800">
                    {item.numberOfColorways}
                  </td>
                  <td className="py-2.5 px-4 border-r border-blue-200 text-gray-700">
                    {seasonName}
                  </td>
                  <td className="py-2.5 px-4 text-gray-700">
                    {item.department || deptName}
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
