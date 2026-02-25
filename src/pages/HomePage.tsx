import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Bell, Users, PlusCircle, BarChart3, Eye, TrendingUp, Calendar, ArrowUpRight, Search } from "lucide-react";
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

  const organizerStats = [
    { label: "Total Events", value: "6", icon: Calendar, trend: "+2 this month" },
    { label: "Total Views", value: "3.2K", icon: Eye, trend: "+18%" },
    { label: "Registrations", value: "1,870", icon: TrendingUp, trend: "+24%" },
    { label: "Avg. Engagement", value: "72%", icon: BarChart3, trend: "+5%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background px-5 pt-6 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              {isOrganizer ? "🎤 Organizer" : `📍 ${currentCity?.name}`}
            </p>
            <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
              {isOrganizer ? "Dashboard" : "Explore Events"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!isOrganizer && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/search")}
                className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-card rounded-full border-2 border-background" />
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
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/team-matching")}
            className="w-full bg-purple rounded-3xl p-5 flex items-center justify-between text-left"
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
        )}
        {isOrganizer && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/create")}
            className="w-full bg-gold rounded-3xl p-5 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-4">
              <PlusCircle className="w-6 h-6 text-foreground" />
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Create an Event 🎤</h3>
                <p className="text-foreground/70 text-xs font-medium">Host your next hackathon or workshop</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-foreground" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Organizer Dashboard */}
      {isOrganizer && (
        <div className="px-5 pt-5 space-y-5">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
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
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <p className="text-2xl font-display font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-[10px] text-olive font-semibold mt-0.5">{stat.trend}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
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
                  className="flex items-center gap-3 bg-card rounded-3xl p-4 border border-border cursor-pointer"
                >
                  <img src={event.image} alt={event.title} className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-card-foreground truncate">{event.title}</p>
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
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))
          ) : (
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
                  className="bg-foreground text-background font-bold py-3.5 rounded-2xl text-sm btn-pop"
                >
                  🔔 Notify me when events are added
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExpandSearch}
                  className="bg-card text-foreground border border-border font-bold py-3.5 rounded-2xl text-sm btn-pop"
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
