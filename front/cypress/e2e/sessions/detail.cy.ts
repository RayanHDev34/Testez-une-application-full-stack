/// <reference types="cypress" />

describe('Session detail – E2E', () => {

  it('should display session detail when clicking on Detail', () => {

    // 🔐 LOGIN
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

    // 📋 LISTE DES SESSIONS
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
        }
      ]
    }).as('sessions');

    // 🔍 DÉTAIL SESSION
    cy.intercept('GET', '**/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Yoga morning',
        description: 'Relax session',
        date: '2026-01-01',
        teacher_id: 1,
        users: [1],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
      }
    }).as('sessionDetail');

    // 👤 PROF
    cy.intercept('GET', '**/api/teacher/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe'
      }
    }).as('teacher');

    // 🚀 VISIT LOGIN
    cy.visit('/login');

    cy.get('input[formControlName="email"]').type('test@test.com');
    cy.get('input[formControlName="password"]').type('password');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');

    // 📄 ASSERT LIST PAGE
    cy.wait('@sessions');
    cy.contains('Yoga morning').should('be.visible');

    // 👉 CLICK DETAIL
    cy.contains('Detail').click();

    // 📄 ASSERT DETAIL PAGE
    cy.wait('@sessionDetail');
    cy.wait('@teacher');

    cy.url().should('include', '/sessions/detail/1');

    // ✅ CONTENU
    cy.contains('Yoga Morning').should('be.visible');
    cy.contains('Relax session').should('be.visible');
    cy.contains('Jane DOE').should('be.visible');
  });

});
