import sys
import os
import asyncio
sys.path.append(os.path.join(os.path.dirname(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from src.models.user import User
from src.services.auth_service import AuthService


async def test_direct_call():
    # Create a test database engine
    engine = create_async_engine("sqlite+aiosqlite:///./tests/test_auth.db")
    async with engine.begin() as conn:
        await conn.run_sync(User.metadata.create_all)
    
    # Create a session
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Test registration similar to how the API endpoint does it
        auth_service = AuthService(session)
        
        try:
            print("Attempting to register user...")
            user, error = await auth_service.register_user(
                fullname="Test User Direct",
                email="testdirect@example.com",
                password="TestPass123!"
            )
            
            if user:
                print(f"User registered successfully: {user.email}")
            else:
                print(f"Registration failed: {error}")
                
        except Exception as e:
            print(f"Exception during registration: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_direct_call())