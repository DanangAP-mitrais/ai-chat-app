# Data Model: User Authentication

## User Entity
- **id**: UUID/string (Primary Key) - Unique identifier for the user
- **fullname**: string (255 max) - Full name of the user
- **email**: string (255 max, unique, indexed) - Email address for login
- **hashed_password**: string (255 max) - Bcrypt hashed password
- **created_at**: datetime - Timestamp of account creation
- **updated_at**: datetime - Timestamp of last update
- **is_active**: boolean - Whether the account is active

## Authentication Token Entity
- **token**: string (512 max, indexed) - JWT token value
- **user_id**: UUID/string (Foreign Key) - References User
- **expires_at**: datetime - Token expiration time
- **created_at**: datetime - Token creation time
- **is_active**: boolean - Whether the token is still valid

## Validation Rules
- Email format must follow standard email validation
- Fullname: Required, 2-255 characters
- Password: Minimum 8 characters, including uppercase, lowercase, number, and special character
- Email: Required, unique, maximum 255 characters
- User account is active by default after registration

## Relationships
- User (1) -> (*) Authentication Token (one user can have multiple tokens)

## State Transitions
- User account state: Inactive (during registration) -> Active (after creation)
- Token state: Active (when issued) -> Expired (when expiration time is reached) -> Inactive (when explicitly revoked)