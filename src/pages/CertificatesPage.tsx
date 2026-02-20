import { motion } from "framer-motion";
import { Share2, Download } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockCertificates } from "@/data/mockData";

const CertificatesPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-extrabold mb-1">Certificate Vault</h1>
        <p className="text-sm text-muted-foreground">Your achievements & badges</p>
      </header>

      {/* Stats */}
      <div className="flex gap-3 px-5 mb-6">
        {[
          { label: "Certificates", value: "4", emoji: "📜" },
          { label: "Badges", value: "7", emoji: "🏅" },
          { label: "Points", value: "1,250", emoji: "⚡" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 bg-card rounded-3xl p-4 shadow-sm text-center"
          >
            <p className="text-2xl mb-1">{stat.emoji}</p>
            <p className="text-lg font-bold text-card-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Certificates Grid */}
      <div className="px-5">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Certificates
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {mockCertificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-3xl p-4 shadow-sm group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-2xl mb-3">
                {cert.badge}
              </div>
              <h3 className="text-sm font-bold text-card-foreground leading-tight mb-1">
                {cert.title}
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">{cert.date}</p>
              <div className="flex gap-2">
                <button className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center">
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center">
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CertificatesPage;
