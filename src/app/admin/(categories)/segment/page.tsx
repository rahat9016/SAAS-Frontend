"use client";

import { mockSegmentsByCategory } from "@/src/components/admin/Products/data/productMockData";

export default function SegmentListPage() {
  const allSegments = Object.entries(mockSegmentsByCategory).flatMap(
    ([catKey, segments]) =>
      segments.map((seg) => ({
        ...seg,
        categoryKey: catKey,
        categoryName:
          catKey === "cat-clothes"
            ? "Clothes"
            : catKey === "cat-footwear"
            ? "Footwear"
            : "Accessories",
      }))
  );

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segment List</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage product segments (3rd Tier: Parent Category &gt; Category &gt; <strong>Segment</strong> &gt; Sub Category)
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
              <th className="py-3 px-4">Segment ID</th>
              <th className="py-3 px-4">Segment Name</th>
              <th className="py-3 px-4">Parent Category</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {allSegments.map((item) => (
              <tr
                key={item.value}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 font-mono text-xs text-gray-500">
                  {item.value}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900">
                  {item.label}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {item.categoryName}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
