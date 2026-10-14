import { ShopView, type ShopSearchParams } from "@/components/ShopView";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  return <ShopView searchParams={searchParams} basePath="/" />;
}
