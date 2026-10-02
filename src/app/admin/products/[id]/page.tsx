import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-2xl">Edit Product</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
