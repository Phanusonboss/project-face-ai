import { useEffect, useState } from "react";
import {
  X,
  Save,
  Clock,
  CalendarDays,
  Plus,
  ScanFace,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpen,
  CalendarX,
} from "lucide-react";
import { api } from "../../lib/api";
import { useApi } from "../../lib/useApi";
import { addDays, hhmm, isoDate, parseDate, STATUS_LABEL, thaiDate } from "../../lib/format";
import { useAppearanceSettings } from "./useAppearanceSettings";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900";
const labelCls = "text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5";

export function ModalShell({ code, title, onClose, children, footer, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div
        className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full ${
          wide ? "max-w-2xl" : "max-w-lg"
        } max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            {code && <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{code}</div>}
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorText({ children }) {
  if (!children) return null;
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
      {children}
    </div>
  );
}

function PrimaryButton({ busy, children, ...props }) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-100 dark:shadow-blue-950"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

function CancelButton({ onClick }) {
  const { t } = useAppearanceSettings();
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      {t("common.actions.cancel")}
    </button>
  );
}

// ---------------------------------------------------------------------------
// ตารางเรียน + ช่วงเช็คชื่อ
// เรียนได้หลายครั้งต่อสัปดาห์ (แต่ละช่วง = วัน + เวลาเริ่ม/เลิก) ระบบสร้างคาบให้ทุกสัปดาห์หลังเริ่มการสอน
// เช็คชื่อภายใน onTime นาทีหลังเริ่มเรียน = เข้าเรียน, หลังจากนั้นถึงเลิกเรียน = มาสาย, ไม่เช็คชื่อ = ขาด
// onTime เก็บเป็น late_threshold_minutes (ใช้ร่วมกันทุกช่วงเรียน)
// ---------------------------------------------------------------------------
const toMin = (hm) => {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
};
const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
const newSlot = () => ({ weekday: "", start: "09:00", end: "12:00" });

function initialClassTime(cls) {
  const slots = (cls?.schedules || []).map((s) => ({
    weekday: String(s.weekday),
    start: hhmm(s.start_time),
    end: hhmm(s.end_time),
  }));
  return { slots: slots.length ? slots : [newSlot()], onTime: cls?.late_threshold_minutes ?? 10 };
}

function classTimeError(time) {
  const { slots } = time;
  if (!slots.length || slots.some((s) => s.weekday === "")) return "courses.time.weekdayRequired";
  if (slots.some((s) => !s.start || !s.end)) return "courses.time.required";
  if (slots.some((s) => toMin(s.end) <= toMin(s.start))) return "courses.time.endBeforeStart";
  const onTime = Number(time.onTime);
  if (time.onTime === "" || onTime < 0 || slots.some((s) => onTime > toMin(s.end) - toMin(s.start)))
    return "courses.time.onTimeOutOfRange";
  const sorted = [...slots].sort((x, y) => x.weekday - y.weekday || toMin(x.start) - toMin(y.start));
  if (sorted.some((s, i) => i && s.weekday === sorted[i - 1].weekday && toMin(s.start) < toMin(sorted[i - 1].end)))
    return "courses.time.overlap";
  return "";
}

const classTimeBody = (time) => ({
  schedules: time.slots.map((s) => ({ weekday: Number(s.weekday), start_time: s.start, end_time: s.end })),
  late_threshold_minutes: Number(time.onTime),
  checkin_open_offset_minutes: 0,
});

function ClassTimeFields({ time, onChange }) {
  const { t } = useAppearanceSettings();
  const setSlot = (i, k) => (e) =>
    onChange({ ...time, slots: time.slots.map((s, j) => (j === i ? { ...s, [k]: e.target.value } : s)) });
  const removeSlot = (i) => onChange({ ...time, slots: time.slots.filter((_, j) => j !== i) });
  const addSlot = () => onChange({ ...time, slots: [...time.slots, newSlot()] });
  const onTime = Number(time.onTime) || 0;

  return (
    <div className="space-y-3">
      <label className={labelCls}>
        <CalendarDays className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        {t("courses.time.slotsLabel")}
      </label>
      {time.slots.map((slot, i) => {
        const ok = slot.start && slot.end && toMin(slot.end) > toMin(slot.start);
        const until = ok ? fromMin(Math.min(toMin(slot.start) + onTime, toMin(slot.end))) : "";
        return (
          <div key={i} className="space-y-1.5">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
              <select value={slot.weekday} onChange={setSlot(i, "weekday")} className={inputCls}>
                <option value="">{t("courses.time.pickWeekday")}</option>
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>
                    {t("courses.time.everyPrefix")}{t(`courses.time.days.${d}`)}
                  </option>
                ))}
              </select>
              <input type="time" value={slot.start} onChange={setSlot(i, "start")} aria-label={t("courses.time.start")} className={`${inputCls} w-32`} />
              <input type="time" value={slot.end} onChange={setSlot(i, "end")} aria-label={t("courses.time.end")} className={`${inputCls} w-32`} />
              <button
                type="button"
                onClick={() => removeSlot(i)}
                disabled={time.slots.length === 1}
                aria-label={t("courses.time.removeSlot")}
                title={t("courses.time.removeSlot")}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {ok && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-medium pl-1">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("common.status.present")} {slot.start}-{until}
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                  {t("common.status.late")} {until}-{slot.end}
                </span>
                <span className="text-red-500 dark:text-red-400">
                  {t("common.status.absent")} {t("courses.time.notCheckedBy")} {slot.end}
                </span>
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={addSlot}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg px-3 py-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {t("courses.time.addSlot")}
      </button>
      <div>
        <label className={labelCls}>
          <ScanFace className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          {t("courses.time.onTimeMinutes")}
        </label>
        <input
          type="number"
          min={0}
          max={240}
          value={time.onTime}
          onChange={(e) => onChange({ ...time, onTime: e.target.value })}
          className={`${inputCls} w-32`}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// จัดการคลาส: เกณฑ์การเช็คชื่อ + รายชื่อนักศึกษาในคลาส
// ---------------------------------------------------------------------------
export function ManageCourseModal({ cls, onClose, onSaved }) {
  const { t } = useAppearanceSettings();
  const [time, setTime] = useState(() => initialClassTime(cls));
  const [rule, setRule] = useState({
    allowManualFallback: cls.allow_manual_fallback,
    startDate: cls.start_date || "",
    endDate: cls.end_date || "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (patch) => setRule((r) => ({ ...r, ...patch }));

  async function handleSave() {
    if (rule.startDate && rule.endDate && rule.endDate < rule.startDate) {
      setError(t("courses.modal.endBeforeStart"));
      return;
    }
    const timeError = classTimeError(time);
    if (timeError) {
      setError(t(timeError));
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api(`/classes/${cls.id}`, {
        method: "PUT",
        body: {
          start_date: rule.startDate || null,
          end_date: rule.endDate || null,
          ...classTimeBody(time),
          allow_manual_fallback: rule.allowManualFallback,
        },
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell
      code={cls.course_code}
      title={`${t("courses.modal.titlePrefix")} ${cls.course_name}`}
      onClose={onClose}
      wide
      footer={
        <>
          <CancelButton onClick={onClose} />
          <PrimaryButton busy={busy} onClick={handleSave}>
            {!busy && <Save className="w-4 h-4" />}
            {t("courses.modal.saveRule")}
          </PrimaryButton>
        </>
      }
    >
      <ErrorText>{error}</ErrorText>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>{t("courses.modal.teachStart")}</label>
          <input type="date" value={rule.startDate} onChange={(e) => update({ startDate: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t("courses.modal.teachEnd")}</label>
          <input type="date" value={rule.endDate} onChange={(e) => update({ endDate: e.target.value })} className={inputCls} />
        </div>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-3">{t("courses.modal.teachEndNote")}</p>

      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ScanFace className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t("courses.modal.faceCheckinTitle")}</h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{t("courses.modal.faceCheckinDesc")}</p>
        </div>
      </div>

      <ClassTimeFields time={time} onChange={setTime} />

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t("courses.modal.manualFallback")}</div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{t("courses.modal.manualFallbackDesc")}</div>
        </div>
        <Switch on={rule.allowManualFallback} onChange={(v) => update({ allowManualFallback: v })} />
      </div>

      <EnrollmentSection cls={cls} />
    </ModalShell>
  );
}

// รายชื่อนักศึกษาในคลาส (แสดงอย่างเดียว)
function EnrollmentSection({ cls }) {
  const { t } = useAppearanceSettings();
  const enrolled = useApi(`/classes/${cls.id}/students`, []);
  const rows = enrolled.data || [];

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
        {t("live.classStudents")} ({rows.length} {t("common.units.people")})
      </h4>
      <ErrorText>{enrolled.error}</ErrorText>
      <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
        {rows.map((e) => (
          <div key={e.id} className="py-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400 mr-2">{e.student?.student_code}</span>
            <span className="text-slate-800 dark:text-slate-100">{e.student?.full_name}</span>
          </div>
        ))}
        {!enrolled.loading && rows.length === 0 && (
          <div className="py-3 text-sm text-slate-400 dark:text-slate-500">{t("live.noStudentsInClass")}</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// เช็คชื่อ: เปิดคาบเรียนวันนี้ + ดูสถานะ/บันทึกแบบ manual
// ---------------------------------------------------------------------------
const nowHHMM = () => new Date().toTimeString().slice(0, 5);

const statusCls = {
  present: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  late: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  absent: "bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400",
  open: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  upcoming: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
};

export function SessionModal({ cls, onClose, onChanged }) {
  const { t } = useAppearanceSettings();
  const today = isoDate();
  const sessionReq = useApi(`/attendance/sessions/${cls.id}/today`);
  const session = sessionReq.data;
  const recordsReq = useApi(
    session ? `/attendance/records?class_id=${cls.id}&start=${today}&end=${today}` : null,
    []
  );
  const rows = (recordsReq.data || []).filter((r) => session && r.session_id === session.id);

  const [showForm, setShowForm] = useState(false);
  const [start, setStart] = useState(nowHHMM);
  const [end, setEnd] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // รีเฟรชสถานะทุก 15 วินาทีระหว่างเปิดหน้าต่างนี้ (นักศึกษากำลังสแกนหน้าเข้ามา)
  const reloadRecords = recordsReq.reload;
  useEffect(() => {
    if (!session) return undefined;
    const timer = setInterval(reloadRecords, 15000);
    return () => clearInterval(timer);
  }, [session, reloadRecords]);

  async function openSession() {
    setBusy(true);
    setError("");
    try {
      await api("/attendance/sessions", {
        method: "POST",
        body: {
          class_id: cls.id,
          session_date: today,
          start_time: `${start}:00`,
          end_time: end ? `${end}:00` : null,
        },
      });
      setShowForm(false);
      sessionReq.reload();
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function mark(row, status) {
    setError("");
    try {
      await api("/attendance/manual", {
        method: "POST",
        body: { session_id: row.session_id, enrollment_id: row.enrollment_id, status },
      });
      recordsReq.reload();
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  const form = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            <Clock className="w-3.5 h-3.5" />
            {t("live.startTime")}
          </label>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>
            <Clock className="w-3.5 h-3.5" />
            {t("live.endTime")}
          </label>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={inputCls} />
        </div>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {t("live.windowNotePrefix")} {cls.checkin_open_offset_minutes} {t("common.units.minutes")}{" "}
        {t("live.windowNoteMiddle")} {cls.checkin_close_offset_minutes} {t("common.units.minutes")}{" "}
        {t("live.windowNoteSuffix")} {cls.late_threshold_minutes} {t("common.units.minutes")}
      </p>
      <PrimaryButton busy={busy} onClick={openSession} disabled={!start}>
        {!busy && <PlayCircle className="w-4 h-4" />}
        {t("live.openSession")}
      </PrimaryButton>
    </div>
  );

  return (
    <ModalShell code={cls.course_code} title={`${t("courses.card.checkin")} — ${cls.course_name}`} onClose={onClose} wide>
      <ErrorText>{error || sessionReq.error || recordsReq.error}</ErrorText>
      {sessionReq.loading ? (
        <div className="text-sm text-slate-400">{t("live.loading")}</div>
      ) : !session ? (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("live.noSessionYet")}</p>
          {form}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl px-4 py-3">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {t("live.sessionToday")} {hhmm(session.start_time)}
              {session.end_time ? ` - ${hhmm(session.end_time)}` : ""}
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showForm ? t("common.actions.cancel") : t("live.openAnother")}
            </button>
          </div>
          {showForm && form}
          {!cls.allow_manual_fallback && (
            <p className="text-xs text-amber-600 dark:text-amber-400">{t("live.manualDisabled")}</p>
          )}
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {rows.map((r) => (
              <div key={r.enrollment_id} className="flex flex-wrap items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{r.student_name}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {r.student_code}
                    {r.check_in_time && ` • ${hhmm(r.check_in_time)}`}
                    {r.method && ` • ${r.method === "face" ? t("live.byFace") : t("live.byManual")}`}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCls[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
                {cls.allow_manual_fallback && (
                  <div className="flex gap-1">
                    <MarkButton onClick={() => mark(r, "present")} title={STATUS_LABEL.present} cls="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                      <CheckCircle2 className="w-4 h-4" />
                    </MarkButton>
                    <MarkButton onClick={() => mark(r, "late")} title={STATUS_LABEL.late} cls="text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40">
                      <Clock className="w-4 h-4" />
                    </MarkButton>
                    <MarkButton onClick={() => mark(r, "absent")} title={STATUS_LABEL.absent} cls="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40">
                      <XCircle className="w-4 h-4" />
                    </MarkButton>
                  </div>
                )}
              </div>
            ))}
            {!recordsReq.loading && rows.length === 0 && (
              <div className="py-3 text-sm text-slate-400 dark:text-slate-500">{t("live.noStudentsInClass")}</div>
            )}
          </div>
        </>
      )}
    </ModalShell>
  );
}

function MarkButton({ cls, title, onClick, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg border border-slate-100 dark:border-slate-800 transition-colors ${cls}`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// สร้างรายวิชา + คลาสแรกของรายวิชา / แก้ไขรายวิชา (cls = คลาสที่จะแก้ไข) + งดสอนวันนี้
// ---------------------------------------------------------------------------
export function CreateCourseModal({ onClose, onCreated }) {
  return <CourseFormModal onClose={onClose} onDone={onCreated} />;
}

export function EditCourseModal({ cls, onClose, onSaved }) {
  return <CourseFormModal cls={cls} onClose={onClose} onDone={onSaved} />;
}

function CourseFormModal({ cls, onClose, onDone }) {
  const { t } = useAppearanceSettings();
  const year = new Date().getFullYear() + 543;
  const [form, setForm] = useState(() => ({
    course_code: cls?.course_code || "",
    course_name: cls?.course_name || "",
    credit: cls ? (cls.credit ?? "") : 3,
    class_code: cls?.class_code || "",
    semester: cls ? cls.semester || "" : "1",
    academic_year: cls ? cls.academic_year || "" : String(year),
    start_date: cls?.start_date || "",
    end_date: cls?.end_date || "",
  }));
  const [time, setTime] = useState(() => initialClassTime(cls));
  const [cancelDays, setCancelDays] = useState(() => cls?.cancelled_dates || []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  // งดสอนได้เฉพาะรายวิชาที่เริ่มการสอนแล้ว
  const canCancel = !!cls?.started_at;

  function validate() {
    if (!form.course_code.trim() || !form.course_name.trim()) return t("live.courseRequired");
    if (form.start_date && form.end_date && form.end_date < form.start_date) return t("courses.modal.endBeforeStart");
    const timeError = classTimeError(time);
    return timeError ? t(timeError) : "";
  }

  const courseBody = () => ({
    course_code: form.course_code.trim(),
    course_name: form.course_name.trim(),
    credit: form.credit === "" ? null : Number(form.credit),
  });

  const classBody = () => ({
    class_code: form.class_code.trim() || `${form.course_code.trim()}-SEC1`,
    class_name: form.course_name.trim(),
    semester: form.semester || null,
    academic_year: form.academic_year || null,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
    ...classTimeBody(time),
  });

  async function create() {
    let course = null;
    try {
      const me = await api("/teachers/me");
      course = await api("/courses", {
        method: "POST",
        body: { ...courseBody(), teacher_id: me.id, department_id: me.department_id },
      });
      await api("/classes", { method: "POST", body: { course_id: course.id, ...classBody() } });
    } catch (err) {
      // สร้างคลาสไม่สำเร็จ -> ลบรายวิชาที่เพิ่งสร้างทิ้ง จะได้ไม่ค้างครึ่งๆ กลางๆ
      if (course) await api(`/courses/${course.id}`, { method: "DELETE" }).catch(() => {});
      throw err;
    }
  }

  async function update() {
    // PUT /courses ต้องส่งทุกฟิลด์ -> ดึงของเดิมมาก่อน (department, description)
    const course = await api(`/courses/${cls.course_id}`);
    await api(`/courses/${cls.course_id}`, { method: "PUT", body: { ...course, ...courseBody() } });
    await api(`/classes/${cls.id}`, { method: "PUT", body: classBody() });
    if (!canCancel) return;
    const before = cls.cancelled_dates || [];
    for (const day of cancelDays.filter((d) => !before.includes(d))) {
      await api(`/classes/${cls.id}/cancellations/${day}`, { method: "POST" });
    }
    for (const day of before.filter((d) => !cancelDays.includes(d))) {
      await api(`/classes/${cls.id}/cancellations/${day}`, { method: "DELETE" });
    }
  }

  async function handleSubmit() {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await (cls ? update() : create());
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const field = (key, label, props = {}) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input value={form[key]} onChange={set(key)} className={inputCls} {...props} />
    </div>
  );

  return (
    <ModalShell
      code={cls?.course_code}
      title={cls ? t("courses.editCourse") : t("courses.createCourse")}
      onClose={onClose}
      footer={
        <>
          <CancelButton onClick={onClose} />
          <PrimaryButton busy={busy} onClick={handleSubmit}>
            {!busy && (cls ? <Save className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />)}
            {cls ? t("common.actions.save") : t("courses.createCourse")}
          </PrimaryButton>
        </>
      }
    >
      <ErrorText>{error}</ErrorText>
      <div className="grid grid-cols-2 gap-4">
        {field("course_code", t("live.courseCode"), { placeholder: "CS-301" })}
        {field("credit", t("live.credit"), { type: "number", min: 0, max: 12 })}
      </div>
      {field("course_name", t("live.courseName"))}
      <div className="grid grid-cols-3 gap-4">
        {field("class_code", t("live.section"), { placeholder: "SEC1" })}
        {field("semester", t("live.semester"))}
        {field("academic_year", t("live.academicYear"))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field("start_date", t("live.startDate"), { type: "date" })}
        {field("end_date", t("live.endDate"), { type: "date" })}
      </div>
      <ClassTimeFields time={time} onChange={setTime} />
      {canCancel && (
        <CancelDaysField days={cancelDays} onChange={setCancelDays} slots={time.slots} endDate={form.end_date} />
      )}
    </ModalShell>
  );
}

// วันเรียนตามตารางตั้งแต่วันนี้ถึงวันสิ้นสุดการสอน (ไม่เกิน 6 เดือน) ให้เลือกงดสอน
// weekday ของ backend: 0=จันทร์ ... 6=อาทิตย์ ส่วน getDay() ของ JS: 0=อาทิตย์
function upcomingClassDays(slots, endDate) {
  const weekdays = new Set(slots.filter((s) => s.weekday !== "").map((s) => Number(s.weekday)));
  const today = new Date();
  const last = endDate ? parseDate(endDate) : addDays(today, 180);
  const days = [];
  for (let d = today; d <= last && days.length < 60; d = addDays(d, 1)) {
    if (weekdays.has((d.getDay() + 6) % 7)) days.push(isoDate(d));
  }
  return days;
}

function CancelDaysField({ days, onChange, slots, endDate }) {
  const { t } = useAppearanceSettings();
  const options = upcomingClassDays(slots, endDate).filter((d) => !days.includes(d));
  const weekdayOf = (iso) => t(`courses.time.days.${(parseDate(iso).getDay() + 6) % 7}`);

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
      <div>
        <label className={labelCls}>
          <CalendarX className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          {t("courses.cancelDays")}
        </label>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">{t("courses.cancelDaysDesc")}</p>
      </div>
      <select
        value=""
        onChange={(e) => e.target.value && onChange([...days, e.target.value].sort())}
        className={inputCls}
      >
        <option value="">{t("courses.pickCancelDay")}</option>
        {options.map((d) => (
          <option key={d} value={d}>
            {weekdayOf(d)} {thaiDate(d)}
          </option>
        ))}
      </select>
      {days.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {days.map((d) => (
            <span
              key={d}
              className="flex items-center gap-1.5 text-xs font-semibold pl-3 pr-1.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400"
            >
              {weekdayOf(d)} {thaiDate(d)}
              <button
                type="button"
                onClick={() => onChange(days.filter((x) => x !== d))}
                aria-label={t("courses.removeCancelDay")}
                title={t("courses.removeCancelDay")}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Switch({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
        on ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
      }`}
      aria-pressed={on}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}
