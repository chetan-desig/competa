import { Home, Search, PlusCircle, MessageCircle, User, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRole } from "@/hooks/useRole";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOrganizer, isStudent } = useRole();

  const tabs = [
    { path: "/", icon: Home, label: "Home", show: true },
    { path: "/search", icon: Search, label: "Search", show: true },
    ...(isOrganizer
      ? [{ path: "/create", icon: PlusCircle, label: "Create", show: true, isCenter: true }]
      : [{ path: "/team-matching", icon: Users, label: "Teams", show: true, isCenter: true }]),
    { path: "/messages", icon: MessageCircle, label: "Chats", show: true, badge: 4 },
    { path: "/profile", icon: User, label: "Profile", show: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || 
            (tab.path === "/messages" && location.pathname.startsWith("/messages"));
          const Icon = tab.icon;
          const isCenter = (tab as any).isCenter;
          const badge = (tab as any).badge;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
            >
              {isCenter ? (
                <div className="gradient-primary rounded-2xl p-2.5 -mt-4 shadow-lg cta-glow">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    {badge && badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full gradient-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground">
                        {badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
