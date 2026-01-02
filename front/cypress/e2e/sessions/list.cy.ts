/// <reference types="cypress" />

describe('Session List – after login', () => {

  it('should display sessions list after login', () => {

    // 1️⃣ Mock LOGIN
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        type: 'Bearer',
        id: 1,
        username: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      }
    }).as('login');

    cy.intercept('GET', '**/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Yoga morning',
          description: 'Relax session',
          date: '2026-01-01',
          teacher_id: 1,
          users: []
        },
        {
          id: 2,
          name: 'Yoga evening',
          description: 'Stretch session',
          date: '2026-01-02',
          teacher_id: 2,
          users: []
        }
      ]
    }).as('sessions');

    cy.visit('/login');

    cy.get('input[formControlName="email"]').type('test@test.com');
    cy.get('input[formControlName="password"]').type('password');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');

    cy.window().then(win => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify({
          token: 'fake-token',
          id: 1,
          admin: false
        })
      );
    });

    cy.url().should('include', '/sessions');
    cy.wait('@sessions');

    cy.contains('Yoga morning').should('be.visible');
    cy.contains('Yoga evening').should('be.visible');
  });

});
