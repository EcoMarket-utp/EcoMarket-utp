# 🏗️ Arquitectura Frontend - EcoMarket Angular

## 📐 Overview

La arquitectura frontend sigue el **patrón modular de Angular** con separación en tres niveles:

```
┌─────────────────────────────────────────┐
│           AppComponent                  │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────────────┐  │
│  │   Navbar     │  │    Footer      │  │
│  └──────────────┘  └────────────────┘  │
├─────────────────────────────────────────┤
│       Router Outlet (Feature Module)    │
├─────────────────────────────────────────┤
│    Toast Container | Modal (Global)     │
└─────────────────────────────────────────┘
```

---

## 🔧 Capas de Arquitectura

### 1. **Core Module** 🛡️
**Propósito**: Servicios globales, guards, interceptors

```typescript
CoreModule
├── Services/
│   ├── ApiService          ← HTTP base
│   ├── AuthService         ← Autenticación
│   └── UserService         ← Usuarios
│
├── Guards/
│   ├── AuthGuard           ← Protege rutas
│   └── RoleGuard           ← Control por rol
│
└── Interceptors/
    ├── AuthInterceptor     ← Inyecta JWT
    └── ErrorInterceptor    ← Maneja errores
```

**Características**:
- Se proporciona una sola vez en `providedIn: 'root'`
- No debe reutilizarse en feature modules
- Contiene lógica compartida por toda la app

---

### 2. **Shared Module** 🎨
**Propósito**: Componentes, pipes, modelos, constantes reutilizables

```typescript
SharedModule
├── Components/
│   ├── Navbar              ← Navegación
│   ├── Footer              ← Footer
│   ├── Modal               ← Diálogos
│   ├── Toast               ← Notificaciones
│   ├── Pagination          ← Paginación
│   └── Spinner             ← Loading
│
├── Models/
│   ├── user.model.ts       ← User interface
│   ├── product.model.ts    ← Product interface
│   ├── cart.model.ts       ← Cart interface
│   ├── order.model.ts      ← Order interface
│   ├── review.model.ts     ← Review interface
│   └── category.model.ts   ← Category interface
│
├── Pipes/
│   ├── currency-format.pipe ← Formato moneda
│   ├── date-format.pipe    ← Formato fecha
│   └── safe.pipe           ← HTML sanitization
│
├── Services/
│   ├── toast.service.ts    ← Toast management
│   └── modal.service.ts    ← Modal management
│
└── Constants/
    ├── app.constants.ts    ← APP_NAME, ROLES, etc
    └── validation.constants.ts ← Validaciones
```

**Características**:
- Importable desde feature modules
- Usado vía `SharedModule` en declaraciones
- Modelos tipados según backend API
- Pipes para transformar datos en templates

---

### 3. **Features Modules** 🚀
**Propósito**: Funcionalidad específica de la aplicación

```typescript
Features/
├── Auth/
│   ├── auth.module.ts
│   ├── auth-routing.module.ts
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── register/
│   │       ├── register.component.ts
│   │       ├── register.component.html
│   │       └── register.component.scss
│   └── guards/         ← Feature-specific guards
│
├── Products/
│   ├── products.module.ts
│   ├── products-routing.module.ts
│   ├── components/
│   │   ├── product-list/
│   │   └── product-detail/
│   └── services/
│       ├── product.service.ts
│       ├── category.service.ts
│       └── review.service.ts
│
├── Cart/
│   ├── cart.module.ts
│   ├── cart-routing.module.ts
│   ├── components/
│   │   └── cart.component.ts
│   └── services/
│       └── cart.service.ts
│
├── Checkout/
│   ├── checkout.module.ts
│   ├── checkout-routing.module.ts
│   ├── components/
│   │   └── checkout.component.ts
│   └── services/
│       └── order.service.ts
│
├── Dashboard/
│   ├── dashboard.module.ts
│   ├── dashboard-routing.module.ts
│   └── components/
│       └── dashboard.component.ts
│
└── Admin/
    ├── admin.module.ts
    ├── admin-routing.module.ts
    └── components/
        └── admin.component.ts
```

**Características**:
- Lazy loading automático
- Routing local dentro del módulo
- Servicios feature-specific
- Independientes entre sí

---

## 🔀 Flujo de Datos

### Authentication Flow

```
User Input (Login Form)
    ↓
LoginComponent.login()
    ↓
AuthService.login(credentials)
    ↓
ApiService.post('auth/login', credentials)
    ↓
[HTTP Request + AuthInterceptor]
    ↓
Backend (NestJS)
    ↓
[HTTP Response + JWT Token]
    ↓
AuthService: localStorage.setItem('token')
    ↓
AuthService: currentUser$.next(user)
    ↓
Component: Subscribe to currentUser$
    ↓
UI Update + Navigate to Dashboard
```

### Data Fetching Flow

```
Component OnInit
    ↓
FeatureService.getData()
    ↓
ApiService.get(endpoint)
    ↓
[HTTP Request + AuthInterceptor + JWT]
    ↓
Backend (NestJS + Prisma + PostgreSQL)
    ↓
[HTTP Response + ErrorInterceptor]
    ↓
Service: Observable<Data>
    ↓
Component: data$ = service.getData()
    ↓
Template: *ngIf="(data$ | async) as data"
    ↓
Display Data
```

### Error Handling Flow

```
API Error (4xx, 5xx)
    ↓
ErrorInterceptor.intercept()
    ↓
401/403 Unauthorized?
    ├─ YES → logout() + navigate('/login')
    ├─ NO → ToastService.error(message)
    └─ NO → Log error
    ↓
User Feedback via Toast
```

---

## 🔗 Dependency Injection

### Inyecciones Principales

```typescript
// En CoreModule
providers: [
  ApiService,        // HTTP base
  AuthService,       // Autenticación
  UserService,       // Usuarios
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }
]

// En SharedModule
providers: [
  ToastService,      // Notificaciones
  ModalService       // Diálogos
]

// En Feature Services
@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private apiService: ApiService) {}
}
```

---

## 📡 HTTP Interceptors

### AuthInterceptor

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next.handle(req);
}
```

**Responsabilidades**:
- Inyectar JWT en cada request
- Obtener token de localStorage
- Mantener token actualizado

---

### ErrorInterceptor

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        this.toastService.error('Acceso denegado');
      } else if (error.status >= 500) {
        this.toastService.error('Error del servidor');
      }
      
      return throwError(() => error);
    })
  );
}
```

**Responsabilidades**:
- Capturar errores HTTP
- Logout automático en 401
- Mostrar mensajes de error
- Redirigir en caso necesario

---

## 🛡️ Guards

### AuthGuard

```typescript
canActivate(route: ActivatedRouteSnapshot): boolean {
  if (this.authService.isAuthenticated) {
    return true;
  }
  
  this.router.navigate(['/auth/login']);
  return false;
}
```

**Protege**:
- `/dashboard`
- `/cart`
- `/checkout`
- `/admin`

### RoleGuard

```typescript
canActivate(route: ActivatedRouteSnapshot): boolean {
  const requiredRole = route.data['role'];
  const userRole = this.authService.currentUser?.role;
  
  if (requiredRole && userRole === requiredRole) {
    return true;
  }
  
  this.router.navigate(['/']);
  return false;
}
```

**Protege**:
- `/admin` (requiere role ADMIN)

---

## 🎯 Routing Strategy

### App Routing (app.routes.ts)

```typescript
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module')
      .then(m => m.ProductsModule)
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/cart/cart.module')
      .then(m => m.CartModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./features/admin/admin.module')
      .then(m => m.AdminModule)
  }
];
```

**Ventajas del Lazy Loading**:
- ✅ Bundle size reducido
- ✅ Carga rápida inicial
- ✅ Modulos se cargan bajo demanda
- ✅ Mejor performance en mobile

---

## 🔄 State Management

### Local State (BehaviorSubject)

```typescript
// CartService
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(initialCart);
  cart$ = this.cartSubject.asObservable();
  
  addToCart(item: CartItem) {
    const currentCart = this.cartSubject.value;
    currentCart.items.push(item);
    this.cartSubject.next(currentCart);
  }
}

// En componente
constructor(private cartService: CartService) {}
cart$ = this.cartService.cart$;

// En template
<div *ngIf="(cart$ | async) as cart">
  {{ cart.items.length }} items
</div>
```

### Observable Pattern

```typescript
// AuthService
isAuthenticated$ = new BehaviorSubject<boolean>(false);
currentUser$ = new BehaviorSubject<User | null>(null);

// En componente
isAuthenticated$ = this.authService.isAuthenticated$;
currentUser$ = this.authService.currentUser$;

// En template
<app-navbar *ngIf="(isAuthenticated$ | async)"></app-navbar>
<span>{{ (currentUser$ | async)?.firstName }}</span>
```

---

## 🎨 Component Lifecycle

### Typical Feature Component

```typescript
@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule]
})
export class FeatureComponent implements OnInit, OnDestroy {
  isLoading = false;
  data$ = new BehaviorSubject([]);
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private featureService: FeatureService,
    private toastService: ToastService
  ) {}
  
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadData(): void {
    this.isLoading = true;
    this.featureService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
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

**Patrones**:
- ✅ Standalone components
- ✅ Reactive forms with FormBuilder
- ✅ Observable with `| async` pipe
- ✅ takeUntil para unsubscribe
- ✅ Error handling en subscribe

---

## 📦 Build & Deployment

### Development Build
```bash
npm start
```
- Desarrollo local en puerto 4200
- Hot reload activado
- Source maps para debugging
- Ambiente: `environment.ts`

### Production Build
```bash
npm run build
```
- Minificación y optimización
- AOT compilation
- Lazy loading chunks
- Environment: `environment.prod.ts`
- Output: `dist/` directory

### Deployment (Render)
```bash
npm run build
npm run start:prod
```
- Build estático servido por servidor
- Configuración en `nginx.conf`
- CORS headers configurados
- API endpoint: `ecomarket-api.onrender.com`

---

## 🔐 Security Best Practices

### 1. **Token Storage**
```typescript
// ✅ LocalStorage (current)
localStorage.setItem('token', jwt);

// ❌ Evitar
// - SessionStorage (pierde al cerrar tab)
// - Cookies (vulnerable a CSRF sin httpOnly)
```

### 2. **XSS Protection**
```typescript
// ✅ Angular sanitiza por defecto
<div>{{ userInput }}</div>

// ❌ Evitar
<div [innerHTML]="userInput"></div>

// ✅ Usar SafePipe
<div [innerHTML]="userInput | safe"></div>
```

### 3. **CSRF Protection**
```typescript
// Implementado en backend
// Frontend solo inyecta token Bearer
headers.set('Authorization', `Bearer ${token}`);
```

### 4. **Role-Based Access**
```typescript
// ✅ Guards en rutas sensibles
{
  path: 'admin',
  canActivate: [AuthGuard, RoleGuard],
  data: { role: 'ADMIN' }
}

// ✅ Hide/Show en templates
<button *ngIf="(currentUser$ | async)?.role === 'ADMIN'">
  Admin
</button>
```

---

## 🧪 Testing Architecture

### Unit Tests (Próximo)
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should login user', () => {
    // Test implementation
  });
});
```

### E2E Tests (Próximo)
```typescript
describe('Auth Flow', () => {
  it('should login and redirect to dashboard', () => {
    cy.visit('/auth/login');
    cy.get('[data-cy=email-input]').type('user@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=login-btn]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

---

## 📊 Diagrama de Dependencias

```
┌──────────────────────────────────────────┐
│         AppComponent (Root)              │
└──────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────┐
│        CoreModule (Global)               │
│  - ApiService                            │
│  - AuthService                           │
│  - Guards & Interceptors                 │
└──────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────┐
│      SharedModule (Reusable)             │
│  - Components (Modal, Toast, etc)        │
│  - Models & Pipes                        │
│  - Services (Toast, Modal)               │
└──────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────┐
│    Feature Modules (Lazy Loaded)         │
│  - Auth, Products, Cart, Checkout        │
│  - Dashboard, Admin                      │
│  - Feature-specific services             │
└──────────────────────────────────────────┘
```

---

## 🎓 Principios de Diseño

### SOLID
- **S**ingle Responsibility: Cada componente/servicio tiene una responsabilidad
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov: Interfaces bien definidas
- **I**nterface Segregation: Interfaces pequeñas y específicas
- **D**ependency Inversion: Inyección de dependencias

### DRY (Don't Repeat Yourself)
- ✅ SharedModule para componentes comunes
- ✅ ApiService como base para todos los servicios
- ✅ Pipes reutilizables

### Clean Code
- ✅ Nombres descriptivos
- ✅ Funciones pequeñas
- ✅ Comentarios cuando es necesario
- ✅ Manejo de errores

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
**Arquitecto**: AI Assistant
