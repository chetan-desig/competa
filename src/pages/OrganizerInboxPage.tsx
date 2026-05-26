import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, ChevronDown, Megaphone, Users, LifeBuoy, Hash, Wrench,
  Plus, Calendar, Send, CheckCircle2, XCircle, Clock, AlertTriangle,
  Pin, MessageSquare, FileText, ChevronRight, Filter, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockStudents } from "@/data/teamMatchingData";

type TabId = "announcements" | "requests" | "support" | "rooms" | "team";

const TABS: { id: TabId; label: string; icon: typeof Bell; badge?: number }[] = [
  { id: "announcements", label: "Announcements", icon: Megaphone, badge: 2 },
  { id: "requests", label: "Team Requests", icon: Users, badge: 5 },
  { id: "support", label: "Support", icon: LifeBuoy, badge: 3 },
  { id: "rooms", label: "Event Rooms", icon: Hash, badge: 12 },
  { id: "team", label: "Organizer Team", icon: Wrench },
];

const EVENTS = ["HackVerse 3.0", "Startup Weekend", "AI Summit '26"];

// ─── Mock data ────────────────────────────────────────────────────────────
const announcements = [
  { id: "a1", title: "Final submission deadline extended", audience: "All participants", sentTo: 248, time: "12m ago", status: "delivered" as const },
  { id: "a2", title: "Venue moved to Hall B", audience: "Selected teams", sentTo: 64, time: "1h ago", status: "delivered" as const },
  { id: "a3", title: "Opening ceremony reminder", audience: "All participants", sentTo: 248, time: "Tomorrow 9:00 AM", status: "scheduled" as const },
];

const templates = [
  { label: "Deadline update", icon: Clock },
  { label: "Venue update", icon: Pin },
  { label: "Winner announcement", icon: Sparkles },
];

const teamRequests = [
  { id: "t1", name: "Code Crushers", leader: mockStudents[0], members: [mockStudents[0], mockStudents[1], mockStudents[2]], roles: ["Backend", "ML"], match: 92, event: "HackVerse 3.0", status: "pending" as const },
  { id: "t2", name: "Pixel Pirates", leader: mockStudents[1], members: [mockStudents[1], mockStudents[3]], roles: ["Designer"], match: 78, event: "HackVerse 3.0", status: "pending" as const },
  { id: "t3", name: "Neural Nomads", leader: mockStudents[2], members: [mockStudents[2], mockStudents[4]], roles: ["Frontend", "PM"], match: 85, event: "AI Summit '26", status: "pending" as const },
];

const tickets = [
  { id: "s1", user: mockStudents[0], category: "Payment failed", priority: "urgent" as const, event: "HackVerse 3.0", time: "5m ago" },
  { id: "s2", user: mockStudents[1], category: "Team edit request", priority: "pending" as const, event: "HackVerse 3.0", time: "32m ago" },
  { id: "s3", user: mockStudents[3], category: "Certificate missing", priority: "pending" as const, event: "AI Summit '26", time: "2h ago" },
  { id: "s4", user: mockStudents[4], category: "Registration issue", priority: "resolved" as const, event: "Startup Weekend", time: "Yesterday" },
];

const rooms = [
  { id: "r1", title: "HackVerse 3.0", participants: 248, active: 18, unread: 12, lastActivity: "Organizer: Venue map updated 🗺️", time: "2m", pinned: "Submission deadline: Sun 11:59 PM" },
  { id: "r2", title: "Startup Weekend", participants: 96, active: 4, unread: 0, lastActivity: "Aarav: Looking for a co-founder!", time: "1h", pinned: "Pitch night on Saturday" },
  { id: "r3", title: "AI Summit '26", participants: 412, active: 27, unread: 5, lastActivity: "Priya: Speaker list dropped!", time: "3h", pinned: "Keynote at 10 AM sharp" },
];

const organizers = [
  { id: "o1", user: mockStudents[0], role: "Admin", status: "Reviewing team submissions", time: "now" },
  { id: "o2", user: mockStudents[1], role: "Volunteer Lead", status: "Briefing volunteers at gate 2", time: "5m" },
  { id: "o3", user: mockStudents[2], role: "Marketing", status: "Posted highlight reel on IG", time: "1h" },
  { id: "o4", user: mockStudents[3], role: "Operations", status: "Stage setup 90% complete", time: "2h" },
];

const checklist = [
  { label: "Confirm catering for 250", done: true },
  { label: "Print volunteer badges", done: true },
  { label: "Final stage rehearsal", done: false },
  { label: "Brief judges (3:00 PM)", done: false },
];

// ─── Reusable ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-3">
    <p className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-wider">{children}</p>
    {action}
  </div>
);

const priorityStyles = {
  urgent: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

// ─── Tab panels ───────────────────────────────────────────────────────────
const AnnouncementsPanel = () => (
  <div className="space-y-6">
    <motion.button
      whileTap={{ scale: 0.98 }}
      className="w-full gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center justify-between shadow-lg"
      style={{ boxShadow: "0 10px 30px -10px hsl(265 85% 60% / 0.5)" }}
    >
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display font-bold text-sm">New Announcement</p>
          <p className="text-[11px] opacity-80">Broadcast to participants instantly</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 opacity-70" />
    </motion.button>

    <div>
      <SectionLabel>Quick Templates</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {templates.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.label} className="bg-card border border-border/60 rounded-2xl p-3 flex flex-col items-start gap-2 hover:border-primary/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[11px] font-semibold text-foreground leading-tight text-left">{t.label}</p>
            </button>
          );
        })}
      </div>
    </div>

    <div>
      <SectionLabel action={<button className="text-[11px] font-bold text-primary">View all</button>}>Recent Broadcasts</SectionLabel>
      <div className="space-y-2">
        {announcements.map((a) => (
          <div key={a.id} className="bg-card border border-border/60 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">To: {a.audience} · {a.sentTo} recipients</p>
              </div>
              <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border ${
                a.status === "scheduled" ? "bg-primary/10 text-primary border-primary/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              }`}>
                {a.status === "scheduled" ? "Scheduled" : "Delivered"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
              {a.status === "scheduled" ? <Calendar className="w-3 h-3" /> : <Send className="w-3 h-3" />}
              <span>{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TeamRequestsPanel = () => (
  <div className="space-y-3">
    {teamRequests.map((t) => (
      <div key={t.id} className="bg-card border border-border/60 rounded-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <p className="font-display font-bold text-base text-foreground">{t.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t.event} · Led by {t.leader.display_name.split(" ")[0]}</p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className="text-base font-display font-bold text-primary leading-none">{t.match}%</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">match</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex -space-x-2">
            {t.members.map((m) => (
              <img key={m.user_id} src={m.profile_photo} alt={m.display_name} className="w-8 h-8 rounded-full border-2 border-card object-cover" />
            ))}
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              +{4 - t.members.length}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {t.roles.map((r) => (
              <span key={r} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{r}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 h-9 rounded-xl bg-muted text-foreground text-xs font-bold flex items-center justify-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
          <button className="flex-1 h-9 rounded-xl border border-border text-foreground text-xs font-bold">
            View
          </button>
          <button className="flex-1 h-9 rounded-xl gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
          </button>
        </div>
      </div>
    ))}
  </div>
);

const SupportPanel = () => {
  const [filter, setFilter] = useState<"all" | "urgent" | "pending" | "resolved">("all");
  const filtered = tickets.filter((t) => filter === "all" || t.priority === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {(["all", "urgent", "pending", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold capitalize transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((t) => (
          <div key={t.id} className="bg-card border border-border/60 rounded-2xl p-4 flex items-start gap-3">
            <img src={t.user.profile_photo} alt={t.user.display_name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-bold text-sm text-foreground truncate">{t.user.display_name}</p>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${priorityStyles[t.priority]}`}>
                  {t.priority === "urgent" && <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />}
                  {t.priority}
                </span>
              </div>
              <p className="text-[13px] text-foreground mt-0.5">{t.category}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                <span>{t.event}</span>
                <span>·</span>
                <span>{t.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventRoomsPanel = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      {rooms.map((r) => (
        <button
          key={r.id}
          onClick={() => navigate(`/messages/${r.id}`)}
          className="w-full bg-card border border-border/60 rounded-2xl p-4 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Hash className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-bold text-sm text-foreground truncate">{r.title}</p>
                <span className={`text-[11px] shrink-0 ${r.unread > 0 ? "text-primary font-bold" : "text-muted-foreground"}`}>{r.time}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{r.participants} participants · {r.active} active</p>
              <p className="text-[13px] text-foreground/80 mt-1.5 truncate">{r.lastActivity}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/15">
            <Pin className="w-3.5 h-3.5 text-primary shrink-0" />
            <p className="text-[11px] font-semibold text-foreground truncate">{r.pinned}</p>
            {r.unread > 0 && (
              <span className="ml-auto shrink-0 min-w-[20px] h-5 px-1.5 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                {r.unread}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

const OrganizerTeamPanel = () => (
  <div className="space-y-6">
    <div>
      <SectionLabel action={<span className="text-[11px] font-bold text-primary">{checklist.filter((c) => c.done).length}/{checklist.length}</span>}>Event Checklist</SectionLabel>
      <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-2.5">
        {checklist.map((c) => (
          <div key={c.label} className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${c.done ? "gradient-primary" : "border-2 border-border"}`}>
              {c.done && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
            </div>
            <p className={`text-[13px] font-medium ${c.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{c.label}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <SectionLabel>Team Activity</SectionLabel>
      <div className="space-y-2">
        {organizers.map((o) => (
          <div key={o.id} className="bg-card border border-border/60 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="relative shrink-0">
              <img src={o.user.profile_photo} alt={o.user.display_name} className="w-11 h-11 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-display font-bold text-foreground truncate">{o.user.display_name}</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary shrink-0">{o.role}</span>
              </div>
              <p className="text-[12px] text-muted-foreground truncate mt-0.5">{o.status}</p>
            </div>
            <span className="text-[11px] text-muted-foreground shrink-0">{o.time}</span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <SectionLabel>Shared Files</SectionLabel>
      <div className="bg-card border border-border/60 rounded-2xl divide-y divide-border/60">
        {[
          { name: "Run-of-show.pdf", size: "1.2 MB" },
          { name: "Sponsor deck v3.key", size: "8.4 MB" },
          { name: "Volunteer roster.csv", size: "42 KB" },
        ].map((f) => (
          <div key={f.name} className="p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
              <p className="text-[11px] text-muted-foreground">{f.size}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────
const OrganizerInboxPage = () => {
  const [tab, setTab] = useState<TabId>("announcements");
  const [search, setSearch] = useState("");
  const [eventIdx, setEventIdx] = useState(0);
  const [eventOpen, setEventOpen] = useState(false);

  const totalUnread = useMemo(() => TABS.reduce((s, t) => s + (t.badge ?? 0), 0), []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-5 pt-6 pb-3 sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">Organizer Inbox</h1>
            <button
              onClick={() => setEventOpen((v) => !v)}
              className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {EVENTS[eventIdx]}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eventOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          <button className="relative w-10 h-10 rounded-2xl bg-card border border-border/60 flex items-center justify-center">
            <Bell className="w-4.5 h-4.5 text-foreground" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full gradient-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground border-2 border-background">
                {totalUnread}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {eventOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-card border border-border/60 rounded-2xl p-1.5 mb-3 shadow-lg"
            >
              {EVENTS.map((e, i) => (
                <button
                  key={e}
                  onClick={() => { setEventIdx(i); setEventOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${i === eventIdx ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                >
                  {e}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inbox, teams, tickets..."
            className="w-full pl-10 pr-12 py-3 rounded-2xl bg-card border border-border/60 text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs - segmented horizontally scrollable */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all ${
                  active ? "gradient-primary text-primary-foreground shadow-md" : "bg-card border border-border/60 text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
                {t.badge ? (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${active ? "bg-primary-foreground/20" : "bg-destructive/10 text-destructive"}`}>
                    {t.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body */}
      <main className="px-5 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "announcements" && <AnnouncementsPanel />}
            {tab === "requests" && <TeamRequestsPanel />}
            {tab === "support" && <SupportPanel />}
            {tab === "rooms" && <EventRoomsPanel />}
            {tab === "team" && <OrganizerTeamPanel />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating quick action */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl"
        style={{ boxShadow: "0 12px 30px -8px hsl(265 85% 60% / 0.55)" }}
        aria-label="Quick action"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      <BottomNav />
    </div>
  );
};

export default OrganizerInboxPage;
