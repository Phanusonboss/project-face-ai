import { useState } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Save,
  Pencil,
  X,
  Trophy,
  UsersRound,
  BookMarked,
  CheckCircle2,
  Users,
} from "lucide-react";
import TeacherLayout from "./TeacherLayout";
import { useAppearanceSettings } from "./useAppearanceSettings";

const teachingCourses = [
  { code: "CS-201", name: "โครงสร้างข้อมูล (Data Structures)", term: "1/2567", students: 32, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" },
  { code: "CS-202", name: "การเขียนโปรแกรมเชิงวัตถุ (OOP)", term: "1/2567", students: 30, color: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400" },
  { code: "CS-203", name: "ฐานข้อมูล (Database Systems)", term: "1/2567", students: 28, color: "bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400" },
  { code: "CS-204", name: "ปัญญาประดิษฐ์เบื้องต้น (AI Intro)", term: "1/2567", students: 24, color: "bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400" },
  { code: "CS-205", name: "ระบบปฏิบัติการ (Operating Systems)", term: "1/2567", students: 14, color: "bg-rose-100 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400" },
];

export default function TeacherProfile() {
  const { t } = useAppearanceSettings();
  const [activeTab, setActiveTab] = useState("info");
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    firstName: "ณัฐวุฒิ",
    lastName: "ประเสริฐกุล",
    title: "อาจารย์ประจำภาควิชาวิทยาการคอมพิวเตอร์",
    department: "คณะวิทยาศาสตร์และเทคโนโลยี",
    email: "nattawut.p@university.ac.th",
    phone: "081-234-5678",
    office: "อาคาร 5 ห้อง 512",
    bio: "สอนวิชาด้านโครงสร้างข้อมูล ปัญญาประดิษฐ์ และวิศวกรรมซอฟต์แวร์ สนใจงานวิจัยด้าน Computer Vision และระบบจดจำใบหน้า",
  });

  const tabs = [
    { id: "info", label: t("profile.tabs.info") },
    { id: "security", label: t("profile.tabs.security") },
    { id: "courses", label: t("profile.tabs.courses") },
  ];

  const stats = [
    { icon: BookMarked, label: t("profile.stats.coursesTeaching"), value: "5", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-950/40" },
    { icon: UsersRound, label: t("profile.stats.totalStudents"), value: "142", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/40" },
    { icon: Trophy, label: t("profile.stats.yearsTeaching"), value: "8", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/40" },
  ];

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <TeacherLayout titleIcon={User} titleKey="nav.profile" subtitleKey="profile.subtitle">
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 items-start">
        {/* ---------- Left: profile card ---------- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 text-center xl:sticky xl:top-6">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces"
              alt="รูปโปรไฟล์"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-50 dark:ring-blue-950/40"
            />
            <button
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center ring-4 ring-white dark:ring-slate-900"
              aria-label="เปลี่ยนรูปโปรไฟล์"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="mt-4">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t("role.teacher")}{form.firstName} {form.lastName}
            </div>
            <div className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{form.title}</div>
          </div>

          <div className="mt-5 space-y-2.5 text-left">
            <InfoLine icon={Mail} value={form.email} />
            <InfoLine icon={Phone} value={form.phone} />
            <InfoLine icon={MapPin} value={form.office} />
            <InfoLine icon={CalendarDays} value={t("profile.joinedSince")} />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-1.5 ${s.bg}`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">{s.value}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Right: tabs content ---------- */}
        <div className="min-w-0 space-y-5">
          {/* Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-2 flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {saved && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4" />
              {t("profile.savedMessage")}
            </div>
          )}

          {/* ---- Tab: ข้อมูลส่วนตัว ---- */}
          {activeTab === "info" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("profile.infoTitle")}</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t("common.actions.edit")}
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                    {t("common.actions.cancel")}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t("profile.fields.firstName")} value={form.firstName} editing={editing} onChange={(v) => updateField("firstName", v)} />
                <Field label={t("profile.fields.lastName")} value={form.lastName} editing={editing} onChange={(v) => updateField("lastName", v)} />
                <Field label={t("profile.fields.title")} value={form.title} editing={editing} onChange={(v) => updateField("title", v)} full />
                <Field label={t("profile.fields.department")} value={form.department} editing={editing} onChange={(v) => updateField("department", v)} full />
                <Field label={t("profile.fields.email")} value={form.email} editing={editing} onChange={(v) => updateField("email", v)} icon={Mail} />
                <Field label={t("profile.fields.phone")} value={form.phone} editing={editing} onChange={(v) => updateField("phone", v)} icon={Phone} />
                <Field label={t("profile.fields.office")} value={form.office} editing={editing} onChange={(v) => updateField("office", v)} icon={MapPin} full />
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">{t("profile.fields.bio")}</label>
                  {editing ? (
                    <textarea
                      value={form.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{form.bio}</p>
                  )}
                </div>
              </div>

              {editing && (
                <button
                  onClick={handleSave}
                  className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-100 dark:shadow-blue-950"
                >
                  <Save className="w-4 h-4" />
                  {t("profile.saveChanges")}
                </button>
              )}
            </div>
          )}

          {/* ---- Tab: ความปลอดภัย ---- */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Lock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("profile.changePasswordTitle")}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">{t("profile.fields2.currentPassword")}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
                      />
                      <button
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                        type="button"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">{t("profile.fields2.newPassword")}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">{t("profile.fields2.confirmPassword")}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-100 dark:shadow-blue-950"
                >
                  <Save className="w-4 h-4" />
                  {t("profile.updatePassword")}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{t("profile.twoFactorTitle")}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("profile.twoFactorDesc")}</div>
                    </div>
                  </div>
                  <ToggleSwitch defaultChecked={false} />
                </div>
              </div>
            </div>
          )}

          {/* ---- Tab: รายวิชาที่สอน ---- */}
          {activeTab === "courses" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t("profile.coursesTabTitle")}</h3>
              </div>
              <div className="space-y-3">
                {teachingCourses.map((c) => (
                  <div
                    key={c.code}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${c.color}`}>
                      {c.code.split("-")[1]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{c.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {c.code} · {t("profile.termPrefix")} {c.term}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 shrink-0">
                      <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      {c.students} {t("common.units.people")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}

function InfoLine({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
      <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function Field({ label, value, editing, onChange, icon: Icon, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">{label}</label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
        />
      ) : (
        <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100 font-medium px-0.5 py-2.5">
          {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />}
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  );
}

export function ToggleSwitch({ defaultChecked = false, onChange }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => {
        setChecked((v) => {
          const next = !v;
          onChange && onChange(next);
          return next;
        });
      }}
      className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${checked ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}