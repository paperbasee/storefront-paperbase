export type CartItem = {
  product_public_id: string;
  variant_public_id?: string;
  quantity: number;
  name: string;
  price: string;
  image_url: string | null;
  variant_details?: string;
};
