import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginPage } from './login-page';
import { AuthService } from '../../../../core/auth/services/auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;

  const authServiceMock = {
    login: vi.fn(),
    me: vi.fn(),
  };

  beforeEach(async () => {
    authServiceMock.login.mockReset();
    authServiceMock.me.mockReset();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form invalid', () => {
    component.submit();

    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login and redirect on success', () => {
    authServiceMock.login.mockReturnValue(of({ accessToken: 'jwt' }));
    authServiceMock.me.mockReturnValue(
      of({ id: 1, email: 'test@test.com' })
    );

    component.form.setValue({
      email: 'test@test.com',
      password: 'password',
    });

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
    });
    expect(authServiceMock.me).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces']);
    expect(component.isSubmitting()).toBe(false);
  });

  it('should still redirect when me() fails after login success', () => {
    authServiceMock.login.mockReturnValue(of({ accessToken: 'jwt' }));
    authServiceMock.me.mockReturnValue(
      throwError(() => new Error('me failed'))
    );

    component.form.setValue({
      email: 'test@test.com',
      password: 'password',
    });

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(authServiceMock.me).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces']);
    expect(component.isSubmitting()).toBe(false);
  });

  it('should set error message on login error', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => ({
        error: { message: 'Invalid credentials' },
      }))
    );

    component.form.setValue({
      email: 'test@test.com',
      password: 'password',
    });

    component.submit();

    expect(component.errorMessage()).toBe('Invalid credentials');
    expect(component.isSubmitting()).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});