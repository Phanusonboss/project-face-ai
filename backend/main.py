"""
CS FaceAttend — Backend API (FastAPI + MySQL/MariaDB)
======================================================
เขียนใหม่ทั้งหมดให้ตรงกับฐานข้อมูลจริงที่สร้างผ่าน phpMyAdmin
(project_face_ai_db) แบบ column-level ทุกตาราง

รันด้วย:
    uvicorn main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.config import settings
from app.database import engine
from app.models import ClassCancellation, ClassSchedule
from app.routers import (
    announcements,
    attendance,
    auth,
    classes,
    courses,
    departments,
    face,
    scores,
    students,
    teachers,
)

app = FastAPI(
    title="CS FaceAttend API",
    description="ระบบเช็คชื่อเข้าเรียนด้วยการสแกนใบหน้า — ภาควิชาวิทยาการคอมพิวเตอร์",
    version="2.0.0",
)



def ensure_columns():
    """เติมคอลัมน์ใหม่ให้ฐานข้อมูลเดิม (ตารางสร้างผ่าน phpMyAdmin ไม่มี migration)"""
    cols = {c["name"] for c in inspect(engine).get_columns("classes")}
    with engine.begin() as conn:
        if "started_at" not in cols:
            conn.execute(text("ALTER TABLE classes ADD COLUMN started_at DATETIME NULL AFTER end_date"))
        # คอลัมน์เวลาเรียนแบบช่องเดียว (รุ่นก่อน) ย้ายไปอยู่ใน class_schedules แล้ว
        for old in ("class_start_time", "class_end_time", "class_weekday"):
            if old in cols:
                conn.execute(text(f"ALTER TABLE classes DROP COLUMN {old}"))
    ClassSchedule.__table__.create(bind=engine, checkfirst=True)
    ClassCancellation.__table__.create(bind=engine, checkfirst=True)
    schedule_cols = {c["name"] for c in inspect(engine).get_columns("class_schedules")}
    if "effective_from" not in schedule_cols:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE class_schedules ADD COLUMN effective_from DATE NULL"))


ensure_columns()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(departments.router)
app.include_router(teachers.router)
app.include_router(students.router)
app.include_router(courses.router)
app.include_router(classes.router)
app.include_router(face.router)
app.include_router(attendance.router)
app.include_router(scores.router)
app.include_router(announcements.router)


@app.get("/")
def root():
    return {
        "name": "CS FaceAttend API",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}