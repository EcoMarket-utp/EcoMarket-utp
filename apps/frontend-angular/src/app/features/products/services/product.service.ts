import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { ProductResponse } from '@app/shared/models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getProducts(page: number = 1, limit: number = 12): Observable<{ products: ProductResponse[]; total: number }> {
    return this.apiService.get<{ products: ProductResponse[]; total: number }>(
      'products',
      { page, limit }
    );
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.apiService.get<ProductResponse>(`products/${id}`);
  }

  searchProducts(query: string): Observable<ProductResponse[]> {
    return this.apiService.get<ProductResponse[]>('products/search', { q: query });
  }

  getProductsByCategory(categoryId: string): Observable<ProductResponse[]> {
    return this.apiService.get<ProductResponse[]>(`products/category/${categoryId}`);
  }

  getProductsByTag(tagId: string): Observable<ProductResponse[]> {
    return this.apiService.get<ProductResponse[]>(`products/tag/${tagId}`);
  }
}
