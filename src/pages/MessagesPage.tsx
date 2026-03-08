import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Smile, Paperclip } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockStudents } from "@/data/teamMatchingData";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

const initialMessages: Message[] = [
  { id: "1", text: "Hey! Saw you're in Code Crushers 🚀", sender: "them", time: "10:30 AM" },
  { id: "2", text: "Yeah! We're looking for a designer, interested?", sender: "me", time: "10:32 AM" },
  { id: "3", text: "Absolutely! I'd love to join 🤩", sender: "them", time: "10:33 AM" },
  { id: "4", text: "Perfect! I'll send you the invite. We have our first sync at 6pm", sender: "me", time: "10:34 AM" },
];

const MessagesPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const buddy = mockStudents.find((s) => s.user_id === userId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), text: input, sender: "me", time: "Now" },
    ]);
    setInput("");

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: String(prev.length + 2), text: "Sounds great! Let's do it 💪", sender: "them", time: "Now" },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-3 border-b border-border/50 bg-background/80 backdrop-blur-2xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </motion.button>
          {buddy && (
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <img src={buddy.profile_photo} alt={buddy.display_name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
              </div>
              <div>
                <p className="text-sm font-display font-bold text-foreground">{buddy.display_name}</p>
                <p className="text-[10px] text-success font-medium">Online</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
        {messages.map((msg, i) => {
          const isMe = msg.sender === "me";
          const prevSame = i > 0 && messages[i - 1].sender === msg.sender;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-2"}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 ${
                  isMe
                    ? `gradient-primary text-primary-foreground ${prevSame ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-br-md"}`
                    : `bg-card border border-border text-foreground ${prevSame ? "rounded-2xl rounded-bl-md" : "rounded-2xl rounded-bl-md"}`
                } shadow-sm`}
              >
                <p className="text-[13px] leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground/40"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 bg-card/50 backdrop-blur-xl safe-bottom">
        <div className="flex gap-2 items-end">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-2xl px-3">
            <motion.button whileTap={{ scale: 0.85 }} className="shrink-0 py-3">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 py-3 bg-transparent text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none"
            />
            <motion.button whileTap={{ scale: 0.85 }} className="shrink-0 py-3">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={sendMessage}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              input.trim() ? "gradient-primary shadow-lg" : "bg-muted"
            }`}
          >
            <Send className={`w-5 h-5 ${input.trim() ? "text-primary-foreground" : "text-muted-foreground"}`} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
