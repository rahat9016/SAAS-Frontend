export interface IBrand {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  updatedAt?: string;
  createdAt: string;
  actions?: string;
}
