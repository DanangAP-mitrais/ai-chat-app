from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from ..core.database import get_db_session
from ..services.auth_service import AuthService
from ..core.security import security_service
from ..models.user import User
from .deps import get_current_user
from pydantic import BaseModel
from typing import Optional


router = APIRouter(prefix="/auth", tags=["Authentication"])


# Pydantic models
class RegisterRequest(BaseModel):
    fullname: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int


class UserResponse(BaseModel):
    id: str
    fullname: str
    email: str
    created_at: str


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db_session: AsyncSession = Depends(get_db_session)
):
    auth_service = AuthService(db_session)
    user, error = await auth_service.register_user(
        fullname=request.fullname,
        email=request.email,
        password=request.password
    )
    
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )
    
    return UserResponse(
        id=user.id,
        fullname=user.fullname,
        email=user.email,
        created_at=user.created_at.isoformat()
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db_session: AsyncSession = Depends(get_db_session)
):
    auth_service = AuthService(db_session)
    user = await auth_service.authenticate_user(
        email=request.email,
        password=request.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=security_service.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security_service.create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=security_service.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Convert to seconds
    )


@router.post("/logout")
async def logout():
    # In a real implementation, you might want to add the token to a blacklist
    # For now, we just return a success message
    return {"message": "Successfully logged out"}


@router.get("/verify")
async def verify_token(current_user: User = Depends(get_current_user)):
    """
    Verify if the token is valid by attempting to retrieve the current user
    """
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "fullname": current_user.fullname
    }