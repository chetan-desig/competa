import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { MapPin, ExternalLink, Zap } from "lucide-react";
import { StudentCard, TeamCard, skillEmojis } from "@/data/teamMatchingData";
import { cities } from "@/data/mockData";

interface SwipeCardProps {
  card: StudentCard | TeamCard;
  type: "student" | "team";
  onSwipe: (direction: "left" | "right" | "up") => void;
  isTop: boolean;
}

const SwipeCard = ({ card, type, onSwipe, isTop }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const matchOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -100) {
      onSwipe("up");
    } else if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  const isStudent = type === "student";
  const student = card as StudentCard;
  const team = card as TeamCard;
  const cityName = cities.find(
    (c) => c.id === (isStudent ? student.city : team.city)
  )?.name;

  const photo = isStudent ? student.profile_photo : team.team_image;
  const name = isStudent ? student.display_name : team.team_name;

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{ x, y, rotate, zIndex: isTop ? 10 : 0 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Image */}
        <img
          src={photo}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Swipe Labels */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: matchOpacity }}
              className="absolute top-8 left-6 z-20 border-4 border-green-400 rounded-xl px-4 py-2 -rotate-12"
            >
              <span className="text-green-400 font-black text-2xl">MATCH</span>
            </motion.div>
            <motion.div
              style={{ opacity: skipOpacity }}
              className="absolute top-8 right-6 z-20 border-4 border-red-400 rounded-xl px-4 py-2 rotate-12"
            >
              <span className="text-red-400 font-black text-2xl">SKIP</span>
            </motion.div>
            <motion.div
              style={{ opacity: superOpacity }}
              className="absolute top-8 left-1/2 -translate-x-1/2 z-20 border-4 border-accent rounded-xl px-4 py-2"
            >
              <span className="text-accent font-black text-2xl flex items-center gap-1">
                <Zap className="w-5 h-5" /> SUPER
              </span>
            </motion.div>
          </>
        )}

        {/* City Badge */}
        <div className="absolute top-4 right-4 z-10 glass rounded-full px-3 py-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary-foreground" />
          <span className="text-xs font-semibold text-primary-foreground">
            {cityName}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-white/80 text-sm mt-0.5">
            {isStudent ? student.primary_role : `Looking for: ${team.open_roles.join(", ")}`}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {isStudent
              ? student.skills.map((skill) => (
                  <span
                    key={skill}
                    className="glass rounded-full px-2.5 py-1 text-xs font-medium text-white flex items-center gap-1"
                  >
                    {skillEmojis[skill] || "🔧"} {skill}
                  </span>
                ))
              : team.open_roles.map((role) => (
                  <span
                    key={role}
                    className="glass rounded-full px-2.5 py-1 text-xs font-medium text-white"
                  >
                    🎯 {role}
                  </span>
                ))}
          </div>

          {/* Portfolio / Team Members */}
          {isStudent && student.portfolio_link && (
            <div className="mt-3 flex items-center gap-1 text-accent text-xs">
              <ExternalLink className="w-3 h-3" />
              <span>{student.portfolio_link}</span>
            </div>
          )}
          {!isStudent && (
            <div className="mt-3 flex items-center gap-1">
              <div className="flex -space-x-2">
                {team.member_avatars.map((av, i) => (
                  <img
                    key={i}
                    src={av}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-white/70 text-xs ml-2">
                {team.member_avatars.length} member{team.member_avatars.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
