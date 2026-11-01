import {
  Users,
  CheckCircle2,
  Loader2,
  CalendarDays,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";
import { Link } from "react-router-dom";
import TeacherLayout from "./TeacherLayout";
import LoadState from "../LoadState";
import { useAppearanceSettings } from "./useAppearanceSettings";
import { colorOf, useTeacherData } from "./useTeacherData";
import { addDays, countStatus, dailyTrend, groupBy, hhmm, isoDate, pct, thaiDate, thaiDayMonth } from "../../lib/format";

export default function TeacherDashboard() {
  const { t } = useAppearanceSettings();
  const today = isoDate();
  const { classes, records, loading, error, reload } = useTeacherData({
    start: isoDate(addDays(new Date(), -30)),
    end: today,
  });

  // ตัวเลือกรายวิชาของกราฟและสรุปวันนี้ ("" = ทุกรายวิชา)
  const [trendClass, setTrendClass] = useState("");
  const [summaryClass, setSummaryClass] = useState("");
  const [recentClass, setRecentClass] = useState("");
  const ofClass = (rows, id) => (id ? rows.filter((r) => String(r.class_id) === id) : rows);

  // "เข้าเรียน" ในกราฟ = ตรงเวลา + สาย
  const attendanceTrend = dailyTrend(ofClass(records, trendClass)).map((d) => ({ ...d, present: d.present + d.late }));

  // ถ้าวันนี้ไม่มีคาบเรียน ให้สรุปวันล่าสุดที่มีข้อมูลแทน
  const classRecords = ofClass(records, summaryClass);
  const hasToday = classRecords.some((r) => r.session_date === today);
  const summaryDate = hasToday
    ? today
    : classRecords
        .filter((r) => ["present", "late", "absent"].includes(r.status))
        .reduce((latest, r) => (r.session_date > latest ? r.session_date : latest), "");
  const summaryRows = classRecords.filter((r) => r.session_date === summaryDate);
  const summaryCount = countStatus(summaryRows);
  const todaySummary = [
    { name: t("common.status.present"), value: summaryCount.present, color: "#22c55e" },
    { name: t("common.status.late"), value: summaryCount.late, color: "#f59e0b" },
    { name: t("common.status.absent"), value: summaryCount.absent, color: "#ef4444" },
  ].map((s) => ({ ...s, pct: `${pct(s.value, summaryRows.length).toFixed(2)}%` }));

  const courseSelect = (value, onChange) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 max-w-[14rem] truncate focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
    >
      <option value="">{t("dashboard.allCourses")}</option>
      {classes.map((c) => (
        <option key={c.id} value={c.id}>
          {c.course_code} {c.course_name}
        </option>
      ))}
    </select>
  );

  // การเช็คชื่อล่าสุด (แถวละหนึ่งคาบ, ใหม่สุดก่อน) ไม่นับคาบที่ยังไม่ถึงเวลา
  const recentSessions = [...groupBy(ofClass(records, recentClass), (r) => r.session_id).values()]
    .filter((rows) => !rows.every((r) => r.status === "upcoming"))
    .map((rows) => {
      const first = rows[0];
      const c = countStatus(rows);
      const open = rows.some((r) => r.status === "open");
      return {
        id: first.session_id,
        sortKey: `${first.session_date} ${first.start_time || ""}`,
        time: `${thaiDayMonth(first.session_date)} ${hhmm(first.start_time)}`,
        subject: `${first.course_code} ${first.course_name}`,
        room: first.class_code || "-",
        attend: `${c.present + c.late}/${rows.length}`,
        status: open ? "progress" : "done",
      };
    })
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))
    .slice(0, 5);

  const recordsByClass = groupBy(records, (r) => r.class_id);
  const myCourses = classes.map((cls) => {
    const rows = recordsByClass.get(cls.id) || [];
    const todayOfClass = rows.filter((r) => r.session_date === today);
    let status = t("common.status.notStarted");
    let statusColor = "text-slate-400 dark:text-slate-500";
    if (todayOfClass.some((r) => r.status === "open")) {
      status = t("common.status.inProgress");
      statusColor = "text-blue-600 dark:text-blue-400";
    } else if (todayOfClass.length) {
      status = `${t("live.checkedAt")} ${hhmm(todayOfClass[0].start_time)}`;
      statusColor = "text-emerald-600 dark:text-emerald-400";
    }
    return {
      id: cls.id,
      code: cls.course_code || "",
      name: cls.course_name,
      students: `${t("live.studentsPrefix")} ${cls.student_count} ${t("common.units.people")}`,
      status,
      statusColor,
      pct: Math.round(countStatus(rows).rate),
    };
  });

  return (
    <TeacherLayout
      titleKey="nav.dashboard"
      headerExtra={
        <button className="hidden sm:flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
          <CalendarDays className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          {thaiDate(today, { day: "numeric", month: "long", year: "numeric" })}
        </button>
      }
    >
      <LoadState loading={loading} error={error} onRetry={reload} />

      {/* Trend chart + today summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("dashboard.trendTitle")}</h3>
            <div className="flex items-center gap-2">
              {courseSelect(trendClass, setTrendClass)}
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
                {t("dashboard.last31Days")}
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="absentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Line type="monotone" dataKey="present" name={t("common.status.present")} stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} fill="url(#presentFill)" />
                <Line type="monotone" dataKey="absent" name={t("common.status.absent")} stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: "#ef4444" }} fill="url(#absentFill)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {t(hasToday ? "dashboard.todaySummaryTitle" : "dashboard.latestSummaryTitle")}
              </h3>
              {!hasToday && (
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {summaryDate ? thaiDate(summaryDate) : t("dashboard.noSummaryData")} · {t("live.noSessionToday")}
                </div>
              )}
            </div>
            {courseSelect(summaryClass, setSummaryClass)}
          </div>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* วงพื้นหลังสีเทา ให้เห็นวงแม้ยังไม่มีข้อมูล */}
                <Pie data={[{ value: 1 }]} dataKey="value" innerRadius={48} outerRadius={68} fill="#e2e8f0" stroke="none" isAnimationActive={false} />
                <Pie data={todaySummary} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={3} stroke="none">
                  {todaySummary.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{summaryRows.length}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{t("dashboard.totalStudentsLabel")}</div>
            </div>
          </div>
          <div className="space-y-2.5 mt-4">
            {todaySummary.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-800 dark:text-slate-100 font-medium">
                    {s.value} {t("common.units.people")}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 w-14 text-right">{s.pct}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-xl px-4 py-3 mt-4">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t(hasToday ? "dashboard.attendanceRateToday" : "dashboard.attendanceRate")}
            </span>
            <span className="font-bold">{summaryCount.rate.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Recent check-ins table + courses */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("dashboard.recentCheckins")}</h3>
            {courseSelect(recentClass, setRecentClass)}
          </div>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2 pr-3 font-medium">{t("dashboard.table.time")}</th>
                <th className="py-2 pr-3 font-medium">{t("dashboard.table.subject")}</th>
                <th className="py-2 pr-3 font-medium">{t("dashboard.table.room")}</th>
                <th className="py-2 pr-3 font-medium">{t("dashboard.table.attend")}</th>
                <th className="py-2 pr-3 font-medium">{t("dashboard.table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    {t("dashboard.noSummaryData")}
                  </td>
                </tr>
              )}
              {recentSessions.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.time}</td>
                  <td className="py-3 pr-3 text-slate-800 dark:text-slate-100 font-medium whitespace-nowrap">{r.subject}</td>
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.room}</td>
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.attend}</td>
                  <td className="py-3 pr-3 whitespace-nowrap">
                    {r.status === "done" && (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t("common.status.done")}
                      </span>
                    )}
                    {r.status === "progress" && (
                      <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {t("common.status.inProgress")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("dashboard.myCourses")}</h3>
            <Link to="/teacher-courses" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              {t("common.actions.viewAll")}
            </Link>
          </div>
          <div className="space-y-4">
            {myCourses.length === 0 && !loading && (
              <div className="text-sm text-slate-400 dark:text-slate-500">{t("live.noCourses")}</div>
            )}
            {myCourses.map((c, i) => (
              <Link
                key={c.id}
                to={`/teacher-report?class=${c.id}`}
                className="flex items-center gap-3 -mx-2 px-2 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${colorOf(i).icon}`}>
                  {c.code.split("-").pop()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{c.name}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{c.students}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-medium ${c.statusColor}`}>{c.status}</div>
                </div>
                <RingBadge percent={c.pct} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

function RingBadge({ percent }) {
  const radius = 16;
  const stroke = 3;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  const color =
    percent === 0 ? "#cbd5e1" : percent >= 85 ? "#22c55e" : percent >= 70 ? "#3b82f6" : "#f59e0b";

  return (
    <div className="relative w-9 h-9 shrink-0">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle stroke="#e2e8f0" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700 dark:text-slate-300">
        {percent}%
      </span>
    </div>
  );
}