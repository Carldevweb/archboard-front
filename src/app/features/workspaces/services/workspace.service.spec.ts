import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WorkspaceService } from './workspace.service';
import { environment } from '../../../../environments/environment';

describe('WorkspaceService', () => {
    let service: WorkspaceService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [WorkspaceService],
        });

        service = TestBed.inject(WorkspaceService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch all workspaces', () => {
        service.getAll().subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/workspaces`
        );

        expect(req.request.method).toBe('GET');

        req.flush([]);
    });

    it('should fetch workspace by id', () => {
        const workspaceId = 1;

        service.getById(workspaceId).subscribe();

        const req = httpMock.expectOne(
            `${environment.apiUrl}/workspaces/${workspaceId}`
        );

        expect(req.request.method).toBe('GET');

        req.flush({
            id: workspaceId,
            name: 'Test Workspace',
        });
    });
});