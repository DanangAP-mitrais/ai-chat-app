from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.security import security_service
from backend.src.services.auth import AuthService
from src.models.user import User


async def get_current_user(
    db_session: AsyncSession = Depends(get_db_session),
    token: HTTPAuthorizationCredentials  = Depends(security_service.security)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = security_service.verify_token(token.credentials)
    if token_data is None:
        raise credentials_exception
    
    user_id = token_data.get("sub")
    if user_id is None:
        raise credentials_exception
    
    auth_service = AuthService(db_session)
    user = await auth_service.get_user_by_id(user_id)
    
    if user is None:
        raise credentials_exception
    
    return user