import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent – Integration', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let router: Router;

  const mockAuthService = {
    register: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  it('should register successfully and redirect to login', () => {
    // GIVEN
    mockAuthService.register.mockReturnValue(of(void 0));

    const native = fixture.nativeElement;

    const firstNameInput = native.querySelector('input[formControlName="firstName"]');
    const lastNameInput = native.querySelector('input[formControlName="lastName"]');
    const emailInput = native.querySelector('input[formControlName="email"]');
    const passwordInput = native.querySelector('input[formControlName="password"]');
    const submitButton = native.querySelector('button[type="submit"]');

    // WHEN – interaction utilisateur
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));

    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));

    emailInput.value = 'john@doe.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    submitButton.click();

    // THEN
    expect(mockAuthService.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display error message when registration fails', () => {
    // GIVEN
    mockAuthService.register.mockReturnValue(
      throwError(() => new Error('Register failed'))
    );

    const native = fixture.nativeElement;

    const firstNameInput = native.querySelector('input[formControlName="firstName"]');
    const lastNameInput = native.querySelector('input[formControlName="lastName"]');
    const emailInput = native.querySelector('input[formControlName="email"]');
    const passwordInput = native.querySelector('input[formControlName="password"]');
    const submitButton = native.querySelector('button[type="submit"]');

    // WHEN
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));

    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));

    emailInput.value = 'john@doe.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    submitButton.click();
    fixture.detectChanges();

    // THEN
    const errorMessage = native.querySelector('.error');

    expect(mockAuthService.register).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.onError).toBe(true);
    expect(errorMessage).toBeTruthy();
  });

});
