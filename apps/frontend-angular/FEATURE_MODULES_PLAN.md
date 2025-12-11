# Feature Modules - Plan de Implementación

## 📋 Estructura de Feature Modules

Cada feature module seguirá esta estructura:

```
features/auth/
├── auth-routing.module.ts    (rutas específicas del módulo)
├── auth.module.ts             (declaración del módulo)
├── components/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   └── register/
│       ├── register.component.ts
│       ├── register.component.html
│       └── register.component.scss
└── services/
    └── auth-feature.service.ts (específico del módulo)
```

## 🎯 Módulos a Crear

### 1. **Auth Module** (Priority: HIGH)
**Responsabilidad:** Autenticación y autorización
- Login
- Register
- Forgot Password
- Reset Password

**Rutas:**
```
/auth/login
/auth/register
/auth/forgot-password
```

**Servicios:**
- AuthService (ya existe en core)
- AuthFeatureService (lógica específica)

**Guards:**
- NoAuthGuard (previene acceso si ya estás autenticado)

---

### 2. **Products Module** (Priority: HIGH)
**Responsabilidad:** Catálogo de productos
- Listado de productos
- Detalle de producto
- Búsqueda y filtros
- Reseñas

**Rutas:**
```
/products
/products/:id
/products/search
```

**Componentes:**
- ProductListComponent
- ProductDetailComponent
- ProductSearchComponent
- ProductReviewComponent

**Servicios:**
- ProductService (lista, detalle, búsqueda)
- ReviewService (crear, listar reseñas)

---

### 3. **Cart Module** (Priority: MEDIUM)
**Responsabilidad:** Carrito de compras
- Ver carrito
- Agregar items
- Remover items
- Actualizar cantidades

**Rutas:**
```
/cart (⚠️ requiere auth)
```

**Componentes:**
- CartComponent
- CartItemComponent

**Servicios:**
- CartService (gestión del carrito)

**Guards:**
- AuthGuard (protege esta ruta)

---

### 4. **Checkout Module** (Priority: MEDIUM)
**Responsabilidad:** Proceso de compra
- Resumen de orden
- Dirección de envío
- Método de pago
- Confirmación

**Rutas:**
```
/checkout (⚠️ requiere auth)
/checkout/summary
/checkout/shipping
/checkout/payment
/checkout/confirmation
```

**Componentes:**
- CheckoutComponent
- ShippingComponent
- PaymentComponent
- ConfirmationComponent

**Servicios:**
- OrderService (crear orden)
- ShippingService (calcular envío)
- PaymentService (procesar pago)

**Guards:**
- AuthGuard (protege checkout)

---

### 5. **Dashboard Module** (Priority: LOW)
**Responsabilidad:** Panel del usuario
- Perfil de usuario
- Mis órdenes
- Direcciones de envío
- Configuración de cuenta

**Rutas:**
```
/dashboard (⚠️ requiere auth)
/dashboard/profile
/dashboard/orders
/dashboard/addresses
/dashboard/settings
```

**Componentes:**
- DashboardComponent
- ProfileComponent
- OrdersComponent
- AddressesComponent
- SettingsComponent

**Servicios:**
- UserService (ya existe en core)
- OrderService (obtener órdenes del usuario)
- AddressService (gestionar direcciones)

**Guards:**
- AuthGuard (protege dashboard)

---

### 6. **Admin Module** (Priority: LOW)
**Responsabilidad:** Panel de administración
- Gestión de productos
- Gestión de usuarios
- Gestión de órdenes
- Gestión de categorías

**Rutas:**
```
/admin (⚠️ requiere auth + role ADMIN)
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/users
/admin/orders
/admin/categories
```

**Componentes:**
- AdminDashboardComponent
- ProductsAdminComponent
- ProductFormComponent
- UsersAdminComponent
- OrdersAdminComponent
- CategoriesAdminComponent

**Servicios:**
- ProductAdminService (CRUD completo)
- UserAdminService (CRUD usuarios)
- OrderAdminService (gestión órdenes)
- CategoryAdminService (CRUD categorías)

**Guards:**
- AuthGuard (protege admin)
- RoleGuard (requiere rol ADMIN)

---

## 📅 Orden de Implementación

### Fase 2A: Módulos Base (2-3 horas)
1. ✅ Auth Module (login, register)
2. ✅ Products Module (lista, detalle)
3. ✅ Cart Module (básico)

### Fase 2B: Módulos Completos (1-2 horas)
4. ✅ Checkout Module
5. ✅ Dashboard Module
6. ✅ Admin Module

### Fase 3: Componentes Compartidos (1-2 horas)
- SharedModule components (navbar, footer, modal, etc.)

### Fase 4: Finalización (1 hora)
- Tests, build, deployment

---

## 🔧 Comandos para Generar Módulos

```bash
# Generar módulo con routing
ng generate module features/auth --routing
ng generate module features/products --routing
ng generate module features/cart --routing
ng generate module features/checkout --routing
ng generate module features/dashboard --routing
ng generate module features/admin --routing

# Generar componentes
ng generate component features/auth/components/login
ng generate component features/auth/components/register
ng generate component features/products/components/product-list
ng generate component features/products/components/product-detail
ng generate component features/cart/components/cart
ng generate component features/checkout/components/checkout
ng generate component features/dashboard/components/dashboard
ng generate component features/admin/components/admin-dashboard

# Generar servicios
ng generate service features/auth/services/auth-feature
ng generate service features/products/services/product
ng generate service features/cart/services/cart
ng generate service features/checkout/services/order
ng generate service features/dashboard/services/dashboard
```

---

## ✅ Template de Feature Module

Cada feature module debe tener esta estructura básica:

### feature.module.ts
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureComponent } from './components/feature.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    SharedModule,  // Para usar modelos, pipes, constantes
  ],
})
export class FeatureModule {}
```

### feature-routing.module.ts
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureComponent } from './components/feature.component';
import { AuthGuard } from '@app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    canActivate: [AuthGuard],  // Si requiere autenticación
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
```

### Componente Típico
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeatureService } from '../services/feature.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit {
  data$ = this.service.getData();

  constructor(
    private service: FeatureService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // Handle route params
    });
  }
}
```

---

## 📋 Checklist

### Auth Module
- [ ] Crear módulo y routing
- [ ] Login component
- [ ] Register component
- [ ] NoAuthGuard
- [ ] Validaciones en formularios
- [ ] Tests

### Products Module
- [ ] Crear módulo y routing
- [ ] ProductList component
- [ ] ProductDetail component
- [ ] ProductService
- [ ] ReviewComponent
- [ ] Filtros y búsqueda
- [ ] Tests

### Cart Module
- [ ] Crear módulo y routing
- [ ] Cart component
- [ ] CartService
- [ ] Local storage integration
- [ ] Tests

### Checkout Module
- [ ] Crear módulo y routing
- [ ] Checkout components
- [ ] OrderService
- [ ] Payment integration
- [ ] Tests

### Dashboard Module
- [ ] Crear módulo y routing
- [ ] Dashboard components
- [ ] UserService integration
- [ ] OrderService integration
- [ ] Tests

### Admin Module
- [ ] Crear módulo y routing
- [ ] Admin components
- [ ] RoleGuard validation
- [ ] Admin services
- [ ] Tests

---

## 🚀 Próximos Pasos

1. Crear feature modules (6 módulos)
2. Crear componentes necesarios (20+ componentes)
3. Implementar servicios específicos (10+ servicios)
4. Migrar componentes existentes
5. Crear shared layout components
6. Tests y validación
7. Build y deployment

**Tiempo estimado:** 8-12 horas de desarrollo
