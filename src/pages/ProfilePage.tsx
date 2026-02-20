import { motion } from "framer-motion";
import { Settings, ChevronRight, ExternalLink, Shield, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ProfilePage = () => {
  const skills = ["React", "Figma", "Python", "UI/UX", "AI/ML"];
  const stats = [
    { label: "Events", value: "12" },
    { label: "Teams", value: "4" },
    { label: "Certs", value: "7" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative h-36 gradient-primary rounded-b-[2rem]">
        <button className="absolute top-5 right-5 w-10 h-10 rounded-2xl glass flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-14">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-24 h-24 rounded-3xl gradient-secondary flex items-center justify-center text-4xl shadow-lg border-4 border-background">
            🧑‍💻
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-extrabold">Alex Student</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>

        {/* Verification badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary/10 mb-5">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">Level 1 Verified — Basic</span>
          <ChevronRight className="w-4 h-4 text-primary ml-auto" />
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 bg-card rounded-3xl p-4 text-center shadow-sm">
              <p className="text-xl font-extrabold text-card-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold px-4 py-2 rounded-2xl bg-muted text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Portfolio
          </h2>
          {[
            { label: "GitHub", url: "github.com/alexstudent" },
            { label: "LinkedIn", url: "linkedin.com/in/alexstudent" },
            { label: "Portfolio", url: "alexstudent.dev" },
          ].map((link) => (
            <motion.div
              key={link.label}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card shadow-sm cursor-pointer"
            >
              <div>
                <p className="text-sm font-bold text-card-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
