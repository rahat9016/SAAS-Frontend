"use client";

import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { designSchema } from "../Schema/designSchema";
import { DesignFormValues } from "@/src/types/plm/productLifecycleTypes";
import DesignForm from "./DesignForm";

export default function CreateDesign() {
  const router = useRouter();

  // Fetch branches from DB instead of using mock Redux state
  const { data: branchesData } = useGet<any>("/api/plm/branch", ["branches"]);
  const branches = branchesData?.data || [];

  const methods = useForm<DesignFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(designSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      images: [],
      branchId: "",
    },
  });

  // Reset form once branches load
  useEffect(() => {
    if (branches.length > 0) {
      methods.reset({
        name: "",
        description: "",
        category: "",
        images: [],
        branchId: branches[0].id,
      });
    }
  }, [branches, methods]);

  // React Query post mutation for creating design
  const { mutate: createMutate } = usePost(
    "/api/plm/design",
    () => {
      toast.success("Design created successfully!");
      router.push("/admin/plm/designs");
    },
    [["designs"]]
  );

  const onSubmit = (values: DesignFormValues) => {
    createMutate(values as any);
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
