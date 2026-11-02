import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  History,
  ScanFace,
  CheckCircle2,
  Clock,
  XCircle,
  Circle,
  Download,
  RotateCcw,
} from "lucide-react";
import { useApi } from "../../lib/useApi";
import { downloadBlob, hhmm, isoDate, toCsv } from "../../lib/format";
import LoadState from "../LoadState";
import StudentLayout from "./StudentLayout";
import DatePicker from "./DatePicker";
import FilterSelect from "./FilterSelect";
import Pagination from "./Pagination";
import { useStudentI18n } from "./studentI18n";

const PAGE_SIZE = 10;

const statusMeta = {
  present: {
    labelKey: "common.status.present",
    cls: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle2,
  },
  late: {
    labelKey: "common.status.lateShort",
    cls: "bg-amber-50 text-amber-600",
    icon: Clock,
  },
  absent: {
    labelKey: "common.status.absent",
    cls: "bg-red-50 text-red-500",
    icon: XCircle,
  },
};

// แท็บสถานะ หน้าตาเดียวกับหน้าประวัติฝั่งอาจารย์
const statusTabs = [
  {
    key: "",
    labelKey: "announcements.all",
    icon: Circle,
    activeCls: "bg-blue-600 text-white border-blue-600",
  },
  {
    key: "present",
    labelKey: "common.status.present",
    icon: CheckCircle2,
    activeCls: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    key: "late",
    labelKey: "common.status.lateShort",
    icon: Clock,
    activeCls: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    key: "absent",
    labelKey: "common.status.absent",
    icon: XCircle,
    activeCls: "bg-red-50 text-red-500 border-red-200",
  },
];

export default function CheckinHistory() {
  const { t, date } = useStudentI18n();
  const [page, setPage] = useState(1);
  const [today] = useState(() => isoDate());
  const [course, setCourse] = useState("");
  const [searchParams] = useSearchParams();
  // เปิดมาจากการ์ดบนแดชบอร์ด เช่น /history?status=absent ให้กรองสถานะนั้นไว้ก่อน
  const [status, setStatus] = useState(() =>
    statusMeta[searchParams.get("status")] ? searchParams.get("status") : "",
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  // ประวัติทั้งหมดตั้งแต่ลงทะเบียน (เฉพาะคาบที่มีผลแล้ว)
  const { data, error, loading, reload } = useApi(
    `/attendance/my-sessions?start=2000-01-01&end=${today}`,
    [],
  );
  const all = (data || []).filter((s) => statusMeta[s.status]).reverse();
  const courses = [
    ...new Map(all.map((s) => [s.course_code, s.course_name])).entries(),
  ];

  const inScope = all.filter(
    (s) =>
      (!course || s.course_code === course) &&
      (!dateFrom || s.session_date >= dateFrom) &&
      (!dateTo || s.session_date <= dateTo),
  );
  const records = inScope.filter((s) => !status || s.status === status);

  const totalRecords = records.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRecords = records.slice(start, start + PAGE_SIZE);

  const detailOf = (r) => {
    if (r.status === "absent") return t("history.notChecked");
    const parts = [];
    if (r.status === "late")
      parts.push(t("common.lateBy", { n: r.late_minutes ?? 0 }));
    if (r.my_confidence)
      parts.push(
        t("common.confidence", { n: Number(r.my_confidence).toFixed(1) }),
      );
    return parts.join(" • ") || "-";
  };
  const methodOf = (r) =>
    r.my_method
      ? t(`common.method.${r.my_method === "manual" ? "manual" : "face"}`)
      : "-";

  const exportCsv = () => {
    const headers = [
      t("history.date"),
      t("history.checkinTime"),
      t("history.courseCode"),
      t("history.course"),
      t("history.group"),
      t("history.status"),
      t("history.method"),
      t("history.detail"),
    ];
    const rows = records.map((r) => [
      date(r.session_date),
      r.my_check_in_time ? hhmm(r.my_check_in_time) : "-",
      r.course_code,
      r.course_name,
      r.class_code || "-",
      t(statusMeta[r.status].labelKey),
      methodOf(r),
      detailOf(r),
    ]);
    downloadBlob(`${t("history.fileName")}_${today}.csv`, toCsv(headers, rows));
  };
  const withReset = (fn) => (v) => {
    fn(v);
    setPage(1);
  };
  const resetFilters = () => {
    setCourse("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <StudentLayout
      titleIcon={History}
      titleKey="nav.history"
      subtitleKey="history.subtitle"
      headerExtra={
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <DatePicker
            value={dateFrom}
            max={dateTo || undefined}
            onChange={withReset(setDateFrom)}
            placeholder={t("history.dateFrom")}
            ariaLabel={t("history.dateFrom")}
          />
          <span className="text-slate-400">-</span>
          <DatePicker
            value={dateTo}
            min={dateFrom || undefined}
            onChange={withReset(setDateTo)}
            placeholder={t("history.dateTo")}
            ariaLabel={t("history.dateTo")}
          />
        </div>
      }
    >
      <LoadState loading={loading} error={error} onRetry={reload} />

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <FilterSelect
          label={t("history.allCourses")}
          value={course}
          onChange={withReset(setCourse)}
        >
          {courses.map(([code, name]) => (
            <option key={code} value={code}>
              {code} {name}
            </option>
          ))}
        </FilterSelect>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          {t("history.clearFilters")}
        </button>
        <div className="flex-1" />
        <button
          onClick={exportCsv}
          disabled={!records.length}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shrink-0"
        >
          <Download className="w-4 h-4" />
          {t("history.export")}
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = status === tab.key;
          return (
            <button
              key={tab.key || "all"}
              onClick={() => withReset(setStatus)(tab.key)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${
                isActive
                  ? tab.activeCls
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Check-in log: มือถือแสดงเป็นการ์ด, จอ md ขึ้นไปแสดงเป็นตาราง */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
        <div className="md:hidden divide-y divide-slate-100">
          {!loading && !error && pageRecords.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              {t("history.empty")}
            </div>
          )}
          {pageRecords.map((r) => {
            const meta = statusMeta[r.status];
            const StatusIcon = meta.icon;
            return (
              <div key={r.session_id} className="py-3 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800">
                      {r.course_code}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {r.course_name}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${meta.cls}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {t(meta.labelKey)}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>{date(r.session_date)}</span>
                  <span className="tabular-nums">
                    {r.my_check_in_time ? hhmm(r.my_check_in_time) : "-"}
                  </span>
                  {r.my_method && (
                    <span className="inline-flex items-center gap-1">
                      <ScanFace className="w-3.5 h-3.5 text-blue-500" />
                      {methodOf(r)}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-400">
                  {detailOf(r)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="py-2 pr-3 font-medium">{t("history.date")}</th>
                <th className="py-2 pr-3 font-medium">{t("history.time")}</th>
                <th className="py-2 pr-3 font-medium">{t("history.course")}</th>
                <th className="py-2 pr-3 font-medium">{t("history.group")}</th>
                <th className="py-2 pr-3 font-medium">{t("history.status")}</th>
                <th className="py-2 pr-3 font-medium">{t("history.method")}</th>
                <th className="py-2 pr-3 font-medium">{t("history.detail")}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && pageRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    {t("history.empty")}
                  </td>
                </tr>
              )}
              {pageRecords.map((r) => {
                const meta = statusMeta[r.status];
                const StatusIcon = meta.icon;
                return (
                  <tr
                    key={r.session_id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                      {date(r.session_date)}
                    </td>
                    <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                      {r.my_check_in_time ? hhmm(r.my_check_in_time) : "-"}
                    </td>
                    <td className="py-3 pr-3 text-slate-800 font-medium whitespace-nowrap">
                      {r.course_code} {r.course_name}
                    </td>
                    <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                      {r.class_code || "-"}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${meta.cls}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {t(meta.labelKey)}
                      </span>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {r.my_method ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs">
                          <ScanFace className="w-4 h-4 text-blue-500" />
                          {methodOf(r)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap text-xs text-slate-500">
                      {detailOf(r)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-2 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            {t("common.pageInfo", {
              from: totalRecords ? start + 1 : 0,
              to: Math.min(start + PAGE_SIZE, totalRecords),
              total: totalRecords,
            })}
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </StudentLayout>
  );
}
