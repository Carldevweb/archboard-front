import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCardInlineComponent } from './create-card-inline';

describe('CreateCardInlineComponent', () => {
    let component: CreateCardInlineComponent;
    let fixture: ComponentFixture<CreateCardInlineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateCardInlineComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateCardInlineComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('isSubmitting', false);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update draftTitle onTitleChange', () => {
        component.onTitleChange('Card title');

        expect(component.draftTitle).toBe('Card title');
    });

    it('should update draftDescription onDescriptionChange', () => {
        component.onDescriptionChange('Card description');

        expect(component.draftDescription).toBe('Card description');
    });

    it('should emit createCard with trimmed title and description', () => {
        const emitSpy = vi.spyOn(component.createCard, 'emit');
        component.draftTitle = '   Card title   ';
        component.draftDescription = '   Card description   ';

        component.onSubmit();

        expect(emitSpy).toHaveBeenCalledWith({
            title: 'Card title',
            description: 'Card description',
        });
    });

    it('should emit createCard without description when description is empty', () => {
        const emitSpy = vi.spyOn(component.createCard, 'emit');
        component.draftTitle = '   Card title   ';
        component.draftDescription = '   ';

        component.onSubmit();

        expect(emitSpy).toHaveBeenCalledWith({
            title: 'Card title',
            description: undefined,
        });
    });

    it('should not emit createCard when title is empty', () => {
        const emitSpy = vi.spyOn(component.createCard, 'emit');
        component.draftTitle = '   ';
        component.draftDescription = 'Description';

        component.onSubmit();

        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit createCard when submitting', () => {
        const emitSpy = vi.spyOn(component.createCard, 'emit');
        fixture.componentRef.setInput('isSubmitting', true);
        component.draftTitle = 'Card title';
        component.draftDescription = 'Description';
        fixture.detectChanges();

        component.onSubmit();

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
        fixture.detectChanges();

        component.onCancel();

        expect(emitSpy).not.toHaveBeenCalled();
    });
});