import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000): void {
    const id = Math.random().toString(36);
    const toast: Toast = { id, message, type, duration };
    
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next([...currentToasts, toast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next(currentToasts.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toastSubject.next([]);
  }
}
