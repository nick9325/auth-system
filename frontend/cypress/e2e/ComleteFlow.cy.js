

// cypress = require('cypress')

describe('Complete Flow', () => {

    it('Auth app', () => {

        
        //register
        cy.visit('/register')

        cy.intercept('POST', 'http://127.0.0.1:8000/users/', {
          statusCode: 200,
        }).as('registerUser')
    
        cy.get('input[name="name"]').type('Nikhil Magar')
        cy.get('input[name="email"]').type('nikhildmagar@gmail.com')
        cy.get('input[name="password"]').type('Password123')
        cy.get('input[name="confirm-password"]').type('Password123')
    
        cy.get('button[type="submit"]').click()
    
        cy.wait('@registerUser').then((interception) => {
          expect(interception.response.statusCode).to.eq(200)
        })
    
        cy.contains('Signed Up successfully!').should('be.visible');
        cy.url().should('include', '/login')


        //login
        cy.intercept('POST', 'http://127.0.0.1:8000/login', {
            statusCode: 200,
            body: {
              access_token: 'valid_token'
            }
          }).as('loginRequest');
      
          cy.get('input[name="email"]').type('nikhildmagar@gmail.com');
          cy.get('input[name="password"]').type('password123');
          cy.get('button').contains('Sign In').click();
          cy.wait('@loginRequest');
          cy.contains('Signed In successfully!').should('be.visible');


   

          //fetch user
          cy.intercept({
            method: 'GET',
            url: 'http://127.0.0.1:8000/users/me/',
            headers: {
              Authorization: 'Bearer valid_token'
            }
          }, {
            statusCode: 200,
            body: {
              id: 5,
              name: 'Nikhil Magar',
              email: 'nikhildmagar@gmail.com'
            }
          }).as('fetchUser');

          cy.wait('@fetchUser');
          cy.contains('Welcome, Nikhil Magar').should('be.visible');
          cy.contains('You have successfully logged in').should('be.visible');
          cy.get('button[name="signout"]').should('be.visible');
          cy.get('button[name="update"]').should('be.visible');
          cy.get('button[name="delete"]').should('be.visible');




          //signout
          cy.get('button[name="signout"]').click();
      
          cy.url().should('include', '/login');



          //login
        cy.intercept('POST', 'http://127.0.0.1:8000/login', {
            statusCode: 200,
            body: {
              access_token: 'valid_token'
            }
          }).as('loginRequest');
      
          cy.get('input[name="email"]').type('nikhildmagar@gmail.com');
          cy.get('input[name="password"]').type('password123');
          cy.get('button').contains('Sign In').click();
          cy.wait('@loginRequest');
          cy.contains('Signed In successfully!').should('be.visible');


          //update user
        
          cy.wait('@fetchUser');

          cy.get('button[name="update"]').click();
          cy.url().should('include', '/update/');


          cy.get('input[name="name"]').type('New Name');
          cy.get('input[name="email"]').type('newemail@example.com');
          cy.intercept('PUT', '**/users/*', {
            statusCode: 200,
            body: { name: 'New Name', email: 'newemail@example.com' }
          }).as('updateUser');
      
          cy.contains('Save').click();
          cy.wait('@updateUser');
          cy.contains('Profile updated successfully!').should('be.visible');


          cy.intercept({
            method: 'GET',
            url: 'http://127.0.0.1:8000/users/me/',
            headers: {
              Authorization: 'Bearer valid_token'
            }
          }, {
            statusCode: 200,
            body: {
              id: 5,
              name: 'New Name',
              email: 'newname@example.com'
            }
          }).as('fetchUser');

   
     

          //delete user

          cy.intercept({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/users/*`,
            headers: {
              Authorization: 'Bearer valid_token'
            }
          }, {
            statusCode: 200
          }).as('deleteUser');
      
      
          cy.get('button[name="delete"]').click();
          cy.contains('Yes, I\'m sure').click();
      
          cy.wait('@deleteUser');
      
          cy.contains('Profile deleted successfully!').should('be.visible');
          cy.url().should('include', '/register');





      });
    


  afterEach(() => {
    localStorage.clear();
    cy.visit('login')
  });

    

})
  
  
  