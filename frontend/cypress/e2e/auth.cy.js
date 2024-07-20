

// cypress = require('cypress')

describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should show error for missing name', () => {
    cy.get('input[name="email"]').type('nikhildmagar@gmail.com')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm-password"]').type('Password123')

    cy.get('button[type="submit"]').click()

    cy.contains("Name required!").should('be.visible');
  })

  it('should show error for missing email', () => {
    cy.get('input[name="name"]').type('Nikhil Magar')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm-password"]').type('Password123')

    cy.get('button[type="submit"]').click()

    cy.contains("Email required!").should('be.visible');
  })

  it('should show error for invalid email', () => {
    cy.get('input[name="name"]').type('Nikhil Magar')
    cy.get('input[name="email"]').type('invalid-email')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm-password"]').type('Password123')

    cy.get('button[type="submit"]').click()

    cy.contains("Please enter valid email!").should('be.visible');

  })

  it('should show error for missing password', () => {
    cy.get('input[name="name"]').type('Nikhil Magar')
    cy.get('input[name="email"]').type('nikhildmagar@gmail.com')
    cy.get('input[name="confirm-password"]').type('Password123')

    cy.get('button[type="submit"]').click()

    cy.contains("Password required!").should('be.visible');
  })

  it('should show error for missing confirm password', () => {
    cy.get('input[name="name"]').type('Nikhil Magar')
    cy.get('input[name="email"]').type('nikhildmagar@gmail.com')
    cy.get('input[name="password"]').type('Password123')

    cy.get('button[type="submit"]').click()

    cy.contains("Confirm password required!").should('be.visible');

  })

  it('should show error for mismatched passwords', () => {
    cy.get('input[name="name"]').type('Nikhil Magar')
    cy.get('input[name="email"]').type('nikhildmagar@gmail.com')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="confirm-password"]').type('DifferentPassword')

    cy.get('button[type="submit"]').click()

    cy.contains("Passwords mismatched!").should('be.visible');
  })

  it('should register a user successfully', () => {
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

    cy.url().should('include', '/login')
  })

})


describe('Sign In', () => {

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should render the login form', () => {
    cy.get('h1').contains('Sign In');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button').contains('Sign In');
  });

  it('should display an error when email is empty', () => {
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign In').click();
    cy.contains('Email required!').should('be.visible');
  });

  it('should display an error when password is empty', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button').contains('Sign In').click();
    cy.contains('Password required!').should('be.visible');
  });

  it('should display an error for invalid email format', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign In').click();
    cy.contains('Please enter valid email!').should('be.visible');
  });

  it('should display an error for invalid credentials', () => {
    cy.intercept('POST', 'http://127.0.0.1:8000/login', {
      statusCode: 404,
    }).as('loginRequest');

    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign In').click();
    cy.wait('@loginRequest');
    cy.contains("User doesn't exists!").should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', 'http://127.0.0.1:8000/login', {
      statusCode: 200,
      body: {
        access_token: 'valid_token'
      }
    }).as('loginRequest');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign In').click();
    cy.wait('@loginRequest');
    cy.contains('Signed In successfully!').should('be.visible');
  });
});


describe('Homepage', () => {

  beforeEach(() => {
    localStorage.setItem('token', 'valid_token');

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

    cy.visit('/');
  });



  it('should display a loader while fetching user data', () => {
    cy.get('[role="status"]').should('be.visible');

    cy.wait('@fetchUser');

    cy.get('[role="status"]').should('not.exist');
  });


  it('should fetch and display user data', () => {
    cy.wait('@fetchUser');
    cy.contains('Welcome, Nikhil Magar').should('be.visible');
    cy.contains('You have successfully logged in').should('be.visible');
    cy.get('button[name="signout"]').should('be.visible');
    cy.get('button[name="update"]').should('be.visible');
    cy.get('button[name="delete"]').should('be.visible');
  });

  it('should handle sign out', () => {
    cy.wait('@fetchUser');

    cy.get('button[name="signout"]').click();

    cy.url().should('include', '/login');
  });


  it('should redirect to login page if token is invalid', () => {

    cy.intercept({
      method: 'GET',
      url: 'http://127.0.0.1:8000/users/me/',
      headers: {
        Authorization: 'Bearer invalid_token'
      }
    }, {
      statusCode: 401
    }).as('fetchUserInvalidToken');

    localStorage.setItem('token', 'invalid_token');


    cy.wait('@fetchUserInvalidToken');

    cy.url().should('include', '/login');
  });


  it('should handle profile update', () => {
    cy.get('button[name="update"]').click();
    cy.url().should('include', '/update/');
  });

  it('should open and close delete modal', () => {
    cy.get('button[name="delete"]').click();
    cy.contains('Are you sure you want to delete your profile?').should('be.visible');
    cy.contains('No, cancel').click();
    cy.contains('Are you sure you want to delete your profile?').should('not.exist');
  });

  it('should handle user not found error', () => {


    cy.wait('@fetchUser');

    cy.intercept({
      method: 'DELETE',
      url: `http://127.0.0.1:8000/users/*`,
      headers: {
        Authorization: 'Bearer valid_token'
      }
    }, {
      statusCode: 404,
      body: { detail: "User doesn't exist" }
    }).as('deleteUser');


    cy.get('button[name="delete"]').click();
    cy.contains('Yes, I\'m sure').click();

    cy.wait('@deleteUser');

    cy.contains("User doesn't exist!").should('be.visible');
  });

  it('should handle profile deletion', () => {
    cy.wait('@fetchUser');

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


  });

  afterEach(() => {
    localStorage.clear();
  });


});


describe('Update Profile', () => {
  beforeEach(() => {
    cy.visit('/update/1');
    localStorage.setItem('token', 'your-token-here');
  });

  it('should display update profile form', () => {
    cy.contains('Update profile').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
  });


  it('should handle empty name', () => {
    cy.get('input[name="email"]').type('invalidemail');
    cy.contains('Save').click();
    cy.contains('Name required!').should('be.visible');
  });

  it('should handle empty email', () => {
    cy.get('input[name="name"]').type('New Name');
    cy.contains('Save').click();
    cy.contains('Email required!').should('be.visible');
  });

  it('should validate email format', () => {
    cy.get('input[name="name"]').type('New Name');
    cy.get('input[name="email"]').type('invalidemail');
    cy.contains('Save').click();
    cy.contains('Please enter valid email!').should('be.visible');
  });


  it('should handle cancel button', () => {
    cy.contains('Cancel').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });



  it('should handle profile update', () => {
    cy.get('input[name="name"]').type('New Name');
    cy.get('input[name="email"]').type('newemail@example.com');
    cy.intercept('PUT', '**/users/*', {
      statusCode: 200,
      body: { name: 'New Name', email: 'newemail@example.com' }
    }).as('updateUser');

    cy.contains('Save').click();
    cy.wait('@updateUser');
    cy.contains('Profile updated successfully!').should('be.visible');
  });


  it('should handle profile update for user already exists', () => {
    cy.get('input[name="name"]').type('New Name');
    cy.get('input[name="email"]').type('newemail@example.com');
    cy.intercept('PUT', '**/users/*', {
      statusCode: 400,
      body: { name: 'New Name', email: 'newemail@example.com' }
    }).as('updateUser');

    cy.contains('Save').click();
    cy.wait('@updateUser');
    cy.contains('User already exists!').should('be.visible');
  });


  it('should handle profile update for user not found', () => {
    cy.get('input[name="name"]').type('New Name');
    cy.get('input[name="email"]').type('newemail@example.com');
    cy.intercept('PUT', '**/users/*', {
      statusCode: 404,
      body: { name: 'New Name', email: 'newemail@example.com' }
    }).as('updateUser');

    cy.contains('Save').click();
    cy.wait('@updateUser');
    cy.contains("User doesn't exists!").should('be.visible');
  });

});



