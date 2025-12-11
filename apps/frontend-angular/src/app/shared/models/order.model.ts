export interface Order {
  id: bigint;
  order_number: string;
  user_id: bigint;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  total_amount: number;
  subtotal: number;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  items: OrderItem[];
  billing_address_id?: bigint;
  shipping_address_id?: bigint;
  notes?: string;
  ordered_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: bigint;
  order_id: bigint;
  product_id: bigint;
  variant_id?: bigint;
  quantity: number;
  price: number;
  total: number;
  product?: {
    id: bigint;
    name: string;
    slug: string;
  };
}

export interface CreateOrderRequest {
  billing_address_id: bigint;
  shipping_address_id: bigint;
  notes?: string;
}

export interface OrderResponse {
  statusCode: number;
  data: Order;
  message: string;
}

export interface OrderListResponse {
  statusCode: number;
  data: {
    items: Order[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}
