"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { careerSchema, CareerSchemaForm } from "../Schema/careerSchema";
import CareerForm from "./CareerForm";

export default function CreateUpdateCareer({
  initialValues,
}: {
  initialValues?: never;
}) {
  const methods = useForm({
    resolver: yupResolver(careerSchema),
    defaultValues: {
      image: "",
      title: "",
      description: "",
      status: false,
    },
  });

  // useEffect(() => {
  //   if (initialValues) {
  //     methods.reset({
  //       ...initialValues,
  //       status: Boolean(initialValues.status),
  //       description: initialValues.description,
  //     });
  //   }
  // }, [initialValues, methods]);

  const onSubmit = (data: CareerSchemaForm) => {
    // const { ...payload } = data;
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
      <CareerForm isEditMode={!!initialValues} onSubmit={onSubmit} />
    </FormProvider>
  );
}
