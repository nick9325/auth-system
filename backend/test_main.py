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

access_token=""
user_id=0

@pytest.fixture(scope="module")
def test_db():
    db = TestingSessionLocal()
    yield db
    db.close()



def test_create_user(test_db):
    global user_id

    response = client.post(
        "/users/",
        json={"name": "New User", "email": "newuser@example.com", "password": "newpassword"}
    )

    user_id = response.json()["id"]

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "hashed_password" not in data

def test_create_duplicate_user(test_db):
    
    response = client.post(
        "/users/",
        json={"name": "New User", "email": "newuser@example.com", "password": "newpassword"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}



def test_login_incorrect_credentials(test_db):
    response = client.post(
        "/login",
        data={"username": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Incorrect email or password"}




def test_login_for_access_token(test_db):
    global access_token

    response = client.post(
        "/login",
        data={"username": "newuser@example.com", "password": "newpassword"}
    )

    access_token = response.json()["access_token"]

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_read_user_me_no_token(test_db):
    response = client.get("/users/me/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}



def test_read_user_me(test_db):
    global access_token

    response = client.get(
        "/users/me/",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New User"
    assert data["email"] == "newuser@example.com"


def test_put_user_already_exists(test_db):
    global access_token,user_id
    
    response = client.put(
        f"/users/{user_id}",
        json={"name": "Nikhil Magar", "email": "newuser@example.com"},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 400

def test_put_user_doesnt_exists(test_db):
    global access_token,user_id
    
    response = client.put(
        "/users/77",
        json={"name": "Nikhil Magar", "email": f"nikhilmagar{user_id}@example.com"},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 404

def test_put_user(test_db):
    global access_token,user_id
    
    response = client.put(
        f"/users/{user_id}",
        json={"name": "Nikhil Magar", "email": f"nikhilmagar{user_id}@example.com"},
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Nikhil Magar"
    assert data["email"] == f"nikhilmagar{user_id}@example.com"

def test_delete_user_for_user_not_exists(test_db):
    global access_token,user_id

    response = client.post(
        "/login",
        data={"username": f"nikhilmagar{user_id}@example.com", "password": "newpassword"}
    )

    access_token = response.json()["access_token"]

    
    response = client.delete(
        "/users/77",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 404

def test_delete_user(test_db):
    global access_token
    
    response = client.delete(
        f"/users/{user_id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200







