export interface Cart {
  id: bigint;
  user_id: bigint;
  session_id?: string;
  items: CartItem[];
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  id: bigint;
  cart_id: bigint;
  product_id: bigint;
  variant_id?: bigint;
  quantity: number;
  price: number;
  total: number;
  product?: {
    id: bigint;
    name: string;
    slug: string;
    image_url?: string;
  };
}

export interface AddToCartRequest {
  product_id: bigint;
  variant_id?: bigint;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartResponse {
  statusCode: number;
  data: Cart;
  message: string;
}
