import { ShopView, type ShopSearchParams } from "@/components/ShopView";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  return <ShopView searchParams={searchParams} basePath="/shop" />;
}
