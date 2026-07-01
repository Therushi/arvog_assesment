import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./category/category-list.component').then(
        (m) => m.CategoryListComponent,
      ),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./product/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'upload',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./upload/upload.component').then((m) => m.UploadComponent),
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./reports/reports.component').then((m) => m.ReportsComponent),
  },
  { path: '**', redirectTo: 'login' },
];
