import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';
import { MeComponent } from './me.component';
import { User } from 'src/app/interfaces/user.interface';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: true,
    password: '',
    createdAt: new Date('2024-01-01')
  };

const mockUserService = {
  getById: jest.fn().mockReturnValue(of(mockUser)),
  delete: jest.fn()
};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
      { provide: SessionService, useValue: mockSessionService },
      { provide: UserService, useValue: mockUserService }
    ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // affichage des information de l'utilisateur.
 it('should fetch user data on init', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });
});
