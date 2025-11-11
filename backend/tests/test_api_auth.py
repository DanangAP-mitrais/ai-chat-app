import sys
import os
import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Adjust the path to import from src
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.main import app
from src.core.database import Base, get_db_session


# Create a test database engine
@pytest.fixture(scope="function")
async def test_db():
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False}
    )
    
    # Create all tables
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    
    import asyncio
    asyncio.run(create_tables())
    
    # Create session maker
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    yield async_session
    
    # Cleanup after test
    await engine.dispose()


@pytest.fixture(scope="function")
def client(test_db):
    async_session = test_db
    
    # Override the database session dependency
    async def override_get_db_session():
        async with async_session() as session:
            yield session
    
    app.dependency_overrides[get_db_session] = override_get_db_session
    
    test_client = TestClient(app)
    yield test_client
    
    # Clear the override after the test
    app.dependency_overrides.clear()


def test_register_success(client):
    """Test successful user registration"""
    response = client.post(
        "/auth/register",
        json={
            "fullname": "Test User",
            "email": "test@example.com",
            "password": "TestPass123!"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["fullname"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "created_at" in data
    assert datetime.fromisoformat(data["created_at"])  # Check that created_at is a valid ISO format


def test_register_duplicate_email(client):
    """Test registration with duplicate email"""
    # Register a user first
    client.post(
        "/auth/register",
        json={
            "fullname": "Test User",
            "email": "duplicate@example.com",
            "password": "TestPass123!"
        }
    )
    
    # Try to register with the same email
    response = client.post(
        "/auth/register",
        json={
            "fullname": "Another User",
            "email": "duplicate@example.com",
            "password": "AnotherPass123!"
        }
    )
    
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_register_weak_password(client):
    """Test registration with weak password"""
    response = client.post(
        "/auth/register",
        json={
            "fullname": "Test User",
            "email": "weakpass@example.com",
            "password": "weak"  # Too short and doesn't meet requirements
        }
    )
    
    assert response.status_code == 400
    assert "Password does not meet security requirements" in response.json()["detail"]


def test_login_success(client):
    """Test successful user login"""
    # Register a user first
    client.post(
        "/auth/register",
        json={
            "fullname": "Login Test",
            "email": "login@example.com",
            "password": "LoginPass123!"
        }
    )
    
    # Login with the same credentials
    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "LoginPass123!"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "expires_in" in data


def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    # Register a user first
    client.post(
        "/auth/register",
        json={
            "fullname": "Login Test",
            "email": "invalid@example.com",
            "password": "InvalidPass123!"
        }
    )
    
    # Login with incorrect password
    response = client.post(
        "/auth/login",
        json={
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]
    
    # Login with non-existent email
    response = client.post(
        "/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "somepassword"
        }
    )
    
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_logout(client):
    """Test logout endpoint"""
    # Currently, logout just returns a success message
    response = client.post("/auth/logout")
    
    # Since the logout endpoint doesn't validate tokens in the current implementation
    # it should return 200
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Successfully logged out"


def test_verify_token_valid(client):
    """Test token verification with a valid token"""
    # Register a user first
    client.post(
        "/auth/register",
        json={
            "fullname": "Verify Test",
            "email": "verify@example.com",
            "password": "VerifyPass123!"
        }
    )
    
    # Login to get a token
    login_response = client.post(
        "/auth/login",
        json={
            "email": "verify@example.com",
            "password": "VerifyPass123!"
        }
    )
    
    # Verify the token
    token = login_response.json()["access_token"]
    response = client.get(
        "/auth/verify",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "user_id" in data
    assert "email" in data
    assert "fullname" in data
    assert data["email"] == "verify@example.com"
    assert data["fullname"] == "Verify Test"


def test_verify_token_invalid(client):
    """Test token verification with an invalid token"""
    response = client.get(
        "/auth/verify",
        headers={"Authorization": "Bearer invalid_token"}
    )
    
    assert response.status_code == 401
    assert "Could not validate credentials" in response.json()["detail"]