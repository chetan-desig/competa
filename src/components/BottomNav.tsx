import { Home, Search, PlusCircle, MessageCircle, User, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRole } from "@/hooks/useRole";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOrganizer } = useRole();

  const tabs = isOrganizer
    ? [
      { path: "/", icon: Home, label: "Dashboard" },
      { path: "/participants", icon: Users, label: "Roster" },
      { path: "/create", icon: PlusCircle, label: "Host", isCenter: true },
      { path: "/messages", icon: MessageCircle, label: "Inbox", badge: 4 },
      { path: "/profile", icon: User, label: "Account" },
    ]
    : [
      { path: "/", icon: Home, label: "Home" },
      { path: "/search", icon: Search, label: "Search" },
      { path: "/team-matching", icon: Users, label: "Teams", isCenter: true },
      { path: "/messages", icon: MessageCircle, label: "Chats", badge: 4 },
      { path: "/profile", icon: User, label: "Profile" },
    ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Frosted glass with top glow line */}
      <div className="absolute inset-0 bg-card/70 backdrop-blur-2xl border-t border-border/40" />
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative flex items-center justify-around h-[68px] max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
            (tab.path === "/messages" && location.pathname.startsWith("/messages")) ||
            (tab.path === "/participants" && location.pathname.startsWith("/participants"));
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1"
              >
                <motion.div
                  whileTap={{ scale: 0.85, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="gradient-primary rounded-2xl p-3 -mt-5 shadow-xl relative"
                  style={{ boxShadow: "0 4px 20px -2px hsl(235 85% 58% / 0.4)" }}
                >
                  <Icon className="w-5 h-5 text-primary-foreground" />
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                <span className="text-[9px] font-bold text-primary mt-0.5">{tab.label}</span>
              </button>
            );
          }

          return (
            <motion.button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
            >
              <div className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-all duration-200 ${isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 rounded-full gradient-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground px-1">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
