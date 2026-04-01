import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  provideRouter,
  Router,
  convertToParamMap,
} from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ResetPasswordPageComponent } from './reset-password-page';
import { AuthService } from '../../../../core/auth/services/auth.service';

describe('ResetPasswordPageComponent', () => {
  let component: ResetPasswordPageComponent;
  let fixture: ComponentFixture<ResetPasswordPageComponent>;
  let router: Router;

  const authServiceMock = {
    resetPassword: vi.fn(),
  };

  const activatedRouteMock = {
    snapshot: {
      queryParamMap: convertToParamMap({ token: 'reset-token' }),
    },
  };

  beforeEach(async () => {
    authServiceMock.resetPassword.mockReset();

    await TestBed.configureTestingModule({
      imports: [ResetPasswordPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ResetPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.submit();

    expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
  });

  it('should set error if token is missing', () => {
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({});

    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    component.submit();

    expect(component.errorMessage()).toBe('Token de réinitialisation manquant.');
    expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
  });

  it('should set error if passwords do not match', () => {
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({
      token: 'reset-token',
    });

    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'different123',
    });

    component.submit();

    expect(component.errorMessage()).toBe(
      'Les mots de passe ne correspondent pas.'
    );
    expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
  });

  it('should call resetPassword and redirect on success', async () => {
    vi.useFakeTimers();

    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({
      token: 'reset-token',
    });

    authServiceMock.resetPassword.mockReturnValue(of(void 0));

    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    component.submit();

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith({
      token: 'reset-token',
      newPassword: 'password123',
    });
    expect(component.successMessage()).toBe(
      'Mot de passe réinitialisé avec succès.'
    );
    expect(component.errorMessage()).toBeNull();
    expect(component.isSubmitting()).toBe(false);

    await vi.advanceTimersByTimeAsync(1200);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set backend error message on resetPassword error', () => {
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({
      token: 'reset-token',
    });

    authServiceMock.resetPassword.mockReturnValue(
      throwError(() => ({
        error: { message: 'Token invalide' },
      }))
    );

    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    component.submit();

    expect(component.errorMessage()).toBe('Token invalide');
    expect(component.successMessage()).toBeNull();
    expect(component.isSubmitting()).toBe(false);
  });

  it('should set default error message on resetPassword error without backend message', () => {
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({
      token: 'reset-token',
    });

    authServiceMock.resetPassword.mockReturnValue(
      throwError(() => new Error('network error'))
    );

    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    component.submit();

    expect(component.errorMessage()).toBe(
      'Impossible de réinitialiser le mot de passe.'
    );
    expect(component.isSubmitting()).toBe(false);
  });

  it('should not submit when already submitting', () => {
    component.isSubmitting.set(true);
    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    component.submit();

    expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
  });
});