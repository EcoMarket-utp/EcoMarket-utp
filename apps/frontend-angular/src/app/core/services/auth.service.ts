import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../../shared/models/user.model';
import { STORAGE_KEYS } from '../../shared/constants/app.constants';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadCurrentUser();
    }
  }

  private isBrowser: boolean = false;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      }),
    );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/signup', data).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserRole(): string {
    return this.currentUserSubject.value?.role || '';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private setToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  private loadCurrentUser(): void {
    if (!this.isBrowser) return;
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error loading stored user:', error);
      }
    }
  }
}
