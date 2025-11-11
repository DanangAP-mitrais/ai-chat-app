from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import HTTPBearer

from src.core.config import settings

class SecurityService:
    def __init__(self):
        self.security = HTTPBearer()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                return None
            return payload
        except JWTError:
            return None

    def get_current_user_id(self, token: str) -> Optional[str]:
        payload = self.verify_token(token)
        if payload is None:
            return None
        user_id: str = payload.get("sub")
        return user_id


security_service = SecurityService()