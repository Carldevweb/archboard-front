import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Workspace } from '../../models/workspace.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-create-workspace-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-workspace-form.html',
  styleUrl: './create-workspace-form.scss',
})
export class CreateWorkspaceFormComponent {
  private readonly workspaceService = inject(WorkspaceService);

  @Output()
  readonly workspaceCreated = new EventEmitter<Workspace>();

  readonly name = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  updateName(value: string): void {
    this.name.set(value);
  }

  create(): void {
    const name = this.name().trim();

    if (!name || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.workspaceService.create(name).subscribe({
      next: (workspace) => {
        this.workspaceCreated.emit(workspace);
        this.name.set('');
        this.isSubmitting.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de créer le workspace.');
        this.isSubmitting.set(false);
      },
    });
  }
}