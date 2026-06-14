import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((c) => c.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard').then((c) => c.Dashboard),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
