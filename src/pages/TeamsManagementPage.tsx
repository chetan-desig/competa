import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Users, ChevronRight, Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockTeams, ROLES_CATALOG, TeamCard } from "@/data/teamMatchingData";
import { mockEvents } from "@/data/mockData";
import { toast } from "sonner";

type TeamStatus = "pending" | "approved" | "rejected";

interface ManagedTeam extends TeamCard {
  status: TeamStatus;
  event_name: string;
}

const initialTeams: ManagedTeam[] = mockTeams.map((t, i) => ({
  ...t,
  status: i === 0 ? "approved" : i === 3 ? "rejected" : "pending",
  event_name: mockEvents.find((e) => t.registered_events.includes(e.id))?.title || "Unknown Event",
}));

const statusConfig = {
  pending: { label: "Pending", color: "bg-accent/10 text-accent", icon: Clock },
  approved: { label: "Approved", color: "bg-success/10 text-success", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const TeamsManagementPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<ManagedTeam[]>(initialTeams);
  const [tab, setTab] = useState<TeamStatus | "all">("all");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const filtered = tab === "all" ? teams : teams.filter((t) => t.status === tab);
  const counts = {
    all: teams.length,
    pending: teams.filter((t) => t.status === "pending").length,
    approved: teams.filter((t) => t.status === "approved").length,
    rejected: teams.filter((t) => t.status === "rejected").length,
  };

  const updateStatus = (teamId: string, status: TeamStatus) => {
    setTeams((prev) => prev.map((t) => (t.team_id === teamId ? { ...t, status } : t)));
    toast.success(`Team ${status}! ${status === "approved" ? "✅" : "❌"}`, {
      description: status === "approved" ? "Team can now participate." : "Team has been rejected.",
    });
    setSelectedTeam(null);
  };

  const detail = teams.find((t) => t.team_id === selectedTeam);

  // Team review detail
  if (detail) {
    const sc = statusConfig[detail.status];
    const StatusIcon = sc.icon;
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedTeam(null)} className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-display font-bold text-foreground">Team Review</h1>
          </div>
        </header>

        <div className="px-5 pt-6 space-y-5">
          {/* Team header */}
          <div className="bg-card rounded-3xl p-5 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                {detail.member_avatars.slice(0, 3).map((av, j) => (
                  <img key={j} src={av} alt="" className="w-12 h-12 rounded-2xl border-3 border-card object-cover" />
                ))}
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-card-foreground">{detail.team_name}</h2>
                <p className="text-sm text-muted-foreground font-medium">📌 {detail.event_name}</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${sc.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {sc.label}
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-xl font-display font-bold text-card-foreground">{detail.members.length}/{detail.max_size}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Members</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-xl font-display font-bold text-card-foreground">{detail.open_roles.length}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Open Roles</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-xl font-display font-bold text-card-foreground">{detail.completion}%</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Complete</p>
            </div>
          </div>

          {/* Completion bar */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-display font-bold text-foreground">Team Completion</p>
              <p className="text-xs text-muted-foreground font-medium">{detail.completion}%</p>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${detail.completion}%` }}
                transition={{ duration: 0.8 }}
                className="h-full gradient-primary rounded-full"
              />
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Members</h3>
            <div className="space-y-2">
              {detail.members.map((m) => {
                const role = ROLES_CATALOG.find((r) => r.id === m.role);
                const isLeader = m.user_id === detail.creator_id;
                return (
                  <div key={m.user_id} className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border">
                    <img src={m.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-display font-bold text-card-foreground">{m.name}</p>
                        {isLeader && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">👑 Leader</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{role?.emoji} {role?.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open roles */}
          {detail.open_roles.length > 0 && (
            <div>
              <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Open Roles Needed</h3>
              <div className="flex flex-wrap gap-2">
                {detail.open_roles.map((roleId) => {
                  const role = ROLES_CATALOG.find((r) => r.id === roleId);
                  return (
                    <span key={roleId} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted text-foreground">
                      {role?.emoji} {role?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          {detail.status === "pending" && (
            <div className="flex gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => updateStatus(detail.team_id, "approved")}
                className="flex-1 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Approve Team
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => updateStatus(detail.team_id, "rejected")}
                className="flex-1 py-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive font-bold text-sm flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Reject
              </motion.button>
            </div>
          )}
          {detail.status === "approved" && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => updateStatus(detail.team_id, "rejected")}
              className="w-full py-3.5 rounded-2xl border border-destructive/30 text-destructive font-bold text-sm flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Revoke Approval
            </motion.button>
          )}
          {detail.status === "rejected" && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => updateStatus(detail.team_id, "approved")}
              className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Re-approve Team
            </motion.button>
          )}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <p className="text-sm text-muted-foreground font-medium">🏆 Review</p>
            <h1 className="text-xl font-display font-bold text-foreground">Teams Management</h1>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                tab === t ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${tab === t ? "bg-primary-foreground/20" : "bg-background"}`}>
                {counts[t]}
              </span>
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pt-4 space-y-2">
        {filtered.map((team, i) => {
          const sc = statusConfig[team.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div
              key={team.team_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedTeam(team.team_id)}
              className="bg-card rounded-2xl p-4 border border-border cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {team.member_avatars.slice(0, 3).map((av, j) => (
                    <img key={j} src={av} alt="" className="w-9 h-9 rounded-xl border-2 border-card object-cover" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-bold text-card-foreground truncate">{team.team_name}</p>
                  <p className="text-[11px] text-muted-foreground">📌 {team.event_name}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {team.members.length}/{team.max_size}</span>
                  <span>👑 {team.members.find((m) => m.user_id === team.creator_id)?.name || "Leader"}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sc.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {sc.label}
                </div>
              </div>
              {/* Roles preview */}
              <div className="flex flex-wrap gap-1 mt-2">
                {team.members.map((m) => {
                  const role = ROLES_CATALOG.find((r) => r.id === m.role);
                  return (
                    <span key={m.user_id} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                      {role?.emoji} {role?.label}
                    </span>
                  );
                })}
                {team.open_roles.map((roleId) => {
                  const role = ROLES_CATALOG.find((r) => r.id === roleId);
                  return (
                    <span key={roleId} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground border border-dashed border-border">
                      {role?.emoji} Needed
                    </span>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-sm font-display font-bold text-foreground">No teams in this category</p>
            <p className="text-xs text-muted-foreground mt-1">Teams will appear here as students form them</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default TeamsManagementPage;
