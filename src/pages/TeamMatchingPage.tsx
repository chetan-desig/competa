import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Rocket, X, Star, Heart, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import SwipeCard from "@/components/SwipeCard";
import MatchOverlay from "@/components/MatchOverlay";
import TeamLobby from "@/components/TeamLobby";
import VerificationModal from "@/components/VerificationModal";
import { useVerification } from "@/hooks/useVerification";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/useRole";
import {
  mockStudents,
  mockTeams,
  MatchResult,
  StudentCard,
  TeamCard,
} from "@/data/teamMatchingData";

type Mode = "entry" | "join_team" | "create_team" | "lobby";

const TeamMatchingPage = () => {
  const navigate = useNavigate();
  const { isStudent } = useRole();
  const [mode, setMode] = useState<Mode>("entry");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [undoAvailable, setUndoAvailable] = useState(false);
  const lastIndexRef = useRef<number | null>(null);
  const { showModal, setShowModal, verificationType, requireVerification } = useVerification();

  useEffect(() => {
    if (!isStudent) {
      navigate("/", { replace: true });
    }
  }, [isStudent, navigate]);

  const cards: (StudentCard | TeamCard)[] =
    mode === "join_team" ? mockTeams : mockStudents;
  const cardType = mode === "join_team" ? "team" : "student";

  const handleStartMode = (targetMode: "join_team" | "create_team") => {
    const verified = requireVerification("student", () => {
      setCurrentIndex(0);
      setMode(targetMode);
    });
    if (verified) {
      setCurrentIndex(0);
      setUndoAvailable(false);
      setMode(targetMode);
    }
  };

  const handleSwipe = useCallback(
    (direction: "left" | "right" | "up") => {
      lastIndexRef.current = currentIndex;
      if (direction === "right" || direction === "up") {
        const card = cards[currentIndex];
        if (currentIndex % 2 === 0) {
          const isStudent = "display_name" in card;
          setMatch({
            id: isStudent
              ? (card as StudentCard).user_id
              : (card as TeamCard).team_id,
            name: isStudent
              ? (card as StudentCard).display_name
              : (card as TeamCard).team_name,
            photo: isStudent
              ? (card as StudentCard).profile_photo
              : (card as TeamCard).team_image,
            role: isStudent
              ? (card as StudentCard).primary_role
              : (card as TeamCard).open_roles[0],
            type: isStudent ? "student" : "team",
          });
        }
      }
      setCurrentIndex((prev) => prev + 1);
      setUndoAvailable(true);
    },
    [cards, currentIndex]
  );

  const handleUndo = () => {
    if (lastIndexRef.current !== null && undoAvailable) {
      setCurrentIndex(lastIndexRef.current);
      setUndoAvailable(false);
      lastIndexRef.current = null;
    }
  };

  const handleButtonSwipe = (direction: "left" | "right" | "up") => {
    if (currentIndex < cards.length) {
      handleSwipe(direction);
    }
  };

  if (mode === "lobby") {
    return <TeamLobby onBack={() => setMode("entry")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <VerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        type={verificationType}
        onVerified={() => setShowModal(false)}
      />

      <MatchOverlay
        match={match}
        onClose={() => setMatch(null)}
        onViewLobby={() => {
          setMatch(null);
          setMode("lobby");
        }}
      />

      {mode === "entry" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col min-h-screen"
        >
          <div className="px-4 pt-12 pb-4 flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Find Your Team</h1>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-8"
            >
              <span className="text-6xl mb-4 block">🤝</span>
              <h2 className="text-2xl font-black text-foreground">Team Matching</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Swipe to find the perfect teammates for your next event
              </p>
            </motion.div>

            <motion.button
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => handleStartMode("join_team")}
              className="w-full glass-card rounded-3xl p-6 flex items-center gap-4 text-left hover-scale"
            >
              <div className="gradient-primary rounded-2xl p-3">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Join a Team</h3>
                <p className="text-muted-foreground text-sm">
                  Swipe through teams looking for members
                </p>
              </div>
            </motion.button>

            <motion.button
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => handleStartMode("create_team")}
              className="w-full glass-card rounded-3xl p-6 flex items-center gap-4 text-left hover-scale"
            >
              <div className="gradient-secondary rounded-2xl p-3">
                <Rocket className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Create a Team</h3>
                <p className="text-muted-foreground text-sm">
                  Swipe through students to recruit
                </p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {(mode === "join_team" || mode === "create_team") && (
        <div className="flex flex-col h-screen">
          <div className="px-4 pt-12 pb-2 flex items-center gap-3">
            <button onClick={() => setMode("entry")}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground flex-1">
              {mode === "join_team" ? "Teams for You" : "Find Teammates"}
            </h1>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1}/{cards.length}
            </span>
          </div>

          <div className="flex-1 relative px-4 py-2">
            {currentIndex < cards.length ? (
              <AnimatePresence>
                {cards
                  .slice(currentIndex, currentIndex + 2)
                  .reverse()
                  .map((card, i, arr) => {
                    const isTop = i === arr.length - 1;
                    const key = "user_id" in card ? card.user_id : card.team_id;
                    return (
                      <SwipeCard
                        key={key}
                        card={card}
                        type={cardType as "student" | "team"}
                        onSwipe={handleSwipe}
                        isTop={isTop}
                      />
                    );
                  })}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <span className="text-5xl mb-4">🎉</span>
                <h2 className="text-xl font-bold text-foreground">No more cards!</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Check back later for new {mode === "join_team" ? "teams" : "students"}
                </p>
                <Button
                  onClick={() => setMode("entry")}
                  className="mt-6 gradient-primary text-primary-foreground rounded-2xl"
                >
                  Go Back
                </Button>
              </motion.div>
            )}
          </div>

          {currentIndex < cards.length && (
            <div className="flex items-center justify-center gap-4 pb-6 px-4">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleUndo}
                disabled={!undoAvailable}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-opacity ${
                  undoAvailable
                    ? "bg-card border-2 border-primary/30"
                    : "bg-muted opacity-40"
                }`}
              >
                <Undo2 className={`w-5 h-5 ${undoAvailable ? "text-primary" : "text-muted-foreground"}`} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleButtonSwipe("left")}
                className="w-14 h-14 rounded-full bg-card border-2 border-destructive/30 flex items-center justify-center shadow-lg"
              >
                <X className="w-7 h-7 text-destructive" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleButtonSwipe("up")}
                className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg"
              >
                <Star className="w-6 h-6 text-primary-foreground" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleButtonSwipe("right")}
                className="w-14 h-14 rounded-full bg-card border-2 border-green-400/30 flex items-center justify-center shadow-lg"
              >
                <Heart className="w-7 h-7 text-green-500" />
              </motion.button>
            </div>
          )}
        </div>
      )}

      {mode === "entry" && <BottomNav />}
    </div>
  );
};

export default TeamMatchingPage;
