"""
ฟังก์ชันกลางเกี่ยวกับช่วงเวลาเช็คชื่อและสถานะ "ที่แท้จริง" ของนักศึกษาแต่ละคนในแต่ละคาบ

ตาราง attendance_details มีแถวเฉพาะคนที่เช็คชื่อแล้ว (หรืออาจารย์บันทึกให้)
คนที่ไม่มาเช็คชื่อเลยจะไม่มีแถว จึงต้องอนุมานเอง:
- หมดช่วงเวลาเช็คชื่อแล้วแต่ไม่มีแถว  -> absent
- อยู่ในช่วงเวลาเช็คชื่อ              -> open
- ยังไม่ถึงเวลาเปิดเช็คชื่อ            -> upcoming
"""
import datetime as dt

from sqlalchemy.orm import Session

from app.models import AttendanceDetail, AttendanceSession, Class

EFFECTIVE_OPEN = "open"
EFFECTIVE_UPCOMING = "upcoming"


def checkin_window(
    session: AttendanceSession, class_: Class
) -> tuple[dt.datetime | None, dt.datetime | None]:
    """ช่วงเวลาที่เปิดให้เช็คชื่อ: [start - open_offset, เวลาเลิกเรียน]

    เช็คชื่อภายใน start + late_threshold = เข้าเรียน, หลังจากนั้นถึงเวลาเลิกเรียน = มาสาย,
    ไม่เช็คชื่อจนเลิกเรียน = ขาด (คาบที่ไม่มีเวลาเลิกเรียนใช้ start + close_offset แทน)
    """
    if session.start_time is None:
        return None, None
    start_dt = dt.datetime.combine(session.session_date, session.start_time)
    open_dt = start_dt - dt.timedelta(minutes=class_.checkin_open_offset_minutes)
    if session.end_time is not None:
        close_dt = dt.datetime.combine(session.session_date, session.end_time)
    else:
        close_dt = start_dt + dt.timedelta(minutes=class_.checkin_close_offset_minutes)
    return open_dt, close_dt


def effective_status(
    session: AttendanceSession,
    class_: Class,
    detail: AttendanceDetail | None,
    now: dt.datetime,
) -> str:
    if detail is not None:
        return detail.status.value
    open_dt, close_dt = checkin_window(session, class_)
    if close_dt is None:
        # คาบที่ไม่มีเวลาเริ่ม: นับว่าขาดเมื่อผ่านวันนั้นไปแล้ว
        return "absent" if session.session_date < now.date() else EFFECTIVE_OPEN
    if now > close_dt:
        return "absent"
    if open_dt is not None and now < open_dt:
        return EFFECTIVE_UPCOMING
    return EFFECTIVE_OPEN


def late_minutes(session: AttendanceSession, check_in_time: dt.time | None) -> int | None:
    """จำนวนนาทีที่เช็คชื่อหลังเวลาเริ่มคาบ (0 ถ้าไม่สาย)"""
    if session.start_time is None or check_in_time is None:
        return None
    start_dt = dt.datetime.combine(session.session_date, session.start_time)
    checkin_dt = dt.datetime.combine(session.session_date, check_in_time)
    return max(0, int((checkin_dt - start_dt).total_seconds() // 60))


def sync_scheduled_sessions(db: Session, today: dt.date | None = None) -> None:
    """
    สร้างคาบเช็คชื่อตามตารางเรียนประจำสัปดาห์ (class_schedules) ให้คลาสที่ "เริ่มการสอน" แล้ว
    ตั้งแต่วันที่กดเริ่มการสอน (หรือวันเริ่มการสอน ถ้าช้ากว่า) จนถึงวันนี้/วันสิ้นสุดการสอน
    เติมย้อนหลังด้วย เพื่อให้วันที่ไม่มีใครเปิดระบบยังนับขาดได้ถูกต้อง
    ข้ามวันที่อาจารย์งดสอน และช่วงเรียนที่เพิ่มระหว่างเทอมเริ่มนับตั้งแต่ effective_from
    """
    today = today or dt.date.today()
    classes = db.query(Class).filter(Class.started_at.isnot(None), Class.schedules.any()).all()
    created = False
    for class_ in classes:
        first = class_.started_at.date()
        if class_.start_date and class_.start_date > first:
            first = class_.start_date
        last = min(today, class_.end_date) if class_.end_date else today
        if first > last:
            continue
        # (วันที่, เวลาเริ่ม) ของคาบที่มีอยู่แล้ว — วันเดียวกันมีได้หลายคาบถ้าเรียนหลายช่วง
        cancelled = {c.cancel_date for c in class_.cancellations}
        existing = {
            tuple(row)
            for row in db.query(AttendanceSession.session_date, AttendanceSession.start_time).filter(
                AttendanceSession.class_id == class_.id,
                AttendanceSession.session_date >= first,
                AttendanceSession.session_date <= last,
            )
        }
        for slot in class_.schedules:
            slot_first = max(first, slot.effective_from) if slot.effective_from else first
            day = slot_first + dt.timedelta(days=(slot.weekday - slot_first.weekday()) % 7)
            while day <= last:
                if day not in cancelled and (day, slot.start_time) not in existing:
                    db.add(
                        AttendanceSession(
                            class_id=class_.id,
                            session_date=day,
                            start_time=slot.start_time,
                            end_time=slot.end_time,
                            created_by=class_.course.teacher_id if class_.course else None,
                        )
                    )
                    created = True
                day += dt.timedelta(days=7)
    if created:
        db.commit()