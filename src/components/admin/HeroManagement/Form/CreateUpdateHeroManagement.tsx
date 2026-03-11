"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { useEffect } from "react";
import {
  heroManagementSchema,
  HeroManagementSchemaForm,
} from "../Schema/heroManagementSchema";
import { IHeroManagement } from "../types";
import HeroManagementForm from "./HeroManagementForm";

export default function CreateUpdateHeroManagement({
  initialValues,
}: {
  initialValues?: IHeroManagement;
}) {
  const methods = useForm({
    resolver: yupResolver(heroManagementSchema),
    defaultValues: {
      images: [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      methods.reset({
        title: initialValues.title || "",
        description: initialValues.description || "",
        images: initialValues.images || [],
      });
    }
  }, [initialValues, methods]);

  const onSubmit = (data: HeroManagementSchemaForm) => {
    console.log(data);
    if (initialValues) {
      // PATCH
    } else {
      // POST
      methods.reset();
    }
  };

  return (
    <FormProvider {...methods}>
      <HeroManagementForm isEditMode={!!initialValues} onSubmit={onSubmit} />
    </FormProvider>
  );
}
