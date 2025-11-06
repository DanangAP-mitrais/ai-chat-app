# Data Model: AI Chat Interface

## Entity: User
**Description**: Represents an authenticated user of the system

**Fields**:
- id: UUID (Primary Key)
- email: String (Unique, Required, Encrypted)
- username: String (Unique, Required)
- password_hash: String (Required, Encrypted)
- created_at: DateTime (Required, Indexed)
- updated_at: DateTime (Required, Indexed)
- is_active: Boolean (Default: true)

**Relationships**:
- One-to-Many: ChatSession (user_id)

**Validation Rules**:
- Email must be valid email format
- Username must be 3-30 characters, alphanumeric and underscores only
- Password must meet complexity requirements (handled by auth service)

## Entity: ChatSession
**Description**: Represents a conversation between a user and the AI assistant, containing message history and context

**Fields**:
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key, Required, Indexed)
- title: String (Required, Max 200 chars)
- created_at: DateTime (Required, Indexed)
- updated_at: DateTime (Required, Indexed)
- is_active: Boolean (Default: true)

**Relationships**:
- Many-to-One: User (user_id)
- One-to-Many: Message (chat_session_id)

**Validation Rules**:
- user_id must reference an existing User
- title must not exceed 200 characters

## Entity: Message
**Description**: A unit of communication, either from the user (query) or assistant (response), with timestamp and content

**Fields**:
- id: UUID (Primary Key)
- chat_session_id: UUID (Foreign Key, Required, Indexed)
- sender_type: Enum ('user', 'assistant') (Required)
- content: Text (Required, Encrypted)
- timestamp: DateTime (Required, Indexed)
- sequence_number: Integer (Required, Indexed)

**Relationships**:
- Many-to-One: ChatSession (chat_session_id)

**Validation Rules**:
- chat_session_id must reference an existing ChatSession
- sender_type must be either 'user' or 'assistant'
- content must not be empty
- sequence_number must be unique within a ChatSession

## State Transitions

### ChatSession States
- Active: Default state when chat session is in progress
- Archived: When user explicitly archives the session or after inactivity period
- Deleted: When user deletes the session (soft delete)

### User States
- Active: Default state for active users
- Inactive: When user is deactivated by admin
- Suspended: When user's access is temporarily suspended

## Constraints
- All sensitive data (user email, message content) must be encrypted at rest
- User must be authenticated to create or access ChatSessions
- Rate limiting of 500 requests per user per day must be enforced
- Only authenticated users can access their own ChatSessions and Messages
- Messages are ordered by sequence_number within each ChatSession