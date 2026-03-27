from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DiaryEntry
import os
import shutil
import uuid

router = APIRouter(prefix="/diary", tags=["diary"])

UPLOAD_DIR = "data/uploads/diary"
os.makedirs(UPLOAD_DIR, exist_ok=True)

from app.utils.storage import save_file

@router.post("/add")
async def add_diary(
    parent_id: int = Form(...),
    child_name: str = Form(...),
    title: str = Form(...),
    message: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_path_db = None
    if file:
        image_path_db = save_file(file, "diary")

    entry = DiaryEntry(
        parent_id=parent_id,
        child_name=child_name,
        title=title,
        message=message,
        image_path=image_path_db
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"message": "Diary entry added", "id": entry.id}

@router.get("/{parent_id}")
def get_diary(parent_id: int, db: Session = Depends(get_db)):
    return db.query(DiaryEntry).filter(DiaryEntry.parent_id == parent_id).order_by(DiaryEntry.timestamp.desc()).all()
