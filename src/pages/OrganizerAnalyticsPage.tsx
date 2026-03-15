import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Users, TrendingUp, BarChart3, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockEvents } from "@/data/mockData";
import { mockTeams } from "@/data/teamMatchingData";

const OrganizerAnalyticsPage = () => {
  const navigate = useNavigate();

  // Aggregate data calculation
  const totalEvents = mockEvents.length;
  const totalViews = mockEvents.reduce((acc, curr) => acc + (curr.id === "1" ? 1247 : curr.id === "2" ? 850 : 430), 0); // Mock views logic since attendees is the closest stat we have for all
  const totalRegistrations = mockEvents.reduce((acc, curr) => acc + curr.attendees, 0);
  const totalTeams = mockTeams.length; // From mock data

  const metrics = [
    { label: "Total Views", value: totalViews.toLocaleString(), change: "+15%", icon: Eye, color: "bg-primary/10 text-primary" },
    { label: "Registrations", value: totalRegistrations.toLocaleString(), change: "+22%", icon: Users, color: "bg-secondary/10 text-secondary" },
    { label: "Teams Formed", value: totalTeams.toString(), change: "+8%", icon: TrendingUp, color: "bg-accent/10 text-accent" },
    { label: "Avg Engagement", value: "68%", change: "+5%", icon: BarChart3, color: "bg-success/10 text-success" },
  ];

  // Mock global daily data
  const dailyData = [
    { day: "Mon", views: 150, regs: 42 },
    { day: "Tue", views: 230, regs: 58 },
    { day: "Wed", views: 310, regs: 85 },
    { day: "Thu", views: 420, regs: 112 },
    { day: "Fri", views: 580, regs: 158 },
    { day: "Sat", views: 840, regs: 295 },
    { day: "Sun", views: 790, regs: 400 },
  ];
  const maxViews = Math.max(...dailyData.map((d) => d.views));
  const maxRegs = Math.max(...dailyData.map((d) => d.regs));

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <p className="text-sm text-muted-foreground font-medium">📊 Global</p>
            <h1 className="text-lg font-display font-bold text-foreground">Organizer Analytics</h1>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5 space-y-5">
        {/* Aggregate Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-3xl p-4 border border-border"
              >
                <div className={`w-8 h-8 rounded-xl ${m.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-display font-bold text-card-foreground">{m.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                <p className="text-[10px] text-success font-semibold mt-0.5">{m.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Global Engagement Chart */}
        <div className="bg-card rounded-3xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">Weekly Activity</h3>
            <div className="flex items-center gap-3 text-[9px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-primary"></div> Views</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-accent"></div> Regs</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {dailyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.views / maxViews) * 100}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="w-1/2 rounded-t-sm gradient-primary"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.regs / maxRegs) * 100}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="w-1/2 rounded-t-sm gradient-accent"
                  />
                </div>
                <span className="text-[9px] text-muted-foreground font-medium mt-1">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div>
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
            Events Breakdown
          </h2>
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            {mockEvents.map((event, i) => (
              <div
                key={event.id}
                onClick={() => navigate(`/analytics/${event.id}`)}
                className={`p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors ${i !== mockEvents.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden shrink-0">
                    <img src={event.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <p className="text-[13px] font-bold text-foreground truncate">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> {event.attendees}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
};

export default OrganizerAnalyticsPage;
