import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  const navBtn =
    "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className={navBtn}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === i + 1 ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className={navBtn}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
