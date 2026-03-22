import * as Yup from "yup";

const variantAttributeSchema = Yup.object({
  attributeId: Yup.string().required("Attribute is required"),
  attributeValueId: Yup.string().required("Attribute value is required"),
});

const variantSchema = Yup.object({
  images: Yup.array()
    .of(Yup.mixed<File | string>().required())
    .default([]),
  sellingPrice: Yup.number()
    .typeError("Price is required")
    .positive("Price must be positive")
    .required("Selling price is required"),
  discountedPrice: Yup.number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .nullable()
    .default(null),
  discountType: Yup.string()
    .oneOf(["percentage", "fixed"])
    .default("fixed"),
  stockQty: Yup.number()
    .typeError("Stock is required")
    .integer("Must be a whole number")
    .min(0, "Cannot be negative")
    .required("Stock quantity is required"),
  attributes: Yup.array()
    .of(variantAttributeSchema)
    .min(1, "At least one attribute is required")
    .required(),
});

export const productSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().default(""),
  images: Yup.array()
    .of(Yup.mixed<File | string>().required())
    .default([]),
  categoryId: Yup.string().required("Category is required"),
  subCategoryId: Yup.string().default(""),
  brandId: Yup.string().default(""),
  hasVariants: Yup.boolean().default(false),
  status: Yup.boolean().default(true),

  // visible when hasVariants === false
  basePrice: Yup.number()
    .nullable()
    .when("hasVariants", {
      is: false,
      then: (s) =>
        s
          .typeError("Base price is required")
          .positive("Price must be positive")
          .required("Base price is required"),
      otherwise: (s) => s.nullable().default(null),
    }),
  discountedPrice: Yup.number()
    .nullable()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .default(null),
  discountType: Yup.string()
    .oneOf(["percentage", "fixed"])
    .default("fixed"),
  stock: Yup.number()
    .nullable()
    .when("hasVariants", {
      is: false,
      then: (s) =>
        s
          .typeError("Stock is required")
          .integer("Must be a whole number")
          .min(0, "Cannot be negative")
          .required("Stock is required"),
      otherwise: (s) => s.nullable().default(null),
    }),

  // visible when hasVariants === true
  variants: Yup.array()
    .of(variantSchema)
    .when("hasVariants", {
      is: true,
      then: (s) => s.min(1, "Add at least one variant").required(),
      otherwise: (s) => s.default([]),
    }),
});

export type ProductSchemaValues = Yup.InferType<typeof productSchema>;
