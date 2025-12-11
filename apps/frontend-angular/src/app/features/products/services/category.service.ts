import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../shared/models/category.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiEndpoint = 'categories';

  constructor(private apiService: ApiService) {
  }

  getCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.apiEndpoint);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.apiService.get<Category>(`${this.apiEndpoint}/${id}`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.apiService.post<Category>(this.apiEndpoint, data);
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.apiService.put<Category>(`${this.apiEndpoint}/${id}`, data);
  }

  deleteCategory(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiEndpoint}/${id}`);
  }

  getCategoryProducts(categoryId: string): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.apiEndpoint}/${categoryId}/products`);
  }
}
