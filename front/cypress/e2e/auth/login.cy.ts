describe('Login – E2E', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should allow user to login and redirect to sessions', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      }
    }).as('loginRequest');
    cy.get('input[formcontrolname="email"]')
      .should('be.visible')
      .type('test@test.com');

    cy.get('input[formcontrolname="password"]')
      .should('be.visible')
      .type('password');

    cy.get('button[type="submit"]')
      .should('not.be.disabled')
      .click();

    cy.wait('@loginRequest');

    cy.url().should('include', '/sessions');
    cy.contains('Rentals available').should('be.visible');
  });
  it('should show error message when login fails', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    });

    cy.visit('/login');

    cy.get('input[formControlName="email"]').type('wrong@test.com');
    cy.get('input[formControlName="password"]').type('wrong');
    cy.get('button[type="submit"]').click();

    cy.get('.error').should('be.visible');
  });

});
