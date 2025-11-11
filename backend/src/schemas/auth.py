from pydantic import BaseModel

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