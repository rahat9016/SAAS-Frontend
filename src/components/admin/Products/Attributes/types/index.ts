import { ITableProps, StatusType } from "@/src/types/common/common";
import { ReactNode } from "react";

export interface IAttribute {
  id: string;
  name: string;
  description?: string;
  status?: StatusType;
  createdAt?: string;
  updatedAt?: string;
  actions?: string;
}

export interface IAttributeValue {
  id: string;
  value: string;
  attribute: IAttribute;
  description?: string;
  status: StatusType | string | StatusType.ACTIVE | StatusType.INACTIVE;
  createdAt: string;
  updatedAt: string;
  actions?: string;
}

export interface AttributesTableProps<T> extends ITableProps<T> {
  rightComponents?: ReactNode;
  title?: string;
  searchPlaceholder?: string;
  isShowStatus?: boolean;
  tabs?: {
    name: string;
    route?: string;
  }[];
}
