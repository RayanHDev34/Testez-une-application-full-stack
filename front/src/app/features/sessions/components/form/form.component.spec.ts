import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';

const mockSession = {
  id: 1,
  name: 'Morning Yoga',
  description: 'Relaxing session',
  date: new Date(),
  teacher_id: 10
};

const mockTeachers = [
  { id: 10, firstName: 'John', lastName: 'Doe' },
  { id: 11, firstName: 'Jane', lastName: 'Smith' }
];

const mockSessionService = {
  sessionInformation: {
    admin: true
  }
};

const mockSessionApiService = {
  detail: jest.fn().mockReturnValue(of(mockSession)),
  create: jest.fn().mockReturnValue(of(mockSession)),
  update: jest.fn().mockReturnValue(of(mockSession))
};

const mockTeacherService = {
  all: jest.fn().mockReturnValue(of(mockTeachers))
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('1')
    }
  }
};

const mockRouter = {
  navigate: jest.fn(),
  url: '/sessions/create'
};

const mockSnackBar = {
  open: jest.fn()
};

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //  La session est créée
  it('should create a session on submit', () => {
    // je vais avoir besoin de remplir le form
    component.sessionForm?.setValue({
      name: 'Evening Pilates',
      description: 'Intense session',
      date: new Date(),
      teacher_id: 11
    });
    component.onUpdate = false;
    // j'appelle la méthode submit
    component.submit();
    // je vérifie que la méthode create de sessionApiService a été appelée
    expect(mockSessionApiService.create).toHaveBeenCalled();
    // je vérifie que la navigation a eu lieu
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);

  });

  // L’affichage d’erreur en l’absence d’un champ
  // obligatoire
  it('should show error if required fields are missing', () => {
    const form = component.sessionForm!;
    form.setValue({
      name: '',
      description: 'Intense session',
      date: '',
      teacher_id: 11
    });
    component.onUpdate = false;
    component.submit();
    expect(form.get('name')?.hasError('required')).toBe(true);
    expect(form.get('date')?.hasError('required')).toBe(true);
  });
});
