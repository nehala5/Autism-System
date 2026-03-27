from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Child, EmotionLog, ActivityLog, QuizResult
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/progress/{child_id}")
def get_progress(child_id: int, db: Session = Depends(get_db)):
    # Activity Stats
    activity_stats = db.query(
        ActivityLog.activity_name,
        func.avg(ActivityLog.score).label('avg_score'),
        func.count(ActivityLog.id).label('sessions')
    ).filter(ActivityLog.child_id == child_id).group_by(ActivityLog.activity_name).all()

    # Quiz Stats
    quiz_stats = db.query(
        QuizResult.quiz_name,
        func.avg(QuizResult.score).label('avg_score'),
        func.count(QuizResult.id).label('attempts')
    ).filter(QuizResult.child_id == child_id).group_by(QuizResult.quiz_name).all()

    # Emotion Stats (Last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    emotion_stats = db.query(
        EmotionLog.predicted_emotion,
        func.count(EmotionLog.id).label('count')
    ).filter(
        EmotionLog.child_id == child_id,
        EmotionLog.timestamp >= thirty_days_ago
    ).group_by(EmotionLog.predicted_emotion).all()

    return {
        "activities": [{"name": s[0], "avg_score": s[1], "sessions": s[2]} for s in activity_stats],
        "quizzes": [{"name": s[0], "avg_score": s[1], "attempts": s[2]} for s in quiz_stats],
        "emotions": [{"emotion": s[0], "count": s[1]} for s in emotion_stats]
    }

@router.get("/generate-report/{child_id}")
def generate_report(child_id: int, db: Session = Depends(get_db)):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    report_dir = "data/reports"
    os.makedirs(report_dir, exist_ok=True)
    filename = f"report_{child_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    file_path = os.path.join(report_dir, filename)

    # Simple PDF generation with ReportLab
    c = canvas.Canvas(file_path, pagesize=letter)
    c.drawString(100, 750, f"NeuroSense - 15 Day Progress Report")
    c.drawString(100, 730, f"Child Name: {child.name}")
    c.drawString(100, 710, f"Age: {child.age}")
    c.drawString(100, 690, f"Date: {datetime.now().strftime('%Y-%m-%d')}")

    # Add activity summary
    y = 650
    c.drawString(100, y, "Activity Participation:")
    y -= 20
    activities = db.query(ActivityLog).filter(ActivityLog.child_id == child_id).all()
    for act in activities[-5:]: # Last 5
        c.drawString(120, y, f"- {act.activity_name}: Score {act.score} ({act.timestamp.strftime('%Y-%m-%d')})")
        y -= 20

    c.save()

    return {"report_url": f"/reports/{filename}"}
