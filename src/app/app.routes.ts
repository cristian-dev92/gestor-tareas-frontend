import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [  
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  
  // 2. Páginas "Límpias" (sin barra de navegación de la app)
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login)},
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register)},

  // 3. Páginas con Layout (las que ven cuando ya están "dentro" trabajando)
  {
    path: '', 
    component: Layout,
    children: [
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks').then(m => m.Tasks)},
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) }
    ] 
  },

  // 4. Si escriben cualquier cosa mal, al home
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];