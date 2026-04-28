import { StatusType } from "@/src/types/common/common";
import { AttributeFormValues, AttributeValueFormValues } from "./Schema";
import { IAttribute, IAttributeValue } from "./types";

/**
 * Get default values for Attribute form
 * @param initialValues - Initial values when updating
 * @returns Default form values
 */
export const getAttributeDefaultValues = (
  initialValues?: IAttribute
): AttributeFormValues => {
  if (!initialValues) {
    return {
      name: "",
      description: "",
      status: StatusType.ACTIVE,
    };
  }

  return {
    name: initialValues.name || "",
    description: initialValues.description || "",
    status:
      String(initialValues.status || StatusType.ACTIVE).toUpperCase() ===
      StatusType.INACTIVE
        ? StatusType.INACTIVE
        : StatusType.ACTIVE,
  };
};

/**
 * Get default values for Attribute Value form
 * @param initialValues - Initial values when updating
 * @returns Default form values
 */
export const getAttributeValueDefaultValues = (
  initialValues?: IAttributeValue
): AttributeValueFormValues => {
  if (!initialValues) {
    return {
      attributeId: "",
      value: "",
      description: "",
      status: StatusType.ACTIVE,
    };
  }

  return {
    attributeId: initialValues.attribute?.id || "",
    value: initialValues.value || "",
    description: initialValues.description || "",
    status:
      initialValues.status === StatusType.INACTIVE
        ? StatusType.INACTIVE
        : StatusType.ACTIVE,
  };
};
