import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ScanFace,
  History,
  UserPlus,
  BookOpen,
  CalendarDays,
  CalendarClock,
  User,
  Settings,
  Megaphone,
  LogOut,
  Menu,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Calendar,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: Home, label: "หน้าหลัก", to: "/dashboard" },
  { icon: ScanFace, label: "เช็คชื่อ", to: "/checkin" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/history", active: true },
  { icon: UserPlus, label: "ลงทะเบียนใบหน้า", to: "/face-registration" },
  { icon: BookOpen, label: "วิชาเรียนของฉัน", to: "/courses" },
  { icon: CalendarDays, label: "ตารางเรียน", to: "/schedule" },
  { icon: Megaphone, label: "ประกาศ", to: "/announcements" },
  { icon: User, label: "โปรไฟล์", to: "/profile" },
  { icon: Settings, label: "ตั้งค่า", to: "/settings" },
];

const courses = {
  "CS-201": "โครงสร้างข้อมูล (Data Structures)",
  "CS-202": "การเขียนโปรแกรมเชิงวัตถุ (OOP)",
  "CS-203": "ฐานข้อมูล (Database Systems)",
};

// 24 mock records, 8 shown per page
const rawRecords = [
  { date: "20 พ.ค. 2567", time: "08:45:30", code: "CS-201", room: "CS-201", status: "ontime" },
  { date: "20 พ.ค. 2567", time: "10:20:15", code: "CS-202", room: "CS-202", status: "late" },
  { date: "19 พ.ค. 2567", time: "13:30:00", code: "CS-203", room: "CS-203", status: "ontime" },
  { date: "17 พ.ค. 2567", time: "08:30:25", code: "CS-201", room: "CS-201", status: "ontime" },
  { date: "17 พ.ค. 2567", time: "10:25:40", code: "CS-202", room: "CS-202", status: "ontime" },
  { date: "16 พ.ค. 2567", time: "13:28:10", code: "CS-203", room: "CS-203", status: "ontime" },
  { date: "15 พ.ค. 2567", time: "08:40:05", code: "CS-201", room: "CS-201", status: "late" },
  { date: "15 พ.ค. 2567", time: "10:30:12", code: "CS-202", room: "CS-202", status: "ontime" },
  { date: "13 พ.ค. 2567", time: "13:31:02", code: "CS-203", room: "CS-203", status: "ontime" },
  { date: "13 พ.ค. 2567", time: "08:28:44", code: "CS-201", room: "CS-201", status: "ontime" },
  { date: "10 พ.ค. 2567", time: "10:22:19", code: "CS-202", room: "CS-202", status: "ontime" },
  { date: "10 พ.ค. 2567", time: "13:29:55", code: "CS-203", room: "CS-203", status: "late" },
  { date: "09 พ.ค. 2567", time: "08:31:08", code: "CS-201", room: "CS-201", status: "ontime" },
  { date: "09 พ.ค. 2567", time: "10:19:37", code: "CS-202", room: "CS-202", status: "ontime" },
  { date: "08 พ.ค. 2567", time: "13:30:41", code: "CS-203", room: "CS-203", status: "ontime" },
  { date: "06 พ.ค. 2567", time: "08:27:52", code: "CS-201", room: "CS-201", status: "ontime" },
  { date: "06 พ.ค. 2567", time: "10:24:03", code: "CS-202", room: "CS-202", status: "ontime" },
  { date: "03 พ.ค. 2567", time: "13:32:29", code: "CS-203", room: "CS-203", status: "ontime" },
  { date: "02 พ.ค. 2567", time: "08:29:15", code: "CS-201", room: "CS-201", status: "ontime" },
  { date: "02 พ.ค. 2567", time: "10:21:58", code: "CS-202", room: "CS-202", status: "ontime" },
  { date: "01 พ.ค. 2567", time: "13:27:33", code: "CS-203", room: "CS-203", status: "ontime" },
  { date: "01 พ.ค. 2567", time: "08:33:47", code: "CS-201", room: "CS-201", status: "ontime" },
];

const totalRecords = 24;
const PAGE_SIZE = 8;

const statusMeta = {
  ontime: { label: "เข้าเรียน", cls: "bg-emerald-100 text-emerald-600", icon: CheckCircle2 },
  late: { label: "สาย", cls: "bg-amber-100 text-amber-600", icon: Clock },
  absent: { label: "ขาดเรียน", cls: "bg-red-100 text-red-600", icon: XCircle },
};

export default function CheckinHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageRecords = rawRecords.slice(start, start + PAGE_SIZE);

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
              placeholder="ค้นหา..."
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
          {/* Title + breadcrumb */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ประวัติการเช็คชื่อ</h1>
            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
              <Link to="/dashboard" className="hover:text-blue-600">
                หน้าหลัก
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-500">ประวัติการเช็คชื่อ</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <StatCard
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-100"
              label="เช็คชื่อทั้งหมด"
              value="24"
              unit="ครั้ง"
            />
            <StatCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label="เข้าเรียน"
              value="22"
              sub="91.67%"
              subColor="text-emerald-600"
            />
            <StatCard
              icon={<Clock className="w-6 h-6 text-amber-500" />}
              iconBg="bg-amber-100"
              label="สาย"
              value="2"
              sub="8.33%"
              subColor="text-amber-500"
            />
            <StatCard
              icon={<XCircle className="w-6 h-6 text-red-500" />}
              iconBg="bg-red-100"
              label="ขาดเรียน"
              value="0"
              sub="0%"
              subColor="text-red-500"
            />
            <StatCard
              icon={<CalendarClock className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-100"
              label="เช็คชื่อวันนี้"
              value="1"
              unit="ครั้ง"
            />
          </div>

          {/* Filters + table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center gap-3 p-5 border-b border-slate-100">
              <select className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option>ทั้งหมด</option>
                <option>CS-201</option>
                <option>CS-202</option>
                <option>CS-203</option>
              </select>

              <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                <Calendar className="w-4 h-4 text-slate-400" />
                01 พฤษภาคม 2567 - 20 พฤษภาคม 2567
              </button>

              <select className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option>สถานะทั้งหมด</option>
                <option>เข้าเรียน</option>
                <option>สาย</option>
                <option>ขาดเรียน</option>
              </select>

              <div className="flex-1" />

              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200">
                <Download className="w-4 h-4" />
                ส่งออกข้อมูล
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="py-3 px-5 font-medium">วันที่</th>
                    <th className="py-3 px-3 font-medium">เวลา</th>
                    <th className="py-3 px-3 font-medium">รายวิชา</th>
                    <th className="py-3 px-3 font-medium">ห้องเรียน</th>
                    <th className="py-3 px-3 font-medium">สถานะ</th>
                    <th className="py-3 px-3 font-medium">วิธีเช็คชื่อ</th>
                    <th className="py-3 px-5 font-medium">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRecords.map((r, i) => {
                    const meta = statusMeta[r.status];
                    const StatusIcon = meta.icon;
                    return (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                        <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{r.date}</td>
                        <td className="py-4 px-3 text-slate-600 whitespace-nowrap">{r.time}</td>
                        <td className="py-4 px-3 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{r.code}</div>
                          <div className="text-xs text-slate-400">{courses[r.code]}</div>
                        </td>
                        <td className="py-4 px-3 text-slate-600 whitespace-nowrap">{r.room}</td>
                        <td className="py-4 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${meta.cls}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-4 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs">
                            <ScanFace className="w-4 h-4 text-blue-500" />
                            สแกนใบหน้า
                          </span>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          <a href="#" className="text-blue-600 text-xs font-semibold hover:underline">
                            ดูรายละเอียด
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4">
              <div className="text-xs text-slate-400">
                แสดง {start + 1} - {Math.min(start + PAGE_SIZE, totalRecords)} จาก {totalRecords}{" "}
                รายการ
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, unit, sub, subColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-medium truncate">{label}</div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold text-slate-900 leading-tight">{value}</span>
          {unit && <span className="text-xs text-slate-400">{unit}</span>}
        </div>
        {sub && <div className={`text-xs mt-0.5 font-medium ${subColor}`}>{sub}</div>}
      </div>
    </div>
  );
}