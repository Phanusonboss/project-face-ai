import { useMemo, useState } from "react";
import {
  History,
  ChevronDown,
  CalendarDays,
  CalendarClock,
  Search,
  RotateCcw,
  Circle,
  Clock,
  XCircle,
  MoreHorizontal,
  BarChart3,
  Trophy,
  User,
  CheckCircle2,
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
} from "recharts";
import TeacherLayout from "./TeacherLayout";
import { useAppearanceSettings } from "./useAppearanceSettings";

const statusTabs = [
  { key: "all", labelKey: "history.statusTabs.all", icon: Circle, activeCls: "bg-blue-600 text-white border-blue-600" },
  { key: "present", labelKey: "history.statusTabs.present", icon: CheckCircle2, activeCls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" },
  { key: "late", labelKey: "history.statusTabs.late", icon: Clock, activeCls: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900" },
  { key: "absent", labelKey: "history.statusTabs.absent", icon: XCircle, activeCls: "bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-200 dark:border-red-900" },
];

const statusMeta = {
  present: { labelKey: "common.status.present", cls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  late: { labelKey: "common.status.late", cls: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400", icon: Clock },
  absent: { labelKey: "common.status.absent", cls: "bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400", icon: XCircle },
};

const checkinLogs = [
  { classTime: "20 พ.ค. 2567 09:00", course: "CS-201 โครงสร้างข้อมูล (Data Structures)", studentId: "6601234567", studentName: "นายสมชาย ใจดี", section: "CS101", status: "present", checkedAt: "20 พ.ค. 2567 09:00", note: "-" },
  { classTime: "20 พ.ค. 2567 09:00", course: "CS-201 โครงสร้างข้อมูล (Data Structures)", studentId: "6601234588", studentName: "นางสาวกมลวรรณ ศรีสุข", section: "CS101", status: "present", checkedAt: "20 พ.ค. 2567 09:00", note: "-" },
  { classTime: "20 พ.ค. 2567 09:00", course: "CS-202 การเขียนโปรแกรมเชิงวัตถุ (OOP)", studentId: "6601234501", studentName: "นายศิวัฒน์ โสภณกมล", section: "CS101", status: "late", checkedAt: "20 พ.ค. 2567 09:15", note: "มาสาย 7 นาที" },
  { classTime: "20 พ.ค. 2567 09:00", course: "CS-203 ฐานข้อมูล (Database Systems)", studentId: "6601234604", studentName: "นางสาวปฏิญญา จันทร์เพ็ญ", section: "CS101", status: "absent", checkedAt: "-", note: "-" },
  { classTime: "19 พ.ค. 2567 13:00", course: "CS-205 ระบบปฏิบัติการ (Operating Systems)", studentId: "6601234506", studentName: "นายกฤษฎา ทองดี", section: "CS102", status: "present", checkedAt: "19 พ.ค. 2567 13:05", note: "-" },
  { classTime: "19 พ.ค. 2567 13:00", course: "CS-205 ระบบปฏิบัติการ (Operating Systems)", studentId: "6601234522", studentName: "นางสาวปรีณคา เหมะนาว", section: "CS102", status: "present", checkedAt: "19 พ.ค. 2567 13:10", note: "-" },
  { classTime: "19 พ.ค. 2567 13:00", course: "CS-205 ระบบปฏิบัติการ (Operating Systems)", studentId: "6601234555", studentName: "นายธนภัทร สายทอง", section: "CS102", status: "late", checkedAt: "19 พ.ค. 2567 13:20", note: "มาสาย 15 นาที" },
];

const dailyTrend = [
  { day: "21 เม.ย.", present: 120, late: 8, absent: 4 },
  { day: "24 เม.ย.", present: 128, late: 10, absent: 3 },
  { day: "27 เม.ย.", present: 132, late: 6, absent: 2 },
  { day: "30 เม.ย.", present: 118, late: 14, absent: 6 },
  { day: "3 พ.ค.", present: 125, late: 9, absent: 5 },
  { day: "6 พ.ค.", present: 130, late: 7, absent: 3 },
  { day: "9 พ.ค.", present: 122, late: 12, absent: 4 },
  { day: "12 พ.ค.", present: 134, late: 6, absent: 2 },
  { day: "15 พ.ค.", present: 129, late: 8, absent: 3 },
  { day: "18 พ.ค.", present: 126, late: 10, absent: 5 },
  { day: "20 พ.ค.", present: 131, late: 7, absent: 3 },
];

const topAbsentees = [
  { rank: 1, id: "6601234567", name: "นายกิตติพงษ์ ใจดี", count: 8, avatar: "https://i.pravatar.cc/100?img=12" },
  { rank: 2, id: "6601234588", name: "นางสาวกมลวรรณ ศรีสุข", count: 7, avatar: "https://i.pravatar.cc/100?img=47" },
  { rank: 3, id: "6601234501", name: "นายธนวัฒน์ แก้ววงศ์", count: 6, avatar: "https://i.pravatar.cc/100?img=33" },
];

export default function TeacherCheckinHistory() {
  const { t } = useAppearanceSettings();
  const [activeStatus, setActiveStatus] = useState("all");
  const maxAbsentCount = Math.max(...topAbsentees.map((s) => s.count));

  const summaryStats = [
    { icon: <CalendarClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />, iconBg: "bg-blue-100 dark:bg-blue-950/40", label: t("history.stats.totalCheckins"), value: "124", sub: t("common.units.times") },
    { icon: <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, iconBg: "bg-emerald-100 dark:bg-emerald-950/40", label: t("history.stats.onTime"), value: "2,845", sub: t("common.units.times"), trend: "93.2%", trendColor: "text-emerald-600 dark:text-emerald-400" },
    { icon: <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />, iconBg: "bg-amber-100 dark:bg-amber-950/40", label: t("history.stats.late"), value: "156", sub: t("common.units.times"), trend: "5.1%", trendColor: "text-amber-500 dark:text-amber-400" },
    { icon: <XCircle className="w-6 h-6 text-red-500 dark:text-red-400" />, iconBg: "bg-red-100 dark:bg-red-950/40", label: t("history.stats.absent"), value: "52", sub: t("common.units.times"), trend: "1.7%", trendColor: "text-red-500 dark:text-red-400" },
  ];

  const filteredLogs = useMemo(
    () => (activeStatus === "all" ? checkinLogs : checkinLogs.filter((l) => l.status === activeStatus)),
    [activeStatus],
  );

  return (
    <TeacherLayout
      titleIcon={History}
      titleKey="nav.history"
      subtitleKey="history.subtitle"
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
              {s.trend && <div className={`text-xs mt-0.5 truncate ${s.trendColor}`}>{s.trend}</div>}
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
            placeholder="ค้นหานักศึกษา..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        <FilterSelect label={t("history.filters.course")} />
        <FilterSelect label={t("history.filters.status")} />
        <FilterSelect label={t("history.filters.term")} />

        <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
          <RotateCcw className="w-4 h-4" />
          {t("history.filters.reset")}
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${
                isActive ? tab.activeCls : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Check-in log table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="py-2 pr-3 font-medium">{t("history.table.date")}</th>
              <th className="py-2 pr-3 font-medium">{t("history.table.course")}</th>
              <th className="py-2 pr-3 font-medium">{t("history.table.studentId")}</th>
              <th className="py-2 pr-3 font-medium">{t("history.table.name")}</th>
              <th className="py-2 pr-3 font-medium">{t("history.table.section")}</th>
              <th className="py-2 pr-3 font-medium">{t("history.table.status")}</th>
              <th className="py-2 pr-3 font-medium">{t("history.table.checkedAt")}</th>
              <th className="py-2 pr-3 font-medium">{t("history.table.note")}</th>
              <th className="py-2 pr-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((r, i) => {
              const sm = statusMeta[r.status];
              const StatusIcon = sm.icon;
              return (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.classTime}</td>
                  <td className="py-3 pr-3 text-slate-800 dark:text-slate-100 font-medium whitespace-nowrap">{r.course}</td>
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.studentId}</td>
                  <td className="py-3 pr-3 text-slate-800 dark:text-slate-100 whitespace-nowrap">{r.studentName}</td>
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.section}</td>
                  <td className="py-3 pr-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sm.cls}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {t(sm.labelKey)}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.checkedAt}</td>
                  <td className="py-3 pr-3 text-slate-400 dark:text-slate-500 whitespace-nowrap">{r.note}</td>
                  <td className="py-3 pr-3 text-right">
                    <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  {t("history.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Daily trend chart + top absentees */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("history.trendTitle30Days")}</h3>
            </div>
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
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("history.topAbsenteesTitle")}</h3>
          </div>
          <div className="space-y-4">
            {topAbsentees.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 w-5 text-center shrink-0">{s.rank}.</span>
                <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{s.id}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{s.name}</div>
                </div>
                <div className="w-28 shrink-0 text-right">
                  <div className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1">
                    {t("common.status.absent")} {s.count} {t("common.units.times")}
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