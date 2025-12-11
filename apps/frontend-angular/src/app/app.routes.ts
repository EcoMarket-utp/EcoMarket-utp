import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ROLES } from './shared/constants/app.constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  // Auth Feature Module with Lazy Loading
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  // Products Feature Module with Lazy Loading
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  // Cart Feature Module (Protected by AuthGuard)
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/cart/cart.module').then((m) => m.CartModule),
  },
  // Checkout Feature Module (Protected by AuthGuard)
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/checkout/checkout.module').then(
        (m) => m.CheckoutModule
      ),
  },
  // Dashboard Feature Module (Protected by AuthGuard)
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  // Admin Feature Module (Protected by AuthGuard + RoleGuard)
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.ADMIN] },
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
  // Wildcard route for 404
  {
    path: '**',
    redirectTo: 'home',
  },
];

