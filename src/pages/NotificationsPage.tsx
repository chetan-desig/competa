import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, Users, Calendar, UserPlus, CheckCircle, Trophy, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useRole } from "@/hooks/useRole";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

const studentNotifications: Notification[] = [
  { id: "1", type: "team_complete", title: "Team Complete! 🎉", message: "Code Crushers is ready for HackVerse 3.0", time: "2m ago", read: false, icon: "🎉" },
  { id: "2", type: "buddy_request", title: "Buddy Request", message: "Priya Sharma wants to connect", time: "15m ago", read: false, icon: "👋" },
  { id: "3", type: "join_request_update", title: "Request Approved ✅", message: "You're in! Neural Nexus accepted you", time: "1h ago", read: true, icon: "✅" },
  { id: "4", type: "event_reminder", title: "Event Tomorrow", message: "HackVerse 3.0 starts in 24 hours", time: "3h ago", read: true, icon: "⏰" },
  { id: "5", type: "team_member_added", title: "New Teammate", message: "Karthik joined Code Crushers as AI/ML Engineer", time: "5h ago", read: true, icon: "🤝" },
];

const organizerNotifications: Notification[] = [
  { id: "1", type: "new_registration", title: "New Registration", message: "15 new sign-ups for HackVerse 3.0 today", time: "10m ago", read: false, icon: "📈" },
  { id: "2", type: "submission_received", title: "Project Submitted", message: "Team 'Neural Nexus' submitted their project", time: "1h ago", read: false, icon: "📦" },
  { id: "3", type: "new_registration", title: "Milestone! 🎯", message: "HackVerse 3.0 hit 400 registrations", time: "4h ago", read: true, icon: "🎯" },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { isOrganizer } = useRole();
  const initialNotifs = isOrganizer ? organizerNotifications : studentNotifications;
  const [notifications, setNotifications] = useState(initialNotifs);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
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
        {unreadCount > 0 && (
          <p className="text-sm text-muted-foreground ml-9">{unreadCount} unread</p>
        )}
      </header>

      <main className="px-5 space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔔</p>
            <p className="font-display font-bold text-lg text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif, i) => (
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
          </AnimatePresence>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default NotificationsPage;
