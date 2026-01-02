import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';

describe('ListComponent – Integration', () => {
  let fixture: ComponentFixture<ListComponent>;
  let component: ListComponent;

  const mockSessions = [
    {
      id: 1,
      name: 'Yoga morning',
      date: new Date(),
      description: 'Relax',
    },
    {
      id: 2,
      name: 'Yoga evening',
      date: new Date(),
      description: 'Stretch',
    }
  ];

  const mockSessionApiService = {
    all: jest.fn()
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  beforeEach(async () => {
    mockSessionApiService.all.mockReturnValue(of(mockSessions));

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display sessions list', () => {
    const native = fixture.nativeElement;

    const cards = native.querySelectorAll('.item');

    expect(mockSessionApiService.all).toHaveBeenCalled();
    expect(cards.length).toBe(2);
    expect(native.textContent).toContain('Yoga morning');
    expect(native.textContent).toContain('Yoga evening');
  });

  it('should show admin buttons when user is admin', () => {
    const native = fixture.nativeElement;

    const createButton = native.querySelector('button[routerlink="create"]');
    const editButtons = native.querySelectorAll(
        'button[ng-reflect-router-link^="update"]'
    );

    expect(createButton).toBeTruthy();
    expect(editButtons.length).toBe(2);
  });
});
