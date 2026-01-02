/// <reference types="cypress" />

describe('Session detail – E2E', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        type: 'Bearer',
        id: 1,
        username: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        admin: true
      }
    }).as('login');

    cy.intercept('GET', '**/sessions/1', {
      id: 1,
      name: 'Yoga session',
      description: 'Relaxing yoga',
      date: new Date().toISOString(),
      users: [1],
      teacher_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }).as('sessionDetail');

    cy.intercept('GET', '**/teachers/1', {
      id: 1,
      firstName: 'John',
      lastName: 'Doe'
    });

    cy.visit('/login');

    cy.get('input[formControlName="email"]').type('admin@test.com');
    cy.get('input[formControlName="password"]').type('password');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
  });

  it('should display session details when user is logged in', () => {
    cy.visit('/sessions/detail/1');

    cy.wait('@sessionDetail');
    cy.contains('Yoga session').should('be.visible');
    cy.contains('Relaxing yoga').should('be.visible');
    cy.contains('attendees').should('exist');
  });
});
