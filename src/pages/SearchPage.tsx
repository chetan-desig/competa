import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal, UserPlus, Mail, TrendingUp, Clock, X } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import { mockEvents, cities } from "@/data/mockData";
import { useRole } from "@/hooks/useRole";

import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";
import student5 from "@/assets/student-5.jpg";

const mockStudents = [
  { id: "1", name: "Priya Sharma", skills: ["React", "Figma"], city: "Hyderabad", img: student1, xp: 1200 },
  { id: "2", name: "Arjun Reddy", skills: ["Python", "AI/ML"], city: "Bangalore", img: student2, xp: 980 },
  { id: "3", name: "Sneha Patel", skills: ["UI/UX", "Illustration"], city: "Mumbai", img: student3, xp: 1540 },
  { id: "4", name: "Ravi Kumar", skills: ["Node.js", "DevOps"], city: "Pune", img: student4, xp: 760 },
  { id: "5", name: "Ananya Das", skills: ["Flutter", "Firebase"], city: "Chennai", img: student5, xp: 1100 },
];

const trendingSearches = ["Hackathon 2026", "AI/ML Workshop", "Design Sprint", "React", "Startup Weekend"];
const recentSearches = ["DesignJam", "Flutter"];

const SearchPage = () => {
  const { isOrganizer } = useRole();
  const [query, setQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>(["hyd"]);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const filteredStudents = useMemo(() => {
    if (!query) return mockStudents;
    return mockStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  const showSuggestions = isFocused && !query;

  // Organizer Search
  if (isOrganizer) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="px-5 pt-5 pb-3">
          <h1 className="text-2xl font-display font-bold mb-1">Find Students</h1>
          <p className="text-sm text-muted-foreground mb-4">Discover & invite talent to your events 🎯</p>

          <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, skill, city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-14 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-2">
            {["React", "Python", "Figma", "AI/ML", "Flutter", "DevOps"].map((skill) => (
              <button
                key={skill}
                onClick={() => setQuery(skill)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  query === skill
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </header>

        <main className="px-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {filteredStudents.length} students found
          </p>
          {filteredStudents.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 bg-card rounded-[1.25rem] p-3.5 border border-border shadow-sm"
            >
              <img
                src={student.img}
                alt={student.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-bold text-card-foreground">{student.name}</p>
                <p className="text-[11px] text-muted-foreground">📍 {student.city} · ⚡ {student.xp} XP</p>
                <div className="flex gap-1.5 mt-1">
                  {student.skills.map((s) => (
                    <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 text-accent" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 text-primary-foreground" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </main>

        <BottomNav />
      </div>
    );
  }

  // Student Search
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl px-5 pt-5 pb-3 border-b border-border/30">
        <h1 className="text-2xl font-display font-bold mb-4">Discover</h1>

        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events, skills, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full pl-11 pr-12 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-14 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-3 bg-card rounded-2xl border border-border p-4 shadow-lg space-y-3"
            >
              {recentSearches.length > 0 && (
                <div>
                  <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">Recent</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted text-xs font-medium text-foreground"
                      >
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">Trending 🔥</p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/8 text-xs font-medium text-primary"
                    >
                      <TrendingUp className="w-3 h-3" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* City selection */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Cities (max 3)
          </p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {cities.map((city) => {
              const isSelected = selectedCities.includes(city.id);
              return (
                <motion.button
                  key={city.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCity(city.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
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

        <button
          onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          className={`text-xs font-bold px-4 py-2 rounded-2xl transition-all ${
            showOnlineOnly
              ? "gradient-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground"
          }`}
        >
          🌐 Include Online Events
        </button>
      </header>

      <main className="px-5 pt-4 space-y-5">
        <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
          {results.length} events found
        </p>
        {results.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
        {results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-display font-bold text-foreground">No events found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
