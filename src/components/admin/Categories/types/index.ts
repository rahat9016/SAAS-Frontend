export interface IParentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt: string;
  actions?: string;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  parentCategory?: {
    id: string;
    name: string;
    icon?: string;
  };
  updatedAt?: string;
  createdAt: string;
  actions?: string;
}

export interface ISubCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string | null;
  status?: "ACTIVE" | "INACTIVE" | string;
  categoryId?: string;
  categoryName?: string;
  category?: {
    id: string;
    name: string;
    icon?: string | null;
  };
  createdAt: string;
  actions?: string;
}
