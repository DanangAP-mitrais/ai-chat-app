# Quickstart Guide: User Authentication

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Poetry (for Python dependency management)

### Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

3. Activate the virtual environment:
   ```bash
   poetry shell
   ```

4. Set up the database and run migrations:
   ```bash
   make setup-db  # This will create the database and run initial migrations
   ```

5. Start the backend server:
   ```bash
   make run-dev  # Starts the FastAPI server in development mode
   ```

### Setup Frontend

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

## API Endpoints

### Registration
- **POST** `/auth/register`
- Body: `{ "fullname": "John Doe", "email": "john@example.com", "password": "SecurePass123!" }`
- Response: User object with ID and basic information

### Login
- **POST** `/auth/login`
- Body: `{ "email": "john@example.com", "password": "SecurePass123!" }`
- Response: JWT token with expiration information

### Logout
- **POST** `/auth/logout`
- Headers: `{ "Authorization": "Bearer <your-jwt-token>" }`
- Response: Success confirmation

## Environment Variables

### Backend
- `DATABASE_URL` - Database connection string (default: sqlite:///./auth.db)
- `SECRET_KEY` - Secret key for JWT signing
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time (default: 30 minutes)

### Frontend
- `VITE_API_URL` - Base URL for API calls (default: http://localhost:8000)

## Testing

### Backend Tests
Run backend tests using pytest:
```bash
make test
```

### Frontend Tests
Run frontend tests:
```bash
npm run test
```

## Running in Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   make run-prod
   ```