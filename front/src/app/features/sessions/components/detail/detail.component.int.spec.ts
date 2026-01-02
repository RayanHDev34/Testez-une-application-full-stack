import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('DetailComponent – Integration', () => {
  let fixture: ComponentFixture<DetailComponent>;
  let component: DetailComponent;
  let router: Router;

  const mockSession = {
    id: 1,
    name: 'yoga class',
    description: 'relaxation',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 10,
    users: [1, 2]
  };

  const mockTeacher = {
    id: 10,
    firstName: 'John',
    lastName: 'Doe'
  };

  const mockSessionService = {
    sessionInformation: {
      id: 1,
      admin: true
    }
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    delete: jest.fn()
  };

  const mockTeacherService = {
    detail: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    mockSessionApiService.delete.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  // ✅ TEST 1 — Chargement de la session et du teacher
  it('should load session and teacher on init', () => {
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);

    const native = fixture.nativeElement;

    expect(native.textContent).toContain('2 attendees');
    expect(native.textContent).toContain('John DOE');
    expect(native.textContent).toContain('relaxation');
  });

  // ✅ TEST 2 — Suppression d’une session (admin)
  it('should delete session and redirect when admin clicks delete', () => {
    const native = fixture.nativeElement;
    const deleteButton = native.querySelector('button[color="warn"]');

    deleteButton.click();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
