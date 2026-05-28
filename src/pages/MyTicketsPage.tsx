import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Ticket, ChevronRight, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "@/data/mockData";
import { getRegistrations, Registration } from "@/lib/registrations";
import BottomNav from "@/components/BottomNav";

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [regs, setRegs] = useState<Registration[]>([]);

  useEffect(() => {
    setRegs(getRegistrations());
  }, []);

  const items = regs
    .map((r) => ({ reg: r, event: mockEvents.find((e) => e.id === r.eventId) }))
    .filter((i) => i.event);

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Pass Wallet</p>
          <h1 className="text-xl font-extrabold text-foreground font-display">My Tickets</h1>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          {items.length}
        </span>
      </header>

      <main className="px-5">
        {items.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-3xl p-8 text-center mt-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CalendarPlus className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-base font-display font-bold text-foreground mb-1">No tickets yet</h2>
            <p className="text-xs text-muted-foreground mb-5">
              Register for an event and your tickets will appear here.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/search")}
              className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold"
            >
              Explore Events
            </motion.button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(({ reg, event }, i) => (
              <motion.button
                key={reg.eventId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/ticket/${event!.id}?mode=${reg.mode}`)}
                className="w-full bg-card border border-border/60 rounded-3xl p-3 flex items-center gap-3 text-left"
              >
                <img
                  src={event!.image}
                  alt={event!.title}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {event!.category}
                  </p>
                  <h3 className="text-sm font-display font-bold text-card-foreground truncate">
                    {event!.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" /> {event!.date}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{event!.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success uppercase tracking-wider">
                      Confirmed
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground truncate">
                      #{reg.ticketId}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ticket className="w-4 h-4 text-primary" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default MyTicketsPage;
