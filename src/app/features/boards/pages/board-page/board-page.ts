import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ActivityFeedComponent } from '../../components/activity-feed/activity-feed';
import { BoardColumnComponent } from '../../components/board-column/board-column';
import { BoardCardComponent } from '../../components/board-card/board-card';
import { AddColumnInlineComponent } from '../../components/add-column-inline/add-column-inline';
import {
  CreateCardInlineComponent,
  CreateCardPayload,
} from '../../components/create-card-inline/create-card-inline';
import {
  EditCardModalComponent,
  EditCardPayload,
} from '../../components/edit-card-modal/edit-card-modal';
import { BoardCard } from '../../models/board-card.model';
import { BoardColumn } from '../../models/board-column.model';
import { BoardStore } from '../../store/board.store';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
    ActivityFeedComponent,
    BoardColumnComponent,
    BoardCardComponent,
    AddColumnInlineComponent,
    CreateCardInlineComponent,
    EditCardModalComponent,
  ],
  templateUrl: './board-page.html',
  styleUrl: './board-page.scss',
})
export class BoardPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly store = inject(BoardStore);

  readonly boardId = computed(() => this.store.boardId());
  readonly isLoading = computed(() => this.store.isLoading());
  readonly errorMessage = computed(() => this.store.errorMessage());
  readonly columns = computed(() => this.store.columns());
  readonly activities = computed(() => this.store.activities());
  readonly isLoadingActivities = computed(() => this.store.isLoadingActivities());

  readonly creatingColumn = signal(false);
  readonly isCreatingColumn = signal(false);

  readonly renamingColumnId = signal<number | null>(null);
  readonly isUpdatingColumn = signal(false);

  readonly creatingCardColumnId = signal<number | null>(null);
  readonly isCreatingCard = signal(false);

  readonly editingCard = signal<BoardCard | null>(null);
  readonly isUpdatingCard = signal(false);

  readonly dropListIds = computed(() =>
    this.columns().map((column) => this.getDropListId(column.id))
  );

  async ngOnInit(): Promise<void> {
    const rawBoardId = this.route.snapshot.paramMap.get('boardId');
    const boardId = Number(rawBoardId);

    if (!rawBoardId || Number.isNaN(boardId)) {
      this.store.errorMessage.set('Invalid board.');
      this.store.isLoading.set(false);
      return;
    }

    await this.store.loadBoard(boardId);
  }

  getDropListId(columnId: number): string {
    return `board-column-drop-list-${columnId}`;
  }

  openCreateColumnForm(): void {
    this.creatingColumn.set(true);
    this.store.errorMessage.set(null);
  }

  cancelCreateColumn(): void {
    this.creatingColumn.set(false);
    this.isCreatingColumn.set(false);
  }

  async createColumn(name: string): Promise<void> {
    const trimmedName = name.trim();

    if (!trimmedName || this.isCreatingColumn()) {
      if (!trimmedName) {
        this.store.errorMessage.set('Column name is required.');
      }
      return;
    }

    this.isCreatingColumn.set(true);
    this.store.errorMessage.set(null);

    const success = await this.store.createColumn(trimmedName);

    if (success) {
      this.cancelCreateColumn();
      return;
    }

    this.isCreatingColumn.set(false);
  }

  startRenameColumn(columnId: number): void {
    this.renamingColumnId.set(columnId);
    this.store.errorMessage.set(null);
  }

  cancelRenameColumn(): void {
    this.renamingColumnId.set(null);
    this.isUpdatingColumn.set(false);
  }

  async saveRenameColumn(column: BoardColumn, name: string): Promise<void> {
    const trimmedName = name.trim();

    if (!trimmedName || this.isUpdatingColumn()) {
      if (!trimmedName) {
        this.store.errorMessage.set('Column name is required.');
      }
      return;
    }

    this.isUpdatingColumn.set(true);
    this.store.errorMessage.set(null);

    const success = await this.store.updateColumnName(column.id, trimmedName);

    if (success) {
      this.cancelRenameColumn();
      return;
    }

    this.isUpdatingColumn.set(false);
  }

  async deleteColumn(column: BoardColumn): Promise<void> {
    if (this.isUpdatingColumn()) {
      return;
    }

    const confirmed = confirm(`Delete column "${column.name}"?`);

    if (!confirmed) {
      return;
    }

    this.isUpdatingColumn.set(true);
    this.store.errorMessage.set(null);

    const success = await this.store.deleteColumn(column.id);

    if (success) {
      if (this.renamingColumnId() === column.id) {
        this.renamingColumnId.set(null);
      }

      if (this.creatingCardColumnId() === column.id) {
        this.creatingCardColumnId.set(null);
      }

      this.isUpdatingColumn.set(false);
      return;
    }

    this.isUpdatingColumn.set(false);
  }

  openCreateCardForm(columnId: number): void {
    this.creatingCardColumnId.set(columnId);
    this.store.errorMessage.set(null);
  }

  cancelCreateCard(): void {
    this.creatingCardColumnId.set(null);
    this.isCreatingCard.set(false);
  }

  async createCard(
    column: BoardColumn,
    payload: CreateCardPayload
  ): Promise<void> {
    if (this.isCreatingCard()) {
      return;
    }

    const title = payload.title.trim();
    const description = payload.description?.trim();

    if (!title) {
      this.store.errorMessage.set('Card title is required.');
      return;
    }

    this.isCreatingCard.set(true);
    this.store.errorMessage.set(null);

    const success = await this.store.createCard(
      column.id,
      title,
      description || undefined
    );

    if (success) {
      this.cancelCreateCard();
      return;
    }

    this.isCreatingCard.set(false);
  }

  openEditCardModal(card: BoardCard): void {
    this.editingCard.set({ ...card });
    this.store.errorMessage.set(null);
  }

  closeEditCardModal(): void {
    this.editingCard.set(null);
    this.isUpdatingCard.set(false);
  }

  async saveEditedCard(payload: EditCardPayload): Promise<void> {
    const card = this.editingCard();

    if (!card || this.isUpdatingCard()) {
      return;
    }

    const title = payload.title.trim();
    const description = payload.description?.trim();

    if (!title) {
      this.store.errorMessage.set('Card title is required.');
      return;
    }

    this.isUpdatingCard.set(true);
    this.store.errorMessage.set(null);

    const success = await this.store.updateCard(
      card.id,
      title,
      description || undefined
    );

    if (success) {
      this.closeEditCardModal();
      return;
    }

    this.isUpdatingCard.set(false);
  }

  async deleteCard(): Promise<void> {
    const card = this.editingCard();

    if (!card || this.isUpdatingCard()) {
      return;
    }

    const confirmed = confirm('Delete this card?');
    if (!confirmed) {
      return;
    }

    this.isUpdatingCard.set(true);
    this.store.errorMessage.set(null);

    const success = await this.store.deleteCard(card.id);

    if (success) {
      this.closeEditCardModal();
      return;
    }

    this.isUpdatingCard.set(false);
  }

  async dropColumn(event: CdkDragDrop<BoardColumn[]>): Promise<void> {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const previousColumns = this.store.cloneColumnOrder(this.columns());
    const workingColumns = this.store.cloneColumnOrder(this.columns());

    moveItemInArray(workingColumns, event.previousIndex, event.currentIndex);

    const recomputedColumns =
      this.store.recomputeColumnPositions(workingColumns);
    const movedColumn = recomputedColumns[event.currentIndex];

    if (!movedColumn) {
      return;
    }

    await this.store.moveColumn(
      recomputedColumns,
      movedColumn.id,
      event.currentIndex,
      previousColumns
    );
  }

  async dropCard(
    event: CdkDragDrop<BoardCard[]>,
    targetColumn: BoardColumn
  ): Promise<void> {
    const previousColumns = this.store.cloneColumns(this.columns());
    const workingColumns = this.store.cloneColumns(this.columns());

    const sourceColumn = workingColumns.find(
      (column) => this.getDropListId(column.id) === event.previousContainer.id
    );
    const destinationColumn = workingColumns.find(
      (column) => column.id === targetColumn.id
    );

    if (!sourceColumn || !destinationColumn) {
      return;
    }

    if (sourceColumn.id === destinationColumn.id) {
      moveItemInArray(
        destinationColumn.cards,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        sourceColumn.cards,
        destinationColumn.cards,
        event.previousIndex,
        event.currentIndex
      );
    }

    const recomputedColumns = this.store.recomputeColumnsState(workingColumns);
    const movedCard = destinationColumn.cards[event.currentIndex];

    if (!movedCard) {
      return;
    }

    await this.store.moveCard(
      recomputedColumns,
      movedCard.id,
      targetColumn.id,
      event.currentIndex,
      previousColumns
    );
  }

  goBack(): void {
    this.router.navigate(['/workspaces']);
  }
}