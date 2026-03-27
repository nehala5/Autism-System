from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ActivityLog, QuizResult
from pydantic import BaseModel

router = APIRouter(prefix="/activities", tags=["activities"])

class ActivityCreate(BaseModel):
    child_id: int
    activity_name: str
    score: int
    duration_seconds: int

class QuizCreate(BaseModel):
    child_id: int
    quiz_name: str
    score: int
    total_questions: int

@router.post("/log-activity")
def log_activity(act: ActivityCreate, db: Session = Depends(get_db)):
    new_log = ActivityLog(**act.dict())
    db.add(new_log)
    db.commit()
    return {"message": "Activity logged"}

@router.post("/log-quiz")
def log_quiz(quiz: QuizCreate, db: Session = Depends(get_db)):
    new_log = QuizResult(**quiz.dict())
    db.add(new_log)
    db.commit()
    return {"message": "Quiz logged"}
