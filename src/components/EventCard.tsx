import { motion } from "framer-motion";
import { MapPin, Users, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/data/mockData";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="aspect-[3/4] relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-2xl glass flex items-center justify-center transition-transform active:scale-90"
        >
          <Bookmark
            className={`w-5 h-5 ${saved ? "fill-primary text-primary" : "text-primary-foreground"}`}
          />
        </button>

        {/* Category chip */}
        <div className="absolute top-4 left-4">
          <span className="glass text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-2xl">
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>

        {/* Online badge */}
        {event.isOnline && (
          <div className="absolute top-4 left-28">
            <span className="gradient-secondary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-2xl">
              🌐 Online
            </span>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-primary-foreground mb-1">
            {event.title}
          </h3>
          <p className="text-primary-foreground/70 text-sm mb-3">
            {event.date}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary-foreground/80 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-primary-foreground/80 text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>{event.attendees}+ going</span>
            </div>
          </div>
          {/* Tags */}
          <div className="flex gap-2 mt-3">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2.5 py-1 rounded-xl glass text-primary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
