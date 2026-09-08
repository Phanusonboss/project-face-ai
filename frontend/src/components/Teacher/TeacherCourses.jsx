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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
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
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses", active: true },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "#" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "#" },
  { icon: Users, label: "นักศึกษา", to: "#" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "#" },
  { icon: User, label: "โปรไฟล์", to: "#" },
  { icon: Settings, label: "การตั้งค่า", to: "#" },
];

const filterTabs = ["ทั้งหมด", "กำลังสอน", "สิ้นสุดแล้ว", "รอเริ่มสอน"];

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
    barColor: "bg-slate-200",
  },
];

const statusMeta = {
  teaching: { label: "กำลังสอน", cls: "bg-emerald-50 text-emerald-600" },
  notstarted: { label: "รอเริ่มสอน", cls: "bg-slate-100 text-slate-500" },
  ended: { label: "สิ้นสุดแล้ว", cls: "bg-slate-100 text-slate-400" },
};

export default function TeacherCourses() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

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
              ระบบรักษาข้อมูล ด้วย AI และการเข้ารหัส
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
              <BookOpen className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">รายวิชาของฉัน</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              จัดการรายวิชาและข้อมูลการเข้าเรียนของคุณ
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
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหารายวิชา..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 w-56"
              />
            </div>
            <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              ตัวกรอง
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200">
              <Plus className="w-4 h-4" />
              สร้างรายวิชา
            </button>
          </div>

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
              icon={<UsersRound className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label="นักศึกษาทั้งหมด"
              value="128"
              sub="นักศึกษาที่สอน"
            />
            <StatCard
              icon={<CalendarCheck className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-100"
              label="เช็คชื่อวันนี้"
              value="4"
              sub="ชั้นเรียนที่เช็คชื่อแล้ว"
            />
            <StatCard
              icon={<BarChart3 className="w-6 h-6 text-amber-600" />}
              iconBg="bg-amber-100"
              label="อัตราการเข้าเรียน"
              value={
                <span className="flex items-center gap-1">
                  74.22%
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </span>
              }
              sub="ของทั้งหมด"
            />
            <StatCard
              icon={<UserX className="w-6 h-6 text-red-500" />}
              iconBg="bg-red-100"
              label="นักศึกษาขาดเรียน"
              value="33"
              sub="25.78% ของทั้งหมด"
              subColor="text-red-500"
            />
          </div>

          {/* Filter tabs + view toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${
                    activeFilter === tab
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setView("grid")}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  view === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  view === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course cards */}
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                : "flex flex-col gap-4"
            }
          >
            {courses.map((c) => {
              const Icon = c.icon;
              const sm = statusMeta[c.status];
              const isNotStarted = c.status === "notstarted";
              return (
                <div
                  key={c.code}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white ${c.iconBg}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-blue-600 text-sm">{c.code}</div>
                        <div className="text-sm font-semibold text-slate-800 leading-snug">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {c.term} • ห้อง {c.room}
                        </div>
                      </div>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-colors shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${sm.cls}`}
                  >
                    {sm.label}
                  </span>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <UsersRound className="w-3.5 h-3.5" />
                        นักศึกษา
                      </div>
                      <div className="font-bold text-slate-800 mt-0.5">{c.students} คน</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <ScanFace className="w-3.5 h-3.5" />
                        เช็คชื่อวันนี้
                      </div>
                      <div className="font-bold text-slate-800 mt-0.5">{c.pct}%</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        เวลาเรียน
                      </div>
                      <div className="font-bold text-slate-800 mt-0.5">{c.time}</div>
                    </div>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full ${c.barColor}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors">
                      <Wrench className="w-3.5 h-3.5" />
                      จัดการรายวิชา
                    </button>
                    <button
                      disabled={isNotStarted}
                      className={`flex items-center justify-center gap-1 text-[11px] font-semibold rounded-lg py-2 transition-colors ${
                        isNotStarted
                          ? "text-slate-300 border border-slate-100 cursor-not-allowed"
                          : "text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      <ScanFace className="w-3.5 h-3.5" />
                      เช็คชื่อ
                    </button>
                    <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-purple-600 border border-purple-200 rounded-lg py-2 hover:bg-purple-50 transition-colors">
                      <BarChart3 className="w-3.5 h-3.5" />
                      สถิติ
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Create new course card */}
            <button className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors p-8 text-center min-h-[260px]">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                <Plus className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <div className="font-bold text-slate-800">สร้างรายวิชาใหม่</div>
                <div className="text-xs text-slate-400 mt-1">เพิ่มรายวิชาที่คุณต้องการสอน</div>
              </div>
              <span className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200">
                <Plus className="w-4 h-4" />
                สร้างรายวิชา
              </span>
            </button>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(2, p + 1))}
                disabled={page === 2}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
              แสดง 6 ต่อหน้า
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
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
        <div className="text-xl font-bold text-slate-900 leading-tight mt-0.5">{value}</div>
        <div className={`text-xs mt-0.5 truncate ${subColor || "text-slate-400"}`}>{sub}</div>
      </div>
    </div>
  );
}
