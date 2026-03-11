import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, ExternalLink, UserPlus, Check, Clock, X, MessageCircle, Shield, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-10">
      {/* Header with cover */}
      <div className="relative h-44 gradient-primary rounded-b-[2.5rem] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-10 w-28 h-28 rounded-full border border-primary-foreground/20" />
          <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full border border-primary-foreground/20" />
        </div>
        <div className="absolute top-5 left-5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>

      <div className="px-5 -mt-16">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-3xl p-5 border border-border shadow-sm mb-4"
        >
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={student.profile_photo}
                alt={student.display_name}
                className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-background"
              />
              {student.availability && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-lg font-display font-bold text-card-foreground truncate">
                {student.display_name}
              </h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{cityNames[student.city] || student.city}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-bold text-primary">⚡ {student.xp} XP</span>
                {student.availability && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">
                    Available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buddy Action */}
          <div className="mt-4 pt-4 border-t border-border">
            {buddyStatus === "not_connected" && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBuddyAction("request_sent")}
                className="w-full gradient-primary text-primary-foreground font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Send Buddy Request
              </motion.button>
            )}
            {buddyStatus === "request_sent" && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBuddyAction("not_connected")}
                className="w-full bg-muted text-muted-foreground font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Request Sent · Cancel
              </motion.button>
            )}
            {buddyStatus === "request_received" && (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBuddyAction("connected")}
                  className="flex-1 bg-success/10 text-success font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBuddyAction("not_connected")}
                  className="w-14 bg-destructive/10 rounded-2xl flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-destructive" />
                </motion.button>
              </div>
            )}
            {buddyStatus === "connected" && (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/messages/${student.user_id}`)}
                  className="flex-1 gradient-primary text-primary-foreground font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="px-5 bg-muted text-foreground font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-success" />
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
          className="bg-card rounded-3xl p-5 border border-border mb-4"
        >
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Roles
          </h2>
          <div className="flex flex-wrap gap-2">
            {primaryRoleMeta && (
              <span className="px-3 py-2 rounded-2xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5">
                {primaryRoleMeta.emoji} {primaryRoleMeta.label}
                <span className="text-[9px] opacity-70 ml-1">Primary</span>
              </span>
            )}
            {secondaryRoleMeta && (
              <span className="px-3 py-2 rounded-2xl bg-muted text-foreground text-xs font-bold flex items-center gap-1.5">
                {secondaryRoleMeta.emoji} {secondaryRoleMeta.label}
                <span className="text-[9px] text-muted-foreground ml-1">2nd</span>
              </span>
            )}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-3xl p-5 border border-border mb-4"
        >
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {student.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-primary/8 text-primary border border-primary/10 flex items-center gap-1"
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
            className="mb-4"
          >
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Portfolio</h2>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border cursor-pointer"
            >
              <div>
                <p className="text-sm font-display font-bold text-card-foreground">Website</p>
                <p className="text-xs text-muted-foreground">{student.portfolio_link}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </motion.div>
        )}

        {/* Quick Info */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-3xl p-5 border border-border"
        >
          <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">About</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">Location</p>
                <p className="text-xs text-muted-foreground">{cityNames[student.city] || student.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">Status</p>
                <p className="text-xs text-muted-foreground">
                  {student.availability ? "Available for teams" : "Not available"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-sm">⚡</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">Experience</p>
                <p className="text-xs text-muted-foreground">{student.xp} XP earned</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;
