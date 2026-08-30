import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/src/components/ui/data-table";
import {
  ColorwayFlag,
  ColorwayTextField,
  setColorwayField,
  setColorwayFlag,
  setColorwayImage,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { GetColorwayColumns } from "../TableColumns/ColorwayColumns";

export default function ColorwaysTab() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.colorway.items);
  const data = useMemo(() => Object.values(items), [items]);
  const handleToggleFlag = (code: string, field: ColorwayFlag, value: boolean) => {
    dispatch(setColorwayFlag({ code, field, value }));
  };
  const handleImageUpload = (code: string, image: string) => {
    dispatch(setColorwayImage({ code, image }));
  };
  const handleFieldChange = (code: string, field: ColorwayTextField, value: string) => {
    dispatch(setColorwayField({ code, field, value }));
  };
  const columns = useMemo(
    () => GetColorwayColumns(handleToggleFlag, handleImageUpload, handleFieldChange),
    []
  );

  return (
    <div className="w-full bg-white border border-light-dark rounded-lg overflow-hidden flex flex-col shadow-sm mt-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-light-dark bg-white">
        <Link
          href="/admin/styles/color-way"
          className="h-9 px-4 inline-flex items-center text-sm text-primary font-semibold bg-primary/5 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
        >
          Manage colorways in Color Way
        </Link>
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

      <DataTable
        columns={columns}
        data={data}
        showSearch={false}
        isShowStatus={false}
        showColumnFilters
        totalItems={data.length}
        itemsPerPage={data.length || 10}
        currentPage={1}
      />
    </div>
  );
}
