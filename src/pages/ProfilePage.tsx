import { motion } from "framer-motion";
import { Settings, ChevronRight, ExternalLink, Shield, MapPin, CheckCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import VerificationModal from "@/components/VerificationModal";
import { useVerification, getVerificationLevel } from "@/hooks/useVerification";
import { useState } from "react";

const ProfilePage = () => {
  const skills = ["React", "Figma", "Python", "UI/UX", "AI/ML"];
  const stats = [
    { label: "Events", value: "12" },
    { label: "Teams", value: "4" },
    { label: "Certs", value: "7" },
  ];

  const { showModal, setShowModal, verificationType, requireVerification, level } = useVerification();
  const [, setForceRender] = useState(0);

  const levelConfig = {
    none: { label: "Not Verified", color: "bg-muted text-muted-foreground", icon: "🔒" },
    basic: { label: "Level 1 — Basic", color: "bg-primary/10 text-primary", icon: "🔓" },
    verified_student: { label: "Level 2 — Verified Student 🎓", color: "bg-accent/10 text-accent", icon: "🎓" },
    verified_organizer: { label: "Level 2 — Verified Organizer 🎤", color: "bg-secondary/10 text-secondary", icon: "🎤" },
  };

  const current = levelConfig[level];
  const isFullyVerified = level === "verified_student" || level === "verified_organizer";

  return (
    <div className="min-h-screen bg-background pb-20">
      <VerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        type={verificationType}
        onVerified={() => {
          setShowModal(false);
          setForceRender((p) => p + 1);
        }}
      />

      {/* Header */}
      <div className="relative h-36 gradient-primary rounded-b-[2rem]">
        <button className="absolute top-5 right-5 w-10 h-10 rounded-2xl glass flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-14">
        <div className="flex items-end gap-4 mb-4">
          <div className="relative w-24 h-24 rounded-3xl gradient-secondary flex items-center justify-center text-4xl shadow-lg border-4 border-background">
            🧑‍💻
            {isFullyVerified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-md">
                <CheckCircle className="w-4 h-4 text-accent-foreground" />
              </div>
            )}
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-extrabold">Alex Student</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>

        {/* Verification badge */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (!isFullyVerified) {
              requireVerification("student");
            }
          }}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl mb-5 ${current.color}`}
        >
          <Shield className="w-4 h-4" />
          <span className="text-xs font-semibold">{current.label}</span>
          {!isFullyVerified && <ChevronRight className="w-4 h-4 ml-auto" />}
        </motion.button>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 bg-card rounded-3xl p-4 text-center shadow-sm">
              <p className="text-xl font-extrabold text-card-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold px-4 py-2 rounded-2xl bg-muted text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Portfolio
          </h2>
          {[
            { label: "GitHub", url: "github.com/alexstudent" },
            { label: "LinkedIn", url: "linkedin.com/in/alexstudent" },
            { label: "Portfolio", url: "alexstudent.dev" },
          ].map((link) => (
            <motion.div
              key={link.label}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card shadow-sm cursor-pointer"
            >
              <div>
                <p className="text-sm font-bold text-card-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
