import { useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Table2,
  ListChecks,
  Trophy,
  UsersRound,
  CalendarRange,
  Layers,
  ClipboardList,
  RefreshCcw,
  Clock3,
  CheckCheck,
  Loader2,
  Info,
  BookOpen,
} from "lucide-react";
import TeacherLayout from "./TeacherLayout";
import { useAppearanceSettings } from "./useAppearanceSettings";

/* ---------- Mock data ---------- */

const dataTypeMeta = [
  { id: "attendance", icon: ClipboardList, color: "blue" },
  { id: "scores", icon: Trophy, color: "amber" },
  { id: "students", icon: UsersRound, color: "emerald" },
  { id: "summary", icon: Layers, color: "purple" },
];

const dataTypeRows = { attendance: 2845, scores: 142, students: 142, summary: 5 };

const colorMap = {
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", ring: "ring-blue-500", icon: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400", text: "text-blue-600 dark:text-blue-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", ring: "ring-amber-500", icon: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400", text: "text-amber-600 dark:text-amber-400" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", ring: "ring-emerald-500", icon: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", ring: "ring-purple-500", icon: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400", text: "text-purple-600 dark:text-purple-400" },
};

const courses = [
  { code: "CS-201", name: "Data Structures", count: 32 },
  { code: "CS-202", name: "OOP", count: 30 },
  { code: "CS-203", name: "Database Systems", count: 28 },
  { code: "CS-204", name: "AI Intro", count: 24 },
  { code: "CS-205", name: "Operating Systems", count: 14 },
];

const formats = [
  { id: "excel", icon: FileSpreadsheet, label: "Excel", ext: ".xlsx", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", ring: "ring-emerald-500" },
  { id: "csv", icon: Table2, label: "CSV", ext: ".csv", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", ring: "ring-blue-500" },
  { id: "pdf", icon: FileText, label: "PDF", ext: ".pdf", color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", ring: "ring-red-500" },
  { id: "json", icon: FileJson, label: "JSON", ext: ".json", color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800", ring: "ring-slate-400" },
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

const initialExportHistory = [
  { id: 1, name: "ประวัติการเข้าเรียน_CS-201_พ.ค.2569.xlsx", typeId: "attendance", format: "excel", date: "20 พ.ค. 2569 · 14:32", size: "184 KB" },
  { id: 2, name: "คะแนนเข้าเรียน_ทุกวิชา.pdf", typeId: "scores", format: "pdf", date: "18 พ.ค. 2569 · 09:05", size: "402 KB" },
  { id: 3, name: "รายชื่อนักศึกษา_กลุ่ม-A.csv", typeId: "students", format: "csv", date: "15 พ.ค. 2569 · 16:47", size: "21 KB" },
  { id: 4, name: "รายงานสรุปรายวิชา_1-2567.xlsx", typeId: "summary", format: "excel", date: "10 พ.ค. 2569 · 11:20", size: "96 KB" },
];

const formatIconFor = (fmt) => formats.find((f) => f.id === fmt) || formats[0];

export default function TeacherExportData() {
  const { t } = useAppearanceSettings();
  const [selectedType, setSelectedType] = useState("attendance");
  const [selectedCourses, setSelectedCourses] = useState(["CS-201", "CS-202", "CS-203", "CS-204", "CS-205"]);
  const [dateFrom, setDateFrom] = useState("2569-05-01");
  const [dateTo, setDateTo] = useState("2569-05-20");
  const [selectedFormat, setSelectedFormat] = useState("excel");
  const [status, setStatus] = useState("idle"); // idle | working | done
  const [history, setHistory] = useState(initialExportHistory);

  const dataTypes = dataTypeMeta.map((d) => ({
    ...d,
    title: t(`export.dataTypes.${d.id}.title`),
    desc: t(`export.dataTypes.${d.id}.desc`),
    fields: t(`export.fields.${d.id}`),
    rows: dataTypeRows[d.id],
  }));

  const activeType = dataTypes.find((d) => d.id === selectedType);
  const activeFormat = formats.find((f) => f.id === selectedFormat);

  const estimatedRows = useMemo(() => {
    if (selectedType === "summary") return selectedCourses.length;
    const perCourse = activeType.rows / courses.length;
    return Math.max(1, Math.round(perCourse * selectedCourses.length));
  }, [selectedType, selectedCourses, activeType]);

  function toggleCourse(code) {
    setSelectedCourses((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
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
        name: `${activeType.title.replace(/\s+/g, "")}_${selectedCourses.length === courses.length ? "all" : selectedCourses.join("-")}${activeFormat.ext}`,
        typeId: selectedType,
        format: selectedFormat,
        date: "เมื่อสักครู่",
        size: `${Math.max(12, Math.round(estimatedRows * 0.4))} KB`,
      };
      setHistory((prev) => [newFile, ...prev]);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    }, 1400);
  }

  return (
    <TeacherLayout titleIcon={Download} titleKey="nav.export" subtitleKey="export.subtitle">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ---------- Left column: steps + preview ---------- */}
        <div className="space-y-6 min-w-0">
          {/* Step 1: data type */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <StepHeader step={1} title={t("export.step1Title")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dataTypes.map((d) => {
                const c = colorMap[d.color];
                const isActive = selectedType === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedType(d.id)}
                    className={`text-left rounded-2xl border p-4 transition-all ${
                      isActive ? `border-transparent ring-2 ${c.ring} ${c.bg}` : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                        <d.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{d.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{d.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: filters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <StepHeader step={2} title={t("export.step2Title")} />

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  {t("export.coursesLabel")}
                </div>
                <button onClick={toggleAllCourses} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  {selectedCourses.length === courses.length ? t("common.actions.deselectAll") : t("common.actions.selectAll")}
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
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          checked ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {checked && <CheckCheck className="w-3 h-3 text-white" />}
                      </span>
                      {c.code}
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">({c.name})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedType !== "students" && selectedType !== "summary" && (
              <div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
                  <CalendarRange className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  {t("export.dateRangeLabel")}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                  <span className="text-slate-400 dark:text-slate-500 text-sm">{t("export.to")}</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: format */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <StepHeader step={3} title={t("export.step3Title")} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formats.map((f) => {
                const isActive = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                      isActive ? `border-transparent ring-2 ${f.ring} ${f.bg}` : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <f.icon className={`w-7 h-7 ${f.color}`} />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{f.label}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{f.ext}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("export.previewTitle")}</h3>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">{t("export.previewNote")}</span>
            </div>
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  {activeType.fields.map((f) => (
                    <th key={f} className="py-2 pr-3 font-medium whitespace-nowrap">
                      {f}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRowsByType[selectedType].map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="py-3 pr-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">{t("export.summaryTitle")}</h3>

            <div className="space-y-3 text-sm">
              <SummaryRow label={t("export.summary.dataType")} value={activeType.title} />
              <SummaryRow
                label={t("export.summary.selectedCourses")}
                value={
                  selectedCourses.length === courses.length
                    ? t("export.summary.allCourses")
                    : `${selectedCourses.length} ${t("export.summary.coursesCountSuffix")}`
                }
              />
              {selectedType !== "students" && selectedType !== "summary" && (
                <SummaryRow label={t("export.summary.dateRange")} value={`${dateFrom} — ${dateTo}`} />
              )}
              <SummaryRow label={t("export.summary.format")} value={`${activeFormat.label} (${activeFormat.ext})`} />
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">{t("export.estimatedRows")}</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{estimatedRows.toLocaleString()}</span>
            </div>

            <button
              onClick={handleExport}
              disabled={selectedCourses.length === 0 || status === "working"}
              className={`mt-5 w-full flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-3.5 rounded-xl shadow-sm transition-colors ${
                selectedCourses.length === 0
                  ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                  : status === "working"
                    ? "bg-blue-400"
                    : status === "done"
                      ? "bg-emerald-500"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-100 dark:shadow-blue-950"
              }`}
            >
              {status === "working" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("export.exporting")}
                </>
              ) : status === "done" ? (
                <>
                  <CheckCheck className="w-4 h-4" />
                  {t("export.exportSuccess")}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {t("export.exportButton")}
                </>
              )}
            </button>

            {selectedCourses.length === 0 && (
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                {t("export.selectAtLeastOne")}
              </div>
            )}
          </div>

          {/* History */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("export.historyTitle")}</h3>
              </div>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
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
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{h.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {t(`export.dataTypes.${h.typeId}.title`)} · {h.date} · {h.size}
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0">
                      {t("export.download")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

function StepHeader({ step, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{step}</span>
      <h3 className="font-bold text-slate-900 dark:text-slate-100">{title}</h3>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-slate-800 dark:text-slate-100 font-medium text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}