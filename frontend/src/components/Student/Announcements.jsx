import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Megaphone,
  Search,
  ChevronRight,
  ChevronDown,
  Pin,
  BookMarked,
  FileText,
  GraduationCap,
  CheckCheck,
  Check,
} from "lucide-react";
import { useApi } from "../../lib/useApi";
import { initial } from "../../lib/format";
import LoadState from "../LoadState";
import StudentLayout from "./StudentLayout";
import FilterSelect from "./FilterSelect";
import Pagination from "./Pagination";
import { useStudentI18n } from "./studentI18n";
import { markRead, useReadIds } from "./announcementReads";

const PAGE_SIZE = 5;
const COLORS = ["blue", "emerald", "amber", "purple"];

const colorMap = {
  rose: { bg: "bg-rose-100", text: "text-rose-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
};

// ตัวกรองสถานะ: "" ทั้งหมด / unread ยังไม่อ่าน / read อ่านแล้ว / pinned ประกาศสำคัญ
const matchStatus = (a, status) =>
  !status || (status === "pinned" ? a.pinned : (status === "read") === a.read);

export default function Announcements() {
  const { t, date } = useStudentI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const readIds = useReadIds();
  const announcementsReq = useApi("/announcements", []);
  const classesReq = useApi("/classes/mine", []);
  const classById = new Map(
    (classesReq.data || []).map((c, i) => [c.id, { ...c, color: COLORS[i % COLORS.length] }])
  );

  const all = (announcementsReq.data || []).map((a) => {
    const cls = a.class_id ? classById.get(a.class_id) : null;
    const created = new Date(a.created_at);
    return {
      ...a,
      icon: a.pinned ? Megaphone : cls ? BookMarked : FileText,
      color: a.pinned ? "rose" : cls?.color || "purple",
      teacher: a.teacher_name || "-",
      subject: cls ? `${cls.course_name} (${cls.course_code})` : t("common.general"),
      date: date(a.created_at),
      time: t("common.clock", { time: created.toTimeString().slice(0, 5) }),
      read: readIds.has(a.id),
    };
  });
  const q = search.trim().toLowerCase();
  const filtered = all.filter(
    (a) =>
      (!q || `${a.title} ${a.body}`.toLowerCase().includes(q)) &&
      matchStatus(a, statusFilter) &&
      (!classFilter || String(a.class_id ?? "general") === classFilter)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const announcements = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pinnedList = all.filter((a) => a.pinned);
  const unreadCount = all.filter((a) => !a.read).length;
  const generalCount = all.filter((a) => !a.class_id).length;
  const categories = [
    ...[...classById.values()].map((c) => ({
      key: String(c.id),
      icon: GraduationCap,
      label: `${c.course_code} ${c.course_name}`,
      count: all.filter((a) => a.class_id === c.id).length,
    })),
    { key: "general", icon: FileText, label: t("announcements.general"), count: generalCount },
  ];

  // ไฮไลต์ประกาศที่เพิ่งกดดูจากกล่องปักหมุด แล้วค่อย ๆ จางหายไป
  useEffect(() => {
    if (!focusId) return undefined;
    const timer = setTimeout(() => setFocusId(null), 2500);
    return () => clearTimeout(timer);
  }, [focusId]);

  const setFilters = (status, cls) => {
    setSearch("");
    setStatusFilter(status);
    setClassFilter(cls);
    setPage(1);
  };
  const toggleExpand = (a) => {
    setExpanded(expanded === a.id ? null : a.id);
    markRead(a.id);
  };
  // กด "ดูประกาศ" ในกล่องปักหมุด: ล้างตัวกรอง ไปหน้าที่มีประกาศนั้น เลื่อนไปหาและไฮไลต์
  const showAnnouncement = (a) => {
    setFilters("", "");
    setPage(Math.floor(all.findIndex((x) => x.id === a.id) / PAGE_SIZE) + 1);
    setExpanded(a.id);
    setFocusId(a.id);
    markRead(a.id);
  };

  const summaryRows = [
    { label: t("announcements.all"), value: all.length, active: !statusFilter && !classFilter, onClick: () => setFilters("", "") },
    {
      label: t("announcements.unread"),
      value: unreadCount,
      valueColor: unreadCount ? "text-rose-500" : "text-slate-900",
      active: statusFilter === "unread",
      onClick: () => setFilters("unread", ""),
    },
    {
      label: t("announcements.important"),
      value: pinnedList.length,
      valueColor: "text-rose-500",
      active: statusFilter === "pinned",
      onClick: () => setFilters("pinned", ""),
    },
    {
      label: t("announcements.general"),
      value: generalCount,
      active: classFilter === "general" && !statusFilter,
      onClick: () => setFilters("", "general"),
    },
  ];

  return (
    <StudentLayout
      titleIcon={Megaphone}
      titleKey="nav.announcements"
      subtitleKey="announcements.subtitle"
      headerExtra={
        unreadCount > 0 && (
          <button
            onClick={() => markRead(...all.map((a) => a.id))}
            className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-slate-400" />
            {t("announcements.markAllRead")}
          </button>
        )
      }
    >
      <LoadState loading={false} error={announcementsReq.error} onRetry={announcementsReq.reload} />

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5 items-start">
        {/* Left column */}
        <div className="space-y-5 min-w-0">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t("announcements.search")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <FilterSelect
              label={t("announcements.all")}
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <option value="unread">{t("announcements.unread")}</option>
              <option value="read">{t("announcements.read")}</option>
              <option value="pinned">{t("announcements.important")}</option>
            </FilterSelect>
            <div className="max-w-full sm:max-w-[16rem]">
              <FilterSelect
                label={t("announcements.allCourses")}
                value={classFilter}
                onChange={(v) => {
                  setClassFilter(v);
                  setPage(1);
                }}
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </FilterSelect>
            </div>
          </div>

          {/* Announcement list */}
          <div className="space-y-4">
            {!announcementsReq.error && announcements.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-400">
                {announcementsReq.loading ? t("common.loading") : t("announcements.empty")}
              </div>
            )}
            {announcements.map((a) => (
              <AnnouncementCard
                key={a.id}
                a={a}
                expanded={expanded === a.id}
                highlighted={focusId === a.id}
                onToggle={() => toggleExpand(a)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-1">
              <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5 min-w-0">
          {/* Summary — กดแถวเพื่อกรองรายการ */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-3">{t("announcements.summary")}</h3>
            <div className="space-y-1">
              {summaryRows.map((row) => (
                <button
                  key={row.label}
                  onClick={row.onClick}
                  aria-pressed={row.active}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    row.active ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span className={row.active ? "font-semibold text-blue-600" : "text-slate-600"}>{row.label}</span>
                  <span className={`font-bold tabular-nums ${row.valueColor || "text-slate-900"}`}>{row.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pinned */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-slate-900">{t("announcements.pinned")}</h3>
            </div>
            <div className="space-y-3">
              {pinnedList.length === 0 && <div className="text-sm text-slate-400">{t("announcements.noPinned")}</div>}
              {pinnedList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => showAnnouncement(p)}
                  className="w-full text-left bg-rose-50 border border-rose-100 rounded-xl p-4 hover:border-rose-200 transition-colors group"
                >
                  <div className="text-sm font-bold text-slate-900 leading-snug">{p.title}</div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {p.date} • {p.subject}
                  </div>
                  <div className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1">
                    {t("announcements.view")}
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-3">{t("announcements.byCourse")}</h3>
            <div className="space-y-1">
              {categories.map(({ key, icon: Icon, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilters("", classFilter === key ? "" : key)}
                  aria-pressed={classFilter === key}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    classFilter === key ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-700 flex-1 text-left leading-snug">{label}</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function AnnouncementCard({ a, expanded, highlighted, onToggle }) {
  const { t } = useStudentI18n();
  const bodyRef = useRef(null);
  const cardRef = useRef(null);
  // ปุ่ม "อ่านเพิ่มเติม" แสดงเฉพาะเมื่อเนื้อหายาวจนถูกตัด (วัดจากขนาดจริงบนจอ)
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || expanded) return undefined;
    const observer = new ResizeObserver(() => setClamped(el.scrollHeight > el.clientHeight + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, a.body]);

  useEffect(() => {
    if (highlighted) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlighted]);

  const cs = colorMap[a.color];
  const Icon = a.icon;
  // ใช้ค่าที่วัดได้ตอนยังไม่ขยาย: ข้อความสั้นที่ไม่เคยถูกตัดจะไม่มีปุ่ม "ย่อ" ให้กดเล่น
  const showToggle = clamped;

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border shadow-sm p-5 transition-shadow ${
        a.pinned ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100"
      } ${highlighted ? "ring-2 ring-blue-400" : ""}`}
    >
      {a.pinned && (
        <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mb-2">
          <Pin className="w-3.5 h-3.5" />
          {t("announcements.important")}
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cs.bg}`}>
          <Icon className={`w-5 h-5 ${cs.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-slate-900 leading-snug">{a.title}</h3>
            {a.read ? (
              <span className="text-xs font-semibold text-emerald-600 shrink-0">{t("announcements.read")}</span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 shrink-0">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {t("announcements.unread")}
              </span>
            )}
          </div>
          <p
            ref={bodyRef}
            className={`text-sm text-slate-500 leading-relaxed mt-1 whitespace-pre-line ${expanded ? "" : "line-clamp-2"}`}
          >
            {a.body}
          </p>
          {showToggle && (
            <button
              onClick={onToggle}
              className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              aria-expanded={expanded}
            >
              {expanded ? t("announcements.collapse") : t("announcements.readMore")}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                {initial(a.teacher)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-700 truncate">{a.teacher}</div>
                <div className="text-[11px] text-slate-400 truncate">{a.subject}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarDays className="w-3.5 h-3.5" />
                {a.date} {a.time}
              </span>
              {!a.read && (
                <button
                  onClick={() => markRead(a.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t("announcements.markRead")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
