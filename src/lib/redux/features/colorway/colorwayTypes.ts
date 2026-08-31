export interface IColorway {
  code: string;
  name: string;
  colorway: string;
  spec: string;
  description: string;
  standard: string;
  pantone: string;
  colorHex: string;
  image?: string;
  active: boolean;
  inTheme: boolean;
  sustLabelOff: boolean;
  planSms: boolean;
  plan3dSms: boolean;
  actualSms: boolean;
  startDate: string;
  endDate: string;
  clearanceDate: string;
  createdAt: string;
  articleIds: string[];
}

export interface IColorwayState {
  items: Record<string, IColorway>;
}
