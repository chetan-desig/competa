import { Home, Search, PlusCircle, Award, User, Users } from "lucide-react";
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
    // Organizers get Create, students get Team Matching in the center slot
    ...(isOrganizer
      ? [{ path: "/create", icon: PlusCircle, label: "Create", show: true, isCenter: true }]
      : [{ path: "/team-matching", icon: Users, label: "Teams", show: true, isCenter: true }]),
    { path: "/certificates", icon: Award, label: "Certs", show: true },
    { path: "/profile", icon: User, label: "Profile", show: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          const isCenter = (tab as any).isCenter;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
            >
              {isCenter ? (
                <div className="gradient-primary rounded-2xl p-2.5 -mt-4 shadow-lg">
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
                    {isActive && (
                      <motion.div
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full gradient-primary"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
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
