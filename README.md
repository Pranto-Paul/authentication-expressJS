# Backend API for User Authentication

## Description

A robust and secure backend API built with Express.js and MongoDB that provides complete user authentication functionality including registration, email verification, login, profile management, password reset, and logout. The API uses JWT tokens stored in HTTP‑only cookies and integrates with Mailtrap for email testing during development.

## Features
- User registration with password hashing (bcryptjs)

- Email verification using a unique token sent via Mailtrap (or any SMTP provider)

- User login with JWT token generation and HTTP‑only cookie storage

- Protected routes (e.g., user profile) via JWT middleware

- User logout (cookie clearing)

- Forgot password / reset password functionality with time‑limited tokens

- Role‑based authorization (user / admin) – prepared for future extensions

- MongoDB connection with Mongoose ODM

- CORS enabled for frontend at http://localhost:3000

- Environment variable configuration with dotenv

- Error handling and validation on all endpoints

## Tech Stack
- Runtime: Bun

- Framework: Express.js 5.x

- Database: MongoDB with Mongoose ODM

- Authentication: JSON Web Tokens (JWT), bcryptjs

- Email: Nodemailer (Mailtrap for development)

- Other: cookie-parser, cors, dotenv

## Prerequisites
- Node.js (v18 or higher recommended) or Bun

- MongoDB (local installation or Atlas cloud database)

- A Mailtrap account (or any SMTP provider) for email testing

- npm / yarn / bun (package manager)

## Installation
1. clone the repository
```bash
git clone https://github.com/Pranto-Paul/authentication-expressJS.git
cd authentication-expressJS
```
2. install dependencies
```bash
bun install 
or
npm install
```
3. set up environment variable
Create a **.env** file in the root directory and add the variables listed in the Configuration section.

4.run the development server
```bash
bun run dev
or 
npm run dev
```

The server will start at *http://localhost:3001* (or the port specified in PORT).

## API Documentation
All endpoints are prefixed with /api/v1/users.

## Public Endpoints

### ***POST /register / verify***
Register a new user. Sends a verification email.

#### Request body:
```json
{
  "name": "Pranto Paul",
  "email": "prantopaul55555@gmail.com",
  "password": "secret123"
}
```

Response: ***201 Created*** with success message.

## ***GET /verify/:token***
Verify user email using the **token** sent via email.

Response: ***200 OK*** with verification success message.

## ***POST/login***
Authenticate user and set ***JWT cookie***.

#### Request body:
```json
{
  "email": "prantopaul55555@gmail.com",
  "password": "secret123"
}
```
Response: ***200 OK*** with user data (excluding password) and token (also sent in cookie).

## ***POST /forgot-password***
#### Request body:
```json
{
    "email":"prantopaul55555@gmail.com"
}
```
Response: ***200 OK*** with message that reset email was sent.

## ***POST /reset-password/:token***
Reset password using token recived via email

Request body:
```json
{
  "password": "newpassword123"
}
```
Response: ***200 OK** on success.

## Protected Endpoints (require authentication)
Get the currently authenticated user's profile.

Headers: Cookie with **token** (automatically sent by browser if cookie is set).
Response: ***200 OK*** with user data.

## ***GET /logout***
Clear the authentication cookie and log out the user.

Response: ***200 OK*** with logout message.

## Project Structure
```text
.
├── controller
│   └── user.controller.js      # All route handlers (register, login, etc.)
├── middleware
│   └── auth.middleware.js      # JWT verification middleware
├── model
│   └── User.model.js           # Mongoose user schema and model
├── router
│   └── user.router.js          # Express routes for /api/v1/users
├── utils
│   ├── db.js                    # MongoDB connection utility
│   └── sendMail.js              # Nodemailer transporter and email sender
├── .env                         # Environment variables (not committed)
├── .gitignore
├── index.js                     # Main application entry point
├── package.json
└── README.md

```
## Contributing
Contributions are welcome! To contribute:

1. Fork the repository.

2. Create a new branch for your feature or bugfix: git checkout -b feature/your-feature-name

3. Make your changes, following the existing code style and conventions.

4. Write clear, descriptive commit messages.

5. Ensure the server runs without errors and all tests pass (if any).

6. Push to your fork and open a pull request against the main branch.

Please keep your pull requests focused and avoid unrelated changes. For major changes, open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License. See the LICENSE file for details.