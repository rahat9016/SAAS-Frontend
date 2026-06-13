import CatalogPage from "@/src/components/home/Catalog/CatalogPage";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ g?: string; c?: string }>;
}) {
  const { g, c } = await searchParams;
  return <CatalogPage gender={g} category={c} />;
}
