import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Users, Plus, Check, ChevronRight, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import TeamLobby from "@/components/TeamLobby";
import VerificationModal from "@/components/VerificationModal";
import Confetti from "@/components/Confetti";
import { useVerification } from "@/hooks/useVerification";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  mockTeams,
  ROLES_CATALOG,
  RoleId,
  TeamCard,
} from "@/data/teamMatchingData";

type Mode = "entry" | "browse_teams" | "create_team" | "lobby";

const cardColors = [
  "bg-olive", "bg-purple text-primary-foreground", "bg-gold", "bg-red-card text-primary-foreground",
];

const TeamMatchingPage = () => {
  const navigate = useNavigate();
  const { isStudent } = useRole();
  const [mode, setMode] = useState<Mode>("entry");
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [secondaryRole, setSecondaryRole] = useState<RoleId | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { showModal, setShowModal, verificationType, requireVerification } = useVerification();

  // Create team state
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamSize, setNewTeamSize] = useState(4);
  const [newTeamRoles, setNewTeamRoles] = useState<RoleId[]>([]);

  // Get user's stored role
  const storedPrimary = localStorage.getItem("eduvibe_primary_role") as RoleId | null;
  const storedSecondary = localStorage.getItem("eduvibe_secondary_role") as RoleId | null;

  const userRole = selectedRole || storedPrimary;

  const handleStartMode = (targetMode: "browse_teams" | "create_team") => {
    const verified = requireVerification("student", () => {
      setMode(targetMode);
    });
    if (verified) {
      setMode(targetMode);
    }
  };

  // Filter & sort teams
  const sortedTeams = useMemo(() => {
    let teams = [...mockTeams];
    if (userRole) {
      teams.sort((a, b) => {
        const aMatch = a.open_roles.includes(userRole) ? 1 : 0;
        const bMatch = b.open_roles.includes(userRole) ? 1 : 0;
        if (bMatch !== aMatch) return bMatch - aMatch;
        return b.completion - a.completion;
      });
    }
    return teams;
  }, [userRole]);

  const handleJoinTeam = (team: TeamCard, role: RoleId) => {
    toast({
      title: "Request Sent! 🎉",
      description: `You requested to join ${team.team_name} as ${ROLES_CATALOG.find(r => r.id === role)?.label}`,
    });
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast({ title: "Enter a team name", variant: "destructive" });
      return;
    }
    if (newTeamRoles.length === 0) {
      toast({ title: "Select at least one required role", variant: "destructive" });
      return;
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    toast({
      title: "Team Created! 🚀",
      description: `${newTeamName} is now open for members`,
    });
    setMode("lobby");
  };

  const getRoleInfo = (id: RoleId) => ROLES_CATALOG.find(r => r.id === id)!;

  if (mode === "lobby") {
    return <TeamLobby onBack={() => setMode("entry")} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Confetti active={showConfetti} />
      <VerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        type={verificationType}
        onVerified={() => setShowModal(false)}
      />

      {/* ENTRY */}
      {mode === "entry" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen pb-20">
          <header className="px-5 pt-12 pb-2 flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
          </header>

          <div className="px-5 pt-2">
            <h1 className="text-4xl font-display font-bold text-foreground leading-tight">
              Find Your<br />Team
            </h1>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              Join a team or create your own 🤝
            </p>
          </div>

          {/* Role selection */}
          {!storedPrimary && (
            <div className="px-5 mt-6">
              <p className="text-sm font-bold text-foreground mb-3">Select your role first</p>
              <div className="flex flex-wrap gap-2">
                {ROLES_CATALOG.map((role) => (
                  <motion.button
                    key={role.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedRole(role.id);
                      localStorage.setItem("eduvibe_primary_role", role.id);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
                      selectedRole === role.id
                        ? "bg-foreground text-background"
                        : "bg-card text-foreground border border-border"
                    }`}
                  >
                    <span>{role.emoji}</span>
                    {role.label}
                    {selectedRole === role.id && <Check className="w-4 h-4" />}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="px-5 mt-8 space-y-4">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStartMode("browse_teams")}
              className="w-full bg-olive rounded-3xl p-6 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <Users className="w-7 h-7 text-foreground" />
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Join a Team</h3>
                  <p className="text-foreground/70 text-sm font-medium">Browse teams needing members</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-foreground" />
              </div>
            </motion.button>

            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStartMode("create_team")}
              className="w-full bg-gold rounded-3xl p-6 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <Plus className="w-7 h-7 text-foreground" />
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Create Team</h3>
                  <p className="text-foreground/70 text-sm font-medium">Build your dream squad</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-foreground" />
              </div>
            </motion.button>
          </div>

          <BottomNav />
        </motion.div>
      )}

      {/* BROWSE TEAMS */}
      {mode === "browse_teams" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background px-5 pt-12 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setMode("entry")}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <h1 className="text-2xl font-display font-bold text-foreground">Browse Teams</h1>
            </div>

            {userRole && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground font-medium">Your role:</span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-foreground text-background">
                  {getRoleInfo(userRole).emoji} {getRoleInfo(userRole).label}
                </span>
              </div>
            )}
          </header>

          <div className="px-5 space-y-4 pb-24">
            {sortedTeams.map((team, i) => {
              const colorClass = cardColors[i % cardColors.length];
              const matchesRole = userRole && team.open_roles.includes(userRole);

              return (
                <motion.div
                  key={team.team_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`${colorClass} rounded-3xl p-5 relative overflow-hidden`}
                >
                  {matchesRole && (
                    <div className="absolute top-3 right-3 bg-foreground/20 rounded-full px-3 py-1">
                      <span className="text-[10px] font-bold text-primary-foreground">🎯 Match</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {team.member_avatars.map((av, j) => (
                        <img key={j} src={av} alt="" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold truncate">{team.team_name}</h3>
                      <p className="text-xs opacity-70 font-medium">{team.event_name}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Completion bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-1 opacity-80">
                      <span>{team.members.length}/{team.max_size} members</span>
                      <span>{team.completion}% complete</span>
                    </div>
                    <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${team.completion}%` }}
                        className="h-full rounded-full bg-foreground/30"
                      />
                    </div>
                  </div>

                  {/* Open roles */}
                  <div className="mb-3">
                    <p className="text-[11px] font-bold mb-2 opacity-70 uppercase tracking-wider">Open Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {team.open_roles.map((roleId) => {
                        const role = getRoleInfo(roleId);
                        const isUserRole = roleId === userRole;
                        return (
                          <button
                            key={roleId}
                            onClick={() => handleJoinTeam(team, roleId)}
                            className={`text-xs font-semibold px-3 py-2 rounded-2xl flex items-center gap-1.5 transition-all ${
                              isUserRole
                                ? "bg-foreground text-background ring-2 ring-foreground/30"
                                : "bg-background/40 text-foreground"
                            }`}
                          >
                            {role.emoji} {role.label}
                            {isUserRole && <span className="text-[10px]">→ Join</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* CREATE TEAM */}
      {mode === "create_team" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="px-5 pt-12 pb-4 flex items-center gap-3">
            <button onClick={() => setMode("entry")}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-2xl font-display font-bold text-foreground">Create Team</h1>
          </header>

          <div className="px-5 space-y-6 pb-24">
            {/* Team Name */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Team Name</label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. Code Crushers"
                className="rounded-2xl bg-card border-border h-14 text-lg font-semibold"
              />
            </div>

            {/* Team Size */}
            <div>
              <label className="text-sm font-bold text-foreground mb-3 block">Team Size</label>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNewTeamSize(Math.max(2, newTeamSize - 1))}
                  className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center"
                >
                  <Minus className="w-5 h-5 text-foreground" />
                </motion.button>
                <span className="text-4xl font-display font-bold text-foreground w-12 text-center">{newTeamSize}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNewTeamSize(Math.min(8, newTeamSize + 1))}
                  className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Required Roles */}
            <div>
              <label className="text-sm font-bold text-foreground mb-3 block">Required Roles</label>
              <div className="flex flex-wrap gap-2">
                {ROLES_CATALOG.map((role) => {
                  const isSelected = newTeamRoles.includes(role.id);
                  return (
                    <motion.button
                      key={role.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setNewTeamRoles(
                          isSelected
                            ? newTeamRoles.filter((r) => r !== role.id)
                            : [...newTeamRoles, role.id]
                        );
                      }}
                      className={`px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-card text-foreground border border-border"
                      }`}
                    >
                      {role.emoji} {role.label}
                      {isSelected && <Check className="w-4 h-4" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleCreateTeam}
              className="w-full h-14 rounded-3xl bg-foreground text-background font-bold text-base"
            >
              Create Team 🚀
            </Button>
          </div>
        </motion.div>
      )}

      {mode === "entry" && <BottomNav />}
    </div>
  );
};

export default TeamMatchingPage;
