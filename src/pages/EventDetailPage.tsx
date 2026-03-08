import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Share2, MapPin, Calendar, Users, Clock, Edit3, BarChart3, Megaphone, UserCheck, Eye, ChevronRight, AlertTriangle, Trash2 } from "lucide-react";
import { mockEvents } from "@/data/mockData";
import { mockTeams } from "@/data/teamMatchingData";
import { useState } from "react";
import VerificationModal from "@/components/VerificationModal";
import { useVerification } from "@/hooks/useVerification";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === id);
  const [saved, setSaved] = useState(false);
  const [joined, setJoined] = useState(false);
  const { isOrganizer, isStudent } = useRole();
  const { showModal, setShowModal, verificationType, requireVerification } = useVerification();

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  const teamsForEvent = mockTeams.filter((t) => t.registered_events.includes(event.id));
  const openTeams = teamsForEvent.filter((t) => t.open_roles.length > 0);

  const handleJoin = () => {
    if (joined) {
      setJoined(false);
      return;
    }
    const verified = requireVerification("student", () => setJoined(true));
    if (verified) setJoined(true);
  };

  // Mock organizer stats for this event
  const eventStats = [
    { label: "Views", value: "1.2K", icon: Eye, color: "bg-primary/10 text-primary" },
    { label: "Registered", value: `${event.attendees}`, icon: UserCheck, color: "bg-secondary/10 text-secondary" },
    { label: "Teams", value: `${teamsForEvent.length}`, icon: Users, color: "bg-accent/10 text-accent" },
    { label: "Fill Rate", value: "78%", icon: BarChart3, color: "bg-success/10 text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <VerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        type={verificationType}
        onVerified={() => {
          setShowModal(false);
          setJoined(true);
        }}
      />

      {/* Hero */}
      <div className="relative h-[55vh]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 text-primary-foreground" />
            </motion.button>
            {isStudent && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSaved(!saved)}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
              >
                <Bookmark className={`w-5 h-5 ${saved ? "fill-primary text-primary" : "text-primary-foreground"}`} />
              </motion.button>
            )}
            {isOrganizer && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.info("Edit mode coming soon!")}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
              >
                <Edit3 className="w-5 h-5 text-primary-foreground" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Organizer badge */}
        {isOrganizer && (
          <div className="absolute bottom-16 left-5">
            <span className="bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
              ⚙️ Managing
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative -mt-12 px-5 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-xl">
                  {event.category.toUpperCase()}
                </span>
                {event.requiresTeam && (
                  <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                    <Users className="w-3 h-3" /> Team Event
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-card-foreground">{event.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">by {event.organizer}</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: Calendar, text: event.date },
              { icon: MapPin, text: event.location },
              { icon: Users, text: `${event.attendees}+ attendees` },
              { icon: Clock, text: event.isOnline ? "Online + Offline" : "In-person" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-2xl bg-muted">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {event.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ─── ORGANIZER: Event Management Section ─── */}
          {isOrganizer && (
            <div className="space-y-5 border-t border-border pt-5 mt-2">
              {/* Quick Stats */}
              <div>
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  📊 Event Analytics
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {eventStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-muted rounded-2xl p-3 text-center">
                        <div className={`w-7 h-7 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-1.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-sm font-display font-bold text-card-foreground">{stat.value}</p>
                        <p className="text-[9px] text-muted-foreground font-medium">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Registered Participants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    👥 Participants ({event.attendees})
                  </h3>
                  <button
                    onClick={() => navigate("/participants")}
                    className="text-[11px] font-semibold text-primary flex items-center gap-0.5"
                  >
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-muted">
                  <div className="flex -space-x-2">
                    {teamsForEvent.flatMap(t => t.member_avatars).slice(0, 5).map((av, j) => (
                      <img key={j} src={av} alt="" className="w-8 h-8 rounded-full border-2 border-muted object-cover" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium ml-1">
                    +{Math.max(0, event.attendees - 5)} more registered
                  </p>
                </div>
              </div>

              {/* Teams Monitor */}
              {event.requiresTeam && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      🏆 Teams Formed ({teamsForEvent.length})
                    </h3>
                    <button
                      onClick={() => navigate("/teams-management")}
                      className="text-[11px] font-semibold text-primary flex items-center gap-0.5"
                    >
                      Manage <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {teamsForEvent.map((team) => (
                      <div
                        key={team.team_id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-muted"
                      >
                        <div className="flex -space-x-2">
                          {team.member_avatars.slice(0, 3).map((av, j) => (
                            <img key={j} src={av} alt="" className="w-7 h-7 rounded-full border-2 border-muted object-cover" />
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{team.team_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {team.members.length}/{team.max_size} members · {team.open_roles.length} roles open
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                          team.members.length >= team.max_size 
                            ? "bg-success/10 text-success" 
                            : "bg-accent/10 text-accent"
                        }`}>
                          {team.members.length >= team.max_size ? "Full" : "Open"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  ⚡ Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Send Announcement", icon: Megaphone, action: () => navigate("/announcements"), color: "bg-primary/10 text-primary" },
                    { label: "Invite Students", icon: UserCheck, action: () => navigate("/participants"), color: "bg-secondary/10 text-secondary" },
                    { label: "Manage Teams", icon: Edit3, action: () => navigate("/teams-management"), color: "bg-accent/10 text-accent" },
                    { label: "View Analytics", icon: BarChart3, action: () => navigate(`/analytics/${event.id}`), color: "bg-success/10 text-success" },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.label}
                        whileTap={{ scale: 0.95 }}
                        onClick={action.action}
                        className="flex items-center gap-2.5 p-3 rounded-2xl bg-muted text-left"
                      >
                        <div className={`w-8 h-8 rounded-xl ${action.color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{action.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Danger zone */}
              <div className="pt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toast.error("Event deletion coming soon", { description: "This action cannot be undone." })}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/30 text-destructive text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Event
                </motion.button>
              </div>
            </div>
          )}

          {/* ─── STUDENT: Team Section ─── */}
          {isStudent && event.requiresTeam && (
            <div className="border-t border-border pt-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">Teams</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {openTeams.length} team{openTeams.length !== 1 ? "s" : ""} looking for members
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/team-matching?eventId=${event.id}`)}
                  className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  Find / Create Team
                </motion.button>
              </div>

              {teamsForEvent.slice(0, 2).map((team) => (
                <div
                  key={team.team_id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted mb-2 cursor-pointer"
                  onClick={() => navigate(`/team-matching?eventId=${event.id}`)}
                >
                  <div className="flex -space-x-2">
                    {team.member_avatars.slice(0, 3).map((av, j) => (
                      <img key={j} src={av} alt="" className="w-7 h-7 rounded-full border-2 border-muted object-cover" />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{team.team_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {team.members.length}/{team.max_size} · {team.open_roles.length} role{team.open_roles.length !== 1 ? "s" : ""} open
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Sticky CTA - Role aware */}
      <div className="fixed bottom-0 left-0 right-0 p-5 glass-card safe-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          {isOrganizer ? (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toast.info("Edit mode coming soon!")}
                className="flex-1 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Edit Event
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toast.info("Announcements coming soon!")}
                className="flex-1 py-4 rounded-2xl bg-card border border-border font-bold text-sm text-foreground flex items-center justify-center gap-2"
              >
                <Megaphone className="w-4 h-4" /> Announce
              </motion.button>
            </>
          ) : event.requiresTeam ? (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleJoin}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all ${
                  joined
                    ? "bg-muted text-muted-foreground"
                    : "gradient-primary text-primary-foreground shadow-lg"
                }`}
              >
                {joined ? "✅ Registered" : "Join Solo"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/team-matching?eventId=${event.id}`)}
                className="flex-1 py-4 rounded-2xl bg-card border border-border font-bold text-sm text-foreground flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" /> Find Team
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleJoin}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all ${
                  joined
                    ? "bg-muted text-muted-foreground"
                    : "gradient-primary text-primary-foreground shadow-lg"
                }`}
              >
                {joined ? "✅ Joined!" : "Join Event"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="px-6 py-4 rounded-2xl bg-muted font-bold text-sm text-foreground"
              >
                💬 Chat
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
