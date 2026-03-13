import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronRight, ExternalLink, Shield, MapPin, CheckCircle, Users, Calendar, Eye, Check, Lock, Globe, UserCheck, Pencil, X, Plus, Camera, BarChart3, Sparkles, Award } from "lucide-react";
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
  try {
    const stored = localStorage.getItem("competa_profile");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultProfile,
        ...parsed,
        skills: Array.isArray(parsed.skills) ? parsed.skills : defaultProfile.skills,
      };
    }
  } catch (e) {
    console.error("Failed to load profile:", e);
  }
  return { ...defaultProfile };
};

const saveProfile = (data: ProfileData) => {
  localStorage.setItem("competa_profile", JSON.stringify(data));
};

const privacyOptions = [
  { id: "public_inside_app" as const, label: "Public", icon: Globe, desc: "Anyone in app can see" },
  { id: "buddies_only" as const, label: "Buddies", icon: UserCheck, desc: "Only your buddies" },
  { id: "private" as const, label: "Private", icon: Lock, desc: "Only you" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isOrganizer } = useRole();
  const { showModal, setShowModal, verificationType, requireVerification, level } = useVerification();
  const [, setForceRender] = useState(0);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyOption>("public_inside_app");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(loadProfile);
  const [editDraft, setEditDraft] = useState<ProfileData>(profile);
  const [newSkill, setNewSkill] = useState("");

  const [primaryRole, setPrimaryRole] = useState<RoleId | null>(
    (localStorage.getItem("competa_primary_role") as RoleId) || null
  );
  const [secondaryRole, setSecondaryRole] = useState<RoleId | null>(
    (localStorage.getItem("competa_secondary_role") as RoleId) || null
  );

  const openEditProfile = () => {
    setEditDraft({ ...profile });
    setNewSkill("");
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    setProfile(editDraft);
    saveProfile(editDraft);
    setShowEditProfile(false);
    toast({ title: "Profile updated ✨", description: "Your changes have been saved" });
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !editDraft.skills.includes(trimmed)) {
      setEditDraft({ ...editDraft, skills: [...editDraft.skills, trimmed] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setEditDraft({ ...editDraft, skills: editDraft.skills.filter(s => s !== skill) });
  };

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
      <div className="min-h-screen bg-background pb-24">
        <VerificationModal open={showModal} onClose={() => setShowModal(false)} type={verificationType} onVerified={() => { setShowModal(false); setForceRender(p => p + 1); }} />

        <div className="relative h-56 gradient-primary rounded-b-[3rem] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        </div>

        <div className="px-6 -mt-20 relative z-10">
          <div className="flex items-end gap-5 mb-8">
            <div className="relative w-32 h-32 rounded-[2.5rem] bg-card flex items-center justify-center text-6xl shadow-2xl border-4 border-background shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              🏢
              {isFullyVerified && (
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-success flex items-center justify-center shadow-lg border-2 border-background">
                  <CheckCircle className="w-5 h-5 text-success-foreground" />
                </div>
              )}
            </div>
            <div className="pb-4">
              <h1 className="text-3xl font-display font-bold text-foreground leading-tight tracking-tight">TechHub Events</h1>
              <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/5 w-fit mt-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Event Organizer
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { if (!isFullyVerified) requireVerification("organizer"); }}
            className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] mb-8 shadow-lg shadow-primary/5 transition-all hover:shadow-primary/10 ${current.color} border border-white/10`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Account Status</p>
              <p className="text-sm font-bold tracking-tight">{current.label}</p>
            </div>
            {!isFullyVerified && <ChevronRight className="w-5 h-5 ml-auto opacity-50" />}
          </motion.button>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {orgStats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-card rounded-[2rem] p-6 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-display font-bold text-card-foreground leading-none">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mt-3">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mb-10">
            <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Organization</h2>
            <div className="bg-card rounded-[2.5rem] p-8 border border-border/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className="relative space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-card-foreground font-bold">Hyderabad, Telangana</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  We organize premium hackathons, intensive workshops, and high-impact tech events for ambitious students across India.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {["Hackathons", "Workshops", "Tech Talks"].map((tag) => (
                    <span key={tag} className="text-[10px] font-bold px-4 py-2 rounded-xl bg-muted/50 text-foreground border border-border/50 hover:bg-primary hover:text-white transition-colors cursor-default">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-widest mb-4">Top Events</h2>
            <div className="space-y-3">
              {[
                { name: "HackVerse 3.0", attendees: 450, rating: "4.9", color: "bg-primary/10" },
                { name: "React Masterclass", attendees: 800, rating: "4.7", color: "bg-secondary/10" },
                { name: "Startup Weekend", attendees: 300, rating: "4.8", color: "bg-accent/10" },
              ].map((ev) => (
                <div key={ev.name} className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border shadow-sm hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${ev.color} flex items-center justify-center text-lg`}>
                      🔥
                    </div>
                    <div>
                      <p className="text-sm font-display font-bold text-card-foreground">{ev.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{ev.attendees} participants</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/5">⭐ {ev.rating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-widest mb-4">Links</h2>
            {[
              { label: "Website", url: "techhubevents.com", icon: Globe },
              { label: "LinkedIn", url: "linkedin.com/company/techhub", icon: Users },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.label} whileTap={{ scale: 0.98 }} className="flex items-center justify-between p-5 rounded-2x border border-border bg-card shadow-sm hover:border-primary/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-display font-bold text-card-foreground">{link.label}</p>
                      <p className="text-[11px] text-muted-foreground">{link.url}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50" />
                </motion.div>
              );
            })}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Student Profile
  const stats = [
    { label: "Events", value: "12", icon: Calendar },
    { label: "Teams", value: "4", icon: Users },
    { label: "Certs", value: "7", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <VerificationModal open={showModal} onClose={() => setShowModal(false)} type={verificationType} onVerified={() => { setShowModal(false); setForceRender(p => p + 1); }} />

      {/* Edit Profile Sheet */}
      <Sheet open={showEditProfile} onOpenChange={setShowEditProfile}>
        <SheetContent side="bottom" className="rounded-t-[2rem] max-h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg font-display font-bold">Edit Profile</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 pb-6">
            <div className="flex justify-center">
              <div className="relative w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-4xl">
                {editDraft.avatar}
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <Input value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} placeholder="Your full name" className="rounded-xl border-border" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bio</Label>
              <Textarea value={editDraft.bio} onChange={(e) => setEditDraft({ ...editDraft, bio: e.target.value })} placeholder="Tell people about yourself..." className="rounded-xl border-border resize-none" rows={3} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</Label>
              <Input value={editDraft.location} onChange={(e) => setEditDraft({ ...editDraft, location: e.target.value })} placeholder="City, Country" className="rounded-xl border-border" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editDraft.skills.map((skill) => (
                  <span key={skill} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 text-primary flex items-center gap-1.5">
                    {skill}
                    <button onClick={() => removeSkill(skill)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill..." className="rounded-xl border-border flex-1" />
                <motion.button whileTap={{ scale: 0.95 }} onClick={addSkill} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-primary-foreground" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Portfolio Links</Label>
              <Input value={editDraft.github} onChange={(e) => setEditDraft({ ...editDraft, github: e.target.value })} placeholder="GitHub URL" className="rounded-xl border-border" />
              <Input value={editDraft.linkedin} onChange={(e) => setEditDraft({ ...editDraft, linkedin: e.target.value })} placeholder="LinkedIn URL" className="rounded-xl border-border" />
              <Input value={editDraft.portfolio} onChange={(e) => setEditDraft({ ...editDraft, portfolio: e.target.value })} placeholder="Portfolio URL" className="rounded-xl border-border" />
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveProfile} className="w-full gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl text-sm">
              Save Profile ✨
            </motion.button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Hero Header */}
      <div className="relative h-56 gradient-primary rounded-b-[3rem] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="absolute top-8 right-6 flex gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={openEditProfile} className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-lg group hover:bg-white/30 transition-colors">
            <Pencil className="w-5.5 h-5.5 text-white group-hover:scale-110 transition-transform" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-lg group hover:bg-white/30 transition-colors">
            <Settings className="w-5.5 h-5.5 text-white group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>
      </div>

      <div className="px-6 -mt-24 relative z-10">
        {/* Profile Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-card rounded-[3rem] p-8 border border-border/50 shadow-2xl mb-8 relative group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />
          
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center text-6xl shadow-xl border-4 border-background mb-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              {profile.avatar}
              {isFullyVerified && (
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-success flex items-center justify-center shadow-lg border-2 border-background">
                  <CheckCircle className="w-5 h-5 text-success-foreground" />
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-display font-bold text-card-foreground tracking-tight">{profile.name}</h1>
            
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-semibold mt-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/30">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{profile.location}</span>
            </div>

            {profile.bio && (
              <p className="text-sm text-card-foreground/80 mt-6 leading-relaxed italic max-w-xs font-medium">
                "{profile.bio}"
              </p>
            )}

            {/* Inline Stats */}
            <div className="grid grid-cols-3 gap-6 w-full mt-8 pt-8 border-t border-border/50">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center gap-2 group/stat">
                    <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover/stat:bg-primary group-hover/stat:text-white transition-all duration-300 shadow-sm">
                      <Icon className="w-5 h-5 text-primary group-hover/stat:text-white transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-display font-bold text-card-foreground leading-none">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Verification Badge */}
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { if (!isFullyVerified) requireVerification("student"); }}
          className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl mb-6 shadow-sm ${current.color}`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-sm font-bold tracking-tight">{current.label}</span>
          {!isFullyVerified && <ChevronRight className="w-5 h-5 ml-auto opacity-50" />}
        </motion.button>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-[2.5rem] p-8 border border-border/50 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-primary" /> Roles & Skills
            </h2>
            <button onClick={() => setShowRoleEditor(!showRoleEditor)} className="text-xs font-bold text-primary px-3 py-1.5 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
              {showRoleEditor ? "Cancel" : "Edit Details"}
            </button>
          </div>

          {!showRoleEditor ? (
            <>
              {/* Roles */}
              <div className="flex flex-wrap gap-2 mb-4">
                {primaryRole && (
                  <span className="px-3 py-2 rounded-2xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5">
                    {getRoleLabel(primaryRole)?.emoji} {getRoleLabel(primaryRole)?.label}
                    <span className="text-[9px] opacity-70 ml-1">Primary</span>
                  </span>
                )}
                {secondaryRole && (
                  <span className="px-3 py-2 rounded-2xl bg-muted text-foreground text-xs font-bold flex items-center gap-1.5">
                    {getRoleLabel(secondaryRole)?.emoji} {getRoleLabel(secondaryRole)?.label}
                    <span className="text-[9px] text-muted-foreground ml-1">2nd</span>
                  </span>
                )}
                {!primaryRole && !secondaryRole && (
                  <button onClick={() => setShowRoleEditor(true)} className="px-3 py-2 rounded-2xl bg-muted border border-dashed border-border text-muted-foreground text-xs font-semibold">
                    + Set your role
                  </button>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="text-[10px] font-bold px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/5 shadow-sm">{skill}</span>
                ))}
              </div>
            </>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                <div>
                  <p className="text-sm font-display font-bold text-foreground mb-2">Primary Role *</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLES_CATALOG.map((role) => (
                      <motion.button key={role.id} whileTap={{ scale: 0.95 }} onClick={() => { setPrimaryRole(role.id); if (secondaryRole === role.id) setSecondaryRole(null); }}
                        className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${primaryRole === role.id ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        {role.emoji} {role.label}
                        {primaryRole === role.id && <Check className="w-3.5 h-3.5" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-foreground mb-2">Secondary Role (optional)</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLES_CATALOG.filter(r => r.id !== primaryRole).map((role) => (
                      <motion.button key={role.id} whileTap={{ scale: 0.95 }} onClick={() => setSecondaryRole(secondaryRole === role.id ? null : role.id)}
                        className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${secondaryRole === role.id ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        {role.emoji} {role.label}
                        {secondaryRole === role.id && <Check className="w-3.5 h-3.5" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveRoles} className="w-full gradient-primary text-primary-foreground font-bold py-3 rounded-2xl text-sm">
                  Update Roles ✨
                </motion.button>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex gap-4">
            {privacyOptions.map((opt) => {
              const Icon = opt.icon;
              const active = privacy === opt.id;
              return (
                <button key={opt.id} onClick={() => setPrivacy(opt.id)}
                  className={`flex-1 flex flex-col items-center gap-2 py-5 px-3 rounded-[2rem] text-center transition-all duration-300 border ${active ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.05] border-transparent" : "bg-card border-border/50 text-foreground hover:bg-muted/50 shadow-sm"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? "bg-white/20" : "bg-primary/5 text-primary"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-90">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/people")}
          className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-card border border-border/50 shadow-lg mb-8 group hover:border-primary/30 transition-all duration-300"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/10 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <Users className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-sm font-display font-bold text-card-foreground">My Connections</p>
              <p className="text-[11px] text-muted-foreground font-semibold mt-1">12 connected · 3 pending</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </motion.button>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-[0.2em]">Certificate Vault</h2>
            <button onClick={() => navigate("/certificates")} className="text-xs font-bold text-primary hover:underline transition-all">
              View All
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-2 px-2">
            {mockCertificates.slice(0, 4).map((cert, i) => {
              const bgColors = ["bg-primary/5", "bg-secondary/5", "bg-accent/5", "bg-success/5"];
              const borderColors = ["border-primary/10", "border-secondary/10", "border-accent/10", "border-success/10"];
              return (
                <motion.div key={cert.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} onClick={() => navigate("/certificates")} className="flex-shrink-0 w-36 cursor-pointer group">
                  <div className={`w-36 h-28 rounded-[2rem] flex items-center justify-center text-4xl mb-4 border ${bgColors[i % bgColors.length]} ${borderColors[i % borderColors.length]} shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 bg-white/40 backdrop-blur-sm relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <span className="relative z-10 filter drop-shadow-md">{cert.badge}</span>
                  </div>
                  <p className="text-[11px] font-display font-bold text-card-foreground leading-snug line-clamp-2 px-2 group-hover:text-primary transition-colors text-center">{cert.title}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-10"
        >
          <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 px-2">Portfolio & Socials</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "GitHub", url: profile.github, icon: Globe, color: "bg-slate-900", textColor: "text-white" },
              { label: "LinkedIn", url: profile.linkedin, icon: Users, color: "bg-blue-600", textColor: "text-white" },
              { label: "Portfolio", url: profile.portfolio, icon: Sparkles, color: "bg-primary", textColor: "text-white" },
            ].filter(l => l.url).map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.label} whileTap={{ scale: 0.98 }} className="flex items-center justify-between p-5 rounded-[2rem] bg-card border border-border/50 shadow-md hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${link.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${link.textColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-display font-bold text-card-foreground">{link.label}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold tracking-wide truncate max-w-[180px]">{link.url}</p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-[0.2em]">Joined Events</h2>
            <button onClick={() => navigate("/search")} className="text-xs font-bold text-primary hover:underline">
              Explore More
            </button>
          </div>
          <div className="space-y-4">
            {mockEvents.slice(0, 3).map((ev) => (
              <motion.div key={ev.id} whileTap={{ scale: 0.98 }} onClick={() => navigate(`/event/${ev.id}`)} className="flex items-center gap-5 bg-card rounded-[2.25rem] p-5 border border-border/50 shadow-md hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group">
                <div className="relative shrink-0">
                  <img src={ev.image} alt={ev.title} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-md group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center border-2 border-background shadow-lg">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-bold text-card-foreground truncate leading-tight group-hover:text-primary transition-colors">{ev.title}</p>
                  <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-wide opacity-70">{ev.date} · {ev.location}</p>
                  <div className="mt-3">
                    <span className="text-[9px] font-bold px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20 uppercase tracking-tighter">Attending</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-widest mb-4">Past Achievements</h2>
          <div className="space-y-3">
            {[
              { name: "HackVerse 2.0", result: "🏆 Winner", date: "Jan 2026", icon: "🥇" },
              { name: "DesignJam 2025", result: "🎨 Top 5", date: "Nov 2025", icon: "✨" },
              { name: "React Workshop", result: "📜 Completed", date: "Oct 2025", icon: "🎓" },
            ].map((ev) => (
              <div key={ev.name} className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-lg">
                    {ev.icon}
                  </div>
                  <div>
                    <p className="text-sm font-display font-bold text-card-foreground">{ev.name}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{ev.date}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/5 uppercase tracking-tight">{ev.result}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
