import { motion } from "framer-motion";
import { MapPin, Users, Bookmark, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/data/mockData";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  index: number;
}

const cardColors = [
  "bg-olive", "bg-purple", "bg-gold", "bg-red-card", 
];

const EventCard = ({ event, index }: EventCardProps) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const colorClass = cardColors[index % cardColors.length];
  const isDark = index % 4 === 1 || index % 4 === 3; // purple and red-card are dark

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`relative rounded-3xl overflow-hidden cursor-pointer ${colorClass} p-5`}
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl ${isDark ? "bg-primary-foreground/20" : "bg-foreground/10"} flex items-center justify-center`}>
            <img
              src={event.image}
              alt={event.title}
              className="w-8 h-8 rounded-xl object-cover"
              loading="lazy"
            />
          </div>
          <span className={`text-base font-bold ${isDark ? "text-primary-foreground" : "text-foreground"}`}>
            {event.organizer}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
            className={`w-10 h-10 rounded-full ${isDark ? "bg-primary-foreground/20" : "bg-foreground/10"} flex items-center justify-center`}
          >
            <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""} ${isDark ? "text-primary-foreground" : "text-foreground"}`} />
          </button>
          <div className={`w-10 h-10 rounded-full ${isDark ? "bg-primary-foreground/20" : "bg-foreground/10"} flex items-center justify-center`}>
            <ArrowUpRight className={`w-5 h-5 ${isDark ? "text-primary-foreground" : "text-foreground"}`} />
          </div>
        </div>
      </div>

      <h3 className={`text-2xl font-display font-bold mb-2 leading-tight ${isDark ? "text-primary-foreground" : "text-foreground"}`}>
        {event.title}
      </h3>

      <div className={`flex items-center gap-4 text-sm font-medium ${isDark ? "text-primary-foreground/70" : "text-foreground/70"}`}>
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{event.attendees}+</span>
        </div>
      </div>

      <div className={`mt-3 text-xs font-semibold ${isDark ? "text-primary-foreground/60" : "text-foreground/60"}`}>
        {event.date}
      </div>

      {event.isOnline && (
        <div className="absolute top-5 left-20">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl ${isDark ? "bg-primary-foreground/20 text-primary-foreground" : "bg-foreground/10 text-foreground"}`}>
            🌐 Online
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default EventCard;
