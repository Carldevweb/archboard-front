import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BoardStore } from './board.store';
import { BoardColumnService } from '../services/board-column.service';
import { BoardCardService } from '../services/board-card.service';
import { BoardActivityService } from '../services/board-activity-service';

describe('BoardStore', () => {

    let store: BoardStore;

    const columnServiceMock = {
        getByBoard: vi.fn(),
        createColumn: vi.fn(),
        updateColumn: vi.fn(),
        deleteColumn: vi.fn(),
        moveColumn: vi.fn()
    };

    const cardServiceMock = {
        getByColumn: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        moveCard: vi.fn()
    };

    const activityServiceMock = {
        getByBoard: vi.fn()
    };

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                BoardStore,
                { provide: BoardColumnService, useValue: columnServiceMock },
                { provide: BoardCardService, useValue: cardServiceMock },
                { provide: BoardActivityService, useValue: activityServiceMock }
            ]
        });

        store = TestBed.inject(BoardStore);

        activityServiceMock.getByBoard.mockReturnValue(of([]));
    });

    it('should load board with columns', async () => {

        const mockColumns = [
            { id: 1, name: 'Todo', position: 0 },
            { id: 2, name: 'Done', position: 1 }
        ];

        const mockCards = [
            { id: 1, title: 'Card', position: 0, columnId: 1 }
        ];

        columnServiceMock.getByBoard.mockReturnValue(of(mockColumns));

        cardServiceMock.getByColumn.mockReturnValue(of(mockCards));

        await store.loadBoard(1);

        expect(store.columns().length).toBe(2);
        expect(store.columns()[0].cards.length).toBe(1);
        expect(store.isLoading()).toBe(false);
    });

    it('should create column', async () => {

        store.boardId.set(1);

        const newColumn = {
            id: 10,
            name: 'New',
            position: 1,
            cards: []
        };

        columnServiceMock.createColumn.mockReturnValue(of(newColumn));

        const result = await store.createColumn('New');

        expect(result).toBe(true);
        expect(store.columns().length).toBe(1);
    });

    it('should create card in column', async () => {

        store.columns.set([
            {
                id: 1,
                name: 'Todo',
                position: 0,
                boardId: 1,
                cards: []
            }
        ]);

        const createdCard = {
            id: 5,
            title: 'Task',
            position: 0,
            columnId: 1
        };

        cardServiceMock.createCard.mockReturnValue(of(createdCard));

        const result = await store.createCard(1, 'Task');

        expect(result).toBe(true);
        expect(store.columns()[0].cards.length).toBe(1);
    });

    it('should rollback moveCard on error', async () => {

        const previousColumns = [
            {
                id: 1,
                name: 'Todo',
                position: 0,
                boardId: 1,
                cards: [
                    { id: 1, title: 'Card', position: 0, columnId: 1 }
                ]
            }
        ];

        const updatedColumns = [
            {
                id: 2,
                name: 'Done',
                position: 0,
                boardId: 1,
                cards: [
                    { id: 1, title: 'Card', position: 0, columnId: 2 }
                ]
            }
        ];
        store.columns.set(previousColumns);

        cardServiceMock.moveCard.mockReturnValue(
            throwError(() => new Error())
        );

        const result = await store.moveCard(
            updatedColumns,
            1,
            2,
            0,
            previousColumns
        );

        expect(result).toBe(false);
        expect(store.columns()).toEqual(previousColumns);
    });

});