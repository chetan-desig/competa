import eventHackathon from "@/assets/event-hackathon.jpg";
import eventDesign from "@/assets/event-design.jpg";
import eventWorkshop from "@/assets/event-workshop.jpg";
import eventLive from "@/assets/event-live.jpg";
import eventAi from "@/assets/event-ai.jpg";
import eventStartup from "@/assets/event-startup.jpg";

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  city: string;
  image: string;
  attendees: number;
  isOnline: boolean;
  organizer: string;
  description: string;
  tags: string[];
}

export const categories = [
  { id: "all", label: "🔥 All", emoji: "🔥" },
  { id: "hackathon", label: "💻 Hackathons", emoji: "💻" },
  { id: "design", label: "🎨 Design", emoji: "🎨" },
  { id: "workshop", label: "🛠️ Workshops", emoji: "🛠️" },
  { id: "live", label: "🎤 Live Events", emoji: "🎤" },
  { id: "startup", label: "🚀 Startups", emoji: "🚀" },
];

export const cities = [
  { id: "hyd", name: "Hyderabad", state: "Telangana", emoji: "🏛️" },
  { id: "blr", name: "Bangalore", state: "Karnataka", emoji: "🌆" },
  { id: "mum", name: "Mumbai", state: "Maharashtra", emoji: "🌊" },
  { id: "pun", name: "Pune", state: "Maharashtra", emoji: "⛰️" },
  { id: "che", name: "Chennai", state: "Tamil Nadu", emoji: "🏖️" },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "HackVerse 3.0",
    category: "hackathon",
    date: "Mar 15-16, 2026",
    location: "IIIT Hyderabad",
    city: "hyd",
    image: eventHackathon,
    attendees: 450,
    isOnline: false,
    organizer: "IIIT Coding Club",
    description: "48-hour hackathon with prizes worth ₹5L. Build solutions for real-world problems.",
    tags: ["AI/ML", "Web3", "FinTech"],
  },
  {
    id: "2",
    title: "DesignJam 2026",
    category: "design",
    date: "Mar 22, 2026",
    location: "NID Bangalore",
    city: "blr",
    image: eventDesign,
    attendees: 200,
    isOnline: false,
    organizer: "Design Collective",
    description: "24-hour design sprint. Create impactful UI/UX solutions for social good.",
    tags: ["UI/UX", "Figma", "Product"],
  },
  {
    id: "3",
    title: "React Masterclass",
    category: "workshop",
    date: "Mar 28, 2026",
    location: "Online + Mumbai Hub",
    city: "mum",
    image: eventWorkshop,
    attendees: 800,
    isOnline: true,
    organizer: "DevCommunity India",
    description: "Learn React 19, Server Components, and modern patterns from industry experts.",
    tags: ["React", "TypeScript", "Frontend"],
  },
  {
    id: "4",
    title: "Campus Beats Festival",
    category: "live",
    date: "Apr 5, 2026",
    location: "Pune University Grounds",
    city: "pun",
    image: eventLive,
    attendees: 2000,
    isOnline: false,
    organizer: "StudentLife Events",
    description: "The biggest college music & cultural festival in Maharashtra.",
    tags: ["Music", "Culture", "Festival"],
  },
  {
    id: "5",
    title: "AI & Robotics Lab",
    category: "workshop",
    date: "Apr 10, 2026",
    location: "IIT Madras Research Park",
    city: "che",
    image: eventAi,
    attendees: 120,
    isOnline: false,
    organizer: "AI Research Lab",
    description: "Hands-on workshop on building autonomous robots with computer vision.",
    tags: ["AI", "Robotics", "IoT"],
  },
  {
    id: "6",
    title: "Startup Weekend Hyd",
    category: "startup",
    date: "Apr 18-20, 2026",
    location: "T-Hub Hyderabad",
    city: "hyd",
    image: eventStartup,
    attendees: 300,
    isOnline: false,
    organizer: "T-Hub & Google",
    description: "54-hour startup building experience. Pitch to real investors.",
    tags: ["Pitch", "MVP", "Business"],
  },
];

export const mockCertificates = [
  { id: "1", title: "HackVerse 2.0 Winner", event: "HackVerse 2.0", date: "Jan 2026", badge: "🏆" },
  { id: "2", title: "React Workshop", event: "DevCommunity", date: "Dec 2025", badge: "📜" },
  { id: "3", title: "Design Sprint Champion", event: "DesignJam 2025", date: "Nov 2025", badge: "🎨" },
  { id: "4", title: "AI/ML Bootcamp", event: "IIT Madras", date: "Oct 2025", badge: "🤖" },
];
