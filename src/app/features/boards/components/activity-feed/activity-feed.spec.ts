import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ActivityFeedComponent } from './activity-feed';
import { BoardActivity } from '../../models/board-activity.model';

describe('ActivityFeedComponent', () => {
    let component: ActivityFeedComponent;
    let fixture: ComponentFixture<ActivityFeedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActivityFeedComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityFeedComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should display loading state', () => {
        fixture.componentRef.setInput('isLoading', true);
        fixture.componentRef.setInput('activities', []);
        fixture.detectChanges();

        const state = fixture.debugElement.query(By.css('.activity-feed__state'))
            .nativeElement as HTMLElement;

        expect(state.textContent).toContain('Chargement de l’activité...');
    });

    it('should display empty state when there is no activity', () => {
        fixture.componentRef.setInput('isLoading', false);
        fixture.componentRef.setInput('activities', []);
        fixture.detectChanges();

        const state = fixture.debugElement.query(By.css('.activity-feed__state'))
            .nativeElement as HTMLElement;

        expect(state.textContent).toContain('Aucune activité pour le moment.');
    });

    it('should display activities list', () => {
        const activities: BoardActivity[] = [
            {
                id: 1,
                message: 'Card moved',
                createdAt: '2026-04-01T12:00:00Z',
            } as BoardActivity,
            {
                id: 2,
                message: 'Column created',
                createdAt: '2026-04-01T13:00:00Z',
            } as BoardActivity,
        ];

        fixture.componentRef.setInput('isLoading', false);
        fixture.componentRef.setInput('activities', activities);
        fixture.detectChanges();

        const items = fixture.debugElement.queryAll(By.css('.activity-feed__item'));

        expect(items.length).toBe(2);
        expect(fixture.nativeElement.textContent).toContain('Card moved');
        expect(fixture.nativeElement.textContent).toContain('Column created');
    });

    it('should display header title', () => {
        fixture.detectChanges();

        const title = fixture.debugElement.query(By.css('.activity-feed__header h2'))
            .nativeElement as HTMLElement;

        expect(title.textContent).toContain('Activity');
    });

    it('should display eyebrow', () => {
        fixture.detectChanges();

        const eyebrow = fixture.debugElement.query(
            By.css('.activity-feed__eyebrow')
        ).nativeElement as HTMLElement;

        expect(eyebrow.textContent).toContain('Historique');
    });

    it('should render activity message and date', () => {
        const activities: BoardActivity[] = [
            {
                id: 1,
                message: 'Card moved',
                createdAt: '2026-04-01T12:00:00Z',
            } as BoardActivity,
        ];

        fixture.componentRef.setInput('isLoading', false);
        fixture.componentRef.setInput('activities', activities);
        fixture.detectChanges();

        const message = fixture.debugElement.query(
            By.css('.activity-feed__message')
        ).nativeElement as HTMLElement;
        const date = fixture.debugElement.query(
            By.css('.activity-feed__date')
        ).nativeElement as HTMLElement;

        expect(message.textContent).toContain('Card moved');
        expect(date.textContent?.trim().length).toBeGreaterThan(0);
    });
});