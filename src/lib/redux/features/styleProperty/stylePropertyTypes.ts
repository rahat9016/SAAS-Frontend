export interface IStyleProperty {
  code: string;
  styleType: string;
  sizeChartTemplate: string;
  deliveryMonth: string;
  collectionType: string;
  categoryId: string;
  categoryName: string;
  seasonId: string;
  departmentId: string;
  supplierId: string;
  assignedBranchId: string;
  assignedBranchName: string;
  carryOver: boolean;
  autoProtoSr: boolean;
  autoSmsSr: boolean;
  autoFfpSr: boolean;
  createdAt: string;
}

export interface IStylePropertyState {
  items: Record<string, IStyleProperty>;
}
