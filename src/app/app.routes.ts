import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.component').then((m) => m.MainComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'document-type',
        title: 'Documentos',
        loadComponent: () =>
          import('./pages/document-type/document-type.component').then(
            (m) => m.DocumentTypeComponent
          ),
      },
      {
        path: 'taxpayer-type',
        title: 'Contribuyentes',
        loadComponent: () =>
          import('./pages/taxpayer-type/taxpayer-type.component').then(
            (m) => m.TaxpayerTypeComponent
          ),
      },
      {
        path: 'entities',
        title: 'Entidades',
        loadComponent: () =>
          import('./pages/entity/entity.component').then(
            (m) => m.EntityComponent
          ),
      },
      {
        path: '',
        redirectTo: 'entities',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
