
import { notFound } from "next/navigation";
import CatalogBrowser from "@/app/components/catalog/CatalogBrowser";
import { categories } from "@/constants/temp/catalogue";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.id === slug);

  if (!category) notFound();

  return <CatalogBrowser initialCategory={category.id} />;
}
