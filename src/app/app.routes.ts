import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [  
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  
  {path: '', component: Layout,
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks').then(m => m.Tasks)},
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) }
    ] },
      { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login)},
      { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register)},

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
