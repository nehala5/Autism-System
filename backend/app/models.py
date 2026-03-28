from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    children = relationship("Child", back_populates="parent")
    diary_entries = relationship("DiaryEntry", back_populates="parent")

class Child(Base):
    __tablename__ = "children"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    parent_id = Column(Integer, ForeignKey("users.id"))
    autism_inheritance = Column(String, default="") # Family history/traits
    sensory_level = Column(String, default="standard") # 'low', 'standard', 'high'
    level = Column(Integer, default=1) # 1, 2, or 3
    
    parent = relationship("User", back_populates="children")
    
    emotion_logs = relationship("EmotionLog", back_populates="child")
    activity_logs = relationship("ActivityLog", back_populates="child")
    quiz_results = relationship("QuizResult", back_populates="child")

    def recalculate_level(self):
        history = (self.autism_inheritance or "").lower()
        sensory = (self.sensory_level or "").lower()
        age = self.age or 0
        
        # Level 3: 10+ or ANY high-risk
        if age >= 10 or history in ["immediate", "suspected"] or sensory == "high":
            self.level = 3
        # Level 2: 7–9 (or mixed) or Extended
        elif age >= 7 or history == "extended":
            self.level = 2
        # Level 1: 3–6
        else:
            self.level = 1
        return self.level

class EmotionLog(Base):
    __tablename__ = "emotion_logs"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    image_path = Column(String)
    image_hash = Column(String, index=True) # New column
    predicted_emotion = Column(String)
    corrected_emotion = Column(String, nullable=True)
    confirmed = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    child = relationship("Child", back_populates="emotion_logs")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    activity_name = Column(String)  # e.g., "Emotion Match", "Color Learn"
    score = Column(Integer)         # e.g., 100
    duration_seconds = Column(Integer) 
    timestamp = Column(DateTime, default=datetime.utcnow)

    child = relationship("Child", back_populates="activity_logs")

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    quiz_name = Column(String)
    score = Column(Integer)
    total_questions = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

    child = relationship("Child", back_populates="quiz_results")

class DiaryEntry(Base):
    __tablename__ = "diary_entries"
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"))
    child_name = Column(String) # Or link directly to child, but keeping simple for now
    title = Column(String)
    message = Column(String)
    image_path = Column(String, nullable=True)
    video_path = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    parent = relationship("User", back_populates="diary_entries")
