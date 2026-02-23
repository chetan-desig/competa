import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, Linkedin, Plus, Upload, Camera, FileText, X, Sparkles, Trophy, Star } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockCertificates } from "@/data/mockData";
import Confetti from "@/components/Confetti";

const categoryOptions = ["Hackathon", "Design", "Workshop", "Live Event"];

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState(mockCertificates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [uploadStep, setUploadStep] = useState<"choose" | "processing" | "details" | "done">("choose");
  const [newCertCategory, setNewCertCategory] = useState("");
  const [newCertEventName, setNewCertEventName] = useState("");

  const isFirstUpload = certificates.length === mockCertificates.length;

  const handleUpload = (method: string) => {
    setUploadStep("processing");
    setTimeout(() => {
      setUploadStep("details");
    }, 2000);
  };

  const handleSaveCert = () => {
    const newCert = {
      id: String(certificates.length + 1),
      title: newCertEventName || "New Certificate",
      event: newCertEventName || "Event",
      date: "Feb 2026",
      badge: "🏅",
    };
    setCertificates([newCert, ...certificates]);
    setUploadStep("done");
    setShowConfetti(true);
    setTimeout(() => {
      setShowAddModal(false);
      setUploadStep("choose");
      setNewCertCategory("");
      setNewCertEventName("");
      setShowConfetti(false);
    }, 2500);
  };

  const totalPoints = 1250 + (certificates.length - mockCertificates.length) * 100;
  const level = Math.floor(totalPoints / 500) + 1;
  const levelProgress = (totalPoints % 500) / 500 * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      {showConfetti && <Confetti duration={3000} />}

      <header className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">Certificate Vault</h1>
            <p className="text-sm text-muted-foreground">Your achievements & badges ✨</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg cta-glow"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </div>
      </header>

      {/* Stats with gamification */}
      <div className="flex gap-3 px-5 mb-4">
        {[
          { label: "Certificates", value: String(certificates.length), emoji: "📜" },
          { label: "Badges", value: "7", emoji: "🏅" },
          { label: "Points", value: totalPoints.toLocaleString(), emoji: "⚡" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 bg-card rounded-3xl p-4 shadow-sm text-center border border-border/30"
          >
            <p className="text-2xl mb-1">{stat.emoji}</p>
            <p className="text-lg font-bold text-card-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <div className="px-5 mb-6">
        <div className="bg-card rounded-3xl p-4 shadow-sm border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-card-foreground">Level {level}</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {totalPoints % 500}/{500} to Level {level + 1}
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full gradient-primary rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Certificates Pinterest Grid */}
      <div className="px-5">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Certificates
        </h2>

        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted/60 flex items-center justify-center text-4xl mb-4">
              ✨
            </div>
            <p className="text-lg font-bold text-card-foreground mb-1">Add your first achievement</p>
            <p className="text-sm text-muted-foreground mb-5">Scan or upload a certificate to get started</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="gradient-primary text-primary-foreground font-bold text-sm py-3 px-8 rounded-2xl cta-glow"
            >
              <Plus className="w-4 h-4 inline mr-1" /> Add Certificate
            </motion.button>
          </motion.div>
        ) : (
          <div className="columns-2 gap-3 space-y-3">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="break-inside-avoid bg-card rounded-3xl shadow-sm group cursor-pointer border border-border/30 overflow-hidden"
              >
                {/* Thumbnail area */}
                <div className={`w-full ${i % 3 === 0 ? "h-36" : "h-28"} gradient-${i % 2 === 0 ? "primary" : "accent"} flex items-center justify-center relative`}
                  style={{ background: i % 2 === 0 ? "var(--gradient-primary)" : "var(--gradient-accent)" }}
                >
                  <span className="text-5xl opacity-80">{cert.badge}</span>
                  {/* Achievement sticker */}
                  {i === 0 && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center">
                      <Star className="w-4 h-4 text-[hsl(44,100%,50%)]" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-card-foreground leading-tight mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mb-3">{cert.date}</p>
                  <div className="flex gap-2">
                    <button className="w-7 h-7 rounded-xl bg-[hsl(211,100%,65%)]/10 flex items-center justify-center hover:bg-[hsl(211,100%,65%)]/20 transition-colors" title="Share to LinkedIn">
                      <Linkedin className="w-3.5 h-3.5 text-[hsl(211,100%,65%)]" />
                    </button>
                    <button className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center">
                      <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center">
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Certificate Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { setShowAddModal(false); setUploadStep("choose"); }} />

            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-md bg-card/90 backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-10 shadow-2xl z-10 border border-border/50"
            >
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none gradient-accent" />

              <button
                onClick={() => { setShowAddModal(false); setUploadStep("choose"); }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <AnimatePresence mode="wait">
                {/* Choose upload method */}
                {uploadStep === "choose" && (
                  <motion.div
                    key="choose"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h2 className="text-xl font-extrabold text-card-foreground mb-1">Add Certificate 📜</h2>
                    <p className="text-sm text-muted-foreground mb-6">Choose how to add your achievement</p>

                    <div className="w-full space-y-3">
                      {[
                        { icon: Camera, label: "Scan Certificate", desc: "Use camera to capture", method: "scan" },
                        { icon: Upload, label: "Upload Image", desc: "From gallery or files", method: "image" },
                        { icon: FileText, label: "Upload PDF", desc: "PDF certificate file", method: "pdf" },
                      ].map((opt) => (
                        <motion.button
                          key={opt.method}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleUpload(opt.method)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                        >
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <opt.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-card-foreground">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Processing */}
                {uploadStep === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4"
                    >
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <h2 className="text-lg font-extrabold text-card-foreground">Processing... ✨</h2>
                    <p className="text-sm text-muted-foreground mt-1">Auto-cropping & enhancing your certificate</p>
                  </motion.div>
                )}

                {/* Details */}
                {uploadStep === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex flex-col items-center text-center"
                  >
                    <h2 className="text-xl font-extrabold text-card-foreground mb-1">Almost there! 🎉</h2>
                    <p className="text-sm text-muted-foreground mb-5">Add some details (optional)</p>

                    <div className="w-full space-y-4">
                      <input
                        type="text"
                        value={newCertEventName}
                        onChange={(e) => setNewCertEventName(e.target.value)}
                        placeholder="Event name (optional)"
                        className="w-full px-5 py-4 rounded-2xl bg-muted/60 backdrop-blur-sm text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border/30"
                      />

                      <div className="flex flex-wrap gap-2">
                        {categoryOptions.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setNewCertCategory(cat)}
                            className={`text-xs font-semibold px-4 py-2.5 rounded-2xl border transition-all ${
                              newCertCategory === cat
                                ? "gradient-primary text-primary-foreground border-transparent"
                                : "bg-muted/40 text-muted-foreground border-border/30 hover:border-primary/30"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveCert}
                        className="w-full gradient-primary text-primary-foreground font-bold text-sm py-4 rounded-2xl cta-glow btn-pop"
                      >
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Save Achievement
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Done */}
                {uploadStep === "done" && (
                  <motion.div
                    key="done"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 8 }}
                      className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center text-5xl mb-4 shadow-xl"
                    >
                      🏆
                    </motion.div>
                    <h2 className="text-2xl font-black text-card-foreground">Achievement Added! 🎉</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Profile leveled up 🚀
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default CertificatesPage;
