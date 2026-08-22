import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";

interface ColorwayData {
  id: string;
  name: string;
  colorway: string;
  spec: string;
  description: string;
  standard: string;
  pantone: string;
  colorHex: string;
  active: boolean;
  inTheme: boolean;
  sustLabelOff: boolean;
  planSms: boolean;
  plan3dSms: boolean;
  actualSms: boolean;
  startDate: string;
  endDate: string;
  clearanceDate: string;
}

const mockColorways: ColorwayData[] = [
  {
    id: "1",
    name: "yellow",
    colorway: "1015",
    spec: "1015",
    description: "",
    standard: "Pantone",
    pantone: "PANTONE® 11-0616 TCX Pastel Yellow",
    colorHex: "#f3e5ab", // rough pastel yellow
    active: true,
    inTheme: true,
    sustLabelOff: false,
    planSms: true,
    plan3dSms: false,
    actualSms: false,
    startDate: "",
    endDate: "",
    clearanceDate: "",
  },
  {
    id: "2",
    name: "light blue",
    colorway: "5027",
    spec: "5027",
    description: "",
    standard: "Pantone",
    pantone: "PANTONE® 14-4211 TCX Niagara Mist",
    colorHex: "#9dafb9",
    active: false,
    inTheme: true,
    sustLabelOff: false,
    planSms: false,
    plan3dSms: false,
    actualSms: false,
    startDate: "",
    endDate: "",
    clearanceDate: "",
  },
  {
    id: "3",
    name: "blue",
    colorway: "5525",
    spec: "5525",
    description: "",
    standard: "Pantone",
    pantone: "PANTONE® 19-4035 TCX Dark Blue",
    colorHex: "#2b4f6b",
    active: true,
    inTheme: true,
    sustLabelOff: false,
    planSms: false,
    plan3dSms: false,
    actualSms: false,
    startDate: "",
    endDate: "",
    clearanceDate: "",
  },
  {
    id: "4",
    name: "navy",
    colorway: "5978",
    spec: "5978",
    description: "",
    standard: "Pantone",
    pantone: "PANTONE® 19-4020 TCX Dark Sapphire",
    colorHex: "#1c2536",
    active: false,
    inTheme: true,
    sustLabelOff: false,
    planSms: false,
    plan3dSms: false,
    actualSms: false,
    startDate: "",
    endDate: "",
    clearanceDate: "",
  },
  {
    id: "5",
    name: "beige",
    colorway: "8148",
    spec: "8148",
    description: "",
    standard: "Pantone",
    pantone: "PANTONE® 15-1305 TCX Feather Grey",
    colorHex: "#a79c93",
    active: true,
    inTheme: true,
    sustLabelOff: false,
    planSms: false,
    plan3dSms: false,
    actualSms: false,
    startDate: "",
    endDate: "",
    clearanceDate: "",
  },
  {
    id: "6",
    name: "dark brown",
    colorway: "8941",
    spec: "8941",
    description: "",
    standard: "Pantone",
    pantone: "PANTONE® 19-1314 TCX Seal",
    colorHex: "#483c32",
    active: true,
    inTheme: true,
    sustLabelOff: false,
    planSms: true,
    plan3dSms: false,
    actualSms: false,
    startDate: "",
    endDate: "",
    clearanceDate: "",
  },
];

export default function ColorwaysTab() {
  const [data, setData] = useState(mockColorways);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm mt-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-3 text-xs font-semibold rounded-l rounded-r-none border-r border-blue-700">
            <Plus className="w-3 h-3 mr-1" />
            New Colorway
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 rounded-l-none rounded-r">
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs text-gray-700 font-semibold border-gray-300">
            Mass Create SKUs
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs text-gray-700 font-semibold border-gray-300 flex items-center">
            Actions <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-gray-800 font-bold text-xs">
              <th className="p-2 border-r border-gray-200 align-top">Color Marketing<br/>Name</th>
              <th className="p-2 border-r border-gray-200 align-top flex items-center justify-between">Colorway <span className="text-[10px] text-gray-400">↕</span></th>
              <th className="p-2 border-r border-gray-200 align-top">Color<br/>Specification</th>
              <th className="p-2 border-r border-gray-200 align-top">Description</th>
              <th className="p-2 border-r border-gray-200 align-top">Color<br/>Standard</th>
              <th className="p-2 border-r border-gray-200 align-top">Pantone</th>
              <th className="p-2 border-r border-gray-200 align-top">Image</th>
              <th className="p-2 border-r border-gray-200 align-top text-center">Active</th>
              <th className="p-2 border-r border-gray-200 align-top text-center">In<br/>Theme</th>
              <th className="p-2 border-r border-gray-200 align-top text-center">Sust<br/>Label<br/>Off</th>
              <th className="p-2 border-r border-gray-200 align-top text-center">Plan<br/>SMS</th>
              <th className="p-2 border-r border-gray-200 align-top text-center">Plan<br/>3D<br/>SMS</th>
              <th className="p-2 border-r border-gray-200 align-top text-center">Actual<br/>SMS</th>
              <th className="p-2 border-r border-gray-200 align-top">Color<br/>Start<br/>Date</th>
              <th className="p-2 border-r border-gray-200 align-top">Color<br/>End<br/>Date</th>
              <th className="p-2 align-top">Stock<br/>Clearence<br/>Date</th>
            </tr>
            {/* Filter Row */}
            <tr className="bg-white border-b border-gray-200 text-gray-700 font-medium text-[11px]">
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"></td>
              <td className="p-1 border-r border-gray-200 text-center"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"></td>
              <td className="p-1 border-r border-gray-200 text-center"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200 text-center"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200 text-center"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200 text-center"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1 border-r border-gray-200"><span className="px-1">All</span></td>
              <td className="p-1"><span className="px-1">All</span></td>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-2 border-r border-gray-200 text-gray-700">{row.name}</td>
                <td className="p-2 border-r border-gray-200 text-blue-500">{row.colorway}</td>
                <td className="p-2 border-r border-gray-200 text-blue-500">{row.spec}</td>
                <td className="p-2 border-r border-gray-200 text-gray-700">{row.description}</td>
                <td className="p-2 border-r border-gray-200 text-gray-700">{row.standard}</td>
                <td className="p-2 border-r border-gray-200 text-gray-700 whitespace-pre-wrap leading-tight">{row.pantone.replace(" TCX", "\nTCX")}</td>
                <td className="p-2 border-r border-gray-200 text-center">
                  <div className="w-8 h-8 mx-auto" style={{ backgroundColor: row.colorHex }} />
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-middle">
                  <input type="checkbox" className="w-3 h-3 text-blue-600 rounded border-gray-300" checked={row.active} readOnly />
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-middle">
                  <input type="checkbox" className="w-3 h-3 text-blue-600 rounded border-gray-300" checked={row.inTheme} readOnly />
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-middle">
                  <input type="checkbox" className="w-3 h-3 text-blue-600 rounded border-gray-300" checked={row.sustLabelOff} readOnly />
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-middle">
                  <input type="checkbox" className="w-3 h-3 text-blue-600 rounded border-gray-300" checked={row.planSms} readOnly />
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-middle">
                  <input type="checkbox" className="w-3 h-3 text-blue-600 rounded border-gray-300" checked={row.plan3dSms} readOnly />
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-middle">
                  <input type="checkbox" className="w-3 h-3 text-blue-600 rounded border-gray-300" checked={row.actualSms} readOnly />
                </td>
                <td className="p-2 border-r border-gray-200 text-gray-700">{row.startDate}</td>
                <td className="p-2 border-r border-gray-200 text-gray-700">{row.endDate}</td>
                <td className="p-2 text-gray-700">{row.clearanceDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-500">
        Displaying {data.length} results
      </div>
    </div>
  );
}
