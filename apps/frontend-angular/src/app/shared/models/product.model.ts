import { Review } from './review.model';

export interface Product {
  id: bigint;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  weight?: number;
  category_id?: bigint;
  brand?: string;
  seo_title?: string;
  seo_description?: string;
  created_at: Date;
  updated_at: Date;
  images?: ProductImage[];
  tags?: string[];
  reviews?: Review[];
}

export interface ProductImage {
  id: bigint;
  product_id: bigint;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface ProductTag {
  id: bigint;
  product_id: bigint;
  tag: string;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  stock_quantity: number;
  category_id: bigint;
  brand?: string;
  weight?: number;
  tags?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductResponse {
  statusCode: number;
  data: Product;
  message: string;
}

export interface ProductListResponse {
  statusCode: number;
  data: {
    items: Product[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}
