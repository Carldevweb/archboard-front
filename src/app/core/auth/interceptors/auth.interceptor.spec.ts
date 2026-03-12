import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';
import { TokenService } from '../services/token.service';
import { environment } from '../../../../environments/environment';

describe('authInterceptor', () => {

  const tokenServiceMock = {
    getToken: vi.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenServiceMock }
      ]
    });
  });

  it('should add Authorization header when token exists', () => {

    tokenServiceMock.getToken.mockReturnValue('fake-token');

    const request = new HttpRequest(
      'GET',
      `${environment.apiUrl}/boards`
    );

    let handledRequest: HttpRequest<any> | undefined;

    const next = (req: HttpRequest<any>) => {
      handledRequest = req;
      return {} as any;
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next);
    });

    expect(handledRequest?.headers.get('Authorization'))
      .toBe('Bearer fake-token');
  });

  it('should not add header for login', () => {

    tokenServiceMock.getToken.mockReturnValue('fake-token');

    const request = new HttpRequest(
      'POST',
      `${environment.apiUrl}/auth/login`,
      {}
    );

    let handledRequest: HttpRequest<any> | undefined;

    const next = (req: HttpRequest<any>) => {
      handledRequest = req;
      return {} as any;
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next);
    });

    expect(handledRequest?.headers.has('Authorization')).toBe(false);
  });

  it('should not add header if no token', () => {

    tokenServiceMock.getToken.mockReturnValue(null);

    const request = new HttpRequest(
      'GET',
      `${environment.apiUrl}/boards`
    );

    let handledRequest: HttpRequest<any> | undefined;

    const next = (req: HttpRequest<any>) => {
      handledRequest = req;
      return {} as any;
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next);
    });

    expect(handledRequest?.headers.has('Authorization')).toBe(false);
  });

});