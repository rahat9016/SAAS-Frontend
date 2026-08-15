export interface IColor {
  id: string;
  name: string;
  code: string; // SKU-style color code, e.g. R102
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt: string;
  actions?: string;
}

export const mockColorsList: IColor[] = [
  {
    id: "black",
    name: "Black",
    code: "BLK01",
    description: "Classic black shade",
    status: "ACTIVE",
    createdAt: "2026-01-05",
  },
  {
    id: "white",
    name: "White",
    code: "WHT01",
    description: "Pure white shade",
    status: "ACTIVE",
    createdAt: "2026-01-05",
  },
  {
    id: "navy-blue",
    name: "Navy Blue",
    code: "NVY01",
    description: "Deep navy blue shade",
    status: "ACTIVE",
    createdAt: "2026-01-06",
  },
  {
    id: "maroon",
    name: "Maroon",
    code: "R102",
    description: "Dark reddish-brown shade",
    status: "ACTIVE",
    createdAt: "2026-01-06",
  },
  {
    id: "olive-green",
    name: "Olive Green",
    code: "OLV01",
    description: "Muted olive green shade",
    status: "INACTIVE",
    createdAt: "2026-01-07",
  },
];
