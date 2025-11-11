from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from ..models.user import User
from .password import PasswordService


class AuthService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
        self.password_service = PasswordService()

    async def register_user(self, fullname: str, email: str, password: str) -> Tuple[Optional[User], Optional[str]]:
        """
        Register a new user.
        Returns (user, error_message) tuple
        """
        # Check if user already exists
        existing_user = await self.get_user_by_email(email)
        if existing_user:
            return None, "Email already registered"

        # Validate password strength (at least 8 chars with uppercase, lowercase, number, special char)
        if not self._is_valid_password(password):
            return None, "Password does not meet security requirements"

        # Hash password
        hashed_password = self.password_service.hash_password(password)

        # Create new user
        new_user = User(
            fullname=fullname,
            email=email.lower(),
            hashed_password=hashed_password
        )

        try:
            self.db_session.add(new_user)
            await self.db_session.commit()
            await self.db_session.refresh(new_user)
            return new_user, None
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=f"Failed to register user: {e}")

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = await self.get_user_by_email(email)
        if not user or not self.password_service.verify_password(password, user.hashed_password):
            return None
        return user

    async def get_user_by_email(self, email: str) -> Optional[User]:
        query = select(User).where(User.email == email.lower())
        result = await self.db_session.execute(query)
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        query = select(User).where(User.id == user_id)
        result = await self.db_session.execute(query)
        return result.scalar_one_or_none()

    def _is_valid_password(self, password: str) -> bool:
        """
        Validates password strength: at least 8 characters, 
        including uppercase, lowercase, number, and special character
        """
        if len(password) < 8:
            return False

        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "@$!%%*?&" for c in password)

        return has_upper and has_lower and has_digit and has_special