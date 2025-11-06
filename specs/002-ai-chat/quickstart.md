# Quickstart Guide: AI Chat Interface

## Prerequisites

- Python 3.9+
- Node.js 18+ (for frontend development)
- PostgreSQL 12+
- OpenAI API key
- Docker and Docker Compose (optional, for containerized setup)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key and database connection string
   ```

5. Run database migrations:
   ```bash
   python setup_db.py
   ```

6. Start the backend server:
   ```bash
   python run_server.py
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and set the backend API URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/ai_chat_db
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

## Running Tests

### Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/unit/test_chat_service.py
```

### Frontend Tests
```bash
# Run all tests
npm run test

# Run component tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e
```

## API Documentation

The API documentation is automatically available at `http://localhost:8000/docs` when the backend is running. This includes endpoints for:
- Authentication
- Chat session management
- Message handling
- User management

## Database Migrations

To create a new migration after changing models:
```bash
alembic revision --autogenerate -m "Description of changes"
```

To apply migrations:
```bash
alembic upgrade head
```

## Docker Setup (Optional)

To run the entire application using Docker:

1. Build and start services:
   ```bash
   docker-compose up --build
   ```

2. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Database: PostgreSQL on localhost:5432