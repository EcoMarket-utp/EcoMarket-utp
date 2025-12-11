import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../../../shared/models/order.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiEndpoint = 'orders';

  constructor(private apiService: ApiService) {
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.apiService.post<Order>(`${this.apiEndpoint}`, request);
  }

  getOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiEndpoint);
  }

  getOrderById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`${this.apiEndpoint}/${id}`);
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(`${this.apiEndpoint}/user/${userId}`);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.apiService.patch<Order>(`${this.apiEndpoint}/${id}`, { status });
  }

  cancelOrder(id: string): Observable<Order> {
    return this.apiService.patch<Order>(`${this.apiEndpoint}/${id}`, { status: 'CANCELLED' });
  }
}
