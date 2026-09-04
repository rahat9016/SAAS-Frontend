export interface IMaterial {
  id: string;
  materialType: string;
  materialClass: string;
  materialSubClass: string;
  material: string;
  materialDescription: string;
  isSustainable: boolean;
  createdAt: string;
}

export type MaterialFormValues = Omit<IMaterial, "id" | "createdAt">;
