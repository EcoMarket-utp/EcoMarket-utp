import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  id: string;
  title: string;
  message: string;
  type: 'confirm' | 'alert' | 'custom';
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  modal$ = this.modalSubject.asObservable();

  private resultSubject = new BehaviorSubject<{ confirmed: boolean }>({ confirmed: false });

  open(config: ModalConfig): Observable<{ confirmed: boolean }> {
    config.id = Math.random().toString(36);
    this.modalSubject.next(config);
    return this.resultSubject.asObservable();
  }

  confirm(title: string, message: string, confirmText = 'Confirmar', cancelText = 'Cancelar'): Observable<{ confirmed: boolean }> {
    return this.open({
      id: '',
      title,
      message,
      type: 'confirm',
      confirmText,
      cancelText,
    });
  }

  alert(title: string, message: string): Observable<{ confirmed: boolean }> {
    return this.open({
      id: '',
      title,
      message,
      type: 'alert',
    });
  }

  close(confirmed: boolean): void {
    this.resultSubject.next({ confirmed });
    this.modalSubject.next(null);
  }
}
