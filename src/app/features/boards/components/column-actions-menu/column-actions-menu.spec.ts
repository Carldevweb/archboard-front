import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnActionsMenuComponent } from './column-actions-menu';

describe('ColumnActionsMenuComponent', () => {
    let component: ColumnActionsMenuComponent;
    let fixture: ComponentFixture<ColumnActionsMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColumnActionsMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ColumnActionsMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle menu open state', () => {
        expect(component.isOpen()).toBe(false);

        component.toggleMenu();
        expect(component.isOpen()).toBe(true);

        component.toggleMenu();
        expect(component.isOpen()).toBe(false);
    });

    it('should close menu', () => {
        component.isOpen.set(true);

        component.closeMenu();

        expect(component.isOpen()).toBe(false);
    });

    it('should emit rename and close menu onRename', () => {
        const emitSpy = vi.spyOn(component.rename, 'emit');
        component.isOpen.set(true);

        component.onRename();

        expect(component.isOpen()).toBe(false);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit deleteColumn and close menu onDelete', () => {
        const emitSpy = vi.spyOn(component.deleteColumn, 'emit');
        component.isOpen.set(true);

        component.onDelete();

        expect(component.isOpen()).toBe(false);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should close menu on escape', () => {
        component.isOpen.set(true);

        component.onEscape();

        expect(component.isOpen()).toBe(false);
    });
});