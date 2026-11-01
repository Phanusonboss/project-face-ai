// สูตรคิดคะแนนเข้าเรียน + ตารางคะแนนรายคาบสำหรับ export (ใช้ร่วมกันระหว่างหน้าคะแนนและหน้าส่งออกข้อมูล)
import { termLabel } from "../../lib/format";

export const DEFAULT_SESSION_COUNT = 16;
const FINAL = new Set(["present", "late", "absent"]);

// เงื่อนไขเริ่มต้น: มาสายตั้งแต่ 5 นาที หัก 1 คะแนน, ตั้งแต่ 10 นาที หัก 2 คะแนน, ตั้งแต่ 20 นาที หัก 3 คะแนน
// (ครูปรับ/เพิ่ม/ลบเงื่อนไขได้อิสระ แยกเป็นรายวิชา)
export function defaultLateTiers() {
  return [
    { id: "tier-1", minMinutes: 5, deduction: 1 },
    { id: "tier-2", minMinutes: 10, deduction: 2 },
    { id: "tier-3", minMinutes: 20, deduction: 3 },
  ];
}

// mode "direct"     = กำหนดคะแนนเต็มรวมโดยตรง (เช่น เต็ม 10) แล้วหักคะแนนตรงในสเกลนี้เลย
// mode "perSession"  = กำหนดคะแนนเต็มต่อครั้ง (เช่น ครั้งละ 10 × 20 ครั้ง = ดิบ 200) แล้วแปลงสัดส่วนกลับมาเป็นคะแนนเต็มที่ใช้เข้าเกรด
export function defaultRule(sessionCount = DEFAULT_SESSION_COUNT) {
  return {
    mode: "direct",
    full: 10,
    sessionCount,
    sessionFull: 10,
    passThreshold: 5,
    lateTiers: defaultLateTiers(),
  };
}

// แปลงเกณฑ์จาก backend (/scores/rules/:classId) เป็นรูปแบบที่หน้าเว็บใช้
export function ruleFromServer(serverRule) {
  return {
    mode: serverRule.mode === "per_session" ? "perSession" : "direct",
    full: Number(serverRule.full_score),
    sessionCount: serverRule.session_count,
    sessionFull: Number(serverRule.session_full_score),
    passThreshold: Number(serverRule.pass_threshold),
    lateTiers: serverRule.late_tiers.map((tier) => ({
      id: `tier-${tier.id}`,
      minMinutes: tier.min_minutes,
      deduction: Number(tier.deduction),
    })),
  };
}

// หาขั้นที่ตรงกับจำนวนนาทีที่สาย (ใช้ threshold สูงสุดที่ <= นาทีที่สาย)
export function latePenaltyFor(minutes, lateTiers) {
  const applicable = [...lateTiers].filter((t) => minutes >= t.minMinutes).sort((a, b) => b.minMinutes - a.minMinutes)[0];
  return applicable ? applicable.deduction : 0;
}

// โหมด "direct": คะแนนที่หักต่อครั้งที่ขาด = คะแนนเต็ม ÷ จำนวนครั้งเช็คชื่อ (ขาดครั้งนั้นจึงได้ 0 คะแนนเสมอ)
export function directAbsentDeduction(rule) {
  return rule.sessionCount ? rule.full / rule.sessionCount : 0;
}

const round2 = (n) => Math.round(n * 100) / 100;
const SHEET_FULL = 10;

function computeScoreDirect(student, rule) {
  const latePenalty = (student.lateRecords || []).reduce((sum, m) => sum + latePenaltyFor(m, rule.lateTiers), 0);
  const absentPenalty = student.absent * directAbsentDeduction(rule);
  const raw = rule.full - latePenalty - absentPenalty;
  return Math.max(0, round2(Math.min(rule.full, raw)));
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
  return Math.max(0, round2(Math.min(rule.full, normalized)));
}

// student = { present, lateRecords: [นาทีที่สาย], absent }
export function computeScore(student, rule) {
  return rule.mode === "perSession" ? computeScorePerSession(student, rule) : computeScoreDirect(student, rule);
}

export function studentStats(rows) {
  return {
    present: rows.filter((r) => r.status === "present").length,
    lateRecords: rows.filter((r) => r.status === "late").map((r) => r.late_minutes || 0),
    absent: rows.filter((r) => r.status === "absent").length,
  };
}

// คะแนนเต็มของแต่ละคาบ: โหมด perSession = คะแนนต่อครั้ง, โหมด direct = คะแนนเต็ม ÷ จำนวนครั้ง
export function sessionFullPoints(rule) {
  return rule.mode === "perSession" ? rule.sessionFull : directAbsentDeduction(rule);
}

// คะแนนที่ได้ในคาบนั้น: มาตรงเวลา = เต็ม, มาสาย = เต็ม − หักตามขั้น, ขาด = 0
export function sessionPoints(record, rule) {
  const full = sessionFullPoints(rule);
  if (record.status === "present") return full;
  if (record.status === "late") return Math.max(0, full - latePenaltyFor(record.late_minutes || 0, rule.lateTiers));
  return 0;
}

// "2026-06-30" -> "30/6/2026" (แบบเดียวกับไฟล์ Excel ของอาจารย์)
const dmy = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d}/${m}/${y}`;
};

/**
 * ตารางคะแนนเข้าเรียนรายคาบของ 1 คลาส (รูปแบบเดียวกับใบคะแนนมาเรียนใน Excel):
 *   ลำดับที่ | รหัสนักศึกษา | ชื่อ-นามสกุล | สาขา | วันที่ 1 … วันที่ N | รวม | คะแนน (เต็ม 10) | หมายเหตุ
 *   แถวแรกใต้หัวตาราง = คะแนนเต็มของแต่ละคาบ
 *
 * students = [{ id, code, name, major, score, note }] — score คือคะแนนจริงที่ใช้ (รวมที่อาจารย์แก้เอง)
 * records  = แถว (คาบ x นักศึกษา) ของคลาสนี้
 */
export function buildScoreSheet({ cls, rule, students, records }) {
  const finalRecords = records.filter((r) => r.class_id === cls.id && FINAL.has(r.status));
  const sessions = [...new Map(finalRecords.map((r) => [r.session_id, r])).values()].sort((a, b) =>
    `${a.session_date} ${a.start_time || ""}` < `${b.session_date} ${b.start_time || ""}` ? -1 : 1
  );
  const byCell = new Map(finalRecords.map((r) => [`${r.session_id}:${r.student_id}`, r]));
  const perFull = round2(sessionFullPoints(rule));
  const totalFull = round2(perFull * sessions.length);
  // คอลัมน์คะแนนในไฟล์ใช้สเกลเต็ม 10 เสมอ (แปลงสัดส่วนจากคะแนนเต็มที่ตั้งไว้)
  const toTen = (score) => (rule.full ? round2((Number(score) / rule.full) * SHEET_FULL) : 0);

  const headers = [
    "ลำดับที่",
    "รหัสนักศึกษา",
    "ชื่อ-นามสกุล",
    "สาขา",
    ...sessions.map((s) => dmy(s.session_date)),
    "รวม",
    `คะแนน (เต็ม ${SHEET_FULL})`,
    "หมายเหตุ",
  ];
  const fullRow = ["", "", "คะแนนเต็ม", "", ...sessions.map(() => perFull), totalFull, SHEET_FULL, ""];
  const rows = students.map((s, i) => {
    const cells = sessions.map((sess) => {
      const r = byCell.get(`${sess.session_id}:${s.id}`);
      return r ? round2(sessionPoints(r, rule)) : "";
    });
    const total = round2(cells.reduce((sum, c) => sum + (c === "" ? 0 : c), 0));
    return [i + 1, s.code, s.name, s.major || "", ...cells, total, toTen(s.score), s.note || ""];
  });

  const course = `${cls.course_code || "-"} ${cls.course_name || ""}`.trim();
  return {
    title: `คะแนนเข้าเรียน ${course}`,
    subtitle: [cls.class_code && `กลุ่ม ${cls.class_code}`, `ภาคเรียน ${termLabel(cls)}`, `จำนวน ${sessions.length} ครั้ง`]
      .filter(Boolean)
      .join("  ·  "),
    headers,
    fullRow,
    rows,
    // คอลัมน์วันที่ให้แสดงหัวตารางแนวตั้งแบบในไฟล์ Excel
    verticalCols: sessions.map((_, i) => 4 + i),
  };
}
