export interface Category {
  id: bigint;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: bigint;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  children?: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parent_id?: bigint;
}

export interface CategoryResponse {
  statusCode: number;
  data: Category;
  message: string;
}

export interface CategoryListResponse {
  statusCode: number;
  data: Category[];
  message: string;
}
