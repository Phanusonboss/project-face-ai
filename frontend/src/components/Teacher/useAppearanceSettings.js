import { useCallback, useEffect, useState } from "react";
import { translate } from "./translations";

const STORAGE_KEY = "cs-faceattend-appearance";

const FONT_SIZE_PX = { small: "14px", normal: "16px", large: "18px" };

const DEFAULTS = { theme: "light", language: "th", fontSize: "normal" };

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function resolveIsDark(theme) {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  // theme === "system"
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

/**
 * เรียกครั้งเดียวตอนแอปเริ่มทำงาน (เช่นบรรทัดแรก ๆ ของ main.jsx ก่อน ReactDOM.render)
 * เพื่อกันหน้าจอ "กะพริบ" กลับไปโหมดสว่างแวบหนึ่งก่อนที่ React จะ mount เสร็จ
 * ไม่บังคับต้องเรียก แต่แนะนำให้เพิ่มถ้าอยากได้ประสบการณ์ที่ลื่นกว่า
 */
export function applyStoredAppearance() {
  const { theme, fontSize } = loadStored();
  document.documentElement.classList.toggle("dark", resolveIsDark(theme));
  document.documentElement.style.fontSize = FONT_SIZE_PX[fontSize] ?? FONT_SIZE_PX.normal;
}

export function useAppearanceSettings() {
  const [settings, setSettings] = useState(loadStored);

  // ใส่/ถอด class "dark" บน <html> จริง ๆ ให้ Tailwind's dark: variant ทำงาน
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolveIsDark(settings.theme));

    if (settings.theme !== "system") return undefined;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => root.classList.toggle("dark", e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [settings.theme]);

  // ขนาดตัวอักษร: ปรับที่ root แล้วปล่อยให้หน่วย rem ทั้งแอป scale ตาม
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_PX[settings.fontSize] ?? FONT_SIZE_PX.normal;
  }, [settings.fontSize]);

  // จำค่าไว้ ไม่หายตอนรีเฟรช/สลับหน้า
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setTheme = useCallback((theme) => setSettings((s) => ({ ...s, theme })), []);
  const setLanguage = useCallback((language) => setSettings((s) => ({ ...s, language })), []);
  const setFontSize = useCallback((fontSize) => setSettings((s) => ({ ...s, fontSize })), []);

  // t("notifications.email.title") -> ข้อความในภาษาที่เลือกอยู่ตอนนี้ อัปเดตอัตโนมัติเมื่อเปลี่ยนภาษา
  const t = useCallback((key) => translate(settings.language, key), [settings.language]);

  return { ...settings, setTheme, setLanguage, setFontSize, t };
}

/*
สำคัญมาก — ต้องทำ 1 ครั้งในไฟล์ CSS หลักของโปรเจกต์ (ไฟล์ที่มี `@import "tailwindcss";`
มักจะชื่อ src/index.css หรือ src/App.css) เพิ่มบรรทัดนี้ต่อท้าย import:

  @custom-variant dark (&:where(.dark, .dark *));

เหตุผล: Tailwind v4 (ที่โปรเจกต์นี้ใช้อยู่ตาม package.json) ผูก dark: เข้ากับการตั้งค่า
ระบบปฏิบัติการ (prefers-color-scheme) โดยอัตโนมัติเท่านั้น ถ้าไม่เพิ่มบรรทัดนี้ ปุ่ม
"โหมดมืด" / "โหมดสว่าง" ที่กดเลือกเองจะไม่มีผลอะไรเลย มีแต่ "ตามระบบ" เท่านั้นที่จะทำงาน
*/