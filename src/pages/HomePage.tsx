import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, Users, PlusCircle, BarChart3, Eye, TrendingUp, Calendar, ArrowUpRight, Search, WifiOff, Loader2, Megaphone, Shield, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "@/components/EventCard";
import CategoryChips from "@/components/CategoryChips";
import BottomNav from "@/components/BottomNav";
import { mockEvents, categories, cities, mockActivities, Activity } from "@/data/mockData";
import { mockStudents, mockTeams } from "@/data/teamMatchingData";
import { useRole } from "@/hooks/useRole";

type LoadState = "loading" | "loaded" | "empty" | "error";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "☀️" };
  if (h < 17) return { text: "Good afternoon", emoji: "🌤️" };
  if (h < 21) return { text: "Good evening", emoji: "🌅" };
  return { text: "Night owl mode", emoji: "🌙" };
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isStudent, isOrganizer } = useRole();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("hyd");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [liveCity, setLiveCity] = useState<string | null>(
    () => localStorage.getItem("competa_current_city")
  );

  const greeting = getGreeting();

  useEffect(() => {
    const onboarded = localStorage.getItem("competa_onboarded");
    const locOk = localStorage.getItem("competa_location_permission") === "granted";
    if (!onboarded || !locOk) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setLiveCity(detail);
    };
    window.addEventListener("competa:city", handler);
    return () => window.removeEventListener("competa:city", handler);
  }, []);

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

  const pendingTeams = mockTeams.filter((_, i) => i !== 0 && i !== 3).length;
  const unreadNotifications = 3;

  const recentActivity = [
    { text: "Code Crushers registered for HackVerse 3.0", time: "2h ago", emoji: "🏆" },
    { text: "New participant joined DesignJam 2026", time: "4h ago", emoji: "👤" },
    { text: "Pixel Pirates team created", time: "1d ago", emoji: "🎨" },
    { text: "React Masterclass got 50 new views", time: "1d ago", emoji: "👀" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl px-5 pt-6 pb-3 border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            {isOrganizer ? (
              <>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  🎤 Organizer Dashboard
                </p>
                <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
                  Dashboard
                </h1>
              </>
            ) : (
              <>
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-muted-foreground font-medium flex items-center gap-1"
                >
                  {greeting.emoji} {greeting.text}
                </motion.p>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
                    Explore
                  </h1>
                  {/* City selector pill */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCityPicker(!showCityPicker)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary/8 text-primary text-[11px] font-bold border border-primary/15"
                  >
                    <MapPin className="w-3 h-3" />
                    {currentCity?.name}
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isOrganizer && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => navigate("/search")}
                className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm"
              >
                <Search className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate("/notifications")}
              className="relative w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-destructive-foreground"
                >
                  {unreadNotifications}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>

        {/* City picker dropdown */}
        <AnimatePresence>
          {showCityPicker && !isOrganizer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-2"
            >
              <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
                {cities.map((city) => (
                  <motion.button
                    key={city.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => { setSelectedCity(city.id); setShowCityPicker(false); }}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${selectedCity === city.id
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    <span>{city.emoji}</span>
                    {city.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOrganizer && (
          <CategoryChips
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}
      </header>

      {/* ─── ORGANIZER DASHBOARD ─── */}
      {isOrganizer && (
        <div className="px-5 pt-5 space-y-5">
          {/* Main Action */}
          <button
            onClick={() => navigate("/create")}
            className="w-full bg-primary rounded-2xl p-4 flex items-center justify-between text-left shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-primary-foreground" />
              <div>
                <h3 className="text-sm font-bold text-primary-foreground">Host New Event</h3>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary-foreground opacity-50" />
          </button>

          {/* Quick Stats */}
          <div>
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Overview
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
                    className="bg-card rounded-2xl p-4 border border-border/60 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-7 h-7 rounded-lg ${stat.color} flex items-center justify-center opacity-80`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tight">{stat.label}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                      <p className="text-[9px] text-success font-bold">{stat.trend.split(' ')[0]}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Management
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Students", icon: Users, path: "/participants", color: "bg-primary/5 text-primary" },
                { label: "Teams", icon: Shield, path: "/teams-management", color: "bg-secondary/5 text-secondary" },
                { label: "Broadcast", icon: Megaphone, path: "/announcements", color: "bg-accent/5 text-accent" },
                { label: "Data", icon: BarChart3, path: "/organizer-analytics", color: "bg-success/5 text-success" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.color} border border-transparent group-hover:border-current transition-all flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-[9px] font-semibold text-muted-foreground">{action.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* My Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                My Events
              </h2>
              <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">List view</button>
            </div>
            <div className="space-y-2">
              {mockEvents.slice(0, 3).map((event, i) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex items-center gap-3 bg-card rounded-xl p-2.5 border border-border/60 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img src={event.image} alt="" className="w-full h-full object-cover opacity-90" />
                    {i === 0 && (
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-destructive shadow-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-foreground truncate">{event.title}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{event.attendees} registered</p>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground mr-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Latest Activity
              </h2>
              <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">See all</button>
            </div>
            <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
              {mockActivities.slice(0, 3).map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i !== 2 ? 'border-b border-border/40' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-sm">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground font-medium truncate">
                      {item.text}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── STUDENT CTAs ─── */}
      {isStudent && (
        <div className="px-5 pt-5">
          <div className="space-y-3">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/team-matching")}
              className="w-full gradient-primary rounded-[1.75rem] p-5 flex items-center justify-between text-left shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
              <div className="relative flex items-center gap-4">
                <Users className="w-6 h-6 text-primary-foreground" />
                <div>
                  <h3 className="font-display text-lg font-bold text-primary-foreground">Find Your Team 🤝</h3>
                  <p className="text-primary-foreground/70 text-xs font-medium">Browse teams needing your skills</p>
                </div>
              </div>
              <div className="relative w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/people")}
              className="w-full bg-card border border-secondary/15 rounded-[1.75rem] p-4 flex items-center justify-between text-left shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
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
        </div>
      )}

      {/* ─── STUDENT EVENT FEED ─── */}
      {!isOrganizer && (
        <main className="px-5 pt-5 space-y-5">
          {loadState === "loading" && (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground font-medium mt-3">Loading events...</p>
            </div>
          )}

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

          {loadState === "loaded" && filteredEvents.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                  {filteredEvents.length} events near you
                </p>
              </div>
              {filteredEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </>
          )}

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
