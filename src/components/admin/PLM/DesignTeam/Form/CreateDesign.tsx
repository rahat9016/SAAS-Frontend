"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { addDesign } from "@/src/lib/redux/features/plm/plmSlice";
import { designSchema } from "../Schema/designSchema";
import {
  DesignFormValues,
  ProductStatus,
} from "@/src/types/plm/productLifecycleTypes";
import DesignForm from "./DesignForm";

export default function CreateDesign() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const branches = useAppSelector((state) => state.plm.branches);

  const methods = useForm<DesignFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(designSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      images: [],
      branchId: branches[0]?.id || "",
    },
  });

  const onSubmit = (values: DesignFormValues) => {
    const branch = branches.find((b) => b.id === values.branchId);
    const newDesign = {
      id: `design-${Date.now()}`,
      name: values.name,
      description: values.description,
      category: values.category,
      images: values.images,
      designerId: "user-d01",
      designerName: "Current User",
      branchId: values.branchId,
      branchName: branch?.name || "Unknown Branch",
      status: ProductStatus.CONCEPT,
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          fromStatus: null,
          toStatus: ProductStatus.CONCEPT,
          changedBy: "Current User",
          changedByRole: "DESIGN_TEAM" as const,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addDesign(newDesign));
    toast.success("Design created successfully!");
    router.push("/admin/plm/designs");
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Create Design</h1>
        <p className="text-sm text-gray-400 mt-1">
          Submit a new product design for review
        </p>
      </div>
      <FormProvider {...methods}>
        <DesignForm onSubmit={onSubmit} />
      </FormProvider>
    </div>
  );
}
