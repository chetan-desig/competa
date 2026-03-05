import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, Users, PlusCircle, BarChart3, Eye, TrendingUp, Calendar, ArrowUpRight, Search, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "@/components/EventCard";
import CategoryChips from "@/components/CategoryChips";
import BottomNav from "@/components/BottomNav";
import { mockEvents, categories, cities } from "@/data/mockData";
import { mockStudents } from "@/data/teamMatchingData";
import { useRole } from "@/hooks/useRole";

type LoadState = "loading" | "loaded" | "empty" | "error";

const HomePage = () => {
  const navigate = useNavigate();
  const { isStudent, isOrganizer } = useRole();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("hyd");
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    if (!localStorage.getItem("eduvibe_onboarded")) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoadState("loaded"), 800);
    return () => clearTimeout(t);
  }, []);

  const currentCity = cities.find((c) => c.id === selectedCity);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
      const cityMatch = event.city === selectedCity || event.isOnline;
      return categoryMatch && cityMatch;
    });
  }, [selectedCategory, selectedCity]);

  const handleExpandSearch = () => {
    setSelectedCategory("all");
    const idx = cities.findIndex((c) => c.id === selectedCity);
    setSelectedCity(cities[(idx + 1) % cities.length].id);
  };

  const organizerStats = [
    { label: "Total Events", value: "6", icon: Calendar, trend: "+2 this month", color: "bg-primary/10 text-primary" },
    { label: "Total Views", value: "3.2K", icon: Eye, trend: "+18%", color: "bg-secondary/10 text-secondary" },
    { label: "Registrations", value: "1,870", icon: TrendingUp, trend: "+24%", color: "bg-success/10 text-success" },
    { label: "Engagement", value: "72%", icon: BarChart3, trend: "+5%", color: "bg-accent/10 text-accent" },
  ];

  const unreadNotifications = 3;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              {isOrganizer ? "🎤 Organizer Dashboard" : `📍 ${currentCity?.name}`}
            </p>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
              {isOrganizer ? "Dashboard" : "Explore Events"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!isOrganizer && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/search")}
                className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/notifications")}
              className="relative w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-accent-foreground">
                  {unreadNotifications}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {!isOrganizer && (
          <CategoryChips
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}
      </header>

      {/* Role-specific CTA */}
      <div className="px-5 pt-5">
        {isStudent && (
          <div className="space-y-3">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/team-matching")}
              className="w-full gradient-primary rounded-3xl p-5 flex items-center justify-between text-left shadow-lg"
            >
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-primary-foreground" />
                <div>
                  <h3 className="font-display text-lg font-bold text-primary-foreground">Find Your Team 🤝</h3>
                  <p className="text-primary-foreground/70 text-xs font-medium">Browse teams needing your skills</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/buddies")}
              className="w-full bg-card border-2 border-accent/20 rounded-3xl p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                    <span className="text-lg">👋</span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">Browse Students</h3>
                  <p className="text-muted-foreground text-xs">View profiles & add buddies</p>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-muted border-2 border-card overflow-hidden">
                    <img src={mockStudents[i]?.profile_photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[9px] font-bold text-primary">
                  +{mockStudents.length - 3}
                </div>
              </div>
            </motion.button>
          </div>
        )}
        {isOrganizer && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/create")}
            className="w-full gradient-primary rounded-3xl p-5 flex items-center justify-between text-left shadow-lg"
          >
            <div className="flex items-center gap-4">
              <PlusCircle className="w-6 h-6 text-primary-foreground" />
              <div>
                <h3 className="font-display text-lg font-bold text-primary-foreground">Create Event 🎤</h3>
                <p className="text-primary-foreground/70 text-xs font-medium">Host your next hackathon or workshop</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Organizer Dashboard */}
      {isOrganizer && (
        <div className="px-5 pt-5 space-y-5">
          <div>
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {organizerStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-3xl p-4 border border-border"
                  >
                    <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-display font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-[10px] text-success font-semibold mt-0.5">{stat.trend}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">
              My Events
            </h2>
            <div className="space-y-3">
              {mockEvents.slice(0, 3).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border cursor-pointer"
                >
                  <img src={event.image} alt={event.title} className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold text-card-foreground truncate">{event.title}</p>
                    <p className="text-[11px] text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-foreground" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student Event Feed */}
      {!isOrganizer && (
        <main className="px-5 pt-5 space-y-5">
          {/* Loading State */}
          {loadState === "loading" && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground font-medium">Loading events...</p>
            </div>
          )}

          {/* Error State */}
          {loadState === "error" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-4">
              <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-display text-xl font-bold text-foreground mb-1">Connection Lost</p>
              <p className="text-sm text-muted-foreground mb-6">Check your internet and try again</p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setLoadState("loading")}
                className="gradient-primary text-primary-foreground font-bold py-3.5 px-8 rounded-2xl text-sm"
              >
                🔄 Retry
              </motion.button>
            </motion.div>
          )}

          {/* Loaded State */}
          {loadState === "loaded" && filteredEvents.length > 0 && (
            filteredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))
          )}

          {/* Empty State */}
          {loadState === "loaded" && filteredEvents.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-4">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-display text-xl font-bold text-foreground mb-1">
                No events in {currentCity?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                We'll let you know when new events pop up here
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl text-sm"
                >
                  🔔 Notify me when events are added
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExpandSearch}
                  className="bg-card text-foreground border border-border font-bold py-3.5 rounded-2xl text-sm"
                >
                  🌍 Expand to nearby cities
                </motion.button>
              </div>
            </motion.div>
          )}
        </main>
      )}

      <BottomNav />
    </div>
  );
};

export default HomePage;
