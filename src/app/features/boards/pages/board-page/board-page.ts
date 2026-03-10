import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { forkJoin } from 'rxjs';

import { BoardColumnComponent } from '../../components/board-column/board-column';
import { BoardCardComponent } from '../../components/board-card/board-card';
import { BoardCard } from '../../models/board-card.model';
import { BoardColumn } from '../../models/board-column.model';
import { BoardCardService } from '../../services/board-card.service';
import { BoardColumnService } from '../../services/board-column.service';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    BoardColumnComponent,
    BoardCardComponent,
  ],
  templateUrl: './board-page.html',
  styleUrl: './board-page.scss',
})
export class BoardPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly columnService = inject(BoardColumnService);
  private readonly cardService = inject(BoardCardService);

  readonly createCardTitleInput = viewChild<ElementRef<HTMLInputElement>>('createCardTitleInput');

  readonly boardId = signal<number | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly columns = signal<BoardColumn[]>([]);

  readonly creatingCardColumnId = signal<number | null>(null);
  readonly newCardTitle = signal('');
  readonly newCardDescription = signal('');
  readonly isCreatingCard = signal(false);

  readonly editingCard = signal<BoardCard | null>(null);
  readonly editCardTitle = signal('');
  readonly editCardDescription = signal('');
  readonly isUpdatingCard = signal(false);

  readonly dropListIds = computed(() =>
    this.columns().map((column) => this.getDropListId(column.id))
  );

  ngOnInit(): void {
    const rawBoardId = this.route.snapshot.paramMap.get('boardId');
    const boardId = Number(rawBoardId);

    if (!rawBoardId || Number.isNaN(boardId)) {
      this.errorMessage.set('Board invalide.');
      this.isLoading.set(false);
      return;
    }

    this.boardId.set(boardId);
    this.loadBoard(boardId);
  }

  loadBoard(boardId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.columnService.getByBoard(boardId).subscribe({
      next: (columns: BoardColumn[]) => {
        const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

        if (sortedColumns.length === 0) {
          this.columns.set([]);
          this.isLoading.set(false);
          return;
        }

        const cardRequests = sortedColumns.map((column) =>
          this.cardService.getByColumn(column.id)
        );

        forkJoin(cardRequests).subscribe({
          next: (cardsResults: BoardCard[][]) => {
            const hydratedColumns: BoardColumn[] = sortedColumns.map((column, index) => ({
              ...column,
              cards: [...cardsResults[index]].sort((a, b) => a.position - b.position),
            }));

            this.columns.set(hydratedColumns);
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Impossible de charger les cards du board.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les colonnes du board.');
        this.isLoading.set(false);
      },
    });
  }

  getDropListId(columnId: number): string {
    return `board-column-drop-list-${columnId}`;
  }

  openCreateCardForm(columnId: number): void {
    this.creatingCardColumnId.set(columnId);
    this.newCardTitle.set('');
    this.newCardDescription.set('');
    this.errorMessage.set(null);

    queueMicrotask(() => {
      this.createCardTitleInput()?.nativeElement.focus();
    });
  }

  cancelCreateCard(): void {
    this.creatingCardColumnId.set(null);
    this.newCardTitle.set('');
    this.newCardDescription.set('');
    this.isCreatingCard.set(false);
  }

  updateNewCardTitle(value: string): void {
    this.newCardTitle.set(value);
  }

  updateNewCardDescription(value: string): void {
    this.newCardDescription.set(value);
  }

  createCard(column: BoardColumn): void {
    const title = this.newCardTitle().trim();
    const description = this.newCardDescription().trim();

    if (!title || this.isCreatingCard()) {
      if (!title) {
        this.errorMessage.set('Le titre de la card est requis.');
      }
      return;
    }

    this.isCreatingCard.set(true);
    this.errorMessage.set(null);

    this.cardService
      .createCard(column.id, {
        title,
        description: description || undefined,
      })
      .subscribe({
        next: (createdCard) => {
          const updatedColumns = this.columns().map((currentColumn) => {
            if (currentColumn.id !== column.id) {
              return currentColumn;
            }

            return {
              ...currentColumn,
              cards: [...currentColumn.cards, createdCard],
            };
          });

          this.columns.set(updatedColumns);
          this.cancelCreateCard();
        },
        error: () => {
          this.errorMessage.set('La création de la card a échoué.');
          this.isCreatingCard.set(false);
        },
      });
  }

  openEditCardModal(card: BoardCard): void {
    this.editingCard.set({ ...card });
    this.editCardTitle.set(card.title);
    this.editCardDescription.set(card.description ?? '');
    this.errorMessage.set(null);
  }

  closeEditCardModal(): void {
    this.editingCard.set(null);
    this.editCardTitle.set('');
    this.editCardDescription.set('');
    this.isUpdatingCard.set(false);
  }

  updateEditCardTitle(value: string): void {
    this.editCardTitle.set(value);
  }

  updateEditCardDescription(value: string): void {
    this.editCardDescription.set(value);
  }

  saveEditedCard(): void {
    const card = this.editingCard();
    if (!card) {
      return;
    }

    const title = this.editCardTitle().trim();
    const description = this.editCardDescription().trim();

    if (!title) {
      this.errorMessage.set('Le titre de la card est requis.');
      return;
    }

    this.isUpdatingCard.set(true);
    this.errorMessage.set(null);

    this.cardService
      .updateCard(card.id, {
        title,
        description: description || undefined,
      })
      .subscribe({
        next: (updatedCard) => {
          const updatedColumns = this.columns().map((column) => ({
            ...column,
            cards: column.cards.map((currentCard) =>
              currentCard.id === updatedCard.id
                ? { ...currentCard, ...updatedCard }
                : currentCard
            ),
          }));

          this.columns.set(updatedColumns);
          this.closeEditCardModal();
        },
        error: () => {
          this.errorMessage.set('La modification de la card a échoué.');
          this.isUpdatingCard.set(false);
        },
      });
  }

  deleteCard(): void {
    const card = this.editingCard();

    if (!card) {
      return;
    }

    const confirmed = confirm('Supprimer cette card ?');
    if (!confirmed) {
      return;
    }

    this.isUpdatingCard.set(true);
    this.errorMessage.set(null);

    this.cardService.deleteCard(card.id).subscribe({
      next: () => {
        const updatedColumns = this.columns().map((column) => ({
          ...column,
          cards: column.cards.filter((c) => c.id !== card.id),
        }));

        this.columns.set(updatedColumns);
        this.closeEditCardModal();
      },
      error: () => {
        this.errorMessage.set('La suppression de la card a échoué.');
        this.isUpdatingCard.set(false);
      },
    });
  }

  dropCard(event: CdkDragDrop<BoardCard[]>, targetColumn: BoardColumn): void {
    const previousState = this.cloneColumns(this.columns());

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.recomputeColumnsState();
    this.columns.set([...this.columns()]);

    const movedCard = event.container.data[event.currentIndex];

    if (!movedCard) {
      this.columns.set(previousState);
      return;
    }

    this.cardService
      .moveCard(movedCard.id, {
        toColumnId: targetColumn.id,
        position: event.currentIndex,
      })
      .subscribe({
        next: () => {
          this.errorMessage.set(null);
        },
        error: () => {
          this.columns.set(previousState);
          this.errorMessage.set('Le déplacement de la card a échoué.');
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/workspaces']);
  }

  private recomputeColumnsState(): void {
    const updatedColumns = this.columns().map((column) => ({
      ...column,
      cards: column.cards.map((card, index) => ({
        ...card,
        position: index,
        columnId: column.id,
      })),
    }));

    this.columns.set(updatedColumns);
  }

  private cloneColumns(columns: BoardColumn[]): BoardColumn[] {
    return columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({ ...card })),
    }));
  }
}