import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Mail, Shield, CheckCircle, ArrowRight, RefreshCw, Loader2, Building, Globe, AlertCircle } from "lucide-react";
import Confetti from "@/components/Confetti";

type VerificationType = "student" | "organizer";

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  type: VerificationType;
  onVerified: () => void;
}

type StudentStep = "selfie" | "otp" | "success";
type OrganizerStep = "details" | "otp" | "pending" | "success";

const VerificationModal = ({ open, onClose, type, onVerified }: VerificationModalProps) => {
  // Student state
  const [studentStep, setStudentStep] = useState<StudentStep>("selfie");
  const [selfieCapturing, setSelfieCapturing] = useState(false);
  const [selfieDone, setSelfieDone] = useState(false);

  // OTP state (shared)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Organizer state
  const [orgStep, setOrgStep] = useState<OrganizerStep>("details");
  const [orgName, setOrgName] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgEmail, setOrgEmail] = useState("");

  // Selfie ring progress
  const [ringProgress, setRingProgress] = useState(0);

  // Confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStudentStep("selfie");
      setOrgStep("details");
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
    }
  }, [open]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Selfie simulation
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

  // Send OTP simulation
  const sendOtp = (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    setOtpSent(true);
    setOtpError(false);
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 200);
  };

  // OTP input handler
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

  // Verify OTP simulation
  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setOtpVerifying(true);
    setTimeout(() => {
      setOtpVerifying(false);
      // Accept any 6-digit code for demo
      if (type === "student") {
        setStudentStep("success");
        setShowConfetti(true);
        localStorage.setItem("eduvibe_verified", "student");
        setTimeout(() => onVerified(), 2000);
      } else {
        setOrgStep("success");
        setShowConfetti(true);
        localStorage.setItem("eduvibe_verified", "organizer");
        setTimeout(() => onVerified(), 2000);
      }
    }, 1500);
  };

  // Organizer submit details
  const submitOrgDetails = () => {
    if (!orgName.trim() || !orgEmail.trim()) return;
    setOrgStep("otp");
    sendOtp(orgEmail);
  };

  const currentStep = type === "student" ? studentStep : orgStep;
  const totalSteps = type === "student" ? 2 : 3;
  const stepNumber =
    type === "student"
      ? studentStep === "selfie" ? 1 : studentStep === "otp" ? 2 : 2
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
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {showConfetti && <Confetti duration={3000} />}

        {/* Modal */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-card rounded-t-[2rem] sm:rounded-3xl p-6 pb-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Progress dots */}
          {currentStep !== "success" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < stepNumber
                      ? "w-8 gradient-primary"
                      : "w-4 bg-muted"
                  }`}
                />
              ))}
            </div>
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
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-xl font-extrabold text-card-foreground">Quick Selfie Check 📸</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Just a quick selfie to confirm you're real
                    </p>
                  </div>

                  {/* Selfie circle */}
                  <div className="relative w-48 h-48 my-6">
                    {/* Background ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                      <circle
                        cx="50" cy="50" r="46"
                        fill="none"
                        stroke="url(#ring-grad)"
                        strokeWidth="3"
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
                    {/* Inner circle */}
                    <div className="absolute inset-3 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {selfieCapturing ? (
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-6xl"
                        >
                          🤳
                        </motion.div>
                      ) : selfieDone ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", damping: 10 }}
                        >
                          <CheckCircle className="w-16 h-16 text-accent" />
                        </motion.div>
                      ) : (
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {!selfieDone && !selfieCapturing && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={startSelfie}
                      className="gradient-primary text-primary-foreground font-bold text-sm py-3.5 px-10 rounded-2xl cta-glow btn-pop"
                    >
                      Start Selfie Check
                    </motion.button>
                  )}

                  {selfieCapturing && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Hold still... {Math.min(Math.round(ringProgress), 100)}%
                    </p>
                  )}

                  {selfieDone && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-semibold text-accent"
                    >
                      ✅ Liveness confirmed!
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
                  <Mail className="w-8 h-8 text-primary mb-2" />
                  <h2 className="text-xl font-extrabold text-card-foreground">College Email 🎓</h2>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">
                    Enter your official college email for verification
                  </p>

                  {!otpSent ? (
                    <div className="w-full space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu"
                        className="w-full px-5 py-3.5 rounded-2xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendOtp(email)}
                        disabled={!email.trim()}
                        className="w-full gradient-primary text-primary-foreground font-bold text-sm py-3.5 rounded-2xl cta-glow btn-pop disabled:opacity-50"
                      >
                        Send OTP <ArrowRight className="w-4 h-4 inline ml-1" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      <p className="text-xs text-muted-foreground">
                        Code sent to <span className="font-semibold text-foreground">{email}</span>
                      </p>

                      {/* OTP Inputs */}
                      <div className="flex justify-center gap-2">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className={`w-11 h-13 text-center text-lg font-bold rounded-xl bg-muted text-foreground focus:outline-none focus:ring-2 transition-all ${
                              otpError ? "ring-2 ring-destructive" : "focus:ring-primary"
                            }`}
                          />
                        ))}
                      </div>

                      {otpError && (
                        <div className="flex items-center justify-center gap-1 text-destructive text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>Invalid code. Try again.</span>
                        </div>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={verifyOtp}
                        disabled={otp.join("").length < 6 || otpVerifying}
                        className="w-full gradient-primary text-primary-foreground font-bold text-sm py-3.5 rounded-2xl cta-glow btn-pop disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {otpVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify"
                        )}
                      </motion.button>

                      {/* Resend */}
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

              {/* Success */}
              {studentStep === "success" && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 8, delay: 0.2 }}
                    className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-5xl mb-4 shadow-lg"
                  >
                    🎓
                  </motion.div>
                  <h2 className="text-2xl font-black text-card-foreground">You're verified!</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Team matching, events & more are now unlocked 🚀
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-5">
                    {["Team Matching", "Join Events", "Create Teams"].map((f) => (
                      <span key={f} className="text-xs font-semibold px-4 py-2 rounded-2xl bg-accent/10 text-accent">
                        ✅ {f}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* ORGANIZER FLOW */}
          {type === "organizer" && (
            <AnimatePresence mode="wait">
              {/* Step 1: Organization details */}
              {orgStep === "details" && (
                <motion.div
                  key="org-details"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col items-center text-center"
                >
                  <Building className="w-8 h-8 text-primary mb-2" />
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
                      className="w-full px-5 py-3.5 rounded-2xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="url"
                      value={orgWebsite}
                      onChange={(e) => setOrgWebsite(e.target.value)}
                      placeholder="Website or LinkedIn (optional)"
                      className="w-full px-5 py-3.5 rounded-2xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="email"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      placeholder="Official domain email"
                      className="w-full px-5 py-3.5 rounded-2xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={submitOrgDetails}
                      disabled={!orgName.trim() || !orgEmail.trim()}
                      className="w-full gradient-primary text-primary-foreground font-bold text-sm py-3.5 rounded-2xl cta-glow btn-pop disabled:opacity-50"
                    >
                      Continue <ArrowRight className="w-4 h-4 inline ml-1" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {orgStep === "otp" && (
                <motion.div
                  key="org-otp"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex flex-col items-center text-center"
                >
                  <Mail className="w-8 h-8 text-primary mb-2" />
                  <h2 className="text-xl font-extrabold text-card-foreground">Verify Email</h2>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Code sent to <span className="font-semibold text-foreground">{orgEmail}</span>
                  </p>

                  <div className="flex justify-center gap-2 mb-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-11 h-13 text-center text-lg font-bold rounded-xl bg-muted text-foreground focus:outline-none focus:ring-2 transition-all ${
                          otpError ? "ring-2 ring-destructive" : "focus:ring-primary"
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={verifyOtp}
                    disabled={otp.join("").length < 6 || otpVerifying}
                    className="w-full gradient-primary text-primary-foreground font-bold text-sm py-3.5 rounded-2xl cta-glow btn-pop disabled:opacity-50 flex items-center justify-center gap-2"
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

              {/* Success */}
              {orgStep === "success" && (
                <motion.div
                  key="org-success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 8, delay: 0.2 }}
                    className="w-24 h-24 rounded-full gradient-secondary flex items-center justify-center text-5xl mb-4 shadow-lg"
                  >
                    🎤
                  </motion.div>
                  <h2 className="text-2xl font-black text-card-foreground">Organizer Verified!</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can now create events & manage teams 🚀
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-5">
                    {["Create Events", "Post Roles", "View Analytics"].map((f) => (
                      <span key={f} className="text-xs font-semibold px-4 py-2 rounded-2xl bg-secondary/10 text-secondary">
                        ✅ {f}
                      </span>
                    ))}
                  </div>
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
