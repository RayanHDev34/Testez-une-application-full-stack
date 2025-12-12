import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // un test qui valide la creation d'un compte
  it('should register successfully', () => {
    jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const registerRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password'
    };
    component.form.setValue(registerRequest);
    component.submit();
    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // un test qui check la gestion d'erreur lors de la creation d'un compte
  it('should handle login error', () => {
      jest.spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('Register failed')));
  
      component.form.setValue({
        email: 'rayan@gmail.com',
        firstName: 'rayan',
        lastName: 'rayan',
        password: 'rayan'
      });
  
      component.submit();
      expect(component.onError).toBe(true);
    });

  // grise le button submit en l'absence d'un champ obligatoire
  it('should disable submit button if form is invalid', () => {
    component.form.setValue({
      email: '',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password'
    });
    expect(component.form.valid).toBeFalsy();
  });
  
});
