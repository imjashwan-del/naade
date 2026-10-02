export type Measurements = {
  chest: string;
  waist: string;
  shoulder: string;
  sleeveLength: string;
  garmentLength: string;
  neck: string;
};

export type CartItem = {
  cartItemId: string;
  productId: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  size: string | null;
  isMadeToMeasure: boolean;
  measurements: Measurements | null;
  quantity: number;
};

export const EMPTY_MEASUREMENTS: Measurements = {
  chest: "",
  waist: "",
  shoulder: "",
  sleeveLength: "",
  garmentLength: "",
  neck: "",
};

export function measurementsAreComplete(m: Measurements | null): boolean {
  if (!m) return false;
  return (Object.keys(EMPTY_MEASUREMENTS) as (keyof Measurements)[]).every((key) => {
    const value = m[key]?.trim();
    if (!value) return false;
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0;
  });
}

export function cartItemVariantKey(item: {
  productId: number;
  size: string | null;
  isMadeToMeasure: boolean;
  measurements: Measurements | null;
}): string {
  return JSON.stringify({
    productId: item.productId,
    size: item.size,
    isMadeToMeasure: item.isMadeToMeasure,
    measurements: item.isMadeToMeasure ? item.measurements : null,
  });
}
