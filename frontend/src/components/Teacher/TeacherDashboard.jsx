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
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard", active: true },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "#" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "#" },
  { icon: Users, label: "นักศึกษา", to: "#" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "#" },
  { icon: User, label: "โปรไฟล์", to: "#" },
  { icon: Settings, label: "การตั้งค่า", to: "#" },
];

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
  {
    time: "10:30",
    subject: "โครงสร้างข้อมูล (Data Structures)",
    room: "CS-201",
    attend: "28/32",
    status: "done",
  },
  {
    time: "09:00",
    subject: "การเขียนโปรแกรมเชิงวัตถุ (OOP)",
    room: "CS-202",
    attend: "26/30",
    status: "done",
  },
  {
    time: "13:30",
    subject: "ฐานข้อมูล (Database Systems)",
    room: "CS-203",
    attend: "22/28",
    status: "progress",
  },
  {
    time: "08:00",
    subject: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)",
    room: "CS-204",
    attend: "19/24",
    status: "done",
  },
  {
    time: "15:30",
    subject: "ระบบปฏิบัติการ (Operating Systems)",
    room: "CS-205",
    attend: "-",
    status: "notstarted",
  },
];

const myCourses = [
  {
    code: "CS-201",
    name: "โครงสร้างข้อมูล (Data Structures)",
    students: "นักศึกษา 32 คน",
    status: "เช็คชื่อแล้ว 10:30",
    statusColor: "text-emerald-600",
    pct: 87,
  },
  {
    code: "CS-202",
    name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)",
    students: "นักศึกษา 30 คน",
    status: "เช็คชื่อแล้ว 09:00",
    statusColor: "text-emerald-600",
    pct: 86,
  },
  {
    code: "CS-203",
    name: "ฐานข้อมูล (Database Systems)",
    students: "นักศึกษา 28 คน",
    status: "กำลังดำเนินการ",
    statusColor: "text-blue-600",
    pct: 78,
  },
  {
    code: "CS-204",
    name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)",
    students: "นักศึกษา 24 คน",
    status: "เช็คชื่อแล้ว 08:00",
    statusColor: "text-emerald-600",
    pct: 79,
  },
  {
    code: "CS-205",
    name: "ระบบปฏิบัติการ (Operating Systems)",
    students: "นักศึกษา 14 คน",
    status: "ยังไม่เริ่ม",
    statusColor: "text-slate-400",
    pct: 0,
  },
];

const courseIconColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-slate-100 text-slate-500",
];

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const totalToday = todaySummary.reduce((a, b) => a + b.value, 0);

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
            <div className="text-sm font-semibold text-slate-800">
              ความปลอดภัยของข้อมูล
            </div>
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
            <h1 className="text-lg font-bold text-slate-900">
              สวัสดีครับ, อาจารย์ณัฐวุฒิ <span className="inline-block">👋</span>
            </h1>
            <p className="text-xs text-slate-400">
              ยินดีต้อนรับเข้าสู่ระบบ CS FaceAttend
            </p>
          </div>

          <div className="flex-1" />

          <button className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors shrink-0">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            20 พฤษภาคม 2567
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <StatCard
              icon={<BookOpen className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-100"
              label="รายวิชาทั้งหมด"
              value="5"
              sub="รายวิชาที่สอน"
            />
            <StatCard
              icon={<Users className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label="นักศึกษาทั้งหมด"
              value="128"
              sub="นักศึกษาที่ลงทะเบียน"
            />
            <StatCard
              icon={<CalendarCheck className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-100"
              label="เช็คชื่อวันนี้"
              value="4"
              sub="ชั่วโมงเรียนที่เช็คชื่อแล้ว"
            />
            <StatCard
              icon={<UserCheck className="w-6 h-6 text-amber-600" />}
              iconBg="bg-amber-100"
              label="นักศึกษาเข้าเรียน"
              value="95"
              sub="74.22% ของทั้งหมด"
              subColor="text-emerald-600"
            />
            <StatCard
              icon={<UserX className="w-6 h-6 text-red-600" />}
              iconBg="bg-red-100"
              label="นักศึกษาขาดเรียน"
              value="33"
              sub="25.78% ของทั้งหมด"
              subColor="text-red-500"
            />
          </div>

          {/* Trend chart + today summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">สถิติการเข้าเรียนภาพรวม</h3>
                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5">
                  7 วันที่ผ่านมา <ChevronDown className="w-3.5 h-3.5" />
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
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="present"
                      name="เข้าเรียน"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#2563eb" }}
                      fill="url(#presentFill)"
                    />
                    <Line
                      type="monotone"
                      dataKey="absent"
                      name="ขาดเรียน"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#ef4444" }}
                      fill="url(#absentFill)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">สรุปการเข้าเรียนวันนี้</h3>
              <div className="relative h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={todaySummary}
                      dataKey="value"
                      innerRadius={48}
                      outerRadius={68}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {todaySummary.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-slate-900">{totalToday}</div>
                  <div className="text-xs text-slate-400">นักศึกษาทั้งหมด</div>
                </div>
              </div>
              <div className="space-y-2.5 mt-4">
                {todaySummary.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-slate-600">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-800 font-medium">{s.value} คน</span>
                      <span className="text-slate-400 w-14 text-right">{s.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl px-4 py-3 mt-4">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  อัตราการเข้าเรียนวันนี้
                </span>
                <span className="font-bold">74.22%</span>
              </div>
            </div>
          </div>

          {/* Recent check-ins table + courses */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">การเช็คชื่อล่าสุด</h3>
                <a href="#" className="text-sm text-blue-600 font-medium hover:underline">
                  ดูทั้งหมด
                </a>
              </div>
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-3 font-medium">เวลา</th>
                    <th className="py-2 pr-3 font-medium">รายวิชา</th>
                    <th className="py-2 pr-3 font-medium">ห้องเรียน</th>
                    <th className="py-2 pr-3 font-medium">นักศึกษาเข้าเรียน</th>
                    <th className="py-2 pr-3 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCheckins.map((r, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{r.time}</td>
                      <td className="py-3 pr-3 text-slate-800 font-medium whitespace-nowrap">
                        {r.subject}
                      </td>
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{r.room}</td>
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{r.attend}</td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        {r.status === "done" && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            เสร็จสิ้น
                          </span>
                        )}
                        {r.status === "progress" && (
                          <span className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            กำลังดำเนินการ
                          </span>
                        )}
                        {r.status === "notstarted" && (
                          <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                            <Circle className="w-3.5 h-3.5" />
                            ยังไม่เริ่ม
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">รายวิชาของฉัน</h3>
                <a href="#" className="text-sm text-blue-600 font-medium hover:underline">
                  ดูทั้งหมด
                </a>
              </div>
              <div className="space-y-4">
                {myCourses.map((c, i) => (
                  <div key={c.code} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${courseIconColors[i]}`}
                    >
                      {c.code.split("-")[1]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{c.students}</div>
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
        </main>

        <footer className="text-center text-xs text-slate-400 py-6">
           © 2026 Computer Science AI Face Attendance System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, sub, subColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-medium truncate">{label}</div>
        <div className="text-2xl font-bold text-slate-900 leading-tight mt-0.5">{value}</div>
        <div className={`text-xs mt-0.5 truncate ${subColor || "text-slate-400"}`}>{sub}</div>
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
        <circle
          stroke="#e2e8f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
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
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
        {percent}%
      </span>
    </div>
  );
}