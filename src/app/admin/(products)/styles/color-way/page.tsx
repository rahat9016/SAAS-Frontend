"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { DataTable } from "@/src/components/ui/data-table";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import {
  ColorwayFlag,
  ColorwayTextField,
  createColorway,
  setColorwayField,
  setColorwayFlag,
  setColorwayImage,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import CreateColorway from "@/src/components/admin/Styles/Form/CreateColorway";
import { ColorwayFormValues } from "@/src/components/admin/Styles/Schema/colorwaySchema";
import { GetColorwayColumns } from "@/src/components/admin/Styles/TableColumns/ColorwayColumns";

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
        active: false,
        inTheme: false,
        sustLabelOff: false,
        planSms: false,
        plan3dSms: false,
        actualSms: false,
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

      <CreateColorway
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateColorway}
      />
    </div>
  );
}
