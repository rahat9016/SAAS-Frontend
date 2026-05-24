"use client";

import { useFormContext } from "react-hook-form";
import { DesignFormValues } from "@/src/types/plm/productLifecycleTypes";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { DESIGN_CATEGORIES } from "@/src/constants/plm/plmConstants";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface DesignFormProps {
  onSubmit: (data: DesignFormValues) => void;
  isPending?: boolean;
  mode?: "create" | "edit";
}

export default function DesignForm({
  onSubmit,
  isPending = false,
  mode = "create",
}: DesignFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<DesignFormValues>();

  const branches = useAppSelector((state) => state.plm.branches);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Design Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Design Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="md:col-span-2">
            <Label
              htmlFor="design-name"
              className="text-sm font-medium text-gray-700 mb-1.5 block"
            >
              Design Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="design-name"
              {...register("name")}
              placeholder="e.g. Summer Floral Collection"
              className="h-11"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label
              htmlFor="design-category"
              className="text-sm font-medium text-gray-700 mb-1.5 block"
            >
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              id="design-category"
              {...register("category")}
              className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select category</option>
              {DESIGN_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Branch */}
          <div>
            <Label
              htmlFor="design-branch"
              className="text-sm font-medium text-gray-700 mb-1.5 block"
            >
              Branch <span className="text-red-500">*</span>
            </Label>
            <select
              id="design-branch"
              {...register("branchId")}
              className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.branchId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.branchId.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label
              htmlFor="design-description"
              className="text-sm font-medium text-gray-700 mb-1.5 block"
            >
              Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="design-description"
              {...register("description")}
              rows={5}
              placeholder="Describe the design concept, materials, target audience..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end">
        <SubmitButton
          isLoading={isPending}
          label={mode === "edit" ? "Update Design" : "Create Design"}
        />
      </div>
    </form>
  );
}
