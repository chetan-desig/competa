import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Users, Bookmark, ArrowUpRight, Heart, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/data/mockData";
import { useState, useRef, useCallback } from "react";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  // Double-tap to save
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setSaved(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  }, []);

  // Prize extraction from description
  const prizeMatch = event.description.match(/₹[\d.]+[LKM]?/i);
  const prize = prizeMatch ? prizeMatch[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 120 }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-[1.75rem] overflow-hidden cursor-pointer group"
      onClick={() => {
        handleTap();
        // Navigate on single tap (with slight delay to detect double-tap)
        setTimeout(() => {
          if (Date.now() - lastTap.current >= 300) {
            navigate(`/event/${event.id}`);
          }
        }, 310);
      }}
    >
      {/* Background image with premium gradient */}
      <div className="relative h-56">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />
      </div>

      {/* Double-tap heart animation */}
      {showHeart && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <Heart className="w-20 h-20 text-white fill-white drop-shadow-2xl" />
        </motion.div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-white uppercase tracking-wider border border-white/10">
              {event.category}
            </span>
            {prize && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/10 flex items-center gap-1"
              >
                <Trophy className="w-3 h-3" /> {prize}
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                saved ? "bg-white/30 border border-white/30" : "bg-white/15 border border-white/10"
              }`}
            >
              <Bookmark className={`w-4 h-4 transition-all ${saved ? "fill-white text-white scale-110" : "text-white/80"}`} />
            </motion.button>
          </div>
        </div>

        {/* Bottom content */}
        <div>
          {/* Date chip */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-[10px] font-semibold text-white/90 mb-2.5 border border-white/5"
          >
            📅 {event.date}
          </motion.div>

          <h3 className="text-xl font-display font-bold mb-1 leading-tight text-white drop-shadow-lg">
            {event.title}
          </h3>
          <p className="text-[11px] font-medium text-white/60 mb-2.5">by {event.organizer}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[12px] font-medium text-white/75">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{event.attendees}+</span>
              </div>
              {event.isOnline && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-white/90">
                  🌐 Online
                </span>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
