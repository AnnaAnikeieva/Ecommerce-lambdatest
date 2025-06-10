/// <reference types="cypress" />

describe('User Registration Tests', () => {
    const baseUrl = 'https://ecommerce-playground.lambdatest.io/index.php?route=common/home';
    const registrationPageUrl = 'https://ecommerce-playground.lambdatest.io/index.php?route=account/register';

    beforeEach(() => {
        cy.visit(baseUrl);
        cy.get('li.nav-item.dropdown-hoverable > a.nav-link.dropdown-toggle')
        .contains('My account') // Ensure it's the 'My account' link
        .as('myAccountHoverElement'); // Assign an alias for reuse
        cy.get('@myAccountHoverElement').trigger('mouseover');
        
        cy.get('ul.mz-sub-menu-96.dropdown-menu')
        .should('be.visible')
        .find('a[href*="account/register"]') // Inside it we look for a link to "Register"
        .should('be.visible')
        .click();

        cy.url().should('include', registrationPageUrl);
        cy.get('h1').should('contain', 'Register Account');
    });

    // - positive case -

    it('successful user registration with valid data', () => {
        // Generate unique data for the user
        const timestamp = new Date().getTime();
        const firstName = `TestUser${timestamp}`;
        const lastName = `LastName${timestamp}`;
        const email = `testuser${timestamp}@example.com`;
        const telephone = `1234567890${Math.floor(Math.random() * 100)}`; // Add random numbers
        const password = 'Password123!';

        // Fill out the form
        cy.get('#input-firstname').type(firstName);
        cy.get('#input-lastname').type(lastName);
        cy.get('#input-email').type(email);
        cy.get('#input-telephone').type(telephone);
        cy.get('#input-password').type(password);
        cy.get('#input-confirm').type(password);

        // Agree to the privacy policy
        cy.get('input[id="input-newsletter-yes"]').check({force: true}); 
        cy.get('input[id="input-agree"]').check({force: true});

        // Submit form
        cy.get('input[type="submit"]').click();

        // Checking that registration was successful
        cy.url().should('include', 'account/success');
        cy.get('h1').should('contain', 'Your Account Has Been Created!');
        cy.contains('Congratulations! Your new account has been successfully created!').should('be.visible');
        cy.get('#content > :nth-child(6) > a').should('be.visible').and('contain', 'contact us');
        cy.get('.buttons > .btn').should('be.visible').and('contain', 'Continue');
        cy.get('#column-right').should('be.visible');
        cy.get('@myAccountHoverElement').trigger('mouseover');
        const postLoginDropdownSelector = '#widget-navbar-217834 > .navbar-nav > :nth-child(6) > .dropdown-menu';
        cy.get(postLoginDropdownSelector).should('be.visible');

        // 3. Checking if each item is in this list
        cy.get(postLoginDropdownSelector).contains('Dashboard').should('be.visible');
        cy.get(postLoginDropdownSelector).contains('My order').should('be.visible');
        cy.get(postLoginDropdownSelector).contains('Return').should('be.visible');
        cy.get(postLoginDropdownSelector).contains('Tracking').should('be.visible');
        cy.get(postLoginDropdownSelector).contains('My voucher').should('be.visible');
        cy.get(postLoginDropdownSelector).contains('Logout').should('be.visible');
    });

});