import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from db.dependency import get_db
from db.database import engine
from models.models import Base

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")


engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    db = TestingSessionLocal()
    yield db
    db.close()

def test_create_user(test_db):
    response = client.post(
        "/users/",
        json={"name": "New User", "email": "newuser@example.com", "password": "newpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "hashed_password" not in data

def test_login_for_access_token(test_db):
    response = client.post(
        "/login",
        data={"username": "newuser@example.com", "password": "newpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_read_users_me(test_db):
    response = client.post(
        "/login",
        data={"username": "newuser@example.com", "password": "newpassword"}
    )
    access_token = response.json()["access_token"]

    response = client.get(
        "/users/me/",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New User"
    assert data["email"] == "newuser@example.com"
