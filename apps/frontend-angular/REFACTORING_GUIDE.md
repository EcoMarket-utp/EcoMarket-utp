# Guía de Refactorización - Frontend Angular

## 1. Crear Estructura de Carpetas Base

```powershell
# Navegate a la carpeta del frontend
cd apps/frontend-angular/src/app

# Crear carpetas principales
mkdir core
mkdir shared
mkdir features
mkdir layout

# Subcarpetas en core
mkdir core/guards
mkdir core/interceptors
mkdir core/services
mkdir core/models

# Subcarpetas en shared
mkdir shared/components
mkdir shared/directives
mkdir shared/pipes
mkdir shared/models
mkdir shared/constants

# Subcarpetas en features
mkdir features/auth
mkdir features/products
mkdir features/cart
mkdir features/checkout
mkdir features/dashboard
mkdir features/admin

# Subcarpetas en layout
mkdir layout/main-layout
mkdir layout/admin-layout
```

---

## 2. Crear Módulo CORE (Servicios Globales)

### core/core.module.ts

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ApiService } from './services/api.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthService,
    UserService,
    ApiService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
```

### core/services/api.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data);
  }
}
```

### core/guards/auth.guard.ts

```typescript
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
```

### core/guards/role.guard.ts

```typescript
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles) {
      return true;
    }

    const userRole = this.authService.getCurrentUserRole();
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
```

### core/interceptors/auth.interceptor.ts

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
```

### core/interceptors/error.interceptor.ts

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        if (error.status === 403) {
          this.router.navigate(['/']);
        }

        const errorMessage = error.error?.message || error.message;
        console.error('HTTP Error:', errorMessage);

        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
```

---

## 3. Crear Módulo SHARED (Componentes Reutilizables)

### shared/shared.module.ts

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes compartidos
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PaginationComponent } from './components/pagination/pagination.component';

// Pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SafePipe } from './pipes/safe.pipe';

// Directivas
import { HighlightDirective } from './directives/highlight.directive';
import { AutofocusDirective } from './directives/autofocus.directive';

const COMPONENTS = [
  NavbarComponent,
  FooterComponent,
  PaginationComponent,
];

const PIPES = [
  CurrencyFormatPipe,
  DateFormatPipe,
  SafePipe,
];

const DIRECTIVES = [
  HighlightDirective,
  AutofocusDirective,
];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
```

### shared/models/user.model.ts

```typescript
export interface User {
  id: bigint;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}
```

### shared/models/product.model.ts

```typescript
export interface Product {
  id: bigint;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: bigint;
  brand?: string;
  weight?: number;
  seo_title?: string;
  seo_description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  stock_quantity: number;
  category_id: bigint;
  brand?: string;
}
```

### shared/constants/app.constants.ts

```typescript
export const APP_NAME = 'EcoMarket';
export const APP_VERSION = '1.0.0';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    LOGOUT: 'auth/logout',
    ME: 'auth/me',
  },
  PRODUCTS: {
    LIST: 'products',
    DETAIL: 'products/:id',
    CREATE: 'products',
    UPDATE: 'products/:id',
    DELETE: 'products/:id',
  },
  USERS: {
    PROFILE: 'users/profile',
    UPDATE: 'users/profile',
  },
  CART: {
    GET: 'carts',
    ADD_ITEM: 'carts/items',
    UPDATE_ITEM: 'carts/items/:id',
    REMOVE_ITEM: 'carts/items/:id',
  },
};

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
```

---

## 4. Crear FEATURE Modules con Lazy Loading

### features/products/products.module.ts

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';

import { ProductListComponent } from './list/product-list.component';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductSearchComponent } from './search/product-search.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductSearchComponent,
  ],
  imports: [CommonModule, SharedModule, ProductsRoutingModule],
})
export class ProductsModule {}
```

### features/products/products-routing.module.ts

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './list/product-list.component';
import { ProductDetailComponent } from './detail/product-detail.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: ':id', component: ProductDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
```

---

## 5. Actualizar app.routes.ts con Lazy Loading

```typescript
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ROLES } from './shared/constants/app.constants';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        m => m.MainLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.module').then(m => m.AuthModule),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.module').then(
            m => m.ProductsModule,
          ),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.module').then(m => m.CartModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./features/checkout/checkout.module').then(
            m => m.CheckoutModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            m => m.DashboardModule,
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then(
        m => m.AdminLayoutComponent,
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/admin/dashboard/admin-dashboard.module').then(
            m => m.AdminDashboardModule,
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/admin/products/admin-products.module').then(
            m => m.AdminProductsModule,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
```

---

## 6. Ejecutar Refactorización

```bash
# 1. Crear estructura (manual)
# - Crear carpetas según instrucciones arriba
# - Mover componentes a su lugar

# 2. Instalar dependencias si faltan
npm install

# 3. Generar módulos faltantes
ng generate module core --skip-import
ng generate module shared --skip-import
ng generate module features/auth
ng generate module features/products
ng generate module features/cart

# 4. Generar componentes dentro de módulos
ng generate component features/auth/login
ng generate component features/auth/register
ng generate component features/products/list
ng generate component features/products/detail

# 5. Compilar
ng build

# 6. Verificar
npm run lint
ng test
```

---

## 7. Checklist de Migración

- [ ] Crear estructura de carpetas
- [ ] Mover archivos a sus nuevas ubicaciones
- [ ] Crear core.module.ts y compartir servicios globales
- [ ] Crear shared.module.ts con componentes reutilizables
- [ ] Crear feature modules con lazy loading
- [ ] Implementar guards (AuthGuard, RoleGuard)
- [ ] Implementar interceptors (AuthInterceptor, ErrorInterceptor)
- [ ] Crear modelos e interfaces completos
- [ ] Actualizar rutas en app.routes.ts
- [ ] Actualizar imports en componentes
- [ ] Ejecutar linting y testing
- [ ] Verificar que no hay errores de compilación
- [ ] Crear README.md con documentación
- [ ] Hacer commit de cambios
