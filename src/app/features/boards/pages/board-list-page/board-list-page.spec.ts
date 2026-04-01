import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { BoardListPage } from './board-list-page';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';

describe('BoardListPage', () => {
  let component: BoardListPage;
  let fixture: ComponentFixture<BoardListPage>;

  const boardServiceMock = {
    getByWorkspace: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: convertToParamMap({ workspaceId: '5' }),
    },
  };

  beforeEach(async () => {
    boardServiceMock.getByWorkspace.mockReset();
    routerMock.navigate.mockReset();

    boardServiceMock.getByWorkspace.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [BoardListPage],
      providers: [
        { provide: BoardService, useValue: boardServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set error when workspaceId is invalid', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({
      workspaceId: 'abc',
    });

    fixture = TestBed.createComponent(BoardListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Workspace invalide.');
    expect(component.isLoading()).toBe(false);
    expect(boardServiceMock.getByWorkspace).not.toHaveBeenCalled();
  });

  it('should load boards on init with valid workspaceId', () => {
    const boards: Board[] = [
      { id: 1, name: 'Board A', workspaceId: 5 },
      { id: 2, name: 'Board B', workspaceId: 5 },
    ];

    boardServiceMock.getByWorkspace.mockReturnValue(of(boards));
    activatedRouteMock.snapshot.paramMap = convertToParamMap({
      workspaceId: '5',
    });

    fixture.detectChanges();

    expect(component.workspaceId()).toBe(5);
    expect(boardServiceMock.getByWorkspace).toHaveBeenCalledWith(5);
    expect(component.boards()).toEqual(boards);
    expect(component.isLoading()).toBe(false);
  });

  it('should set error when loadBoards fails', () => {
    boardServiceMock.getByWorkspace.mockReturnValue(
      throwError(() => new Error('load failed'))
    );

    component.loadBoards(5);

    expect(boardServiceMock.getByWorkspace).toHaveBeenCalledWith(5);
    expect(component.errorMessage()).toBe(
      'Impossible de charger les boards.'
    );
    expect(component.isLoading()).toBe(false);
  });

  it('should add board at the beginning of the list', () => {
    component.boards.set([
      { id: 2, name: 'Older board', workspaceId: 5 },
    ]);

    const newBoard: Board = {
      id: 1,
      name: 'New board',
      workspaceId: 5,
    };

    component.handleBoardCreated(newBoard);

    expect(component.boards()).toEqual([
      newBoard,
      { id: 2, name: 'Older board', workspaceId: 5 },
    ]);
  });

  it('should navigate back to workspaces', () => {
    component.goBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/workspaces']);
  });

  it('should navigate to board page', () => {
    component.openBoard(9);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/boards', 9]);
  });
});