import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService, AuthService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  // un test qui check si la connexion fonctionne
  it('should log in successfully', () => {
  const mockResponse: SessionInformation = {
    token: 'fake-jwt-token',
    type: 'Bearer',
    id: 1,
    username: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
  };

  jest.spyOn(authService, 'login').mockReturnValue(of(mockResponse));

  component.form.setValue({
    email: 'test@test.com',
    password: 'password'
  });

  component.submit();

  expect(authService.login).toHaveBeenCalled();
  expect(sessionService.logIn).toHaveBeenCalledWith(mockResponse);
  expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
});

// un test qui gere la gestion d'erreur en cas de mauvais login / password
  it('should handle login error', () => {
    jest.spyOn(authService, 'login')
    .mockReturnValue(throwError(() => new Error('Login failed')));

    component.form.setValue({
      email: 'test@test.com',
      password: 'password'
    });

    component.submit();
    expect(component.onError).toBe(true);
  });
// grise le button submit en l'absence d'un champ obligatoire
  it('should disable submit button if form is invalid', () => {
    component.form.setValue({
      email: '',
      password: 'password'
    });
    expect(component.form.invalid).toBe(true);
  })
});