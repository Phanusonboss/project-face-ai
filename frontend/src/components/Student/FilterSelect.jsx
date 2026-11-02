import { ChevronDown } from "lucide-react";

// ตัวเลือกกรองข้อมูล หน้าตาเดียวกับ FilterSelect ฝั่งอาจารย์ — ตัวเลือกแรก (ค่าว่าง) คือ label
export default function FilterSelect({ label, value, onChange, children }) {
  return (
    // max-w-full: ชื่อวิชายาว ๆ จะไม่ดันให้หน้ากว้างเกินจอมือถือ
    <div className="relative min-w-0 max-w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-full truncate appearance-none border border-slate-200 bg-white rounded-xl pl-4 pr-9 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <option value="">{label}</option>
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
