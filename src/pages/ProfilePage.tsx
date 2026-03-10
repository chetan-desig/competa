import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronRight, ExternalLink, Shield, MapPin, CheckCircle, Trophy, BarChart3, Users, Calendar, Eye, Check, Lock, Globe, UserCheck, Pencil, X, Plus, Camera } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import VerificationModal from "@/components/VerificationModal";
import { useVerification } from "@/hooks/useVerification";
import { mockCertificates, mockEvents } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { ROLES_CATALOG, RoleId } from "@/data/teamMatchingData";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type PrivacyOption = "public_inside_app" | "buddies_only" | "private";

interface ProfileData {
  name: string;
  bio: string;
  location: string;
  avatar: string;
  skills: string[];
  github: string;
  linkedin: string;
  portfolio: string;
}

const defaultProfile: ProfileData = {
  name: "Alex Student",
  bio: "",
  location: "Hyderabad, India",
  avatar: "🧑‍💻",
  skills: ["React", "Figma", "Python", "UI/UX", "AI/ML"],
  github: "github.com/alexstudent",
  linkedin: "linkedin.com/in/alexstudent",
  portfolio: "alexstudent.dev",
};

const loadProfile = (): ProfileData => {
  const stored = localStorage.getItem("competa_profile");
  if (stored) return { ...defaultProfile, ...JSON.parse(stored) };
  return defaultProfile;
};

const saveProfile = (data: ProfileData) => {
  localStorage.setItem("competa_profile", JSON.stringify(data));
};

const privacyOptions = [
  { id: "public_inside_app" as const, label: "Public", icon: Globe, desc: "Anyone in app can see" },
  { id: "buddies_only" as const, label: "Buddies Only", icon: UserCheck, desc: "Only your buddies" },
  { id: "private" as const, label: "Private", icon: Lock, desc: "Only you" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isOrganizer } = useRole();
  const { showModal, setShowModal, verificationType, requireVerification, level } = useVerification();
  const [, setForceRender] = useState(0);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyOption>("public_inside_app");

  const [primaryRole, setPrimaryRole] = useState<RoleId | null>(
    (localStorage.getItem("competa_primary_role") as RoleId) || null
  );
  const [secondaryRole, setSecondaryRole] = useState<RoleId | null>(
    (localStorage.getItem("competa_secondary_role") as RoleId) || null
  );

  const levelConfig = {
    none: { label: "Not Verified", color: "bg-muted text-muted-foreground", icon: "🔒" },
    basic: { label: "Level 1 — Basic", color: "bg-primary/10 text-primary", icon: "🔓" },
    verified_student: { label: "Verified Student 🎓", color: "bg-success/10 text-success", icon: "🎓" },
    verified_organizer: { label: "Verified Organizer 🎤", color: "bg-primary/10 text-primary", icon: "🎤" },
  };

  const current = levelConfig[level];
  const isFullyVerified = level === "verified_student" || level === "verified_organizer";

  const handleSaveRoles = () => {
    if (primaryRole) localStorage.setItem("competa_primary_role", primaryRole);
    else localStorage.removeItem("competa_primary_role");
    if (secondaryRole) localStorage.setItem("competa_secondary_role", secondaryRole);
    else localStorage.removeItem("competa_secondary_role");
    setShowRoleEditor(false);
    toast({ title: "Roles updated ✨", description: "Your role has been updated 🚀" });
  };

  const getRoleLabel = (id: RoleId) => ROLES_CATALOG.find(r => r.id === id);

  // Organizer Profile
  if (isOrganizer) {
    const orgStats = [
      { label: "Events Hosted", value: "6", icon: Calendar },
      { label: "Total Reach", value: "3.8K", icon: Eye },
      { label: "Participants", value: "1,870", icon: Users },
      { label: "Avg Rating", value: "4.8⭐", icon: BarChart3 },
    ];

    return (
      <div className="min-h-screen bg-background pb-20">
        <VerificationModal open={showModal} onClose={() => setShowModal(false)} type={verificationType} onVerified={() => { setShowModal(false); setForceRender(p => p + 1); }} />

        <div className="relative h-36 gradient-primary rounded-b-[2rem]" />

        <div className="px-5 -mt-14">
          <div className="flex items-end gap-4 mb-4">
            <div className="relative w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center text-4xl shadow-lg border-4 border-background">
              🏢
              {isFullyVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-success flex items-center justify-center shadow-md">
                  <CheckCircle className="w-4 h-4 text-success-foreground" />
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-display font-bold">TechHub Events</h1>
              <p className="text-sm text-muted-foreground font-medium">🎤 Event Organizer</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { if (!isFullyVerified) requireVerification("organizer"); }}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl mb-5 ${current.color}`}
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-bold">{current.label}</span>
            {!isFullyVerified && <ChevronRight className="w-4 h-4 ml-auto" />}
          </motion.button>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {orgStats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-xl font-display font-bold text-card-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Organization</h2>
            <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-card-foreground font-medium">Hyderabad, Telangana</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We organize hackathons, workshops, and tech events for students across India.
              </p>
              <div className="flex gap-2">
                {["Hackathons", "Workshops", "Tech Talks"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-muted text-foreground">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Top Events</h2>
            <div className="space-y-2">
              {[
                { name: "HackVerse 3.0", attendees: 450, rating: "4.9" },
                { name: "React Masterclass", attendees: 800, rating: "4.7" },
                { name: "Startup Weekend", attendees: 300, rating: "4.8" },
              ].map((ev) => (
                <div key={ev.name} className="flex items-center justify-between bg-card rounded-2xl px-4 py-3 border border-border">
                  <div>
                    <p className="text-sm font-display font-bold text-card-foreground">{ev.name}</p>
                    <p className="text-[10px] text-muted-foreground">{ev.attendees} participants</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 text-primary">⭐ {ev.rating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Links</h2>
            {[
              { label: "Website", url: "techhubevents.com" },
              { label: "LinkedIn", url: "linkedin.com/company/techhub" },
            ].map((link) => (
              <motion.div key={link.label} whileTap={{ scale: 0.98 }} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border cursor-pointer">
                <div>
                  <p className="text-sm font-display font-bold text-card-foreground">{link.label}</p>
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
  }

  // Student Profile
  const skills = ["React", "Figma", "Python", "UI/UX", "AI/ML"];
  const stats = [
    { label: "Events", value: "12" },
    { label: "Teams", value: "4" },
    { label: "Certs", value: "7" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <VerificationModal open={showModal} onClose={() => setShowModal(false)} type={verificationType} onVerified={() => { setShowModal(false); setForceRender(p => p + 1); }} />

      <div className="relative h-36 gradient-primary rounded-b-[2rem]">
        <button className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      <div className="px-5 -mt-14">
        <div className="flex items-end gap-4 mb-4">
          <div className="relative w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center text-4xl shadow-lg border-4 border-background">
            🧑‍💻
            {isFullyVerified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-success flex items-center justify-center shadow-md">
                <CheckCircle className="w-4 h-4 text-success-foreground" />
              </div>
            )}
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-display font-bold">Alex Student</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { if (!isFullyVerified) requireVerification("student"); }}
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl mb-5 ${current.color}`}
        >
          <Shield className="w-4 h-4" />
          <span className="text-sm font-bold">{current.label}</span>
          {!isFullyVerified && <ChevronRight className="w-4 h-4 ml-auto" />}
        </motion.button>

        {/* Privacy */}
        <div className="mb-5">
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Profile Visibility</h2>
          <div className="flex gap-2">
            {privacyOptions.map((opt) => {
              const Icon = opt.icon;
              const active = privacy === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPrivacy(opt.id)}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center transition-all ${
                    active ? "gradient-primary text-primary-foreground shadow-md" : "bg-card border border-border text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-2xl font-display font-bold text-card-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* XP & Achievements */}
        <div className="mb-6">
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Achievements</h2>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl gradient-gold flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-display font-bold text-card-foreground">Level 3</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">1,250 / 2,000 XP</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "62.5%" }}
                transition={{ duration: 1 }}
                className="h-full gradient-primary rounded-full"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {["🏆 Winner", "🥈 Top 10", "🎯 3x Streak", "🔥 Active"].map((badge) => (
                <span key={badge} className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-muted text-foreground whitespace-nowrap">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Buddy link */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/people")}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-display font-bold text-card-foreground">My Buddies</p>
              <p className="text-[10px] text-muted-foreground">1 connected · 1 pending</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </motion.button>

        {/* Role Management */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">Your Roles</h2>
            <button onClick={() => setShowRoleEditor(!showRoleEditor)} className="text-xs font-bold text-primary flex items-center gap-1">
              {showRoleEditor ? "Cancel" : "Edit"} <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {!showRoleEditor ? (
            <div className="flex flex-wrap gap-2">
              {primaryRole && (
                <span className="px-4 py-2.5 rounded-2xl gradient-primary text-primary-foreground text-sm font-bold flex items-center gap-2">
                  {getRoleLabel(primaryRole)?.emoji} {getRoleLabel(primaryRole)?.label}
                  <span className="text-[10px] opacity-70">Primary</span>
                </span>
              )}
              {secondaryRole && (
                <span className="px-4 py-2.5 rounded-2xl bg-card border border-border text-foreground text-sm font-bold flex items-center gap-2">
                  {getRoleLabel(secondaryRole)?.emoji} {getRoleLabel(secondaryRole)?.label}
                  <span className="text-[10px] text-muted-foreground">Secondary</span>
                </span>
              )}
              {!primaryRole && !secondaryRole && (
                <button onClick={() => setShowRoleEditor(true)} className="px-4 py-2.5 rounded-2xl bg-card border border-dashed border-border text-muted-foreground text-sm font-semibold">
                  + Set your role
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <p className="text-sm font-display font-bold text-foreground mb-2">Primary Role *</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLES_CATALOG.map((role) => (
                      <motion.button
                        key={role.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setPrimaryRole(role.id);
                          if (secondaryRole === role.id) setSecondaryRole(null);
                        }}
                        className={`px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
                          primaryRole === role.id
                            ? "gradient-primary text-primary-foreground"
                            : "bg-card text-foreground border border-border"
                        }`}
                      >
                        {role.emoji} {role.label}
                        {primaryRole === role.id && <Check className="w-4 h-4" />}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-display font-bold text-foreground mb-2">Secondary Role (optional)</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLES_CATALOG.filter(r => r.id !== primaryRole).map((role) => (
                      <motion.button
                        key={role.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSecondaryRole(secondaryRole === role.id ? null : role.id)}
                        className={`px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
                          secondaryRole === role.id
                            ? "gradient-primary text-primary-foreground"
                            : "bg-card text-foreground border border-border"
                        }`}
                      >
                        {role.emoji} {role.label}
                        {secondaryRole === role.id && <Check className="w-4 h-4" />}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSaveRoles}
                  className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl text-sm"
                >
                  Update Roles ✨
                </motion.button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="text-xs font-bold px-4 py-2.5 rounded-2xl bg-card border border-border text-foreground">{skill}</span>
            ))}
          </div>
        </div>

        {/* Certificates Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">Certificates</h2>
            <button onClick={() => navigate("/certificates")} className="text-xs font-bold text-primary flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {mockCertificates.slice(0, 4).map((cert, i) => {
              const colors = ["bg-primary/10", "bg-secondary/10", "bg-accent/10", "bg-success/10"];
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate("/certificates")}
                  className="flex-shrink-0 w-32 cursor-pointer"
                >
                  <div className={`w-32 h-24 rounded-2xl flex items-center justify-center text-3xl mb-2 ${colors[i % colors.length]}`}>
                    {cert.badge}
                  </div>
                  <p className="text-[10px] font-display font-bold text-card-foreground leading-tight line-clamp-2">{cert.title}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Links */}
        <div className="space-y-2 mb-6">
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Portfolio</h2>
          {[
            { label: "GitHub", url: "github.com/alexstudent" },
            { label: "LinkedIn", url: "linkedin.com/in/alexstudent" },
            { label: "Portfolio", url: "alexstudent.dev" },
          ].map((link) => (
            <motion.div key={link.label} whileTap={{ scale: 0.98 }} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border cursor-pointer">
              <div>
                <p className="text-sm font-display font-bold text-card-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>

        {/* Joined / Upcoming Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">My Events</h2>
            <button onClick={() => navigate("/search")} className="text-xs font-bold text-primary flex items-center gap-1">
              Browse More <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {mockEvents.slice(0, 3).map((ev) => (
              <motion.div
                key={ev.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/event/${ev.id}`)}
                className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border cursor-pointer"
              >
                <img src={ev.image} alt={ev.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-bold text-card-foreground truncate">{ev.title}</p>
                  <p className="text-[10px] text-muted-foreground">{ev.date} · {ev.location}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-success/10 text-success whitespace-nowrap">
                  Joined
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div className="mb-6">
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Past Events</h2>
          <div className="space-y-2">
            {[
              { name: "HackVerse 2.0", result: "🏆 Winner", date: "Jan 2026" },
              { name: "DesignJam 2025", result: "🎨 Top 5", date: "Nov 2025" },
              { name: "React Workshop", result: "📜 Completed", date: "Oct 2025" },
            ].map((ev) => (
              <div key={ev.name} className="flex items-center justify-between bg-card rounded-2xl px-4 py-3 border border-border">
                <div>
                  <p className="text-sm font-display font-bold text-card-foreground">{ev.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ev.date}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 text-primary">{ev.result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
