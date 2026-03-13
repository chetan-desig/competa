import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Megaphone, Clock, CheckCircle, ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockEvents } from "@/data/mockData";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  message: string;
  event: string;
  time: string;
  type: "update" | "reminder" | "urgent";
}

const mockAnnouncements: Announcement[] = [
  { id: "a1", title: "Submission Deadline Extended", message: "The project submission deadline has been extended by 24 hours. New deadline: Mar 17, 11:59 PM IST.", event: "HackVerse 3.0", time: "2h ago", type: "update" },
  { id: "a2", title: "Hackathon Starts Tomorrow! 🚀", message: "Get your teams ready! The hackathon kicks off at 9 AM. Don't forget to check in at the registration desk.", event: "HackVerse 3.0", time: "1d ago", type: "reminder" },
  { id: "a3", title: "New Mentor Session Added", message: "We've added a special mentor session with Google engineers at 3 PM today. Join on the main stage.", event: "React Masterclass", time: "3d ago", type: "update" },
];

const typeConfig = {
  update: { label: "Update", color: "bg-primary/10 text-primary", emoji: "📢" },
  reminder: { label: "Reminder", color: "bg-accent/10 text-accent", emoji: "⏰" },
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive", emoji: "🚨" },
};

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [type, setType] = useState<"update" | "reminder" | "urgent">("update");

  const handleSend = () => {
    if (!title.trim() || !message.trim() || !selectedEvent) {
      toast.error("Please fill all fields");
      return;
    }
    const evName = mockEvents.find((e) => e.id === selectedEvent)?.title || "Event";
    const newAnn: Announcement = {
      id: `a${Date.now()}`,
      title,
      message,
      event: evName,
      time: "Just now",
      type,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setTitle("");
    setMessage("");
    setSelectedEvent("");
    setShowCompose(false);
    toast.success("Announcement sent! 📢", { description: `Sent to all ${evName} participants.` });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Broadcast</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Updates & Reminders</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5">
        {/* Primary CTA Card */}
        {!showCompose && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCompose(true)}
            className="w-full bg-primary rounded-3xl p-5 mb-6 flex items-center gap-4 text-left shadow-lg shadow-primary/20 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Megaphone className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-primary-foreground leading-tight">Send New Broadcast</h2>
              <p className="text-xs text-primary-foreground/80 mt-0.5">Reach all event participants instantly</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
          </motion.button>
        )}
        {/* Compose */}
        <AnimatePresence>
          {showCompose && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-card rounded-3xl p-5 border border-border space-y-4">
                <h3 className="text-sm font-display font-bold text-card-foreground">New Announcement</h3>

                {/* Event select */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                  >
                    <option value="">Select event...</option>
                    {mockEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
                  <div className="flex gap-2">
                    {(["update", "reminder", "urgent"] as const).map((t) => {
                      const cfg = typeConfig[t];
                      return (
                        <button
                          key={t}
                          onClick={() => setType(t)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${type === t ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          {cfg.emoji} {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Submission deadline extended"
                    className="w-full px-4 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your announcement..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSend}
                  className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send to All Participants
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Announcements list */}
        <div className="space-y-3">
          {announcements.map((ann, i) => {
            const cfg = typeConfig[ann.type];
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${cfg.color}`}>
                      {cfg.emoji} {cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{ann.event}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ann.time}
                  </span>
                </div>
                <h3 className="text-sm font-display font-bold text-card-foreground mb-1">{ann.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{ann.message}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AnnouncementsPage;
