export interface WishlistItem {
  productId: string;
  slug: string;
  name_ar: string;
  name_en: string;
  brand: string;
  hue: string;
  imageUrl: string | null;
  price: number;
  /** When the customer added the item — ISO timestamp. */
  addedAt: string;
  /** Lightweight signal so the design's "Price dropped" ribbon has data. */
  priceDropped?: boolean;
}
