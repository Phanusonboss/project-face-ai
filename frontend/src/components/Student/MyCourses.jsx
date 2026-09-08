import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ScanFace,
  History,
  UserPlus,
  BookOpen,
  CalendarDays,
  User,
  Settings,
  Megaphone,
  LogOut,
  Menu,
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Code2,
  Database,
  Cpu,
  Brain,
  MapPin,
  MoreHorizontal,
  Info,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: Home, label: "หน้าหลัก", to: "/dashboard" },
  { icon: ScanFace, label: "เช็คชื่อ", to: "/checkin" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/history" },
  { icon: UserPlus, label: "ลงทะเบียนใบหน้า", to: "/face-registration" },
  { icon: BookOpen, label: "วิชาเรียนของฉัน", to: "/courses", active: true },
  { icon: CalendarDays, label: "ตารางเรียน", to: "/schedule" },
  { icon: Megaphone, label: "ประกาศ", to: "/announcements" },
  { icon: User, label: "โปรไฟล์", to: "/profile" },
  { icon: Settings, label: "ตั้งค่า", to: "/settings" },
];

const colorMap = {
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    codeText: "text-blue-600",
    btn: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    bar: "bg-blue-500",
  },
  amber: {
    border: "border-l-amber-500",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    codeText: "text-amber-600",
    btn: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    bar: "bg-amber-500",
  },
  emerald: {
    border: "border-l-emerald-500",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    codeText: "text-emerald-600",
    btn: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    bar: "bg-emerald-500",
  },
  purple: {
    border: "border-l-purple-500",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    codeText: "text-purple-600",
    btn: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    bar: "bg-purple-500",
  },
  sky: {
    border: "border-l-sky-500",
    iconBg: "bg-sky-100",
    iconText: "text-sky-600",
    codeText: "text-sky-600",
    btn: "bg-sky-50 text-sky-600 hover:bg-sky-100",
    bar: "bg-sky-500",
  },
  rose: {
    border: "border-l-rose-500",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    codeText: "text-rose-600",
    btn: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    bar: "bg-rose-500",
  },
};

const courses = [
  {
    code: "CS-201",
    name: "โครงสร้างข้อมูลและอัลกอริทึม",
    nameEn: "(Data Structures)",
    teacher: "รศ. ดร.สมชาย รุ่งเรือง",
    schedule: "จันทร์ 08:00 - 10:00",
    room: "ห้อง CS-201",
    attended: 28,
    total: 30,
    icon: Code2,
    color: "blue",
  },
  {
    code: "CS-202",
    name: "การเขียนโปรแกรมเชิงวัตถุ",
    nameEn: "(Object Oriented Programming)",
    teacher: "ผศ. ดร.นฤมล พิพัฒน์",
    schedule: "พุธ 13:00 - 15:00",
    room: "ห้อง CS-202",
    attended: 25,
    total: 30,
    iconLabel: "OOP",
    color: "amber",
  },
  {
    code: "CS-203",
    name: "ฐานข้อมูล",
    nameEn: "(Database Systems)",
    teacher: "อ. วิชาญ ศรีเกษม",
    schedule: "ศุกร์ 13:30 - 15:30",
    room: "ห้อง CS-203",
    attended: 29,
    total: 30,
    icon: Database,
    color: "emerald",
  },
  {
    code: "CS-204",
    name: "ระบบปฏิบัติการ",
    nameEn: "(Operating Systems)",
    teacher: "อ. กิตติพงษ์ อินทร์แก้ว",
    schedule: "อังคาร 09:00 - 11:00",
    room: "ห้อง CS-204",
    attended: 23,
    total: 30,
    icon: Cpu,
    color: "purple",
  },
  {
    code: "CS-205",
    name: "ปัญญาประดิษฐ์เบื้องต้น",
    nameEn: "(AI Introduction)",
    teacher: "ผศ. ดร.จิราภา กุลจาติ",
    schedule: "พฤหัสบดี 15:30 - 17:30",
    room: "ห้อง CS-205",
    attended: 28,
    total: 30,
    icon: Brain,
    color: "sky",
  },
  {
    code: "GE-101",
    name: "ทักษะการเรียนรู้ในศตวรรษที่ 21",
    nameEn: "(21st Century Learning Skills)",
    teacher: "อ. อารีย์ วงศ์สวัสดิ์",
    schedule: "ศุกร์ 09:00 - 11:00",
    room: "ห้อง GE-101",
    attended: 26,
    total: 30,
    icon: BarChart3,
    color: "rose",
  },
];

export default function MyCourses() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                  ระบบปลอดภัย
                </div>
                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                  ข้อมูลของคุณได้รับการปกป้องอย่างปลอดภัย
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-600">ออนไลน์</span>
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
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="สลับเมนู"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหารายวิชา..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex-1" />

          <button className="relative w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          <button className="flex items-center gap-2.5 pl-2 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=faces"
              alt="นายกฤษฎา ใจดี"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                นายกฤษฎา ใจดี
              </div>
              <div className="text-xs text-slate-400 whitespace-nowrap">นักศึกษา</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title + filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                วิชาเรียนของฉัน
                <BookOpen className="w-5 h-5 text-slate-400" />
              </h1>
              <p className="text-sm text-slate-500 mt-1">ภาคเรียนที่ 1/2568</p>
            </div>

            <div className="flex items-center gap-3">
              <select className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                <option>ภาคเรียน 1/2568</option>
                <option>ภาคเรียน 2/2567</option>
              </select>
              <select className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                <option>ทั้งหมด</option>
                <option>กำลังเรียน</option>
                <option>เรียนจบแล้ว</option>
              </select>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              icon={<BookOpen className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-100"
              label="รายวิชาทั้งหมด"
              value="6"
              sub="วิชา"
            />
            <StatCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label="เช็คชื่อครบ"
              value="4"
              sub="วิชา"
            />
            <StatCard
              icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-100"
              label="อัตราเข้าเรียนเฉลี่ย"
              value="94.2%"
              sub="ของทั้งหมด"
            />
          </div>

          {/* Course cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((c) => {
              const cs = colorMap[c.color];
              const pct = Math.round((c.attended / c.total) * 100);
              const Icon = c.icon;
              return (
                <div
                  key={c.code}
                  className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${cs.border} shadow-sm p-5 flex flex-col`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cs.iconBg}`}
                    >
                      {c.iconLabel ? (
                        <span className={`text-xs font-extrabold ${cs.iconText}`}>
                          {c.iconLabel}
                        </span>
                      ) : (
                        <Icon className={`w-5 h-5 ${cs.iconText}`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className={`font-bold text-sm ${cs.codeText}`}>{c.code}</div>
                      <div className="text-sm font-semibold text-slate-800 leading-snug">
                        {c.name}
                      </div>
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
                      <span className="text-slate-500">
                        เข้าเรียน {c.attended} / {c.total} ครั้ง
                      </span>
                      <span className={`font-semibold ${cs.codeText}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full rounded-full ${cs.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className={`flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${cs.btn}`}
                      >
                        ดูรายละเอียด
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <Info className="w-3.5 h-3.5" />
            คลิกที่ "ดูรายละเอียด" เพื่อดูข้อมูลเพิ่มเติมของรายวิชา
          </div>
        </main>

        <footer className="text-center text-xs text-slate-400 py-6">
          © 2026 Computer Science AI Face Attendance System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-medium truncate">{label}</div>
        <div className="text-2xl font-bold text-slate-900 leading-tight mt-0.5">{value}</div>
        <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}