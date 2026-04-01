import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddColumnInlineComponent } from './add-column-inline';

describe('AddColumnInlineComponent', () => {
    let component: AddColumnInlineComponent;
    let fixture: ComponentFixture<AddColumnInlineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddColumnInlineComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddColumnInlineComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('isSubmitting', false);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update draftName onNameChange', () => {
        component.onNameChange('Todo');

        expect(component.draftName).toBe('Todo');
    });

    it('should emit trimmed name onSubmit', () => {
        const emitSpy = vi.spyOn(component.createColumn, 'emit');
        component.draftName = '   Todo   ';

        component.onSubmit();

        expect(emitSpy).toHaveBeenCalledWith('Todo');
    });

    it('should not emit createColumn when draftName is empty', () => {
        const emitSpy = vi.spyOn(component.createColumn, 'emit');
        component.draftName = '   ';

        component.onSubmit();

        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit createColumn when submitting', () => {
        const emitSpy = vi.spyOn(component.createColumn, 'emit');
        fixture.componentRef.setInput('isSubmitting', true);
        component.draftName = 'Todo';
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