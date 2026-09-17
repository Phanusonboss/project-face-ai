import React, { useMemo, useState } from "react";
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
  CalendarClock,
  Search,
  RotateCcw,
  Circle,
  Clock,
  XCircle,
  MoreHorizontal,
  BarChart3,
  Trophy,
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
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  {
    icon: History,
    label: "ประวัติการเช็คชื่อ",
    to: "/teacher-history",
    active: true,
  },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "/teacher-report" },
  { icon: Award, label: "คะแนนเข้าเรียน", to: "/teacher-scores" },
  { icon: Users, label: "นักศึกษา", to: "/teacher-students" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "/teacher-export" },
  { icon: User, label: "โปรไฟล์", to: "/teacher-profile" },
  { icon: Settings, label: "การตั้งค่า", to: "/teacher-settings" },
];

const summaryStats = [
  {
    icon: <CalendarClock className="w-6 h-6 text-blue-600" />,
    iconBg: "bg-blue-100",
    label: "จำนวนครั้งที่เช็คชื่อทั้งหมด",
    value: "124",
    sub: "ครั้ง",
  },
  {
    icon: <User className="w-6 h-6 text-emerald-600" />,
    iconBg: "bg-emerald-100",
    label: "เข้าเรียนตรงเวลา",
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

const statusTabs = [
  {
    key: "all",
    label: "ทั้งหมด",
    icon: Circle,
    activeCls: "bg-blue-600 text-white border-blue-600",
  },
  {
    key: "present",
    label: "เข้าเรียน",
    icon: CheckCircle2,
    activeCls: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    key: "late",
    label: "มาสาย",
    icon: Clock,
    activeCls: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    key: "absent",
    label: "ขาดเรียน",
    icon: XCircle,
    activeCls: "bg-red-50 text-red-500 border-red-200",
  },
];

const statusMeta = {
  present: {
    label: "เข้าเรียน",
    cls: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle2,
  },
  late: { label: "มาสาย", cls: "bg-amber-50 text-amber-600", icon: Clock },
  absent: { label: "ขาดเรียน", cls: "bg-red-50 text-red-500", icon: XCircle },
};

const checkinLogs = [
  {
    classTime: "20 พ.ค. 2567 09:00",
    course: "CS-201 โครงสร้างข้อมูล (Data Structures)",
    studentId: "6601234567",
    studentName: "นายสมชาย ใจดี",
    section: "CS101",
    status: "present",
    checkedAt: "20 พ.ค. 2567 09:00",
    note: "-",
  },
  {
    classTime: "20 พ.ค. 2567 09:00",
    course: "CS-201 โครงสร้างข้อมูล (Data Structures)",
    studentId: "6601234588",
    studentName: "นางสาวกมลวรรณ ศรีสุข",
    section: "CS101",
    status: "present",
    checkedAt: "20 พ.ค. 2567 09:00",
    note: "-",
  },
  {
    classTime: "20 พ.ค. 2567 09:00",
    course: "CS-202 การเขียนโปรแกรมเชิงวัตถุ (OOP)",
    studentId: "6601234501",
    studentName: "นายศิวัฒน์ โสภณกมล",
    section: "CS101",
    status: "late",
    checkedAt: "20 พ.ค. 2567 09:15",
    note: "มาสาย 7 นาที",
  },
  {
    classTime: "20 พ.ค. 2567 09:00",
    course: "CS-203 ฐานข้อมูล (Database Systems)",
    studentId: "6601234604",
    studentName: "นางสาวปฏิญญา จันทร์เพ็ญ",
    section: "CS101",
    status: "absent",
    checkedAt: "-",
    note: "-",
  },
  {
    classTime: "19 พ.ค. 2567 13:00",
    course: "CS-205 ระบบปฏิบัติการ (Operating Systems)",
    studentId: "6601234506",
    studentName: "นายกฤษฎา ทองดี",
    section: "CS102",
    status: "present",
    checkedAt: "19 พ.ค. 2567 13:05",
    note: "-",
  },
  {
    classTime: "19 พ.ค. 2567 13:00",
    course: "CS-205 ระบบปฏิบัติการ (Operating Systems)",
    studentId: "6601234522",
    studentName: "นางสาวปรีณคา เหมะนาว",
    section: "CS102",
    status: "present",
    checkedAt: "19 พ.ค. 2567 13:10",
    note: "-",
  },
  {
    classTime: "19 พ.ค. 2567 13:00",
    course: "CS-205 ระบบปฏิบัติการ (Operating Systems)",
    studentId: "6601234555",
    studentName: "นายธนภัทร สายทอง",
    section: "CS102",
    status: "late",
    checkedAt: "19 พ.ค. 2567 13:20",
    note: "มาสาย 15 นาที",
  },
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
  {
    rank: 1,
    id: "6601234567",
    name: "นายกิตติพงษ์ ใจดี",
    count: 8,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    rank: 2,
    id: "6601234588",
    name: "นางสาวกมลวรรณ ศรีสุข",
    count: 7,
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    rank: 3,
    id: "6601234501",
    name: "นายธนวัฒน์ แก้ววงศ์",
    count: 6,
    avatar: "https://i.pravatar.cc/100?img=33",
  },
];

export default function TeacherCheckinHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const maxAbsentCount = Math.max(...topAbsentees.map((s) => s.count));

  const filteredLogs = useMemo(
    () =>
      activeStatus === "all"
        ? checkinLogs
        : checkinLogs.filter((l) => l.status === activeStatus),
    [activeStatus],
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans flex">
      {/* ---------- Sidebar ---------- */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 lg:w-64"
        } shrink-0 bg-white border-r border-slate-100 flex flex-col transition-all overflow-hidden`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
          <img
            src={logoImg}
            alt="CS FaceAttend"
            className="h-10 w-auto object-contain"
          />
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
            <div className="text-sm font-semibold text-slate-800">
              ความปลอดภัยของข้อมูล
            </div>
            <div className="text-xs text-slate-500 leading-relaxed mt-1.5">
              ระบบใช้เทคโนโลยี AI ในการจดจำใบหน้า ข้อมูลถูกเข้ารหัสและปลอดภัย
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
              <History className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">
                ประวัติการเช็คชื่อ
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ติดตามและตรวจสอบข้อมูลการเข้าเรียนย้อนหลัง
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
              <div className="text-xs text-slate-400 whitespace-nowrap">
                อาจารย์
              </div>
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
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 font-medium truncate">
                    {s.label}
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900 leading-tight">
                      {s.value}
                    </span>
                    <span className="text-xs text-slate-400">{s.sub}</span>
                  </div>
                  {s.trend && (
                    <div className={`text-xs mt-0.5 truncate ${s.trendColor}`}>
                      {s.trend}
                    </div>
                  )}
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
                placeholder="ค้นหานักศึกษา..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <FilterSelect label="รายวิชา" />
            <FilterSelect label="สถานะ" />
            <FilterSelect label="ภาคเรียน" />

            <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors shrink-0">
              <RotateCcw className="w-4 h-4" />
              รีเซ็ตตัวกรอง
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
                    isActive
                      ? tab.activeCls
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Check-in log table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
            <table className="w-full text-sm min-w-[960px]">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">วันที่</th>
                  <th className="py-2 pr-3 font-medium">รายวิชา</th>
                  <th className="py-2 pr-3 font-medium">รหัสนักศึกษา</th>
                  <th className="py-2 pr-3 font-medium">ชื่อ-นามสกุล</th>
                  <th className="py-2 pr-3 font-medium">กลุ่มเรียน</th>
                  <th className="py-2 pr-3 font-medium">สถานะ</th>
                  <th className="py-2 pr-3 font-medium">วันที่เช็คชื่อ</th>
                  <th className="py-2 pr-3 font-medium">หมายเหตุ</th>
                  <th className="py-2 pr-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((r, i) => {
                  const sm = statusMeta[r.status];
                  const StatusIcon = sm.icon;
                  return (
                    <tr
                      key={i}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                        {r.classTime}
                      </td>
                      <td className="py-3 pr-3 text-slate-800 font-medium whitespace-nowrap">
                        {r.course}
                      </td>
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                        {r.studentId}
                      </td>
                      <td className="py-3 pr-3 text-slate-800 whitespace-nowrap">
                        {r.studentName}
                      </td>
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                        {r.section}
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sm.cls}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {sm.label}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                        {r.checkedAt}
                      </td>
                      <td className="py-3 pr-3 text-slate-400 whitespace-nowrap">
                        {r.note}
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 text-center text-sm text-slate-400"
                    >
                      ไม่พบข้อมูลการเช็คชื่อในหมวดนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Daily trend chart + top absentees */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900">
                    สถิติการเข้าเรียนย้อนหลัง 30 วัน
                  </h3>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyTrend}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
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
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                      }}
                    />
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
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900">
                  นักศึกษาที่ขาดเรียนมากที่สุด
                </h3>
              </div>
              <div className="space-y-4">
                {topAbsentees.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-5 text-center shrink-0">
                      {s.rank}.
                    </span>
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {s.id}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {s.name}
                      </div>
                    </div>
                    <div className="w-28 shrink-0 text-right">
                      <div className="text-xs font-semibold text-red-500 mb-1">
                        ขาด {s.count} ครั้ง
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-red-400"
                          style={{
                            width: `${(s.count / maxAbsentCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-400 py-6">
          © 2026 Computer Science AI Face Attendance System. All rights
          reserved.
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
