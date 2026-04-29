import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { mockEvents } from "@/data/mockData";
import EventTicket from "@/components/EventTicket";
import { toast } from "sonner";
import { useMemo } from "react";

const TicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = (params.get("mode") as "solo" | "team") || "solo";
  const event = mockEvents.find((e) => e.id === id);

  const ticketId = useMemo(
    () => `${(id || "EVT").toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    [id]
  );

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/event/${event.id}`)}
          className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Pass</p>
          <h1 className="text-base font-extrabold text-foreground">Event Ticket</h1>
        </div>
      </header>

      <main className="px-5">
        <EventTicket event={event} ticketId={ticketId} mode={mode} />

        <p className="text-center text-[11px] text-muted-foreground mt-5">
          A copy has been sent to your email. Save this ticket to your gallery for offline access.
        </p>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-md border-t border-border/40 safe-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => toast.success("Ticket saved to gallery")}
            className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-bold text-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Save
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => toast.success("Share link copied")}
            className="flex-1 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
