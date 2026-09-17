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
  Settings as SettingsIcon,
  LogOut,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Award,
  BellRing,
  Palette,
  Lock,
  Globe,
  Type,
  Sun,
  Moon,
  Laptop,
  Save,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";
import { ToggleSwitch } from "./TeacherProfile";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/teacher-history" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "/teacher-report" },
  { icon: Award, label: "คะแนนเข้าเรียน", to: "/teacher-scores" },
  { icon: Users, label: "นักศึกษา", to: "/teacher-students" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "/teacher-export" },
  { icon: User, label: "โปรไฟล์", to: "/teacher-profile" },
  {
    icon: SettingsIcon,
    label: "การตั้งค่า",
    to: "/teacher-settings",
    active: true,
  },
];

const themeOptions = [
  { id: "light", icon: Sun, label: "โหมดสว่าง" },
  { id: "dark", icon: Moon, label: "โหมดมืด" },
  { id: "system", icon: Laptop, label: "ตามระบบ" },
];

export default function TeacherSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  const [notif, setNotif] = useState({
    email: true,
    absentStreak: true,
    dailySummary: false,
    newRegistration: true,
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("th");
  const [fontSize, setFontSize] = useState("normal");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

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
              <SettingsIcon className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">การตั้งค่า</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ปรับแต่งการแจ้งเตือน การแสดงผล และความเป็นส่วนตัว
            </p>
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
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {saved && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4" />
              บันทึกการตั้งค่าเรียบร้อยแล้ว
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ---- Notifications ---- */}
            <SectionCard icon={BellRing} title="การแจ้งเตือน" color="blue">
              <ToggleRow
                title="แจ้งเตือนทางอีเมล"
                desc="รับสรุปและการแจ้งเตือนสำคัญทางอีเมล"
                checked={notif.email}
                onChange={(v) => setNotif((p) => ({ ...p, email: v }))}
              />
              <ToggleRow
                title="ขาดเรียนติดต่อกัน"
                desc="แจ้งเตือนเมื่อนักศึกษาขาดเรียนติดต่อกันตั้งแต่ 3 ครั้งขึ้นไป"
                checked={notif.absentStreak}
                onChange={(v) => setNotif((p) => ({ ...p, absentStreak: v }))}
              />
              <ToggleRow
                title="สรุปรายวันท้ายวัน"
                desc="ส่งสรุปยอดเช็คชื่อของทุกวิชาเมื่อสิ้นวัน"
                checked={notif.dailySummary}
                onChange={(v) => setNotif((p) => ({ ...p, dailySummary: v }))}
              />
              <ToggleRow
                title="มีการลงทะเบียนใบหน้าใหม่"
                desc="แจ้งเตือนเมื่อนักศึกษาลงทะเบียนหรืออัปเดตข้อมูลใบหน้า"
                checked={notif.newRegistration}
                onChange={(v) =>
                  setNotif((p) => ({ ...p, newRegistration: v }))
                }
                last
              />
            </SectionCard>

            {/* ---- Display & language ---- */}
            <SectionCard icon={Palette} title="การแสดงผลและภาษา" color="purple">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                  ธีม
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                        theme === t.id
                          ? "border-transparent ring-2 ring-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <t.icon className="w-5 h-5 text-slate-600" />
                      <span className="text-xs font-medium text-slate-700">
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  ภาษา
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="th">ภาษาไทย</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-slate-400" />
                  ขนาดตัวอักษร
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "small", label: "เล็ก" },
                    { id: "normal", label: "ปกติ" },
                    { id: "large", label: "ใหญ่" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontSize(f.id)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                        fontSize === f.id
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* ---- Privacy & data ---- */}
            <SectionCard
              icon={Lock}
              title="ความเป็นส่วนตัวและข้อมูล"
              color="rose"
            >
              <p className="text-xs text-slate-500 leading-relaxed">
                ข้อมูลบัญชีของคุณ เช่น ข้อมูลส่วนตัว รายวิชาที่สอน
                และประวัติกิจกรรมในระบบ
                สามารถดาวน์โหลดเก็บไว้เป็นไฟล์สำรองได้ที่นี่
              </p>
              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl">
                <Download className="w-4 h-4" />
                ดาวน์โหลดข้อมูลบัญชีของฉัน
              </button>
            </SectionCard>
          </div>

          {/* Sticky save bar */}
          <div className="sticky bottom-4 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-200"
            >
              <Save className="w-4 h-4" />
              บันทึกการตั้งค่าทั้งหมด
            </button>
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

function SectionCard({ icon: Icon, title, color, children }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange, last }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 ${!last ? "border-b border-slate-100" : ""}`}
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
          {desc}
        </div>
      </div>
      <ToggleSwitch defaultChecked={checked} onChange={onChange} />
    </div>
  );
}
