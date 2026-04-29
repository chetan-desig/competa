import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, User, Ticket as TicketIcon } from "lucide-react";
import type { Event } from "@/data/mockData";

interface EventTicketProps {
  event: Event;
  attendeeName?: string;
  ticketId: string;
  mode?: "solo" | "team";
}

const EventTicket = ({ event, attendeeName = "Aarav Sharma", ticketId, mode = "solo" }: EventTicketProps) => {
  const qrPayload = JSON.stringify({
    t: ticketId,
    e: event.id,
    n: attendeeName,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full bg-card rounded-3xl overflow-hidden shadow-xl border border-border/40"
    >
      {/* Top: gradient header */}
      <div className="gradient-primary px-5 pt-5 pb-12 relative">
        <div className="flex items-center justify-between text-primary-foreground">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Event Pass</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
            {mode === "team" ? "Team" : "Solo"}
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-primary-foreground mt-3 leading-tight">
          {event.title}
        </h2>
        <p className="text-[11px] text-primary-foreground/80 mt-1">{event.organizer}</p>
      </div>

      {/* Perforated edge */}
      <div className="relative h-6 bg-card">
        <div className="absolute -top-3 left-0 right-0 flex items-center">
          <div className="w-6 h-6 rounded-full bg-background -ml-3" />
          <div className="flex-1 border-t-2 border-dashed border-border mx-2" />
          <div className="w-6 h-6 rounded-full bg-background -mr-3" />
        </div>
      </div>

      {/* QR */}
      <div className="px-5 pb-5">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-2xl border border-border/40">
            <QRCodeSVG value={qrPayload} size={160} level="M" />
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mb-4">
          Show this QR at the entry gate to check in
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">When</p>
              <p className="text-[11px] font-semibold text-foreground">{event.date}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Where</p>
              <p className="text-[11px] font-semibold text-foreground line-clamp-2">{event.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 col-span-2">
            <User className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Attendee</p>
              <p className="text-[11px] font-semibold text-foreground">{attendeeName}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Ticket ID</span>
          <span className="text-[11px] font-mono font-bold text-foreground">#{ticketId}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventTicket;
