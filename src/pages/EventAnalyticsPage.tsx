import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Users, TrendingUp, BarChart3, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { mockEvents } from "@/data/mockData";
import { mockTeams } from "@/data/teamMatchingData";

const EventAnalyticsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);
  const teamsForEvent = mockTeams.filter((t) => t.registered_events.includes(id || ""));

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  const metrics = [
    { label: "Event Views", value: "1,247", change: "+18%", icon: Eye, color: "bg-primary/10 text-primary" },
    { label: "Registrations", value: `${event.attendees}`, change: "+24%", icon: Users, color: "bg-secondary/10 text-secondary" },
    { label: "Team Formation", value: `${teamsForEvent.length} teams`, change: `${Math.round((teamsForEvent.length / Math.max(1, event.attendees / 4)) * 100)}%`, icon: TrendingUp, color: "bg-accent/10 text-accent" },
    { label: "Active Users", value: `${Math.round(event.attendees * 0.72)}`, change: "72%", icon: BarChart3, color: "bg-success/10 text-success" },
  ];

  const dailyData = [
    { day: "Mon", views: 45, regs: 12 },
    { day: "Tue", views: 68, regs: 18 },
    { day: "Wed", views: 92, regs: 25 },
    { day: "Thu", views: 156, regs: 42 },
    { day: "Fri", views: 210, regs: 58 },
    { day: "Sat", views: 340, regs: 95 },
    { day: "Sun", views: 336, regs: 200 },
  ];
  const maxViews = Math.max(...dailyData.map((d) => d.views));

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <p className="text-sm text-muted-foreground font-medium">📊 Analytics</p>
            <h1 className="text-lg font-display font-bold text-foreground truncate">{event.title}</h1>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5 space-y-5">
        {/* Metric cards */}
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

        {/* Mini bar chart */}
        <div className="bg-card rounded-3xl p-5 border border-border">
          <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-4">Views This Week</h3>
          <div className="flex items-end gap-2 h-32">
            {dailyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.views / maxViews) * 100}%` }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="w-full rounded-t-lg gradient-primary min-h-[4px]"
                />
                <span className="text-[9px] text-muted-foreground font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration chart */}
        <div className="bg-card rounded-3xl p-5 border border-border">
          <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-4">Registrations This Week</h3>
          <div className="flex items-end gap-2 h-32">
            {dailyData.map((d, i) => {
              const maxRegs = Math.max(...dailyData.map((x) => x.regs));
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.regs / maxRegs) * 100}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="w-full rounded-t-lg gradient-accent min-h-[4px]"
                  />
                  <span className="text-[9px] text-muted-foreground font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teams formed */}
        {event.requiresTeam && (
          <div className="bg-card rounded-3xl p-5 border border-border">
            <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Teams Overview</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xl font-display font-bold text-card-foreground">{teamsForEvent.length}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Formed</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display font-bold text-card-foreground">{teamsForEvent.filter((t) => t.members.length >= t.max_size).length}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Full</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display font-bold text-card-foreground">{teamsForEvent.filter((t) => t.open_roles.length > 0).length}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Recruiting</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default EventAnalyticsPage;
