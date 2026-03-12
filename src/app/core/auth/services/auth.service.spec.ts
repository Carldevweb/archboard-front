import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService, LoginRequest } from './auth.service';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    const routerMock = {
        navigate: vi.fn()
    };

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: Router, useValue: routerMock }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('login() should call API and store token', () => {
        const payload: LoginRequest = {
            email: 'test@test.com',
            password: 'password'
        };

        service.login(payload).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);

        req.flush({ token: 'fake-jwt-token' });

        const storedToken = localStorage.getItem('archboard_token');

        expect(storedToken).toBe('fake-jwt-token');
        expect(service.isAuthenticated()).toBe(true);
    });

    it('me() should call /me endpoint', () => {
        service.me().subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/me`);

        expect(req.request.method).toBe('GET');

        req.flush({
            id: 1,
            email: 'test@test.com'
        });
    });

    it('logout() should remove token and redirect', () => {
        localStorage.setItem('archboard_token', 'fake');

        service.logout();

        expect(localStorage.getItem('archboard_token')).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('hasToken() should return true if token exists', () => {
        localStorage.setItem('archboard_token', 'fake');

        expect(service.hasToken()).toBe(true);
    });

    it('hasToken() should return false if no token', () => {
        expect(service.hasToken()).toBe(false);
    });
});