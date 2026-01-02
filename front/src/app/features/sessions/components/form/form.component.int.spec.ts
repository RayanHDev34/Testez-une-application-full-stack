import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';

describe('FormComponent – Integration', () => {
  let fixture: ComponentFixture<FormComponent>;
  let component: FormComponent;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  const mockSessionApiService = {
    create: jest.fn(),
    update: jest.fn(),
    detail: jest.fn()
  };

  const mockTeacherService = {
    all: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockSessionApiService.create.mockReturnValue(of({}));
    mockTeacherService.all.mockReturnValue(
      of([{ id: 1, firstName: 'John', lastName: 'Doe' }])
    );

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }
          }
        },
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  // utilisateur non admin redirigé
  it('should redirect non-admin user to sessions', () => {
    mockSessionService.sessionInformation.admin = false;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  //création de session par admin
  it('should create session and redirect when admin submits form', () => {
    const native = fixture.nativeElement;

    const nameInput = native.querySelector('input[formControlName="name"]');
    const dateInput = native.querySelector('input[formControlName="date"]');
    const descriptionInput = native.querySelector('textarea[formControlName="description"]');
    const submitButton = native.querySelector('button[type="submit"]');

    nameInput.value = 'Yoga';
    nameInput.dispatchEvent(new Event('input'));

    dateInput.value = '2025-01-01';
    dateInput.dispatchEvent(new Event('input'));

    descriptionInput.value = 'Relax session';
    descriptionInput.dispatchEvent(new Event('input'));

    component.sessionForm?.patchValue({ teacher_id: 1 });

    fixture.detectChanges();

    submitButton.click();

    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
