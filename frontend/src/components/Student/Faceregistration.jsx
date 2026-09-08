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
  Camera,
  Eye,
  Sun,
  Glasses,
  VenetianMask,
  MoveHorizontal,
  Info,
  Lock,
  Check,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: Home, label: "หน้าหลัก", to: "/dashboard" },
  { icon: ScanFace, label: "เช็คชื่อ", to: "/checkin" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/history" },
  { icon: UserPlus, label: "ลงทะเบียนใบหน้า", to: "/face-registration", active: true },
  { icon: BookOpen, label: "วิชาเรียนของฉัน", to: "/courses" },
  { icon: CalendarDays, label: "ตารางเรียน", to: "/schedule" },
  { icon: Megaphone, label: "ประกาศ", to: "/announcements" },
  { icon: User, label: "โปรไฟล์", to: "/profile" },
  { icon: Settings, label: "ตั้งค่า", to: "/settings" },
];

const steps = [
  { n: 1, title: "เตรียมพร้อม", sub: "ตรวจสอบสภาพแวดล้อม" },
  { n: 2, title: "บันทึกใบหน้า", sub: "เก็บข้อมูลใบหน้า" },
  { n: 3, title: "ตรวจสอบข้อมูล", sub: "ตรวจสอบความถูกต้อง" },
  { n: 4, title: "เสร็จสิ้น", sub: "ลงทะเบียนสำเร็จ" },
];

const guidelines = [
  { icon: Eye, label: "มองตรงไปที่กล้อง" },
  { icon: ScanFace, label: "ใบหน้าอยู่ในกรอบ" },
  { icon: Sun, label: "แสงสว่างเพียงพอ" },
  { icon: Glasses, label: "ไม่สวมแว่นตา" },
  { icon: VenetianMask, label: "ไม่สวมหน้ากาก" },
  { icon: MoveHorizontal, label: "ไม่หันหน้าไปด้านข้าง" },
];

// Placeholder pose examples — swap with real student photos later
const posePlaceholders = [
  {
    label: "มองตรง",
    good: true,
    src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces",
  },
  {
    label: "หันซ้าย 45°",
    src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces&sig=2",
  },
  {
    label: "หันขวา 45°",
    src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces&sig=3",
  },
  {
    label: "เงยหน้าเล็กน้อย",
    src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces&sig=4",
  },
];

export default function FaceRegistration() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentStep = 1;

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
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ลงทะเบียนใบหน้า</h1>
            <p className="text-sm text-slate-500 mt-1">
              ลงทะเบียนใบหน้าเพื่อใช้สำหรับการเช็คชื่อเข้าเรียน
            </p>
          </div>

          {/* Step indicator */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-6 overflow-x-auto">
            <div className="flex items-center min-w-[560px]">
              {steps.map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        s.n === currentStep
                          ? "bg-blue-600 text-white"
                          : s.n < currentStep
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {s.n < currentStep ? <Check className="w-4 h-4" /> : s.n}
                    </div>
                    <div className="hidden sm:block">
                      <div
                        className={`text-sm font-semibold ${
                          s.n === currentStep ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {s.title}
                      </div>
                      <div className="text-xs text-slate-400">{s.sub}</div>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px bg-slate-200 mx-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Main content + side cards */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5">
            {/* Step content */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900">ขั้นตอนที่ 1: เตรียมพร้อม</h3>
              <p className="text-sm text-slate-500 mt-1 mb-5">
                กรุณาจัดตำแหน่งใบหน้าให้อยู่ในกรอบ และอยู่ในสภาพแวดล้อมที่เหมาะสม
              </p>

              <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
                {/* Camera preview */}
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&h=600&fit=crop&crop=faces"
                      alt="ตัวอย่างกล้อง (รูปชั่วคราว)"
                      className="w-full h-full object-cover"
                    />
                    {/* camera active badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      กล้องกำลังทำงาน
                    </div>
                    {/* face frame corners */}
                    <div className="absolute inset-10">
                      <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
                      <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
                      <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
                      <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />
                    </div>
                    {/* face mesh dots (decorative) */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                      {[
                        [175, 90], [225, 90], [200, 120], [180, 150], [220, 150],
                        [160, 70], [240, 70], [200, 70], [190, 175], [210, 175],
                        [170, 200], [230, 200], [200, 210],
                      ].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="2" fill="#34d399" />
                      ))}
                      {[
                        [175, 90, 200, 70], [225, 90, 200, 70], [200, 120, 180, 150],
                        [200, 120, 220, 150], [160, 70, 175, 90], [240, 70, 225, 90],
                      ].map(([x1, y1, x2, y2], i) => (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="#34d399" strokeWidth="1" opacity="0.6"
                        />
                      ))}
                    </svg>
                  </div>

                  <div className="flex items-start gap-2 mt-3 bg-blue-50 text-blue-600 text-xs rounded-xl px-4 py-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    กรุณามองตรง ไม่สวมแว่นตา ไม่สวมหน้ากาก และอยู่ในที่แสงเพียงพอ
                  </div>
                </div>

                {/* Guidelines */}
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-3">คำแนะนำ</h4>
                  <div className="space-y-3">
                    {guidelines.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Icon className="w-4.5 h-4.5 text-blue-600" />
                        </div>
                        <span className="text-sm text-slate-600">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button className="order-2 sm:order-1 flex-1 sm:flex-initial px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                  ยกเลิก
                </button>
                <button className="order-1 sm:order-2 sm:ml-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-3 rounded-xl shadow-sm shadow-blue-200">
                  <Camera className="w-4 h-4" />
                  เริ่มบันทึกใบหน้า
                </button>
              </div>
            </div>

            {/* Side cards */}
            <div className="space-y-5">
              {/* Progress */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">ความคืบหน้า</h3>
                <div className="relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      strokeDashoffset={`${2 * Math.PI * 52}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">0%</span>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="text-sm font-semibold text-slate-700">ยังไม่ได้เริ่มต้น</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    กรุณาเริ่มบันทึกใบหน้า
                  </div>
                </div>
              </div>

              {/* Pose examples */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">
                  ตัวอย่างท่าทางที่ถูกต้อง
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {posePlaceholders.map((p) => (
                    <div key={p.label}>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                        <img src={p.src} alt={p.label} className="w-full h-full object-cover" />
                      </div>
                      <div
                        className={`flex items-center justify-center gap-1 mt-1.5 text-xs font-medium ${
                          p.good ? "text-emerald-600" : "text-slate-500"
                        }`}
                      >
                        {p.good && <Check className="w-3.5 h-3.5" />}
                        {p.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-300 mt-3 text-center">
                  * ตัวอย่างรูปชั่วคราว จะเปลี่ยนเป็นรูปจริงภายหลัง
                </p>
              </div>

              {/* Data security */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-2">
                  <Lock className="w-4 h-4" />
                  ความปลอดภัยของข้อมูล
                </div>
                <p className="text-xs text-blue-600/80 leading-relaxed">
                  ข้อมูลใบหน้าของคุณจะถูกเข้ารหัสและจัดเก็บอย่างปลอดภัย
                  ใช้สำหรับการเช็คชื่อเท่านั้น ไม่มีการนำไปใช้ในวัตถุประสงค์อื่น
                </p>
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