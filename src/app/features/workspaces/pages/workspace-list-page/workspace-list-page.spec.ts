import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceListPage } from './workspace-list-page';

describe('WorkspaceListPage', () => {
  let component: WorkspaceListPage;
  let fixture: ComponentFixture<WorkspaceListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
