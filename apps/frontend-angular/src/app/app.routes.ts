import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ROLES } from './shared/constants/app.constants';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent,
          ),
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            loadComponent: () =>
              import('./components/auth/login/login.component').then(
                (m) => m.LoginComponent,
              ),
          },
          {
            path: 'register',
            loadComponent: () =>
              import('./components/auth/register/register.component').then(
                (m) => m.RegisterComponent,
              ),
          },
        ],
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/products/products.component').then(
                (m) => m.ProductsComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./components/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./components/cart/cart.component').then(
            (m) => m.CartComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./components/checkout/checkout.component').then(
            (m) => m.CheckoutComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/admin/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/admin/admin-products/admin-products.component').then(
                (m) => m.AdminProductsComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./components/admin/admin-product-form/admin-product-form.component').then(
                (m) => m.AdminProductFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./components/admin/admin-product-form/admin-product-form.component').then(
                (m) => m.AdminProductFormComponent,
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
