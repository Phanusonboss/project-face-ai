import {
  ClipboardList,
  ChevronDown,
  CalendarDays,
  Search,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  UsersRound,
  Clock,
  XCircle,
  BarChart3,
  Trophy,
  CheckCircle2,
  User,
} from "lucide-react";
import {
  BarChart,
  Bar,
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

const courseAttendance = [
  { code: "CS-201", name: "Data Structures", present: 89, late: 4, absent: 1 },
  { code: "CS-202", name: "OOP", present: 85, late: 6, absent: 3 },
  { code: "CS-203", name: "Database Systems", present: 78, late: 8, absent: 6 },
  { code: "CS-204", name: "AI Intro", present: 82, late: 5, absent: 3 },
  { code: "CS-205", name: "Operating Systems", present: 56, late: 12, absent: 12 },
];

const courseSummaryTable = [
  { code: "CS-201", icon: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400", name: "โครงสร้างข้อมูล (Data Structures)", term: "1/2567", students: 32, present: 28, late: 2, absent: 2, rate: 87.5 },
  { code: "CS-202", icon: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400", name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)", term: "1/2567", students: 30, present: 26, late: 3, absent: 1, rate: 86.7 },
  { code: "CS-203", icon: "bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400", name: "ฐานข้อมูล (Database Systems)", term: "1/2567", students: 28, present: 22, late: 3, absent: 3, rate: 78.6 },
  { code: "CS-204", icon: "bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400", name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)", term: "1/2567", students: 24, present: 19, late: 2, absent: 3, rate: 79.2 },
  { code: "CS-205", icon: "bg-rose-100 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400", name: "ระบบปฏิบัติการ (Operating Systems)", term: "1/2567", students: 14, present: 8, late: 4, absent: 2, rate: 57.1 },
];

const dailyTrend = [
  { day: "1 พ.ค.", present: 92, late: 6, absent: 2 },
  { day: "4 พ.ค.", present: 88, late: 8, absent: 4 },
  { day: "7 พ.ค.", present: 95, late: 4, absent: 1 },
  { day: "10 พ.ค.", present: 90, late: 7, absent: 3 },
  { day: "13 พ.ค.", present: 85, late: 10, absent: 5 },
  { day: "16 พ.ค.", present: 93, late: 5, absent: 2 },
  { day: "19 พ.ค.", present: 89, late: 8, absent: 3 },
];

const topAbsentees = [
  { rank: 1, id: "6601234567", name: "นายสมชาย ใจดี", count: 8 },
  { rank: 2, id: "6601234588", name: "นางสาวมลวรรณ ศรีสุข", count: 7 },
  { rank: 3, id: "6601234501", name: "นายภานุภา ทองดี", count: 6 },
];

export default function TeacherAttendanceReport() {
  const { t } = useAppearanceSettings();
  const maxAbsentCount = Math.max(...topAbsentees.map((s) => s.count));

  const summaryStats = [
    { icon: <UsersRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />, iconBg: "bg-blue-100 dark:bg-blue-950/40", label: t("report.stats.totalStudents"), value: "142", sub: t("common.units.people"), trendColor: "text-emerald-600 dark:text-emerald-400", trend: "↑ 2.9%" },
    { icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, iconBg: "bg-emerald-100 dark:bg-emerald-950/40", label: t("report.stats.totalPresent"), value: "2,845", sub: t("common.units.times"), trend: "93.2%", trendColor: "text-emerald-600 dark:text-emerald-400" },
    { icon: <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />, iconBg: "bg-amber-100 dark:bg-amber-950/40", label: t("report.stats.late"), value: "156", sub: t("common.units.times"), trend: "5.1%", trendColor: "text-amber-500 dark:text-amber-400" },
    { icon: <XCircle className="w-6 h-6 text-red-500 dark:text-red-400" />, iconBg: "bg-red-100 dark:bg-red-950/40", label: t("report.stats.absent"), value: "52", sub: t("common.units.times"), trend: "1.7%", trendColor: "text-red-500 dark:text-red-400" },
  ];

  const overallSummary = [
    { name: t("common.status.present"), value: 2845, pct: "93.2%", color: "#22c55e" },
    { name: t("common.status.late"), value: 156, pct: "5.1%", color: "#f59e0b" },
    { name: t("common.status.absent"), value: 52, pct: "1.7%", color: "#ef4444" },
  ];

  return (
    <TeacherLayout
      titleIcon={ClipboardList}
      titleKey="nav.report"
      subtitleKey="report.subtitle"
      headerExtra={
        <button className="hidden sm:flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
          <CalendarDays className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          1 พ.ค. 2567 - 20 พ.ค. 2567
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </button>
      }
    >
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>{s.icon}</div>
            <div className="min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{s.label}</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{s.value}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{s.sub}</span>
              </div>
              <div className={`text-xs mt-0.5 truncate ${s.trendColor || "text-emerald-600 dark:text-emerald-400"}`}>{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t("report.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        <FilterSelect label={t("report.filters.course")} />
        <FilterSelect label={t("report.filters.status")} />
        <FilterSelect label={t("report.filters.term")} />

        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors px-3 py-2.5">
          <RotateCcw className="w-4 h-4" />
          {t("common.actions.reset")}
        </button>

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-100 dark:shadow-emerald-950">
          <FileSpreadsheet className="w-4 h-4" />
          {t("common.actions.exportExcel")}
        </button>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-red-100 dark:shadow-red-950">
          <FileText className="w-4 h-4" />
          {t("common.actions.exportPdf")}
        </button>
      </div>

      {/* Course bar chart + overall donut */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("report.courseChartTitle")}</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="code" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                  labelFormatter={(label) => {
                    const c = courseAttendance.find((x) => x.code === label);
                    return c ? `${c.code} — ${c.name}` : label;
                  }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Bar dataKey="present" name={t("common.status.present")} fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="late" name={t("common.status.late")} fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="absent" name={t("common.status.absent")} fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("report.overallChartTitle")}</h3>
          </div>
          <div className="relative h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overallSummary} dataKey="value" innerRadius={54} outerRadius={76} paddingAngle={3} stroke="none">
                  {overallSummary.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">2,845</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{t("common.units.times")}</div>
            </div>
          </div>
          <div className="space-y-2.5 mt-4">
            {overallSummary.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 dark:text-slate-500">{s.pct}</span>
                  <span className="text-slate-800 dark:text-slate-100 font-medium w-14 text-right">{s.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course summary table + daily trend chart */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("report.courseSummaryTitle")}</h3>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
              {t("history.statusTabs.all")} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2 pr-3 font-medium">{t("report.table.code")}</th>
                <th className="py-2 pr-3 font-medium">{t("report.table.courseName")}</th>
                <th className="py-2 pr-3 font-medium">{t("report.table.term")}</th>
                <th className="py-2 pr-3 font-medium text-center">{t("report.table.students")}</th>
                <th className="py-2 pr-3 font-medium text-center">{t("report.table.present")}</th>
                <th className="py-2 pr-3 font-medium text-center">{t("report.table.late")}</th>
                <th className="py-2 pr-3 font-medium text-center">{t("report.table.absent")}</th>
                <th className="py-2 pr-3 font-medium">{t("report.table.rate")}</th>
              </tr>
            </thead>
            <tbody>
              {courseSummaryTable.map((c) => (
                <tr key={c.code} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <td className="py-3 pr-3 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-[11px] ${c.icon}`}>
                      {c.code.split("-")[1]}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-slate-800 dark:text-slate-100 font-medium whitespace-nowrap">{c.name}</td>
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{c.term}</td>
                  <td className="py-3 pr-3 text-slate-600 dark:text-slate-300 text-center">{c.students}</td>
                  <td className="py-3 pr-3 text-emerald-600 dark:text-emerald-400 font-medium text-center">{c.present}</td>
                  <td className="py-3 pr-3 text-amber-500 dark:text-amber-400 font-medium text-center">{c.late}</td>
                  <td className="py-3 pr-3 text-red-500 dark:text-red-400 font-medium text-center">{c.absent}</td>
                  <td className="py-3 pr-3 min-w-[130px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${c.rate >= 85 ? "bg-emerald-500" : c.rate >= 70 ? "bg-blue-500" : "bg-amber-500"}`}
                          style={{ width: `${c.rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 w-11 text-right">{c.rate.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("report.dailyChartTitle")}</h3>
            <button className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
              {t("report.last30Days")} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Line type="monotone" dataKey="present" name={t("common.status.present")} stroke="#22c55e" strokeWidth={3} dot={{ r: 3, fill: "#22c55e" }} />
                <Line type="monotone" dataKey="late" name={t("common.status.late")} stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, fill: "#f59e0b" }} />
                <Line type="monotone" dataKey="absent" name={t("common.status.absent")} stroke="#ef4444" strokeWidth={3} dot={{ r: 3, fill: "#ef4444" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top absentees */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t("report.topAbsenteesTitle")}</h4>
              </div>
              <a href="#" className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                {t("common.actions.viewAll")}
              </a>
            </div>
            <div className="space-y-3">
              {topAbsentees.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-4 text-center shrink-0">{s.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{s.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{s.id}</div>
                  </div>
                  <div className="w-24 shrink-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        {s.count} {t("common.units.times")}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-red-400" style={{ width: `${(s.count / maxAbsentCount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

function FilterSelect({ label }) {
  return (
    <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
      {label}
      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
    </button>
  );
}