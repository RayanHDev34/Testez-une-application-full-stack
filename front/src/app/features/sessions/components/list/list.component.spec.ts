import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }
  const mockSessions: Session[] = [
  {
    id: 1,
    name: 'Morning Yoga',
    description: 'Relaxing session',
    date: new Date(),
    teacher_id: 1,
    users: []
  },
  {
    id: 2,
    name: 'Evening Yoga',
    description: 'Intense session',
    date: new Date(),
    teacher_id: 2,
    users: [1, 2]
  }
];
  const sessionApiServiceMock = {
    all: jest.fn()
  };
  beforeEach(async () => {
   sessionApiServiceMock.all.mockReturnValue(of(mockSessions));
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // test qui affiche la liste des sessions
  it('should display the list of sessions', () => {
    fixture.detectChanges(); // important
    const cards = fixture.nativeElement.querySelectorAll('mat-card.item');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Morning Yoga');
    expect(cards[1].textContent).toContain('Evening Yoga');
  });
  // test qui verifie L’apparition des boutons Create et Detail si
  // l'utilisateur connecté est un admin
  it('should display Create and Detail buttons for admin user', () => {
    fixture.detectChanges(); // important
    const createButton = getButtonByText('Create');
    expect(createButton).toBeTruthy();
    const detailButtons = getButtonsByExactText('Detail');
    console.log(detailButtons);
    expect(detailButtons.length).toBe(2);

expect(detailButtons.length).toBe(2);
  });
  function getButtonsByExactText(
  text: string
): HTMLButtonElement[] {
  const buttons = Array.from(
    fixture.nativeElement.querySelectorAll('span')
  ) as HTMLButtonElement[];

  return buttons.filter(button =>
    button.textContent?.trim() === text
  );
}
  function getButtonByText(text: string): HTMLButtonElement | undefined {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('span')
    ) as HTMLButtonElement[];

    return buttons.find(button =>
      button.textContent?.trim().includes(text)
    );
  }
});
