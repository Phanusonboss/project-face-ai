import {
  BookOpen,
  Users,
  Bell,
  ChevronDown,
  CheckCircle2,
  Loader2,
  Circle,
  UserCheck,
  UserX,
  CalendarCheck,
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
import TeacherLayout from "./TeacherLayout";
import { useAppearanceSettings } from "./useAppearanceSettings";

const attendanceTrend = [
  { day: "14 พ.ค.", present: 60, absent: 22 },
  { day: "15 พ.ค.", present: 80, absent: 30 },
  { day: "16 พ.ค.", present: 76, absent: 26 },
  { day: "17 พ.ค.", present: 82, absent: 34 },
  { day: "18 พ.ค.", present: 78, absent: 24 },
  { day: "19 พ.ค.", present: 90, absent: 32 },
  { day: "20 พ.ค.", present: 78, absent: 28 },
];

const todaySummary = [
  { name: "เข้าเรียน", value: 95, pct: "74.22%", color: "#22c55e" },
  { name: "ขาดเรียน", value: 33, pct: "25.78%", color: "#ef4444" },
  { name: "ลากิจ", value: 0, pct: "0.00%", color: "#94a3b8" },
  { name: "มาสาย", value: 2, pct: "1.56%", color: "#f59e0b" },
];

const recentCheckins = [
  { time: "10:30", subject: "โครงสร้างข้อมูล (Data Structures)", room: "CS-201", attend: "28/32", status: "done" },
  { time: "09:00", subject: "การเขียนโปรแกรมเชิงวัตถุ (OOP)", room: "CS-202", attend: "26/30", status: "done" },
  { time: "13:30", subject: "ฐานข้อมูล (Database Systems)", room: "CS-203", attend: "22/28", status: "progress" },
  { time: "08:00", subject: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)", room: "CS-204", attend: "19/24", status: "done" },
  { time: "15:30", subject: "ระบบปฏิบัติการ (Operating Systems)", room: "CS-205", attend: "-", status: "notstarted" },
];

const myCourses = [
  { code: "CS-201", name: "โครงสร้างข้อมูล (Data Structures)", students: "นักศึกษา 32 คน", status: "เช็คชื่อแล้ว 10:30", statusColor: "text-emerald-600 dark:text-emerald-400", pct: 87 },
  { code: "CS-202", name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)", students: "นักศึกษา 30 คน", status: "เช็คชื่อแล้ว 09:00", statusColor: "text-emerald-600 dark:text-emerald-400", pct: 86 },
  { code: "CS-203", name: "ฐานข้อมูล (Database Systems)", students: "นักศึกษา 28 คน", status: "กำลังดำเนินการ", statusColor: "text-blue-600 dark:text-blue-400", pct: 78 },
  { code: "CS-204", name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)", students: "นักศึกษา 24 คน", status: "เช็คชื่อแล้ว 08:00", statusColor: "text-emerald-600 dark:text-emerald-400", pct: 79 },
  { code: "CS-205", name: "ระบบปฏิบัติการ (Operating Systems)", students: "นักศึกษา 14 คน", status: "ยังไม่เริ่ม", statusColor: "text-slate-400 dark:text-slate-500", pct: 0 },
];

const courseIconColors = [
  "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
  "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
];

export default function TeacherDashboard() {
  const { t } = useAppearanceSettings();
  const totalToday = todaySummary.reduce((a, b) => a + b.value, 0);

  return (
    <TeacherLayout
      titleContent={
        <>
          {t("dashboard.greeting")}, อาจารย์ณัฐวุฒิ <span className="inline-block">👋</span>
        </>
      }
      subtitleKey="dashboard.subtitle"
      headerExtra={
        <button className="hidden sm:flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
          <CalendarDays className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          20 พฤษภาคม 2567
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </button>
      }
    >
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-950/40"
          label={t("dashboard.stats.totalCourses")}
          value="5"
          sub={t("dashboard.stats.totalCoursesSub")}
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-950/40"
          label={t("dashboard.stats.totalStudents")}
          value="128"
          sub={t("dashboard.stats.totalStudentsSub")}
        />
        <StatCard
          icon={<CalendarCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-100 dark:bg-purple-950/40"
          label={t("dashboard.stats.checkinToday")}
          value="4"
          sub={t("dashboard.stats.checkinTodaySub")}
        />
        <StatCard
          icon={<UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-100 dark:bg-amber-950/40"
          label={t("dashboard.stats.present")}
          value="95"
          sub="74.22%"
          subColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={<UserX className="w-6 h-6 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-950/40"
          label={t("dashboard.stats.absent")}
          value="33"
          sub="25.78%"
          subColor="text-red-500 dark:text-red-400"
        />
      </div>

      {/* Trend chart + today summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("dashboard.trendTitle")}</h3>
            <button className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
              {t("dashboard.last7Days")} <ChevronDown className="w-3.5 h-3.5" />
            </button>
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
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">{t("dashboard.todaySummaryTitle")}</h3>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={todaySummary} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={3} stroke="none">
                  {todaySummary.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalToday}</div>
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
              {t("dashboard.attendanceRateToday")}
            </span>
            <span className="font-bold">74.22%</span>
          </div>
        </div>
      </div>

      {/* Recent check-ins table + courses */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("dashboard.recentCheckins")}</h3>
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              {t("common.actions.viewAll")}
            </a>
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
              {recentCheckins.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
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
                    {r.status === "notstarted" && (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                        <Circle className="w-3.5 h-3.5" />
                        {t("common.status.notStarted")}
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
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              {t("common.actions.viewAll")}
            </a>
          </div>
          <div className="space-y-4">
            {myCourses.map((c, i) => (
              <div key={c.code} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${courseIconColors[i]}`}>
                  {c.code.split("-")[1]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{c.name}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{c.students}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-medium ${c.statusColor}`}>{c.status}</div>
                </div>
                <RingBadge percent={c.pct} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

function StatCard({ icon, iconBg, label, value, sub, subColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{label}</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5">{value}</div>
        <div className={`text-xs mt-0.5 truncate ${subColor || "text-slate-400 dark:text-slate-500"}`}>{sub}</div>
      </div>
    </div>
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