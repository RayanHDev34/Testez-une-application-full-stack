describe('Register – E2E', () => {
    it('should register a user and redirect to login', () => {
        cy.intercept('POST', '**/register', {
        statusCode: 200
        }).as('register');

        cy.visit('/register');

        cy.get('input[formControlName="firstName"]').type('John');
        cy.get('input[formControlName="lastName"]').type('Doe');
        cy.get('input[formControlName="email"]').type('john.doe@test.com');
        cy.get('input[formControlName="password"]').type('password');

        cy.get('button[type="submit"]').click();

        cy.wait('@register');
        cy.url().should('include', '/login');
    });
    it('should display error message when register fails', () => {
        cy.intercept('POST', '**/register', {
            statusCode: 400,
            body: { message: 'Register failed' }
        });

        cy.visit('/register');

        cy.get('input[formControlName="firstName"]').type('John');
        cy.get('input[formControlName="lastName"]').type('Doe');
        cy.get('input[formControlName="email"]').type('john@test.com');
        cy.get('input[formControlName="password"]').type('password');

        cy.get('button[type="submit"]').click();

        cy.get('.error').should('be.visible');
    }); 
});