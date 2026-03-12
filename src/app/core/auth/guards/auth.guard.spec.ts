import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { TokenService } from '../services/token.service';

describe('authGuard', () => {
    const routerMock = {
        createUrlTree: vi.fn().mockReturnValue('redirect')
    };

    const tokenServiceMock = {
        hasToken: vi.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: TokenService, useValue: tokenServiceMock }
            ]
        });
    });

    it('should allow access when token exists', () => {
        tokenServiceMock.hasToken.mockReturnValue(true);

        const result = TestBed.runInInjectionContext(() =>
            authGuard({} as any, {} as any)
        );

        expect(result).toBe(true);
    });

    it('should redirect to login when no token', () => {
        tokenServiceMock.hasToken.mockReturnValue(false);

        const result = TestBed.runInInjectionContext(() =>
            authGuard({} as any, {} as any)
        );

        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
        expect(result).toBe('redirect');
    });
});