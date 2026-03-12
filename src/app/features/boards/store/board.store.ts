import { Injectable, inject, signal } from '@angular/core';
import { forkJoin, firstValueFrom } from 'rxjs';
import { BoardActivity } from '../models/board-activity.model';
import { BoardColumn } from '../models/board-column.model';
import { BoardActivityService } from '../services/board-activity-service';
import { BoardCardService } from '../services/board-card.service';
import { BoardColumnService } from '../services/board-column.service';

@Injectable({
  providedIn: 'root',
})
export class BoardStore {
  private readonly columnService = inject(BoardColumnService);
  private readonly cardService = inject(BoardCardService);
  private readonly activityService = inject(BoardActivityService);

  readonly boardId = signal<number | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly columns = signal<BoardColumn[]>([]);
  readonly activities = signal<BoardActivity[]>([]);
  readonly isLoadingActivities = signal<boolean>(false);

  async loadBoard(boardId: number): Promise<void> {
    this.boardId.set(boardId);
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const columns = await firstValueFrom(this.columnService.getByBoard(boardId));
      const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

      if (sortedColumns.length === 0) {
        this.columns.set([]);
      } else {
        const cardRequests = sortedColumns.map((column) =>
          this.cardService.getByColumn(column.id)
        );

        const cardsResults = await firstValueFrom(forkJoin(cardRequests));

        const hydratedColumns: BoardColumn[] = sortedColumns.map((column, index) => ({
          ...column,
          cards: [...cardsResults[index]].sort((a, b) => a.position - b.position),
        }));

        this.columns.set(hydratedColumns);
      }

      await this.loadActivities(boardId);
    } catch {
      this.errorMessage.set('Unable to load board.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadActivities(boardId?: number): Promise<void> {
    const resolvedBoardId = boardId ?? this.boardId();

    if (!resolvedBoardId) {
      return;
    }

    this.isLoadingActivities.set(true);

    try {
      const activities = await firstValueFrom(
        this.activityService.getByBoard(resolvedBoardId)
      );

      const sortedActivities = [...activities].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      this.activities.set(sortedActivities);
    } catch {
      this.errorMessage.set('Unable to load activity feed.');
    } finally {
      this.isLoadingActivities.set(false);
    }
  }

  async createColumn(name: string): Promise<boolean> {
    const boardId = this.boardId();

    if (!boardId) {
      this.errorMessage.set('Invalid board.');
      return false;
    }

    this.errorMessage.set(null);

    try {
      const createdColumn = await firstValueFrom(
        this.columnService.createColumn(boardId, { name })
      );

      const hydratedColumn: BoardColumn = {
        ...createdColumn,
        cards: createdColumn.cards ?? [],
      };

      const updatedColumns = [...this.columns(), hydratedColumn].sort(
        (a, b) => a.position - b.position
      );

      this.columns.set(updatedColumns);
      await this.loadActivities();
      return true;
    } catch {
      this.errorMessage.set('Column creation failed.');
      return false;
    }
  }

  async updateColumnName(columnId: number, name: string): Promise<boolean> {
    this.errorMessage.set(null);

    try {
      const updatedColumn = await firstValueFrom(
        this.columnService.updateColumn(columnId, { name })
      );

      const updatedColumns = this.columns().map((column) => {
        if (column.id !== columnId) {
          return column;
        }

        return {
          ...column,
          ...updatedColumn,
          cards: column.cards,
        };
      });

      this.columns.set(updatedColumns);
      await this.loadActivities();
      return true;
    } catch {
      this.errorMessage.set('Column update failed.');
      return false;
    }
  }

  async deleteColumn(columnId: number): Promise<boolean> {
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.columnService.deleteColumn(columnId));

      const updatedColumns = this.columns()
        .filter((column) => column.id !== columnId)
        .map((column, index) => ({
          ...column,
          position: index,
        }));

      this.columns.set(updatedColumns);
      await this.loadActivities();
      return true;
    } catch {
      this.errorMessage.set('Column deletion failed.');
      return false;
    }
  }

  async moveColumn(
    updatedColumns: BoardColumn[],
    columnId: number,
    position: number,
    previousColumns: BoardColumn[]
  ): Promise<boolean> {
    this.errorMessage.set(null);
    this.columns.set(updatedColumns);

    try {
      await firstValueFrom(
        this.columnService.moveColumn(columnId, { position })
      );

      await this.loadActivities();
      return true;
    } catch {
      this.columns.set(previousColumns);
      this.errorMessage.set('Column move failed.');
      return false;
    }
  }

  async createCard(
    columnId: number,
    title: string,
    description?: string
  ): Promise<boolean> {
    this.errorMessage.set(null);

    try {
      const createdCard = await firstValueFrom(
        this.cardService.createCard(columnId, {
          title,
          description,
        })
      );

      const updatedColumns = this.columns().map((column) => {
        if (column.id !== columnId) {
          return column;
        }

        return {
          ...column,
          cards: [...column.cards, createdCard].sort(
            (a, b) => a.position - b.position
          ),
        };
      });

      this.columns.set(updatedColumns);
      await this.loadActivities();
      return true;
    } catch {
      this.errorMessage.set('Card creation failed.');
      return false;
    }
  }

  async updateCard(
    cardId: number,
    title: string,
    description?: string
  ): Promise<boolean> {
    this.errorMessage.set(null);

    try {
      const updatedCard = await firstValueFrom(
        this.cardService.updateCard(cardId, {
          title,
          description,
        })
      );

      const updatedColumns = this.columns().map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === updatedCard.id ? { ...card, ...updatedCard } : card
        ),
      }));

      this.columns.set(updatedColumns);
      await this.loadActivities();
      return true;
    } catch {
      this.errorMessage.set('Card update failed.');
      return false;
    }
  }

  async deleteCard(cardId: number): Promise<boolean> {
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.cardService.deleteCard(cardId));

      const updatedColumns = this.columns().map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      }));

      this.columns.set(updatedColumns);
      await this.loadActivities();
      return true;
    } catch {
      this.errorMessage.set('Card deletion failed.');
      return false;
    }
  }

  async moveCard(
    updatedColumns: BoardColumn[],
    cardId: number,
    toColumnId: number,
    position: number,
    previousColumns: BoardColumn[]
  ): Promise<boolean> {
    this.errorMessage.set(null);
    this.columns.set(updatedColumns);

    try {
      await firstValueFrom(
        this.cardService.moveCard(cardId, {
          toColumnId,
          position,
        })
      );

      await this.loadActivities();
      return true;
    } catch {
      this.columns.set(previousColumns);
      this.errorMessage.set('Card move failed.');
      return false;
    }
  }

  cloneColumns(columns: BoardColumn[]): BoardColumn[] {
    return columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({ ...card })),
    }));
  }

  cloneColumnOrder(columns: BoardColumn[]): BoardColumn[] {
    return columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({ ...card })),
    }));
  }

  recomputeColumnsState(columns: BoardColumn[]): BoardColumn[] {
    return columns.map((column) => ({
      ...column,
      cards: column.cards.map((card, index) => ({
        ...card,
        position: index,
        columnId: column.id,
      })),
    }));
  }

  recomputeColumnPositions(columns: BoardColumn[]): BoardColumn[] {
    return columns.map((column, index) => ({
      ...column,
      position: index,
    }));
  }
}