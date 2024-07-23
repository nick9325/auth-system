# Authentication/Authorization Web App

This project is a web application with authentication and authorization features. It includes user registration, login, profile management, and theme toggling, with end-to-end testing. The frontend is built using Next.js and Tailwind CSS, while the backend uses FastAPI, MySQL and JWT for authentication.

## Features

### Frontend (Next.js and Tailwind CSS)
1. Sign Up
2. Sign In
3. Sign Out
4. Update Profile
5. Delete Profile
6. Dark/Light Mode Toggle
7. Jest and Cypress (E2E) Test Cases

### Backend (FastAPI, MySQL and JWT)
1. **POST /login** - Login for Access Token
2. **POST /users/** - Register User
3. **GET /users/me/** - Read current user
4. **PUT /users/{user_id}** - Update User
5. **DELETE /users/{user_id}** - Delete User
6. Pytest Test Cases

## Test Cases Summary 

### Frontend: Jest & Cypress

#### Register / Login 
- Successful register / login
- Register / login with empty fields
- Register / login with invalid email
- Password mismatch during registration

#### Home Page 
- Display user data after login
- When the user clicks on the Sign out button, it should trigger the sign-out process
- Update button should update user data / form validations for it
- Delete profile button should delete profile and redirect to registration
- The complete flow has been tested from start to end using Cypress

### Backend: Pytest
- Create user / create duplicate user
- Login / login with incorrect credentials
- Read current user / read current user with no-token
- Update user / update user while email already exists / update user while user doesn’t exist
- Delete user / delete user while user doesn’t exist
