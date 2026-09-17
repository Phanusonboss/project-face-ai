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
  Award,
  CalendarDays,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Plus,
  Eye,
  Pencil,
  MoreVertical,
  Clock,
  Ban,
  UsersRound,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/teacher-history" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "/teacher-report" },
  { icon: Award, label: "คะแนนเข้าเรียน", to: "/teacher-scores" },
  { icon: Users, label: "นักศึกษา", to: "/teacher-students", active: true },
  { icon: Download, label: "ส่งออกข้อมูล", to: "/teacher-export" },
  { icon: User, label: "โปรไฟล์", to: "/teacher-profile" },
  { icon: Settings, label: "การตั้งค่า", to: "/teacher-settings" },
];

const summaryStats = [
  {
    icon: <UsersRound className="w-6 h-6 text-blue-600" />,
    iconBg: "bg-blue-100",
    label: "จำนวนนักศึกษาทั้งหมด",
    value: "148",
    sub: "คน",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    iconBg: "bg-emerald-100",
    label: "นักศึกษาที่ลงทะเบียนแล้ว",
    value: "142",
    sub: "คน",
    trend: "95.9%",
    trendColor: "text-emerald-600",
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    iconBg: "bg-amber-100",
    label: "นักศึกษาที่รออนุมัติ",
    value: "3",
    sub: "คน",
    trend: "2.0%",
    trendColor: "text-amber-500",
  },
  {
    icon: <Ban className="w-6 h-6 text-red-500" />,
    iconBg: "bg-red-100",
    label: "นักศึกษาที่ถูกระงับ",
    value: "3",
    sub: "คน",
    trend: "2.0%",
    trendColor: "text-red-500",
  },
];

const statusMeta = {
  normal: { label: "ปกติ", cls: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  pending: { label: "รออนุมัติ", cls: "bg-amber-50 text-amber-600", icon: Clock },
  suspended: { label: "ถูกระงับ", cls: "bg-red-50 text-red-500", icon: Ban },
};

const students = [
  {
    code: "65011001",
    name: "นายธนภัทร ใจดี",
    year: 3,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "12 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    code: "65011002",
    name: "นางสาวกานต์ธิชา สุขสวัสดิ์",
    year: 3,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "12 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    code: "65011003",
    name: "นายศุภกฤต เสริมศรี",
    year: 3,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "13 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=33",
  },
  {
    code: "65011004",
    name: "นางสาวพิมพ์ชนก วงศ์สมบัติ",
    year: 3,
    major: "วิทยาการคอมพิวเตอร์",
    status: "pending",
    date: "14 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=25",
  },
  {
    code: "65011005",
    name: "นายกิตติพงษ์ แสงทอง",
    year: 2,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "15 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=14",
  },
  {
    code: "65011006",
    name: "นางสาววรินทร์พร แก้วใส",
    year: 2,
    major: "วิทยาการคอมพิวเตอร์",
    status: "suspended",
    date: "16 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    code: "65011007",
    name: "นายภูมิพัฒน์ สายเนตร",
    year: 1,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "16 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=51",
  },
  {
    code: "65011008",
    name: "นางสาวภัทรวดี กันหา",
    year: 1,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "17 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=44",
  },
  {
    code: "65011009",
    name: "นายณัฐวุฒิ จันทร์ศรี",
    year: 4,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "18 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
  {
    code: "65011010",
    name: "นางสาวอรปรียา ทองมาก",
    year: 4,
    major: "วิทยาการคอมพิวเตอร์",
    status: "normal",
    date: "18 ส.ค. 2565",
    avatar: "https://i.pravatar.cc/100?img=28",
  },
];

const totalStudents = 142;
const pageNumbers = [1, 2, 3, 4, 5];
const lastPage = 15;

export default function TeacherStudents() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const toggleAll = () => {
    setSelected((prev) => (prev.length === students.length ? [] : students.map((s) => s.code)));
  };

  const toggleOne = (code) => {
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans flex">
      {/* ---------- Sidebar (same as other Teacher pages) ---------- */}
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
        {/* Header (same pattern as other Teacher pages) */}
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
              <Users className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">จัดการนักศึกษา</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ดูแลและจัดการข้อมูลนักศึกษาในสาขาวิทยาการคอมพิวเตอร์
            </p>
          </div>

          <div className="flex-1" />

          <button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 shrink-0">
            <Plus className="w-4 h-4" />
            เพิ่มนักศึกษา
          </button>

          <button className="hidden lg:flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors shrink-0">
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
          {/* Add button for small screens */}
          <div className="flex md:hidden justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200">
              <Plus className="w-4 h-4" />
              เพิ่มนักศึกษา
            </button>
          </div>

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
                  {s.trend && (
                    <div className={`text-xs mt-0.5 truncate ${s.trendColor}`}>{s.trend}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Filter toolbar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ-นามสกุล, รหัสนักศึกษา หรืออีเมล..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <FilterSelect label="คณะ/สาขา" value="วิทยาการคอมพิวเตอร์" />
            <FilterSelect label="ชั้นปี" value="ทั้งหมด" />
            <FilterSelect label="สถานะ" value="ทั้งหมด" />

            <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors px-3 py-2.5 shrink-0">
              <RotateCcw className="w-4 h-4" />
              รีเซ็ต
            </button>

            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
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

          {/* Student list card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">
                รายชื่อนักศึกษา <span className="text-slate-400 font-medium">({totalStudents} คน)</span>
              </h3>
              <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4 text-slate-400" />
                ส่งออกข้อมูล
              </button>
            </div>

            {view === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[860px]">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                      <th className="py-2 pr-3 font-medium w-8">
                        <input
                          type="checkbox"
                          checked={selected.length === students.length}
                          onChange={toggleAll}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                        />
                      </th>
                      <th className="py-2 pr-3 font-medium">รูปภาพ</th>
                      <th className="py-2 pr-3 font-medium">รหัสนักศึกษา</th>
                      <th className="py-2 pr-3 font-medium">ชื่อ - นามสกุล</th>
                      <th className="py-2 pr-3 font-medium">ชั้นปี</th>
                      <th className="py-2 pr-3 font-medium">สาขาวิชา</th>
                      <th className="py-2 pr-3 font-medium">สถานะ</th>
                      <th className="py-2 pr-3 font-medium">วันที่ลงทะเบียน</th>
                      <th className="py-2 pr-3 font-medium text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => {
                      const sm = statusMeta[s.status];
                      const StatusIcon = sm.icon;
                      return (
                        <tr key={s.code} className="border-b border-slate-50 last:border-0">
                          <td className="py-3 pr-3">
                            <input
                              type="checkbox"
                              checked={selected.includes(s.code)}
                              onChange={() => toggleOne(s.code)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                            />
                          </td>
                          <td className="py-3 pr-3">
                            <img
                              src={s.avatar}
                              alt={s.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          </td>
                          <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{s.code}</td>
                          <td className="py-3 pr-3 text-slate-800 font-medium whitespace-nowrap">
                            {s.name}
                          </td>
                          <td className="py-3 pr-3 text-slate-500">{s.year}</td>
                          <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{s.major}</td>
                          <td className="py-3 pr-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sm.cls}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {sm.label}
                            </span>
                          </td>
                          <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{s.date}</td>
                          <td className="py-3 pr-3">
                            <div className="flex items-center justify-end gap-1">
                              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {students.map((s) => {
                  const sm = statusMeta[s.status];
                  const StatusIcon = sm.icon;
                  return (
                    <div
                      key={s.code}
                      className="border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
                    >
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-800 truncate">{s.name}</div>
                        <div className="text-xs text-slate-400">
                          {s.code} • ปี {s.year}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${sm.cls}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {sm.label}
                        </span>
                      </div>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-colors shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-2 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                แสดง 1 - {students.length} จาก {totalStudents} รายการ
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {pageNumbers.map((n) => (
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
                <span className="px-1 text-slate-400">…</span>
                <button
                  onClick={() => setPage(lastPage)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    page === lastPage
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {lastPage}
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
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

function FilterSelect({ label, value }) {
  return (
    <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors shrink-0">
      <span className="text-slate-400">{label}:</span>
      {value}
      <ChevronDown className="w-4 h-4 text-slate-400" />
    </button>
  );
}
