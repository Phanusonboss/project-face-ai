import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import ensure_course_owner, get_current_user, require_teacher
from app.models import (
    AttendanceSession,
    Class,
    ClassCancellation,
    ClassSchedule,
    Course,
    Enrollment,
    Student,
    User,
    UserRole,
)
from app.routers.students import to_student_out
from app.schemas import ClassCreate, ClassOut, ClassUpdate, EnrollmentCreate, EnrollmentOut

router = APIRouter(prefix="/classes", tags=["classes"])


def get_owned_course(db: Session, course_id: int, current_user: User) -> Course:
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="ไม่พบรายวิชานี้")
    ensure_course_owner(current_user, course)
    return course


def get_owned_class(db: Session, class_id: int, current_user: User) -> Class:
    class_ = db.query(Class).filter(Class.id == class_id).first()
    if class_ is None:
        raise HTTPException(status_code=404, detail="ไม่พบคลาสเรียนนี้")
    ensure_course_owner(current_user, class_.course)
    return class_


def _minutes(t: dt.time) -> int:
    return t.hour * 60 + t.minute


def validate_schedules(class_: Class) -> None:
    """
    แต่ละช่วงเรียน: เวลาเลิกต้องหลังเวลาเริ่ม, ช่วงเช็คชื่อตรงเวลาต้องไม่เกินเวลาเรียน
    และช่วงเรียนในวันเดียวกันต้องไม่ทับกัน
    """
    slots = sorted(class_.schedules, key=lambda s: (s.weekday, s.start_time))
    for i, slot in enumerate(slots):
        if slot.end_time <= slot.start_time:
            raise HTTPException(status_code=400, detail="เวลาเลิกเรียนต้องหลังเวลาเริ่มเรียน")
        if not 0 <= class_.late_threshold_minutes <= _minutes(slot.end_time) - _minutes(slot.start_time):
            raise HTTPException(
                status_code=400, detail="เวลาเช็คชื่อตรงเวลาต้องไม่เกินระยะเวลาเรียนของทุกช่วง"
            )
        prev = slots[i - 1] if i else None
        if prev and prev.weekday == slot.weekday and slot.start_time < prev.end_time:
            raise HTTPException(status_code=400, detail="ช่วงเวลาเรียนในวันเดียวกันทับกัน")


def build_schedules(items) -> list[ClassSchedule]:
    return [ClassSchedule(**item.model_dump()) for item in items]


def replace_schedules(db: Session, class_: Class, items) -> None:
    """
    เปลี่ยนตารางเรียน: คลาสที่ยังไม่เริ่มสอนแทนที่ได้เลย
    คลาสที่กำลังสอน ช่วงเรียนเดิมคง effective_from ไว้ ช่วงเรียนใหม่เริ่มนับตั้งแต่วันนี้
    (ไม่เติมคาบย้อนหลังให้นักศึกษาขาดเรียน) และลบคาบวันนี้ที่ไม่ตรงตารางใหม่และยังไม่มีใครเช็คชื่อ
    """
    if class_.started_at is None:
        class_.schedules = build_schedules(items)
        return
    today = dt.date.today()
    old = {(s.weekday, s.start_time, s.end_time): s.effective_from for s in class_.schedules}
    new = build_schedules(items)
    for slot in new:
        key = (slot.weekday, slot.start_time, slot.end_time)
        slot.effective_from = old[key] if key in old else today
    class_.schedules = new
    keep = {(s.start_time, s.end_time) for s in new if s.weekday == today.weekday()}
    for session in (
        db.query(AttendanceSession)
        .filter(AttendanceSession.class_id == class_.id, AttendanceSession.session_date == today)
        .all()
    ):
        if (session.start_time, session.end_time) not in keep and not session.attendance_details:
            db.delete(session)


@router.get("", response_model=list[ClassOut])
def list_classes(course_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Class)
    if course_id is not None:
        query = query.filter(Class.course_id == course_id)
    return query.all()


@router.post("", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
def create_class(
    payload: ClassCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    get_owned_course(db, payload.course_id, current_user)
    class_ = Class(**payload.model_dump(exclude={"schedules"}))
    class_.schedules = build_schedules(payload.schedules)
    validate_schedules(class_)
    db.add(class_)
    db.commit()
    db.refresh(class_)
    return class_


@router.get("/mine", response_model=list[ClassOut])
def list_my_classes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """คลาสของนักศึกษาที่ login อยู่ (เฉพาะที่ลงทะเบียนแล้ว) หรือของอาจารย์ (วิชาที่สอน)"""
    if current_user.role == UserRole.student and current_user.student_profile:
        student_id = current_user.student_profile.id
        class_ids = (
            db.query(Enrollment.class_id).filter(Enrollment.student_id == student_id).subquery()
        )
        return db.query(Class).filter(Class.id.in_(class_ids)).all()

    if current_user.role == UserRole.teacher and current_user.teacher_profile:
        teacher_id = current_user.teacher_profile.id
        return (
            db.query(Class)
            .join(Class.course)
            .filter(Class.course.has(teacher_id=teacher_id))
            .all()
        )

    return []


@router.get("/{class_id}", response_model=ClassOut)
def get_class(class_id: int, db: Session = Depends(get_db)):
    class_ = db.query(Class).filter(Class.id == class_id).first()
    if class_ is None:
        raise HTTPException(status_code=404, detail="ไม่พบคลาสเรียนนี้")
    return class_


@router.put("/{class_id}", response_model=ClassOut)
def update_class(
    class_id: int,
    payload: ClassUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    class_ = get_owned_class(db, class_id, current_user)
    data = payload.model_dump(exclude_unset=True, exclude={"schedules"})
    # ย้ายคลาสไปรายวิชาอื่นได้เฉพาะรายวิชาที่ตัวเองเป็นเจ้าของ
    if data.get("course_id") not in (None, class_.course_id):
        get_owned_course(db, data["course_id"], current_user)
    for key, value in data.items():
        setattr(class_, key, value)
    if payload.schedules is not None:
        replace_schedules(db, class_, payload.schedules)
    validate_schedules(class_)
    db.commit()
    db.refresh(class_)
    return class_


@router.post("/{class_id}/start", response_model=ClassOut)
def start_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """เริ่มการสอน: ย้ายจาก "รอเริ่มสอน" ไป "กำลังสอน" (สิ้นสุดอัตโนมัติเมื่อเลย end_date)"""
    class_ = get_owned_class(db, class_id, current_user)
    if class_.started_at is not None:
        raise HTTPException(status_code=400, detail="รายวิชานี้เริ่มการสอนไปแล้ว")
    if class_.end_date is None:
        raise HTTPException(status_code=400, detail="กรุณากำหนดวันสิ้นสุดการสอนก่อนเริ่มการสอน")
    if not class_.schedules:
        raise HTTPException(status_code=400, detail="กรุณากำหนดวันเรียนและเวลาเรียนก่อนเริ่มการสอน")
    class_.started_at = dt.datetime.now()
    db.commit()
    db.refresh(class_)
    return class_


@router.post("/{class_id}/cancellations/{cancel_date}", response_model=ClassOut)
def cancel_class_day(
    class_id: int,
    cancel_date: dt.date,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """
    งดสอนวันที่เลือก (วันนี้หรือวันในอนาคตที่มีเรียนตามตาราง): ลบคาบเช็คชื่อของวันนั้น
    (รวมการเช็คชื่อที่มีแล้ว) นักศึกษาจึงเช็คชื่อไม่ได้และไม่นับขาด
    มีผลเฉพาะวันนั้น วันเรียนอื่นระบบสร้างคาบตามตารางเรียนตามปกติ
    """
    class_ = get_owned_class(db, class_id, current_user)
    if class_.started_at is None:
        raise HTTPException(status_code=400, detail="รายวิชานี้ยังไม่เริ่มการสอน")
    if cancel_date < dt.date.today():
        raise HTTPException(status_code=400, detail="งดสอนย้อนหลังไม่ได้")
    if class_.end_date and cancel_date > class_.end_date:
        raise HTTPException(status_code=400, detail="วันที่งดสอนต้องไม่เกินวันสิ้นสุดการสอน")
    if all(s.weekday != cancel_date.weekday() for s in class_.schedules):
        raise HTTPException(status_code=400, detail="วันที่เลือกไม่มีเรียนตามตารางเรียน")
    if all(c.cancel_date != cancel_date for c in class_.cancellations):
        class_.cancellations.append(ClassCancellation(cancel_date=cancel_date))
    for session in (
        db.query(AttendanceSession)
        .filter(AttendanceSession.class_id == class_.id, AttendanceSession.session_date == cancel_date)
        .all()
    ):
        db.delete(session)
    db.commit()
    db.refresh(class_)
    return class_


@router.delete("/{class_id}/cancellations/{cancel_date}", response_model=ClassOut)
def undo_cancel_class_day(
    class_id: int,
    cancel_date: dt.date,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """ยกเลิกการงดสอน: คาบตามตารางเรียนจะถูกสร้างกลับมาเมื่อถึงวันนั้น (หรือเมื่อเรียกดูครั้งถัดไปถ้าเป็นวันนี้)"""
    class_ = get_owned_class(db, class_id, current_user)
    if cancel_date < dt.date.today():
        raise HTTPException(status_code=400, detail="ยกเลิกการงดสอนย้อนหลังไม่ได้")
    class_.cancellations = [c for c in class_.cancellations if c.cancel_date != cancel_date]
    db.commit()
    db.refresh(class_)
    return class_


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    class_ = get_owned_class(db, class_id, current_user)
    db.delete(class_)
    db.commit()


# ---------------------------------------------------------------------------
# Enrollments
# ---------------------------------------------------------------------------
@router.get("/{class_id}/students", response_model=list[EnrollmentOut])
def list_class_students(class_id: int, db: Session = Depends(get_db)):
    enrollments = db.query(Enrollment).filter(Enrollment.class_id == class_id).all()
    result = []
    for e in enrollments:
        result.append(
            EnrollmentOut(
                id=e.id,
                class_id=e.class_id,
                student_id=e.student_id,
                enroll_date=e.enroll_date,
                status=e.status,
                student=to_student_out(e.student) if e.student else None,
            )
        )
    return result


@router.post(
    "/{class_id}/students",
    response_model=EnrollmentOut,
    status_code=status.HTTP_201_CREATED,
)
def enroll_student(
    class_id: int,
    payload: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    if payload.class_id != class_id:
        raise HTTPException(status_code=400, detail="class_id ไม่ตรงกับ path")

    get_owned_class(db, class_id, current_user)

    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="ไม่พบนักศึกษานี้")

    existing = (
        db.query(Enrollment)
        .filter(Enrollment.class_id == class_id, Enrollment.student_id == payload.student_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="นักศึกษาคนนี้ลงทะเบียนคลาสนี้ไปแล้ว")

    enrollment = Enrollment(class_id=class_id, student_id=payload.student_id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return EnrollmentOut(
        id=enrollment.id,
        class_id=enrollment.class_id,
        student_id=enrollment.student_id,
        enroll_date=enrollment.enroll_date,
        status=enrollment.status,
        student=to_student_out(student),
    )


@router.delete(
    "/{class_id}/students/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT
)
def unenroll_student(
    class_id: int,
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    get_owned_class(db, class_id, current_user)
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.id == enrollment_id, Enrollment.class_id == class_id)
        .first()
    )
    if enrollment is None:
        raise HTTPException(status_code=404, detail="ไม่พบการลงทะเบียนนี้")
    db.delete(enrollment)
    db.commit()
