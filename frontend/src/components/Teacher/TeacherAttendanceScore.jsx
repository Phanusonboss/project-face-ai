import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  History,
  ClipboardList,
  Award,
  Users,
  Download,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Search,
  RotateCcw,
  SlidersHorizontal,
  FileSpreadsheet,
  FileText,
  Save,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Info,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import logoImg from "../../assets/logo-cs.png";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", to: "/teacher-dashboard" },
  { icon: BookOpen, label: "รายวิชาของฉัน", to: "/teacher-courses" },
  { icon: History, label: "ประวัติการเช็คชื่อ", to: "/teacher-history" },
  { icon: ClipboardList, label: "รายงานการเข้าเรียน", to: "/teacher-report" },
  { icon: Award, label: "คะแนนเข้าเรียน", to: "/teacher-scores", active: true },
  { icon: Users, label: "นักศึกษา", to: "/teacher-students" },
  { icon: Download, label: "ส่งออกข้อมูล", to: "/teacher-export" },
  { icon: User, label: "โปรไฟล์", to: "/teacher-profile" },
  { icon: Settings, label: "การตั้งค่า", to: "/teacher-settings" },
];

const courseOptions = [
  { code: "CS-201", name: "โครงสร้างข้อมูล (Data Structures)" },
  { code: "CS-202", name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)" },
  { code: "CS-203", name: "ฐานข้อมูล (Database Systems)" },
  { code: "CS-204", name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)" },
  { code: "CS-205", name: "ระบบปฏิบัติการ (Operating Systems)" },
];

// จำนวนครั้งเช็คชื่อของข้อมูลตัวอย่าง (ใช้เป็นค่าเริ่มต้นของ "จำนวนครั้งเช็คชื่อทั้งหมด" ในแต่ละวิชา — ปรับได้ทีหลัง)
const sampleSessionCount = 16;

// lateRecords = นาทีที่มาสายของแต่ละครั้งที่มาสาย (ใช้คำนวณกับเงื่อนไขแบบขั้นบันได)
const baseStudents = [
  {
    code: "65011001",
    name: "นายธนภัทร ใจดี",
    year: 3,
    present: 14,
    lateRecords: [7],
    absent: 1,
    note: "",
  },
  {
    code: "65011002",
    name: "นางสาวกานต์ธิชา สุขสวัสดิ์",
    year: 3,
    present: 16,
    lateRecords: [],
    absent: 0,
    note: "",
  },
  {
    code: "65011003",
    name: "นายศุภกฤต เสริมศรี",
    year: 3,
    present: 13,
    lateRecords: [12, 4],
    absent: 1,
    note: "",
  },
  {
    code: "65011004",
    name: "นางสาวพิมพ์ชนก วงศ์สมบัติ",
    year: 3,
    present: 10,
    lateRecords: [15, 20, 6],
    absent: 3,
    note: "",
  },
  {
    code: "65011005",
    name: "นายกิตติพงษ์ แสงทอง",
    year: 2,
    present: 15,
    lateRecords: [3],
    absent: 0,
    note: "",
  },
  {
    code: "65011006",
    name: "นางสาววรินทร์พร แก้วใส",
    year: 2,
    present: 8,
    lateRecords: [8, 25],
    absent: 6,
    note: "รอเอกสารใบรับรองแพทย์",
  },
  {
    code: "65011007",
    name: "นายภูมิพัฒน์ สายเนตร",
    year: 1,
    present: 14,
    lateRecords: [],
    absent: 2,
    note: "",
  },
  {
    code: "65011008",
    name: "นางสาวภัทรวดี กันหา",
    year: 1,
    present: 16,
    lateRecords: [],
    absent: 0,
    note: "",
  },
  {
    code: "65011009",
    name: "นายณัฐวุฒิ จันทร์ศรี",
    year: 4,
    present: 12,
    lateRecords: [10, 5],
    absent: 2,
    note: "",
  },
  {
    code: "65011010",
    name: "นางสาวอรปรียา ทองมาก",
    year: 4,
    present: 15,
    lateRecords: [],
    absent: 1,
    note: "",
  },
];

// เงื่อนไขเริ่มต้น: มาสายตั้งแต่ 5 นาที หัก 1 คะแนน, ตั้งแต่ 10 นาที หัก 2 คะแนน, ตั้งแต่ 20 นาที หัก 3 คะแนน
// (ครูปรับ/เพิ่ม/ลบเงื่อนไขได้อิสระ แยกเป็นรายวิชา)
function defaultLateTiers() {
  return [
    { id: "tier-1", minMinutes: 5, deduction: 1 },
    { id: "tier-2", minMinutes: 10, deduction: 2 },
    { id: "tier-3", minMinutes: 20, deduction: 3 },
  ];
}

// mode "direct"     = กำหนดคะแนนเต็มรวมโดยตรง (เช่น เต็ม 10) แล้วหักคะแนนตรงในสเกลนี้เลย
// mode "perSession"  = กำหนดคะแนนเต็มต่อครั้ง (เช่น ครั้งละ 10 × 20 ครั้ง = ดิบ 200) แล้วแปลงสัดส่วนกลับมาเป็นคะแนนเต็มที่ใช้เข้าเกรด
function defaultRule() {
  return {
    mode: "direct",
    full: 10,
    sessionCount: sampleSessionCount,
    sessionFull: 10,
    passThreshold: 5,
    lateTiers: defaultLateTiers(),
  };
}

function makeInitialRuleByCourse() {
  const map = {};
  courseOptions.forEach((c) => {
    map[c.code] = defaultRule();
  });
  return map;
}

// หาขั้นที่ตรงกับจำนวนนาทีที่สาย (ใช้ threshold สูงสุดที่ <= นาทีที่สาย)
function latePenaltyFor(minutes, lateTiers) {
  const applicable = [...lateTiers]
    .filter((t) => minutes >= t.minMinutes)
    .sort((a, b) => b.minMinutes - a.minMinutes)[0];
  return applicable ? applicable.deduction : 0;
}

// โหมด "direct": คะแนนที่หักต่อครั้งที่ขาด = คะแนนเต็ม ÷ จำนวนครั้งเช็คชื่อ (ขาดครั้งนั้นจึงได้ 0 คะแนนเสมอ)
function directAbsentDeduction(rule) {
  return rule.sessionCount ? rule.full / rule.sessionCount : 0;
}

function computeScoreDirect(student, rule) {
  const latePenalty = (student.lateRecords || []).reduce(
    (sum, m) => sum + latePenaltyFor(m, rule.lateTiers),
    0,
  );
  const absentPenalty = student.absent * directAbsentDeduction(rule);
  const raw = rule.full - latePenalty - absentPenalty;
  return Math.max(0, Math.round(Math.min(rule.full, raw) * 100) / 100);
}

// โหมด "perSession": แต่ละครั้งมีคะแนนเต็มของตัวเอง (sessionFull) รวมทุกครั้งเป็นคะแนนดิบ
// (เช่น ครั้งละ 10 × 20 ครั้ง = ดิบ 200) แล้วแปลงสัดส่วนกลับมาเป็น "คะแนนเต็ม" ที่ใช้เข้าเกรดจริง
function computeScorePerSession(student, rule) {
  const rawMax = rule.sessionFull * rule.sessionCount;
  if (!rawMax) return 0;

  const presentRaw = student.present * rule.sessionFull;
  const lateRaw = (student.lateRecords || []).reduce((sum, m) => {
    const penalty = latePenaltyFor(m, rule.lateTiers);
    return sum + Math.max(0, rule.sessionFull - penalty);
  }, 0);
  // ขาดเรียน = ได้ 0 คะแนนดิบของครั้งนั้นเสมอ ไม่ต้องตั้งค่าเอง
  const rawScore = presentRaw + lateRaw;

  const normalized = (rawScore / rawMax) * rule.full;
  return Math.max(0, Math.round(Math.min(rule.full, normalized) * 100) / 100);
}

function computeScore(student, rule) {
  return rule.mode === "perSession"
    ? computeScorePerSession(student, rule)
    : computeScoreDirect(student, rule);
}

function makeInitialScoresByCourse(ruleByCourse) {
  const map = {};
  courseOptions.forEach((c) => {
    map[c.code] = baseStudents.map((s) => ({
      code: s.code,
      score: computeScore(s, ruleByCourse[c.code]),
      note: s.note || "",
    }));
  });
  return map;
}

let tierIdCounter = 100;

export default function TeacherAttendanceScore() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState(courseOptions[0]);
  const [ruleByCourse, setRuleByCourse] = useState(makeInitialRuleByCourse);
  const [scoresByCourse, setScoresByCourse] = useState(() =>
    makeInitialScoresByCourse(makeInitialRuleByCourse()),
  );
  const [savedAt, setSavedAt] = useState(null);

  const rule = ruleByCourse[course.code];

  const students = useMemo(() => {
    const scoreMap = new Map(
      scoresByCourse[course.code].map((s) => [s.code, s]),
    );
    return baseStudents.map((s) => ({ ...s, ...scoreMap.get(s.code) }));
  }, [course, scoresByCourse]);

  const handleRuleField = (field, value) => {
    const num = value === "" ? 0 : parseFloat(value);
    setRuleByCourse((prev) => ({
      ...prev,
      [course.code]: {
        ...prev[course.code],
        [field]: Number.isNaN(num) ? prev[course.code][field] : num,
      },
    }));
  };

  const handleModeChange = (mode) => {
    setRuleByCourse((prev) => ({
      ...prev,
      [course.code]: { ...prev[course.code], mode },
    }));
  };

  const handleTierField = (tierId, field, value) => {
    const num = value === "" ? 0 : parseFloat(value);
    setRuleByCourse((prev) => ({
      ...prev,
      [course.code]: {
        ...prev[course.code],
        lateTiers: prev[course.code].lateTiers.map((t) =>
          t.id === tierId
            ? { ...t, [field]: Number.isNaN(num) ? t[field] : num }
            : t,
        ),
      },
    }));
  };

  const addTier = () => {
    tierIdCounter += 1;
    setRuleByCourse((prev) => ({
      ...prev,
      [course.code]: {
        ...prev[course.code],
        lateTiers: [
          ...prev[course.code].lateTiers,
          { id: `tier-${tierIdCounter}`, minMinutes: 5, deduction: 1 },
        ],
      },
    }));
  };

  const removeTier = (tierId) => {
    setRuleByCourse((prev) => ({
      ...prev,
      [course.code]: {
        ...prev[course.code],
        lateTiers: prev[course.code].lateTiers.filter((t) => t.id !== tierId),
      },
    }));
  };

  const recalcAll = () => {
    setScoresByCourse((prev) => ({
      ...prev,
      [course.code]: baseStudents.map((s) => ({
        code: s.code,
        score: computeScore(s, rule),
        note: prev[course.code].find((x) => x.code === s.code)?.note || "",
      })),
    }));
    setSavedAt(null);
  };

  const handleScoreChange = (code, value) => {
    const num = value === "" ? 0 : parseFloat(value);
    setScoresByCourse((prev) => ({
      ...prev,
      [course.code]: prev[course.code].map((s) =>
        s.code === code
          ? { ...s, score: Number.isNaN(num) ? s.score : num }
          : s,
      ),
    }));
    setSavedAt(null);
  };

  const handleNoteChange = (code, value) => {
    setScoresByCourse((prev) => ({
      ...prev,
      [course.code]: prev[course.code].map((s) =>
        s.code === code ? { ...s, note: value } : s,
      ),
    }));
  };

  const handleSaveAll = () => {
    setSavedAt(
      new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  const sortedTiers = useMemo(
    () => [...rule.lateTiers].sort((a, b) => a.minMinutes - b.minMinutes),
    [rule.lateTiers],
  );

  const stats = useMemo(() => {
    const total = students.length;
    const avg = total
      ? students.reduce((sum, s) => sum + s.score, 0) / total
      : 0;
    const fullCount = students.filter((s) => s.score >= rule.full).length;
    const lowCount = students.filter(
      (s) => s.score < rule.passThreshold,
    ).length;
    return { total, avg, fullCount, lowCount };
  }, [students, rule]);

  const distribution = useMemo(() => {
    const buckets = [
      { key: "90-100", label: "90-100%", color: "#22c55e", count: 0 },
      { key: "70-89", label: "70-89%", color: "#3b82f6", count: 0 },
      { key: "50-69", label: "50-69%", color: "#f59e0b", count: 0 },
      { key: "below50", label: "ต่ำกว่า 50%", color: "#ef4444", count: 0 },
    ];
    students.forEach((s) => {
      const pct = rule.full ? (s.score / rule.full) * 100 : 0;
      if (pct >= 90) buckets[0].count += 1;
      else if (pct >= 70) buckets[1].count += 1;
      else if (pct >= 50) buckets[2].count += 1;
      else buckets[3].count += 1;
    });
    return buckets;
  }, [students, rule]);

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
              <Award className="w-5 h-5 text-slate-700" />
              <h1 className="text-lg font-bold text-slate-900">
                คะแนนเข้าเรียน
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              คำนวณและจัดการคะแนนเก็บจากการเข้าเรียนของนักศึกษาในแต่ละรายวิชา
            </p>
          </div>

          <div className="flex-1" />

          <div className="relative hidden sm:block shrink-0">
            <select
              value={course.code}
              onChange={(e) =>
                setCourse(
                  courseOptions.find((c) => c.code === e.target.value) ||
                    courseOptions[0],
                )
              }
              className="appearance-none border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            >
              {courseOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

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
          {/* Mobile course select */}
          <div className="sm:hidden">
            <select
              value={course.code}
              onChange={(e) =>
                setCourse(
                  courseOptions.find((c) => c.code === e.target.value) ||
                    courseOptions[0],
                )
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {courseOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Scoring rule card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">
                  เกณฑ์การให้คะแนนเข้าเรียน{" "}
                  <span className="text-slate-400 font-medium text-sm">
                    — เฉพาะวิชา {course.code}
                  </span>
                </h3>
              </div>
              <button
                onClick={recalcAll}
                className="flex items-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-semibold px-4 py-2 rounded-xl"
              >
                <RefreshCw className="w-4 h-4" />
                คำนวณคะแนนใหม่ทั้งหมด
              </button>
            </div>

            {/* Calculation mode switch */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => handleModeChange("direct")}
                className={`text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${
                  rule.mode === "direct"
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                คำนวณจากคะแนนเต็มรวม
              </button>
              <button
                onClick={() => handleModeChange("perSession")}
                className={`text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${
                  rule.mode === "perSession"
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                คำนวณจากคะแนนต่อครั้ง
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <RuleField
                label="จำนวนครั้งเช็คชื่อทั้งหมด"
                value={rule.sessionCount}
                onChange={(v) => handleRuleField("sessionCount", v)}
                suffix="ครั้ง"
              />
              {rule.mode === "perSession" && (
                <RuleField
                  label="คะแนนเต็มต่อครั้ง"
                  value={rule.sessionFull}
                  onChange={(v) => handleRuleField("sessionFull", v)}
                  suffix="คะแนน/ครั้ง (ดิบ)"
                />
              )}
              <RuleField
                label="คะแนนเต็มที่ใช้เข้าเกรด"
                value={rule.full}
                onChange={(v) => handleRuleField("full", v)}
                suffix="คะแนน"
              />
              <RuleField
                label="เกณฑ์ผ่านขั้นต่ำ"
                value={rule.passThreshold}
                onChange={(v) => handleRuleField("passThreshold", v)}
                suffix="คะแนน"
              />
            </div>

            {rule.mode === "perSession" && (
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs bg-blue-50 text-blue-700 rounded-xl px-4 py-2.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  คะแนนรวมดิบ = {rule.sessionFull} × {rule.sessionCount} ={" "}
                  <strong>
                    {(rule.sessionFull * rule.sessionCount).toLocaleString()}{" "}
                    คะแนน
                  </strong>{" "}
                  — ระบบจะแปลงสัดส่วนกลับมาเป็นคะแนนเต็ม {rule.full}{" "}
                  คะแนนให้อัตโนมัติตอนคำนวณ
                </span>
              </div>
            )}

            <div className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-2.5">
              <strong className="text-red-500 font-semibold">
                หักเมื่อขาดเรียน:
              </strong>{" "}
              {rule.mode === "perSession" ? (
                <>
                  ได้ 0 คะแนนดิบของครั้งนั้นโดยอัตโนมัติ (จากเต็ม{" "}
                  {rule.sessionFull} คะแนน/ครั้ง)
                </>
              ) : (
                <>
                  หักอัตโนมัติ −{directAbsentDeduction(rule).toFixed(2)}{" "}
                  คะแนน/ครั้ง (= คะแนนเต็ม ÷ {rule.sessionCount} ครั้ง)
                </>
              )}{" "}
              — ครั้งที่ขาดจะได้ 0 คะแนนของครั้งนั้นเสมอ ไม่ต้องตั้งค่าเอง
            </div>

            {/* Tiered late-penalty editor */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-800">
                    เงื่อนไขการหักคะแนนเมื่อมาสาย (ตามจำนวนนาที)
                  </h4>
                </div>
                <button
                  onClick={addTier}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors px-3 py-1.5 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  เพิ่มเงื่อนไข
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mb-2.5">
                {rule.mode === "perSession"
                  ? `คะแนนที่หักด้านล่างนี้ หักจากคะแนนเต็มของครั้งนั้น (เต็ม ${rule.sessionFull} คะแนน/ครั้ง)`
                  : "คะแนนที่หักด้านล่างนี้ หักตรงจากคะแนนเต็มที่ใช้เข้าเกรด"}
              </p>

              <div className="space-y-2.5">
                {sortedTiers.length === 0 && (
                  <p className="text-xs text-slate-400 italic">
                    ยังไม่มีเงื่อนไข — มาสายเท่าไหร่ก็จะไม่ถูกหักคะแนน
                    (ยกเว้นขาดเรียน)
                  </p>
                )}
                {sortedTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex flex-wrap items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-sm text-slate-600">มาสายตั้งแต่</span>
                    <input
                      type="number"
                      min="0"
                      value={tier.minMinutes}
                      onChange={(e) =>
                        handleTierField(tier.id, "minMinutes", e.target.value)
                      }
                      className="w-16 text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="text-sm text-slate-600">
                      นาทีขึ้นไป หักคะแนน
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={tier.deduction}
                      onChange={(e) =>
                        handleTierField(tier.id, "deduction", e.target.value)
                      }
                      className="w-16 text-sm font-semibold text-red-500 border border-slate-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="text-sm text-slate-600">
                      คะแนน / ครั้ง
                    </span>
                    <div className="flex-1" />
                    <button
                      onClick={() => removeTier(tier.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                      aria-label="ลบเงื่อนไข"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 mt-5 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {rule.mode === "perSession" ? (
                  <>
                    สูตรคำนวณ: รวมคะแนนดิบของทุกครั้ง (เข้าเรียน = เต็ม, มาสาย =
                    เต็มลบตามเงื่อนไข, ขาด = 0) แล้วหารด้วยคะแนนดิบสูงสุด (
                    {rule.sessionFull} × {rule.sessionCount})
                    คูณด้วยคะแนนเต็มที่ใช้เข้าเกรด ({rule.full}) —{" "}
                  </>
                ) : (
                  <>
                    สูตรคำนวณ: คะแนนเต็ม −
                    (ผลรวมคะแนนที่หักจากการมาสายตามเงื่อนไข) −
                    (จำนวนครั้งขาดเรียน × คะแนนเต็ม ÷ {rule.sessionCount} ครั้ง)
                    —{" "}
                  </>
                )}
                เงื่อนไขและวิธีคำนวณทั้งหมดนี้ตั้งแยกอิสระในแต่ละรายวิชา
                เปลี่ยนวิชาที่มุมขวาบนเพื่อตั้งค่าของวิชาอื่น
                หลังแก้ไขแล้วอย่าลืมกด "คำนวณคะแนนใหม่ทั้งหมด"
              </span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={<Users className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-100"
              label="จำนวนนักศึกษา"
              value={stats.total}
              sub="คน"
            />
            <StatCard
              icon={<Award className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label="คะแนนเฉลี่ย"
              value={stats.avg.toFixed(1)}
              sub={`/ ${rule.full}`}
            />
            <StatCard
              icon={<CheckCircle2 className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-100"
              label="ได้คะแนนเต็ม"
              value={stats.fullCount}
              sub="คน"
            />
            <StatCard
              icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
              iconBg="bg-red-100"
              label="ต่ำกว่าเกณฑ์ผ่าน"
              value={stats.lowCount}
              sub="คน"
              subColor={stats.lowCount > 0 ? "text-red-500" : "text-slate-400"}
            />
          </div>

          {/* Distribution chart + filter/export toolbar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">การกระจายคะแนน</h3>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distribution}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                      }}
                      formatter={(value) => [`${value} คน`, "จำนวน"]}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {distribution.map((d) => (
                        <Cell key={d.key} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900">ค้นหาและส่งออก</h3>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ-นามสกุล หรือรหัสนักศึกษา..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  คะแนนที่คำนวณแล้วสามารถแก้ไขได้เป็นรายบุคคลในตาราง
                  เหมาะสำหรับกรณีนักศึกษามีเอกสารลาป่วย/ลากิจที่ได้รับอนุมัติ
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  รีเซ็ตตัวกรอง
                </button>
                <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-emerald-100">
                  <FileSpreadsheet className="w-4 h-4" />
                  ส่งออก Excel
                </button>
                <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-red-100">
                  <FileText className="w-4 h-4" />
                  ส่งออก PDF
                </button>
              </div>
            </div>
          </div>

          {/* Score table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">
                คะแนนเข้าเรียนรายบุคคล{" "}
                <span className="text-slate-400 font-medium">
                  — {course.code} {course.name}
                </span>
              </h3>
              {savedAt && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  บันทึกล่าสุด {savedAt}
                </span>
              )}
            </div>

            <table className="w-full text-sm min-w-[960px]">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">รหัสนักศึกษา</th>
                  <th className="py-2 pr-3 font-medium">ชื่อ-นามสกุล</th>
                  <th className="py-2 pr-3 font-medium text-center">
                    เข้าเรียน
                  </th>
                  <th className="py-2 pr-3 font-medium text-center">มาสาย</th>
                  <th className="py-2 pr-3 font-medium text-center">
                    ขาดเรียน
                  </th>
                  <th className="py-2 pr-3 font-medium">คะแนน</th>
                  <th className="py-2 pr-3 font-medium">สถานะ</th>
                  <th className="py-2 pr-3 font-medium">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const passed = s.score >= rule.passThreshold;
                  const pct = rule.full ? (s.score / rule.full) * 100 : 0;
                  const lateCount = (s.lateRecords || []).length;
                  const lateTitle = lateCount
                    ? s.lateRecords.map((m) => `สาย ${m} นาที`).join(", ")
                    : "ไม่มีการมาสาย";
                  return (
                    <tr
                      key={s.code}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                        {s.code}
                      </td>
                      <td className="py-3 pr-3 text-slate-800 font-medium whitespace-nowrap">
                        {s.name}
                        <span className="text-slate-400 font-normal">
                          {" "}
                          · ปี {s.year}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-emerald-600 font-medium text-center">
                        {s.present}
                      </td>
                      <td
                        className="py-3 pr-3 text-amber-500 font-medium text-center cursor-help"
                        title={lateTitle}
                      >
                        {lateCount}
                      </td>
                      <td className="py-3 pr-3 text-red-500 font-medium text-center">
                        {s.absent}
                      </td>
                      <td className="py-3 pr-3 min-w-[160px]">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={rule.full}
                            value={s.score}
                            onChange={(e) =>
                              handleScoreChange(s.code, e.target.value)
                            }
                            className="w-16 text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                          <span className="text-xs text-slate-400">
                            / {rule.full}
                          </span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden xl:block">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 90
                                  ? "bg-emerald-500"
                                  : pct >= 70
                                    ? "bg-blue-500"
                                    : pct >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            passed
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          {passed ? "ผ่านเกณฑ์" : "ควรดูแล"}
                        </span>
                      </td>
                      <td className="py-3 pr-3 min-w-[200px]">
                        <input
                          type="text"
                          value={s.note}
                          onChange={(e) =>
                            handleNoteChange(s.code, e.target.value)
                          }
                          placeholder="เพิ่มหมายเหตุ..."
                          className="w-full text-xs text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                วางเมาส์ที่ตัวเลข "มาสาย" เพื่อดูรายละเอียดจำนวนนาทีแต่ละครั้ง —
                แก้ไขคะแนน/หมายเหตุแล้วอย่าลืมกดบันทึก
              </p>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200"
              >
                <Save className="w-4 h-4" />
                บันทึกคะแนนทั้งหมด
              </button>
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

function StatCard({ icon, iconBg, label, value, sub, subColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-medium truncate">
          {label}
        </div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-2xl font-bold text-slate-900 leading-tight">
            {value}
          </span>
          <span className={`text-xs ${subColor || "text-slate-400"}`}>
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

function RuleField({ label, value, onChange, suffix }) {
  return (
    <div>
      <label className="text-xs text-slate-500 font-medium">{label}</label>
      <div className="flex items-center gap-2 mt-1.5">
        <input
          type="number"
          step="0.5"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div className="text-[11px] text-slate-400 mt-1">{suffix}</div>
    </div>
  );
}
