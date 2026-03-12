export interface IParentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  actions?: string;
}

export interface ICategory {
  id: string;
  name: string;
  parentCategoryId: string;
  parentCategoryName: string;
  createdAt: string;
  actions?: string;
}

export interface ISubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  actions?: string;
}
