import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'workspaces',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: 'workspaces',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/workspaces/pages/workspace-list-page/workspace-list-page').then(
        (m) => m.WorkspaceListPage
      ),
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