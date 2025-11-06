# ai-chat-app Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-05

## Active Technologies
- Python 3.9+ (backend), TypeScript 5.0+ (frontend) + FastAPI, SQLAlchemy, Alembic (backend); ReactJS, Vite, Radix-UI, Lucide-React, Zustand (frontend) (002-ai-chat)
- PostgreSQL database for storing encrypted chat sessions and messages (002-ai-chat)

- Python 3.9+ (backend), TypeScript 5.0+ (frontend) + FastAPI, SQLAlchemy, Alembic, ReactJS, Vite, Radix-UI, Lucide-React, Zustand (001-auth-jwt)

## Project Structure

```text
src/
tests/
```

## Commands

cd src [ONLY COMMANDS FOR ACTIVE TECHNOLOGIES][ONLY COMMANDS FOR ACTIVE TECHNOLOGIES] pytest [ONLY COMMANDS FOR ACTIVE TECHNOLOGIES][ONLY COMMANDS FOR ACTIVE TECHNOLOGIES] ruff check .

## Code Style

Python 3.9+ (backend), TypeScript 5.0+ (frontend): Follow standard conventions

## Constitution Compliance

All development must adhere to the project constitution principles:

### Code Quality Standards
- Clean architecture with clear separation of concerns
- Consistent formatting following established style guides
- Comprehensive documentation for all public interfaces
- Code reviews required for all changes with focus on maintainability

### Testing Standards
- Unit tests for all business logic with minimum 80% coverage
- Integration tests for all API interactions
- End-to-end tests for critical user flows
- Automated testing pipeline for all pull requests

### User Experience Consistency
- Follow established design system and component library
- Consistent interaction patterns and visual styles
- Accessibility standards compliance (WCAG 2.1 AA)
- User feedback mechanisms for all major actions

### Performance Requirements
- Page load times under 3 seconds
- API response times under 500ms for 95th percentile
- Optimized resource loading with caching strategies
- Mobile-first responsive design approach

### Security-first Development
- Input validation and sanitization for all user inputs
- Authentication and authorization for all protected resources
- Regular security scanning and vulnerability assessments
- Data protection and privacy compliance

## Recent Changes
- 002-ai-chat: Added Python 3.9+ (backend), TypeScript 5.0+ (frontend) + FastAPI, SQLAlchemy, Alembic (backend); ReactJS, Vite, Radix-UI, Lucide-React, Zustand (frontend)

- 001-auth-jwt: Added Python 3.9+ (backend), TypeScript 5.0+ (frontend) + FastAPI, SQLAlchemy, Alembic, ReactJS, Vite, Radix-UI, Lucide-React, Zustand

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
