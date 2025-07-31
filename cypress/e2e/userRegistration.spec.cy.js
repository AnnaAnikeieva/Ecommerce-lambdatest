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

        // Agree to the subscription
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

    it('registration without consent to a subscription', () => {

        const timestamp = new Date().getTime();
        const firstName = `TestUser${timestamp}`;
        const lastName = `LastName${timestamp}`;
        const email = `testuser${timestamp}@example.com`;
        const telephone = `1234567890${Math.floor(Math.random() * 100)}`;
        const password = 'Password123!';

        // Fill out the form
        cy.get('#input-firstname').type(firstName);
        cy.get('#input-lastname').type(lastName);
        cy.get('#input-email').type(email);
        cy.get('#input-telephone').type(telephone);
        cy.get('#input-password').type(password);
        cy.get('#input-confirm').type(password);

        // Opt-out of the subscription
        cy.get('input[id="input-newsletter-no"]').check({force: true}); 
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


    // - negative case -

    it('displaying an error when submitting an empty form', () => {
        // Submit form
        cy.get('input[type="submit"]').click();

        // Checking for error messages for mandatory fields
        cy.get('.text-danger').should('have.length.at.least', 5); // Expect a minimum of 5 errors
        cy.contains('Warning: You must agree to the Privacy Policy!').should('be.visible');
        cy.contains('First Name must be between 1 and 32 characters!').should('be.visible');
        cy.contains('Last Name must be between 1 and 32 characters!').should('be.visible');
        cy.contains('E-Mail Address does not appear to be valid!').should('be.visible');
        cy.contains('Telephone must be between 3 and 32 characters!').should('be.visible');
        cy.contains('Password must be between 4 and 20 characters!').should('be.visible');
        cy.url().should('include', 'account/register');
    });

    it('displaying a native browser error for an invalid email format', () => {
        const timestamp = new Date().getTime();
        const firstName = `TestUser${timestamp}`;
        const lastName = `LastName${timestamp}`;
        const invalidEmail = `testuser${timestamp}example.com`;
        const telephone = `1234567890${Math.floor(Math.random() * 100)}`;
        const password = 'Password123!';

        cy.get('#input-firstname').type(firstName);
        cy.get('#input-lastname').type(lastName);

        cy.get('#input-email')
          .type(invalidEmail)
          .blur(); //enter an invalid email address and immediately remove the focus to trigger native validation

        cy.get('#input-telephone').type(telephone);
        cy.get('#input-password').type(password);
        cy.get('#input-confirm').type(password);

        // Check the ‘validity’ property of the #input-email element
        // It should be set to invalid after blur()
        cy.get('#input-email')
            .should('have.prop', 'validity')
            .its('typeMismatch') // 'typeMismatch' will be true if the email does not match the format
            .should('be.true');

        // Check the error message generated by the browser itself
        cy.get('#input-email')
            .should('have.prop', 'validationMessage')
            .should('include', 'Please include an \'@\' in the email address.')
            .and('include', invalidEmail); // the message contains an invalid email address

        // the URL will not change if the form was not submitted successfully
        cy.url().should('include', 'account/register');
    });

    it('should display an error when passwords do not match', () => {
    const timestamp = new Date().getTime();
    const firstName = `TestUser${timestamp}`;
    const lastName = `LastName${timestamp}`;
    const email = `testuser${timestamp}@example.com`;
    const telephone = `1234567890${Math.floor(Math.random() * 100)}`;
    const password = 'Password123!';
    const confirmPassword = 'DifferentPassword!';


    cy.get('#input-firstname').type(firstName);
    cy.get('#input-lastname').type(lastName);
    cy.get('#input-email').type(email);
    cy.get('#input-telephone').type(telephone);
    cy.get('#input-password').type(password);
    cy.get('#input-confirm').type(confirmPassword); // invalid password
    cy.get('input[name="agree"]').check({force: true});

    cy.get('input[type="submit"]').click();

    cy.contains('Password confirmation does not match password!').should('be.visible');
    cy.url().should('include', 'account/register');
    });

    it('should display an error when password is too short', () => {

        const timestamp = new Date().getTime();
        const firstName = `TestUser${timestamp}`;
        const lastName = `LastName${timestamp}`;
        const email = `testuser${timestamp}@example.com`;
        const telephone = `1234567890${Math.floor(Math.random() * 100)}`;
        const shortPassword = '123';


        cy.get('#input-firstname').type(firstName);
        cy.get('#input-lastname').type(lastName);
        cy.get('#input-email').type(email);
        cy.get('#input-telephone').type(telephone);
        cy.get('#input-password').type(shortPassword);
        cy.get('#input-confirm').type(shortPassword);
        cy.get('input[name="agree"]').check({force: true});

        cy.get('input[type="submit"]').click();

        cy.contains('Password must be between 4 and 20 characters!').should('be.visible');
        cy.url().should('include', 'account/register');
    });

    it('should display an error when user tries to register with an already existing email', () => {

        // User registration
        const existingEmail = `existinguser${new Date().getTime()}@test.com`; // unique email for this test only

        cy.visit(registrationPageUrl);
        cy.get('#input-firstname').type('Existing');
        cy.get('#input-lastname').type('User');
        cy.get('#input-email').type(existingEmail);
        cy.get('#input-telephone').type(`111222333${Math.floor(Math.random() * 100)}`);
        cy.get('#input-password').type('ExistingPass123!');
        cy.get('#input-confirm').type('ExistingPass123!');
        cy.get('input[name="agree"]').check({force: true});
        cy.get('input[type="submit"]').click();
        cy.url().should('include', 'account/success'); // make sure that the first user has been created


        // Try to register with the same email address
        cy.visit(registrationPageUrl);
        cy.get('.list-group > [href="https://ecommerce-playground.lambdatest.io/index.php?route=account/logout"]').click();
        cy.get('.buttons > .btn').click();

        cy.visit(registrationPageUrl);

        const timestamp = new Date().getTime();

        cy.get('#input-firstname').type(`SecondTry${timestamp}`);
        cy.get('#input-lastname').type(`SecondTry${timestamp}`);
        cy.get('#input-email').type(existingEmail);
        cy.get('#input-telephone').type(`987654321${Math.floor(Math.random() * 100)}`);
        cy.get('#input-password').type('NewPassword123!');
        cy.get('#input-confirm').type('NewPassword123!');
        cy.get('input[name="agree"]').check({force: true});

        cy.get('input[type="submit"]').click();


        // Checking the error message
        cy.contains('Warning: E-Mail Address is already registered!').should('be.visible');
        cy.url().should('include', 'account/register');
    });

    it('should display an error if privacy policy is not agreed to', () => {

        const timestamp = new Date().getTime();
        const firstName = `NoAgreeUser${timestamp}`;
        const lastName = `NoAgree${timestamp}`;
        const email = `noagree${timestamp}@test.com`;
        const telephone = `1234567892${Math.floor(Math.random() * 100)}`;
        const password = 'Password123!';


        cy.get('#input-firstname').type(firstName);
        cy.get('#input-lastname').type(lastName);
        cy.get('#input-email').type(email);
        cy.get('#input-telephone').type(telephone);
        cy.get('#input-password').type(password);
        cy.get('#input-confirm').type(password);

        // We do not agree to the privacy policy
        cy.get('input[type="submit"]').click();


        // Checking for error message
        cy.contains('Warning: You must agree to the Privacy Policy!').should('be.visible');
        cy.url().should('include', 'account/register');
    });
});