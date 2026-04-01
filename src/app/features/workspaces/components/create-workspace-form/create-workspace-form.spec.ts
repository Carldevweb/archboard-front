import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { CreateWorkspaceFormComponent } from './create-workspace-form';
import { WorkspaceService } from '../../services/workspace.service';
import { Workspace } from '../../models/workspace.model';

describe('CreateWorkspaceFormComponent', () => {
  let component: CreateWorkspaceFormComponent;
  let fixture: ComponentFixture<CreateWorkspaceFormComponent>;
  let workspaceService: { create: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    workspaceService = {
      create: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateWorkspaceFormComponent],
      providers: [
        {
          provide: WorkspaceService,
          useValue: workspaceService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWorkspaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update name signal', () => {
    component.updateName('Mon workspace');

    expect(component.name()).toBe('Mon workspace');
  });

  it('should not call service when name is empty', () => {
    component.updateName('   ');

    component.create();

    expect(workspaceService.create).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBeFalsy();
  });

  it('should not call service when already submitting', () => {
    component.updateName('Workspace test');
    component.isSubmitting.set(true);

    component.create();

    expect(workspaceService.create).not.toHaveBeenCalled();
  });

  it('should call service with trimmed name', () => {
    const createdWorkspace = {
      id: 1,
      name: 'Workspace test',
    } as Workspace;

    workspaceService.create.mockReturnValue(of(createdWorkspace));
    const emitSpy = vi.spyOn(component.workspaceCreated, 'emit');

    component.updateName('   Workspace test   ');
    component.create();

    expect(workspaceService.create).toHaveBeenCalledWith('Workspace test');
    expect(emitSpy).toHaveBeenCalledWith(createdWorkspace);
  });

  it('should emit workspaceCreated, reset name and stop submitting on success', () => {
    const createdWorkspace = {
      id: 1,
      name: 'Workspace test',
    } as Workspace;

    workspaceService.create.mockReturnValue(of(createdWorkspace));
    const emitSpy = vi.spyOn(component.workspaceCreated, 'emit');

    component.updateName('Workspace test');
    component.create();

    expect(emitSpy).toHaveBeenCalledWith(createdWorkspace);
    expect(component.name()).toBe('');
    expect(component.isSubmitting()).toBeFalsy();
    expect(component.errorMessage()).toBeNull();
  });

  it('should set error message and stop submitting on error', () => {
    workspaceService.create.mockReturnValue(
      throwError(() => new Error('create failed'))
    );

    component.updateName('Workspace test');
    component.create();

    expect(component.errorMessage()).toBe(
      'Impossible de créer le workspace.'
    );
    expect(component.isSubmitting()).toBeFalsy();
  });

  it('should disable button when submitting', () => {
    component.isSubmitting.set(true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;

    expect(button.disabled).toBe(true);
  });

  it('should display error message in template', () => {
    component.errorMessage.set('Impossible de créer le workspace.');
    fixture.detectChanges();

    const errorBox: HTMLElement = fixture.debugElement.query(
      By.css('.create-workspace-card__alert')
    ).nativeElement;

    expect(errorBox.textContent).toContain(
      'Impossible de créer le workspace.'
    );
  });

  it('should call create on button click', () => {
    const createdWorkspace = {
      id: 1,
      name: 'Workspace test',
    } as Workspace;

    workspaceService.create.mockReturnValue(of(createdWorkspace));

    component.updateName('Workspace test');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;

    button.click();

    expect(workspaceService.create).toHaveBeenCalledWith('Workspace test');
  });
});