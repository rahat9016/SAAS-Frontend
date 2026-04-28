import { StatusType } from "@/src/types/common/common";
import * as Yup from "yup";

export const attributeSchema = Yup.object({
  name: Yup.string().required("Attribute name is required"),
  description: Yup.string().optional().default(""),
  status: Yup.string()
    .oneOf([StatusType.ACTIVE, StatusType.INACTIVE])
    .required(),
});

export type AttributeFormValues = Yup.InferType<typeof attributeSchema>;

export const attributeValueSchema = Yup.object({
  attributeId: Yup.string().required("Attribute is required"),
  value: Yup.string().required("Attribute value is required"),
  description: Yup.string().optional().default(""),
  status: Yup.string()
    .oneOf([StatusType.ACTIVE, StatusType.INACTIVE])
    .required(),
});

export type AttributeValueFormValues = Yup.InferType<
  typeof attributeValueSchema
>;
