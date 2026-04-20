export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profilePicture: string | null;
  isVerified: boolean;
  status: "ACTIVE" | "INACTIVE" | string;
  role: string;
  createdAt?: string;
  actions?: string;
}
