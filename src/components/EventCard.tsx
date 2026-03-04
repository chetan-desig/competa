import { motion } from "framer-motion";
import { MapPin, Users, Bookmark, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/data/mockData";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  index: number;
}

const cardGradients = [
  "from-primary to-secondary",
  "from-accent to-destructive",
  "from-success to-secondary",
  "from-primary to-accent",
];

const EventCard = ({ event, index }: EventCardProps) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const gradientClass = cardGradients[index % cardGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative rounded-3xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      {/* Background image with gradient overlay */}
      <div className="relative h-52">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-70`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-white uppercase tracking-wider">
            {event.category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : ""} text-white`} />
            </button>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-display font-bold mb-1.5 leading-tight text-white">
            {event.title}
          </h3>
          <p className="text-xs font-medium text-white/70 mb-2">by {event.organizer}</p>

          <div className="flex items-center gap-4 text-sm font-medium text-white/80">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{event.attendees}+</span>
            </div>
          </div>
          <p className="mt-1.5 text-xs font-medium text-white/60">{event.date}</p>

          {event.isOnline && (
            <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-white/20 text-white">
              🌐 Online
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
