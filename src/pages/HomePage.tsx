import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Bell, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "@/components/EventCard";
import CategoryChips from "@/components/CategoryChips";
import BottomNav from "@/components/BottomNav";
import { mockEvents, categories, cities } from "@/data/mockData";

const HomePage = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card px-5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-extrabold gradient-text">EduVibe</h1>
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
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative w-10 h-10 rounded-2xl bg-muted flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 gradient-secondary rounded-full border-2 border-background" />
          </motion.button>
        </div>

        <CategoryChips
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </header>

      {/* Team Matching CTA */}
      <div className="px-5 pt-4">
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
      </div>

      {/* Event Feed */}
      <main className="px-5 pt-4 space-y-5">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground font-medium">
              No events found in {currentCity?.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try switching cities or categories
            </p>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;
