import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Mail, Shield, CheckCircle, ArrowRight, RefreshCw, Loader2, Building, Globe, AlertCircle, Upload, Image as ImageIcon, Sparkles, FileText, BadgeCheck, Users2, Megaphone, BarChart3, Clock, Lock, ChevronRight } from "lucide-react";
import Confetti from "@/components/Confetti";

type VerificationType = "student" | "organizer";

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  type: VerificationType;
  onVerified: () => void;
}

type StudentStep = "selfie" | "otp" | "id_upload" | "success";
type OrganizerStep = "intro" | "details" | "otp" | "documents" | "pending" | "success";
type OrgType = "college_club" | "company" | "community" | "institution";

const VerificationModal = ({ open, onClose, type, onVerified }: VerificationModalProps) => {
  const [studentStep, setStudentStep] = useState<StudentStep>("selfie");
  const [selfieCapturing, setSelfieCapturing] = useState(false);
  const [selfieDone, setSelfieDone] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [orgStep, setOrgStep] = useState<OrganizerStep>("intro");
  const [orgName, setOrgName] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgType, setOrgType] = useState<OrgType | null>(null);
  const [orgRole, setOrgRole] = useState("");
  const [docUploaded, setDocUploaded] = useState(false);
  const [docProcessing, setDocProcessing] = useState(false);
  const [docName, setDocName] = useState("");
  const [reviewProgress, setReviewProgress] = useState(0);

  const [ringProgress, setRingProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // ID upload state
  const [idUploaded, setIdUploaded] = useState(false);
  const [idProcessing, setIdProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setStudentStep("selfie");
      setOrgStep("intro");
      setSelfieDone(false);
      setSelfieCapturing(false);
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setOtpSent(false);
      setOtpVerifying(false);
      setOtpError(false);
      setResendTimer(0);
      setRingProgress(0);
      setShowConfetti(false);
      setOrgName("");
      setOrgWebsite("");
      setOrgEmail("");
      setOrgType(null);
      setOrgRole("");
      setDocUploaded(false);
      setDocProcessing(false);
      setDocName("");
      setReviewProgress(0);
      setIdUploaded(false);
      setIdProcessing(false);
    }
  }, [open]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const startSelfie = () => {
    setSelfieCapturing(true);
    setRingProgress(0);
    const interval = setInterval(() => {
      setRingProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setSelfieCapturing(false);
          setSelfieDone(true);
          setTimeout(() => setStudentStep("otp"), 800);
          return 100;
        }
        return p + 3.5;
      });
    }, 100);
  };

  const sendOtp = (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    setOtpSent(true);
    setOtpError(false);
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError(false);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setOtpVerifying(true);
    setTimeout(() => {
      setOtpVerifying(false);
      if (type === "student") {
        setStudentStep("success");
        setShowConfetti(true);
        localStorage.setItem("competa_verified", "student");
        setTimeout(() => onVerified(), 2000);
      } else {
        setOrgStep("success");
        setShowConfetti(true);
        localStorage.setItem("competa_verified", "organizer");
        setTimeout(() => onVerified(), 2000);
      }
    }, 1500);
  };

  const handleIdUpload = () => {
    setIdProcessing(true);
    setTimeout(() => {
      setIdProcessing(false);
      setIdUploaded(true);
      setTimeout(() => {
        setStudentStep("success");
        setShowConfetti(true);
        localStorage.setItem("competa_verified", "student");
        setTimeout(() => onVerified(), 2000);
      }, 800);
    }, 2000);
  };

  const submitOrgDetails = () => {
    if (!orgName.trim() || !orgEmail.trim()) return;
    setOrgStep("otp");
    sendOtp(orgEmail);
  };

  const currentStep = type === "student" ? studentStep : orgStep;
  const totalSteps = type === "student" ? 2 : 3;
  const stepNumber =
    type === "student"
      ? studentStep === "selfie" ? 1 : studentStep === "otp" || studentStep === "id_upload" ? 2 : 2
      : orgStep === "details" ? 1 : orgStep === "otp" ? 2 : orgStep === "pending" ? 3 : 3;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

        {showConfetti && <Confetti duration={3000} />}

        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="relative w-full max-w-md bg-card/90 backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-border/50"
        >
          {/* Decorative glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none gradient-primary" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Progress bar */}
          {currentStep !== "success" && (
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ width: 16 }}
                  animate={{ width: i < stepNumber ? 32 : 16 }}
                  className={`h-2 rounded-full transition-colors duration-300 ${
                    i < stepNumber ? "gradient-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
          {currentStep !== "success" && (
            <p className="text-[10px] text-muted-foreground text-center mb-5 font-medium">
              Step {stepNumber} of {totalSteps}
            </p>
          )}

          {/* STUDENT FLOW */}
          {type === "student" && (
            <AnimatePresence mode="wait">
              {/* Step 1: Selfie */}
              {studentStep === "selfie" && (
                <motion.div
                  key="selfie"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3"
                    >
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                    <h2 className="text-xl font-extrabold text-card-foreground">Quick selfie to confirm it's you 😊</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Takes just 3 seconds — no photos stored
                    </p>
                  </div>

                  {/* Selfie circle with glassmorphism */}
                  <div className="relative w-52 h-52 my-6">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                      <circle
                        cx="50" cy="50" r="46"
                        fill="none"
                        stroke="url(#ring-grad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${ringProgress * 2.89} 289`}
                        className="transition-all duration-100"
                      />
                      <defs>
                        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(252 100% 68%)" />
                          <stop offset="100%" stopColor="hsl(211 100% 65%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-3 rounded-full bg-muted/60 backdrop-blur-xl flex items-center justify-center overflow-hidden border border-border/30">
                      {selfieCapturing ? (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="text-7xl"
                        >
                          🤳
                        </motion.div>
                      ) : selfieDone ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 8 }}
                        >
                          <CheckCircle className="w-16 h-16 text-accent" />
                        </motion.div>
                      ) : (
                        <Camera className="w-14 h-14 text-muted-foreground/60" />
                      )}
                    </div>
                  </div>

                  {!selfieDone && !selfieCapturing && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startSelfie}
                      className="gradient-primary text-primary-foreground font-bold text-sm py-4 px-12 rounded-2xl cta-glow btn-pop"
                    >
                      <Camera className="w-4 h-4 inline mr-2" />
                      Start Selfie Check
                    </motion.button>
                  )}

                  {selfieCapturing && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground font-medium"
                    >
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        Hold still... {Math.min(Math.round(ringProgress), 100)}%
                      </motion.span>
                    </motion.p>
                  )}

                  {selfieDone && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-bold text-accent flex items-center gap-1"
                    >
                      <Sparkles className="w-4 h-4" /> Liveness confirmed!
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Step 2: College Email OTP */}
              {studentStep === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h2 className="text-xl font-extrabold text-card-foreground">College Email 🎓</h2>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">
                    Use your .edu or .ac.in email to verify
                  </p>

                  {!otpSent ? (
                    <div className="w-full space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu"
                        className="w-full px-5 py-4 rounded-2xl bg-muted/60 backdrop-blur-sm text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border/30"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendOtp(email)}
                        disabled={!email.trim()}
                        className="w-full gradient-primary text-primary-foreground font-bold text-sm py-4 rounded-2xl cta-glow btn-pop disabled:opacity-50"
                      >
                        Send OTP <ArrowRight className="w-4 h-4 inline ml-1" />
                      </motion.button>

                      {/* Fallback: ID upload */}
                      <button
                        onClick={() => setStudentStep("id_upload")}
                        className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mx-auto pt-1 hover:text-foreground transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        Don't have a college email? Upload ID instead
                      </button>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="bg-muted/40 rounded-2xl px-4 py-2.5 border border-border/30">
                        <p className="text-xs text-muted-foreground">
                          Code sent to <span className="font-semibold text-foreground">{email}</span>
                        </p>
                      </div>

                      <div className="flex justify-center gap-2.5">
                        {otp.map((digit, i) => (
                          <motion.input
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            ref={(el) => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className={`w-12 h-14 text-center text-xl font-bold rounded-2xl bg-muted/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 transition-all border border-border/30 ${
                              otpError ? "ring-2 ring-destructive" : "focus:ring-primary"
                            }`}
                          />
                        ))}
                      </div>

                      {otpError && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-center gap-1 text-destructive text-xs"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>Invalid code. Try again.</span>
                        </motion.div>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={verifyOtp}
                        disabled={otp.join("").length < 6 || otpVerifying}
                        className="w-full gradient-primary text-primary-foreground font-bold text-sm py-4 rounded-2xl cta-glow btn-pop disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {otpVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Verify
                          </>
                        )}
                      </motion.button>

                      <button
                        onClick={() => resendTimer === 0 && sendOtp(email)}
                        disabled={resendTimer > 0}
                        className="text-xs text-muted-foreground disabled:opacity-40 flex items-center justify-center gap-1 mx-auto"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2 Alt: ID Upload Fallback */}
              {studentStep === "id_upload" && (
                <motion.div
                  key="id_upload"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-2xl gradient-secondary flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h2 className="text-xl font-extrabold text-card-foreground">Upload College ID 🪪</h2>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">
                    We'll auto-detect your name & college
                  </p>

                  {!idUploaded ? (
                    <div className="w-full space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleIdUpload}
                        className="w-full border-2 border-dashed border-border rounded-3xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        {idProcessing ? (
                          <>
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-sm font-semibold text-foreground">Scanning your ID...</p>
                            <p className="text-xs text-muted-foreground">Auto-detecting details</p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
                              <Upload className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Tap to scan or upload</p>
                            <p className="text-xs text-muted-foreground">Camera scan • Gallery upload</p>
                          </>
                        )}
                      </motion.div>

                      <button
                        onClick={() => setStudentStep("otp")}
                        className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mx-auto hover:text-foreground transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        Use college email instead
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full space-y-3"
                    >
                      <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
                        <p className="text-sm font-bold text-accent flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> ID Verified
                        </p>
                        <div className="mt-2 space-y-1 text-left">
                          <p className="text-xs text-muted-foreground">Name: <span className="text-foreground font-medium">Alex Student</span></p>
                          <p className="text-xs text-muted-foreground">College: <span className="text-foreground font-medium">IIIT Hyderabad</span></p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Success */}
              {studentStep === "success" && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 8, delay: 0.2 }}
                    className="w-28 h-28 rounded-full gradient-primary flex items-center justify-center text-6xl mb-4 shadow-xl"
                  >
                    🎓
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-black text-card-foreground"
                  >
                    You're verified! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-muted-foreground mt-2"
                  >
                    Achievement unlocked — level up! 🚀
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-2 mt-5"
                  >
                    {["Team Matching", "Join Events", "Create Teams"].map((f, i) => (
                      <motion.span
                        key={f}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className="text-xs font-semibold px-4 py-2.5 rounded-2xl bg-accent/10 text-accent border border-accent/20"
                      >
                        ✅ {f}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* ORGANIZER FLOW */}
          {type === "organizer" && (
            <AnimatePresence mode="wait">
              {orgStep === "details" && (
                <motion.div
                  key="org-details"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-2xl gradient-secondary flex items-center justify-center mx-auto mb-3">
                    <Building className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h2 className="text-xl font-extrabold text-card-foreground">Organization Details 🎤</h2>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">
                    Tell us about your organization
                  </p>

                  <div className="w-full space-y-3">
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Organization name"
                      className="w-full px-5 py-4 rounded-2xl bg-muted/60 backdrop-blur-sm text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border/30"
                    />
                    <input
                      type="url"
                      value={orgWebsite}
                      onChange={(e) => setOrgWebsite(e.target.value)}
                      placeholder="Website or LinkedIn (optional)"
                      className="w-full px-5 py-4 rounded-2xl bg-muted/60 backdrop-blur-sm text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border/30"
                    />
                    <input
                      type="email"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      placeholder="Official domain email"
                      className="w-full px-5 py-4 rounded-2xl bg-muted/60 backdrop-blur-sm text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border/30"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={submitOrgDetails}
                      disabled={!orgName.trim() || !orgEmail.trim()}
                      className="w-full gradient-primary text-primary-foreground font-bold text-sm py-4 rounded-2xl cta-glow btn-pop disabled:opacity-50"
                    >
                      Continue <ArrowRight className="w-4 h-4 inline ml-1" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {orgStep === "otp" && (
                <motion.div
                  key="org-otp"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h2 className="text-xl font-extrabold text-card-foreground">Verify Email</h2>
                  <div className="bg-muted/40 rounded-2xl px-4 py-2.5 mt-2 mb-4 border border-border/30">
                    <p className="text-xs text-muted-foreground">
                      Code sent to <span className="font-semibold text-foreground">{orgEmail}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-2.5 mb-4">
                    {otp.map((digit, i) => (
                      <motion.input
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-2xl bg-muted/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 transition-all border border-border/30 ${
                          otpError ? "ring-2 ring-destructive" : "focus:ring-primary"
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={verifyOtp}
                    disabled={otp.join("").length < 6 || otpVerifying}
                    className="w-full gradient-primary text-primary-foreground font-bold text-sm py-4 rounded-2xl cta-glow btn-pop disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {otpVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Submit"
                    )}
                  </motion.button>

                  <button
                    onClick={() => resendTimer === 0 && sendOtp(orgEmail)}
                    disabled={resendTimer > 0}
                    className="text-xs text-muted-foreground disabled:opacity-40 flex items-center justify-center gap-1 mx-auto mt-3"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                  </button>
                </motion.div>
              )}

              {orgStep === "success" && (
                <motion.div
                  key="org-success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 8, delay: 0.2 }}
                    className="w-28 h-28 rounded-full gradient-secondary flex items-center justify-center text-6xl mb-4 shadow-xl"
                  >
                    🎤
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-black text-card-foreground"
                  >
                    Organizer Verified! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-muted-foreground mt-2"
                  >
                    You can now create events & manage teams 🚀
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-2 mt-5"
                  >
                    {["Create Events", "Post Roles", "View Analytics"].map((f, i) => (
                      <motion.span
                        key={f}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className="text-xs font-semibold px-4 py-2.5 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20"
                      >
                        ✅ {f}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationModal;
