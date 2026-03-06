import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Users, Plus, Check, Minus, Loader2, Calendar, MapPin, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import TeamLobby from "@/components/TeamLobby";
import VerificationModal from "@/components/VerificationModal";
import Confetti from "@/components/Confetti";
import { useVerification } from "@/hooks/useVerification";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { mockEvents } from "@/data/mockData";
import {
  mockTeams,
  ROLES_CATALOG,
  RoleId,
  TeamCard,
} from "@/data/teamMatchingData";

type Mode = "select_event" | "event_teams" | "create_team" | "lobby";

const TeamMatchingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isStudent } = useRole();
  const [mode, setMode] = useState<Mode>(searchParams.get("eventId") ? "event_teams" : "select_event");
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

  const storedPrimary = localStorage.getItem("competa_primary_role") as RoleId | null;
  const userRole = selectedRole || storedPrimary;

  // Events that require teams
  const teamEvents = mockEvents.filter((e) => e.requiresTeam);
  const selectedEvent = teamEvents.find((e) => e.id === selectedEventId);

  // Teams for selected event
  const eventTeams = useMemo(() => {
    if (!selectedEventId) return [];
    let teams = mockTeams.filter((t) => t.event_id === selectedEventId);
    if (userRole) {
      teams.sort((a, b) => {
        const aMatch = a.open_roles.includes(userRole) ? 1 : 0;
        const bMatch = b.open_roles.includes(userRole) ? 1 : 0;
        if (bMatch !== aMatch) return bMatch - aMatch;
        return b.completion - a.completion;
      });
    }
    return teams;
  }, [selectedEventId, userRole]);

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
    toast({
      title: "Left Team",
      description: "Your join request has been withdrawn",
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
      description: `${newTeamName} is now open for ${selectedEvent?.title}`,
    });
    setMode("lobby");
  };

  const getRoleInfo = (id: RoleId) => ROLES_CATALOG.find((r) => r.id === id)!;

  if (mode === "lobby") {
    return <TeamLobby onBack={() => setMode("event_teams")} />;
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

      {/* STEP 1: SELECT EVENT */}
      {mode === "select_event" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Find a Team</h1>
                <p className="text-xs text-muted-foreground">Pick an event to join or create a team</p>
              </div>
            </div>
          </header>

          <main className="px-5 pt-5 space-y-3">
            {/* Role selector if not set */}
            {!storedPrimary && (
              <div className="mb-4">
                <p className="text-sm font-display font-bold text-foreground mb-3">What's your role?</p>
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

            <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
              Events with Team Formation
            </p>

            {teamEvents.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">📋</p>
                <p className="font-display font-bold text-lg text-foreground">No team events right now</p>
                <p className="text-sm text-muted-foreground">Check back when new events are posted</p>
              </div>
            ) : (
              teamEvents.map((event, i) => {
                const teamsForEvent = mockTeams.filter((t) => t.event_id === event.id);
                const openTeams = teamsForEvent.filter((t) => t.open_roles.length > 0);
                const matchingTeams = userRole
                  ? teamsForEvent.filter((t) => t.open_roles.includes(userRole))
                  : [];

                return (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectEvent(event.id)}
                    className="w-full bg-card rounded-3xl border border-border overflow-hidden text-left"
                  >
                    {/* Event image header */}
                    <div className="relative h-28">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="font-display text-lg font-bold text-card-foreground drop-shadow-sm">{event.title}</h3>
                      </div>
                      {matchingTeams.length > 0 && (
                        <div className="absolute top-3 right-3 gradient-primary rounded-full px-2.5 py-1">
                          <span className="text-[10px] font-bold text-primary-foreground">
                            🎯 {matchingTeams.length} match{matchingTeams.length > 1 ? "es" : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event meta */}
                    <div className="p-4 pt-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            {openTeams.length} open team{openTeams.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 text-foreground" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </main>

          <BottomNav />
        </motion.div>
      )}

      {/* STEP 2: EVENT TEAMS */}
      {mode === "event_teams" && selectedEvent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => { setMode("select_event"); setSelectedEventId(null); }}>
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
            {/* Create team CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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

            {/* Teams list */}
            <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider pt-2">
              {eventTeams.length} Team{eventTeams.length !== 1 ? "s" : ""} Looking for Members
            </p>

            {eventTeams.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🏗️</p>
                <p className="font-display font-bold text-lg text-foreground">No teams yet</p>
                <p className="text-sm text-muted-foreground mb-6">Be the first to create one!</p>
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

                    {isMyTeam && (
                      <div className="absolute top-3 right-3 bg-success/10 rounded-full px-3 py-1 flex items-center gap-1">
                        <span className="text-[10px] font-bold text-success">
                          {joinStatus === "pending" ? "⏳ Pending" : joinStatus === "approved" ? "✅ Approved" : "❌ Rejected"}
                        </span>
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
                        <p className="text-xs text-muted-foreground font-medium">
                          {team.members.length}/{team.max_size} members
                        </p>
                      </div>
                    </div>

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
                      <p className="text-[11px] font-display font-bold mb-2 text-muted-foreground uppercase tracking-wider">
                        Open Roles
                      </p>
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

                    {/* Unjoin button */}
                    {isMyTeam && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUnjoinTeam(team.team_id)}
                        className="w-full mt-2 py-2.5 rounded-2xl bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        Withdraw Request
                      </motion.button>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* CREATE TEAM (for selected event) */}
      {mode === "create_team" && selectedEvent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setMode("event_teams")}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Create Team</h1>
              <p className="text-xs text-muted-foreground">for {selectedEvent.title}</p>
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
                Team Size (max {selectedEvent.maxTeamSize || 4})
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
                  onClick={() => setNewTeamSize(Math.min(selectedEvent.maxTeamSize || 8, newTeamSize + 1))}
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
                          isSelected
                            ? newTeamRoles.filter((r) => r !== role.id)
                            : [...newTeamRoles, role.id]
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

      {mode === "select_event" && <BottomNav />}
    </div>
  );
};

export default TeamMatchingPage;
