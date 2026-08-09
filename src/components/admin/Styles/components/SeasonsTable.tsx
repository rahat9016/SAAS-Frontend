"use client";

import Link from "next/link";
import { mockSeasonsList } from "../data/mockStyleData";
import StyleTabHeader from "./StyleTabHeader";

export default function SeasonsTable() {
  return (
    <div className="w-full space-y-4">
      <StyleTabHeader activeTab="Style" />

      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Seasons</h2>

        <div className="overflow-x-auto border border-black rounded-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black font-bold text-black bg-gray-50">
                <th className="py-3 px-4 border-r border-black w-1/2">Season</th>
                <th className="py-3 px-4 border-r border-black w-1/4">Number of Styles</th>
                <th className="py-3 px-4 w-1/4">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockSeasonsList.map((item, idx) => {
                const isAll = item.id === "all";
                return (
                  <tr
                    key={item.id || idx}
                    className={`border-b border-black transition-colors ${
                      isAll ? "bg-[#e8ebff]" : "hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    <td className="py-2.5 px-4 border-r border-black font-medium">
                      {isAll ? (
                        <span>{item.season}</span>
                      ) : (
                        <Link
                          href={`/admin/styles/${item.id}`}
                          className="text-blue-700 hover:underline block w-full"
                        >
                          {item.season}
                        </Link>
                      )}
                    </td>
                    <td className="py-2.5 px-4 border-r border-black">
                      {isAll ? "" : item.numberOfStyles}
                    </td>
                    <td className="py-2.5 px-4">
                      {isAll ? (
                        ""
                      ) : (
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${
                            item.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "On Process"
                              ? "bg-amber-100 text-amber-800"
                              : item.status === "On Concept"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* Empty rows to match spreadsheet-like mockup in Image 1 */}
              {[1, 2, 3].map((n) => (
                <tr key={`empty-${n}`} className="border-b border-black h-9">
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
