import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Router } from '@angular/router';

import { WorkspaceListPage } from './workspace-list-page';
import { WorkspaceService } from '../../services/workspace.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Workspace } from '../../models/workspace.model';

describe('WorkspaceListPage', () => {
    let component: WorkspaceListPage;
    let fixture: ComponentFixture<WorkspaceListPage>;

    const workspaceServiceMock = {
        getAll: vi.fn(),
    };

    const authServiceMock = {
        logout: vi.fn(),
    };

    const routerMock = {
        navigate: vi.fn(),
    };

    beforeEach(async () => {
        workspaceServiceMock.getAll.mockReset();
        authServiceMock.logout.mockReset();
        routerMock.navigate.mockReset();

        workspaceServiceMock.getAll.mockReturnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [WorkspaceListPage],
            providers: [
                { provide: WorkspaceService, useValue: workspaceServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WorkspaceListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load workspaces on init', () => {
        const workspaces: Workspace[] = [
            { id: 1, name: 'Workspace A' } as Workspace,
            { id: 2, name: 'Workspace B' } as Workspace,
        ];

        workspaceServiceMock.getAll.mockReturnValue(of(workspaces));

        component.ngOnInit();

        expect(workspaceServiceMock.getAll).toHaveBeenCalled();
        expect(component.workspaces()).toEqual(workspaces);
        expect(component.isLoading()).toBe(false);
        expect(component.errorMessage()).toBeNull();
    });

    it('should set error message when loadWorkspaces fails', () => {
        workspaceServiceMock.getAll.mockReturnValue(
            throwError(() => new Error('load failed'))
        );

        component.loadWorkspaces();

        expect(workspaceServiceMock.getAll).toHaveBeenCalled();
        expect(component.errorMessage()).toBe(
            'Impossible de charger les workspaces.'
        );
        expect(component.isLoading()).toBe(false);
    });

    it('should navigate to workspace boards', () => {
        component.openBoards(12);

        expect(routerMock.navigate).toHaveBeenCalledWith([
            '/workspaces',
            12,
            'boards',
        ]);
    });

    it('should add workspace at the beginning of the list', () => {
        component.workspaces.set([
            { id: 2, name: 'Older workspace' } as Workspace,
        ]);

        const newWorkspace = { id: 1, name: 'New workspace' } as Workspace;

        component.addWorkspace(newWorkspace);

        expect(component.workspaces()).toEqual([
            newWorkspace,
            { id: 2, name: 'Older workspace' } as Workspace,
        ]);
    });

    it('should logout and navigate to login', () => {
        component.logout();

        expect(authServiceMock.logout).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
});