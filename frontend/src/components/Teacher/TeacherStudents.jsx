import { useState } from "react";
import {
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Download,
  CheckCircle2,
} from "lucide-react";
import TeacherLayout from "./TeacherLayout";
import { useAppearanceSettings } from "./useAppearanceSettings";

const statusCls = {
  normal: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  suspended: "bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400",
};

const statusIcon = { normal: CheckCircle2, pending: Clock, suspended: Ban };

const statusLabelKey = {
  normal: "common.status.normal",
  pending: "common.status.pending",
  suspended: "common.status.suspended",
};

const students = [
  { code: "65011001", name: "นายธนภัทร ใจดี", year: 3, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "12 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=12" },
  { code: "65011002", name: "นางสาวกานต์ธิชา สุขสวัสดิ์", year: 3, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "12 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=47" },
  { code: "65011003", name: "นายศุภกฤต เสริมศรี", year: 3, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "13 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=33" },
  { code: "65011004", name: "นางสาวพิมพ์ชนก วงศ์สมบัติ", year: 3, major: "วิทยาการคอมพิวเตอร์", status: "pending", date: "14 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=25" },
  { code: "65011005", name: "นายกิตติพงษ์ แสงทอง", year: 2, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "15 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=14" },
  { code: "65011006", name: "นางสาววรินทร์พร แก้วใส", year: 2, major: "วิทยาการคอมพิวเตอร์", status: "suspended", date: "16 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=32" },
  { code: "65011007", name: "นายภูมิพัฒน์ สายเนตร", year: 1, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "16 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=51" },
  { code: "65011008", name: "นางสาวภัทรวดี กันหา", year: 1, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "17 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=44" },
  { code: "65011009", name: "นายณัฐวุฒิ จันทร์ศรี", year: 4, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "18 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=15" },
  { code: "65011010", name: "นางสาวอรปรียา ทองมาก", year: 4, major: "วิทยาการคอมพิวเตอร์", status: "normal", date: "18 ส.ค. 2565", avatar: "https://i.pravatar.cc/100?img=28" },
];

const totalStudents = 142;
const pageNumbers = [1, 2, 3, 4, 5];
const lastPage = 15;

export default function TeacherStudents() {
  const { t } = useAppearanceSettings();
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const toggleAll = () => {
    setSelected((prev) => (prev.length === students.length ? [] : students.map((s) => s.code)));
  };

  const toggleOne = (code) => {
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const summaryStats = [
    { icon: <UsersRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />, iconBg: "bg-blue-100 dark:bg-blue-950/40", label: t("students.stats.total"), value: "148", sub: t("common.units.people") },
    { icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, iconBg: "bg-emerald-100 dark:bg-emerald-950/40", label: t("students.stats.registered"), value: "142", sub: t("common.units.people"), trend: "95.9%", trendColor: "text-emerald-600 dark:text-emerald-400" },
    { icon: <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />, iconBg: "bg-amber-100 dark:bg-amber-950/40", label: t("students.stats.pending"), value: "3", sub: t("common.units.people"), trend: "2.0%", trendColor: "text-amber-500 dark:text-amber-400" },
    { icon: <Ban className="w-6 h-6 text-red-500 dark:text-red-400" />, iconBg: "bg-red-100 dark:bg-red-950/40", label: t("students.stats.suspended"), value: "3", sub: t("common.units.people"), trend: "2.0%", trendColor: "text-red-500 dark:text-red-400" },
  ];

  return (
    <TeacherLayout
      titleIcon={Users}
      titleKey="nav.students"
      subtitleKey="students.subtitle"
      headerExtra={
        <>
          <button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 dark:shadow-blue-950 shrink-0">
            <Plus className="w-4 h-4" />
            {t("students.addStudent")}
          </button>
          <button className="hidden lg:flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
            <CalendarDays className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            20 พฤษภาคม 2567
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </button>
        </>
      }
    >
      {/* Add button for small screens */}
      <div className="flex md:hidden justify-end">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 dark:shadow-blue-950">
          <Plus className="w-4 h-4" />
          {t("students.addStudent")}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>{s.icon}</div>
            <div className="min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{s.label}</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{s.value}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{s.sub}</span>
              </div>
              {s.trend && <div className={`text-xs mt-0.5 truncate ${s.trendColor}`}>{s.trend}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t("students.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        <FilterSelect label={t("students.filters.faculty")} value="วิทยาการคอมพิวเตอร์" />
        <FilterSelect label={t("students.filters.year")} value={t("students.filters.all")} />
        <FilterSelect label={t("students.filters.status")} value={t("students.filters.all")} />

        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors px-3 py-2.5 shrink-0">
          <RotateCcw className="w-4 h-4" />
          {t("students.filters.reset")}
        </button>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setView("grid")}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              view === "grid" ? "bg-blue-600 text-white" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              view === "list" ? "bg-blue-600 text-white" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student list card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            {t("students.listTitlePrefix")}{" "}
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              ({totalStudents} {t("common.units.people")})
            </span>
          </h3>
          <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            {t("students.exportData")}
          </button>
        </div>

        {view === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2 pr-3 font-medium w-8">
                    <input
                      type="checkbox"
                      checked={selected.length === students.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </th>
                  <th className="py-2 pr-3 font-medium">{t("students.table.photo")}</th>
                  <th className="py-2 pr-3 font-medium">{t("students.table.studentId")}</th>
                  <th className="py-2 pr-3 font-medium">{t("students.table.name")}</th>
                  <th className="py-2 pr-3 font-medium">{t("students.table.year")}</th>
                  <th className="py-2 pr-3 font-medium">{t("students.table.major")}</th>
                  <th className="py-2 pr-3 font-medium">{t("students.table.status")}</th>
                  <th className="py-2 pr-3 font-medium">{t("students.table.registeredDate")}</th>
                  <th className="py-2 pr-3 font-medium text-right">{t("students.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const StatusIcon = statusIcon[s.status];
                  return (
                    <tr key={s.code} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(s.code)}
                          onChange={() => toggleOne(s.code)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-200 dark:focus:ring-blue-900"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                      </td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{s.code}</td>
                      <td className="py-3 pr-3 text-slate-800 dark:text-slate-100 font-medium whitespace-nowrap">{s.name}</td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{s.year}</td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{s.major}</td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusCls[s.status]}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {t(statusLabelKey[s.status])}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{s.date}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
              const StatusIcon = statusIcon[s.status];
              return (
                <div key={s.code} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{s.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {s.code} • {t("scores.yearPrefix")} {s.year}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${statusCls[s.status]}`}>
                      <StatusIcon className="w-3 h-3" />
                      {t(statusLabelKey[s.status])}
                    </span>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            {t("students.showingPrefix")} 1 - {students.length} {t("students.showingFrom")} {totalStudents} {t("students.showingSuffix")}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === n ? "bg-blue-600 text-white" : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-1 text-slate-400 dark:text-slate-500">…</span>
            <button
              onClick={() => setPage(lastPage)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === lastPage ? "bg-blue-600 text-white" : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {lastPage}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page === lastPage}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

function FilterSelect({ label, value }) {
  return (
    <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
      <span className="text-slate-400 dark:text-slate-500">{label}:</span>
      {value}
      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
    </button>
  );
}