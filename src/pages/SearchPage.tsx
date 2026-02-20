import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import { mockEvents, cities } from "@/data/mockData";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>(["hyd"]);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const toggleCity = (id: string) => {
    setSelectedCities((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const results = useMemo(() => {
    return mockEvents.filter((event) => {
      const cityMatch = selectedCities.includes(event.city) || (showOnlineOnly && event.isOnline);
      const queryMatch = !query || event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return cityMatch && queryMatch;
    });
  }, [query, selectedCities, showOnlineOnly]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-extrabold mb-4">Discover</h1>

        {/* Search bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events, skills, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-12 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>

        {/* City selection */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Select Cities (max 3)
          </p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {cities.map((city) => {
              const isSelected = selectedCities.includes(city.id);
              return (
                <motion.button
                  key={city.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCity(city.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isSelected
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span>{city.emoji}</span>
                  <span>{city.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Online toggle */}
        <button
          onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          className={`text-xs font-semibold px-4 py-2 rounded-2xl transition-all ${
            showOnlineOnly
              ? "gradient-secondary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          🌐 Include Online Events
        </button>
      </header>

      <main className="px-5 space-y-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {results.length} events found
        </p>
        {results.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
