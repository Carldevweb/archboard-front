import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { BoardPage } from './board-page';
import { BoardStore } from '../../store/board.store';
import { BoardColumn } from '../../models/board-column.model';
import { BoardCard } from '../../models/board-card.model';

describe('BoardPage', () => {
  let component: BoardPage;
  let fixture: ComponentFixture<BoardPage>;

  const routerMock = {
    navigate: vi.fn(),
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: convertToParamMap({ boardId: '7' }),
    },
  };

  const storeMock = {
    boardId: signal<number | null>(7),
    isLoading: signal(true),
    errorMessage: signal<string | null>(null),
    columns: signal<BoardColumn[]>([]),
    activities: signal([]),
    isLoadingActivities: signal(false),

    loadBoard: vi.fn(),
    createColumn: vi.fn(),
    updateColumnName: vi.fn(),
    deleteColumn: vi.fn(),
    createCard: vi.fn(),
    updateCard: vi.fn(),
    deleteCard: vi.fn(),
    moveColumn: vi.fn(),
    moveCard: vi.fn(),

    cloneColumnOrder: vi.fn(),
    recomputeColumnPositions: vi.fn(),
    cloneColumns: vi.fn(),
    recomputeColumnsState: vi.fn(),
  };

  beforeEach(async () => {
    routerMock.navigate.mockReset();
    storeMock.loadBoard.mockReset();
    storeMock.createColumn.mockReset();
    storeMock.updateColumnName.mockReset();
    storeMock.deleteColumn.mockReset();
    storeMock.createCard.mockReset();
    storeMock.updateCard.mockReset();
    storeMock.deleteCard.mockReset();
    storeMock.moveColumn.mockReset();
    storeMock.moveCard.mockReset();
    storeMock.cloneColumnOrder.mockReset();
    storeMock.recomputeColumnPositions.mockReset();
    storeMock.cloneColumns.mockReset();
    storeMock.recomputeColumnsState.mockReset();

    storeMock.boardId.set(7);
    storeMock.isLoading.set(true);
    storeMock.errorMessage.set(null);
    storeMock.columns.set([]);
    storeMock.activities.set([]);
    storeMock.isLoadingActivities.set(false);

    storeMock.loadBoard.mockResolvedValue(undefined);
    storeMock.createColumn.mockResolvedValue(true);
    storeMock.updateColumnName.mockResolvedValue(true);
    storeMock.deleteColumn.mockResolvedValue(true);
    storeMock.createCard.mockResolvedValue(true);
    storeMock.updateCard.mockResolvedValue(true);
    storeMock.deleteCard.mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [BoardPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: BoardStore, useValue: storeMock },
      ],
    })
      .overrideComponent(BoardPage, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BoardPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load board on init with valid boardId', async () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ boardId: '7' });

    await component.ngOnInit();

    expect(storeMock.loadBoard).toHaveBeenCalledWith(7);
  });

  it('should set error when boardId is invalid', async () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ boardId: 'abc' });

    await component.ngOnInit();

    expect(storeMock.errorMessage()).toBe('Invalid board.');
    expect(storeMock.isLoading()).toBe(false);
    expect(storeMock.loadBoard).not.toHaveBeenCalled();
  });

  it('should return drop list id', () => {
    expect(component.getDropListId(12)).toBe('board-column-drop-list-12');
  });

  it('should open and cancel create column form', () => {
    component.openCreateColumnForm();
    expect(component.creatingColumn()).toBe(true);

    component.cancelCreateColumn();
    expect(component.creatingColumn()).toBe(false);
    expect(component.isCreatingColumn()).toBe(false);
  });

  it('should not create column if name is empty', async () => {
    await component.createColumn('   ');

    expect(storeMock.createColumn).not.toHaveBeenCalled();
    expect(storeMock.errorMessage()).toBe('Column name is required.');
  });

  it('should create column and close form on success', async () => {
    component.creatingColumn.set(true);
    storeMock.createColumn.mockResolvedValue(true);

    await component.createColumn('Todo');

    expect(storeMock.createColumn).toHaveBeenCalledWith('Todo');
    expect(component.creatingColumn()).toBe(false);
    expect(component.isCreatingColumn()).toBe(false);
  });

  it('should start and cancel rename column', () => {
    component.startRenameColumn(5);
    expect(component.renamingColumnId()).toBe(5);

    component.cancelRenameColumn();
    expect(component.renamingColumnId()).toBeNull();
    expect(component.isUpdatingColumn()).toBe(false);
  });

  it('should not rename column if name is empty', async () => {
    const column: BoardColumn = {
      id: 1,
      name: 'Todo',
      position: 0,
      boardId: 7,
      cards: [],
    };

    await component.saveRenameColumn(column, '   ');

    expect(storeMock.updateColumnName).not.toHaveBeenCalled();
    expect(storeMock.errorMessage()).toBe('Column name is required.');
  });

  it('should rename column on success', async () => {
    const column: BoardColumn = {
      id: 1,
      name: 'Todo',
      position: 0,
      boardId: 7,
      cards: [],
    };

    await component.saveRenameColumn(column, 'Doing');

    expect(storeMock.updateColumnName).toHaveBeenCalledWith(1, 'Doing');
    expect(component.renamingColumnId()).toBeNull();
    expect(component.isUpdatingColumn()).toBe(false);
  });

  it('should open and cancel create card form', () => {
    component.openCreateCardForm(9);
    expect(component.creatingCardColumnId()).toBe(9);

    component.cancelCreateCard();
    expect(component.creatingCardColumnId()).toBeNull();
    expect(component.isCreatingCard()).toBe(false);
  });

  it('should not create card if title is empty', async () => {
    const column: BoardColumn = {
      id: 1,
      name: 'Todo',
      position: 0,
      boardId: 7,
      cards: [],
    };

    await component.createCard(column, {
      title: '   ',
      description: 'desc',
    });

    expect(storeMock.createCard).not.toHaveBeenCalled();
    expect(storeMock.errorMessage()).toBe('Card title is required.');
  });

  it('should create card on success', async () => {
    const column: BoardColumn = {
      id: 1,
      name: 'Todo',
      position: 0,
      boardId: 7,
      cards: [],
    };

    await component.createCard(column, {
      title: 'Card title',
      description: 'Card desc',
    });

    expect(storeMock.createCard).toHaveBeenCalledWith(
      1,
      'Card title',
      'Card desc'
    );
    expect(component.creatingCardColumnId()).toBeNull();
    expect(component.isCreatingCard()).toBe(false);
  });

  it('should open and close edit card modal', () => {
    const card: BoardCard = {
      id: 1,
      title: 'Card',
      description: 'Desc',
      position: 0,
      columnId: 2,
    };

    component.openEditCardModal(card);

    expect(component.editingCard()).toEqual(card);

    component.closeEditCardModal();

    expect(component.editingCard()).toBeNull();
    expect(component.isUpdatingCard()).toBe(false);
  });

  it('should not save edited card if title is empty', async () => {
    component.editingCard.set({
      id: 1,
      title: 'Old',
      description: 'Desc',
      position: 0,
      columnId: 2,
    });

    await component.saveEditedCard({
      title: '   ',
      description: 'New desc',
    });

    expect(storeMock.updateCard).not.toHaveBeenCalled();
    expect(storeMock.errorMessage()).toBe('Card title is required.');
  });

  it('should save edited card on success', async () => {
    component.editingCard.set({
      id: 1,
      title: 'Old',
      description: 'Desc',
      position: 0,
      columnId: 2,
    });

    await component.saveEditedCard({
      title: 'New title',
      description: 'New desc',
    });

    expect(storeMock.updateCard).toHaveBeenCalledWith(
      1,
      'New title',
      'New desc'
    );
    expect(component.editingCard()).toBeNull();
    expect(component.isUpdatingCard()).toBe(false);
  });

  it('should navigate back to workspaces', () => {
    component.goBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/workspaces']);
  });
});