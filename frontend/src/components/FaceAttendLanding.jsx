import { Link } from "react-router-dom";
import React, { useState } from "react";
import logoImg from "../assets/logo-cs.png";
import bgHero from "../assets/bg-hero.jpg";
import {
  ScanFace,
  User,
  GraduationCap,
  Clock,
  ShieldCheck,
  BarChart3,
  Check,
  Menu,
  X,
} from "lucide-react";


export default function FaceAttendLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "หน้าแรก", active: true },
    { label: "เกี่ยวกับระบบ" },
    { label: "คุณสมบัติ" },
    { label: "วิธีการใช้งาน" },
    { label: "ติดต่อเรา" },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-sans overflow-x-hidden">
      <style>{`
        @keyframes floatPhone {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(0.6deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.92); opacity: 0.9; }
          70% { transform: scale(1.18); opacity: 0; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        @keyframes scanSweep {
          0% { top: 6%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 92%; opacity: 0; }
        }
        @keyframes badgeBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
        @keyframes shimmerSweep {
          0% { transform: translateX(-120%) rotate(8deg); }
          100% { transform: translateX(220%) rotate(8deg); }
        }
        @keyframes dashRotate {
          to { stroke-dashoffset: -400; }
        }
        .animate-float { animation: floatPhone 6s ease-in-out infinite; }
        .animate-glow { animation: glowPulse 3.5s ease-in-out infinite; }
        .animate-ring { animation: ringPulse 2.4s ease-out infinite; }
        .animate-scan { animation: scanSweep 3.2s ease-in-out infinite; }
        .animate-badge { animation: badgeBounce 2.8s ease-in-out infinite; }
        .animate-shimmer { animation: shimmerSweep 3.5s ease-in-out infinite; }
        .animate-dash { animation: dashRotate 14s linear infinite; }
      `}</style>

      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Computer Science, Maejo University"
              className="h-12 md:h-14 w-auto object-contain shrink-0"
            />
            <div className="leading-tight hidden sm:block">
              <div className="text-lg font-bold text-slate-900">CS FaceAttend</div>
              <div className="text-[11px] text-slate-400 -mt-0.5">
                Computer Science AI Face Attendance System
              </div>
            </div>
          </div>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[15px] text-slate-600 font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className={`relative transition-colors ${
                  link.active ? "text-blue-600" : "hover:text-blue-600"
                }`}
              >
                {link.label}
                {link.active && (
                  <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* CTA (desktop) */}
          <Link
            to="/login"
            className="hidden md:flex group relative items-center gap-2 overflow-hidden bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
            <User className="w-4 h-4" />
            เข้าสู่ระบบ
          </Link>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="เปิดเมนู"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className={`text-[15px] font-medium ${
                  link.active ? "text-blue-600" : "text-slate-600"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-md shadow-blue-200"
            >
              <User className="w-4 h-4" />
              เข้าสู่ระบบ
            </Link>
          </div>
        )}
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-blue-50 to-white">
        {/* background artwork */}
        <img
          src={bgHero}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-90"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-24 md:pt-20 md:pb-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              ระบบเช็คชื่ออัจฉริยะ
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 mb-6">
              เช็คชื่อด้วยใบหน้า
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                สะดวก รวดเร็ว แม่นยำ
              </span>
            </h1>

            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-9 max-w-md">
              ระบบเช็คชื่อด้วยการยืนยันใบหน้าผ่านโทรศัพท์มือถือ
              ปลอดภัย เชื่อถือได้ ลดเวลาในการเช็คชื่อ
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all text-white font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-blue-200">
                <GraduationCap className="w-5 h-5" />
                สำหรับนักศึกษา
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg transition-all text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm">
                <User className="w-5 h-5" />
                สำหรับอาจารย์
              </button>
            </div>
          </div>

          {/* Right column: phone mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* glow behind phone */}
            <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full bg-blue-400/30 blur-3xl animate-glow" />

            {/* shield badge */}
            <div className="absolute -top-4 right-4 md:right-10 z-20 animate-badge">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-300">
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ring" />
                <ShieldCheck className="relative w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* phone frame - iPhone style, extra rounded */}
            <div className="relative z-10 animate-float">
              <div className="relative w-[260px] md:w-[300px] rounded-[3.6rem] bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 p-[8px] shadow-2xl shadow-blue-300/50">
                {/* glossy highlight sweep */}
                <div className="absolute inset-0 rounded-[3.6rem] overflow-hidden pointer-events-none">
                  <div className="absolute -inset-y-10 -left-1/3 w-1/3 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                </div>

                {/* side buttons */}
                <span className="absolute -left-[3px] top-24 w-[3px] h-8 bg-blue-300 rounded-r-sm" />
                <span className="absolute -left-[3px] top-36 w-[3px] h-12 bg-blue-300 rounded-r-sm" />
                <span className="absolute -left-[3px] top-52 w-[3px] h-12 bg-blue-300 rounded-r-sm" />
                <span className="absolute -right-[3px] top-32 w-[3px] h-16 bg-blue-300 rounded-l-sm" />

                {/* black bezel */}
                <div className="relative rounded-[3.2rem] bg-black p-[3px]">
                  <div className="relative rounded-[2.9rem] overflow-hidden bg-white">
                    {/* status bar */}
                    <div className="relative flex items-center justify-between px-6 pt-3.5 pb-1 text-[11px] font-semibold text-slate-800">
                      <span>9:41</span>
                      {/* Dynamic Island */}
                      <span className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-7 bg-black rounded-full" />
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-2 border border-slate-800 rounded-sm" />
                      </span>
                    </div>

                    {/* screen title */}
                    <div className="text-center text-[13px] font-medium text-slate-700 pt-2 pb-3">
                      สแกนใบหน้าเพื่อเช็คชื่อ
                    </div>

                    {/* face photo with scan ring + sweep */}
                    <div className="relative mx-5 mb-4 aspect-square rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=faces"
                        alt="ตัวอย่างรูปนักศึกษา (รูปชั่วคราว)"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-3 rounded-full border-2 border-blue-400/80" />
                      {/* scanning laser line */}
                      <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_8px_2px_rgba(96,165,250,0.8)] animate-scan" />
                      {/* facial landmark dots (decorative) */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                        {[
                          [70, 80], [130, 80], [100, 110], [80, 140], [120, 140],
                          [60, 60], [140, 60], [100, 60],
                        ].map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="1.6" fill="#60a5fa" />
                        ))}
                      </svg>
                    </div>

                    {/* result banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 mx-0 px-5 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="text-white">
                        <div className="text-sm font-semibold leading-tight">
                          เช็คชื่อสำเร็จ
                        </div>
                        <div className="text-lg font-bold leading-tight">08:55:23</div>
                        <div className="text-[11px] text-blue-100 leading-tight">
                          10 สิงหาคม 2566
                        </div>
                      </div>
                    </div>

                    {/* home indicator */}
                    <div className="flex justify-center py-2">
                      <span className="w-24 h-1 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Feature strip ---------- */}
      <section className="relative -mt-10 md:-mt-14 z-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 px-8 md:px-12 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <Feature
            icon={<ScanFace className="w-7 h-7 text-blue-600" />}
            title="ยืนยันตัวตนด้วยใบหน้า"
            desc="ใช้เทคโนโลยี AI ในการจดจำใบหน้าเพื่อความปลอดภัยและแม่นยำ"
          />
          <Feature
            icon={<Clock className="w-7 h-7 text-blue-600" />}
            title="ประหยัดเวลา"
            desc="เช็คชื่อได้รวดเร็ว ลดเวลาในการทำงาน"
          />
          <Feature
            icon={<ShieldCheck className="w-7 h-7 text-blue-600" />}
            title="ปลอดภัย เชื่อถือได้"
            desc="ข้อมูลถูกเข้ารหัสปลอดภัยตามมาตรฐาน"
          />
          <Feature
            icon={<BarChart3 className="w-7 h-7 text-blue-600" />}
            title="รายงานและสถิติ"
            desc="ดูรายงานการเข้าเรียนและสถิติแบบเรียลไทม์"
          />
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="mt-16 md:mt-20 pb-10 pt-8 text-center text-sm text-slate-400">
        © 2026 Computer Science AI Face Attendance System. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="group flex flex-col items-start gap-4 transition-transform hover:-translate-y-1">
      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center transition-all group-hover:bg-blue-100 group-hover:shadow-md group-hover:shadow-blue-100">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-slate-900 mb-1">{title}</div>
        <div className="text-sm text-slate-500 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}