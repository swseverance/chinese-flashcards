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
    path: 'dashboard/create',
    canActivate: [authGuard],
    loadComponent: () => import('./components/create/create').then((c) => c.Create),
  },
  {
    path: 'dashboard/study/:type',
    canActivate: [authGuard],
    loadComponent: () => import('./components/study/study').then((c) => c.Study),
  },
  {
    path: 'dashboard/study/:type/:confidence',
    canActivate: [authGuard],
    loadComponent: () => import('./components/session/session').then((c) => c.Session),
  },
  {
    path: 'dashboard/search',
    canActivate: [authGuard],
    loadComponent: () => import('./components/search/search').then((c) => c.Search),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
