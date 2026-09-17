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
  FileSpreadsheet,
  FileText,
  FileJson,
  Table2,
  ListChecks,
  Trophy,
  UsersRound,
  CalendarRange,
  Layers,
  RefreshCcw,
  Clock3,
  CheckCheck,
  Loader2,
  Info,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/teacher-history" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "/teacher-report" },
  { icon: Award, label: "คะแนนเข้าเรียน", to: "/teacher-scores" },
  { icon: Users, label: "นักศึกษา", to: "/teacher-students" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "/teacher-export", active: true },
  { icon: User, label: "โปรไฟล์", to: "/teacher-profile" },
  { icon: Settings, label: "การตั้งค่า", to: "/teacher-settings" },
];

/* ---------- Mock data ---------- */

const dataTypes = [
  {
    id: "attendance",
    icon: ClipboardList,
    color: "blue",
    title: "ประวัติการเข้าเรียน",
    desc: "บันทึกการเข้าเรียน มาสาย และขาดเรียนรายครั้ง",
    fields: ["วันที่", "เวลาเช็คชื่อ", "รหัสนักศึกษา", "ชื่อ-สกุล", "รายวิชา", "สถานะ"],
    rows: 2845,
  },
  {
    id: "scores",
    icon: Trophy,
    color: "amber",
    title: "คะแนนเข้าเรียน",
    desc: "คะแนนสะสมและอัตราการเข้าเรียนต่อรายวิชา",
    fields: ["รหัสนักศึกษา", "ชื่อ-สกุล", "รายวิชา", "เข้าเรียน", "สาย", "ขาด", "คะแนนรวม"],
    rows: 142,
  },
  {
    id: "students",
    icon: UsersRound,
    color: "emerald",
    title: "รายชื่อนักศึกษา",
    desc: "ข้อมูลนักศึกษาและสถานะการลงทะเบียนใบหน้า",
    fields: ["รหัสนักศึกษา", "ชื่อ-สกุล", "กลุ่มเรียน", "อีเมล", "สถานะใบหน้า"],
    rows: 142,
  },
  {
    id: "summary",
    icon: Layers,
    color: "purple",
    title: "รายงานสรุปรายวิชา",
    desc: "ภาพรวมสถิติการเข้าเรียนแยกตามรายวิชา",
    fields: ["รายวิชา", "ภาคเรียน", "จำนวนนักศึกษา", "อัตราการเข้าเรียน"],
    rows: 5,
  },
];

const colorMap = {
  blue: { bg: "bg-blue-50", ring: "ring-blue-500", icon: "bg-blue-100 text-blue-600", text: "text-blue-600" },
  amber: { bg: "bg-amber-50", ring: "ring-amber-500", icon: "bg-amber-100 text-amber-600", text: "text-amber-600" },
  emerald: { bg: "bg-emerald-50", ring: "ring-emerald-500", icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-600" },
  purple: { bg: "bg-purple-50", ring: "ring-purple-500", icon: "bg-purple-100 text-purple-600", text: "text-purple-600" },
};

const courses = [
  { code: "CS-201", name: "Data Structures", count: 32 },
  { code: "CS-202", name: "OOP", count: 30 },
  { code: "CS-203", name: "Database Systems", count: 28 },
  { code: "CS-204", name: "AI Intro", count: 24 },
  { code: "CS-205", name: "Operating Systems", count: 14 },
];

const formats = [
  { id: "excel", icon: FileSpreadsheet, label: "Excel", ext: ".xlsx", color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-500" },
  { id: "csv", icon: Table2, label: "CSV", ext: ".csv", color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-500" },
  { id: "pdf", icon: FileText, label: "PDF", ext: ".pdf", color: "text-red-500", bg: "bg-red-50", ring: "ring-red-500" },
  { id: "json", icon: FileJson, label: "JSON", ext: ".json", color: "text-slate-600", bg: "bg-slate-100", ring: "ring-slate-400" },
];

const previewRowsByType = {
  attendance: [
    ["12 พ.ค. 2569", "08:58", "65011001", "นายสมชาย ใจดี", "CS-201", "เข้าเรียน"],
    ["12 พ.ค. 2569", "09:07", "65011006", "น.ส.พิมพ์ชนก แสงทอง", "CS-201", "มาสาย"],
    ["12 พ.ค. 2569", "—", "65011012", "นายภานุภา ทองดี", "CS-203", "ขาดเรียน"],
  ],
  scores: [
    ["65011001", "นายสมชาย ใจดี", "CS-201", "14", "1", "1", "8.75"],
    ["65011006", "น.ส.พิมพ์ชนก แสงทอง", "CS-201", "10", "4", "2", "7.20"],
    ["65011012", "นายภานุภา ทองดี", "CS-203", "9", "2", "5", "5.10"],
  ],
  students: [
    ["65011001", "นายสมชาย ใจดี", "กลุ่ม A", "somchai.j@stu.ac.th", "ลงทะเบียนแล้ว"],
    ["65011006", "น.ส.พิมพ์ชนก แสงทอง", "กลุ่ม A", "pimchanok.s@stu.ac.th", "ลงทะเบียนแล้ว"],
    ["65011012", "นายภานุภา ทองดี", "กลุ่ม B", "phanupha.t@stu.ac.th", "รอลงทะเบียน"],
  ],
  summary: [
    ["CS-201 Data Structures", "1/2567", "32", "87.5%"],
    ["CS-202 OOP", "1/2567", "30", "86.7%"],
    ["CS-203 Database Systems", "1/2567", "28", "78.6%"],
  ],
};

const exportHistory = [
  {
    id: 1,
    name: "ประวัติการเข้าเรียน_CS-201_พ.ค.2569.xlsx",
    type: "ประวัติการเข้าเรียน",
    format: "excel",
    date: "20 พ.ค. 2569 · 14:32",
    size: "184 KB",
    status: "done",
  },
  {
    id: 2,
    name: "คะแนนเข้าเรียน_ทุกวิชา.pdf",
    type: "คะแนนเข้าเรียน",
    format: "pdf",
    date: "18 พ.ค. 2569 · 09:05",
    size: "402 KB",
    status: "done",
  },
  {
    id: 3,
    name: "รายชื่อนักศึกษา_กลุ่ม-A.csv",
    type: "รายชื่อนักศึกษา",
    format: "csv",
    date: "15 พ.ค. 2569 · 16:47",
    size: "21 KB",
    status: "done",
  },
  {
    id: 4,
    name: "รายงานสรุปรายวิชา_1-2567.xlsx",
    type: "รายงานสรุปรายวิชา",
    format: "excel",
    date: "10 พ.ค. 2569 · 11:20",
    size: "96 KB",
    status: "done",
  },
];

const formatIconFor = (fmt) => formats.find((f) => f.id === fmt) || formats[0];

export default function TeacherExportData() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedType, setSelectedType] = useState("attendance");
  const [selectedCourses, setSelectedCourses] = useState(["CS-201", "CS-202", "CS-203", "CS-204", "CS-205"]);
  const [dateFrom, setDateFrom] = useState("2569-05-01");
  const [dateTo, setDateTo] = useState("2569-05-20");
  const [selectedFormat, setSelectedFormat] = useState("excel");
  const [status, setStatus] = useState("idle"); // idle | working | done
  const [history, setHistory] = useState(exportHistory);

  const activeType = dataTypes.find((d) => d.id === selectedType);
  const activeFormat = formats.find((f) => f.id === selectedFormat);

  const estimatedRows = useMemo(() => {
    if (selectedType === "summary") return selectedCourses.length;
    const perCourse = activeType.rows / courses.length;
    return Math.max(1, Math.round(perCourse * selectedCourses.length));
  }, [selectedType, selectedCourses, activeType]);

  function toggleCourse(code) {
    setSelectedCourses((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  function toggleAllCourses() {
    setSelectedCourses((prev) => (prev.length === courses.length ? [] : courses.map((c) => c.code)));
  }

  function handleExport() {
    if (status === "working") return;
    setStatus("working");
    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        name: `${activeType.title.replace(/\s+/g, "")}_${selectedCourses.length === courses.length ? "ทุกวิชา" : selectedCourses.join("-")}${activeFormat.ext}`,
        type: activeType.title,
        format: selectedFormat,
        date: "เมื่อสักครู่",
        size: `${Math.max(12, Math.round(estimatedRows * 0.4))} KB`,
        status: "done",
      };
      setHistory((prev) => [newFile, ...prev]);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    }, 1400);
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
              <Download className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">ส่งออกข้อมูล</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              เลือกประเภทข้อมูล ตัวกรอง และรูปแบบไฟล์ที่ต้องการส่งออก
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
              <div className="text-xs text-slate-400 whitespace-nowrap">อาจารย์</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            {/* ---------- Left column: steps + preview ---------- */}
            <div className="space-y-6 min-w-0">
              {/* Step 1: data type */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <StepHeader step={1} title="เลือกประเภทข้อมูล" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dataTypes.map((d) => {
                    const c = colorMap[d.color];
                    const isActive = selectedType === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedType(d.id)}
                        className={`text-left rounded-2xl border p-4 transition-all ${
                          isActive
                            ? `border-transparent ring-2 ${c.ring} ${c.bg}`
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                            <d.icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900">{d.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{d.desc}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: filters */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <StepHeader step={2} title="ตัวกรองข้อมูล" />

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      รายวิชา
                    </div>
                    <button
                      onClick={toggleAllCourses}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      {selectedCourses.length === courses.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courses.map((c) => {
                      const checked = selectedCourses.includes(c.code);
                      return (
                        <button
                          key={c.code}
                          onClick={() => toggleCourse(c.code)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
                            checked
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              checked ? "bg-blue-600 border-blue-600" : "border-slate-300"
                            }`}
                          >
                            {checked && <CheckCheck className="w-3 h-3 text-white" />}
                          </span>
                          {c.code}
                          <span className="text-xs text-slate-400 font-normal">({c.name})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedType !== "students" && selectedType !== "summary" && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-2.5">
                      <CalendarRange className="w-4 h-4 text-slate-400" />
                      ช่วงวันที่
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="text-slate-400 text-sm">ถึง</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: format */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <StepHeader step={3} title="รูปแบบไฟล์" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formats.map((f) => {
                    const isActive = selectedFormat === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFormat(f.id)}
                        className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                          isActive ? `border-transparent ring-2 ${f.ring} ${f.bg}` : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <f.icon className={`w-7 h-7 ${f.color}`} />
                        <div className="text-sm font-bold text-slate-800">{f.label}</div>
                        <div className="text-[11px] text-slate-400">{f.ext}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-slate-700" />
                    <h3 className="font-bold text-slate-900">ตัวอย่างข้อมูลที่จะส่งออก</h3>
                  </div>
                  <span className="text-xs text-slate-400">แสดงตัวอย่าง 3 แถวแรก</span>
                </div>
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                      {activeType.fields.map((f) => (
                        <th key={f} className="py-2 pr-3 font-medium whitespace-nowrap">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRowsByType[selectedType].map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="py-3 pr-3 text-slate-600 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---------- Right column: summary + history ---------- */}
            <div className="space-y-6 xl:sticky xl:top-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">สรุปรายการส่งออก</h3>

                <div className="space-y-3 text-sm">
                  <SummaryRow label="ประเภทข้อมูล" value={activeType.title} />
                  <SummaryRow
                    label="รายวิชาที่เลือก"
                    value={selectedCourses.length === courses.length ? "ทุกรายวิชา" : `${selectedCourses.length} วิชา`}
                  />
                  {selectedType !== "students" && selectedType !== "summary" && (
                    <SummaryRow label="ช่วงวันที่" value={`${dateFrom} — ${dateTo}`} />
                  )}
                  <SummaryRow label="รูปแบบไฟล์" value={`${activeFormat.label} (${activeFormat.ext})`} />
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500">จำนวนรายการโดยประมาณ</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {estimatedRows.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleExport}
                  disabled={selectedCourses.length === 0 || status === "working"}
                  className={`mt-5 w-full flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-3.5 rounded-xl shadow-sm transition-colors ${
                    selectedCourses.length === 0
                      ? "bg-slate-300 cursor-not-allowed"
                      : status === "working"
                      ? "bg-blue-400"
                      : status === "done"
                      ? "bg-emerald-500"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                  }`}
                >
                  {status === "working" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      กำลังสร้างไฟล์...
                    </>
                  ) : status === "done" ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      ส่งออกสำเร็จ
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      ส่งออกข้อมูล
                    </>
                  )}
                </button>

                {selectedCourses.length === 0 && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2.5">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    กรุณาเลือกอย่างน้อย 1 รายวิชาก่อนส่งออก
                  </div>
                )}
              </div>

              {/* History */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-slate-700" />
                    <h3 className="font-bold text-slate-900">ประวัติการส่งออก</h3>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {history.map((h) => {
                    const fIcon = formatIconFor(h.format);
                    return (
                      <div key={h.id} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fIcon.bg}`}>
                          <fIcon.icon className={`w-5 h-5 ${fIcon.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-800 truncate">{h.name}</div>
                          <div className="text-xs text-slate-400">
                            {h.type} · {h.date} · {h.size}
                          </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-600 hover:underline shrink-0">
                          ดาวน์โหลด
                        </button>
                      </div>
                    );
                  })}
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

function StepHeader({ step, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {step}
      </span>
      <h3 className="font-bold text-slate-900">{title}</h3>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}
