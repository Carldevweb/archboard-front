import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCardModalComponent } from './edit-card-modal';

describe('EditCardModalComponent', () => {
  let component: EditCardModalComponent;
  let fixture: ComponentFixture<EditCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCardModalComponent],
    })
      .overrideComponent(EditCardModalComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EditCardModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isSubmitting', false);
    fixture.componentRef.setInput('initialTitle', 'Initial title');
    fixture.componentRef.setInput('initialDescription', 'Initial description');

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize draft values from inputs on init', () => {
    expect(component.draftTitle).toBe('Initial title');
    expect(component.draftDescription).toBe('Initial description');
  });

  it('should update draftTitle onTitleChange', () => {
    component.onTitleChange('Updated title');

    expect(component.draftTitle).toBe('Updated title');
  });

  it('should update draftDescription onDescriptionChange', () => {
    component.onDescriptionChange('Updated description');

    expect(component.draftDescription).toBe('Updated description');
  });

  it('should emit save with trimmed title and description', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.draftTitle = '   Updated title   ';
    component.draftDescription = '   Updated description   ';

    component.onSave();

    expect(emitSpy).toHaveBeenCalledWith({
      title: 'Updated title',
      description: 'Updated description',
    });
  });

  it('should emit save without description when description is empty', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.draftTitle = '   Updated title   ';
    component.draftDescription = '   ';

    component.onSave();

    expect(emitSpy).toHaveBeenCalledWith({
      title: 'Updated title',
      description: undefined,
    });
  });

  it('should not emit save when title is empty', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.draftTitle = '   ';
    component.draftDescription = 'Description';

    component.onSave();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit save when submitting', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    fixture.componentRef.setInput('isSubmitting', true);
    component.draftTitle = 'Updated title';
    component.draftDescription = 'Updated description';

    component.onSave();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit deleteCard onDelete', () => {
    const emitSpy = vi.spyOn(component.deleteCard, 'emit');

    component.onDelete();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit deleteCard when submitting', () => {
    const emitSpy = vi.spyOn(component.deleteCard, 'emit');
    fixture.componentRef.setInput('isSubmitting', true);

    component.onDelete();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit cancel onCancel', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit cancel when submitting', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');
    fixture.componentRef.setInput('isSubmitting', true);

    component.onCancel();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should call onCancel on backdrop click', () => {
    const cancelSpy = vi.spyOn(component, 'onCancel');

    component.onBackdropClick();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should stop propagation', () => {
    const event = {
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent;

    component.stopPropagation(event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });
});