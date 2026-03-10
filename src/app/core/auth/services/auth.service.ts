import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CurrentUser } from '../models/current-user.model';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  readonly currentUser = signal<CurrentUser | null>(null);
  readonly isAuthenticated = signal<boolean>(this.tokenService.hasToken());

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.tokenService.setToken(response.accessToken);
          this.isAuthenticated.set(true);
        })
      );
  }

  getMe(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  hasToken(): boolean {
    return this.tokenService.hasToken();
  }
}