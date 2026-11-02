import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ClipboardCheck,
  CalendarCheck,
  Percent,
  Trophy,
  Clock,
  CheckCircle2,
  Megaphone,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getUser } from "../../lib/api";
import { useApi } from "../../lib/useApi";
import { countStatus, dailyTrend, hhmm, isoDate } from "../../lib/format";
import LoadState from "../LoadState";
import StudentLayout from "./StudentLayout";
import { useStudentI18n } from "./studentI18n";

// สถานะที่นับเป็น "เช็คชื่อแล้ว"
const ATTENDED = new Set(["present", "late"]);

function greetingKey(hour) {
  if (hour < 12) return "dashboard.morning";
  if (hour < 17) return "dashboard.afternoon";
  return "dashboard.evening";
}

export default function StudentDashboard() {
  const user = getUser();
  const { t, date, locale } = useStudentI18n();
  const [now, setNow] = useState(new Date());
  const [monthStart] = useState(() => isoDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const today = isoDate(now);
  const sessionsReq = useApi(`/attendance/my-sessions?start=${monthStart}&end=${today}`, []);
  const meReq = useApi("/students/me");
  const announcementsReq = useApi("/announcements", []);
  const me = meReq.data;
  const sessions = sessionsReq.data || [];
  const isDark = document.documentElement.classList.contains("dark");

  const todayClasses = sessions
    .filter((s) => s.session_date === today)
    .map((s) => ({
      id: s.session_id,
      time: hhmm(s.start_time),
      endTime: s.end_time ? hhmm(s.end_time) : "",
      subject: `${s.course_code} ${s.course_name}`,
      teacher: s.teacher_name || "-",
      status: ATTENDED.has(s.status) ? "checked" : s.status,
      checkedAt: s.my_check_in_time ? t("common.clock", { time: hhmm(s.my_check_in_time) }) : "",
    }));
  const checkedToday = todayClasses.filter((c) => c.status === "checked").length;

  const monthCount = countStatus(sessions);
  const attendanceTrend = dailyTrend(sessions).map((d) => ({
    ...d,
    day: date(d.date, { day: "numeric", month: "short" }),
  }));
  const attendanceSummary = [
    { name: t("common.status.ontime"), value: monthCount.present, color: "#22c55e" },
    { name: t("common.status.lateShort"), value: monthCount.late, color: "#f59e0b" },
    { name: t("common.status.absent"), value: monthCount.absent, color: "#ef4444" },
  ];

  const recentCheckins = sessions
    .filter((s) => ["present", "late", "absent"].includes(s.status))
    .slice()
    .reverse()
    .slice(0, 4)
    .map((s) => ({
      id: s.session_id,
      subject: `${s.course_code} ${s.course_name}`,
      date: date(s.session_date),
      time: s.my_check_in_time ? t("common.clock", { time: hhmm(s.my_check_in_time) }) : "-",
      status: s.status === "present" ? "ontime" : s.status,
      lateBy: s.status === "late" ? t("common.lateBy", { n: s.late_minutes ?? 0 }) : t("common.status.absent"),
    }));

  const announcements = (announcementsReq.data || []).slice(0, 2).map((a) => ({
    id: a.id,
    type: a.pinned ? "warning" : "info",
    title: a.title,
    body: a.body,
  }));
  const loadError = sessionsReq.error || meReq.error || announcementsReq.error;
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const chartGrid = isDark ? "#1e293b" : "#f1f5f9";
  const chartTick = isDark ? "#8391a7" : "#94a3b8";

  return (
    <StudentLayout
      titleContent={
        <>
          {t(greetingKey(now.getHours()))}, {user?.full_name || "-"} <span className="inline-block">👋</span>
        </>
      }
      subtitle={
        me
          ? `${me.faculty || me.major || t("common.role")} • ${t("dashboard.studentCode", { code: me.student_code })}`
          : ""
      }
      headerExtra={
        <div className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium shrink-0">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          {now.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
          <span className="text-slate-300">|</span>
          <span className="tabular-nums">{timeStr}</span>
        </div>
      }
    >
      <LoadState loading={false} error={loadError} />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<ClipboardCheck className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
          label={t("dashboard.checkedToday")}
          to="/checkin"
          value={checkedToday}
          unit={t("dashboard.periodsUnit", { n: todayClasses.length })}
          sub={t("dashboard.ofToday", {
            pct: todayClasses.length ? ((checkedToday / todayClasses.length) * 100).toFixed(1) : 0,
          })}
        />
        <StatCard
          icon={<CalendarCheck className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100"
          label={t("dashboard.totalChecked")}
          to="/history"
          value={monthCount.present + monthCount.late}
          unit={t("common.times")}
          sub={t("dashboard.thisMonth")}
        />
        <StatCard
          icon={<Percent className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
          label={t("dashboard.rate")}
          to="/courses"
          value={monthCount.rate.toFixed(1)}
          unit="%"
          sub={t("dashboard.thisMonth")}
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-amber-500" />}
          iconBg="bg-amber-100"
          label={t("dashboard.absences")}
          to="/history?status=absent"
          value={monthCount.absent}
          unit={t("common.times")}
          sub={t("dashboard.lateThisMonth", { n: monthCount.late })}
        />
      </div>

      {/* Today's classes + recent check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">{t("dashboard.todayClasses")}</h3>
            <Link to="/schedule" className="text-sm text-blue-600 font-medium hover:underline">
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.length === 0 && (
              <div className="text-sm text-slate-400 py-4 text-center">
                {sessionsReq.loading ? t("common.loading") : t("dashboard.noClassesToday")}
              </div>
            )}
            {todayClasses.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="shrink-0 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg px-3 py-2 text-center leading-tight">
                  <div>{c.time}</div>
                  <div className="text-blue-400">-</div>
                  <div>{c.endTime}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800 text-sm truncate">{c.subject}</div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{c.teacher}</div>
                </div>
                {c.status === "checked" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-emerald-600">{t("dashboard.checkedIn")}</div>
                      <div className="text-[11px] text-slate-400">{c.checkedAt}</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                ) : c.status === "absent" ? (
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg shrink-0">
                    {t("common.status.absent")}
                  </span>
                ) : (
                  <Link to="/checkin" className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                      {c.status === "open" ? t("common.status.open") : t("common.status.upcoming")}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-500" />
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 bg-blue-50 text-blue-600 text-xs rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {t("dashboard.deadlineNote")}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">{t("dashboard.recent")}</h3>
            <Link to="/history" className="text-sm text-blue-600 font-medium hover:underline">
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="space-y-4">
            {recentCheckins.length === 0 && (
              <div className="text-sm text-slate-400 py-4 text-center">{t("dashboard.noRecent")}</div>
            )}
            {recentCheckins.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{r.subject}</div>
                  <div className="text-xs text-slate-400">
                    {r.date} • {r.time}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                    r.status === "ontime"
                      ? "bg-emerald-100 text-emerald-600"
                      : r.status === "late"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {r.status === "ontime" ? t("common.status.ontime") : r.lateBy}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts + announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1.1fr] gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">{t("dashboard.trend")}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={chartGrid} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartTick }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: chartTick }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, t("dashboard.rateTooltip")]}
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    background: isDark ? "#0f172a" : "#fff",
                    color: isDark ? "#e2e8f0" : undefined,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#2563eb" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">{t("dashboard.summary")}</h3>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceSummary}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  stroke="none"
                >
                  {attendanceSummary.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-900">{monthCount.total}</div>
              <div className="text-xs text-slate-400">{t("common.times")}</div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {attendanceSummary.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600">{s.name}</span>
                </div>
                <span className="text-slate-800 font-medium">
                  {s.value} ({monthCount.total ? ((s.value / monthCount.total) * 100).toFixed(1) : "0.0"}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">{t("dashboard.announcements")}</h3>
            <Link to="/announcements" className="text-sm text-blue-600 font-medium hover:underline">
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.length === 0 && (
              <div className="text-sm text-slate-400">{t("dashboard.noAnnouncements")}</div>
            )}
            {announcements.map((a) => (
              <Link
                to="/announcements"
                key={a.id}
                className={`w-full flex items-start gap-3 text-left rounded-xl p-4 transition-colors ${
                  a.type === "info" ? "bg-blue-50 hover:bg-blue-100/70" : "bg-amber-50 hover:bg-amber-100/70"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    a.type === "info" ? "bg-blue-600" : "bg-amber-500"
                  }`}
                >
                  {a.type === "info" ? (
                    <Megaphone className="w-4 h-4 text-white" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs font-semibold mb-0.5 ${a.type === "info" ? "text-blue-600" : "text-amber-600"}`}
                  >
                    {a.title}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed line-clamp-3">{a.body}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

// การ์ดสถิติ กดแล้วไปหน้าที่แสดงรายละเอียดของตัวเลขนั้น
function StatCard({ icon, iconBg, label, value, unit, sub, to }) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 transition-all hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-medium truncate">{label}</div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-2xl font-bold text-slate-900 leading-tight">{value}</span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
        <div className="text-xs mt-0.5 truncate text-slate-400">{sub}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 ml-auto shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
    </Link>
  );
}
