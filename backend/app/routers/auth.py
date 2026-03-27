from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Child
from app.utils.auth_utils import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    username: str
    password: str

class ChildCreate(BaseModel):
    name: str
    age: int
    parent_id: int
    autism_inheritance: str = ""
    sensory_level: str = "standard"

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pwd = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.username, "id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer", "user_id": db_user.id}

@router.post("/add-child")
def add_child(child: ChildCreate, db: Session = Depends(get_db)):
    new_child = Child(
        name=child.name, 
        age=child.age, 
        parent_id=child.parent_id,
        autism_inheritance=child.autism_inheritance,
        sensory_level=child.sensory_level
    )
    db.add(new_child)
    db.commit()
    db.refresh(new_child)
    return {"message": "Child added", "child_id": new_child.id}

@router.get("/children/{parent_id}")
def get_children(parent_id: int, db: Session = Depends(get_db)):
    return db.query(Child).filter(Child.parent_id == parent_id).all()

@router.delete("/delete-child/{child_id}")
def delete_child(child_id: int, db: Session = Depends(get_db)):
    db_child = db.query(Child).filter(Child.id == child_id).first()
    if not db_child:
        raise HTTPException(status_code=404, detail="Child not found")
    db.delete(db_child)
    db.commit()
    return {"message": "Child deleted successfully"}
