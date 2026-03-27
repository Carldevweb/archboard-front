import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly confirmPassword = signal('');

  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  updateEmail(value: string): void {
    this.email.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }

  updateConfirmPassword(value: string): void {
    this.confirmPassword.set(value);
  }

  register(): void {
    const email = this.email().trim();
    const password = this.password().trim();
    const confirmPassword = this.confirmPassword().trim();

    if (this.isSubmitting()) {
      return;
    }

    if (!email || !password || !confirmPassword) {
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

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.successMessage.set('Account created successfully.');
        this.isSubmitting.set(false);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message ?? 'Registration failed.'
        );
        this.isSubmitting.set(false);
      },
    });
  }
}