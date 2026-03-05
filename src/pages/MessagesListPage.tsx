import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockStudents } from "@/data/teamMatchingData";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "s1",
    name: mockStudents[0].display_name,
    avatar: mockStudents[0].profile_photo,
    lastMessage: "Let's finalize the design today! 🎨",
    time: "2m",
    unread: 3,
    online: true,
  },
  {
    id: "s3",
    name: mockStudents[2].display_name,
    avatar: mockStudents[2].profile_photo,
    lastMessage: "The ML model is ready for testing",
    time: "15m",
    unread: 1,
    online: true,
  },
  {
    id: "s2",
    name: mockStudents[1].display_name,
    avatar: mockStudents[1].profile_photo,
    lastMessage: "Thanks for the portfolio feedback!",
    time: "1h",
    unread: 0,
    online: false,
  },
  {
    id: "s5",
    name: mockStudents[4].display_name,
    avatar: mockStudents[4].profile_photo,
    lastMessage: "Are you joining the Startup Weekend?",
    time: "3h",
    unread: 0,
    online: false,
  },
];

const MessagesListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      {/* Online Now */}
      {mockConversations.some((c) => c.online) && (
        <div className="px-5 mb-4">
          <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Active Now
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {mockConversations
              .filter((c) => c.online)
              .map((c) => (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(`/messages/${c.id}`)}
                  className="flex flex-col items-center gap-1.5 min-w-[60px]"
                >
                  <div className="relative">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />
                  </div>
                  <p className="text-[10px] font-semibold text-foreground truncate max-w-[60px]">
                    {c.name.split(" ")[0]}
                  </p>
                </motion.button>
              ))}
          </div>
        </div>
      )}

      {/* Conversations */}
      <main className="px-5 space-y-1">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-display font-bold text-foreground">No conversations</p>
              <p className="text-sm text-muted-foreground mt-1">
                Connect with buddies to start chatting
              </p>
            </motion.div>
          ) : (
            filtered.map((conv, i) => (
              <motion.button
                key={conv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-13 h-13 rounded-full object-cover"
                    style={{ width: 52, height: 52 }}
                  />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-display font-bold text-foreground truncate ${conv.unread > 0 ? "" : ""}`}>
                      {conv.name}
                    </p>
                    <span className={`text-[11px] shrink-0 ml-2 ${conv.unread > 0 ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-[13px] truncate ${conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="shrink-0 ml-2 w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default MessagesListPage;
