import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameColumnInlineComponent } from './rename-column-inline';

describe('RenameColumnInlineComponent', () => {
    let component: RenameColumnInlineComponent;
    let fixture: ComponentFixture<RenameColumnInlineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RenameColumnInlineComponent],
        })
            .overrideComponent(RenameColumnInlineComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(RenameColumnInlineComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('initialName', 'Todo');
        fixture.componentRef.setInput('isSubmitting', false);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update draftName onNameChange', () => {
        component.onNameChange('Doing');

        expect(component.draftName).toBe('Doing');
    });

    it('should emit trimmed name onSave', () => {
        const emitSpy = vi.spyOn(component.save, 'emit');
        component.draftName = '   Doing   ';

        component.onSave();

        expect(emitSpy).toHaveBeenCalledWith('Doing');
    });

    it('should not emit save when draftName is empty', () => {
        const emitSpy = vi.spyOn(component.save, 'emit');
        component.draftName = '   ';

        component.onSave();

        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit save when submitting', () => {
        const emitSpy = vi.spyOn(component.save, 'emit');
        fixture.componentRef.setInput('isSubmitting', true);
        component.draftName = 'Doing';

        component.onSave();

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
});