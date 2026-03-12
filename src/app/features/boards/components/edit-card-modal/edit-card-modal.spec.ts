import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCardModalComponent } from './edit-card-modal';

describe('EditCardModalComponent', () => {
  let component: EditCardModalComponent;
  let fixture: ComponentFixture<EditCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCardModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCardModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('initialTitle', 'Initial title');
    fixture.componentRef.setInput('initialDescription', 'Initial description');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize drafts from inputs', () => {
    expect(component.draftTitle).toBe('Initial title');
    expect(component.draftDescription).toBe('Initial description');
  });

  it('should emit save with trimmed values', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');

    component.draftTitle = '  Updated title  ';
    component.draftDescription = '  Updated desc  ';

    component.onSave();

    expect(emitSpy).toHaveBeenCalledWith({
      title: 'Updated title',
      description: 'Updated desc',
    });
  });

  it('should not emit save if title empty', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');

    component.draftTitle = '   ';

    component.onSave();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit save if submitting', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');

    fixture.componentRef.setInput('isSubmitting', true);
    fixture.detectChanges();

    component.draftTitle = 'Test';

    component.onSave();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit deleteCard', () => {
    const emitSpy = vi.spyOn(component.deleteCard, 'emit');

    component.onDelete();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit deleteCard when submitting', () => {
    const emitSpy = vi.spyOn(component.deleteCard, 'emit');

    fixture.componentRef.setInput('isSubmitting', true);
    fixture.detectChanges();

    component.onDelete();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit cancel', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should cancel on backdrop click', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');

    component.onBackdropClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should stop event propagation', () => {
    const event = {
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent;

    component.stopPropagation(event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });
});