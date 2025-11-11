import sys
import os
import asyncio
sys.path.append(os.path.join(os.path.dirname(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from src.models.user import User
from backend.src.services.auth import AuthService
from src.core.config import settings

async def test_registration():
    # Create a test database engine
    engine = create_async_engine("sqlite+aiosqlite:///./tests/test_auth.db")
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all)
    
    # Create a session
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Test registration
        auth_service = AuthService(session)
        
        try:
            user, error = await auth_service.register_user(
                fullname="Test User",
                email="test@example.com",
                password="TestPass123!"
            )
            if user and not error:
                print(f"User registered successfully: {user.email}")
                
                # Test login
                authenticated_user = await auth_service.authenticate_user("test@example.com", "TestPass123!")
                if authenticated_user:
                    print("Login successful")
                else:
                    print("Login failed")
                
        except Exception as e:
            print(f"Error during registration: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_registration())