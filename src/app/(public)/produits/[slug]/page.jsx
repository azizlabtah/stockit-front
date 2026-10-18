
import { notFound } from "next/navigation";
import ProductDetails from "@/app/components/product/ProductDetails";
import { categories, products } from "@/constants/temp/catalogue";

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const category = categories.find(
    (item) => item.id === product.category
  );

  return (
    <ProductDetails
      product={product}
      categoryName={category?.name ?? "Autres produits"}
    />
  );
}
