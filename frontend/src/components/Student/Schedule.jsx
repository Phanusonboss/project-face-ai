import { useEffect, useRef, useState } from "react";
import { CalendarDays, CalendarRange, List, Info, CheckCircle2, MapPin } from "lucide-react";
import { useApi } from "../../lib/useApi";
import { addDays, countStatus, hhmm, isoDate, parseDate, timeRange } from "../../lib/format";
import LoadState from "../LoadState";
import StudentLayout from "./StudentLayout";
import { useStudentI18n } from "./studentI18n";

const COLORS = ["blue", "purple", "emerald", "amber", "rose", "sky"];
const DAY_COUNT = 7;

// วันจันทร์ของสัปดาห์ที่มีวันที่ d
function mondayOf(d) {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  out.setDate(out.getDate() - ((out.getDay() + 6) % 7));
  return out;
}

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const endMinutes = (item) => (item.end_time ? toMinutes(item.end_time) : toMinutes(item.start_time) + 60);

// จัดคาบที่เวลาซ้อนกันในวันเดียวกันให้อยู่คนละแถว (lane) ไม่ทับกัน
function assignLanes(items) {
  const laneEnds = [];
  return items.map((item) => {
    const start = toMinutes(item.start_time);
    let lane = laneEnds.findIndex((end) => end <= start);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(endMinutes(item));
    } else {
      laneEnds[lane] = endMinutes(item);
    }
    return { ...item, lane };
  });
}

// รวมตารางเรียนประจำสัปดาห์ (class_schedules จาก /classes/mine) กับคาบที่อาจารย์เปิดเช็คชื่อจริง
// - คาบตามตารางที่มีการเปิดเช็คชื่อแล้ว จะใช้สถานะจริงของคาบนั้น (เข้าเรียน/สาย/ขาด/รอเช็คชื่อ)
// - คาบตามตารางที่ยังไม่ถึง = "ตามตาราง", ที่ผ่านไปแล้วแต่ไม่ได้เปิดเช็คชื่อ = "ไม่ได้เปิดเช็คชื่อ"
// - คาบที่อาจารย์เปิดนอกตาราง (เช่น สอนชดเชย) ก็แสดงด้วย
// แสดงเฉพาะวันที่อยู่ในช่วงเปิด-ปิดภาคของคลาส (start_date - end_date)
function scheduleItems(classes, sessions, from, to, today, nowTime) {
  const items = [];
  const used = new Set();
  // คาบที่เปิดเช็คชื่อจะนับว่าเป็นคาบตามตาราง ถ้าเริ่มไม่เกิน 1 ชม. ก่อนเวลาเรียนและก่อนหมดคาบ
  const matches = (session, sc) =>
    session.start_time &&
    toMinutes(session.start_time) >= toMinutes(sc.start_time) - 60 &&
    toMinutes(session.start_time) < toMinutes(sc.end_time);
  for (let d = new Date(from); d <= to; d = addDays(d, 1)) {
    const iso = isoDate(d);
    const weekday = (d.getDay() + 6) % 7; // 0 = จันทร์ เหมือนในฐานข้อมูล
    classes.forEach((c) => {
      if ((c.start_date && iso < c.start_date) || (c.end_date && iso > c.end_date)) return;
      (c.schedules || [])
        .filter((sc) => sc.weekday === weekday)
        .forEach((sc) => {
          const session = sessions.find(
            (x) => x.class_id === c.id && x.session_date === iso && !used.has(x.session_id) && matches(x, sc)
          );
          const ended = iso < today || (iso === today && sc.end_time <= nowTime);
          if (session) used.add(session.session_id);
          items.push({
            key: `${c.id}-${iso}-${sc.start_time}`,
            class_id: c.id,
            course_code: c.course_code,
            course_name: c.course_name,
            session_date: iso,
            start_time: sc.start_time,
            end_time: sc.end_time,
            status: session ? session.status : ended ? "noSession" : "scheduled",
            my_check_in_time: session?.my_check_in_time ?? null,
          });
        });
    });
  }
  sessions
    .filter((x) => !used.has(x.session_id))
    .forEach((x) => items.push({ ...x, key: `session-${x.session_id}` }));
  return items.sort((a, b) =>
    `${a.session_date} ${a.start_time}` < `${b.session_date} ${b.start_time}` ? -1 : 1
  );
}

// สีประจำวิชา
const colorMap = {
  blue: {
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-700",
  },
  purple: {
    dot: "bg-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-400",
    text: "text-purple-700",
  },
  emerald: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    text: "text-emerald-700",
  },
  amber: {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-400",
    text: "text-amber-700",
  },
  rose: {
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-400",
    text: "text-rose-700",
  },
  sky: {
    dot: "bg-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-400",
    text: "text-sky-700",
  },
};

export default function Schedule() {
  const { t, date } = useStudentI18n();
  // มือถือเริ่มที่มุมมองรายการ (ตารางสัปดาห์กว้างเกินจอ) ยังกดสลับไปดูตารางได้
  const [view, setView] = useState(() =>
    typeof window !== "undefined" && window.matchMedia?.("(max-width: 767px)").matches ? "list" : "week"
  );
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [today] = useState(() => isoDate());
  const weekEnd = addDays(weekStart, 6);
  const weekReq = useApi(`/attendance/my-sessions?start=${isoDate(weekStart)}&end=${isoDate(weekEnd)}`, []);
  const todayReq = useApi(`/attendance/my-sessions?start=${today}&end=${today}`, []);
  const allReq = useApi(`/attendance/my-sessions?start=2000-01-01&end=${today}`, []);
  const classesReq = useApi("/classes/mine", []);
  const statusText = (s) => t(`common.status.${s}`);

  // สีประจำวิชา ตามลำดับคลาสที่ลงทะเบียน
  const colorOfClass = new Map((classesReq.data || []).map((c, i) => [c.id, COLORS[i % COLORS.length]]));
  const colorOf = (classId) => colorOfClass.get(classId) || "blue";

  const classes = classesReq.data || [];
  const nowTime = new Date().toTimeString().slice(0, 8);
  const weekSessions = scheduleItems(classes, weekReq.data || [], weekStart, weekEnd, today, nowTime);
  const legend = [...new Map(weekSessions.map((s) => [s.class_id, s])).values()];
  const stats = countStatus(allReq.data || []);
  const todaySchedule = scheduleItems(
    classes,
    todayReq.data || [],
    parseDate(today),
    parseDate(today),
    today,
    nowTime
  );
  const loadError = weekReq.error || todayReq.error || allReq.error || classesReq.error;
  const weekBtn =
    "border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors";
  const viewBtn = (active) =>
    `flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
      active
        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
    }`;

  return (
    <StudentLayout
      titleIcon={CalendarDays}
      titleKey="nav.schedule"
      subtitle={t("schedule.subtitle", { from: date(isoDate(weekStart)), to: date(isoDate(weekEnd)) })}
      headerExtra={
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className={weekBtn}>
            {t("schedule.prevWeek")}
          </button>
          <button onClick={() => setWeekStart(mondayOf(new Date()))} className={weekBtn}>
            {t("schedule.thisWeek")}
          </button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className={weekBtn}>
            {t("schedule.nextWeek")}
          </button>
        </div>
      }
    >
      <LoadState loading={false} error={loadError} />

      {/* View toggle (+ ปุ่มเลื่อนสัปดาห์สำหรับจอเล็ก ซึ่งหัวหน้าไม่มีที่พอ) */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setView("week")} className={viewBtn(view === "week")}>
          <CalendarRange className="w-4 h-4" />
          {t("schedule.weekView")}
        </button>
        <button onClick={() => setView("list")} className={viewBtn(view === "list")}>
          <List className="w-4 h-4" />
          {t("schedule.listView")}
        </button>
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className={weekBtn} aria-label={t("schedule.prevWeek")}>
            ←
          </button>
          <button onClick={() => setWeekStart(mondayOf(new Date()))} className={weekBtn}>
            {t("schedule.thisWeek")}
          </button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className={weekBtn} aria-label={t("schedule.nextWeek")}>
            →
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Timetable */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 overflow-x-auto">
          {view === "week" ? (
            <>
              <UniversityTimetable
                weekStart={weekStart}
                items={weekSessions}
                today={today}
                colorOf={colorOf}
                statusText={statusText}
              />

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 pt-4 border-t border-slate-100">
                {legend.length === 0 && (
                  <span className="text-xs text-slate-400">
                    {weekReq.loading ? t("common.loading") : t("schedule.emptyWeek")}
                  </span>
                )}
                {legend.map((s) => (
                  <span key={s.class_id} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className={`w-2.5 h-2.5 rounded-full ${colorMap[colorOf(s.class_id)].dot}`} />
                    {s.course_code} {s.course_name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {weekSessions.length === 0 && <div className="text-sm text-slate-400">{t("schedule.emptyWeek")}</div>}
              {weekSessions.map((s) => {
                const cs = colorMap[colorOf(s.class_id)];
                return (
                  // มือถือ: วันเวลา+สถานะอยู่บรรทัดบน ชื่อวิชาอยู่บรรทัดล่าง / จอใหญ่: เรียงแถวเดียว
                  <div
                    key={s.key}
                    className={`rounded-xl border-l-4 ${cs.border} ${cs.bg} px-4 py-3 sm:flex sm:items-center sm:gap-4 ${
                      s.status === "noSession" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 sm:contents">
                      <div className="text-xs font-semibold text-slate-500 tabular-nums sm:w-56 sm:shrink-0">
                        {date(s.session_date, { weekday: "short", day: "numeric", month: "short" })}
                        <span className="text-slate-400 font-normal"> • {timeRange(s.start_time, s.end_time)}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap shrink-0 sm:order-last ${
                          STATUS_CHIP[s.status] || STATUS_CHIP.scheduled
                        }`}
                      >
                        {statusText(s.status)}
                      </span>
                    </div>
                    <div className="mt-1 sm:mt-0 min-w-0 sm:flex-1">
                      <span className={`text-sm font-bold ${cs.text}`}>{s.course_code}</span>{" "}
                      <span className="text-sm text-slate-600">{s.course_name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Attendance stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900">{t("schedule.stats")}</h3>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" className="stroke-slate-200" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - stats.rate / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-slate-900">{Math.round(stats.rate)}%</span>
                  <span className="text-[10px] text-slate-400">{t("schedule.rate")}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm flex-1">
                {[
                  ["bg-emerald-500", "present", stats.present],
                  ["bg-red-500", "absent", stats.absent],
                  ["bg-blue-500", "lateShort", stats.late],
                ].map(([dot, key, n]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                    <span className="text-slate-600">{t(`common.status.${key}`)}</span>
                    <span className="font-semibold text-slate-800 ml-auto">{t("common.timesN", { n })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's schedule */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900">{t("schedule.today")}</h3>
            </div>
            <div className="space-y-3">
              {todaySchedule.length === 0 && <div className="text-sm text-slate-400">{t("schedule.noToday")}</div>}
              {todaySchedule.map((s) => {
                const cs = colorMap[colorOf(s.class_id)];
                return (
                  <div key={s.key} className={`rounded-xl ${cs.bg} px-4 py-3`}>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} />
                      {timeRange(s.start_time, s.end_time)}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-bold ${cs.text}`}>{s.course_code}</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold bg-white text-slate-500 px-2 py-1 rounded-lg shrink-0">
                        <MapPin className="w-3 h-3" />
                        {statusText(s.status)}
                        {s.my_check_in_time ? ` ${hhmm(s.my_check_in_time)}` : ""}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.course_name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900">{t("schedule.notes")}</h3>
            </div>
            <div className="space-y-2.5 mb-4">
              {t("schedule.noteItems").map((note) => (
                <div key={note} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {note}
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 bg-blue-50 text-blue-600 text-xs rounded-xl px-4 py-3">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              {t("schedule.contact")}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

// สีป้ายสถานะในช่องตาราง
const STATUS_CHIP = {
  present: "bg-emerald-100 text-emerald-700",
  late: "bg-amber-100 text-amber-700",
  absent: "bg-red-100 text-red-600",
  open: "bg-blue-600 text-white",
  upcoming: "bg-slate-100 text-slate-500",
  closed: "bg-slate-100 text-slate-500",
  scheduled: "bg-white text-slate-500 border border-slate-200",
  noSession: "bg-slate-100 text-slate-400",
};

const SLOT = 30; // ความละเอียดของคอลัมน์ (นาที) — หัวตารางแสดงทีละชั่วโมง

const HOUR_WIDTH = 120; // ความกว้างต่อชั่วโมง (px) — พอให้คาบ 1 ชั่วโมงแสดงรายละเอียดครบ
const DAY_COL_WIDTH = 132;

// ตารางเรียนแบบมหาวิทยาลัย: แถว = วัน, คอลัมน์ = ช่วงเวลา, คาบเรียน = ช่องที่ยาวตามเวลาเรียน
// ถ้าช่วงเวลายาวกว่าความกว้างการ์ด จะเลื่อนซ้าย-ขวาได้ โดยคอลัมน์วันค้างอยู่ทางซ้าย
function UniversityTimetable({ weekStart, items, today, colorOf, statusText }) {
  const { t, date } = useStudentI18n();
  const days = t("schedule.days");
  const scrollRef = useRef(null);

  const timed = items.filter((i) => i.start_time);
  const firstHour = Math.min(8, ...timed.map((i) => Math.floor(toMinutes(i.start_time) / 60)));
  const lastHour = Math.max(17, ...timed.map((i) => Math.ceil(endMinutes(i) / 60)));
  const hours = Array.from({ length: lastHour - firstHour }, (_, i) => firstHour + i);
  const slotCount = hours.length * (60 / SLOT);
  // ช่องเริ่มปัดลง ช่องจบปัดขึ้น (คาบ 23:28-23:59 จะกินช่อง 23:00-24:00 เต็ม อ่านง่ายกว่าครึ่งช่อง)
  const startSlot = (item) => Math.floor((toMinutes(item.start_time) - firstHour * 60) / SLOT);
  const endSlot = (item) => Math.ceil((endMinutes(item) - firstHour * 60) / SLOT);
  const hh = (h) => `${String(h).padStart(2, "0")}:00`;

  // เปลี่ยนสัปดาห์แล้วเลื่อนกลับไปเริ่มที่ช่วงเช้าเสมอ
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0 });
  }, [weekStart]);

  // จันทร์-ศุกร์แสดงเสมอ เสาร์-อาทิตย์แสดงเมื่อมีคาบเรียน
  const rows = Array.from({ length: DAY_COUNT }, (_, i) => {
    const iso = isoDate(addDays(weekStart, i));
    const dayItems = assignLanes(timed.filter((item) => item.session_date === iso));
    const lanes = Math.max(1, ...dayItems.map((item) => item.lane + 1));
    return { i, iso, dayItems, lanes };
  }).filter((r) => r.i < 5 || r.dayItems.length > 0);

  // คอลัมน์วันค้างอยู่ทางซ้ายขณะเลื่อน มีเงาบาง ๆ แบ่งจากช่องเวลา
  const stickyDay = "sticky left-0 z-10 shadow-[4px_0_6px_-4px_rgba(15,23,42,0.15)]";

  return (
    <div ref={scrollRef} className="timetable-scroll overflow-x-auto rounded-xl border border-slate-200">
      <table
        className="table-fixed border-separate border-spacing-0 text-sm"
        style={{ width: "100%", minWidth: DAY_COL_WIDTH + hours.length * HOUR_WIDTH }}
      >
        <colgroup>
          <col style={{ width: DAY_COL_WIDTH }} />
          {Array.from({ length: slotCount }, (_, i) => (
            <col key={i} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              className={`${stickyDay} bg-slate-50 border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-500`}
            >
              {t("schedule.dayTime")}
            </th>
            {hours.map((h) => (
              <th
                key={h}
                colSpan={60 / SLOT}
                className="bg-slate-50 border-b border-r border-slate-200 last:border-r-0 px-1 py-3 text-center text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap"
              >
                {hh(h)} - {hh(h + 1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ i, iso, dayItems, lanes }, rowIndex) =>
            Array.from({ length: lanes }, (_, lane) => {
              const isToday = iso === today;
              const lastRow = rowIndex === rows.length - 1 && lane === lanes - 1;
              const bottom = lastRow ? "" : "border-b";
              const laneItems = dayItems.filter((item) => item.lane === lane);
              const cells = [];
              for (let col = 0; col < slotCount; ) {
                const item = laneItems.find((x) => startSlot(x) === col);
                const endOfHour = col % (60 / SLOT) === 60 / SLOT - 1;
                if (item) {
                  const span = Math.max(1, Math.min(slotCount, endSlot(item)) - col);
                  const lastCol = col + span >= slotCount;
                  cells.push(
                    <td
                      key={item.key}
                      colSpan={span}
                      className={`${bottom} ${lastCol ? "" : "border-r"} border-slate-200 p-1.5 align-top ${
                        isToday ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <CourseCell item={item} color={colorOf(item.class_id)} statusText={statusText} />
                    </td>
                  );
                  col += span;
                } else {
                  cells.push(
                    <td
                      key={col}
                      className={`${bottom} ${endOfHour && col < slotCount - 1 ? "border-r" : ""} border-slate-200 ${
                        isToday ? "bg-blue-50/40" : ""
                      }`}
                    />
                  );
                  col += 1;
                }
              }
              return (
                <tr key={`${iso}-${lane}`} className="h-[88px]">
                  {lane === 0 && (
                    <th
                      rowSpan={lanes}
                      scope="row"
                      className={`${stickyDay} ${
                        rowIndex === rows.length - 1 ? "" : "border-b"
                      } border-r border-slate-200 px-4 py-3 text-left align-middle ${
                        isToday ? "bg-[#eff6ff] dark:bg-[#12203a]" : "bg-white"
                      }`}
                    >
                      <div className={`text-sm font-bold ${isToday ? "text-blue-600" : "text-slate-800"}`}>{days[i]}</div>
                      <div className="text-xs font-normal text-slate-400 mt-0.5">
                        {date(iso, { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      {isToday && (
                        <span className="inline-block mt-1.5 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {t("schedule.todayBadge")}
                        </span>
                      )}
                    </th>
                  )}
                  {cells}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function CourseCell({ item, color, statusText }) {
  const cs = colorMap[color];
  const muted = item.status === "noSession";
  return (
    <div
      title={`${item.course_code} ${item.course_name} • ${timeRange(item.start_time, item.end_time)} • ${statusText(item.status)}`}
      className={`h-full min-h-[72px] rounded-lg border-l-4 ${cs.border} ${cs.bg} px-2.5 py-2 flex flex-col overflow-hidden transition-shadow hover:shadow-md ${
        muted ? "opacity-60" : ""
      }`}
    >
      <div className={`text-xs font-bold ${cs.text} truncate`}>{item.course_code}</div>
      <div className="text-[11px] leading-snug text-slate-700 line-clamp-2">{item.course_name}</div>
      <div className="mt-auto pt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-[10px] text-slate-500 tabular-nums whitespace-nowrap">
          {timeRange(item.start_time, item.end_time)}
        </span>
        <span
          className={`rounded-full px-1.5 py-px text-[10px] font-semibold whitespace-nowrap ${
            STATUS_CHIP[item.status] || STATUS_CHIP.scheduled
          }`}
        >
          {statusText(item.status)}
        </span>
      </div>
    </div>
  );
}
