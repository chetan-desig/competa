import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UserPlus, Check, X, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockStudents, ROLES_CATALOG, skillEmojis } from "@/data/teamMatchingData";

type BuddyStatus = "not_connected" | "pending" | "connected";

interface Buddy {
  id: string;
  name: string;
  avatar: string;
  role: string;
  roleEmoji: string;
  city: string;
  xp: number;
  skills: string[];
  portfolio: string;
  status: BuddyStatus;
}

const initialBuddies: Buddy[] = mockStudents.map((s) => {
  const roleMeta = ROLES_CATALOG.find((r) => r.id === s.primary_role);
  return {
    id: s.user_id,
    name: s.display_name,
    avatar: s.profile_photo,
    role: roleMeta?.label || s.primary_role.replace(/_/g, " "),
    roleEmoji: roleMeta?.emoji || "👤",
    city: s.city,
    xp: s.xp,
    skills: s.skills,
    portfolio: s.portfolio_link,
    status:
      s.user_id === "s1"
        ? "connected"
        : s.user_id === "s3"
        ? "pending"
        : ("not_connected" as BuddyStatus),
  };
});

const cityNames: Record<string, string> = {
  hyd: "Hyderabad",
  blr: "Bangalore",
  che: "Chennai",
  pun: "Pune",
  mum: "Mumbai",
};

const BuddiesPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"discover" | "buddies" | "requests">("discover");
  const [buddies, setBuddies] = useState<Buddy[]>(initialBuddies);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

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
    { id: "buddies" as const, label: "My Buddies", count: connected.length },
    { id: "requests" as const, label: "Requests", count: pending.length },
  ];

  const renderProfileCard = (buddy: Buddy) => {
    const isExpanded = expandedProfile === buddy.id;

    return (
      <motion.div
        key={buddy.id}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-3xl border border-border overflow-hidden"
      >
        {/* Profile Header - tappable */}
        <button
          onClick={() => setExpandedProfile(isExpanded ? null : buddy.id)}
          className="w-full p-4 flex items-center gap-3.5 text-left"
        >
          <div className="relative">
            <img
              src={buddy.avatar}
              alt={buddy.name}
              className="w-14 h-14 rounded-2xl object-cover"
            />
            {buddy.status === "connected" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-display font-bold text-card-foreground truncate">
              {buddy.name}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {buddy.roleEmoji} {buddy.role}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {cityNames[buddy.city] || buddy.city}
              </span>
              <span className="text-[11px] text-primary font-bold">⚡ {buddy.xp} XP</span>
            </div>
          </div>

          {/* Action Button */}
          {buddy.status === "not_connected" && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(buddy.id, "pending");
              }}
              className="shrink-0 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add
            </motion.button>
          )}
          {buddy.status === "pending" && (
            <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
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
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/messages/${buddy.id}`);
              }}
              className="shrink-0 px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold"
            >
              Message
            </motion.button>
          )}
        </button>

        {/* Expanded Profile Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border/50">
                {/* Skills */}
                <div className="pt-3">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {buddy.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-[11px] font-medium"
                      >
                        {skillEmojis[skill] || "🔹"} {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio */}
                <button
                  className="flex items-center gap-2 text-primary text-[12px] font-bold"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {buddy.portfolio}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">People</h1>
            <p className="text-xs text-muted-foreground">Browse profiles & connect</p>
          </div>
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
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    tab === t.id ? "bg-primary-foreground/20" : "bg-border"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 pt-4 space-y-3">
        <AnimatePresence mode="wait">
          {tab === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-xs font-bold text-muted-foreground">
                  Tap a profile to see skills & portfolio
                </p>
              </div>
              {discover.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="font-display font-bold text-foreground">
                    You've discovered everyone!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check back later for new students
                  </p>
                </div>
              ) : (
                discover.map(renderProfileCard)
              )}
            </motion.div>
          )}

          {tab === "buddies" && (
            <motion.div
              key="buddies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {connected.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">👋</p>
                  <p className="font-display font-bold text-foreground">No buddies yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover students and send requests!
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setTab("discover")}
                    className="gradient-primary text-primary-foreground font-bold py-3 px-6 rounded-2xl text-sm"
                  >
                    Browse Students
                  </motion.button>
                </div>
              ) : (
                connected.map(renderProfileCard)
              )}
            </motion.div>
          )}

          {tab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {pending.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-display font-bold text-foreground">
                    No pending requests
                  </p>
                  <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                pending.map(renderProfileCard)
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
