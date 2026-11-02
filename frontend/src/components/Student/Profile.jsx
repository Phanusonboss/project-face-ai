import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ScanFace,
  UserPlus,
  User,
  CalendarDays,
  ChevronRight,
  Pencil,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  CheckCircle2,
  CalendarCheck,
  BarChart3,
  Lock,
} from "lucide-react";
import { api } from "../../lib/api";
import { useApi } from "../../lib/useApi";
import { countStatus, initial, isoDate } from "../../lib/format";
import StudentLayout from "./StudentLayout";
import { useStudentI18n } from "./studentI18n";

const FACE_BADGE_CLS = {
  approved: "bg-emerald-100 text-emerald-600",
  pending: "bg-amber-100 text-amber-600",
  rejected: "bg-red-100 text-red-600",
  none: "bg-slate-100 text-slate-500",
};

export default function Profile() {
  const { t, date } = useStudentI18n();
  const [today] = useState(() => isoDate());
  const meReq = useApi("/students/me");
  const sessionsReq = useApi(`/attendance/my-sessions?start=2000-01-01&end=${today}`, []);
  const me = meReq.data;
  const stats = countStatus(sessionsReq.data || []);
  const faceKey = FACE_BADGE_CLS[me?.face_status] ? me.face_status : "none";
  const [faceText, faceDesc] = t(`profile.faceBadge.${faceKey}`);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ tone: "", text: "" });

  const startEdit = () => {
    setPhone(me?.phone || "");
    setSaveMsg({ tone: "", text: "" });
    setEditingPhone(true);
  };

  const savePhone = async () => {
    setSaving(true);
    try {
      await api("/students/me", { method: "PUT", body: { phone: phone.trim() || null } });
      setEditingPhone(false);
      setSaveMsg({ tone: "success", text: t("profile.phoneSaved") });
      meReq.reload();
    } catch (err) {
      setSaveMsg({ tone: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const personalInfo = [
    { label: t("profile.fullName"), value: me?.full_name },
    { label: t("profile.code"), value: me?.student_code },
    { label: t("profile.email"), value: me?.email },
    { label: t("profile.phone"), value: me?.phone, editable: true },
    { label: t("profile.faculty"), value: me?.faculty },
    { label: t("profile.major"), value: me?.major },
  ];

  return (
    <StudentLayout titleIcon={User} titleKey="nav.profile" subtitleKey="profile.subtitle">

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-5 items-start">
        {/* Left: avatar card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 w-28 h-28 rounded-full bg-blue-600 text-white text-4xl font-bold flex items-center justify-center ring-4 ring-blue-50">
              {initial(me?.full_name)}
            </div>
            <div className="text-lg font-bold text-slate-900">{me?.full_name || "-"}</div>
            <div className="text-sm text-slate-400 mb-3">{t("common.role")}</div>
            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              {t("profile.studentCode", { code: me?.student_code || "-" })}
            </span>
            {meReq.error && <p className="text-sm text-red-500 mb-3">{meReq.error}</p>}
          </div>

          <div className="space-y-3 text-sm border-t border-slate-100 pt-5">
            {[
              [Mail, me?.email],
              [Phone, me?.phone],
              [Building2, me?.faculty],
              [GraduationCap, me?.major],
              [
                CalendarDays,
                t("profile.createdAt", {
                  date: me ? date(me.created_at, { day: "numeric", month: "long", year: "numeric" }) : "-",
                }),
              ],
            ].map(([Icon, value], i) => (
              <div key={i} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 truncate">{value || "-"}</span>
              </div>
            ))}
          </div>

          <button
            onClick={startEdit}
            className="w-full flex items-center justify-center gap-2 mt-6 border border-blue-200 text-blue-600 text-sm font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            {t("profile.editProfile")}
          </button>
          <p className="text-[11px] text-slate-400 mt-2 text-center">{t("profile.editNote")}</p>
        </div>

        {/* Right: personal info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900">{t("profile.personal")}</h3>
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline"
            >
              <Pencil className="w-3.5 h-3.5" />
              {t("common.edit")}
            </button>
          </div>

          {saveMsg.text && (
            <div className={`text-sm mb-3 ${saveMsg.tone === "success" ? "text-emerald-600" : "text-red-500"}`}>
              {saveMsg.text}
            </div>
          )}
          <div className="divide-y divide-slate-100">
            {personalInfo.map((f) => (
              <div key={f.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3">
                <div className="text-sm text-slate-400 w-36 shrink-0">{f.label}</div>
                {f.editable && editingPhone ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={phone}
                      autoFocus
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") savePhone();
                        if (e.key === "Escape") setEditingPhone(false);
                      }}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={savePhone}
                      disabled={saving}
                      className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-3 py-1.5 rounded-lg"
                    >
                      {t("common.save")}
                    </button>
                    <button onClick={() => setEditingPhone(false)} className="text-sm text-slate-500 px-2 py-1.5">
                      {t("common.cancel")}
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-slate-800 font-medium">{f.value || "-"}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">{t("profile.attendance")}</h3>
          <div className="space-y-2">
            <InfoRow
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label={t("profile.avgRate")}
              value={`${stats.rate.toFixed(1)}%`}
            />
            <InfoRow
              icon={<CalendarCheck className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-100"
              label={t("profile.totalChecked")}
              value={t("common.timesN", { n: stats.present + stats.late })}
            />
            <InfoRow
              icon={<BarChart3 className="w-5 h-5 text-amber-600" />}
              iconBg="bg-amber-100"
              label={t("profile.absences")}
              value={t("common.timesN", { n: stats.absent })}
            />
          </div>
        </div>

        {/* Right column stacked */}
        <div className="space-y-5">
          {/* Face registration */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">{t("profile.face")}</h3>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${FACE_BADGE_CLS[faceKey]}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {faceText}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ScanFace className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{t("profile.faceStatus")}</div>
                <div className="text-xs text-slate-500">{faceDesc}</div>
              </div>
            </div>

            <Link
              to="/face-registration"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold py-3 rounded-xl"
            >
              <UserPlus className="w-4 h-4" />
              {faceKey === "none" ? t("profile.register") : t("profile.update")}
            </Link>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">{t("profile.security")}</h3>
            <Link
              to="/settings?tab=security"
              className="w-full flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2 py-2 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800">{t("profile.changePassword")}</div>
                <div className="text-xs text-slate-400">{t("profile.changePasswordDesc")}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function InfoRow({ icon, iconBg, label, value }) {
  return (
    <Link to="/history" className="w-full flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2 py-2.5 transition-colors">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      <div className="text-left min-w-0 flex-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-base font-bold text-slate-900">{value}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
    </Link>
  );
}
