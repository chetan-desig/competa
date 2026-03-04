import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
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
];

const MessagesPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const buddy = mockStudents.find((s) => s.user_id === userId);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), text: input, sender: "me", time: "Now" },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-3 border-b border-border flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        {buddy && (
          <div className="flex items-center gap-3">
            <img src={buddy.profile_photo} alt={buddy.display_name} className="w-9 h-9 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-display font-bold text-foreground">{buddy.display_name}</p>
              <p className="text-[10px] text-success font-medium">Online</p>
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                msg.sender === "me"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border safe-bottom">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center"
          >
            <Send className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
