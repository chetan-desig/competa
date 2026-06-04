import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search, Info, MapPin, Sparkles, Users, ShieldCheck } from "lucide-react";
import Confetti from "@/components/Confetti";
import { setUserRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";

const CITIES = [
  { id: "hyd", name: "Hyderabad", emoji: "🏛️" },
  { id: "blr", name: "Bangalore", emoji: "🌆" },
  { id: "mum", name: "Mumbai", emoji: "🌊" },
  { id: "pun", name: "Pune", emoji: "⛰️" },
  { id: "che", name: "Chennai", emoji: "🏖️" },
  { id: "del", name: "Delhi", emoji: "🏰" },
  { id: "kol", name: "Kolkata", emoji: "🌉" },
  { id: "ahm", name: "Ahmedabad", emoji: "🏗️" },
];

const SKILLS = [
  { label: "UI/UX", emoji: "🎨" },
  { label: "Frontend", emoji: "💻" },
  { label: "Backend", emoji: "⚙️" },
  { label: "AI/ML", emoji: "🤖" },
  { label: "Product", emoji: "📦" },
  { label: "Content", emoji: "✍️" },
];

const INTERESTS = [
  { label: "Hackathons", emoji: "🚀" },
  { label: "Design", emoji: "🎨" },
  { label: "Live Events", emoji: "🎤" },
  { label: "Workshops", emoji: "🛠️" },
];

const slideVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const ROLE_TOOLTIPS = {
  student: "Browse events, join hackathons, form teams, earn certificates, and build your portfolio.",
  organizer: "Create & manage events, recruit participants, track analytics, and issue certificates.",
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<"student" | "organizer" | null>(null);
  const [studentName, setStudentName] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Organizer state
  const [orgName, setOrgName] = useState("");
  const [orgEventTypes, setOrgEventTypes] = useState<string[]>([]);

  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");

  const totalSteps = role === "student" ? 7 : role === "organizer" ? 6 : 2;
  const locationStepIndex = role === "student" ? 6 : 5;

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string, max?: number) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else if (!max || list.length < max) {
      setList([...list, item]);
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem("competa_onboarded", "true");
    if (role) setUserRole(role);

    // Save onboarding data to profile
    if (role === "student") {
      const cityName = CITIES.find(c => selectedCities.includes(c.id))?.name || "";
      const profileData = {
        name: studentName.trim() || "Student",
        bio: "",
        location: cityName,
        avatar: "🧑‍💻",
        skills: selectedSkills.length > 0 ? selectedSkills : ["React", "Figma", "Python", "UI/UX", "AI/ML"],
        github: "",
        linkedin: "",
        portfolio: "",
      };
      localStorage.setItem("competa_profile", JSON.stringify(profileData));
    }

    const dest = role === "organizer" ? "/create" : "/";
    navigate(dest, { replace: true });
  };

  const next = () => {
    if (step === totalSteps - 1) {
      setShowConfetti(true);
      setTimeout(finishOnboarding, 2000);
    } else {
      setStep((s) => s + 1);
    }
  };

  const skip = () => {
    if (role) setUserRole(role);
    finishOnboarding();
  };

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        localStorage.setItem("competa_location_permission", "granted");
        setLocationStatus("granted");
        try {
          let sid = localStorage.getItem("competa_session_id");
          if (!sid) {
            sid = (crypto.randomUUID && crypto.randomUUID()) || `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            localStorage.setItem("competa_session_id", sid);
          }
          await supabase.from("user_locations" as any).insert({
            session_id: sid,
            role: role ?? null,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy ?? null,
            user_agent: navigator.userAgent,
          });
        } catch {}
      },
      () => {
        localStorage.setItem("competa_location_permission", "denied");
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const canContinue = () => {
    if (step === 0) return true;
    if (step === 1) return !!role;
    if (role === "student") {
      if (step === 2) return studentName.trim().length >= 2;
      if (step === 3) return selectedCities.length > 0;
      if (step === 4) return selectedSkills.length > 0;
      if (step === 5) return true;
    }
    if (role === "organizer") {
      if (step === 2) return orgName.trim().length > 0;
      if (step === 3) return orgEventTypes.length > 0;
      if (step === 4) return selectedCities.length > 0;
    }
    return true;
  };

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return CITIES;
    return CITIES.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase()));
  }, [citySearch]);

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center px-8 flex-1">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl mb-8"
          >
            ⚡
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            Welcome to Competa
          </h1>
          <p className="text-muted-foreground text-base max-w-xs">
            Compete. Connect. Conquer.
          </p>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={next}
            className="mt-10 gradient-primary text-primary-foreground font-bold text-lg px-10 py-4 rounded-full cta-glow btn-pop"
          >
            Get Started 🚀
          </motion.button>
          <button onClick={skip} className="mt-4 text-sm text-muted-foreground">
            Skip for now
          </button>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="flex flex-col items-center justify-center px-6 flex-1">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Who are you? 👋</h2>
          <p className="text-muted-foreground text-sm mb-8">Pick your role</p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
              { r: "student" as const, emoji: "🎓", desc: "Join events & find teammates" },
              { r: "organizer" as const, emoji: "🎤", desc: "Host hackathons & workshops" },
            ].map((opt) => (
              <motion.button
                key={opt.r}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRole(opt.r)}
                className={`relative rounded-3xl p-6 flex flex-col items-center gap-3 border-2 transition-all btn-pop ${
                  role === opt.r
                    ? "border-primary bg-primary/10 shadow-lg cta-glow"
                    : "border-border bg-card"
                }`}
              >
                <span className="text-5xl">{opt.emoji}</span>
                <span className="font-display font-bold text-foreground capitalize">{opt.r}</span>
                <span className="text-xs text-muted-foreground text-center">{opt.desc}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(showTooltip === opt.r ? null : opt.r);
                  }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                >
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {showTooltip === opt.r && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full z-20 w-52 bg-card border border-border rounded-2xl p-3 shadow-xl"
                    >
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {ROLE_TOOLTIPS[opt.r]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    if (role === "student") {
      if (step === 2) {
        return (
          <div className="flex flex-col items-center justify-center px-6 flex-1">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-6"
            >
              👋
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">What's your name?</h2>
            <p className="text-muted-foreground text-sm mb-8">So people know who you are</p>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Alex Kumar"
              className="w-full max-w-sm bg-card border-2 border-border rounded-2xl px-5 py-4 text-foreground text-lg font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors text-center"
              autoFocus
            />
          </div>
        );
      }

      if (step === 3) {
        return (
          <div className="flex flex-col px-6 flex-1">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">Your cities 🏙️</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Pick up to 3 cities (
              <span className="text-primary font-semibold">{selectedCities.length}/3</span>)
            </p>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[50vh]">
              {filteredCities.map((city) => {
                const selected = selectedCities.includes(city.id);
                return (
                  <motion.button
                    key={city.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleItem(selectedCities, setSelectedCities, city.id, 3)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all btn-pop ${
                      selected
                        ? "border-primary bg-primary/8 shadow-sm"
                        : "border-border bg-card"
                    }`}
                  >
                    <span className="text-3xl">{city.emoji}</span>
                    <span className="font-semibold text-foreground flex-1 text-left">{city.name}</span>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center"
                      >
                        <span className="text-primary-foreground text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
              {filteredCities.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">No cities match "{citySearch}"</p>
              )}
            </div>
          </div>
        );
      }

      if (step === 4) {
        return (
          <div className="flex flex-col px-6 flex-1">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">Your skills 💪</h2>
            <p className="text-muted-foreground text-sm mb-6">What do you bring to the team?</p>
            <div className="flex flex-wrap gap-3">
              {SKILLS.map((skill) => {
                const selected = selectedSkills.includes(skill.label);
                return (
                  <motion.button
                    key={skill.label}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggleItem(selectedSkills, setSelectedSkills, skill.label)}
                    className={`px-5 py-3 rounded-full text-sm font-semibold border-2 transition-all btn-pop flex items-center gap-2 ${
                      selected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <span className="text-lg">{skill.emoji}</span>
                    {skill.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      }

      if (step === 5) {
        return (
          <div className="flex flex-col px-6 flex-1">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">Interests 🔥</h2>
            <p className="text-muted-foreground text-sm mb-6">What excites you?</p>
            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map((interest) => {
                const selected = selectedInterests.includes(interest.label);
                return (
                  <motion.button
                    key={interest.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleItem(selectedInterests, setSelectedInterests, interest.label)}
                    className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all btn-pop ${
                      selected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card"
                    }`}
                  >
                    <span className="text-4xl">{interest.emoji}</span>
                    <span className="font-semibold text-sm text-foreground">{interest.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      }
    }

    if (role === "organizer") {
      if (step === 2) {
        return (
          <div className="flex flex-col px-6 flex-1">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">Your Org 🏢</h2>
            <p className="text-muted-foreground text-sm mb-6">What's your organization called?</p>
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. TechHive Club"
              className="w-full bg-card border-2 border-border rounded-2xl px-5 py-4 text-foreground text-lg font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        );
      }

      if (step === 3) {
        const eventTypes = [
          { label: "Hackathon", emoji: "🚀" },
          { label: "Workshop", emoji: "🛠️" },
          { label: "Design Contest", emoji: "🎨" },
          { label: "Live Event", emoji: "🎤" },
        ];
        return (
          <div className="flex flex-col px-6 flex-1">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">Event Types 🎯</h2>
            <p className="text-muted-foreground text-sm mb-6">What do you organize?</p>
            <div className="grid grid-cols-2 gap-3">
              {eventTypes.map((et) => {
                const selected = orgEventTypes.includes(et.label);
                return (
                  <motion.button
                    key={et.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleItem(orgEventTypes, setOrgEventTypes, et.label)}
                    className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all btn-pop ${
                      selected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card"
                    }`}
                  >
                    <span className="text-4xl">{et.emoji}</span>
                    <span className="font-semibold text-sm text-foreground">{et.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      }

      if (step === 4) {
        return (
          <div className="flex flex-col px-6 flex-1">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">Your city 🏙️</h2>
            <p className="text-muted-foreground text-sm mb-4">Where are you based?</p>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[50vh]">
              {filteredCities.map((city) => {
                const selected = selectedCities.includes(city.id);
                return (
                  <motion.button
                    key={city.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleItem(selectedCities, setSelectedCities, city.id, 3)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all btn-pop ${
                      selected
                        ? "border-primary bg-primary/8 shadow-sm"
                        : "border-border bg-card"
                    }`}
                  >
                    <span className="text-3xl">{city.emoji}</span>
                    <span className="font-semibold text-foreground flex-1 text-left">{city.name}</span>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center"
                      >
                        <span className="text-primary-foreground text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      }
    }

    return null;
  };

  if (showConfetti) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Confetti />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <div className="text-7xl mb-6">⚡</div>
          <h1 className="text-3xl font-display font-bold text-foreground">You're all set!</h1>
          <p className="text-muted-foreground mt-2">
            {role === "organizer" ? "Let's create your first event 🎤" : "Time to compete 🏆"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {step > 0 && (
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="text-muted-foreground text-sm font-medium">
            ← Back
          </button>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i <= step ? "w-7 gradient-primary" : "w-4 bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">
              Step {step} of {totalSteps - 1}
            </span>
          </div>
          <button onClick={skip} className="text-muted-foreground text-sm font-medium">
            Skip
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col pt-8 pb-32"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={next}
            disabled={!canContinue()}
            className={`w-full py-4 rounded-full font-display font-bold text-lg flex items-center justify-center gap-2 btn-pop transition-all ${
              canContinue()
                ? "gradient-primary text-primary-foreground cta-glow"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step === totalSteps - 1 ? "Let's Go! 🎉" : "Continue"}
            {step < totalSteps - 1 && <ChevronRight className="w-5 h-5" />}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
