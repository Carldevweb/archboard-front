import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/services/auth.service';
import { CreateWorkspaceFormComponent } from '../../components/create-workspace-form/create-workspace-form';
import { Workspace } from '../../models/workspace.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-list-page',
  imports: [CommonModule, CreateWorkspaceFormComponent],
  templateUrl: './workspace-list-page.html',
  styleUrl: './workspace-list-page.scss',
})
export class WorkspaceListPage implements OnInit {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly workspaces = signal<Workspace[]>([]);

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  openBoards(workspaceId: number): void {
    this.router.navigate(['/workspaces', workspaceId, 'boards']);
  }

  loadWorkspaces(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.workspaceService.getAll().subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les workspaces.');
        this.isLoading.set(false);
      },
    });
  }

  addWorkspace(workspace: Workspace): void {
    this.workspaces.update((list) => [workspace, ...list]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}