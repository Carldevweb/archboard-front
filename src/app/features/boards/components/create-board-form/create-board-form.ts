import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Board } from '../../models/board.model';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-create-board-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-board-form.html',
  styleUrl: './create-board-form.scss',
})
export class CreateBoardFormComponent {
  private readonly boardService = inject(BoardService);

  @Input({ required: true })
  workspaceId!: number;

  @Output()
  readonly boardCreated = new EventEmitter<Board>();

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

    if (!this.workspaceId) {
      this.errorMessage.set('Workspace invalide.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.boardService.create(this.workspaceId, name).subscribe({
      next: (board) => {
        this.boardCreated.emit(board);
        this.name.set('');
        this.isSubmitting.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de créer le board.');
        this.isSubmitting.set(false);
      },
    });
  }
}