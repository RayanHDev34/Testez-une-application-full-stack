import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';

describe('LoginComponent – Integration', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const mockAuthService = {
    login: jest.fn()
  };

  const mockSessionService = {
    logIn: jest.fn()
  };

  beforeEach(async () => {
     jest.clearAllMocks();
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  it('should allow user to login and redirect', () => {
    // GIVEN
    mockAuthService.login.mockReturnValue(
      of({
        token: 'fake-token',
        type: 'Bearer',
        id: 1,
        username: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      })
    );

    const native = fixture.nativeElement;

    const emailInput = native.querySelector('input[formControlName="email"]');
    const passwordInput = native.querySelector('input[formControlName="password"]');
    const submitButton = native.querySelector('button[type="submit"]');

    // WHEN – interaction utilisateur
    emailInput.value = 'test@test.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    submitButton.click();

    // THEN
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockSessionService.logIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should display error message when login fails', () => {
  // GIVEN
  mockAuthService.login.mockReturnValue(
    throwError(() => new Error('Invalid credentials'))
  );

  const native = fixture.nativeElement;

  const emailInput = native.querySelector('input[formControlName="email"]');
  const passwordInput = native.querySelector('input[formControlName="password"]');
  const submitButton = native.querySelector('button[type="submit"]');

  // WHEN – interaction utilisateur
  emailInput.value = 'wrong@test.com';
  emailInput.dispatchEvent(new Event('input'));

  passwordInput.value = 'wrongpassword';
  passwordInput.dispatchEvent(new Event('input'));

  fixture.detectChanges();

  submitButton.click();
  fixture.detectChanges();

  // THEN
  const errorMessage = native.querySelector('.error');

  expect(mockAuthService.login).toHaveBeenCalled();
  expect(mockSessionService.logIn).not.toHaveBeenCalled();
  expect(router.navigate).not.toHaveBeenCalled();
  expect(errorMessage).toBeTruthy();
});
it('should not submit form when email is invalid', () => {
  // GIVEN
  const native = fixture.nativeElement;

  const emailInput = native.querySelector('input[formControlName="email"]');
  const passwordInput = native.querySelector('input[formControlName="password"]');
  const submitButton = native.querySelector('button[type="submit"]');

  // WHEN – email invalide
  emailInput.value = 'invalid-email';
  emailInput.dispatchEvent(new Event('input'));

  passwordInput.value = 'password';
  passwordInput.dispatchEvent(new Event('input'));

  fixture.detectChanges();

  submitButton.click();

  // THEN
  expect(mockAuthService.login).not.toHaveBeenCalled();
  expect(mockSessionService.logIn).not.toHaveBeenCalled();
  expect(router.navigate).not.toHaveBeenCalled();
});
it('should not submit form when password is empty', () => {
  // GIVEN
  const native = fixture.nativeElement;

  const emailInput = native.querySelector('input[formControlName="email"]');
  const passwordInput = native.querySelector('input[formControlName="password"]');
  const submitButton = native.querySelector('button[type="submit"]');

  // WHEN – mot de passe vide
  emailInput.value = 'test@test.com';
  emailInput.dispatchEvent(new Event('input'));

  passwordInput.value = '';
  passwordInput.dispatchEvent(new Event('input'));

  fixture.detectChanges();

  submitButton.click();

  // THEN
  expect(mockAuthService.login).not.toHaveBeenCalled();
  expect(mockSessionService.logIn).not.toHaveBeenCalled();
  expect(router.navigate).not.toHaveBeenCalled();
});

});
