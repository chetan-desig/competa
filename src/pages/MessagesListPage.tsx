import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockStudents } from "@/data/teamMatchingData";
import { useRole } from "@/hooks/useRole";
import OrganizerInboxPage from "./OrganizerInboxPage";


type ChatTab = "buddies" | "teams" | "events";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: ChatTab;
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
    type: "buddies",
  },
  {
    id: "s3",
    name: mockStudents[2].display_name,
    avatar: mockStudents[2].profile_photo,
    lastMessage: "The ML model is ready for testing",
    time: "15m",
    unread: 1,
    online: true,
    type: "buddies",
  },
  {
    id: "t1",
    name: "Code Crushers",
    avatar: mockStudents[0].profile_photo,
    lastMessage: "Karthik: I pushed the API changes",
    time: "30m",
    unread: 5,
    online: true,
    type: "teams",
  },
  {
    id: "t2",
    name: "Pixel Pirates",
    avatar: mockStudents[1].profile_photo,
    lastMessage: "Priya: Design review at 4pm",
    time: "1h",
    unread: 0,
    online: false,
    type: "teams",
  },
  {
    id: "s2",
    name: mockStudents[1].display_name,
    avatar: mockStudents[1].profile_photo,
    lastMessage: "Thanks for the portfolio feedback!",
    time: "1h",
    unread: 0,
    online: false,
    type: "buddies",
  },
  {
    id: "e1",
    name: "HackVerse 3.0 Discussion",
    avatar: mockStudents[3].profile_photo,
    lastMessage: "Organizer: Venue map updated! 🗺️",
    time: "2h",
    unread: 12,
    online: true,
    type: "events",
  },
  {
    id: "s5",
    name: mockStudents[4].display_name,
    avatar: mockStudents[4].profile_photo,
    lastMessage: "Are you joining the Startup Weekend?",
    time: "3h",
    unread: 0,
    online: false,
    type: "buddies",
  },
];

const tabs: { id: ChatTab; label: string; icon: typeof MessageCircle }[] = [
  { id: "buddies", label: "Buddies", icon: MessageCircle },
  { id: "teams", label: "Teams", icon: Users },
  { id: "events", label: "Events", icon: Zap },
];

const MessagesListPage = () => {
  const { isOrganizer } = useRole();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ChatTab>("buddies");
  if (isOrganizer) return <OrganizerInboxPage />;

  const filtered = mockConversations.filter((c) => {
    const tabMatch = c.type === activeTab;
    const searchMatch = c.name.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  const tabUnread = (tab: ChatTab) =>
    mockConversations.filter((c) => c.type === tab && c.unread > 0).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">Messages</h1>

        {/* Tab bar */}
        <div className="flex gap-1 bg-muted rounded-2xl p-1 mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const unread = tabUnread(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {unread > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-primary-foreground/20" : "bg-destructive text-destructive-foreground"
                  }`}>
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

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

      {/* Online Now - only for buddies tab */}
      {activeTab === "buddies" && mockConversations.some((c) => c.online && c.type === "buddies") && (
        <div className="px-5 mb-4">
          <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Active Now
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {mockConversations
              .filter((c) => c.online && c.type === "buddies")
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-display font-bold text-foreground">No conversations</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "buddies" && "Connect with buddies to start chatting"}
                  {activeTab === "teams" && "Join a team to access team chat"}
                  {activeTab === "events" && "Register for events to join discussions"}
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
                    {conv.type === "teams" && (
                      <div className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                        <Users className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-display font-bold text-foreground truncate">
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
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default MessagesListPage;
