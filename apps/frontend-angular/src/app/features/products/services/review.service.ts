import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../../../shared/models/review.model';
import { ApiService } from '../../../core/services/api.service';

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiEndpoint = 'reviews';

  constructor(private apiService: ApiService) {
  }

  getProductReviews(productId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`${this.apiEndpoint}/product/${productId}`);
  }

  createReview(request: CreateReviewRequest): Observable<Review> {
    return this.apiService.post<Review>(this.apiEndpoint, request);
  }

  updateReview(id: string, request: Partial<CreateReviewRequest>): Observable<Review> {
    return this.apiService.put<Review>(`${this.apiEndpoint}/${id}`, request);
  }

  deleteReview(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiEndpoint}/${id}`);
  }

  getAverageRating(productId: string): Observable<number> {
    return this.apiService.get<number>(`${this.apiEndpoint}/product/${productId}/average-rating`);
  }
}
