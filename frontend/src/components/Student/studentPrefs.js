// การตั้งค่าการแจ้งเตือนของนักศึกษา เก็บไว้ในเบราว์เซอร์นี้
// (ธีม/ภาษา/ขนาดตัวอักษรอยู่ใน store กลาง useAppearanceSettings)
const PREFS_KEY = "faceattend_student_prefs";

export const DEFAULT_STUDENT_PREFS = {
  notif: { checkin: true, schedule: true, announce: true },
};

export function loadStudentPrefs() {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    return { notif: { ...DEFAULT_STUDENT_PREFS.notif, ...stored.notif } };
  } catch {
    return DEFAULT_STUDENT_PREFS;
  }
}

export function saveStudentPrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}
