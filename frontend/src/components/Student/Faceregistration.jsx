import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ScanFace,
  UserPlus,
  Camera,
  Eye,
  Sun,
  Glasses,
  VenetianMask,
  MoveHorizontal,
  Info,
  Lock,
  Check,
  RotateCcw,
  Upload,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../lib/api";
import { useApi } from "../../lib/useApi";
import StudentLayout from "./StudentLayout";
import { useStudentI18n } from "./studentI18n";

// ข้อควรปฏิบัติของรูปที่ใช้ลงทะเบียน (ระบบใช้รูปหน้าตรง 1 รูป) — ข้อความอยู่ใน face.poses
const POSE_GOOD = [true, true, false, false];
const GUIDELINE_ICONS = [Eye, ScanFace, Sun, Glasses, VenetianMask, MoveHorizontal];

export default function FaceRegistration() {
  const { t } = useStudentI18n();
  const statusReq = useApi("/face/status");
  const faceStatus = statusReq.data;
  // null = ใช้ขั้นตอนตามสถานะจาก backend, ตัวเลข = ผู้ใช้กำลังทำขั้นตอนนั้นอยู่
  const [stepOverride, setStepOverride] = useState(null);
  const [photo, setPhoto] = useState(null); // { blob, url }
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ tone: "", text: "" });
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);

  const statusStep =
    faceStatus?.latest_status === "approved" ? 4 : faceStatus?.latest_status === "pending" ? 3 : 1;
  const currentStep = stepOverride ?? (statusReq.loading ? 1 : statusStep);
  const progress = Math.round(((currentStep - 1) / 3) * 100);
  const steps = t("face.steps");
  const stepText = t("face.stepText")[currentStep - 1];
  const progressText = t("face.progressText")[currentStep - 1];

  // เปิดกล้องเฉพาะตอนอยู่ขั้นที่ 1
  const cameraOn = currentStep === 1;
  useEffect(() => {
    if (!cameraOn) return undefined;
    let stream = null;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((tr) => tr.stop());
          return;
        }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setCameraError("");
      })
      .catch((err) => !cancelled && setCameraError(err.message || "camera"));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, [cameraOn]);

  // คืนหน่วยความจำของรูปตัวอย่างเมื่อเปลี่ยนรูป
  useEffect(() => () => photo && URL.revokeObjectURL(photo.url), [photo]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setMessage({ tone: "error", text: t("face.cameraWarming") });
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setPhoto({ blob, url: URL.createObjectURL(blob) });
        setMessage({ tone: "", text: "" });
        setStepOverride(2);
      },
      "image/jpeg",
      0.92
    );
  };

  const retake = () => {
    setPhoto(null);
    setMessage({ tone: "", text: "" });
    setStepOverride(1);
  };

  const submit = async () => {
    if (!photo) return;
    setBusy(true);
    setMessage({ tone: "", text: "" });
    try {
      const form = new FormData();
      form.append("file", photo.blob, "face.jpg");
      const res = await api("/face/register", { method: "POST", body: form });
      setMessage({ tone: "success", text: res.message });
      setPhoto(null);
      setStepOverride(3);
      statusReq.reload();
    } catch (err) {
      // เช่น ไม่พบใบหน้า / พบหลายใบหน้า -> ให้ถ่ายใหม่
      setMessage({ tone: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const outlineBtn =
    "flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors";

  return (
    <StudentLayout titleIcon={UserPlus} titleKey="nav.faceRegistration" subtitleKey="face.subtitle">

      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-6 overflow-x-auto">
        <div className="flex items-center min-w-[560px]">
          {steps.map(([title, sub], i) => {
            const n = i + 1;
            return (
              <React.Fragment key={n}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      n === currentStep
                        ? "bg-blue-600 text-white"
                        : n < currentStep
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {n < currentStep ? <Check className="w-4 h-4" /> : n}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`text-sm font-semibold ${n === currentStep ? "text-slate-900" : "text-slate-400"}`}>
                      {title}
                    </div>
                    <div className="text-xs text-slate-400">{sub}</div>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-200 mx-4" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main content + side cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5">
        {/* Step content */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900">{stepText[0]}</h3>
          <p className="text-sm text-slate-500 mt-1 mb-5">{stepText[1]}</p>
          {faceStatus?.latest_status === "rejected" && currentStep === 1 && (
            <div className="flex items-start gap-2 mb-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {t("face.rejected")}
            </div>
          )}
          {(message.text || statusReq.error) && (
            <div
              className={`flex items-start gap-2 mb-4 text-sm rounded-xl px-4 py-3 ${
                message.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
            >
              {message.tone === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              {message.text || statusReq.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
            {/* Camera preview */}
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0f172a]">
                {currentStep === 1 && (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                )}
                {currentStep === 2 && photo && (
                  <img src={photo.url} alt={t("face.captured")} className="w-full h-full object-cover -scale-x-100" />
                )}
                {currentStep >= 3 && (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white">
                    {currentStep === 3 ? (
                      <Clock className="w-14 h-14 text-amber-300" />
                    ) : (
                      <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                    )}
                    <div className="text-sm">{currentStep === 3 ? t("face.waitingApproval") : t("face.done")}</div>
                  </div>
                )}
                {currentStep === 1 && cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-red-300 bg-[#0f172a]/80">
                    {t("face.cameraFailed", { msg: cameraError })}
                  </div>
                )}
                {/* camera active badge */}
                {currentStep === 1 && !cameraError && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t("face.cameraOn")}
                  </div>
                )}
                {/* face frame corners */}
                <div className="absolute inset-10">
                  <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
                  <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
                  <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
                  <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />
                </div>
                {/* face mesh dots (decorative) */}
                <svg
                  className={`absolute inset-0 w-full h-full ${currentStep === 1 ? "" : "hidden"}`}
                  viewBox="0 0 400 300"
                >
                  {[
                    [175, 90], [225, 90], [200, 120], [180, 150], [220, 150],
                    [160, 70], [240, 70], [200, 70], [190, 175], [210, 175],
                    [170, 200], [230, 200], [200, 210],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="2" fill="#34d399" />
                  ))}
                  {[
                    [175, 90, 200, 70], [225, 90, 200, 70], [200, 120, 180, 150],
                    [200, 120, 220, 150], [160, 70, 175, 90], [240, 70, 225, 90],
                  ].map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#34d399" strokeWidth="1" opacity="0.6" />
                  ))}
                </svg>
              </div>

              <div className="flex items-start gap-2 mt-3 bg-blue-50 text-blue-600 text-xs rounded-xl px-4 py-3">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                {t("face.hint")}
              </div>
            </div>

            {/* Guidelines */}
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-3">{t("face.tips")}</h4>
              <div className="space-y-3">
                {t("face.guidelines").map((label, i) => {
                  const Icon = GUIDELINE_ICONS[i];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <span className="text-sm text-slate-600">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {currentStep === 1 && (
              <>
                {stepOverride === 1 && (
                  <button onClick={() => setStepOverride(null)} className={`order-2 sm:order-1 ${outlineBtn}`}>
                    {t("common.cancel")}
                  </button>
                )}
                <button
                  onClick={capture}
                  disabled={!!cameraError}
                  className="order-1 sm:order-2 sm:ml-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors text-white font-semibold px-6 py-3 rounded-xl shadow-sm shadow-blue-200"
                >
                  <Camera className="w-4 h-4" />
                  {t("face.start")}
                </button>
              </>
            )}
            {currentStep === 2 && (
              <>
                <button onClick={retake} disabled={busy} className={`order-2 sm:order-1 ${outlineBtn}`}>
                  <RotateCcw className="w-4 h-4" />
                  {t("face.retake")}
                </button>
                <button
                  onClick={submit}
                  disabled={busy}
                  className="order-1 sm:order-2 sm:ml-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white font-semibold px-6 py-3 rounded-xl shadow-sm shadow-blue-200"
                >
                  <Upload className="w-4 h-4" />
                  {busy ? t("face.checking") : t("face.submit")}
                </button>
              </>
            )}
            {currentStep >= 3 && (
              <>
                {currentStep === 4 && (
                  <Link
                    to="/checkin"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
                  >
                    <ScanFace className="w-4 h-4" />
                    {t("face.goCheckin")}
                  </Link>
                )}
                <button onClick={retake} className={`sm:ml-auto ${outlineBtn}`}>
                  <RotateCcw className="w-4 h-4" />
                  {t("face.registerAgain")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Side cards */}
        <div className="space-y-5">
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">{t("face.progress")}</h3>
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" className="stroke-slate-200" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{progress}%</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-sm font-semibold text-slate-700">{progressText[0]}</div>
              <div className="text-xs text-slate-400 mt-0.5">{progressText[1]}</div>
            </div>
          </div>

          {/* Pose examples */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">{t("face.correctPose")}</h3>
            <div className="grid grid-cols-2 gap-3">
              {t("face.poses").map((label, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-medium ${
                    POSE_GOOD[i] ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  }`}
                >
                  {POSE_GOOD[i] ? <Check className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Data security */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-2">
              <Lock className="w-4 h-4" />
              {t("face.security")}
            </div>
            <p className="text-xs text-blue-600 opacity-80 leading-relaxed">{t("face.securityDesc")}</p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
