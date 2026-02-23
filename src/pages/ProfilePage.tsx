import { motion } from "framer-motion";
import { Settings, ChevronRight, ExternalLink, Shield, MapPin, CheckCircle, Linkedin, Trophy } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import VerificationModal from "@/components/VerificationModal";
import { useVerification } from "@/hooks/useVerification";
import { mockCertificates } from "@/data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const skills = ["React", "Figma", "Python", "UI/UX", "AI/ML"];
  const stats = [
    { label: "Events", value: "12" },
    { label: "Teams", value: "4" },
    { label: "Certs", value: "7" },
  ];

  const githubContributions = [
    { lang: "TypeScript", pct: 45, color: "bg-[hsl(211,100%,65%)]" },
    { lang: "Python", pct: 30, color: "bg-accent" },
    { lang: "CSS", pct: 15, color: "bg-secondary" },
    { lang: "Other", pct: 10, color: "bg-muted-foreground" },
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

        {/* Level badge — with glow for verified */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (!isFullyVerified) {
              requireVerification("student");
            }
          }}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl mb-5 ${current.color} ${
            isFullyVerified ? "ring-2 ring-accent/40 shadow-[0_0_16px_2px_hsl(160_76%_53%/0.3)]" : ""
          }`}
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

        {/* GitHub Contributions Preview */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Contributions
          </h2>
          <div className="bg-card rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold text-card-foreground">142 contributions this month</span>
            </div>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
              {githubContributions.map((c) => (
                <div
                  key={c.lang}
                  className={`${c.color} transition-all`}
                  style={{ width: `${c.pct}%` }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {githubContributions.map((c) => (
                <div key={c.lang} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                  <span className="text-[11px] text-muted-foreground">{c.lang} {c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Preview Gallery */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Certificates
            </h2>
            <button
              onClick={() => navigate("/certificates")}
              className="text-xs font-semibold text-primary flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {mockCertificates.slice(0, 4).map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate("/certificates")}
                className="flex-shrink-0 w-28 cursor-pointer"
              >
                <div
                  className="w-28 h-20 rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-sm"
                  style={{ background: i % 2 === 0 ? "var(--gradient-primary)" : "var(--gradient-accent)" }}
                >
                  {cert.badge}
                </div>
                <p className="text-[10px] font-semibold text-card-foreground leading-tight line-clamp-2">{cert.title}</p>
              </motion.div>
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
