import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BoardCardComponent } from './board-card';
import { BoardCard } from '../../models/board-card.model';

describe('BoardCardComponent', () => {
    let component: BoardCardComponent;
    let fixture: ComponentFixture<BoardCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BoardCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BoardCardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.componentRef.setInput('card', {
            id: 1,
            title: 'Card title',
            description: 'Card description',
            position: 0,
            columnId: 2,
        } as BoardCard);

        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should display card title', () => {
        fixture.componentRef.setInput('card', {
            id: 1,
            title: 'Card title',
            description: 'Card description',
            position: 0,
            columnId: 2,
        } as BoardCard);

        fixture.detectChanges();

        const title = fixture.debugElement.query(By.css('h3'))
            .nativeElement as HTMLElement;

        expect(title.textContent).toContain('Card title');
    });

    it('should display description when provided', () => {
        fixture.componentRef.setInput('card', {
            id: 1,
            title: 'Card title',
            description: 'Card description',
            position: 0,
            columnId: 2,
        } as BoardCard);

        fixture.detectChanges();

        const description = fixture.debugElement.query(By.css('p'))
            .nativeElement as HTMLElement;

        expect(description.textContent).toContain('Card description');
    });

    it('should not display description when not provided', () => {
        fixture.componentRef.setInput('card', {
            id: 1,
            title: 'Card title',
            position: 0,
            columnId: 2,
        } as BoardCard);

        fixture.detectChanges();

        const description = fixture.debugElement.query(By.css('p'));

        expect(description).toBeFalsy();
    });

    it('should render article container', () => {
        fixture.componentRef.setInput('card', {
            id: 1,
            title: 'Card title',
            description: 'Card description',
            position: 0,
            columnId: 2,
        } as BoardCard);

        fixture.detectChanges();

        const article = fixture.debugElement.query(By.css('.board-card'));

        expect(article).toBeTruthy();
    });
});