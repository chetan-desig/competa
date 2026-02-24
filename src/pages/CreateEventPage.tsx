import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Users, Shield, Shuffle, Plus, Minus, ChevronDown, ChevronUp, Clock, Trophy, Code, Palette, Mic, Megaphone, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { categories, cities } from "@/data/mockData";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

const roleOptions = [
  { id: "developer", label: "Developer", emoji: "💻", icon: Code },
  { id: "designer", label: "Designer", emoji: "🎨", icon: Palette },
  { id: "presenter", label: "Presenter", emoji: "🎤", icon: Mic },
  { id: "marketing", label: "Marketing", emoji: "📢", icon: Megaphone },
  { id: "mentor", label: "Mentor", emoji: "🧠", icon: Zap },
];

const matchingModes = [
  { id: "auto", label: "Auto Match", emoji: "🤖", desc: "AI pairs participants by skills" },
  { id: "swipe", label: "Swipe Match", emoji: "💫", desc: "Tinder-style team finding" },
  { id: "manual", label: "Manual Teams", emoji: "✋", desc: "Participants form their own teams" },
  { id: "none", label: "No Teams", emoji: "🚫", desc: "Individual participation only" },
];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { isOrganizer } = useRole();

  // Basic fields
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Participant limits
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(5);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);

  // Roles
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [roleLimits, setRoleLimits] = useState<Record<string, number>>({});

  // Matching
  const [matchingMode, setMatchingMode] = useState("swipe");
  const [matchingDeadline, setMatchingDeadline] = useState(true);

  // Sections expand
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    participants: false,
    roles: false,
    matching: false,
  });

  useEffect(() => {
    if (!isOrganizer) {
      navigate("/", { replace: true });
    }
  }, [isOrganizer, navigate]);

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const updateRoleLimit = (id: string, delta: number) => {
    setRoleLimits((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 10) + delta),
    }));
  };

  const handlePublish = () => {
    toast.success("Event published! 🎉", { description: "Your event is now live." });
  };

  const SectionHeader = ({ title, emoji, sectionKey }: { title: string; emoji: string; sectionKey: string }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between py-3"
    >
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <span>{emoji}</span> {title}
      </span>
      {expandedSections[sectionKey] ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );

  const CounterControl = ({ value, onChange, min = 1, max = 1000 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="text-lg font-bold text-foreground w-12 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-extrabold mb-1">Create Event</h1>
        <p className="text-sm text-muted-foreground">Share your event with the community</p>
      </header>

      <div className="px-5 space-y-5">
        {/* Cover Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-48 rounded-3xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer"
        >
          <Camera className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Add Cover Image</span>
        </motion.div>

        {/* Title */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Event Title</label>
          <input
            type="text"
            placeholder="e.g. HackVerse 3.0"
            className="w-full px-4 py-3.5 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Description</label>
          <textarea
            placeholder="Tell people about your event..."
            rows={4}
            className="w-full px-4 py-3.5 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c.id !== "all").map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">City</label>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                  selectedCity === city.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span>{city.emoji}</span>
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Date</label>
          <input
            type="date"
            className="w-full px-4 py-3.5 rounded-2xl bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* ── Participants & Limits ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-muted/50 backdrop-blur-sm border border-border/50 overflow-hidden"
        >
          <SectionHeader title="Participants & Limits" emoji="👥" sectionKey="participants" />
          <AnimatePresence>
            {expandedSections.participants && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 space-y-4 overflow-hidden"
              >
                {/* Max Participants */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Max Participants</p>
                    <p className="text-xs text-muted-foreground">Total capacity for the event</p>
                  </div>
                  <CounterControl value={maxParticipants} onChange={setMaxParticipants} min={5} max={10000} />
                </div>

                {/* Team Size Range */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Min Team Size</p>
                    <p className="text-xs text-muted-foreground">Smallest allowed team</p>
                  </div>
                  <CounterControl value={minTeamSize} onChange={(v) => setMinTeamSize(Math.min(v, maxTeamSize))} min={1} max={10} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Max Team Size</p>
                    <p className="text-xs text-muted-foreground">Largest allowed team</p>
                  </div>
                  <CounterControl value={maxTeamSize} onChange={(v) => setMaxTeamSize(Math.max(v, minTeamSize))} min={2} max={20} />
                </div>

                {/* Waitlist Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Enable Waitlist</p>
                    <p className="text-xs text-muted-foreground">Allow overflow registrations</p>
                  </div>
                  <button
                    onClick={() => setWaitlistEnabled(!waitlistEnabled)}
                    className={`w-12 h-7 rounded-full relative transition-colors ${
                      waitlistEnabled ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <motion.div
                      animate={{ x: waitlistEnabled ? 20 : 2 }}
                      className="w-5 h-5 rounded-full bg-background shadow-md absolute top-1"
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Roles ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl bg-muted/50 backdrop-blur-sm border border-border/50 overflow-hidden"
        >
          <SectionHeader title="Participant Roles" emoji="🎭" sectionKey="roles" />
          <AnimatePresence>
            {expandedSections.roles && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 space-y-3 overflow-hidden"
              >
                <p className="text-xs text-muted-foreground">Select roles participants can choose when joining</p>
                <div className="space-y-2">
                  {roleOptions.map((role) => {
                    const active = selectedRoles.includes(role.id);
                    return (
                      <div key={role.id} className="flex items-center justify-between">
                        <button
                          onClick={() => toggleRole(role.id)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                            active
                              ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                              : "bg-muted text-muted-foreground hover:bg-primary/5"
                          }`}
                        >
                          <span>{role.emoji}</span>
                          <span>{role.label}</span>
                        </button>
                        {active && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <span className="text-xs text-muted-foreground">Limit:</span>
                            <CounterControl
                              value={roleLimits[role.id] || 10}
                              onChange={(v) => setRoleLimits((prev) => ({ ...prev, [role.id]: v }))}
                              min={1}
                              max={500}
                            />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Matching ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-muted/50 backdrop-blur-sm border border-border/50 overflow-hidden"
        >
          <SectionHeader title="Team Matching" emoji="🔗" sectionKey="matching" />
          <AnimatePresence>
            {expandedSections.matching && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 space-y-3 overflow-hidden"
              >
                <p className="text-xs text-muted-foreground">How should participants find their teams?</p>
                <div className="grid grid-cols-2 gap-2">
                  {matchingModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setMatchingMode(mode.id)}
                      className={`p-3 rounded-2xl text-left transition-all ${
                        matchingMode === mode.id
                          ? "bg-primary/15 ring-1 ring-primary/30"
                          : "bg-muted hover:bg-primary/5"
                      }`}
                    >
                      <span className="text-xl">{mode.emoji}</span>
                      <p className={`text-sm font-bold mt-1 ${matchingMode === mode.id ? "text-primary" : "text-foreground"}`}>
                        {mode.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{mode.desc}</p>
                    </button>
                  ))}
                </div>

                {matchingMode !== "none" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between pt-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Matching Deadline
                      </p>
                      <p className="text-xs text-muted-foreground">Close matching 24h before event</p>
                    </div>
                    <button
                      onClick={() => setMatchingDeadline(!matchingDeadline)}
                      className={`w-12 h-7 rounded-full relative transition-colors ${
                        matchingDeadline ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <motion.div
                        animate={{ x: matchingDeadline ? 20 : 2 }}
                        className="w-5 h-5 rounded-full bg-background shadow-md absolute top-1"
                      />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePublish}
          className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg"
        >
          Publish Event 🚀
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default CreateEventPage;
