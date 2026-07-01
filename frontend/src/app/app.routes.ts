import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./category/category-list.component').then(
        (m) => m.CategoryListComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./product/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./upload/upload.component').then((m) => m.UploadComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports.component').then((m) => m.ReportsComponent),
  },
  { path: '**', redirectTo: 'login' },
];
