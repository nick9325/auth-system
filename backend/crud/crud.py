
from sqlalchemy.orm import Session
from models.models import User
from schemas.schemas import UserCreate, UserBase
from core.security import get_password_hash, verify_password, get_current_user
from fastapi import Depends
from db.dependency import get_db

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, id: str):
    return db.query(User).filter(User.id == id).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_user_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return current_user


def delete_user_by_id(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def update_user_by_id(db: Session, user_id: int, user: UserBase):
    db_user = db.query(User).filter(User.id == user_id).first()

    if db_user:
        db_user.name = user.name
        db_user.email = user.email
        db.commit()
        db.refresh(db_user)
    return db_user






