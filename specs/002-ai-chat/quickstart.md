# Quick Start: AI Chat Interface Implementation

## Prerequisites

- Python 3.9+ installed
- Node.js 18+ and npm/yarn installed
- OpenAI API key

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies using Poetry (recommended):
   ```bash
   poetry install
   ```
   
   Or using pip:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key and other configuration
   ```

4. Initialize the database:
   ```bash
   python setup_db.py
   # Or use Alembic to apply migrations
   alembic upgrade head
   ```

5. Run the backend server:
   ```bash
   # Using the run script
   python run_server.py
   
   # Or directly with uvicorn
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your API endpoint and other configuration
   ```

4. Run the development server:
   ```bash
   # Using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   ```

## Key Implementation Points

### Backend Structure

- `src/models/`: Data models (User, ChatSession, Message)
- `src/services/`: Business logic (chat_service, ai_integration_service, encryption_service)
- `src/api/`: API endpoints (auth_routes, chat_routes)

### Frontend Structure

- `src/components/`: Reusable UI components
  - `ChatInterface/`: Core chat functionality components
  - `Sidebar/`: Sidebar with new chat button, chats list, and user profile
- `src/pages/`: Page-level components (ChatPage)
- `src/services/`: API client and state management (Zustand store)

### Data Encryption

- User queries and AI responses must be stored encrypted in the database
- Use the encryption_service for all sensitive data handling
- Follow security-first development practices

### API Integration

- The backend integrates with OpenAI Agent SDK for AI responses
- Rate limiting is implemented (500 requests per user per day)
- All API endpoints require authentication except for login

### Frontend Components

- The UI includes a sidebar with:
  - New Chat Button: Start a new conversation
  - Chats List: Display existing conversations
  - User Profile Section: Show user information
- Main area as conversation interface with text input field
- Input field appears centered when no chat content, repositions to bottom when content exists

## Running Tests

### Backend Tests

```bash
# Run all backend tests
pytest

# Run with coverage
pytest --cov=src
```

### Frontend Tests

```bash
# Run all frontend tests
npm run test

# Or with yarn
yarn test
```

## Key Endpoints

- `POST /auth/login` - User authentication
- `GET /chats` - Get user's chat sessions
- `POST /chats` - Create new chat session
- `GET /chats/{chatId}` - Get specific chat session
- `GET /chats/{chatId}/messages` - Get messages in chat session
- `POST /chats/{chatId}/messages` - Send message to AI

## Architecture Notes

- Clean architecture with clear separation of concerns
- Asynchronous handling for non-blocking interface
- Error handling with user-friendly messages and retry options
- Type safety with Python type hints and TypeScript