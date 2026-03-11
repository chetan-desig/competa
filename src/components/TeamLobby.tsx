import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Send,
  Clock,
  Users,
  MessageCircle,
  UserPlus,
  Check,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStudents, ROLES_CATALOG, RoleId } from "@/data/teamMatchingData";

interface TeamLobbyProps {
  onBack: () => void;
}

const teamMembers = mockStudents.slice(0, 3);

// Roles needed for the team and which are filled
const requiredRoles: { role: RoleId; filled: boolean }[] = [
  { role: "frontend_developer", filled: true },
  { role: "backend_developer", filled: true },
  { role: "ui_ux_designer", filled: true },
  { role: "ai_ml_engineer", filled: false },
];

const getRoleInfo = (id: RoleId) => ROLES_CATALOG.find(r => r.id === id);

const messages = [
  { id: 1, user: "Arjun", text: "Hey team! Excited to build together 🚀", time: "2m ago" },
  { id: 2, user: "Priya", text: "Same! I'll handle the UI designs", time: "1m ago" },
  { id: 3, user: "Karthik", text: "I can work on the ML pipeline 🧠", time: "Just now" },
];

const TeamLobby = ({ onBack }: TeamLobbyProps) => {
  const [chatInput, setChatInput] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-primary-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-primary-foreground flex-1">
            Team Lobby
          </h1>
          <button className="text-primary-foreground">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-primary-foreground">
            Code Crushers
          </h2>
          <p className="text-primary-foreground/70 text-sm mt-1">
            HackVerse 3.0 • Hyderabad
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Avatar Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Members (3/4)</h3>
          </div>
          <div className="flex justify-center gap-4">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.user_id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <img
                  src={member.profile_photo}
                  alt={member.display_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                />
                <span className="text-xs font-medium text-foreground">
                  {member.display_name.split(" ")[0]}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {member.primary_role.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" ").split(" ")[0]}
                </span>
              </motion.div>
            ))}
            {/* Actionable open slot */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInvite(!showInvite)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                <UserPlus className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs text-primary font-medium">Invite</span>
              <span className="text-[10px] text-muted-foreground">Open</span>
            </motion.button>
          </div>
          {showInvite && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-4 flex gap-2"
            >
              <Button size="sm" className="flex-1 gradient-primary text-primary-foreground rounded-2xl text-xs">
                🔗 Invite Friends
              </Button>
              <Button size="sm" className="flex-1 gradient-accent text-accent-foreground rounded-2xl text-xs">
                🚀 Boost Recruitment
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Role Coverage Checklist */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-5"
        >
          <h3 className="font-semibold text-foreground text-sm mb-3">
            ⚡ Role Coverage
          </h3>
          <div className="space-y-2.5">
            {requiredRoles.map((item, i) => {
              const role = getRoleInfo(item.role);
              return (
                <motion.div
                  key={item.role}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all ${
                    item.filled
                      ? "bg-success/8 border border-success/15"
                      : "bg-muted/50 border border-dashed border-border"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    item.filled
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {item.filled ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold ${item.filled ? "text-foreground" : "text-muted-foreground"}`}>
                      {role?.emoji} {role?.label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.filled
                      ? "bg-success/15 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {item.filled ? "Filled" : "Open"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Event Timer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold text-foreground text-sm">Event Starts In</h3>
          </div>
          <div className="flex gap-3 justify-center mt-3">
            {[
              { val: "23", label: "Days" },
              { val: "14", label: "Hrs" },
              { val: "37", label: "Min" },
            ].map((t) => (
              <div
                key={t.label}
                className="gradient-primary rounded-2xl px-4 py-3 text-center min-w-[60px]"
              >
                <span className="text-2xl font-black text-primary-foreground">
                  {t.val}
                </span>
                <p className="text-[10px] text-primary-foreground/70">{t.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Chat */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Team Chat</h3>
          </div>
          <div className="space-y-3 max-h-40 overflow-y-auto mb-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {msg.user}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="rounded-2xl bg-muted border-0 text-sm"
            />
            <Button size="icon" className="gradient-primary rounded-2xl shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Action Button — only share invite, no submit project */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button className="w-full gradient-primary text-primary-foreground rounded-2xl h-12 font-semibold">
            Share Invite 🔗
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamLobby;
