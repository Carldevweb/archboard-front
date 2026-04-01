import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ForgotPasswordPageComponent } from './forgot-password-page';
import { AuthService } from '../../../../core/auth/services/auth.service';

describe('ForgotPasswordPageComponent', () => {
    let component: ForgotPasswordPageComponent;
    let fixture: ComponentFixture<ForgotPasswordPageComponent>;

    const authServiceMock = {
        forgotPassword: vi.fn(),
    };

    beforeEach(async () => {
        authServiceMock.forgotPassword.mockReset();

        await TestBed.configureTestingModule({
            imports: [ForgotPasswordPageComponent],
            providers: [
                provideRouter([]),
                { provide: AuthService, useValue: authServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not submit if form is invalid', () => {
        component.submit();

        expect(authServiceMock.forgotPassword).not.toHaveBeenCalled();
    });

    it('should call forgotPassword and set success message on success', () => {
        authServiceMock.forgotPassword.mockReturnValue(of(void 0));

        component.form.setValue({
            email: 'test@test.com',
        });

        component.submit();

        expect(authServiceMock.forgotPassword).toHaveBeenCalledWith({
            email: 'test@test.com',
        });
        expect(component.successMessage()).toBe(
            'Si un compte existe, un email de réinitialisation a été envoyé.'
        );
        expect(component.errorMessage()).toBeNull();
        expect(component.isSubmitting()).toBe(false);
        expect(component.form.getRawValue().email).toBe('');
    });

    it('should set error message on forgotPassword error', () => {
        authServiceMock.forgotPassword.mockReturnValue(
            throwError(() => ({
                error: { message: 'Erreur forgot password' },
            }))
        );

        component.form.setValue({
            email: 'test@test.com',
        });

        component.submit();

        expect(component.errorMessage()).toBe('Erreur forgot password');
        expect(component.successMessage()).toBeNull();
        expect(component.isSubmitting()).toBe(false);
    });

    it('should set default error message on forgotPassword error without backend message', () => {
        authServiceMock.forgotPassword.mockReturnValue(
            throwError(() => new Error('network error'))
        );

        component.form.setValue({
            email: 'test@test.com',
        });

        component.submit();

        expect(component.errorMessage()).toBe(
            'Impossible de traiter la demande pour le moment.'
        );
        expect(component.isSubmitting()).toBe(false);
    });

    it('should not submit when already submitting', () => {
        component.isSubmitting.set(true);
        component.form.setValue({
            email: 'test@test.com',
        });

        component.submit();

        expect(authServiceMock.forgotPassword).not.toHaveBeenCalled();
    });
});