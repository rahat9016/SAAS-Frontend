import { useState } from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
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
    colorHex: "#f3e5ab",
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

const columnClass = "p-3 border-r border-light-dark align-top";
const headerCellClass =
  "p-3 border-r border-white/30 align-top font-semibold text-white uppercase tracking-wide";

export default function ColorwaysTab() {
  const [data] = useState(mockColorways);

  return (
    <div className="w-full bg-white border border-light-dark rounded-lg overflow-hidden flex flex-col shadow-sm mt-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-light-dark bg-white">
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center gap-1.5 h-9 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-l-lg border-r border-white/30 transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            New Colorway
          </button>
          <button
            type="button"
            className="flex items-center h-9 px-2 bg-primary hover:bg-primary/90 text-white rounded-r-lg transition-colors cursor-pointer"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 px-4 text-sm text-secondary-dark font-medium bg-white border border-light-dark rounded-lg hover:bg-light-dark/40 transition-colors cursor-pointer"
          >
            Mass Create SKUs
          </button>
          <button
            type="button"
            className="flex items-center gap-1 h-9 px-4 text-sm text-secondary-dark font-medium bg-white border border-light-dark rounded-lg hover:bg-light-dark/40 transition-colors cursor-pointer"
          >
            Actions <ChevronDown className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-xs text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-[#5098D5]">
              <th className={headerCellClass}>Color Marketing<br/>Name</th>
              <th className={headerCellClass}>
                <span className="flex items-center gap-1">Colorway <span className="text-[10px] opacity-70">↕</span></span>
              </th>
              <th className={headerCellClass}>Color<br/>Specification</th>
              <th className={headerCellClass}>Description</th>
              <th className={headerCellClass}>Color<br/>Standard</th>
              <th className={headerCellClass}>Pantone</th>
              <th className={headerCellClass}>Image</th>
              <th className={`${headerCellClass} text-center`}>Active</th>
              <th className={`${headerCellClass} text-center`}>In<br/>Theme</th>
              <th className={`${headerCellClass} text-center`}>Sust<br/>Label<br/>Off</th>
              <th className={`${headerCellClass} text-center`}>Plan<br/>SMS</th>
              <th className={`${headerCellClass} text-center`}>Plan<br/>3D<br/>SMS</th>
              <th className={`${headerCellClass} text-center`}>Actual<br/>SMS</th>
              <th className={headerCellClass}>Color<br/>Start<br/>Date</th>
              <th className={headerCellClass}>Color<br/>End<br/>Date</th>
              <th className="p-3 font-semibold text-white uppercase tracking-wide">Stock<br/>Clearance<br/>Date</th>
            </tr>
            {/* Filter Row */}
            <tr className="bg-primary/5 border-b border-light-dark text-secondary-gary font-medium">
              <td className={columnClass}>All</td>
              <td className={columnClass}>All</td>
              <td className={columnClass}>All</td>
              <td className={columnClass}>All</td>
              <td className={columnClass}>All</td>
              <td className={columnClass}>All</td>
              <td className={columnClass}></td>
              <td className={`${columnClass} text-center`}>All</td>
              <td className={columnClass}></td>
              <td className={`${columnClass} text-center`}>All</td>
              <td className={`${columnClass} text-center`}>All</td>
              <td className={`${columnClass} text-center`}>All</td>
              <td className={`${columnClass} text-center`}>All</td>
              <td className={columnClass}>All</td>
              <td className={columnClass}>All</td>
              <td className="p-3">All</td>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row) => (
              <tr key={row.id} className="border-b border-light-dark even:bg-light/30 hover:bg-primary/5 transition-colors">
                <td className={`${columnClass} text-secondary-dark`}>{row.name}</td>
                <td className={`${columnClass} text-primary font-medium`}>{row.colorway}</td>
                <td className={`${columnClass} text-primary font-medium`}>{row.spec}</td>
                <td className={`${columnClass} text-secondary-gary`}>{row.description}</td>
                <td className={`${columnClass} text-secondary-gary`}>{row.standard}</td>
                <td className={`${columnClass} text-secondary-gary whitespace-pre-wrap leading-tight`}>{row.pantone.replace(" TCX", "\nTCX")}</td>
                <td className={`${columnClass} text-center`}>
                  <div className="w-8 h-8 mx-auto rounded border border-light-dark" style={{ backgroundColor: row.colorHex }} />
                </td>
                <td className={`${columnClass} text-center align-middle`}>
                  <Checkbox checked={row.active} disabled className="mx-auto" />
                </td>
                <td className={`${columnClass} text-center align-middle`}>
                  <Checkbox checked={row.inTheme} disabled className="mx-auto" />
                </td>
                <td className={`${columnClass} text-center align-middle`}>
                  <Checkbox checked={row.sustLabelOff} disabled className="mx-auto" />
                </td>
                <td className={`${columnClass} text-center align-middle`}>
                  <Checkbox checked={row.planSms} disabled className="mx-auto" />
                </td>
                <td className={`${columnClass} text-center align-middle`}>
                  <Checkbox checked={row.plan3dSms} disabled className="mx-auto" />
                </td>
                <td className={`${columnClass} text-center align-middle`}>
                  <Checkbox checked={row.actualSms} disabled className="mx-auto" />
                </td>
                <td className={`${columnClass} text-secondary-gary`}>{row.startDate}</td>
                <td className={`${columnClass} text-secondary-gary`}>{row.endDate}</td>
                <td className="p-3 text-secondary-gary">{row.clearanceDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-light-dark bg-light text-xs text-secondary-gary">
        Displaying {data.length} results
      </div>
    </div>
  );
}
