import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
})
export class ResetPasswordPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly password = signal('');
  readonly confirmPassword = signal('');

  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  updatePassword(value: string): void {
    this.password.set(value);
  }

  updateConfirmPassword(value: string): void {
    this.confirmPassword.set(value);
  }

  submit(): void {
    const token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
    const password = this.password().trim();
    const confirmPassword = this.confirmPassword().trim();

    if (this.isSubmitting()) {
      return;
    }

    if (!token) {
      this.errorMessage.set('Reset token is missing.');
      return;
    }

    if (!password || !confirmPassword) {
      this.errorMessage.set('All fields are required.');
      return;
    }

    if (password.length < 8) {
      this.errorMessage.set('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.resetPassword({ token, newPassword: password }).subscribe({
      next: () => {
        this.successMessage.set('Password reset successfully.');
        this.isSubmitting.set(false);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: () => {
        this.errorMessage.set('Password reset failed.');
        this.isSubmitting.set(false);
      },
    });
  }
} 