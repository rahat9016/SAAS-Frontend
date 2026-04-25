import { ErrorType } from "@/src/types/common/common";
import { AddressFormValues } from "../Schema/addressSchema";


export enum AddressType {
  HOME = "HOME",
  OFFICE = "OFFICE",
  SHIPPING = "SHIPPING",
  BILLING = "BILLING",
}

export type IAddressType = typeof AddressType[keyof typeof AddressType];

export interface IAddress {
  id?: string;
  _id?: string;
  userId?: string;
  fullName: string;
  phone: string;
  addressType: IAddressType;
  country: string;
  city: string;
  region?: string;
  area?: string;
  addressLine1: string;
  addressLine2?: string;
  zipCode?: string;
  company?: string;
  isDefault: boolean;
}

export interface IAddressFormProps {
  isEditMode?: boolean;
  onSubmit: (data: AddressFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: ErrorType;
}

export interface ICreateUpdateAddressProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: IAddress;
  userId?: string;
}
