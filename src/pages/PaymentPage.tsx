import { useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Smartphone, Wallet, Shield, Lock, Calendar, MapPin, Users, Sparkles, Ticket } from "lucide-react";
import { mockEvents } from "@/data/mockData";
import { toast } from "sonner";
import EventTicket from "@/components/EventTicket";
import { addRegistration } from "@/lib/registrations";

type Step = "review" | "method" | "processing" | "success";
type PayMethod = "upi" | "card" | "wallet";

const methods: { id: PayMethod; label: string; sub: string; icon: typeof CreditCard }[] = [
  { id: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Card", sub: "Credit / Debit", icon: CreditCard },
  { id: "wallet", label: "Wallet", sub: "Paytm, Amazon Pay", icon: Wallet },
];

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = (params.get("mode") as "solo" | "team") || "solo";

  const event = mockEvents.find((e) => e.id === id);
  const [step, setStep] = useState<Step>("review");
  const [method, setMethod] = useState<PayMethod>("upi");
  const ticketId = useMemo(
    () => `${(id || "EVT").toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    [id]
  );

  if (!event || !event.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <p className="text-muted-foreground">This event is free or doesn't exist.</p>
      </div>
    );
  }

  const isTeam = mode === "team" && event.pricingMode === "per_team" && !!event.teamPrice;
  const subtotal = isTeam ? event.teamPrice! : event.price!;
  const fee = Math.round(subtotal * 0.02); // 2% platform fee
  const total = subtotal + fee;

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      if (event) addRegistration(event.id, mode, ticketId);
      setStep("success");
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => (step === "method" ? setStep("review") : navigate(-1))}
          className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center"
          disabled={step === "processing"}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {step === "success" ? "Payment Complete" : "Secure Checkout"}
          </p>
          <h1 className="text-base font-extrabold text-foreground">
            {step === "review" && "Review Order"}
            {step === "method" && "Payment Method"}
            {step === "processing" && "Processing…"}
            {step === "success" && "You're In! 🎉"}
          </h1>
        </div>
        {step !== "success" && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-2 py-1 rounded-lg">
            <Lock className="w-3 h-3" /> SSL
          </div>
        )}
      </header>

      {/* Step indicator */}
      {step !== "success" && step !== "processing" && (
        <div className="px-5 mb-2">
          <div className="flex items-center gap-2">
            {["review", "method"].map((s, i) => {
              const active = step === s;
              const done = step === "method" && s === "review";
              return (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`h-1.5 flex-1 rounded-full transition-colors ${active || done ? "bg-primary" : "bg-muted"}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className="flex-1 px-5 pb-32">
        <AnimatePresence mode="wait">
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Event card */}
              <div className="bg-card rounded-3xl p-4 shadow-sm border border-border/40 flex gap-3">
                <img src={event.image} alt={event.title} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{event.category}</p>
                  <h2 className="text-sm font-extrabold text-card-foreground truncate">{event.title}</h2>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" /> {event.date}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" /> {event.location}
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-card rounded-3xl p-5 shadow-sm border border-border/40">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Order Summary</h3>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {isTeam ? <Users className="w-4 h-4 text-primary" /> : <Sparkles className="w-4 h-4 text-primary" />}
                    <span className="text-sm font-medium text-foreground">
                      {isTeam ? `Team Entry (up to ${event.maxTeamSize})` : "Solo Entry · 1 person"}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">Platform fee</span>
                  <span className="text-xs text-muted-foreground">₹{fee}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-xl font-extrabold text-primary">₹{total}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-success" />
                <span>Refund available up to 24h before the event.</span>
              </div>
            </motion.div>
          )}

          {step === "method" && (
            <motion.div
              key="method"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-xs text-muted-foreground px-1">Choose how you'd like to pay</p>
              {methods.map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <motion.button
                    key={m.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      active
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border/50 bg-card"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-foreground">{m.label}</p>
                      <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-primary bg-primary" : "border-border"}`}>
                      {active && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </motion.button>
                );
              })}

              {/* Inline mock form */}
              <div className="bg-muted/40 rounded-2xl p-4 mt-4">
                {method === "upi" && (
                  <input
                    placeholder="yourname@upi"
                    className="w-full bg-background rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                )}
                {method === "card" && (
                  <div className="space-y-2">
                    <input placeholder="Card number" className="w-full bg-background rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="MM/YY" className="bg-background rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input placeholder="CVV" className="bg-background rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                )}
                {method === "wallet" && (
                  <p className="text-xs text-muted-foreground text-center">You'll be redirected to your wallet to complete payment.</p>
                )}
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center pt-20"
            >
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-5" />
              <p className="text-sm font-bold text-foreground">Processing your payment</p>
              <p className="text-xs text-muted-foreground mt-1">Don't close this screen…</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center pt-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mb-3"
              >
                <Check className="w-8 h-8 text-success" strokeWidth={3} />
              </motion.div>
              <h2 className="text-xl font-extrabold text-foreground mb-1">Payment Successful</h2>
              <p className="text-xs text-muted-foreground mb-5 px-6">
                Here's your event pass — show the QR at the gate.
              </p>

              <EventTicket event={event} ticketId={ticketId} mode={mode} />

              <div className="w-full bg-muted/40 rounded-2xl p-4 border border-border/40 mt-4 text-left">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">Amount Paid</span>
                  <span className="text-xs font-bold text-foreground">₹{total}</span>
                </div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">Method</span>
                  <span className="text-xs font-semibold text-foreground capitalize">{method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">Order ID</span>
                  <span className="text-[11px] font-mono text-foreground">#{Date.now().toString().slice(-8)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky CTA */}
      {step !== "processing" && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-md border-t border-border/40 safe-bottom">
          <div className="max-w-lg mx-auto">
            {step === "review" && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("method")}
                className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                Continue to Payment · ₹{total}
              </motion.button>
            )}
            {step === "method" && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePay}
                className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Pay ₹{total}
              </motion.button>
            )}
            {step === "success" && (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-bold text-sm"
                >
                  Done
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/ticket/${event.id}?mode=${mode}`)}
                  className="flex-1 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" /> View Ticket
                </motion.button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
