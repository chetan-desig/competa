import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, ChevronRight, ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockStudents, ROLES_CATALOG, RoleId } from "@/data/teamMatchingData";
import { mockEvents } from "@/data/mockData";
import { toast } from "sonner";

const ParticipantsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleId | "all">("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const nameMatch = s.display_name.toLowerCase().includes(search.toLowerCase());
      const roleMatch = roleFilter === "all" || s.primary_role === roleFilter || s.secondary_role === roleFilter;
      return nameMatch && roleMatch;
    });
  }, [search, roleFilter]);

  const selectedProfile = filtered.find((s) => s.user_id === selectedStudent);

  const handleExport = () => {
    toast.success("Participant list exported! 📥", { description: `${filtered.length} participants exported as CSV.` });
  };

  // Profile detail view
  if (selectedProfile) {
    const role = ROLES_CATALOG.find((r) => r.id === selectedProfile.primary_role);
    const secRole = selectedProfile.secondary_role ? ROLES_CATALOG.find((r) => r.id === selectedProfile.secondary_role) : null;
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedStudent(null)} className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-display font-bold text-foreground">Participant Profile</h1>
          </div>
        </header>
        <div className="px-5 pt-6">
          <div className="flex items-center gap-4 mb-6">
            <img src={selectedProfile.profile_photo} alt="" className="w-20 h-20 rounded-3xl object-cover shadow-lg" />
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">{selectedProfile.display_name}</h2>
              <p className="text-sm text-muted-foreground font-medium">{role?.emoji} {role?.label}</p>
              {secRole && <p className="text-xs text-muted-foreground">{secRole.emoji} {secRole.label} (secondary)</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-xl font-display font-bold text-card-foreground">{selectedProfile.xp}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">XP</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-xl font-display font-bold text-card-foreground">{selectedProfile.city.toUpperCase()}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">City</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-xl font-display font-bold text-card-foreground">{selectedProfile.availability ? "✅" : "❌"}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Available</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProfile.skills.map((s) => (
                <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary/10 text-primary">{s}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate(`/messages/${selectedProfile.user_id}`)} className="flex-1 py-3.5 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm">
              💬 Message
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => toast.success("Invite sent!")} className="flex-1 py-3.5 rounded-2xl bg-card border border-border font-bold text-sm text-foreground">
              📩 Invite to Event
            </motion.button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground font-medium">👥 Manage</p>
            <h1 className="text-2xl font-display font-bold text-foreground">Participants</h1>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleExport} className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center">
            <Download className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {/* Role filter chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button onClick={() => setRoleFilter("all")} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${roleFilter === "all" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            All Roles
          </button>
          {ROLES_CATALOG.map((role) => (
            <button key={role.id} onClick={() => setRoleFilter(role.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${roleFilter === role.id ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {role.emoji} {role.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pt-4">
        <p className="text-xs text-muted-foreground font-medium mb-3">{filtered.length} participants found</p>
        <div className="space-y-2">
          {filtered.map((student, i) => {
            const role = ROLES_CATALOG.find((r) => r.id === student.primary_role);
            return (
              <motion.div
                key={student.user_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedStudent(student.user_id)}
                className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border cursor-pointer"
              >
                <img src={student.profile_photo} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-bold text-card-foreground truncate">{student.display_name}</p>
                  <p className="text-[11px] text-muted-foreground">{role?.emoji} {role?.label} · {student.xp} XP</p>
                </div>
                <div className="flex items-center gap-2">
                  {student.availability && (
                    <span className="w-2 h-2 rounded-full bg-success" />
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm font-display font-bold text-foreground">No participants found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ParticipantsPage;
