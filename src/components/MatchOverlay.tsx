import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { MatchResult } from "@/data/teamMatchingData";
import { Button } from "@/components/ui/button";

interface MatchOverlayProps {
  match: MatchResult | null;
  onClose: () => void;
  onViewLobby: () => void;
}

const MatchOverlay = ({ match, onClose, onViewLobby }: MatchOverlayProps) => {
  return (
    <AnimatePresence>
      {match && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Confetti particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["#6C63FF", "#4FACFE", "#FF6B6B", "#FFC371", "#00D9A5"][i % 5],
                left: `${Math.random() * 100}%`,
                top: "-5%",
              }}
              animate={{
                y: ["0vh", `${60 + Math.random() * 40}vh`],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, Math.random() * 720],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Content */}
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative z-10 flex flex-col items-center gap-6 px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>

            <h1 className="text-4xl font-black gradient-text text-center">
              It's a Match!
            </h1>

            <div className="relative">
              <motion.img
                src={match.photo}
                alt={match.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-2xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            <div className="text-center">
              <p className="text-xl font-bold text-white">{match.name}</p>
              <p className="text-white/70 text-sm">{match.role}</p>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <Button
                onClick={onViewLobby}
                className="flex-1 gradient-primary text-primary-foreground rounded-2xl h-12 font-semibold"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Team Lobby
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-2xl h-12 font-semibold border-white/30 text-white hover:bg-white/10"
              >
                Keep Swiping
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchOverlay;
