import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  History,
  ClipboardList,
  Users,
  Download,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Award,
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
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/teacher-history" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "/teacher-report", active: true },
  { icon: Award, label: "คะแนนเข้าเรียน", to: "/teacher-scores" },
  { icon: Users, label: "นักศึกษา", to: "/teacher-students" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "/teacher-export" },
  { icon: User, label: "โปรไฟล์", to: "/teacher-profile" },
  { icon: Settings, label: "การตั้งค่า", to: "/teacher-settings" },
];

const summaryStats = [
  {
    icon: <UsersRound className="w-6 h-6 text-blue-600" />,
    iconBg: "bg-blue-100",
    label: "จำนวนนักศึกษาทั้งหมด",
    value: "142",
    sub: "คน",
    subColor: "text-emerald-600",
    trend: "↑ 2.9% จากเดือนที่แล้ว",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    iconBg: "bg-emerald-100",
    label: "เข้าเรียนทั้งหมด",
    value: "2,845",
    sub: "ครั้ง",
    trend: "93.2%",
    trendColor: "text-emerald-600",
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    iconBg: "bg-amber-100",
    label: "มาสาย",
    value: "156",
    sub: "ครั้ง",
    trend: "5.1%",
    trendColor: "text-amber-500",
  },
  {
    icon: <XCircle className="w-6 h-6 text-red-500" />,
    iconBg: "bg-red-100",
    label: "ขาดเรียน",
    value: "52",
    sub: "ครั้ง",
    trend: "1.7%",
    trendColor: "text-red-500",
  },
];

const courseAttendance = [
  { code: "CS-201", name: "Data Structures", present: 89, late: 4, absent: 1 },
  { code: "CS-202", name: "OOP", present: 85, late: 6, absent: 3 },
  { code: "CS-203", name: "Database Systems", present: 78, late: 8, absent: 6 },
  { code: "CS-204", name: "AI Intro", present: 82, late: 5, absent: 3 },
  { code: "CS-205", name: "Operating Systems", present: 56, late: 12, absent: 12 },
];

const overallSummary = [
  { name: "เข้าเรียน", value: 2845, pct: "93.2%", color: "#22c55e" },
  { name: "มาสาย", value: 156, pct: "5.1%", color: "#f59e0b" },
  { name: "ขาดเรียน", value: 52, pct: "1.7%", color: "#ef4444" },
];

const courseSummaryTable = [
  {
    code: "CS-201",
    icon: "bg-blue-100 text-blue-600",
    name: "โครงสร้างข้อมูล (Data Structures)",
    term: "1/2567",
    students: 32,
    present: 28,
    late: 2,
    absent: 2,
    rate: 87.5,
  },
  {
    code: "CS-202",
    icon: "bg-purple-100 text-purple-600",
    name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)",
    term: "1/2567",
    students: 30,
    present: 26,
    late: 3,
    absent: 1,
    rate: 86.7,
  },
  {
    code: "CS-203",
    icon: "bg-orange-100 text-orange-500",
    name: "ฐานข้อมูล (Database Systems)",
    term: "1/2567",
    students: 28,
    present: 22,
    late: 3,
    absent: 3,
    rate: 78.6,
  },
  {
    code: "CS-204",
    icon: "bg-teal-100 text-teal-600",
    name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)",
    term: "1/2567",
    students: 24,
    present: 19,
    late: 2,
    absent: 3,
    rate: 79.2,
  },
  {
    code: "CS-205",
    icon: "bg-rose-100 text-rose-500",
    name: "ระบบปฏิบัติการ (Operating Systems)",
    term: "1/2567",
    students: 14,
    present: 8,
    late: 4,
    absent: 2,
    rate: 57.1,
  },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const maxAbsentCount = Math.max(...topAbsentees.map((s) => s.count));

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans flex">
      {/* ---------- Sidebar ---------- */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 lg:w-64"
        } shrink-0 bg-white border-r border-slate-100 flex flex-col transition-all overflow-hidden`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
          <img src={logoImg} alt="CS FaceAttend" className="h-10 w-auto object-contain" />
          <div className="leading-tight">
            <div className="text-base font-bold text-slate-900 whitespace-nowrap">
              CS FaceAttend
            </div>
            <div className="text-[10px] text-slate-400 whitespace-nowrap">
              Computer Science AI Face Attendance System
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-4">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            ออกจากระบบ
          </Link>
        </div>

        <div className="p-4">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div className="text-sm font-semibold text-slate-800">ความปลอดภัยของข้อมูล</div>
            <div className="text-xs text-slate-500 leading-relaxed mt-1.5">
              ระบบใช้เทคโนโลยี AI ในการจดจำใบหน้า
              ข้อมูลถูกเข้ารหัสและปลอดภัย
            </div>
            <div className="inline-flex items-center gap-1.5 mt-4 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ระบบปลอดภัย 100%
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center gap-4 px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0 lg:hidden"
            aria-label="สลับเมนู"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">รายงานการเข้าเรียน</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ดูสถิติและรายงานการเข้าเรียนของนักศึกษาในแต่ละรายวิชา
            </p>
          </div>

          <div className="flex-1" />

          <button className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors shrink-0">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            1 พ.ค. 2567 - 20 พ.ค. 2567
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <button className="relative w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          <button className="flex items-center gap-2.5 pl-2 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces"
              alt="อาจารย์ณัฐวุฒิ"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                อาจารย์ณัฐวุฒิ
              </div>
              <div className="text-xs text-slate-400 whitespace-nowrap">อาจารย์</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {summaryStats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 font-medium truncate">{s.label}</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900 leading-tight">{s.value}</span>
                    <span className="text-xs text-slate-400">{s.sub}</span>
                  </div>
                  <div className={`text-xs mt-0.5 truncate ${s.trendColor || "text-emerald-600"}`}>
                    {s.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter toolbar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหารายวิชา ชื่อรายวิชา หรือรหัสนักศึกษา..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <FilterSelect label="รายวิชา" />
            <FilterSelect label="สถานะ" />
            <FilterSelect label="ภาคเรียน" />

            <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors px-3 py-2.5">
              <RotateCcw className="w-4 h-4" />
              รีเซ็ตตัวกรอง
            </button>

            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-100">
              <FileSpreadsheet className="w-4 h-4" />
              ส่งออก Excel
            </button>
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-red-100">
              <FileText className="w-4 h-4" />
              ส่งออก PDF
            </button>
          </div>

          {/* Course bar chart + overall donut */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">สรุปการเข้าเรียนรายวิชา</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="code"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                      labelFormatter={(label) => {
                        const c = courseAttendance.find((x) => x.code === label);
                        return c ? `${c.code} — ${c.name}` : label;
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                    />
                    <Bar dataKey="present" name="เข้าเรียน" fill="#22c55e" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="late" name="มาสาย" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="absent" name="ขาดเรียน" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900">สัดส่วนการเข้าเรียนทั้งหมด</h3>
              </div>
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overallSummary}
                      dataKey="value"
                      innerRadius={54}
                      outerRadius={76}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {overallSummary.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-slate-900">2,845</div>
                  <div className="text-xs text-slate-400">ครั้ง</div>
                </div>
              </div>
              <div className="space-y-2.5 mt-4">
                {overallSummary.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{s.pct}</span>
                      <span className="text-slate-800 font-medium w-14 text-right">
                        {s.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course summary table + daily trend chart */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-slate-700" />
                  <h3 className="font-bold text-slate-900">สรุปรายวิชา</h3>
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5">
                  ทั้งหมด <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-3 font-medium">รหัสวิชา</th>
                    <th className="py-2 pr-3 font-medium">รายวิชา</th>
                    <th className="py-2 pr-3 font-medium">ภาคเรียน</th>
                    <th className="py-2 pr-3 font-medium text-center">จำนวนนักศึกษา</th>
                    <th className="py-2 pr-3 font-medium text-center">เข้าเรียน</th>
                    <th className="py-2 pr-3 font-medium text-center">มาสาย</th>
                    <th className="py-2 pr-3 font-medium text-center">ขาดเรียน</th>
                    <th className="py-2 pr-3 font-medium">อัตราการเข้าเรียน</th>
                  </tr>
                </thead>
                <tbody>
                  {courseSummaryTable.map((c) => (
                    <tr key={c.code} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 pr-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-[11px] ${c.icon}`}
                        >
                          {c.code.split("-")[1]}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-slate-800 font-medium whitespace-nowrap">{c.name}</td>
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{c.term}</td>
                      <td className="py-3 pr-3 text-slate-600 text-center">{c.students}</td>
                      <td className="py-3 pr-3 text-emerald-600 font-medium text-center">{c.present}</td>
                      <td className="py-3 pr-3 text-amber-500 font-medium text-center">{c.late}</td>
                      <td className="py-3 pr-3 text-red-500 font-medium text-center">{c.absent}</td>
                      <td className="py-3 pr-3 min-w-[130px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                c.rate >= 85 ? "bg-emerald-500" : c.rate >= 70 ? "bg-blue-500" : "bg-amber-500"
                              }`}
                              style={{ width: `${c.rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-11 text-right">
                            {c.rate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">สถิติการเข้าเรียนรายวัน</h3>
                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5">
                  30 วันล่าสุด <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="present"
                      name="เข้าเรียน"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#22c55e" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="late"
                      name="มาสาย"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#f59e0b" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="absent"
                      name="ขาดเรียน"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#ef4444" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top absentees */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-slate-900 text-sm">นักศึกษาที่ขาดเรียนมากที่สุด</h4>
                  </div>
                  <a href="#" className="text-xs text-blue-600 font-medium hover:underline">
                    ดูทั้งหมด
                  </a>
                </div>
                <div className="space-y-3">
                  {topAbsentees.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 w-4 text-center shrink-0">
                        {s.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800 truncate">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.id}</div>
                      </div>
                      <div className="w-24 shrink-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">{s.count} ครั้ง</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-red-400"
                            style={{ width: `${(s.count / maxAbsentCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-400 py-6">
          © 2026 Computer Science AI Face Attendance System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function FilterSelect({ label }) {
  return (
    <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors shrink-0">
      {label}
      <ChevronDown className="w-4 h-4 text-slate-400" />
    </button>
  );
}
