import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UserPlus, Check, X, MapPin, ExternalLink, Sparkles, Clock, Send, Inbox, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockStudents, ROLES_CATALOG, skillEmojis } from "@/data/teamMatchingData";

type BuddyStatus = "not_connected" | "request_sent" | "request_received" | "connected";

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
  requestTime?: string;
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
        ? "request_received"
        : s.user_id === "s4"
        ? "request_sent"
        : ("not_connected" as BuddyStatus),
    requestTime:
      s.user_id === "s3" ? "15m ago" : s.user_id === "s4" ? "1h ago" : undefined,
  };
});

const cityNames: Record<string, string> = {
  hyd: "Hyderabad",
  blr: "Bangalore",
  che: "Chennai",
  pun: "Pune",
  mum: "Mumbai",
};

type Tab = "discover" | "buddies" | "received" | "sent";

const BuddiesPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("discover");
  const [buddies, setBuddies] = useState<Buddy[]>(initialBuddies);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const connected = buddies.filter((b) => b.status === "connected");
  const received = buddies.filter((b) => b.status === "request_received");
  const sent = buddies.filter((b) => b.status === "request_sent");
  const discover = buddies.filter((b) => b.status === "not_connected");

  const currentList = useMemo(() => {
    const list = tab === "discover" ? discover : tab === "buddies" ? connected : tab === "received" ? received : sent;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (b) => b.name.toLowerCase().includes(q) || b.role.toLowerCase().includes(q) || b.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [tab, buddies, searchQuery]);

  const handleAction = (id: string, newStatus: BuddyStatus) => {
    setBuddies((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus, requestTime: newStatus === "request_sent" ? "Just now" : b.requestTime } : b))
    );
  };

  const tabs: { id: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    { id: "discover", label: "Discover", count: discover.length, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "buddies", label: "Buddies", count: connected.length, icon: <Check className="w-3.5 h-3.5" /> },
    { id: "received", label: "Received", count: received.length, icon: <Inbox className="w-3.5 h-3.5" /> },
    { id: "sent", label: "Sent", count: sent.length, icon: <Send className="w-3.5 h-3.5" /> },
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
        className="bg-card rounded-[1.5rem] border border-border overflow-hidden shadow-sm"
      >
        <button
          onClick={() => navigate(`/user/${buddy.id}`)}
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

          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {buddy.status === "not_connected" && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleAction(buddy.id, "request_sent")}
                className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add
              </motion.button>
            )}

            {buddy.status === "request_received" && (
              <div className="flex gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleAction(buddy.id, "connected")}
                  className="px-3 py-2 rounded-xl bg-success/10 text-success text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleAction(buddy.id, "not_connected")}
                  className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-destructive" />
                </motion.button>
              </div>
            )}

            {buddy.status === "request_sent" && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleAction(buddy.id, "not_connected")}
                className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Cancel
              </motion.button>
            )}

            {buddy.status === "connected" && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => navigate(`/messages/${buddy.id}`)}
                className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold"
              >
                Message
              </motion.button>
            )}
          </div>
        </button>

        {(buddy.status === "request_received" || buddy.status === "request_sent") && buddy.requestTime && (
          <div className="px-4 -mt-2 pb-2">
            <p className="text-[10px] text-muted-foreground/60">
              {buddy.status === "request_received" ? "Received" : "Sent"} {buddy.requestTime}
            </p>
          </div>
        )}

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

  const renderEmptyState = (emoji: string, title: string, subtitle: string, action?: { label: string; onClick: () => void }) => (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">{emoji}</p>
      <p className="font-display font-bold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      {action && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="gradient-primary text-primary-foreground font-bold py-3 px-6 rounded-2xl text-sm"
        >
          {action.label}
        </motion.button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl px-5 pt-6 pb-4 border-b border-border/30">
        <div className="flex items-center gap-3 mb-3">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">People</h1>
            <p className="text-xs text-muted-foreground">Browse profiles & connect</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-2xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                tab === t.id
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    tab === t.id ? "bg-primary-foreground/20" : t.id === "received" ? "bg-destructive text-destructive-foreground" : "bg-border"
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
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!searchQuery && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-xs font-bold text-muted-foreground">Tap a profile to see skills & portfolio</p>
                </div>
              )}
              {currentList.length === 0
                ? renderEmptyState("🎉", searchQuery ? "No results found" : "You've discovered everyone!", searchQuery ? "Try a different search term" : "Check back later for new students")
                : currentList.map(renderProfileCard)}
            </motion.div>
          )}

          {tab === "buddies" && (
            <motion.div key="buddies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {currentList.length === 0
                ? renderEmptyState("👋", "No buddies yet", "Discover students and send requests!", { label: "Browse Students", onClick: () => setTab("discover") })
                : currentList.map(renderProfileCard)}
            </motion.div>
          )}

          {tab === "received" && (
            <motion.div key="received" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!searchQuery && currentList.length > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <Inbox className="w-4 h-4 text-primary" />
                  <p className="text-xs font-bold text-muted-foreground">People who want to connect with you</p>
                </div>
              )}
              {currentList.length === 0
                ? renderEmptyState("📭", "No pending requests", "You're all caught up!")
                : currentList.map(renderProfileCard)}
            </motion.div>
          )}

          {tab === "sent" && (
            <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!searchQuery && currentList.length > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <Send className="w-4 h-4 text-primary" />
                  <p className="text-xs font-bold text-muted-foreground">Waiting for them to accept</p>
                </div>
              )}
              {currentList.length === 0
                ? renderEmptyState("✨", "No pending sent requests", "Discover people and send requests!", { label: "Discover People", onClick: () => setTab("discover") })
                : currentList.map(renderProfileCard)}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default BuddiesPage;
