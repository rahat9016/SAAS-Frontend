"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { createColorway } from "@/src/lib/redux/features/colorway/colorwaySlice";
import CreateColorway from "@/src/components/admin/Styles/Form/CreateColorway";
import { ColorwayFormValues } from "@/src/components/admin/Styles/Schema/colorwaySchema";

const columnClass = "p-3 border-r border-light-dark align-top";
const headerCellClass =
  "p-3 border-r border-white/30 align-top font-semibold text-white uppercase tracking-wide";

export default function StyleColorWayPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.colorway.items);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useMemo(
    () =>
      Object.values(items).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [items]
  );

  const handleCreateColorway = (values: ColorwayFormValues) => {
    const action = dispatch(
      createColorway({
        name: values.name,
        colorway: values.colorway,
        spec: values.spec ?? "",
        description: values.description ?? "",
        standard: values.standard,
        pantone: values.pantone ?? "",
        colorHex: values.colorHex,
        active: !!values.active,
        inTheme: !!values.inTheme,
        sustLabelOff: !!values.sustLabelOff,
        planSms: !!values.planSms,
        plan3dSms: !!values.plan3dSms,
        actualSms: !!values.actualSms,
        startDate: values.startDate ?? "",
        endDate: values.endDate ?? "",
        clearanceDate: values.clearanceDate ?? "",
      })
    );
    setIsModalOpen(false);
    toast.success(`Colorway ${action.payload.code} created`);
  };

  return (
    <div className="w-full bg-white border border-light-dark rounded-lg overflow-hidden flex flex-col shadow-sm">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-light-dark bg-white">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
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
              <th className={headerCellClass}>Color Marketing<br />Name</th>
              <th className={headerCellClass}>
                <span className="flex items-center gap-1">Colorway <span className="text-[10px] opacity-70">↕</span></span>
              </th>
              <th className={headerCellClass}>Color<br />Specification</th>
              <th className={headerCellClass}>Description</th>
              <th className={headerCellClass}>Color<br />Standard</th>
              <th className={headerCellClass}>Pantone</th>
              <th className={headerCellClass}>Image</th>
              <th className={`${headerCellClass} text-center`}>Active</th>
              <th className={`${headerCellClass} text-center`}>In<br />Theme</th>
              <th className={`${headerCellClass} text-center`}>Sust<br />Label<br />Off</th>
              <th className={`${headerCellClass} text-center`}>Plan<br />SMS</th>
              <th className={`${headerCellClass} text-center`}>Plan<br />3D<br />SMS</th>
              <th className={`${headerCellClass} text-center`}>Actual<br />SMS</th>
              <th className={headerCellClass}>Color<br />Start<br />Date</th>
              <th className={headerCellClass}>Color<br />End<br />Date</th>
              <th className="p-3 font-semibold text-white uppercase tracking-wide">Stock<br />Clearance<br />Date</th>
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
              <tr key={row.code} className="border-b border-light-dark even:bg-light/30 hover:bg-primary/5 transition-colors">
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

      <CreateColorway
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateColorway}
      />
    </div>
  );
}
