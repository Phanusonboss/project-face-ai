import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { isoDate, parseDate } from "../../lib/format";
import { useStudentI18n } from "./studentI18n";

/**
 * ช่องเลือกวันที่ที่แสดงตามภาษาที่เลือกในระบบ (ไทย = ชื่อเดือนไทย + ปี พ.ศ.)
 * ใช้แทน <input type="date"> เพราะปฏิทินของเบราว์เซอร์ใช้ภาษาของเบราว์เซอร์เสมอ
 *
 *   <DatePicker value="2026-10-19" onChange={setDate} min="2026-10-01" placeholder="วันที่เริ่ม" />
 *
 * value / min / max เป็นสตริง YYYY-MM-DD ("" = ยังไม่เลือก)
 */
export default function DatePicker({ value, onChange, min, max, placeholder, ariaLabel }) {
  const { t, locale } = useStudentI18n();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => monthStart(value ? parseDate(value) : new Date()));
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    if (!open) setView(monthStart(value ? parseDate(value) : new Date()));
    setOpen((v) => !v);
  };
  const pick = (iso) => {
    onChange(iso);
    setOpen(false);
  };
  const disabled = (iso) => (min && iso < min) || (max && iso > max);

  const today = isoDate();
  const label = value
    ? parseDate(value).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })
    : placeholder;
  const monthTitle = view.toLocaleDateString(locale, { month: "long", year: "numeric" });
  // หัวตาราง อา-ส (เริ่มวันอาทิตย์) ตามภาษา: 2024-01-07 เป็นวันอาทิตย์
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 7 + i).toLocaleDateString(locale, { weekday: "narrow" })
  );
  const gridStart = new Date(view.getFullYear(), view.getMonth(), 1 - view.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { iso: isoDate(d), day: d.getDate(), inMonth: d.getMonth() === view.getMonth() };
  });
  const shiftMonth = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm hover:bg-slate-50 transition-colors min-w-[150px]"
      >
        <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
        <span className={value ? "text-slate-700" : "text-slate-400"}>{label}</span>
        {value && (
          <span
            role="button"
            tabIndex={0}
            aria-label={t("datePicker.clear")}
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                onChange("");
              }
            }}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel}
          className="absolute right-0 top-full mt-2 z-30 w-72 bg-white border border-slate-100 rounded-2xl shadow-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label={t("datePicker.prevMonth")}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm font-bold text-slate-900">{monthTitle}</div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label={t("datePicker.nextMonth")}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((w, i) => (
              <div key={i} className="text-[11px] font-semibold text-slate-400 py-1">
                {w}
              </div>
            ))}
            {days.map(({ iso, day, inMonth }) => {
              const selected = iso === value;
              const off = disabled(iso);
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={off}
                  onClick={() => pick(iso)}
                  aria-label={parseDate(iso).toLocaleDateString(locale, { dateStyle: "long" })}
                  aria-pressed={selected}
                  className={`h-8 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    selected
                      ? "bg-blue-600 text-white font-semibold"
                      : iso === today
                        ? "text-blue-600 font-semibold ring-1 ring-blue-200 hover:bg-blue-50"
                        : inMonth
                          ? "text-slate-700 hover:bg-slate-100"
                          : "text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => pick("")}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              {t("datePicker.clear")}
            </button>
            <button
              type="button"
              disabled={disabled(today)}
              onClick={() => pick(today)}
              className="text-sm font-semibold text-blue-600 hover:underline disabled:opacity-40"
            >
              {t("datePicker.today")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function monthStart(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
