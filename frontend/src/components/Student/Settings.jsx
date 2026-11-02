import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BellRing,
  Palette,
  Lock,
  KeyRound,
  Globe,
  Type,
  Sun,
  Moon,
  Laptop,
  Download,
  Save,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  Info,
  ChevronDown,
  Settings as SettingsIcon,
} from "lucide-react";
import { api, API_BASE } from "../../lib/api";
import { useApi } from "../../lib/useApi";
import { downloadBlob, isoDate } from "../../lib/format";
import { useAppearanceSettings } from "../Teacher/useAppearanceSettings";
import StudentLayout from "./StudentLayout";
import { useStudentI18n } from "./studentI18n";
import { DEFAULT_STUDENT_PREFS, loadStudentPrefs, saveStudentPrefs } from "./studentPrefs";

const themeOptions = [
  { id: "light", icon: Sun },
  { id: "dark", icon: Moon },
  { id: "system", icon: Laptop },
];

const fontSizeOptions = ["small", "normal", "large"];

// สวิตช์เปิด/ปิด หน้าตาเดียวกับ ToggleSwitch ฝั่งอาจารย์ แต่เป็นแบบ controlled (รีเซ็ตแล้วสถานะเปลี่ยนตาม)
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${checked ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

export default function Settings() {
  const { t } = useStudentI18n();
  const { theme, language, fontSize, setTheme, setLanguage, setFontSize } = useAppearanceSettings();
  const [searchParams] = useSearchParams();
  const focusSection = searchParams.get("tab");
  const [notice, setNotice] = useState("");
  const [prefs, setPrefs] = useState(loadStudentPrefs);
  const { notif } = prefs;
  const [showPwForm, setShowPwForm] = useState(focusSection === "security");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ tone: "", text: "" });
  const [pwBusy, setPwBusy] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // เปิดมาจากลิงก์ ?tab=security (ปุ่ม "เปลี่ยนรหัสผ่าน" ในหน้าโปรไฟล์) ให้เลื่อนไปที่การ์ดนั้น
  useEffect(() => {
    if (focusSection) document.getElementById(`settings-${focusSection}`)?.scrollIntoView({ block: "start" });
  }, [focusSection]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  function updateNotif(patch) {
    setPrefs((prev) => {
      const next = { ...prev, notif: { ...prev.notif, ...patch } };
      saveStudentPrefs(next);
      return next;
    });
  }

  function handleSave() {
    // ธีม/ภาษา/ขนาดตัวอักษร และการแจ้งเตือน ถูกบันทึกลงเบราว์เซอร์ทันทีที่กดอยู่แล้ว (เหมือนฝั่งอาจารย์)
    setNotice("settings.saved");
  }

  function handleReset() {
    setTheme("light");
    setLanguage("th");
    setFontSize("normal");
    saveStudentPrefs(DEFAULT_STUDENT_PREFS);
    setPrefs(DEFAULT_STUDENT_PREFS);
    setNotice("settings.resetDone");
  }

  async function handleExport() {
    // ข้อมูลบัญชี รายวิชา และประวัติการเข้าเรียนจาก backend (ถ้าโหลดไม่ได้ก็ยังส่งออกการตั้งค่าได้)
    const [profile, courses, attendance] = await Promise.all([
      api("/students/me").catch(() => null),
      api("/classes/mine").catch(() => []),
      api(`/attendance/my-sessions?start=2000-01-01&end=${isoDate()}`).catch(() => []),
    ]);
    const data = {
      exportedAt: new Date().toISOString(),
      profile,
      courses,
      attendance,
      notifications: notif,
      display: { theme, language, fontSize },
    };
    downloadBlob("account-data.json", new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  }

  async function changePassword() {
    if (pw.next.length < 6) return setPwMsg({ tone: "error", text: t("settings.pwTooShort") });
    if (pw.next !== pw.confirm) return setPwMsg({ tone: "error", text: t("settings.pwMismatch") });
    setPwBusy(true);
    try {
      await api("/auth/change-password", {
        method: "POST",
        body: { current_password: pw.current, new_password: pw.next },
      });
      setPw({ current: "", next: "", confirm: "" });
      setShowPwForm(false);
      setPwMsg({ tone: "success", text: t("settings.pwChanged") });
    } catch (err) {
      setPwMsg({ tone: "error", text: err.message });
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <StudentLayout titleIcon={SettingsIcon} titleKey="settings.title" subtitleKey="settings.subtitle">
      {notice && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4" />
          {t(notice)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* ---- Notifications ---- */}
        <SectionCard id="notifications" icon={BellRing} title={t("settings.notifications")} color="blue">
          {[
            ["checkin", "settings.notifCheckin"],
            ["schedule", "settings.notifSchedule"],
            ["announce", "settings.notifAnnounce"],
          ].map(([key, textKey], i, arr) => {
            const [title, desc] = t(textKey);
            return (
              <ToggleRow
                key={key}
                title={title}
                desc={desc}
                checked={notif[key]}
                onChange={(v) => updateNotif({ [key]: v })}
                last={i === arr.length - 1}
              />
            );
          })}
        </SectionCard>

        {/* ---- Display & language ---- */}
        <SectionCard id="display" icon={Palette} title={t("settings.display")} color="purple">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">{t("settings.theme")}</label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  aria-pressed={theme === opt.id}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                    theme === opt.id
                      ? "border-transparent ring-2 ring-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <opt.icon className="w-5 h-5 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">{t(`settings.${opt.id}`)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="settings-language"
              className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              {t("settings.language")}
            </label>
            <select
              id="settings-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {/* ชื่อภาษาในตัวเลือกนี้แสดงเป็นชื่อของภาษานั้น ๆ เอง ไม่แปลตามภาษาที่เลือกอยู่ */}
              <option value="th">ภาษาไทย</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              {t("settings.fontSize")}
            </label>
            <div className="flex gap-2">
              {fontSizeOptions.map((id) => (
                <button
                  key={id}
                  onClick={() => setFontSize(id)}
                  aria-pressed={fontSize === id}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    fontSize === id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t(`settings.${id}`)}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ---- Security ---- */}
        <SectionCard id="security" icon={KeyRound} title={t("settings.security")} color="emerald">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800">{t("settings.changePassword")}</div>
              <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t("settings.changePasswordDesc")}</div>
            </div>
            <button
              onClick={() => {
                setShowPwForm((v) => !v);
                setPwMsg({ tone: "", text: "" });
              }}
              className="border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl shrink-0"
            >
              {showPwForm ? t("common.cancel") : t("settings.changePassword")}
            </button>
          </div>
          {pwMsg.text && (
            <div className={`text-sm mt-3 ${pwMsg.tone === "success" ? "text-emerald-600" : "text-red-500"}`}>
              {pwMsg.text}
            </div>
          )}
          {showPwForm && (
            <form
              className="space-y-2.5 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                changePassword();
              }}
            >
              {[
                ["current", t("settings.pwCurrent"), "current-password"],
                ["next", t("settings.pwNew"), "new-password"],
                ["confirm", t("settings.pwConfirm"), "new-password"],
              ].map(([key, label, autoComplete]) => (
                <input
                  key={key}
                  type="password"
                  placeholder={label}
                  aria-label={label}
                  autoComplete={autoComplete}
                  value={pw[key]}
                  onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ))}
              <button
                type="submit"
                disabled={pwBusy || !pw.current || !pw.next}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white text-sm font-semibold py-2.5 rounded-xl"
              >
                {pwBusy ? t("settings.saving") : t("settings.savePw")}
              </button>
            </form>
          )}
        </SectionCard>

        {/* ---- Privacy & data ---- */}
        <SectionCard id="privacy" icon={Lock} title={t("settings.privacy")} color="rose">
          <p className="text-xs text-slate-500 leading-relaxed">{t("settings.privacyDesc")}</p>
          <button
            onClick={handleExport}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl"
          >
            <Download className="w-4 h-4" />
            {t("settings.download")}
          </button>
          <button
            onClick={handleReset}
            className="mt-2 w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl"
            title={t("settings.resetDesc")}
          >
            <RotateCcw className="w-4 h-4" />
            {t("settings.reset")}
          </button>
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">{t("settings.deleteAccountDesc")}</p>
        </SectionCard>

        {/* ---- Help ---- */}
        <SectionCard id="help" icon={HelpCircle} title={t("settings.help")} color="blue">
          <div className="divide-y divide-slate-100 -my-3">
            {t("settings.faq").map(([q, a], i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-slate-800"
                >
                  {q}
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && <p className="text-xs text-slate-500 pb-3 leading-relaxed">{a}</p>}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ---- About ---- */}
        <SectionCard id="about" icon={Info} title={t("settings.about")} color="emerald">
          <AboutSystem />
        </SectionCard>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-200"
        >
          <Save className="w-4 h-4" />
          {t("settings.saveAll")}
        </button>
      </div>
    </StudentLayout>
  );
}

// ข้อมูลระบบ + สถานะเซิร์ฟเวอร์จริงจาก backend
function AboutSystem() {
  const { t } = useStudentI18n();
  const { data, error, loading } = useApi("/");
  const rows = [
    [t("settings.version"), "2.0.0"],
    [
      t("settings.server"),
      <span key="s" className={`inline-flex items-center gap-1.5 ${error ? "text-red-500" : "text-emerald-600"}`}>
        <span className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : "bg-emerald-500"}`} />
        {loading ? t("common.loading") : error ? "offline" : data?.status || "ok"}
      </span>,
    ],
    ["API", <span key="a" className="break-all">{API_BASE}</span>],
  ];
  return (
    <>
      <p className="text-xs text-slate-500 leading-relaxed mb-2">{t("settings.aboutDesc")}</p>
      <div className="divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-800 font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function SectionCard({ id, icon: Icon, title, color, children }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-500",
  };
  return (
    <div id={`settings-${id}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 scroll-mt-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange, last }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-3 ${!last ? "border-b border-slate-100" : ""}`}>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}
