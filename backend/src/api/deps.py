from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db_session
from ..core.security import security_service
from ..services.auth_service import AuthService
from ..models.user import User
from typing import Optional


async def get_current_user(
    db_session: AsyncSession = Depends(get_db_session),
    token: str = Depends(security_service.security)
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