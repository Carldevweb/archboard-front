import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BoardCardService } from './board-card.service';
import { environment } from '../../../../environments/environment';

describe('BoardCardService', () => {
    let service: BoardCardService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BoardCardService],
        });

        service = TestBed.inject(BoardCardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch cards by column', () => {
        service.getByColumn(1).subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/columns/1/cards`
        );

        expect(req.request.method).toBe('GET');

        req.flush([]);
    });

    it('should create card', () => {
        const payload = { title: 'Task', description: 'desc' };

        service.createCard(1, payload).subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/columns/1/cards`
        );

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);

        req.flush({
            id: 1,
            title: 'Task',
            description: 'desc',
            position: 0,
            columnId: 1,
        });
    });

    it('should move card', () => {
        const payload = {
            toColumnId: 2,
            position: 1,
        };

        service.moveCard(1, payload).subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/cards/1/move`
        );

        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(payload);

        req.flush({});
    });

    it('should update card', () => {
        const payload = {
            title: 'Updated',
            description: 'updated',
        };

        service.updateCard(1, payload).subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/cards/1`
        );

        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(payload);

        req.flush({});
    });

    it('should delete card', () => {
        service.deleteCard(1).subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/cards/1`
        );

        expect(req.request.method).toBe('DELETE');

        req.flush(null);
    });
});