export interface ISize {
  id: string;
  name: string;
  code: string; // SKU-style size code, e.g. X212
  description?: string;
  sortOrder?: number;
  unit?: "in" | "cm" | string;
  chest?: number;
  waist?: number;
  hip?: number;
  length?: number;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt: string;
  actions?: string;
}

export const mockSizesList: ISize[] = [
  {
    id: "small",
    name: "Small",
    code: "X110",
    description: "Fits chest 34-36 in",
    sortOrder: 1,
    unit: "in",
    chest: 35,
    waist: 29,
    hip: 37,
    length: 26,
    status: "ACTIVE",
    createdAt: "2026-01-05",
  },
  {
    id: "medium",
    name: "Medium",
    code: "X111",
    description: "Fits chest 38-40 in",
    sortOrder: 2,
    unit: "in",
    chest: 39,
    waist: 33,
    hip: 41,
    length: 27,
    status: "ACTIVE",
    createdAt: "2026-01-05",
  },
  {
    id: "large",
    name: "Large",
    code: "X112",
    description: "Fits chest 42-44 in",
    sortOrder: 3,
    unit: "in",
    chest: 43,
    waist: 37,
    hip: 45,
    length: 28,
    status: "ACTIVE",
    createdAt: "2026-01-06",
  },
  {
    id: "extra-large",
    name: "Extra Large",
    code: "X212",
    description: "Fits chest 46-48 in",
    sortOrder: 4,
    unit: "in",
    chest: 47,
    waist: 41,
    hip: 49,
    length: 29,
    status: "ACTIVE",
    createdAt: "2026-01-06",
  },
  {
    id: "double-extra-large",
    name: "Double Extra Large",
    code: "X213",
    description: "Fits chest 50-52 in",
    sortOrder: 5,
    unit: "in",
    chest: 51,
    waist: 45,
    hip: 53,
    length: 30,
    status: "INACTIVE",
    createdAt: "2026-01-07",
  },
];
