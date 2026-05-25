import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Users, Plus, Check, Minus, Loader2, Calendar, MapPin, X, Shield, UserPlus, ChevronRight, Zap, Heart, RotateCcw, Sparkles, Brain, Trophy, Activity, MessageCircle, CircleDot } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import TeamLobby from "@/components/TeamLobby";
import MatchOverlay from "@/components/MatchOverlay";
import Confetti from "@/components/Confetti";
import VerificationModal from "@/components/VerificationModal";
import { useVerification } from "@/hooks/useVerification";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { mockEvents } from "@/data/mockData";
import {
  mockTeams,
  mockStudents,
  ROLES_CATALOG,
  RoleId,
  TeamCard,
} from "@/data/teamMatchingData";

type Mode = "my_teams" | "browse_teams" | "select_event" | "event_teams" | "create_team" | "lobby" | "team_detail" | "invite_buddies" | "register_event" | "auto_match";

/* ─── Clean Auto-Match Card (team-only, no person image) ─── */
const TEAM_GRADIENTS = [
  "from-[#A259FF] via-[#7C3AED] to-[#5B21B6]",
  "from-[#A259FF] via-fuchsia-500 to-[#E94B6A]",
  "from-[#FFB23F] via-[#F97316] to-[#E94B6A]",
  "from-emerald-500 via-teal-500 to-[#0EA5A5]",
  "from-[#FFB23F] via-amber-500 to-[#A259FF]",
  "from-[#0EA5A5] via-[#A259FF] to-[#7C3AED]",
];

const AutoMatchCard = ({
  team,
  isTop,
  userRole,
  getRoleInfo,
  onSwipe,
}: {
  team: TeamCard;
  isTop: boolean;
  userRole: RoleId;
  getRoleInfo: (id: RoleId) => typeof ROLES_CATALOG[number];
  onSwipe: (dir: "left" | "right") => void;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const matchOpacity = useTransform(x, [0, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  const matchingRole = team.open_roles.includes(userRole);
  const compatibility = Math.min(99, team.completion + (matchingRole ? 35 : 15));
  const filledCount = team.members.length;
  const totalSlots = team.max_size;
  const openSlots = totalSlots - filledCount;
  const userRoleLabel = getRoleInfo(userRole).label;

  const seed = team.team_id.length + team.team_name.length;
  const gradient = TEAM_GRADIENTS[seed % TEAM_GRADIENTS.length];
  const initials = team.team_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.6, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.6, y: isTop ? 0 : 10 }}
      exit={{ x: 320, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-neutral-900 shadow-2xl flex flex-col">
        {/* Hero gradient area */}
        <div className={`relative bg-gradient-to-br ${gradient} flex-1 min-h-0`}>
          {/* Match badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/40 text-white backdrop-blur-md">
              Match {compatibility}%
            </span>
          </div>

          {/* Swipe labels */}
          {isTop && (
            <>
              <motion.div
                style={{ opacity: matchOpacity }}
                className="absolute top-16 left-5 z-20 border-2 border-emerald-300 rounded-xl px-3 py-1 -rotate-12 bg-emerald-500/20 backdrop-blur-sm"
              >
                <span className="text-emerald-50 font-bold text-base tracking-wider">CONNECT</span>
              </motion.div>
              <motion.div
                style={{ opacity: skipOpacity }}
                className="absolute top-16 right-5 z-20 border-2 border-rose-300 rounded-xl px-3 py-1 rotate-12 bg-rose-500/20 backdrop-blur-sm"
              >
                <span className="text-rose-50 font-bold text-base tracking-wider">SKIP</span>
              </motion.div>
            </>
          )}

          {/* Centerpiece: team initials mark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
              <span className="text-white text-5xl font-bold tracking-tight">{initials}</span>
            </div>
          </div>

          {/* Name + verified */}
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-white truncate">{team.team_name}</h3>
              <Shield className="w-5 h-5 text-emerald-300 flex-shrink-0" fill="currentColor" />
            </div>
            <p className="text-sm text-white/85 mt-0.5">
              {filledCount}/{totalSlots} members · {openSlots} open
            </p>
          </div>
        </div>

        {/* Info strip */}
        <div className="bg-neutral-900 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Needs your role</span>
            <span className="text-white font-semibold">{userRoleLabel}</span>
          </div>
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-neutral-400 flex-shrink-0">Open roles</span>
            <div className="flex flex-wrap justify-end gap-1.5">
              {team.open_roles.slice(0, 3).map((r) => (
                <span
                  key={r}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-white"
                >
                  {getRoleInfo(r).label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TeamMatchingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isStudent } = useRole();
  const initialMode: Mode = searchParams.get("eventId") ? "event_teams" : "my_teams";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(searchParams.get("eventId") || null);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { showModal, setShowModal, verificationType, requireVerification } = useVerification();

  // Create team state
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamSize, setNewTeamSize] = useState(4);
  const [newTeamRoles, setNewTeamRoles] = useState<RoleId[]>([]);

  // Join request states
  const [joinedTeams, setJoinedTeams] = useState<Record<string, "pending" | "approved" | "rejected">>({});
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamCard | null>(null);

  // Auto-match state
  const [autoMatchIndex, setAutoMatchIndex] = useState(0);
  const [skippedTeams, setSkippedTeams] = useState<string[]>([]);
  const [matchedTeam, setMatchedTeam] = useState<TeamCard | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // Teams data (mutable for demo)
  const [teams, setTeams] = useState<TeamCard[]>(mockTeams);

  const storedPrimary = localStorage.getItem("competa_primary_role") as RoleId | null;
  const userRole = selectedRole || storedPrimary;

  // "My teams" = teams where current user is a member or creator
  const currentUserId = "s1"; // mock current user
  const myTeams = teams.filter(
    (t) => t.creator_id === currentUserId || t.members.some((m) => m.user_id === currentUserId)
  );

  // Events that require teams
  const teamEvents = mockEvents.filter((e) => e.requiresTeam);
  const selectedEvent = teamEvents.find((e) => e.id === selectedEventId);

  // Teams for selected event
  const eventTeams = useMemo(() => {
    if (!selectedEventId) return [];
    let filtered = teams.filter((t) => t.registered_events.includes(selectedEventId));
    if (userRole) {
      filtered.sort((a, b) => {
        const aMatch = a.open_roles.includes(userRole) ? 1 : 0;
        const bMatch = b.open_roles.includes(userRole) ? 1 : 0;
        if (bMatch !== aMatch) return bMatch - aMatch;
        return b.completion - a.completion;
      });
    }
    return filtered;
  }, [selectedEventId, userRole, teams]);

  // Auto-match: teams that need the user's role, excluding skipped and own teams
  const autoMatchTeams = useMemo(() => {
    if (!userRole) return [];
    return teams.filter(
      (t) =>
        t.open_roles.includes(userRole) &&
        !skippedTeams.includes(t.team_id) &&
        t.creator_id !== currentUserId &&
        !t.members.some((m) => m.user_id === currentUserId)
    );
  }, [userRole, teams, skippedTeams]);

  const handleAutoSwipe = useCallback((direction: "left" | "right") => {
    const currentTeam = autoMatchTeams[autoMatchIndex];
    if (!currentTeam) return;
    
    setSwipeDirection(direction);
    
    if (direction === "right") {
      // Match! Send join request
      setJoinedTeams((prev) => ({ ...prev, [currentTeam.team_id]: "pending" }));
      setMatchedTeam(currentTeam);
      toast({
        title: "Match Request Sent! 🎉",
        description: `You want to join ${currentTeam.team_name} as ${getRoleInfo(userRole!).label}`,
      });
    } else {
      setSkippedTeams((prev) => [...prev, currentTeam.team_id]);
    }
    
    setTimeout(() => {
      setSwipeDirection(null);
      setAutoMatchIndex((prev) => Math.min(prev + 1, autoMatchTeams.length));
    }, 300);
  }, [autoMatchIndex, autoMatchTeams, userRole]);

  // Buddies (connected students) for invite
  const buddies = mockStudents.filter((s) => s.user_id !== currentUserId);

  const handleSelectEvent = (eventId: string) => {
    const verified = requireVerification("student", () => {
      setSelectedEventId(eventId);
      setMode("event_teams");
    });
    if (verified) {
      setSelectedEventId(eventId);
      setMode("event_teams");
    }
  };

  const handleJoinTeam = (team: TeamCard, role: RoleId) => {
    if (joinedTeams[team.team_id] || myTeamId) return;
    setJoinedTeams((prev) => ({ ...prev, [team.team_id]: "pending" }));
    setMyTeamId(team.team_id);
    toast({
      title: "Request Sent! 🎉",
      description: `You requested to join ${team.team_name} as ${ROLES_CATALOG.find((r) => r.id === role)?.label}`,
    });
  };

  const handleUnjoinTeam = (teamId: string) => {
    setJoinedTeams((prev) => {
      const copy = { ...prev };
      delete copy[teamId];
      return copy;
    });
    setMyTeamId(null);
    toast({ title: "Left Team", description: "Your join request has been withdrawn" });
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
    const newTeam: TeamCard = {
      team_id: `t_new_${Date.now()}`,
      team_name: newTeamName,
      team_image: mockStudents[0].profile_photo,
      member_avatars: [mockStudents[0].profile_photo],
      members: [{ name: "You", role: userRole || "fullstack_developer", avatar: mockStudents[0].profile_photo, user_id: currentUserId }],
      open_roles: newTeamRoles,
      required_roles: [userRole || "fullstack_developer", ...newTeamRoles],
      max_size: newTeamSize,
      registered_events: selectedEventId ? [selectedEventId] : [],
      city: "hyd",
      creator_id: currentUserId,
      completion: Math.round((1 / newTeamSize) * 100),
    };
    setTeams((prev) => [newTeam, ...prev]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    toast({
      title: "Team Created! 🚀",
      description: `${newTeamName} is ready. Invite your buddies!`,
    });
    setSelectedTeam(newTeam);
    setMode("team_detail");
  };

  const handleRegisterTeamForEvent = (team: TeamCard, eventId: string) => {
    if (team.registered_events.includes(eventId)) {
      toast({ title: "Already registered", description: `${team.team_name} is already in this event` });
      return;
    }
    setTeams((prev) =>
      prev.map((t) =>
        t.team_id === team.team_id
          ? { ...t, registered_events: [...t.registered_events, eventId] }
          : t
      )
    );
    const event = mockEvents.find((e) => e.id === eventId);
    toast({
      title: "Team Registered! 🎯",
      description: `${team.team_name} is now participating in ${event?.title}`,
    });
  };

  const handleInviteBuddy = (buddyId: string, teamId: string) => {
    const buddy = mockStudents.find((s) => s.user_id === buddyId);
    const team = teams.find((t) => t.team_id === teamId);
    if (!buddy || !team) return;
    
    // Check if already a member
    if (team.members.some((m) => m.user_id === buddyId)) {
      toast({ title: "Already in team", variant: "destructive" });
      return;
    }
    
    toast({
      title: "Invite Sent! 📨",
      description: `${buddy.display_name} has been invited to ${team.team_name}`,
    });
  };

  const getRoleInfo = (id: RoleId) => ROLES_CATALOG.find((r) => r.id === id)!;

  if (mode === "lobby") {
    return <TeamLobby onBack={() => setMode("my_teams")} />;
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

      {/* ─── MY TEAMS ─── */}
      {mode === "my_teams" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-foreground">My Teams</h1>
                <p className="text-xs text-muted-foreground">Manage teams, invite buddies & join events</p>
              </div>
            </div>
          </header>

          <main className="px-5 pt-5 space-y-4">
            {/* Create team CTA */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedEventId(null); setMode("create_team"); }}
              className="w-full bg-card border-2 border-dashed border-primary/30 rounded-3xl p-5 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Create New Team</h3>
                <p className="text-xs text-muted-foreground">Build your squad, then register for events</p>
              </div>
            </motion.button>

            {/* Browse open teams */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode("browse_teams")}
              className="w-full bg-card border border-border rounded-3xl p-4 flex items-center gap-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-sm font-bold text-foreground">Browse Open Teams</h3>
                <p className="text-xs text-muted-foreground">Find teams looking for your skills</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            {/* Auto-Match CTA */}
            {userRole && autoMatchTeams.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setAutoMatchIndex(0); setMatchedTeam(null); setMode("auto_match"); }}
                className="w-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-3xl p-4 flex items-center gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold text-foreground">Auto Match</h3>
                  <p className="text-xs text-muted-foreground">{autoMatchTeams.length} teams need your role — swipe to join!</p>
                </div>
                <Heart className="w-4 h-4 text-primary" />
              </motion.button>
            )}

            {/* My teams list */}
            <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider pt-2">
              {myTeams.length > 0 ? `Your Teams (${myTeams.length})` : "No Teams Yet"}
            </p>

            {myTeams.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🏗️</p>
                <p className="font-display font-bold text-lg text-foreground">No teams yet</p>
                <p className="text-sm text-muted-foreground">Create a team or browse open ones!</p>
              </div>
            ) : (
              myTeams.map((team, i) => {
                const isLeader = team.creator_id === currentUserId;
                const eventNames = team.registered_events
                  .map((eid) => mockEvents.find((e) => e.id === eid)?.title)
                  .filter(Boolean);

                return (
                  <motion.div
                    key={team.team_id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-card rounded-3xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => { setSelectedTeam(team); setMode("team_detail"); }}
                      className="w-full p-5 text-left"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex -space-x-2">
                          {team.member_avatars.map((av, j) => (
                            <img key={j} src={av} alt="" className="w-9 h-9 rounded-full border-2 border-card object-cover" />
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-card-foreground truncate">{team.team_name}</h3>
                            {isLeader && (
                              <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                                <Shield className="w-2.5 h-2.5" /> Leader
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {team.members.length}/{team.max_size} members · {team.open_roles.length} open
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      {/* Registered events */}
                      {eventNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {eventNames.map((name) => (
                            <span key={name} className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-primary/10 text-primary">
                              🎯 {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium text-muted-foreground italic">No events registered yet</span>
                      )}

                      {/* Completion bar */}
                      <div className="mt-3">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${team.completion}%` }}
                            className={`h-full rounded-full ${
                              team.completion < 30 ? "bg-destructive" : team.completion < 70 ? "bg-accent" : "bg-success"
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })
            )}
          </main>
          <BottomNav />
        </motion.div>
      )}

      {/* ─── TEAM DETAIL (leader controls) ─── */}
      {mode === "team_detail" && selectedTeam && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <button onClick={() => { setMode("my_teams"); setSelectedTeam(null); }}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-display font-bold text-foreground truncate">{selectedTeam.team_name}</h1>
                <p className="text-xs text-muted-foreground">
                  {selectedTeam.members.length}/{selectedTeam.max_size} members
                  {selectedTeam.creator_id === currentUserId && " · You're the leader"}
                </p>
              </div>
            </div>
          </header>

          <div className="px-5 pt-5 space-y-5 pb-24">
            {/* Members */}
            <div className="bg-card rounded-3xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Team Members
                </h3>
                {selectedTeam.creator_id === currentUserId && selectedTeam.open_roles.length > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode("invite_buddies")}
                    className="px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Invite Buddies
                  </motion.button>
                )}
              </div>
              {selectedTeam.members.map((m) => {
                const role = getRoleInfo(m.role);
                return (
                  <div key={m.user_id} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{role.emoji} {role.label}</p>
                    </div>
                    {selectedTeam.creator_id === m.user_id && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">Leader</span>
                    )}
                  </div>
                );
              })}
              {/* Open roles */}
              {selectedTeam.open_roles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Open Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.open_roles.map((roleId) => {
                      const role = getRoleInfo(roleId);
                      return (
                        <span key={roleId} className="text-xs font-semibold px-3 py-2 rounded-2xl bg-muted text-foreground flex items-center gap-1.5">
                          {role.emoji} {role.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Registered Events */}
            <div className="bg-card rounded-3xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Registered Events
                </h3>
                {selectedTeam.creator_id === currentUserId && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode("register_event")}
                    className="px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Event
                  </motion.button>
                )}
              </div>
              {selectedTeam.registered_events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm font-bold text-foreground">No events yet</p>
                  <p className="text-xs text-muted-foreground">Register your team for competitions!</p>
                </div>
              ) : (
                selectedTeam.registered_events.map((eid) => {
                  const ev = mockEvents.find((e) => e.id === eid);
                  if (!ev) return null;
                  return (
                    <div
                      key={eid}
                      className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 cursor-pointer"
                      onClick={() => navigate(`/event/${eid}`)}
                    >
                      <img src={ev.image} alt={ev.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{ev.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {ev.date}</span>
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {ev.location}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => setMode("lobby")}
                className="w-full h-12 rounded-2xl gradient-primary text-primary-foreground font-bold"
              >
                Open Team Workspace 🚀
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast({ title: "Left Team", description: `You left ${selectedTeam.team_name}` });
                  setMode("my_teams");
                  setSelectedTeam(null);
                }}
                className="w-full h-12 rounded-2xl border-destructive/30 text-destructive font-semibold"
              >
                Leave Team
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── INVITE BUDDIES ─── */}
      {mode === "invite_buddies" && selectedTeam && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <button onClick={() => setMode("team_detail")}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">Invite Buddies</h1>
                <p className="text-xs text-muted-foreground">to {selectedTeam.team_name}</p>
              </div>
            </div>
          </header>

          <div className="px-5 pt-5 space-y-3 pb-24">
            <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
              Open Roles: {selectedTeam.open_roles.map((r) => getRoleInfo(r).label).join(", ")}
            </p>

            {buddies.map((buddy) => {
              const alreadyInTeam = selectedTeam.members.some((m) => m.user_id === buddy.user_id);
              const matchesRole = selectedTeam.open_roles.includes(buddy.primary_role);
              const roleMeta = getRoleInfo(buddy.primary_role);

              return (
                <motion.div
                  key={buddy.user_id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-card rounded-3xl border p-4 flex items-center gap-3 ${
                    matchesRole ? "border-primary/30" : "border-border"
                  }`}
                >
                  <img src={buddy.profile_photo} alt={buddy.display_name} className="w-12 h-12 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{buddy.display_name}</p>
                    <p className="text-[11px] text-muted-foreground">{roleMeta.emoji} {roleMeta.label}</p>
                    {matchesRole && (
                      <span className="text-[9px] font-bold text-primary">🎯 Role match!</span>
                    )}
                  </div>
                  {alreadyInTeam ? (
                    <span className="text-[10px] font-bold text-muted-foreground px-3 py-1.5 rounded-xl bg-muted">
                      In Team
                    </span>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleInviteBuddy(buddy.user_id, selectedTeam.team_id)}
                      className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Invite
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ─── REGISTER TEAM FOR EVENT ─── */}
      {mode === "register_event" && selectedTeam && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <button onClick={() => setMode("team_detail")}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">Register for Event</h1>
                <p className="text-xs text-muted-foreground">{selectedTeam.team_name}</p>
              </div>
            </div>
          </header>

          <div className="px-5 pt-5 space-y-3 pb-24">
            <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
              Available Team Events
            </p>

            {teamEvents.map((event, i) => {
              const isRegistered = selectedTeam.registered_events.includes(event.id);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-3xl border border-border overflow-hidden"
                >
                  <div className="relative h-28">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display text-lg font-bold text-card-foreground drop-shadow-sm">{event.title}</h3>
                    </div>
                    {isRegistered && (
                      <div className="absolute top-3 right-3 bg-success/90 rounded-full px-2.5 py-1">
                        <span className="text-[10px] font-bold text-success-foreground flex items-center gap-1">
                          <Check className="w-3 h-3" /> Registered
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                    </div>
                    {isRegistered ? (
                      <span className="text-[10px] font-bold text-success px-3 py-1.5 rounded-xl bg-success/10">✅ Joined</span>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRegisterTeamForEvent(selectedTeam, event.id)}
                        className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-bold"
                      >
                        Register Team
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ─── BROWSE OPEN TEAMS ─── */}
      {mode === "browse_teams" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => setMode("my_teams")}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Open Teams</h1>
                <p className="text-xs text-muted-foreground">Join a team looking for your skills</p>
              </div>
            </div>
            {!storedPrimary && (
              <div className="mt-3">
                <p className="text-sm font-display font-bold text-foreground mb-2">What's your role?</p>
                <div className="flex flex-wrap gap-2">
                  {ROLES_CATALOG.map((role) => (
                    <motion.button
                      key={role.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedRole(role.id);
                        localStorage.setItem("competa_primary_role", role.id);
                      }}
                      className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        selectedRole === role.id
                          ? "gradient-primary text-primary-foreground"
                          : "bg-card text-foreground border border-border"
                      }`}
                    >
                      {role.emoji} {role.label}
                      {selectedRole === role.id && <Check className="w-3 h-3" />}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </header>

          <main className="px-5 pt-5 space-y-3 pb-24">
            {teams
              .filter((t) => t.open_roles.length > 0)
              .map((team, i) => {
                const matchesRole = userRole && team.open_roles.includes(userRole);
                const joinStatus = joinedTeams[team.team_id];
                const isMyTeam = myTeamId === team.team_id;
                const eventNames = team.registered_events
                  .map((eid) => mockEvents.find((e) => e.id === eid)?.title)
                  .filter(Boolean);

                return (
                  <motion.div
                    key={team.team_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-card rounded-3xl p-5 border relative overflow-hidden ${
                      matchesRole ? "border-primary/30 shadow-md" : "border-border"
                    }`}
                  >
                    {matchesRole && !isMyTeam && (
                      <div className="absolute top-3 right-3 gradient-primary rounded-full px-3 py-1">
                        <span className="text-[10px] font-bold text-primary-foreground">🎯 Match</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex -space-x-2">
                        {team.member_avatars.map((av, j) => (
                          <img key={j} src={av} alt="" className="w-9 h-9 rounded-full border-2 border-card object-cover" />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold text-card-foreground truncate">{team.team_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {team.members.length}/{team.max_size} members
                        </p>
                      </div>
                    </div>

                    {/* Registered events */}
                    {eventNames.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {eventNames.map((name) => (
                          <span key={name} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                            🎯 {name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Completion bar */}
                    <div className="mb-3">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${team.completion}%` }}
                          className={`h-full rounded-full ${
                            team.completion < 30 ? "bg-destructive" : team.completion < 70 ? "bg-accent" : "bg-success"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Open roles */}
                    <div className="mb-3">
                      <p className="text-[11px] font-display font-bold mb-2 text-muted-foreground uppercase tracking-wider">Open Roles</p>
                      <div className="flex flex-wrap gap-2">
                        {team.open_roles.map((roleId) => {
                          const role = getRoleInfo(roleId);
                          const isUserRole = roleId === userRole;
                          return (
                            <button
                              key={roleId}
                              onClick={() => handleJoinTeam(team, roleId)}
                              disabled={!!myTeamId}
                              className={`text-xs font-semibold px-3 py-2 rounded-2xl flex items-center gap-1.5 transition-all ${
                                isMyTeam
                                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                                  : isUserRole && !myTeamId
                                  ? "gradient-primary text-primary-foreground shadow-sm"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              {role.emoji} {role.label}
                              {isUserRole && !myTeamId && <span className="text-[10px]">→ Join</span>}
                              {isMyTeam && isUserRole && joinStatus === "pending" && (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {isMyTeam && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUnjoinTeam(team.team_id)}
                        className="w-full mt-2 py-2.5 rounded-2xl bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" /> Withdraw Request
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
          </main>
          <BottomNav />
        </motion.div>
      )}

      {/* ─── SELECT EVENT (for deep-link) ─── */}
      {mode === "select_event" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <button onClick={() => setMode("my_teams")}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Pick an Event</h1>
                <p className="text-xs text-muted-foreground">Choose an event to find teams</p>
              </div>
            </div>
          </header>
          <main className="px-5 pt-5 space-y-3">
            {teamEvents.map((event, i) => (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectEvent(event.id)}
                className="w-full bg-card rounded-3xl border border-border overflow-hidden text-left"
              >
                <div className="relative h-28">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="font-display text-lg font-bold text-card-foreground drop-shadow-sm">{event.title}</h3>
                  </div>
                </div>
                <div className="p-4 pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground" />
                </div>
              </motion.button>
            ))}
          </main>
          <BottomNav />
        </motion.div>
      )}

      {/* ─── EVENT TEAMS (deep-link from event detail) ─── */}
      {mode === "event_teams" && selectedEvent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => { setMode("my_teams"); setSelectedEventId(null); }}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-display font-bold text-foreground truncate">{selectedEvent.title}</h1>
                <p className="text-xs text-muted-foreground">{selectedEvent.date} · {selectedEvent.location}</p>
              </div>
            </div>
            {userRole && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Your role:</span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground">
                  {getRoleInfo(userRole).emoji} {getRoleInfo(userRole).label}
                </span>
              </div>
            )}
          </header>

          <div className="px-5 pt-5 space-y-4 pb-24">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode("create_team")}
              className="w-full bg-card border-2 border-dashed border-primary/30 rounded-3xl p-5 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Create Your Team</h3>
                <p className="text-xs text-muted-foreground">Start a new team for this event</p>
              </div>
            </motion.button>

            <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider pt-2">
              {eventTeams.length} Team{eventTeams.length !== 1 ? "s" : ""} in this Event
            </p>

            {eventTeams.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🏗️</p>
                <p className="font-display font-bold text-lg text-foreground">No teams yet</p>
                <p className="text-sm text-muted-foreground">Be the first to create one!</p>
              </div>
            ) : (
              eventTeams.map((team, i) => {
                const matchesRole = userRole && team.open_roles.includes(userRole);
                const joinStatus = joinedTeams[team.team_id];
                const isMyTeam = myTeamId === team.team_id;

                return (
                  <motion.div
                    key={team.team_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-card rounded-3xl p-5 border relative overflow-hidden ${
                      matchesRole ? "border-primary/30 shadow-md" : "border-border"
                    }`}
                  >
                    {matchesRole && !isMyTeam && (
                      <div className="absolute top-3 right-3 gradient-primary rounded-full px-3 py-1">
                        <span className="text-[10px] font-bold text-primary-foreground">🎯 Match</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex -space-x-2">
                        {team.member_avatars.map((av, j) => (
                          <img key={j} src={av} alt="" className="w-9 h-9 rounded-full border-2 border-card object-cover" />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold text-card-foreground truncate">{team.team_name}</h3>
                        <p className="text-xs text-muted-foreground">{team.members.length}/{team.max_size} members</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${team.completion}%` }}
                          className={`h-full rounded-full ${team.completion < 30 ? "bg-destructive" : team.completion < 70 ? "bg-accent" : "bg-success"}`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {team.open_roles.map((roleId) => {
                        const role = getRoleInfo(roleId);
                        const isUserRole = roleId === userRole;
                        return (
                          <button
                            key={roleId}
                            onClick={() => handleJoinTeam(team, roleId)}
                            disabled={!!myTeamId}
                            className={`text-xs font-semibold px-3 py-2 rounded-2xl flex items-center gap-1.5 transition-all ${
                              isMyTeam ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : isUserRole && !myTeamId ? "gradient-primary text-primary-foreground shadow-sm"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {role.emoji} {role.label}
                            {isUserRole && !myTeamId && <span className="text-[10px]">→ Join</span>}
                          </button>
                        );
                      })}
                    </div>
                    {isMyTeam && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUnjoinTeam(team.team_id)}
                        className="w-full mt-3 py-2.5 rounded-2xl bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" /> Withdraw Request
                      </motion.button>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* ─── CREATE TEAM (standalone or for event) ─── */}
      {mode === "create_team" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setMode(selectedEventId ? "event_teams" : "my_teams")}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Create Team</h1>
              <p className="text-xs text-muted-foreground">
                {selectedEvent ? `for ${selectedEvent.title}` : "Build your squad first, register for events later"}
              </p>
            </div>
          </header>

          <div className="px-5 space-y-6 pb-24">
            <div>
              <label className="text-sm font-display font-bold text-foreground mb-2 block">Team Name</label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. Code Crushers"
                className="rounded-2xl bg-card border-border h-14 text-lg font-semibold"
              />
            </div>

            <div>
              <label className="text-sm font-display font-bold text-foreground mb-3 block">
                Team Size (max {selectedEvent?.maxTeamSize || 8})
              </label>
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
                  onClick={() => setNewTeamSize(Math.min(selectedEvent?.maxTeamSize || 8, newTeamSize + 1))}
                  className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
            </div>

            <div>
              <label className="text-sm font-display font-bold text-foreground mb-3 block">Required Roles</label>
              <div className="flex flex-wrap gap-2">
                {ROLES_CATALOG.map((role) => {
                  const isSelected = newTeamRoles.includes(role.id);
                  return (
                    <motion.button
                      key={role.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setNewTeamRoles(
                          isSelected ? newTeamRoles.filter((r) => r !== role.id) : [...newTeamRoles, role.id]
                        );
                      }}
                      className={`px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
                        isSelected
                          ? "gradient-primary text-primary-foreground"
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
              className="w-full h-14 rounded-3xl gradient-primary text-primary-foreground font-bold text-base shadow-lg"
            >
              Create Team 🚀
            </Button>
          </div>
        </motion.div>
      )}

      {/* ─── AUTO MATCH (Tinder-style) ─── */}
      {mode === "auto_match" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-neutral-950">
          <MatchOverlay
            match={matchedTeam ? {
              id: matchedTeam.team_id,
              name: matchedTeam.team_name,
              photo: matchedTeam.team_image,
              role: matchedTeam.open_roles.map((r) => getRoleInfo(r).label).join(", "),
              type: "team",
            } : null}
            onClose={() => setMatchedTeam(null)}
            onViewLobby={() => { setMatchedTeam(null); setMode("lobby"); }}
          />

          {/* Header */}
          <header className="flex items-center gap-3 px-5 pt-6 pb-3">
            <button
              onClick={() => setMode("my_teams")}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-base font-bold text-white tracking-tight">Auto Match</h1>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {autoMatchTeams.length - autoMatchIndex} team{autoMatchTeams.length - autoMatchIndex !== 1 ? "s" : ""} for you
              </p>
            </div>
            <div className="w-10" />
          </header>

          <div className="flex-1 flex flex-col px-4 pb-4 min-h-0">
            {autoMatchIndex < autoMatchTeams.length ? (
              <>
                <div className="relative w-full flex-1 mb-5 min-h-0">
                  <AnimatePresence>
                    {autoMatchTeams.slice(autoMatchIndex, autoMatchIndex + 2).reverse().map((team, stackIdx) => {
                      const isTop = stackIdx === (Math.min(autoMatchTeams.length - autoMatchIndex, 2) - 1);
                      return (
                        <AutoMatchCard
                          key={team.team_id}
                          team={team}
                          isTop={isTop}
                          userRole={userRole!}
                          getRoleInfo={getRoleInfo}
                          onSwipe={handleAutoSwipe}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Clean action bar */}
                <div className="flex items-center justify-center gap-5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAutoSwipe("left")}
                    className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center shadow-lg"
                    aria-label="Skip"
                  >
                    <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setSkippedTeams([]); setAutoMatchIndex(0); }}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                    aria-label="Reset"
                  >
                    <RotateCcw className="w-5 h-5 text-white" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAutoSwipe("right")}
                    className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
                    aria-label="Connect"
                  >
                    <Heart className="w-6 h-6 text-white" strokeWidth={2.5} fill="white" />
                  </motion.button>
                </div>
              </>

            ) : (
              <div className="text-center px-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-muted flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="font-display font-bold text-xl text-foreground mb-2">All caught up!</p>
                <p className="text-sm text-muted-foreground mb-8">You've seen all teams matching your role</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => { setSkippedTeams([]); setAutoMatchIndex(0); }}
                    className="rounded-2xl"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" /> Start Over
                  </Button>
                  <Button
                    onClick={() => setMode("my_teams")}
                    className="rounded-2xl gradient-primary text-primary-foreground"
                  >
                    Back to Teams
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {(mode === "my_teams" || mode === "browse_teams" || mode === "select_event") && <BottomNav />}
    </div>
  );
};

export default TeamMatchingPage;
