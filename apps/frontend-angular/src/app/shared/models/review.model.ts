export interface Review {
  id: bigint;
  product_id: bigint;
  user_id: bigint;
  order_item_id?: bigint;
  rating: number; // 1-5
  title: string;
  content: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: bigint;
    username: string;
  };
  responses?: ReviewResponse[];
}

export interface ReviewResponse {
  id: bigint;
  review_id: bigint;
  user_id: bigint;
  response: string;
  created_at: Date;
}

export interface CreateReviewRequest {
  product_id: bigint;
  order_item_id?: bigint;
  rating: number;
  title: string;
  content: string;
}

export interface ReviewResponse {
  statusCode: number;
  data: Review;
  message: string;
}

export interface ReviewListResponse {
  statusCode: number;
  data: {
    items: Review[];
    total: number;
    page: number;
    limit: number;
    average_rating: number;
  };
  message: string;
}
