import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  const isApiRequest = request.url.startsWith(environment.apiUrl);
  const isAuthRequest = request.url.startsWith(`${environment.apiUrl}/auth/`);

  if (!isApiRequest || isAuthRequest || !token) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest);
};