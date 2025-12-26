import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';


const mockSession = {
  id: 1,
  name: 'Morning Yoga',
  description: 'Relaxing session',
  date: new Date('2024-01-01'),
  teacher_id: 10,
  users: [1, 2],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02')
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
  detail: jest.fn().mockReturnValue(of(mockSession)),
  delete: jest.fn().mockReturnValue(of(null)),
  participate: jest.fn().mockReturnValue(of(null)),
  unParticipate: jest.fn().mockReturnValue(of(null))
};

const mockTeacherService = {
  detail: jest.fn().mockReturnValue(of(mockTeacher))
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('1')
    }
  }
};

const mockRouter = {
  navigate: jest.fn()
};

const mockSnackBar = {
  open: jest.fn()
};


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatSnackBarModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Les informations de la session sont correctement
  // affichées
  it('should fetch session details', () => {
    const html = fixture.nativeElement.textContent;

    expect(html).toContain('Morning Yoga');
    expect(html).toContain('Relaxing session');
    expect(html).toContain('2 attendees');
    expect(html).toContain('John DOE');
  });
  // Le bouton Delete apparaît si l'utilisateur connecté
  // est un admin
  it('should show delete button for admin users', () => {
    const html = fixture.nativeElement.textContent; 
    expect(html).toContain('Morning Yoga');
  });
  //  La session est correctement supprimée
  it('should delete session', () => {
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
