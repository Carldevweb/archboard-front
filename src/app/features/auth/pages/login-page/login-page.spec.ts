import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LoginPage } from './login-page';
import { AuthService } from '../../../../core/auth/services/auth.service';

describe('LoginPage', () => {

  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const authServiceMock = {
    login: vi.fn(),
    me: vi.fn()
  };

  const routerMock = {
    navigate: vi.fn()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form invalid', () => {

    component.submit();

    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login and redirect on success', () => {

    authServiceMock.login.mockReturnValue(of({ token: 'jwt' }));
    authServiceMock.me.mockReturnValue(of({ id: 1, email: 'test@test.com' }));

    component.form.setValue({
      email: 'test@test.com',
      password: 'password'
    });

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/workspaces']);
  });

  it('should set error message on login error', () => {

    authServiceMock.login.mockReturnValue(
      throwError(() => ({
        error: { message: 'Invalid credentials' }
      }))
    );

    component.form.setValue({
      email: 'test@test.com',
      password: 'password'
    });

    component.submit();

    expect(component.errorMessage()).toBe('Invalid credentials');
    expect(component.isSubmitting()).toBe(false);
  });

});