import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useRole } from "@/hooks/useRole";

type NotifTab = "all" | "teams" | "events" | "messages";

interface Notification {
  id: string;
  type: NotifTab;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  actionable?: "buddy_request" | "team_invite";
  actionStatus?: "pending" | "accepted" | "declined";
  senderId?: string;
  senderAvatar?: string;
}

const studentNotifications: Notification[] = [
  { id: "1", type: "teams", title: "Team Complete! 🎉", message: "Code Crushers is ready for HackVerse 3.0", time: "2m ago", read: false, icon: "🎉" },
  {
    id: "2", type: "messages", title: "Buddy Request", message: "Priya Sharma wants to connect with you",
    time: "15m ago", read: false, icon: "👋",
    actionable: "buddy_request", actionStatus: "pending", senderId: "s3",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
  },
  {
    id: "2b", type: "messages", title: "Buddy Request", message: "Ravi Kumar sent you a buddy request",
    time: "30m ago", read: false, icon: "👋",
    actionable: "buddy_request", actionStatus: "pending", senderId: "s5",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
  },
  { id: "3", type: "teams", title: "Request Approved ✅", message: "You're in! Neural Nexus accepted you", time: "1h ago", read: true, icon: "✅" },
  { id: "4", type: "events", title: "Event Tomorrow", message: "HackVerse 3.0 starts in 24 hours", time: "3h ago", read: true, icon: "⏰" },
  {
    id: "5b", type: "messages", title: "Request Accepted ✅", message: "Arjun Patel accepted your buddy request",
    time: "4h ago", read: true, icon: "🤝",
    actionable: "buddy_request", actionStatus: "accepted", senderId: "s1"
  },
  { id: "5", type: "teams", title: "New Teammate", message: "Karthik joined Code Crushers as AI/ML Engineer", time: "5h ago", read: true, icon: "🤝" },
  { id: "6", type: "events", title: "Registration Closing", message: "DesignJam 2026 closes in 2 days", time: "6h ago", read: true, icon: "🔔" },
  { id: "7", type: "events", title: "Certificate Ready 🏆", message: "Your HackVerse 2.0 certificate is available", time: "1d ago", read: true, icon: "🏆" },
  { id: "8", type: "messages", title: "New Message", message: "Arjun: Let's finalize the design today!", time: "2h ago", read: false, icon: "💬" },
];

const organizerNotifications: Notification[] = [
  { id: "1", type: "events", title: "New Registration", message: "15 new sign-ups for HackVerse 3.0 today", time: "10m ago", read: false, icon: "📈" },
  { id: "2", type: "teams", title: "Project Submitted", message: "Team 'Neural Nexus' submitted their project", time: "1h ago", read: false, icon: "📦" },
  { id: "3", type: "events", title: "Milestone! 🎯", message: "HackVerse 3.0 hit 400 registrations", time: "4h ago", read: true, icon: "🎯" },
];

const notifTabs: { id: NotifTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "teams", label: "Teams" },
  { id: "events", label: "Events" },
  { id: "messages", label: "Messages" },
];

// Group notifications by time
const groupByTime = (notifs: Notification[]) => {
  const groups: { label: string; items: Notification[] }[] = [];
  const today: Notification[] = [];
  const earlier: Notification[] = [];

  notifs.forEach((n) => {
    if (n.time.includes("d ago") || n.time.includes("w ago")) {
      earlier.push(n);
    } else {
      today.push(n);
    }
  });

  if (today.length) groups.push({ label: "Today", items: today });
  if (earlier.length) groups.push({ label: "Earlier", items: earlier });
  return groups;
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { isOrganizer } = useRole();
  const initialNotifs = isOrganizer ? organizerNotifications : studentNotifications;
  const [notifications, setNotifications] = useState(initialNotifs);
  const [activeTab, setActiveTab] = useState<NotifTab>("all");

  const filtered = activeTab === "all"
    ? notifications
    : notifications.filter((n) => n.type === activeTab);

  const groups = groupByTime(filtered);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleBuddyAction = (id: string, action: "accepted" | "declined") => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, actionStatus: action, read: true, icon: action === "accepted" ? "✅" : "❌" }
          : n
      )
    );
  };

  const tabUnread = (tab: NotifTab) => {
    if (tab === "all") return notifications.filter((n) => !n.read).length;
    return notifications.filter((n) => n.type === tab && !n.read).length;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl px-5 pt-6 pb-3 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-[11px] text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={markAllRead} className="text-xs font-bold text-primary px-3 py-1.5 rounded-xl bg-primary/8">
              Mark all read
            </motion.button>
          )}
        </div>

        <div className="flex gap-1 bg-muted rounded-2xl p-1">
          {notifTabs.map((tab) => {
            const unread = tabUnread(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
                {unread > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-primary-foreground/20" : "bg-destructive text-destructive-foreground"
                  }`}>
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      <main className="px-5 pt-2">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔔</p>
            <p className="font-display font-bold text-lg text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">No notifications here</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {groups.map((group) => (
                <div key={group.label} className="mb-4">
                  <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2 mt-3">
                    {group.label}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((notif, i) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => {
                          markRead(notif.id);
                          if (notif.actionable === "buddy_request" && !notif.actionStatus?.match(/accepted|declined/)) {
                            // stay for actionable
                          } else if (notif.actionable === "buddy_request") {
                            navigate("/buddies");
                          }
                        }}
                        className={`rounded-2xl cursor-pointer transition-all overflow-hidden shadow-sm ${
                          notif.read ? "bg-card" : "bg-primary/5 border border-primary/10"
                        }`}
                      >
                        <div className="flex items-start gap-3 p-4">
                          {notif.senderAvatar ? (
                            <img
                              src={notif.senderAvatar}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                              {notif.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-display font-bold text-card-foreground truncate">{notif.title}</p>
                              {!notif.read && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 rounded-full bg-primary shrink-0"
                                />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                          </div>
                        </div>

                        {notif.actionable === "buddy_request" && notif.actionStatus === "pending" && (
                          <div className="px-4 pb-4 flex gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuddyAction(notif.id, "accepted");
                              }}
                              className="flex-1 py-2.5 rounded-xl bg-success/10 text-success text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Accept
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuddyAction(notif.id, "declined");
                              }}
                              className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                              <X className="w-3.5 h-3.5" />
                              Decline
                            </motion.button>
                          </div>
                        )}

                        {notif.actionable === "buddy_request" && notif.actionStatus === "accepted" && (
                          <div className="px-4 pb-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/10 text-success text-[11px] font-bold">
                              <Check className="w-3 h-3" /> Accepted
                            </span>
                          </div>
                        )}
                        {notif.actionable === "buddy_request" && notif.actionStatus === "declined" && (
                          <div className="px-4 pb-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-[11px] font-bold">
                              <X className="w-3 h-3" /> Declined
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default NotificationsPage;
