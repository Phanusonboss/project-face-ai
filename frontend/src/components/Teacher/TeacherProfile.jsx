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
  Camera,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Save,
  Pencil,
  X,
  Trophy,
  UsersRound,
  BookMarked,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/teacher-history" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "/teacher-report" },
  { icon: Award, label: "คะแนนเข้าเรียน", to: "/teacher-scores" },
  { icon: Users, label: "นักศึกษา", to: "/teacher-students" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "/teacher-export" },
  { icon: User, label: "โปรไฟล์", to: "/teacher-profile", active: true },
  { icon: Settings, label: "การตั้งค่า", to: "/teacher-settings" },
];

const stats = [
  { icon: BookMarked, label: "รายวิชาที่สอน", value: "5", color: "text-blue-600", bg: "bg-blue-100" },
  { icon: UsersRound, label: "นักศึกษาทั้งหมด", value: "142", color: "text-emerald-600", bg: "bg-emerald-100" },
  { icon: Trophy, label: "ปีที่สอน", value: "8", color: "text-amber-500", bg: "bg-amber-100" },
];

const teachingCourses = [
  { code: "CS-201", name: "โครงสร้างข้อมูล (Data Structures)", term: "1/2567", students: 32, color: "bg-blue-100 text-blue-600" },
  { code: "CS-202", name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)", term: "1/2567", students: 30, color: "bg-purple-100 text-purple-600" },
  { code: "CS-203", name: "ฐานข้อมูล (Database Systems)", term: "1/2567", students: 28, color: "bg-orange-100 text-orange-500" },
  { code: "CS-204", name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)", term: "1/2567", students: 24, color: "bg-teal-100 text-teal-600" },
  { code: "CS-205", name: "ระบบปฏิบัติการ (Operating Systems)", term: "1/2567", students: 14, color: "bg-rose-100 text-rose-500" },
];

const tabs = [
  { id: "info", label: "ข้อมูลส่วนตัว" },
  { id: "security", label: "ความปลอดภัย" },
  { id: "courses", label: "รายวิชาที่สอน" },
];

export default function TeacherProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    firstName: "ณัฐวุฒิ",
    lastName: "ประเสริฐกุล",
    title: "อาจารย์ประจำภาควิชาวิทยาการคอมพิวเตอร์",
    department: "คณะวิทยาศาสตร์และเทคโนโลยี",
    email: "nattawut.p@university.ac.th",
    phone: "081-234-5678",
    office: "อาคาร 5 ห้อง 512",
    bio: "สอนวิชาด้านโครงสร้างข้อมูล ปัญญาประดิษฐ์ และวิศวกรรมซอฟต์แวร์ สนใจงานวิจัยด้าน Computer Vision และระบบจดจำใบหน้า",
  });

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setEditing(false);
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
              <User className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">โปรไฟล์</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชี</p>
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
              <div className="text-xs text-slate-400 whitespace-nowrap">อาจารย์</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 items-start">
            {/* ---------- Left: profile card ---------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center xl:sticky xl:top-6">
              <div className="relative w-28 h-28 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces"
                  alt="รูปโปรไฟล์"
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-50"
                />
                <button
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center ring-4 ring-white"
                  aria-label="เปลี่ยนรูปโปรไฟล์"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="mt-4">
                <div className="text-lg font-bold text-slate-900">
                  อาจารย์{form.firstName} {form.lastName}
                </div>
                <div className="text-sm text-slate-400 mt-0.5">{form.title}</div>
              </div>

              <div className="mt-5 space-y-2.5 text-left">
                <InfoLine icon={Mail} value={form.email} />
                <InfoLine icon={Phone} value={form.phone} />
                <InfoLine icon={MapPin} value={form.office} />
                <InfoLine icon={CalendarDays} value="เข้าร่วมระบบตั้งแต่ มิ.ย. 2561" />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-1.5 ${s.bg}`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div className="text-base font-bold text-slate-900">{s.value}</div>
                    <div className="text-[11px] text-slate-400 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- Right: tabs content ---------- */}
            <div className="min-w-0 space-y-5">
              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex flex-wrap gap-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      activeTab === t.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {saved && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4" />
                  บันทึกข้อมูลเรียบร้อยแล้ว
                </div>
              )}

              {/* ---- Tab: ข้อมูลส่วนตัว ---- */}
              {activeTab === "info" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-900">ข้อมูลส่วนตัว</h3>
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        แก้ไข
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                        ยกเลิก
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="ชื่อ" value={form.firstName} editing={editing} onChange={(v) => updateField("firstName", v)} />
                    <Field label="นามสกุล" value={form.lastName} editing={editing} onChange={(v) => updateField("lastName", v)} />
                    <Field
                      label="ตำแหน่ง"
                      value={form.title}
                      editing={editing}
                      onChange={(v) => updateField("title", v)}
                      full
                    />
                    <Field
                      label="ภาควิชา/คณะ"
                      value={form.department}
                      editing={editing}
                      onChange={(v) => updateField("department", v)}
                      full
                    />
                    <Field
                      label="อีเมล"
                      value={form.email}
                      editing={editing}
                      onChange={(v) => updateField("email", v)}
                      icon={Mail}
                    />
                    <Field
                      label="เบอร์โทรศัพท์"
                      value={form.phone}
                      editing={editing}
                      onChange={(v) => updateField("phone", v)}
                      icon={Phone}
                    />
                    <Field
                      label="ห้องทำงาน"
                      value={form.office}
                      editing={editing}
                      onChange={(v) => updateField("office", v)}
                      icon={MapPin}
                      full
                    />
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">เกี่ยวกับฉัน</label>
                      {editing ? (
                        <textarea
                          value={form.bio}
                          onChange={(e) => updateField("bio", e.target.value)}
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                        />
                      ) : (
                        <p className="text-sm text-slate-600 leading-relaxed">{form.bio}</p>
                      )}
                    </div>
                  </div>

                  {editing && (
                    <button
                      onClick={handleSave}
                      className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-100"
                    >
                      <Save className="w-4 h-4" />
                      บันทึกการเปลี่ยนแปลง
                    </button>
                  )}
                </div>
              )}

              {/* ---- Tab: ความปลอดภัย ---- */}
              {activeTab === "security" && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Lock className="w-5 h-5 text-slate-700" />
                      <h3 className="font-bold text-slate-900">เปลี่ยนรหัสผ่าน</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">รหัสผ่านปัจจุบัน</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                          <button
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            type="button"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">รหัสผ่านใหม่</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">ยืนยันรหัสผ่านใหม่</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSave}
                      className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-100"
                    >
                      <Save className="w-4 h-4" />
                      อัปเดตรหัสผ่าน
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">ยืนยันตัวตนสองขั้นตอน (2FA)</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            เพิ่มความปลอดภัยด้วยรหัส OTP ทาง SMS ทุกครั้งที่เข้าสู่ระบบ
                          </div>
                        </div>
                      </div>
                      <ToggleSwitch defaultChecked={false} />
                    </div>
                  </div>
                </div>
              )}

              {/* ---- Tab: รายวิชาที่สอน ---- */}
              {activeTab === "courses" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <GraduationCap className="w-5 h-5 text-slate-700" />
                    <h3 className="font-bold text-slate-900">รายวิชาที่สอนในภาคเรียนนี้</h3>
                  </div>
                  <div className="space-y-3">
                    {teachingCourses.map((c) => (
                      <div
                        key={c.code}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <span
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${c.color}`}
                        >
                          {c.code.split("-")[1]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-800 truncate">{c.name}</div>
                          <div className="text-xs text-slate-400">
                            {c.code} · ภาคเรียน {c.term}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 shrink-0">
                          <Users className="w-4 h-4 text-slate-400" />
                          {c.students} คน
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

function InfoLine({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-600">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function Field({ label, value, editing, onChange, icon: Icon, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">{label}</label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      ) : (
        <div className="flex items-center gap-2 text-sm text-slate-800 font-medium px-0.5 py-2.5">
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  );
}

export function ToggleSwitch({ defaultChecked = false, onChange }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => {
        setChecked((v) => {
          const next = !v;
          onChange && onChange(next);
          return next;
        });
      }}
      className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
        checked ? "bg-blue-600" : "bg-slate-200"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}
