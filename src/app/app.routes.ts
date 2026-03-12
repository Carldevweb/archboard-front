import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'workspaces',
  },

  // AUTH (public)

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then(
        (m) => m.LoginPage
      ),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then(
        (m) => m.RegisterPageComponent
      ),
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './features/auth/pages/forgot-password-page/forgot-password-page'
      ).then((m) => m.ForgotPasswordPageComponent),
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/pages/reset-password-page/reset-password-page').then(
        (m) => m.ResetPasswordPageComponent
      ),
  },

  // APP (protected)

  {
    path: 'workspaces',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/workspaces/pages/workspace-list-page/workspace-list-page'
      ).then((m) => m.WorkspaceListPage),
  },

  {
    path: 'workspaces/:workspaceId/boards',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/boards/pages/board-list-page/board-list-page').then(
        (m) => m.BoardListPage
      ),
  },

  {
    path: 'boards/:boardId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/boards/pages/board-page/board-page').then(
        (m) => m.BoardPage
      ),
  },

  {
    path: '**',
    redirectTo: 'workspaces',
  },
];