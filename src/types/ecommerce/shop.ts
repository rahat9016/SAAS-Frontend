export type SortOption = "popularity" | "newest" | "price-asc" | "price-desc" | "rating";

export interface IShopFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  freeShipping: boolean;
  inStock: boolean;
}
