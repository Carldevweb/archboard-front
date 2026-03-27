import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkspaceForm } from './create-workspace-form';

describe('CreateWorkspaceForm', () => {
  let component: CreateWorkspaceForm;
  let fixture: ComponentFixture<CreateWorkspaceForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWorkspaceForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWorkspaceForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
