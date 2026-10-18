import CatalogBrowser from "@/app/components/catalog/CatalogBrowser";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";

  return <CatalogBrowser initialQuery={query} />;
}
