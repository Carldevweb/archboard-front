import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Board } from '../../models/board.model';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-board-list-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './board-list-page.html',
  styleUrl: './board-list-page.scss',
})
export class BoardListPage implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly boards = signal<Board[]>([]);
  readonly workspaceId = signal<number | null>(null);

  ngOnInit(): void {
    const rawWorkspaceId = this.route.snapshot.paramMap.get('workspaceId');
    const workspaceId = Number(rawWorkspaceId);

    if (!rawWorkspaceId || Number.isNaN(workspaceId)) {
      this.errorMessage.set('Workspace invalide.');
      this.isLoading.set(false);
      return;
    }

    this.workspaceId.set(workspaceId);
    this.loadBoards(workspaceId);
  }

  loadBoards(workspaceId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.boardService.getByWorkspace(workspaceId).subscribe({
      next: (boards: Board[]) => {
        this.boards.set(boards);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les boards.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/workspaces']);
  }
}