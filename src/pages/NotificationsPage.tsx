import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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
}

const studentNotifications: Notification[] = [
  { id: "1", type: "teams", title: "Team Complete! 🎉", message: "Code Crushers is ready for HackVerse 3.0", time: "2m ago", read: false, icon: "🎉" },
  { id: "2", type: "messages", title: "Buddy Request", message: "Priya Sharma wants to connect", time: "15m ago", read: false, icon: "👋" },
  { id: "3", type: "teams", title: "Request Approved ✅", message: "You're in! Neural Nexus accepted you", time: "1h ago", read: true, icon: "✅" },
  { id: "4", type: "events", title: "Event Tomorrow", message: "HackVerse 3.0 starts in 24 hours", time: "3h ago", read: true, icon: "⏰" },
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

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { isOrganizer } = useRole();
  const initialNotifs = isOrganizer ? organizerNotifications : studentNotifications;
  const [notifications, setNotifications] = useState(initialNotifs);
  const [activeTab, setActiveTab] = useState<NotifTab>("all");

  const filtered = activeTab === "all"
    ? notifications
    : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const tabUnread = (tab: NotifTab) => {
    if (tab === "all") return notifications.filter((n) => !n.read).length;
    return notifications.filter((n) => n.type === tab && !n.read).length;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-bold text-primary">
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
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

      <main className="px-5 space-y-2 pt-2">
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
              className="space-y-2"
            >
              {filtered.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(notif.id)}
                  className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-colors ${
                    notif.read ? "bg-card" : "bg-primary/5 border border-primary/10"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-display font-bold text-card-foreground truncate">{notif.title}</p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                  </div>
                </motion.div>
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
