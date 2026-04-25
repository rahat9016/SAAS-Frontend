export interface IAttribute {
  id: string;
  name: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt?: string;
  updatedAt?: string;
  actions?: string;
}

export interface IAttributeValue {
  id: string;
  attributeId?: string;
  value: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt?: string;
  updatedAt?: string;
  actions?: string;
}
