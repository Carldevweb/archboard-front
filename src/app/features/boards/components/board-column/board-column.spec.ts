import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BoardColumnComponent } from './board-column';
import { BoardColumn } from '../../models/board-column.model';

@Component({
  selector: 'app-column-actions-menu',
  standalone: true,
  template: '',
})
class ColumnActionsMenuStubComponent {
  readonly rename = output<void>();
  readonly deleteColumn = output<void>();
}

@Component({
  selector: 'app-rename-column-inline',
  standalone: true,
  template: '',
})
class RenameColumnInlineStubComponent {
  readonly initialName = input<string>('');
  readonly isSubmitting = input<boolean>(false);

  readonly save = output<string>();
  readonly cancel = output<void>();
}

describe('BoardColumnComponent', () => {
  let component: BoardColumnComponent;
  let fixture: ComponentFixture<BoardColumnComponent>;

  const column: BoardColumn = {
    id: 1,
    name: 'Todo',
    position: 0,
    boardId: 7,
    cards: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardColumnComponent],
    })
      .overrideComponent(BoardColumnComponent, {
        set: {
          imports: [
            ColumnActionsMenuStubComponent,
            RenameColumnInlineStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BoardColumnComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('column', column);
    fixture.componentRef.setInput('isRenaming', false);
    fixture.componentRef.setInput('isUpdating', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display column title', () => {
    const title = fixture.debugElement.query(By.css('.board-column__title'))
      .nativeElement as HTMLElement;

    expect(title.textContent).toContain('Todo');
  });

  it('should display card count', () => {
    const count = fixture.debugElement.query(By.css('.board-column__count'))
      .nativeElement as HTMLElement;

    expect(count.textContent?.trim()).toBe('0');
  });

  it('should display projected content', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('Todo');
  });

  it('should show rename inline component when isRenaming is true', () => {
    fixture.componentRef.setInput('isRenaming', true);
    fixture.detectChanges();

    const renameComponent = fixture.debugElement.query(
      By.directive(RenameColumnInlineStubComponent)
    );

    expect(renameComponent).toBeTruthy();
  });

  it('should not show actions menu when isRenaming is true', () => {
    fixture.componentRef.setInput('isRenaming', true);
    fixture.detectChanges();

    const actionsMenu = fixture.debugElement.query(
      By.directive(ColumnActionsMenuStubComponent)
    );

    expect(actionsMenu).toBeFalsy();
  });

  it('should show actions menu when isRenaming is false', () => {
    fixture.componentRef.setInput('isRenaming', false);
    fixture.detectChanges();

    const actionsMenu = fixture.debugElement.query(
      By.directive(ColumnActionsMenuStubComponent)
    );

    expect(actionsMenu).toBeTruthy();
  });

  it('should emit startRename when actions menu emits rename', () => {
    const emitSpy = vi.spyOn(component.startRename, 'emit');

    const actionsMenu = fixture.debugElement.query(
      By.directive(ColumnActionsMenuStubComponent)
    );
    actionsMenu.triggerEventHandler('rename');

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit deleteColumn when actions menu emits deleteColumn', () => {
    const emitSpy = vi.spyOn(component.deleteColumn, 'emit');

    const actionsMenu = fixture.debugElement.query(
      By.directive(ColumnActionsMenuStubComponent)
    );
    actionsMenu.triggerEventHandler('deleteColumn');

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit saveRename when rename inline emits save', () => {
    fixture.componentRef.setInput('isRenaming', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.saveRename, 'emit');

    const renameComponent = fixture.debugElement.query(
      By.directive(RenameColumnInlineStubComponent)
    );
    renameComponent.triggerEventHandler('save', 'Doing');

    expect(emitSpy).toHaveBeenCalledWith('Doing');
  });

  it('should emit cancelRename when rename inline emits cancel', () => {
    fixture.componentRef.setInput('isRenaming', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.cancelRename, 'emit');

    const renameComponent = fixture.debugElement.query(
      By.directive(RenameColumnInlineStubComponent)
    );
    renameComponent.triggerEventHandler('cancel');

    expect(emitSpy).toHaveBeenCalled();
  });
});