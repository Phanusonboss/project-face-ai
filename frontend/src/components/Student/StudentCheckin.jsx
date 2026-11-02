import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import {
  ScanFace,
  User,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Users,
  ArrowRight,
  Code2,
} from "lucide-react";
import StudentLayout from "./StudentLayout";
import { useStudentI18n } from "./studentI18n";

const hhmm = (t) => (t ? t.slice(0, 5) : "--:--");
const dateHHMM = (iso) => (iso ? iso.slice(11, 16) : "--:--");

// สถานะของคาบเรียนวันนี้ (จาก /attendance/my-sessions) สำหรับแสดงในรายการ
function sessionBadge(s, now) {
  if (s.my_status === "present") return { status: "success", badgeKey: "common.status.present" };
  if (s.my_status === "late") return { status: "late", badgeKey: "common.status.late" };
  if (s.my_status === "absent") return { status: "absent", badgeKey: "common.status.absent" };
  if (s.open_at && now < new Date(s.open_at)) return { status: "absent", badgeKey: "common.status.upcoming" };
  if (s.close_at && now > new Date(s.close_at)) return { status: "absent", badgeKey: "common.status.closed" };
  return { status: "late", badgeKey: "common.status.open" };
}

export default function CheckIn() {
  const { t } = useStudentI18n();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cameraError, setCameraError] = useState(null);
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // idle | scanning | success | error
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null); // { status, confidence } | { message }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadSessions = async () => {
    try {
      setSessions(await api("/attendance/my-sessions"));
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    }
  };

  // โหลดคาบเรียนวันนี้ แล้วเลือกคาบที่เปิดอยู่และยังไม่ได้เช็คชื่อเป็นค่าเริ่มต้น
  useEffect(() => {
    let cancelled = false;
    api("/attendance/my-sessions")
      .then((data) => {
        if (cancelled) return;
        setSessions(data);
        const best = data.find((s) => s.is_open && !s.my_status) || data.find((s) => s.is_open) || data[0];
        setSelectedId(best ? best.session_id : null);
      })
      .catch((err) => !cancelled && setLoadError(err.message))
      .finally(() => !cancelled && setSessionsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // เปิดกล้องจริงของเครื่อง (cameraAttempt เปลี่ยน = กด "ลองอีกครั้ง")
  useEffect(() => {
    let cancelled = false;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        if (!cancelled) setCameraError(err.message || "camera");
      }
    }
    startCamera();
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((tr) => tr.stop());
        streamRef.current = null;
      }
    };
  }, [cameraAttempt]);

  const selected = sessions.find((s) => s.session_id === selectedId) || null;
  const closeAt = selected?.close_at ? new Date(selected.close_at) : null;
  const isOpenNow =
    !!selected &&
    (!selected.open_at || currentTime >= new Date(selected.open_at)) &&
    (!closeAt || currentTime <= closeAt);
  const alreadyChecked = !!selected?.my_status;
  const canScan = isOpenNow && !alreadyChecked && !cameraError && phase !== "scanning";

  const getRemainingMinutes = () => {
    if (!closeAt) return "-";
    const diff = closeAt - currentTime;
    if (diff <= 0) return "0:00";
    return `${Math.floor(diff / 60000)}:${String(Math.floor((diff % 60000) / 1000)).padStart(2, "0")}`;
  };

  // ถ่ายภาพจากวิดีโอ (ภาพจริง ไม่กลับด้านแบบที่แสดงบนจอ) เพื่อส่งให้ backend ตรวจใบหน้า
  const captureFrame = () =>
    new Promise((resolve, reject) => {
      const video = videoRef.current;
      if (!video || !video.videoWidth) {
        reject(new Error(t("checkin.cameraWarming")));
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error(t("checkin.captureFailed")))),
        "image/jpeg",
        0.92
      );
    });

  const handleScan = async () => {
    if (!selected) return;
    setPhase("scanning");
    setResult(null);
    try {
      const blob = await captureFrame();
      const form = new FormData();
      form.append("file", blob, "checkin.jpg");
      const res = await api(`/attendance/checkin?session_id=${selected.session_id}`, {
        method: "POST",
        body: form,
      });
      setPhase("success");
      setResult({ status: res.status, confidence: Number(res.confidence).toFixed(1) });
      loadSessions();
    } catch (err) {
      setPhase("error");
      setResult({ message: err.message });
    }
  };

  const retryCamera = () => {
    setCameraError(null);
    setCameraAttempt((n) => n + 1);
  };

  const successText = () =>
    result
      ? `${t(result.status === "late" ? "checkin.resultLate" : "checkin.resultPresent")} (${t("common.confidence", {
          n: result.confidence,
        })})`
      : "";

  const getToastContent = () => {
    if (phase === "scanning")
      return {
        icon: "⟳",
        scanning: true,
        tone: "blue",
        title: t("checkin.toastScanning"),
        subtitle: t("checkin.toastHoldStill"),
      };
    if (phase === "success")
      return {
        icon: "✓",
        scanning: false,
        tone: "green",
        title: `${t("checkin.toastSuccess")} • ${selected?.course_code ?? ""}`,
        subtitle: successText(),
      };
    if (phase === "error")
      return { icon: "!", scanning: false, tone: "red", title: t("checkin.toastError"), subtitle: result?.message };
    if (alreadyChecked)
      return {
        icon: "✓",
        scanning: false,
        tone: "green",
        title: t("checkin.alreadyChecked"),
        subtitle: t("checkin.toastAtTime", { time: hhmm(selected.my_check_in_time) }),
      };
    return {
      icon: "◎",
      scanning: false,
      tone: "blue",
      title: t("checkin.toastReady"),
      subtitle: t("checkin.toastReadyHint"),
    };
  };

  const toast = getToastContent();
  const borderColor =
    phase === "success" || alreadyChecked ? "#22c55e" : phase === "error" ? "#ef4444" : "#3b82f6";
  const toastBg = { blue: "bg-blue-600", green: "bg-emerald-600", red: "bg-red-600" }[toast.tone];
  const historyItems = sessions.map((s) => ({
    id: s.session_id,
    time: s.my_check_in_time ? s.my_check_in_time.slice(0, 8) : hhmm(s.start_time),
    code: s.course_code,
    name: s.course_name,
    ...sessionBadge(s, currentTime),
  }));

  const statusIcon = (s) => {
    if (s === "success") return <CheckCircle2 className="w-4 h-4" />;
    if (s === "late") return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };
  const statusBg = (s) => {
    if (s === "success") return "bg-emerald-50 text-emerald-600";
    if (s === "late") return "bg-amber-50 text-amber-600";
    return "bg-slate-100 text-slate-400";
  };

  return (
    <StudentLayout titleIcon={ScanFace} titleKey="nav.checkin" subtitleKey="checkin.subtitle">

      <div className="grid gap-6 xl:grid-cols-[1.95fr_1fr]">
        {/* ===== LEFT COLUMN ===== */}
        <div className="space-y-5 min-w-0">
          {/* Combined status + camera card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Status bar */}
            <div className="bg-gradient-to-r from-blue-50 to-transparent px-6 py-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-400 shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  {selected ? (
                    <>
                      {/* วิชาที่กำลังเช็คชื่อ — แสดงชัด ๆ ก่อนกดสแกน */}
                      <div
                        className={`text-xs font-semibold ${
                          alreadyChecked ? "text-emerald-600" : isOpenNow ? "text-blue-600" : "text-slate-500"
                        }`}
                      >
                        {alreadyChecked
                          ? t("checkin.alreadyChecked")
                          : isOpenNow
                            ? t("checkin.checkingInto")
                            : t("checkin.notAvailable")}
                      </div>
                      <div className="text-lg font-bold text-slate-900 leading-snug line-clamp-2" title={selected.course_name}>
                        <span className="text-blue-600">{selected.course_code}</span> {selected.course_name}
                      </div>
                      <div className="text-xs text-slate-500 leading-snug truncate">
                        {[
                          selected.teacher_name,
                          `${t("checkin.group")} ${selected.class_code || "-"}`,
                          `${hhmm(selected.start_time)}${selected.end_time ? ` - ${hhmm(selected.end_time)}` : ""}`,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-base font-bold text-slate-900">
                        {sessionsLoading ? t("checkin.loadingSessions") : t("checkin.noSessionToday")}
                      </div>
                      <div className="text-xs text-slate-500 leading-snug">
                        {loadError || t("checkin.waitForTeacher")}
                      </div>
                    </>
                  )}
                  {sessions.length > 1 && (
                    <select
                      value={selectedId ?? ""}
                      onChange={(e) => {
                        setSelectedId(Number(e.target.value));
                        setPhase("idle");
                      }}
                      aria-label={t("checkin.changeCourse")}
                      className="mt-2 max-w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                    >
                      {sessions.map((s) => (
                        <option key={s.session_id} value={s.session_id}>
                          {s.course_code} {s.course_name} ({hhmm(s.start_time)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selected && (
                  <div className="ml-auto shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] text-slate-500">{t("checkin.window")}</div>
                      <div className="text-xl font-bold text-slate-900">{dateHHMM(selected.open_at)}</div>
                      <div className="text-sm text-slate-400">-</div>
                      <div className="text-xl font-bold text-slate-900">{dateHHMM(selected.close_at)}</div>
                      {isOpenNow ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {t("checkin.openNow")}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          {t("checkin.closedNow")}
                        </div>
                      )}
                    </div>
                    {isOpenNow && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-[10px] text-slate-500">{t("checkin.remaining")}</div>
                        <div className="text-sm font-bold text-blue-600">
                          {t("checkin.minutes", { n: getRemainingMinutes() })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Camera section — live feed */}
            <div
              className="relative flex items-center justify-center"
              style={{ background: "linear-gradient(180deg, #0c1929, #162236)", minHeight: 420 }}
            >
              {/* Camera status indicator */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${cameraError ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}
                />
                <span className="text-sm text-white/90 font-medium">
                  {cameraError ? t("checkin.cameraNotReady") : t("checkin.cameraOn")}
                </span>
              </div>

              {cameraError ? (
                <div className="flex flex-col items-center justify-center gap-3 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="text-sm font-semibold text-white">{t("checkin.cameraFailed")}</div>
                  <div className="text-xs text-white/60 max-w-xs">{cameraError}</div>
                  <div className="text-xs text-white/50 max-w-xs">{t("checkin.cameraAllow")}</div>
                  <button
                    onClick={retryCamera}
                    className="mt-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {t("checkin.retry")}
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 420 }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover absolute inset-0"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {/* Detection frame overlay */}
                  <div
                    className="absolute rounded-2xl transition-all duration-500"
                    style={{
                      top: "10%",
                      left: "25%",
                      right: "25%",
                      bottom: "10%",
                      border: `2.5px solid ${borderColor}`,
                      boxShadow: `0 0 25px ${borderColor}33`,
                    }}
                  >
                    {[
                      "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-lg",
                      "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-lg",
                      "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-lg",
                      "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-lg",
                    ].map((pos, i) => (
                      <div key={i} className={`absolute w-6 h-6 ${pos}`} style={{ borderColor }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Status toast */}
              {!cameraError && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-black/65 backdrop-blur-xl px-5 py-3 rounded-full">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm shrink-0 ${toastBg} ${
                      toast.scanning ? "animate-spin" : ""
                    }`}
                    style={toast.scanning ? { animationDuration: "2s" } : undefined}
                  >
                    {toast.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white leading-snug">{toast.title}</div>
                    <div className="text-xs text-white/60">{toast.subtitle}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Tip */}
            <div className="flex items-center gap-3 px-5 py-3 bg-sky-50 border-t border-sky-100">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <span className="text-sm text-sky-700">{t("checkin.tip")}</span>
            </div>

            {/* Scan */}
            <div className="px-6 py-4 border-t border-slate-100">
              <button
                onClick={handleScan}
                disabled={!canScan}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
              >
                <ScanFace className="w-5 h-5" />
                <span className="truncate">
                  {phase === "scanning"
                    ? t("checkin.scanning")
                    : alreadyChecked
                      ? t("checkin.alreadyChecked")
                      : phase === "error"
                        ? t("checkin.scanAgain")
                        : selected
                          ? t("checkin.scanFor", { course: `${selected.course_code} ${selected.course_name}` })
                          : t("checkin.scan")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="space-y-5 min-w-0">
          {/* Subject info */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-slate-900">{t("checkin.courseInfo")}</div>
            </div>

            {selected ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">{selected.course_code}</div>
                    <div className="text-xs text-slate-500">{selected.course_name}</div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <InfoLine icon={User} value={selected.teacher_name || "-"} label={t("checkin.teacher")} />
                  <InfoLine icon={Users} value={selected.class_code || "-"} label={t("checkin.group")} />
                  <InfoLine
                    icon={Clock}
                    value={`${hhmm(selected.start_time)}${selected.end_time ? ` - ${hhmm(selected.end_time)}` : ""}`}
                    label={t("checkin.timeToday")}
                  />
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-400">{t("checkin.noOpenSession")}</div>
            )}
          </div>

          {/* Steps */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="text-sm font-semibold text-slate-900 mb-4">{t("checkin.stepsTitle")}</div>
            <ol className="space-y-4 text-sm text-slate-600">
              {["checkin.step1", "checkin.step2", "checkin.step3"].map((key, i) => (
                <li key={key} className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Today's history */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-slate-900">{t("checkin.todaySessions")}</div>
            </div>
            <div className="space-y-3">
              {historyItems.length === 0 && <div className="text-xs text-slate-400">{t("checkin.noTodaySessions")}</div>}
              {historyItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setPhase("idle");
                  }}
                  className={`w-full text-left flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                    item.id === selectedId ? "bg-blue-50 ring-1 ring-blue-200" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${statusBg(item.status)}`}
                    >
                      {statusIcon(item.status)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900">{item.time}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {item.code} {item.name}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${statusBg(item.status)}`}
                  >
                    {t(item.badgeKey)}
                  </span>
                </button>
              ))}
            </div>

            <Link
              to="/history"
              className="flex items-center justify-center gap-1 mt-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-blue-500 hover:bg-blue-50 transition-colors"
            >
              {t("checkin.allHistory")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function InfoLine({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-slate-900 font-semibold">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}
