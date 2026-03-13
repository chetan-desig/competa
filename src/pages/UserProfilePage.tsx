import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, ExternalLink, UserPlus, Check, Clock, X, MessageCircle, Shield, Sparkles, Globe } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockStudents, ROLES_CATALOG, RoleId, skillEmojis } from "@/data/teamMatchingData";

type BuddyStatus = "not_connected" | "request_sent" | "request_received" | "connected";

const cityNames: Record<string, string> = {
  hyd: "Hyderabad",
  blr: "Bangalore",
  che: "Chennai",
  pun: "Pune",
  mum: "Mumbai",
};

const getInitialStatus = (userId: string): BuddyStatus => {
  if (userId === "s1") return "connected";
  if (userId === "s3") return "request_received";
  if (userId === "s4") return "request_sent";
  return "not_connected";
};

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const student = mockStudents.find((s) => s.user_id === userId);
  const [buddyStatus, setBuddyStatus] = useState<BuddyStatus>(
    getInitialStatus(userId || "")
  );

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-display font-bold text-foreground">User not found</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="mt-4 gradient-primary text-primary-foreground font-bold py-3 px-6 rounded-2xl text-sm"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  const primaryRoleMeta = ROLES_CATALOG.find((r) => r.id === student.primary_role);
  const secondaryRoleMeta = student.secondary_role
    ? ROLES_CATALOG.find((r) => r.id === student.secondary_role)
    : null;

  const handleBuddyAction = (newStatus: BuddyStatus) => {
    setBuddyStatus(newStatus);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with cover */}
      <div className="relative h-44 gradient-primary rounded-b-[2.5rem] overflow-hidden">
        <div className="absolute inset-0 opacity-15 overflow-hidden">
          <div className="absolute top-6 right-10 w-28 h-28 rounded-full border-8 border-primary-foreground/10" />
          <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full border-4 border-primary-foreground/10" />
        </div>
        <div className="absolute top-6 left-6">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-primary-foreground/20 backdrop-blur-md flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>

      <div className="px-6 -mt-16">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-[2.5rem] p-6 border border-border shadow-xl mb-6 relative z-10"
        >
          <div className="flex items-start gap-5">
            <div className="relative shrink-0 w-24 h-24">
              <img
                src={student.profile_photo}
                alt={student.display_name}
                className="w-full h-full rounded-3xl object-cover shadow-xl border-4 border-background"
              />
              {student.availability && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-4 border-card shadow-md" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-2">
              <h1 className="text-xl font-display font-bold text-card-foreground truncate leading-tight">
                {student.display_name}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-semibold mt-1">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{cityNames[student.city] || student.city}</span>
              </div>
              <div className="flex items-center gap-2.5 mt-2.5">
                <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/5">⚡ {student.xp} XP</span>
                {student.availability && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/5 uppercase tracking-tight">
                    Available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buddy Action */}
          <div className="mt-6 pt-6 border-t border-border/50">
            {buddyStatus === "not_connected" && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBuddyAction("request_sent")}
                className="w-full gradient-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                Send Buddy Request
              </motion.button>
            )}
            {buddyStatus === "request_sent" && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBuddyAction("not_connected")}
                className="w-full bg-muted text-muted-foreground font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2.5"
              >
                <Clock className="w-5 h-5" />
                Request Sent · Cancel
              </motion.button>
            )}
            {buddyStatus === "request_received" && (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBuddyAction("connected")}
                  className="flex-1 bg-success/10 text-success font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2.5 border border-success/10"
                >
                  <Check className="w-5 h-5" />
                  Accept
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBuddyAction("not_connected")}
                  className="w-16 bg-destructive/10 rounded-2xl flex items-center justify-center border border-destructive/10"
                >
                  <X className="w-6 h-6 text-destructive" />
                </motion.button>
              </div>
            )}
            {buddyStatus === "connected" && (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/messages/${student.user_id}`)}
                  className="flex-1 gradient-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="px-6 bg-muted text-foreground font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2.5"
                >
                  <Check className="w-5 h-5 text-success" />
                  Buddies
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Roles */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 border border-border shadow-md mb-6"
        >
          <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" /> Roles
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {primaryRoleMeta && (
              <span className="px-4 py-2.5 rounded-2xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-2 shadow-sm">
                {primaryRoleMeta.emoji} {primaryRoleMeta.label}
                <span className="text-[10px] opacity-70 ml-1 font-medium">Primary</span>
              </span>
            )}
            {secondaryRoleMeta && (
              <span className="px-4 py-2.5 rounded-2xl bg-muted text-foreground text-xs font-bold flex items-center gap-2 border border-border/50">
                {secondaryRoleMeta.emoji} {secondaryRoleMeta.label}
                <span className="text-[10px] text-muted-foreground ml-1 font-medium">Secondary</span>
              </span>
            )}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-3xl p-6 border border-border shadow-md mb-6"
        >
          <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-widest mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2.5">
            {student.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-bold px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/5 shadow-sm flex items-center gap-2"
              >
                {skillEmojis[skill] || "🔹"} {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Portfolio */}
        {student.portfolio_link && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-widest mb-4">Portfolio</h2>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-5 rounded-[1.5rem] bg-card border border-border shadow-md hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-card-foreground">Website</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{student.portfolio_link}</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground opacity-50" />
            </motion.div>
          </motion.div>
        )}

        {/* Quick Info */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-[2rem] p-6 border border-border shadow-md"
        >
          <h2 className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-widest mb-5">About</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Location</p>
                <p className="text-sm font-bold text-card-foreground">{cityNames[student.city] || student.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center border border-success/5">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Status</p>
                <p className="text-sm font-bold text-card-foreground">
                  {student.availability ? "Available for teams" : "Not available"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/5">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Experience</p>
                <p className="text-sm font-bold text-card-foreground">{student.xp} XP earned</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;
