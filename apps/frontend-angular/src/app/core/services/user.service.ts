import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UpdateProfileRequest } from '../../shared/models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getProfile(): Observable<User> {
    return this.apiService.get<User>('users/profile');
  }

  updateProfile(data: UpdateProfileRequest): Observable<User> {
    return this.apiService.put<User>('users/profile', data);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.apiService.post('users/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`users/${id}`);
  }

  getAll(page = 1, limit = 20): Observable<any> {
    return this.apiService.get('users', { page, limit });
  }

  delete(id: string): Observable<any> {
    return this.apiService.delete(`users/${id}`);
  }
}
