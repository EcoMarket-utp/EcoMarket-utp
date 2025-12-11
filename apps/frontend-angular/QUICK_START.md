# 🚀 Quick Start - Frontend Angular EcoMarket

## Instalación y Setup

### 1. Requisitos Previos
```bash
# Node.js 18.x o superior
node --version  # v18.x+

# npm o pnpm
npm --version   # 9.x+
# o
pnpm --version  # 8.x+
```

### 2. Clonar y Preparar el Proyecto
```bash
# Clonar repositorio
git clone <repo-url>
cd EcoMarket-utp

# Instalar dependencias (si no lo ha hecho)
cd apps/frontend-angular
npm install
# o
pnpm install
```

### 3. Configuración de Ambiente

El proyecto tiene dos archivos de ambiente:

```typescript
// environment.ts - Desarrollo
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  production: false
};

// environment.prod.ts - Producción
export const environment = {
  apiUrl: 'https://ecomarket-api.onrender.com/api',
  production: true
};
```

**Cambiar ambiente según necesidad** (se cambia automáticamente al hacer build --prod)

---

## 🏃 Ejecutar la Aplicación

### Desarrollo
```bash
# Terminal 1: Servidor backend
cd apps/backend
npm run start:dev

# Terminal 2: Servidor frontend
cd apps/frontend-angular
npm start
# o si usa pnpm
pnpm start
```

Abre [http://localhost:4200](http://localhost:4200) en el navegador.

### Producción
```bash
npm run build
npm run start:prod
```

---

## 📂 Estructura del Proyecto

```
src/app/
├── core/                    # Servicios globales, guards, interceptors
│   ├── guards/             # AuthGuard, RoleGuard
│   ├── interceptors/       # AuthInterceptor, ErrorInterceptor
│   └── services/           # ApiService, AuthService, UserService
│
├── shared/                 # Componentes y utilidades compartidas
│   ├── components/         # Navbar, Footer, Modal, Toast, etc
│   ├── models/            # Interfaces TypeScript (User, Product, etc)
│   ├── pipes/             # CurrencyFormat, DateFormat, Safe
│   ├── services/          # ToastService, ModalService
│   └── constants/         # APP_CONSTANTS, VALIDATION_CONSTANTS
│
├── features/              # Módulos feature (lazy loading)
│   ├── auth/              # Login, Register
│   ├── products/          # Product List, Product Detail
│   ├── cart/              # Cart Management
│   ├── checkout/          # Multi-step Checkout
│   ├── dashboard/         # User Profile
│   └── admin/             # Admin Dashboard
│
└── environments/          # Configuración por ambiente
```

---

## 🔐 Autenticación

### Login
```typescript
// Login form
const loginRequest = {
  email: 'user@example.com',
  password: 'password123'
};

// AuthService maneja automáticamente:
// 1. Request al backend
// 2. Guardado de token en localStorage
// 3. Actualización de currentUser$ Observable
// 4. Redireccionamiento automático

this.authService.login(loginRequest).subscribe(
  (user) => console.log('Logged in:', user),
  (error) => this.toastService.error(error.message)
);
```

### Logout
```typescript
this.authService.logout();
// Automáticamente:
// 1. Elimina token de localStorage
// 2. Redirige a /auth/login
// 3. Limpia currentUser$
```

### Protected Routes
```typescript
// En app.routes.ts, rutas con guards:
{
  path: 'dashboard',
  canActivate: [AuthGuard],
  loadComponent: () => import('./...')
}

// El AuthGuard verifica token y redirige si no está autenticado
```

---

## 🎨 Componentes Principales

### Toast Notifications
```typescript
// En cualquier componente
constructor(private toastService: ToastService) {}

// Uso
this.toastService.success('Producto agregado al carrito');
this.toastService.error('Error al cargar productos');
this.toastService.warning('Advertencia importante');
this.toastService.info('Información útil');
```

### Modal Dialogs
```typescript
// En AppComponent, incluir:
<app-modal></app-modal>

// Usar en componente:
constructor(private modalService: ModalService) {}

this.modalService.confirm({
  title: '¿Confirmar?',
  message: '¿Estás seguro?',
  onConfirm: () => this.deleteItem(),
  onCancel: () => console.log('Cancelado')
});
```

### Pagination
```html
<app-pagination
  [currentPage]="currentPage"
  [totalPages]="totalPages"
  [totalItems]="totalItems"
  [pageSize]="10"
  (pageChange)="onPageChange($event)"
></app-pagination>
```

### Spinner Loading
```html
<app-spinner
  *ngIf="isLoading"
  [fullScreen]="true"
  message="Cargando..."
  size="large"
></app-spinner>
```

---

## 🛠️ Desarrollo de Nuevos Features

### 1. Crear Nuevo Feature Module
```bash
mkdir -p src/app/features/my-feature/components
mkdir -p src/app/features/my-feature/services
```

### 2. Crear Componente
```typescript
// my-feature.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MyFeatureService } from '../services/my-feature.service';

@Component({
  selector: 'app-my-feature',
  templateUrl: './my-feature.component.html',
  styleUrls: ['./my-feature.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class MyFeatureComponent implements OnInit {
  isLoading = false;
  data$ = new BehaviorSubject([]);

  constructor(
    private myService: MyFeatureService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.myService.getData().subscribe(
      (data) => {
        this.data$.next(data);
        this.isLoading = false;
      },
      (error) => {
        this.toastService.error('Error cargando datos');
        this.isLoading = false;
      }
    );
  }
}
```

### 3. Crear Servicio
```typescript
// my-feature.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class MyFeatureService {
  private apiEndpoint = 'my-feature';

  constructor(private apiService: ApiService) {}

  getData(): Observable<any[]> {
    return this.apiService.get<any[]>(this.apiEndpoint);
  }

  getById(id: string): Observable<any> {
    return this.apiService.get<any>(`${this.apiEndpoint}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.apiService.post<any>(this.apiEndpoint, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.apiService.put<any>(`${this.apiEndpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiEndpoint}/${id}`);
  }
}
```

### 4. Registrar en Routing
```typescript
// app.routes.ts
{
  path: 'my-feature',
  loadComponent: () => 
    import('./features/my-feature/components/my-feature.component')
      .then(m => m.MyFeatureComponent)
}
```

---

## 📝 Comandos Útiles

```bash
# Verificar errores de TypeScript
npx tsc --noEmit

# Build para producción
npm run build
# o
pnpm build

# Ejecutar tests
npm test
# o
pnpm test

# Linting y formateo
npm run lint
npm run format

# Ver logs del git
git log --oneline -10
```

---

## 🐛 Troubleshooting

### "Cannot find module..." error
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto 4200 en uso
```bash
# Usar puerto diferente
npm start -- --port 4201
```

### Errores de CORS
- Verificar que el backend está en `http://localhost:3000/api`
- Si está en otro puerto, actualizar `environment.ts`

### Token JWT expirado
- El ErrorInterceptor redirige automáticamente a login
- Se borra el token de localStorage

---

## 📚 Documentación Completa

- [ARCHITECTURE_EVALUATION.md](./ARCHITECTURE_EVALUATION.md) - Evaluación inicial
- [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) - Guía detallada
- [FEATURE_MODULES_PLAN.md](./FEATURE_MODULES_PLAN.md) - Plan de módulos
- [PROGRESS_SUMMARY.md](./PROGRESS_SUMMARY.md) - Progreso actual

---

## 🤝 Contribuir

1. Crear rama feature: `git checkout -b feature/mi-feature`
2. Hacer cambios y commitear en español
3. Push y crear Pull Request
4. Verificar que `npx tsc --noEmit` pasa sin errores

---

## 📞 Soporte

- **Issues**: Abrir issue en GitHub
- **Docs**: Ver archivos `.md` en el proyecto
- **Backend API**: [EcoMarket API Docs](../backend/README.md)

---

**Versión**: 1.0.0 | **Última actualización**: Diciembre 2024
