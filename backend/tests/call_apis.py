import sys
import os
import asyncio
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Adjust the path to import from src
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.main import app
from src.core.database import Base, get_db_session


async def setup_test_database():
    """Set up a test database with the necessary tables"""
    # Create an in-memory SQLite database for testing
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False}  # Required for SQLite in-memory DB
    )
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session maker
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    return async_session


async def call_all_auth_apis():
    """
    Script to call all auth APIs using TestClient with a test database
    """
    print("Setting up test database...")
    
    # Set up the test database
    async_session = await setup_test_database()
    
    # Override the database session dependency
    async def override_get_db_session():
        async with async_session() as session:
            yield session
    
    # Apply the override
    app.dependency_overrides[get_db_session] = override_get_db_session
    
    print("Starting to call all auth APIs using TestClient...")
    
    # Create a test client
    client = TestClient(app)
    
    # 1. Call Register API
    print("\n1. Calling Register API...")
    register_data = {
        "fullname": "Test User",
        "email": "testuser@example.com",
        "password": "TestPass123!"
    }
    
    register_response = client.post(
        "/auth/register",
        json=register_data
    )
    print(f"Register Response Status: {register_response.status_code}")
    if register_response.status_code == 201:
        print(f"Register Response Data: {register_response.json()}")
        user_data = register_response.json()
    else:
        print(f"Register Error: {register_response.text}")
    
    # 2. Call Register API with duplicate email to test error handling
    print("\n2. Calling Register API with duplicate email (should fail)...")
    duplicate_register_data = {
        "fullname": "Another User",
        "email": "testuser@example.com",  # Same email as before
        "password": "AnotherPass123!"
    }
    
    duplicate_register_response = client.post(
        "/auth/register",
        json=duplicate_register_data
    )
    print(f"Duplicate Register Response Status: {duplicate_register_response.status_code}")
    if duplicate_register_response.status_code == 400:
        print(f"Duplicate Register correctly failed: {duplicate_register_response.json()}")
    else:
        print(f"Duplicate Register unexpected response: {duplicate_register_response.text}")
    
    # 3. Call Register API with weak password to test error handling
    print("\n3. Calling Register API with weak password (should fail)...")
    weak_password_data = {
        "fullname": "Weak Password User",
        "email": "weakpass@example.com",
        "password": "weak"
    }
    
    weak_password_response = client.post(
        "/auth/register",
        json=weak_password_data
    )
    print(f"Weak Password Register Response Status: {weak_password_response.status_code}")
    if weak_password_response.status_code == 400:
        print(f"Weak Password Register correctly failed: {weak_password_response.json()}")
    else:
        print(f"Weak Password Register unexpected response: {weak_password_response.text}")
    
    # 4. Call Register API with valid second user
    print("\n4. Calling Register API with another valid user...")
    register_data_2 = {
        "fullname": "Second User",
        "email": "seconduser@example.com",
        "password": "SecondPass123!"
    }
    
    register_response_2 = client.post(
        "/auth/register",
        json=register_data_2
    )
    print(f"Second Register Response Status: {register_response_2.status_code}")
    if register_response_2.status_code == 201:
        print(f"Second Register Response Data: {register_response_2.json()}")
        user_data_2 = register_response_2.json()
    else:
        print(f"Second Register Error: {register_response_2.text}")
    
    # 5. Call Login API with invalid credentials
    print("\n5. Calling Login API with invalid credentials (should fail)...")
    invalid_login_data = {
        "email": "testuser@example.com",
        "password": "WrongPassword123!"
    }
    
    invalid_login_response = client.post(
        "/auth/login",
        json=invalid_login_data
    )
    print(f"Invalid Login Response Status: {invalid_login_response.status_code}")
    if invalid_login_response.status_code == 401:
        print(f"Invalid Login correctly failed: {invalid_login_response.json()}")
    else:
        print(f"Invalid Login unexpected response: {invalid_login_response.text}")
    
    # 6. Call Login API with valid credentials to get token
    print("\n6. Calling Login API with valid credentials...")
    login_data = {
        "email": "testuser@example.com",
        "password": "TestPass123!"
    }
    
    login_response = client.post(
        "/auth/login",
        json=login_data
    )
    print(f"Login Response Status: {login_response.status_code}")
    if login_response.status_code == 200:
        login_data_response = login_response.json()
        print(f"Login Response Data: {login_data_response}")
        access_token = login_data_response["access_token"]
    else:
        print(f"Login Error: {login_response.text}")
        return  # Can't proceed without a token
    
    # 7. Call Login API with non-existent user
    print("\n7. Calling Login API with non-existent user (should fail)...")
    nonexistent_login_data = {
        "email": "nonexistent@example.com",
        "password": "SomePassword123!"
    }
    
    nonexistent_login_response = client.post(
        "/auth/login",
        json=nonexistent_login_data
    )
    print(f"Non-existent Login Response Status: {nonexistent_login_response.status_code}")
    if nonexistent_login_response.status_code == 401:
        print(f"Non-existent Login correctly failed: {nonexistent_login_response.json()}")
    else:
        print(f"Non-existent Login unexpected response: {nonexistent_login_response.text}")
    
    # 8. Call Verify API with the token
    print("\n8. Calling Verify API...")
    verify_response = client.get(
        "/auth/verify",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    print(f"Verify Response Status: {verify_response.status_code}")
    if verify_response.status_code == 200:
        print(f"Verify Response Data: {verify_response.json()}")
    else:
        print(f"Verify Error: {verify_response.text}")
    
    # 9. Call Verify API with invalid token
    print("\n9. Calling Verify API with invalid token (should fail)...")
    invalid_verify_response = client.get(
        "/auth/verify",
        headers={"Authorization": "Bearer invalid_token"}
    )
    print(f"Invalid Verify Response Status: {invalid_verify_response.status_code}")
    if invalid_verify_response.status_code == 401:
        print(f"Invalid Verify correctly failed: {invalid_verify_response.json()}")
    else:
        print(f"Invalid Verify unexpected response: {invalid_verify_response.text}")
    
    # 10. Call Logout API
    print("\n10. Calling Logout API...")
    logout_response = client.post("/auth/logout")
    print(f"Logout Response Status: {logout_response.status_code}")
    if logout_response.status_code == 200:
        print(f"Logout Response Data: {logout_response.json()}")
    else:
        print(f"Logout Error: {logout_response.text}")
    
    print("\nAll auth APIs called successfully!")
    
    # Clean up the dependency override
    app.dependency_overrides.clear()


def run_api_calls():
    """
    Function to run the API calls
    """
    asyncio.run(call_all_auth_apis())


if __name__ == "__main__":
    run_api_calls()