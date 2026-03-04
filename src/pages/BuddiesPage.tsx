import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UserPlus, UserCheck, UserX, MessageCircle, Clock, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockStudents } from "@/data/teamMatchingData";

type BuddyStatus = "not_connected" | "pending" | "connected";

interface Buddy {
  id: string;
  name: string;
  avatar: string;
  role: string;
  city: string;
  xp: number;
  status: BuddyStatus;
}

const initialBuddies: Buddy[] = mockStudents.map((s) => ({
  id: s.user_id,
  name: s.display_name,
  avatar: s.profile_photo,
  role: s.primary_role.replace(/_/g, " "),
  city: s.city,
  xp: s.xp,
  status: s.user_id === "s1" ? "connected" : s.user_id === "s3" ? "pending" : "not_connected" as BuddyStatus,
}));

const BuddiesPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"discover" | "buddies" | "requests">("discover");
  const [buddies, setBuddies] = useState<Buddy[]>(initialBuddies);

  const connected = buddies.filter((b) => b.status === "connected");
  const pending = buddies.filter((b) => b.status === "pending");
  const discover = buddies.filter((b) => b.status === "not_connected");

  const handleAction = (id: string, newStatus: BuddyStatus) => {
    setBuddies((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const tabs = [
    { id: "discover" as const, label: "Discover", count: discover.length },
    { id: "buddies" as const, label: "Buddies", count: connected.length },
    { id: "requests" as const, label: "Requests", count: pending.length },
  ];

  const renderCard = (buddy: Buddy) => (
    <motion.div
      key={buddy.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
    >
      <img src={buddy.avatar} alt={buddy.name} className="w-12 h-12 rounded-2xl object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display font-bold text-card-foreground truncate">{buddy.name}</p>
        <p className="text-[11px] text-muted-foreground capitalize">
          {buddy.role} · ⚡ {buddy.xp} XP
        </p>
      </div>

      {buddy.status === "not_connected" && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAction(buddy.id, "pending")}
          className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"
        >
          <UserPlus className="w-4 h-4 text-primary-foreground" />
        </motion.button>
      )}

      {buddy.status === "pending" && (
        <div className="flex gap-1.5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAction(buddy.id, "connected")}
            className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-success" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAction(buddy.id, "not_connected")}
            className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-destructive" />
          </motion.button>
        </div>
      )}

      {buddy.status === "connected" && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/messages/${buddy.id}`)}
          className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center"
        >
          <MessageCircle className="w-4 h-4 text-secondary" />
        </motion.button>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-2xl font-display font-bold text-foreground">Buddies</h1>
        </div>

        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                tab === t.id
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  tab === t.id ? "bg-primary-foreground/20" : "bg-border"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 space-y-3">
        <AnimatePresence mode="wait">
          {tab === "discover" && (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {discover.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="font-display font-bold text-foreground">You've found everyone!</p>
                  <p className="text-sm text-muted-foreground">Check back later for new people</p>
                </div>
              ) : (
                discover.map(renderCard)
              )}
            </motion.div>
          )}

          {tab === "buddies" && (
            <motion.div key="buddies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {connected.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">👋</p>
                  <p className="font-display font-bold text-foreground">No buddies yet</p>
                  <p className="text-sm text-muted-foreground">Start connecting with people!</p>
                </div>
              ) : (
                connected.map(renderCard)
              )}
            </motion.div>
          )}

          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {pending.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-display font-bold text-foreground">No pending requests</p>
                  <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                pending.map(renderCard)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default BuddiesPage;
