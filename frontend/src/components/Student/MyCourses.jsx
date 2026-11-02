import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  User,
  Search,
  CheckCircle2,
  BarChart3,
  Code2,
  Database,
  Cpu,
  Brain,
  MapPin,
  Info,
} from "lucide-react";
import { useApi } from "../../lib/useApi";
import { classPhase, countStatus, groupBy, hhmm, isoDate, termLabel } from "../../lib/format";
import LoadState from "../LoadState";
import StudentLayout from "./StudentLayout";
import FilterSelect from "./FilterSelect";
import { useStudentI18n } from "./studentI18n";

const COLORS = ["blue", "amber", "emerald", "purple", "sky", "rose"];
const ICONS = [Code2, Database, Cpu, Brain, BarChart3];

const colorMap = {
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    btn: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    bar: "bg-blue-500",
  },
  amber: {
    border: "border-l-amber-500",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    btn: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    bar: "bg-amber-500",
  },
  emerald: {
    border: "border-l-emerald-500",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    btn: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    bar: "bg-emerald-500",
  },
  purple: {
    border: "border-l-purple-500",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    btn: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    bar: "bg-purple-500",
  },
  sky: {
    border: "border-l-sky-500",
    iconBg: "bg-sky-100",
    iconText: "text-sky-600",
    btn: "bg-sky-50 text-sky-600 hover:bg-sky-100",
    bar: "bg-sky-500",
  },
  rose: {
    border: "border-l-rose-500",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    btn: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    bar: "bg-rose-500",
  },
};

export default function MyCourses() {
  const { t, date } = useStudentI18n();
  const [today] = useState(() => isoDate());
  const [term, setTerm] = useState("");
  const [phase, setPhase] = useState("");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const classesReq = useApi("/classes/mine", []);
  const sessionsReq = useApi(`/attendance/my-sessions?start=2000-01-01&end=${today}`, []);
  const sessionsByClass = groupBy(sessionsReq.data || [], (s) => s.class_id);

  const allCourses = (classesReq.data || []).map((c, i) => {
    const sessions = sessionsByClass.get(c.id) || [];
    const cnt = countStatus(sessions);
    const last = sessions[sessions.length - 1];
    return {
      id: c.id,
      code: c.course_code,
      name: c.course_name,
      nameEn:
        c.class_name && c.class_name !== c.course_name ? c.class_name : t("courses.credits", { n: c.credit ?? "-" }),
      teacher: c.teacher_name || "-",
      schedule: last
        ? t("courses.lastSession", { date: date(last.session_date), time: hhmm(last.start_time) })
        : t("courses.noSession"),
      room: t("courses.group", { code: c.class_code || "-" }),
      term: termLabel(c),
      phase: classPhase(c, today),
      counts: cnt,
      attended: cnt.present + cnt.late,
      total: cnt.total,
      icon: ICONS[i % ICONS.length],
      color: COLORS[i % COLORS.length],
    };
  });
  const terms = [...new Set(allCourses.map((c) => c.term))];
  const q = search.trim().toLowerCase();
  const courses = allCourses.filter(
    (c) =>
      (!term || c.term === term) &&
      (!phase || c.phase === phase) &&
      (!q || `${c.code} ${c.name} ${c.teacher}`.toLowerCase().includes(q))
  );
  const overall = countStatus(courses.flatMap((c) => sessionsByClass.get(c.id) || []));
  const loadError = classesReq.error || sessionsReq.error;

  return (
    <StudentLayout
      titleIcon={BookOpen}
      titleKey="nav.courses"
      subtitle={`${t("courses.subtitle")} • ${term ? t("courses.termN", { term }) : t("courses.allTerms")}`}
    >
      <LoadState loading={false} error={loadError} />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100"
          label={t("courses.total")}
          value={courses.length}
          sub={t("courses.unit")}
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
          label={t("courses.perfect")}
          value={courses.filter((c) => c.total > 0 && c.counts.absent === 0).length}
          sub={t("courses.unit")}
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
          label={t("courses.avgRate")}
          value={`${overall.rate.toFixed(1)}%`}
          sub={t("courses.ofAll")}
        />
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t("history.course")}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <FilterSelect label={t("courses.allTerms")} value={term} onChange={setTerm}>
          {terms.map((tm) => (
            <option key={tm} value={tm}>
              {t("courses.termOption", { term: tm })}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label={t("courses.all")} value={phase} onChange={setPhase}>
          <option value="teaching">{t("courses.teaching")}</option>
          <option value="ended">{t("courses.ended")}</option>
        </FilterSelect>
      </div>

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {!classesReq.loading && courses.length === 0 && (
          <div className="text-sm text-slate-400">
            {allCourses.length ? t("courses.noMatch") : t("courses.empty")}
          </div>
        )}
        {courses.map((c) => {
          const cs = colorMap[c.color];
          const pct = c.total ? Math.round((c.attended / c.total) * 100) : 0;
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${cs.border} shadow-sm p-5 flex flex-col`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cs.iconBg}`}>
                  <Icon className={`w-5 h-5 ${cs.iconText}`} />
                </div>
                <div className="min-w-0">
                  <div className={`font-bold text-sm ${cs.iconText}`}>{c.code}</div>
                  <div className="text-sm font-semibold text-slate-800 leading-snug">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.nameEn}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {c.teacher}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {c.schedule}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {c.room}
                </span>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">{t("courses.attended", { a: c.attended, t: c.total })}</span>
                  <span className={`font-semibold ${cs.iconText}`}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full ${cs.bar}`} style={{ width: `${pct}%` }} />
                </div>

                {openId === c.id && <CourseDetail course={c} />}
                <button
                  onClick={() => setOpenId(openId === c.id ? null : c.id)}
                  className={`w-full text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${cs.btn}`}
                >
                  {openId === c.id ? t("courses.hideDetail") : t("courses.showDetail")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
        <Info className="w-3.5 h-3.5" />
        {t("courses.hint")}
      </div>
    </StudentLayout>
  );
}

// รายละเอียดของวิชา: จำนวนแยกสถานะ + คะแนนเข้าเรียนที่อาจารย์บันทึกไว้
function CourseDetail({ course }) {
  const { t } = useStudentI18n();
  const { data: score, loading } = useApi(`/scores/me/${course.id}`);
  return (
    <div className="mb-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1.5">
      <div className="flex justify-between">
        <span>{t("courses.term")}</span>
        <span className="font-semibold">{course.term}</span>
      </div>
      <div className="flex justify-between">
        <span>{t("courses.breakdown")}</span>
        <span className="font-semibold">
          {course.counts.present} / {course.counts.late} / {course.counts.absent}
        </span>
      </div>
      <div className="flex justify-between">
        <span>{t("courses.score")}</span>
        <span className="font-semibold">
          {loading ? "..." : score ? Number(score.score).toFixed(2) : t("courses.notAnnounced")}
        </span>
      </div>
      <Link to="/history" className="block text-blue-600 font-semibold hover:underline pt-1">
        {t("courses.viewHistory")}
      </Link>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-medium truncate">{label}</div>
        <div className="text-2xl font-bold text-slate-900 leading-tight mt-0.5">{value}</div>
        <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
