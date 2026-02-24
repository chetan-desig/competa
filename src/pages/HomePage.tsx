import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Bell, Users, PlusCircle, BarChart3, Eye, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "@/components/EventCard";
import CategoryChips from "@/components/CategoryChips";
import BottomNav from "@/components/BottomNav";
import { mockEvents, categories, cities } from "@/data/mockData";
import { useRole } from "@/hooks/useRole";

const HomePage = () => {
  const navigate = useNavigate();
  const { isStudent, isOrganizer } = useRole();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("hyd");
  useEffect(() => {
    if (!localStorage.getItem("eduvibe_onboarded")) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

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

  // Organizer mock stats
  const organizerStats = [
    { label: "Total Events", value: "6", icon: Calendar, trend: "+2 this month" },
    { label: "Total Views", value: "3.2K", icon: Eye, trend: "+18%" },
    { label: "Registrations", value: "1,870", icon: TrendingUp, trend: "+24%" },
    { label: "Avg. Engagement", value: "72%", icon: BarChart3, trend: "+5%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with sticky filter chips */}
      <header className="sticky top-0 z-40 glass-card px-5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-extrabold gradient-text">EduVibe</h1>
            {isOrganizer ? (
              <p className="text-sm text-muted-foreground mt-0.5 font-medium">🎤 Organizer Dashboard</p>
            ) : (
              <button
                className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5"
                onClick={() => {
                  const idx = cities.findIndex((c) => c.id === selectedCity);
                  setSelectedCity(cities[(idx + 1) % cities.length].id);
                }}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentCity?.name}, {currentCity?.state}</span>
              </button>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative w-10 h-10 rounded-2xl bg-muted flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 gradient-secondary rounded-full border-2 border-background" />
          </motion.button>
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
      <div className="px-5 pt-4">
        {isStudent && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/team-matching")}
            className="w-full gradient-primary rounded-3xl p-4 flex items-center gap-4 text-left"
          >
            <div className="bg-primary-foreground/20 rounded-2xl p-2.5">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-primary-foreground text-base">Find Your Team 🤝</h3>
              <p className="text-primary-foreground/70 text-xs">Swipe to match with teammates</p>
            </div>
          </motion.button>
        )}
        {isOrganizer && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/create")}
            className="w-full gradient-secondary rounded-3xl p-4 flex items-center gap-4 text-left"
          >
            <div className="bg-primary-foreground/20 rounded-2xl p-2.5">
              <PlusCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-primary-foreground text-base">Create an Event 🎤</h3>
              <p className="text-primary-foreground/70 text-xs">Host your next hackathon or workshop</p>
            </div>
          </motion.button>
        )}
      </div>

      {/* Organizer: Dashboard Stats + My Events */}
      {isOrganizer && (
        <div className="px-5 pt-5 space-y-5">
          {/* Quick Stats */}
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              📊 Quick Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {organizerStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-3xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-xl font-extrabold text-card-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-[10px] text-accent font-semibold mt-0.5">{stat.trend}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* My Events */}
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              🗓️ My Events
            </h2>
            <div className="space-y-4">
              {mockEvents.slice(0, 3).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex items-center gap-3 bg-card rounded-2xl p-3 shadow-sm cursor-pointer"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-card-foreground truncate">{event.title}</p>
                    <p className="text-[11px] text-muted-foreground">{event.date}</p>
                    <p className="text-[11px] text-accent font-semibold">{event.attendees} registered</p>
                  </div>
                  <div className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-accent/10 text-accent">
                    Live
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              ⚡ Recent Activity
            </h2>
            <div className="space-y-2">
              {[
                { text: "12 new registrations for HackVerse 3.0", time: "2h ago", emoji: "🎉" },
                { text: "DesignJam 2026 was featured on Explore", time: "5h ago", emoji: "⭐" },
                { text: "New review from a participant", time: "1d ago", emoji: "💬" },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 shadow-sm"
                >
                  <span className="text-lg">{activity.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-card-foreground">{activity.text}</p>
                    <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student: Event Feed */}
      {!isOrganizer && (
        <main className="px-5 pt-4 space-y-5">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-4"
            >
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-foreground font-bold text-lg mb-1">
                No events in {currentCity?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                We'll let you know when new events pop up here
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="gradient-primary text-primary-foreground font-semibold py-3 rounded-2xl text-sm cta-glow btn-pop"
                >
                  🔔 Notify me when events are added
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExpandSearch}
                  className="bg-muted text-foreground font-semibold py-3 rounded-2xl text-sm btn-pop"
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
