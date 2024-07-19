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
