from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud.crud import get_user_by_email, delete_user_by_id, update_user_by_id
from core.security import get_current_user
from schemas.schemas import UserBase, User
from db.dependency import get_db

router = APIRouter()

@router.get("/users/me/", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.delete("/users/{user_id}", response_model=User)
def delete_user(user_id:int, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    db_user = delete_user_by_id(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    return db_user


@router.put("/users/{user_id}", response_model=User)
def update_user(user_id:int,user: UserBase, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    email = get_user_by_email(db,user.email)
    if email:
        raise  HTTPException(status_code=400, detail="Email already registered")
    db_user = update_user_by_id(db,user_id,user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


