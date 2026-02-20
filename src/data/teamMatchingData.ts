import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";
import student5 from "@/assets/student-5.jpg";

export interface StudentCard {
  user_id: string;
  profile_photo: string;
  display_name: string;
  primary_role: string;
  skills: string[];
  portfolio_link: string;
  city: string;
  availability: boolean;
}

export interface TeamCard {
  team_id: string;
  team_name: string;
  team_image: string;
  member_avatars: string[];
  open_roles: string[];
  skill_coverage: Record<string, number>;
  event_id: string;
  city: string;
}

export interface MatchResult {
  id: string;
  name: string;
  photo: string;
  role: string;
  type: "student" | "team";
}

export const mockStudents: StudentCard[] = [
  {
    user_id: "s1",
    profile_photo: student1,
    display_name: "Arjun Reddy",
    primary_role: "Full-Stack Developer",
    skills: ["React", "Node.js", "Python", "AWS"],
    portfolio_link: "arjundev.io",
    city: "hyd",
    availability: true,
  },
  {
    user_id: "s2",
    profile_photo: student2,
    display_name: "Priya Sharma",
    primary_role: "UI/UX Designer",
    skills: ["Figma", "Illustration", "Prototyping", "Branding"],
    portfolio_link: "priyaui.design",
    city: "blr",
    availability: true,
  },
  {
    user_id: "s3",
    profile_photo: student3,
    display_name: "Karthik Nair",
    primary_role: "ML Engineer",
    skills: ["TensorFlow", "PyTorch", "Computer Vision", "NLP"],
    portfolio_link: "karthikai.dev",
    city: "che",
    availability: true,
  },
  {
    user_id: "s4",
    profile_photo: student4,
    display_name: "Ananya Gupta",
    primary_role: "Backend Developer",
    skills: ["Go", "Kubernetes", "PostgreSQL", "gRPC"],
    portfolio_link: "ananyacode.tech",
    city: "pun",
    availability: true,
  },
  {
    user_id: "s5",
    profile_photo: student5,
    display_name: "Rahul Menon",
    primary_role: "Product Designer",
    skills: ["User Research", "Wireframing", "Design Systems", "Motion"],
    portfolio_link: "rahuldesigns.co",
    city: "mum",
    availability: true,
  },
];

export const mockTeams: TeamCard[] = [
  {
    team_id: "t1",
    team_name: "Code Crushers",
    team_image: student1,
    member_avatars: [student1, student3],
    open_roles: ["UI/UX Designer", "Backend Developer"],
    skill_coverage: { Frontend: 80, Backend: 60, Design: 20, AI: 70 },
    event_id: "1",
    city: "hyd",
  },
  {
    team_id: "t2",
    team_name: "Pixel Pirates",
    team_image: student2,
    member_avatars: [student2],
    open_roles: ["Full-Stack Developer", "ML Engineer"],
    skill_coverage: { Frontend: 30, Backend: 10, Design: 90, AI: 0 },
    event_id: "2",
    city: "blr",
  },
  {
    team_id: "t3",
    team_name: "Neural Nexus",
    team_image: student3,
    member_avatars: [student3, student4],
    open_roles: ["Frontend Developer", "Product Designer"],
    skill_coverage: { Frontend: 20, Backend: 85, Design: 10, AI: 95 },
    event_id: "1",
    city: "che",
  },
];

export const skillEmojis: Record<string, string> = {
  React: "⚛️",
  "Node.js": "🟢",
  Python: "🐍",
  AWS: "☁️",
  Figma: "🎨",
  Illustration: "✏️",
  Prototyping: "📐",
  Branding: "💎",
  TensorFlow: "🧠",
  PyTorch: "🔥",
  "Computer Vision": "👁️",
  NLP: "💬",
  Go: "🐹",
  Kubernetes: "☸️",
  PostgreSQL: "🐘",
  gRPC: "⚡",
  "User Research": "🔍",
  Wireframing: "📝",
  "Design Systems": "🧩",
  Motion: "🎬",
};
