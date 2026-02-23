import { useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, FileText, Tag, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { categories, cities } from "@/data/mockData";
import { useRole } from "@/hooks/useRole";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { isOrganizer } = useRole();

  useEffect(() => {
    if (!isOrganizer) {
      navigate("/", { replace: true });
    }
  }, [isOrganizer, navigate]);

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Event Title
          </label>
          <input
            type="text"
            placeholder="e.g. HackVerse 3.0"
            className="w-full px-4 py-3.5 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Description
          </label>
          <textarea
            placeholder="Tell people about your event..."
            rows={4}
            className="w-full px-4 py-3.5 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c.id !== "all").map((cat) => (
              <button
                key={cat.id}
                className="px-4 py-2 rounded-2xl bg-muted text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            City
          </label>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {cities.map((city) => (
              <button
                key={city.id}
                className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-2xl bg-muted text-sm font-semibold text-muted-foreground"
              >
                <span>{city.emoji}</span>
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-3.5 rounded-2xl bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
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
