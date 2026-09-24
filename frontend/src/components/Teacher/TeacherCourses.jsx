import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CalendarDays,
  UsersRound,
  CalendarCheck,
  BarChart3,
  UserX,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  LayoutGrid,
  List,
  Database,
  Layers,
  Brain,
  Cpu,
  Wrench,
  ScanFace,
  Clock,
  X,
  Gauge,
  Save,
  BookOpen,
} from "lucide-react";
import TeacherLayout from "./TeacherLayout";
import { useAppearanceSettings } from "./useAppearanceSettings";

const filterTabs = [
  { key: "all", labelKey: "courses.filters.all" },
  { key: "teaching", labelKey: "courses.filters.teaching" },
  { key: "ended", labelKey: "courses.filters.ended" },
  { key: "notstarted", labelKey: "courses.filters.notStarted" },
];

const courses = [
  {
    code: "CS-201",
    name: "โครงสร้างข้อมูล (Data Structures)",
    term: "ภาคเรียนที่ 1/2567",
    room: "CS-201",
    students: 32,
    pct: 87,
    time: "10:30 - 12:00",
    status: "teaching",
    icon: Database,
    iconBg: "bg-blue-500",
    barColor: "bg-blue-500",
  },
  {
    code: "CS-202",
    name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)",
    term: "ภาคเรียนที่ 1/2567",
    room: "CS-202",
    students: 30,
    pct: 86,
    time: "09:00 - 11:00",
    status: "teaching",
    icon: Layers,
    iconBg: "bg-purple-500",
    barColor: "bg-purple-500",
  },
  {
    code: "CS-203",
    name: "ฐานข้อมูล (Database Systems)",
    term: "ภาคเรียนที่ 1/2567",
    room: "CS-203",
    students: 28,
    pct: 78,
    time: "13:30 - 15:30",
    status: "teaching",
    icon: Database,
    iconBg: "bg-orange-400",
    barColor: "bg-orange-400",
  },
  {
    code: "CS-204",
    name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)",
    term: "ภาคเรียนที่ 1/2567",
    room: "CS-204",
    students: 24,
    pct: 79,
    time: "08:00 - 10:00",
    status: "teaching",
    icon: Brain,
    iconBg: "bg-teal-400",
    barColor: "bg-teal-400",
  },
  {
    code: "CS-205",
    name: "ระบบปฏิบัติการ (Operating Systems)",
    term: "ภาคเรียนที่ 1/2567",
    room: "CS-205",
    students: 14,
    pct: 0,
    time: "15:30 - 17:30",
    status: "notstarted",
    icon: Cpu,
    iconBg: "bg-rose-400",
    barColor: "bg-slate-200 dark:bg-slate-700",
  },
];

const statusCls = {
  teaching: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  notstarted: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  ended: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
};

const statusLabelKey = {
  teaching: "common.status.teaching",
  notstarted: "common.status.notStarted",
  ended: "common.status.ended",
};

function parseStartTime(timeRange) {
  const start = (timeRange || "").split("-")[0]?.trim();
  return start && /^\d{1,2}:\d{2}$/.test(start) ? start.padStart(5, "0") : "08:00";
}

function parseEndTime(timeRange) {
  const end = (timeRange || "").split("-")[1]?.trim();
  return end && /^\d{1,2}:\d{2}$/.test(end) ? end.padStart(5, "0") : "09:00";
}

function defaultCheckinRule(course) {
  return {
    start: parseStartTime(course.time),
    end: parseEndTime(course.time),
    lateThreshold: 5,
    confidence: 85,
    allowManualFallback: true,
  };
}

export default function TeacherCourses() {
  const { t } = useAppearanceSettings();
  const [activeFilter, setActiveFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [manageCourse, setManageCourse] = useState(null);
  const [checkinByCourse, setCheckinByCourse] = useState({});
  const [savedCode, setSavedCode] = useState(null);

  function openManage(course) {
    setCheckinByCourse((prev) =>
      prev[course.code] ? prev : { ...prev, [course.code]: defaultCheckinRule(course) },
    );
    setManageCourse(course);
  }

  function updateRule(code, patch) {
    setCheckinByCourse((prev) => ({ ...prev, [code]: { ...prev[code], ...patch } }));
  }

  function handleSaveRule(code) {
    setSavedCode(code);
    setManageCourse(null);
    setTimeout(() => setSavedCode(null), 2500);
  }

  return (
    <TeacherLayout
      titleIcon={BookOpen}
      titleKey="nav.courses"
      subtitleKey="courses.subtitle"
      headerExtra={
        <button className="hidden sm:flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
          <CalendarDays className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          20 พฤษภาคม 2567
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </button>
      }
    >
      {savedCode && (
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4" />
          {t("courses.savedPrefix")} {savedCode} {t("courses.savedSuffix")}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t("courses.searchPlaceholder")}
            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 w-56"
          />
        </div>
        <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          {t("common.actions.filter")}
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 dark:shadow-blue-950">
          <Plus className="w-4 h-4" />
          {t("courses.createCourse")}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-950/40"
          label={t("courses.stats.totalCourses")}
          value="5"
          sub={t("courses.stats.totalCoursesSub")}
        />
        <StatCard
          icon={<UsersRound className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-950/40"
          label={t("courses.stats.totalStudents")}
          value="128"
          sub={t("courses.stats.totalStudentsSub")}
        />
        <StatCard
          icon={<CalendarCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-100 dark:bg-purple-950/40"
          label={t("courses.stats.checkinToday")}
          value="4"
          sub={t("courses.stats.checkinTodaySub")}
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-100 dark:bg-amber-950/40"
          label={t("courses.stats.attendanceRate")}
          value={
            <span className="flex items-center gap-1">
              74.22%
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </span>
          }
          sub={t("courses.stats.attendanceRateSub")}
        />
        <StatCard
          icon={<UserX className="w-6 h-6 text-red-500 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-950/40"
          label={t("courses.stats.absentStudents")}
          value="33"
          sub="25.78%"
          subColor="text-red-500 dark:text-red-400"
        />
      </div>

      {/* Filter tabs + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${
                activeFilter === tab.key
                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => setView("grid")}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              view === "grid" ? "bg-blue-600 text-white" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              view === "list" ? "bg-blue-600 text-white" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Course cards */}
      <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
        {courses.map((c) => {
          const Icon = c.icon;
          const isNotStarted = c.status === "notstarted";
          return (
            <div key={c.code} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white ${c.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">{c.code}</div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{c.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {c.term} • {t("courses.card.room")} {c.room}
                    </div>
                  </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${statusCls[c.status]}`}>
                {t(statusLabelKey[c.status])}
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                    <UsersRound className="w-3.5 h-3.5" />
                    {t("courses.card.students")}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {c.students} {t("common.units.people")}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                    <ScanFace className="w-3.5 h-3.5" />
                    {t("courses.card.checkinToday")}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{c.pct}%</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {t("courses.card.classTime")}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{c.time}</div>
                </div>
              </div>

              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                <div className={`h-full rounded-full ${c.barColor}`} style={{ width: `${c.pct}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => openManage(c)}
                  className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-lg py-2 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  {t("courses.card.manage")}
                </button>
                <button
                  disabled={isNotStarted}
                  className={`flex items-center justify-center gap-1 text-[11px] font-semibold rounded-lg py-2 transition-colors ${
                    isNotStarted
                      ? "text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-800 cursor-not-allowed"
                      : "text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  }`}
                >
                  <ScanFace className="w-3.5 h-3.5" />
                  {t("courses.card.checkin")}
                </button>
                <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 rounded-lg py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors">
                  <BarChart3 className="w-3.5 h-3.5" />
                  {t("courses.card.stats")}
                </button>
              </div>
            </div>
          );
        })}

        {/* Create new course card */}
        <button className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors p-8 text-center min-h-[260px]">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
            <Plus className="w-7 h-7 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{t("courses.createNewTitle")}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t("courses.createNewDesc")}</div>
          </div>
          <span className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200 dark:shadow-blue-950">
            <Plus className="w-4 h-4" />
            {t("courses.createCourse")}
          </span>
        </button>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2].map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === n
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(2, p + 1))}
            disabled={page === 2}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          {t("courses.perPage")}
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      {/* ---------- Manage course modal ---------- */}
      {manageCourse && (
        <ManageCourseModal
          course={manageCourse}
          rule={checkinByCourse[manageCourse.code] || defaultCheckinRule(manageCourse)}
          onChange={(patch) => updateRule(manageCourse.code, patch)}
          onClose={() => setManageCourse(null)}
          onSave={() => handleSaveRule(manageCourse.code)}
        />
      )}
    </TeacherLayout>
  );
}

function StatCard({ icon, iconBg, label, value, sub, subColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{label}</div>
        <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5">{value}</div>
        <div className={`text-xs mt-0.5 truncate ${subColor || "text-slate-400 dark:text-slate-500"}`}>{sub}</div>
      </div>
    </div>
  );
}

function ManageCourseModal({ course, rule, onChange, onClose, onSave }) {
  const { t } = useAppearanceSettings();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{course.code}</div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              {t("courses.modal.titlePrefix")} {course.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ScanFace className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t("courses.modal.faceCheckinTitle")}</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{t("courses.modal.faceCheckinDesc")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {t("courses.modal.openTime")}
              </label>
              <input
                type="time"
                value={rule.start}
                onChange={(e) => onChange({ start: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {t("courses.modal.closeTime")}
              </label>
              <input
                type="time"
                value={rule.end}
                onChange={(e) => onChange({ end: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-3">
            {t("courses.modal.defaultNotePrefix")} ({course.time})
          </p>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("courses.modal.lateThreshold")}</label>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {rule.lateThreshold} {t("common.units.minutes")}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={rule.lateThreshold}
              onChange={(e) => onChange({ lateThreshold: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {t("courses.modal.confidence")}
              </label>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{rule.confidence}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={99}
              value={rule.confidence}
              onChange={(e) => onChange({ confidence: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t("courses.modal.confidenceNote")}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t("courses.modal.manualFallback")}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{t("courses.modal.manualFallbackDesc")}</div>
            </div>
            <button
              type="button"
              onClick={() => onChange({ allowManualFallback: !rule.allowManualFallback })}
              className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                rule.allowManualFallback ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
              }`}
              aria-pressed={rule.allowManualFallback}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  rule.allowManualFallback ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t("common.actions.cancel")}
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-100 dark:shadow-blue-950"
          >
            <Save className="w-4 h-4" />
            {t("courses.modal.saveRule")}
          </button>
        </div>
      </div>
    </div>
  );
}