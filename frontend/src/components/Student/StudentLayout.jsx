import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  X,
  History,
  UserPlus,
  CalendarDays,
  Megaphone,
  User,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  CheckCheck,
} from "lucide-react";
import logoImg from "../../assets/logo-cs.png";
import { clearSession, getUser } from "../../lib/api";
import { useApi } from "../../lib/useApi";
import { initial } from "../../lib/format";
import { useStudentI18n } from "./studentI18n";
import { markRead, useReadIds } from "./announcementReads";
import { loadStudentPrefs } from "./studentPrefs";

const navItems = [
  { icon: LayoutDashboard, labelKey: "nav.dashboard", to: "/dashboard" },
  /*{ icon: ScanFace, labelKey: "nav.checkin", to: "/checkin" }, */
  { icon: History, labelKey: "nav.history", to: "/history" },
  {
    icon: UserPlus,
    labelKey: "nav.faceRegistration",
    to: "/face-registration",
  },
  /*{ icon: BookOpen, labelKey: "nav.courses", to: "/courses" }, */
  { icon: CalendarDays, labelKey: "nav.schedule", to: "/schedule" },
  { icon: Megaphone, labelKey: "nav.announcements", to: "/announcements" },
  { icon: User, labelKey: "nav.profile", to: "/profile" },
  { icon: SettingsIcon, labelKey: "nav.settings", to: "/settings" },
];

// ปิด dropdown เมื่อคลิกนอกกรอบ หรือกด Esc
function useDismiss(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);
  return ref;
}

/**
 * ใช้ครอบเนื้อหาของทุกหน้าฝั่งนักศึกษา โครงและหน้าตาเหมือน TeacherLayout:
 *
 *   <StudentLayout titleIcon={BookOpen} titleKey="nav.courses" subtitleKey="courses.subtitle">
 *     ...เนื้อหาเฉพาะของหน้านั้น...
 *   </StudentLayout>
 *
 * Props:
 * - titleIcon: ไอคอน lucide-react หน้าหัวข้อ (ไม่บังคับ)
 * - titleKey / subtitleKey: คีย์คำแปล (studentI18n) ของหัวข้อ/คำอธิบาย
 * - titleContent / subtitle: ใส่แทนคีย์ได้ เมื่อเป็นข้อความที่ประกอบจากข้อมูล (เช่นชื่อผู้ใช้ ช่วงวันที่)
 * - headerExtra: ปุ่ม/องค์ประกอบเสริมในหัว วางไว้ก่อนไอคอนกระดิ่ง
 *
 * โหมดมืดของเนื้อหาภายในใช้ CSS ที่ผูกกับคลาส .student-shell (ดู index.css)
 */
export default function StudentLayout({
  titleIcon: TitleIcon,
  titleKey,
  titleContent,
  subtitleKey,
  subtitle,
  headerExtra,
  children,
}) {
  // จอเล็ก (มือถือ/แท็บเล็ต): เมนูเป็นลิ้นชักเลื่อนออกมาจากซ้าย ปิดไว้ก่อน — จอใหญ่ (lg) แสดงค้างไว้เสมอ
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useStudentI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const subtitleText = subtitle ?? (subtitleKey ? t(subtitleKey) : "");

  // ระหว่างเปิดเมนูบนมือถือ: กด Esc เพื่อปิด และล็อกไม่ให้หน้าหลังเลื่อน
  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen]);

  const logout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="student-shell min-h-screen w-full font-sans flex">
      {/* ฉากหลังมืดตอนเปิดเมนูบนมือถือ — แตะเพื่อปิด */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------- Sidebar ---------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[85vw] transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:translate-x-0 lg:shadow-none shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-y-auto`}
      >
        <div className="h-16 lg:h-20 flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
          <img
            src={logoImg}
            alt="CS FaceAttend"
            className="h-10 w-auto object-contain"
          />
          <div className="leading-tight min-w-0">
            <div className="text-base font-bold text-slate-900 whitespace-nowrap">
              {t("layout.appName")}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {t("layout.tagline")}
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto -mr-2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden shrink-0"
            aria-label={t("layout.closeMenu")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 lg:py-6 space-y-1 lg:space-y-1.5">
          {navItems.map(({ icon: Icon, labelKey, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {t("layout.logout")}
          </button>
        </div>

        <div className="p-4 hidden lg:block">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {t("layout.securityTitle")}
            </div>
            <div className="text-xs text-slate-500 leading-relaxed mt-1.5">
              {t("layout.securityDesc")}
            </div>
            <div className="inline-flex items-center gap-1.5 mt-4 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("layout.securityBadge")}
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 lg:h-20 bg-white border-b border-slate-100 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 -ml-1 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0 lg:hidden"
            aria-label={t("layout.toggleMenu")}
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1 lg:flex-none">
            <div className="flex items-center gap-2">
              {TitleIcon && (
                <TitleIcon className="w-5 h-5 text-slate-700 shrink-0 hidden sm:block" />
              )}
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {titleContent ?? t(titleKey)}
              </h1>
            </div>
            {subtitleText && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {subtitleText}
              </p>
            )}
          </div>

          <div className="hidden lg:block flex-1" />

          {headerExtra}

          <NotificationBell />
          <UserMenu user={user} onLogout={logout} />
        </header>

        {/* Body — เนื้อหาเฉพาะของแต่ละหน้า */}
        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-5">
          {children}
        </main>

        <footer className="text-center text-xs text-slate-400 py-6">
          {t("layout.footer")}
        </footer>
      </div>
    </div>
  );
}

// กระดิ่ง: แสดงประกาศล่าสุด + จำนวนที่ยังไม่อ่าน
function NotificationBell() {
  const { t, date } = useStudentI18n();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, setOpen);
  const readIds = useReadIds();
  const { data } = useApi("/announcements", []);
  const list = data || [];
  const unread = list.filter((a) => !readIds.has(a.id));
  const showBadge = loadStudentPrefs().notif.announce && unread.length > 0;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label={t("layout.notifications")}
        title={t("layout.notifications")}
      >
        <Bell className="w-5 h-5" />
        {showBadge && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-30 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900">
              {t("layout.notifications")}
            </span>
            {unread.length > 0 && (
              <button
                onClick={() => markRead(...unread.map((a) => a.id))}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                {t("layout.markAllRead")}
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {list.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                {t("layout.noNotifications")}
              </div>
            )}
            {list.slice(0, 5).map((a) => (
              <Link
                key={a.id}
                to="/announcements"
                onClick={() => {
                  markRead(a.id);
                  setOpen(false);
                }}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
              >
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${readIds.has(a.id) ? "bg-slate-200" : "bg-blue-500"}`}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {a.title}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">
                    {a.body}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {date(a.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/announcements"
            onClick={() => setOpen(false)}
            className="block text-center text-xs font-semibold text-blue-600 py-2.5 border-t border-slate-100 hover:bg-slate-50"
          >
            {t("layout.openAnnouncements")}
          </Link>
        </div>
      )}
    </div>
  );
}

// ป้ายชื่อผู้ใช้ หน้าตาเดียวกับฝั่งอาจารย์ กดแล้วมีเมนูโปรไฟล์/การตั้งค่า/ออกจากระบบ
function UserMenu({ user, onLogout }) {
  const { t } = useStudentI18n();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, setOpen);
  const item =
    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-50 text-left";

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-2"
      >
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
          {initial(user?.full_name)}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">
            {user?.full_name || "-"}
          </div>
          <div className="text-xs text-slate-400 whitespace-nowrap">
            {t("common.role")}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-30 w-52 bg-white border border-slate-100 rounded-xl shadow-lg p-1.5">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className={`${item} text-slate-700`}
          >
            <User className="w-4 h-4 text-slate-400" />
            {t("nav.profile")}
          </Link>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className={`${item} text-slate-700`}
          >
            <SettingsIcon className="w-4 h-4 text-slate-400" />
            {t("nav.settings")}
          </Link>
          <div className="my-1 border-t border-slate-100" />
          <button onClick={onLogout} className={`${item} text-red-500`}>
            <LogOut className="w-4 h-4" />
            {t("layout.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
