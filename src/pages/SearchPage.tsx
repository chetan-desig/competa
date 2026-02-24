import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal, UserPlus, Mail } from "lucide-react";
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

const SearchPage = () => {
  const { isOrganizer } = useRole();
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

  const filteredStudents = useMemo(() => {
    if (!query) return mockStudents;
    return mockStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  // Organizer Search: Find students to invite
  if (isOrganizer) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="px-5 pt-5 pb-3">
          <h1 className="text-2xl font-extrabold mb-1">Find Students</h1>
          <p className="text-sm text-muted-foreground mb-4">Discover & invite talent to your events 🎯</p>

          <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, skill, city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>

          {/* Skill filter chips */}
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
              className="flex items-center gap-3 bg-card rounded-2xl p-3 shadow-sm"
            >
              <img
                src={student.img}
                alt={student.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-card-foreground">{student.name}</p>
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
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 text-accent" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
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

  // Student Search: Discover events
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
