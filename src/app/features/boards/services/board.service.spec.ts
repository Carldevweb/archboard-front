import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BoardService } from './board.service';
import { environment } from '../../../../environments/environment';

describe('BoardService', () => {
    let service: BoardService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BoardService],
        });

        service = TestBed.inject(BoardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch boards by workspace', () => {
        const workspaceId = 1;

        service.getByWorkspace(workspaceId).subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/workspaces/${workspaceId}/boards`
        );

        expect(req.request.method).toBe('GET');

        req.flush([]);
    });
});