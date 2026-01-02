/// <reference types="cypress" />

describe('Create session – E2E (admin)', () => {

  it('should allow admin to create a session', () => {

    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        token: 'admin-token',
        type: 'Bearer',
        id: 1,
        username: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        admin: true
      }
    }).as('login');

    cy.intercept('GET', '**/api/session', {
      statusCode: 200,
      body: []
    }).as('sessions');

    cy.intercept('GET', '**/api/teacher', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'Jane', lastName: 'Doe' }
      ]
    }).as('teachers');

    cy.intercept('POST', '**/api/session', {
      statusCode: 200,
      body: {
        id: 10,
        name: 'Yoga advanced',
        description: 'Hard session',
        date: '2026-02-01',
        teacher_id: 1
      }
    }).as('createSession');

    cy.visit('/login');

    cy.get('input[formControlName="email"]').type('admin@test.com');
    cy.get('input[formControlName="password"]').type('password');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');

    cy.wait('@sessions');

    cy.contains('Create').click();

    cy.url().should('include', '/sessions/create');

    cy.wait('@teachers');

    cy.get('input[formControlName="name"]').type('Yoga advanced');
    cy.get('input[formControlName="date"]').type('2026-02-01');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Jane Doe').click();
    cy.get('textarea[formControlName="description"]').type('Hard session');

    cy.get('button[type="submit"]').click();

    cy.wait('@createSession');

    cy.url().should('include', '/sessions');
  });

});
