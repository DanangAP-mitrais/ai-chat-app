# AI Chat App - Authentication Service

This repository contains the authentication service for the AI Chat application.

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, Alembic, JWT
- **Frontend**: React, TypeScript, Vite, Zustand
- **Database**: SQLite (with support for other databases in production)
- **Package Manager**: Poetry (backend), npm (frontend)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

3. Set up the database:
   ```bash
   make setup-db
   ```

4. Run the development server:
   ```bash
   make run-dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User registration with validation
- User login with JWT token management
- Protected routes and session management
- Password hashing using bcrypt
- Form validation on both frontend and backend

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate a user
- `POST /auth/logout` - Logout a user
- `GET /auth/verify` - Verify authentication token

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite+aiosqlite:///./auth.db
```

## Running Tests

Backend tests:
```bash
make test
```

## Development Commands

Available Makefile commands in backend:

- `make install` - Install dependencies
- `make run-dev` - Run development server
- `make test` - Run tests
- `make setup-db` - Setup database
- `make migrate` - Run migrations