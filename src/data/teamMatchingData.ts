import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";
import student5 from "@/assets/student-5.jpg";

export const ROLES_CATALOG = [
  { id: "ui_ux_designer", label: "UI/UX Designer", emoji: "🎨", color: "bg-purple" },
  { id: "frontend_developer", label: "Frontend Dev", emoji: "⚛️", color: "bg-gold" },
  { id: "backend_developer", label: "Backend Dev", emoji: "🟢", color: "bg-olive" },
  { id: "fullstack_developer", label: "Full-Stack Dev", emoji: "🔥", color: "bg-red-card" },
  { id: "ai_ml_engineer", label: "AI/ML Engineer", emoji: "🧠", color: "bg-purple" },
  { id: "product_manager", label: "Product Manager", emoji: "📋", color: "bg-gold" },
  { id: "content_creator", label: "Content Creator", emoji: "✍️", color: "bg-olive" },
] as const;

export type RoleId = typeof ROLES_CATALOG[number]["id"];

export interface StudentCard {
  user_id: string;
  profile_photo: string;
  display_name: string;
  primary_role: RoleId;
  secondary_role?: RoleId;
  skills: string[];
  portfolio_link: string;
  city: string;
  availability: boolean;
  xp: number;
}

export interface TeamCard {
  team_id: string;
  team_name: string;
  team_image: string;
  member_avatars: string[];
  members: { name: string; role: RoleId; avatar: string }[];
  open_roles: RoleId[];
  required_roles: RoleId[];
  max_size: number;
  event_name: string;
  event_id: string;
  city: string;
  creator_id: string;
  completion: number; // 0-100
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
    primary_role: "fullstack_developer",
    secondary_role: "backend_developer",
    skills: ["React", "Node.js", "Python", "AWS"],
    portfolio_link: "arjundev.io",
    city: "hyd",
    availability: true,
    xp: 1240,
  },
  {
    user_id: "s2",
    profile_photo: student2,
    display_name: "Priya Sharma",
    primary_role: "ui_ux_designer",
    skills: ["Figma", "Illustration", "Prototyping", "Branding"],
    portfolio_link: "priyaui.design",
    city: "blr",
    availability: true,
    xp: 980,
  },
  {
    user_id: "s3",
    profile_photo: student3,
    display_name: "Karthik Nair",
    primary_role: "ai_ml_engineer",
    skills: ["TensorFlow", "PyTorch", "Computer Vision", "NLP"],
    portfolio_link: "karthikai.dev",
    city: "che",
    availability: true,
    xp: 1560,
  },
  {
    user_id: "s4",
    profile_photo: student4,
    display_name: "Ananya Gupta",
    primary_role: "backend_developer",
    skills: ["Go", "Kubernetes", "PostgreSQL", "gRPC"],
    portfolio_link: "ananyacode.tech",
    city: "pun",
    availability: true,
    xp: 870,
  },
  {
    user_id: "s5",
    profile_photo: student5,
    display_name: "Rahul Menon",
    primary_role: "product_manager",
    secondary_role: "content_creator",
    skills: ["User Research", "Wireframing", "Design Systems", "Motion"],
    portfolio_link: "rahuldesigns.co",
    city: "mum",
    availability: true,
    xp: 1100,
  },
];

export const mockTeams: TeamCard[] = [
  {
    team_id: "t1",
    team_name: "Code Crushers",
    team_image: student1,
    member_avatars: [student1, student3],
    members: [
      { name: "Arjun", role: "fullstack_developer", avatar: student1 },
      { name: "Karthik", role: "ai_ml_engineer", avatar: student3 },
    ],
    open_roles: ["ui_ux_designer", "backend_developer"],
    required_roles: ["fullstack_developer", "ai_ml_engineer", "ui_ux_designer", "backend_developer"],
    max_size: 4,
    event_name: "HackVerse 3.0",
    event_id: "1",
    city: "hyd",
    creator_id: "s1",
    completion: 50,
  },
  {
    team_id: "t2",
    team_name: "Pixel Pirates",
    team_image: student2,
    member_avatars: [student2],
    members: [
      { name: "Priya", role: "ui_ux_designer", avatar: student2 },
    ],
    open_roles: ["fullstack_developer", "ai_ml_engineer", "content_creator"],
    required_roles: ["ui_ux_designer", "fullstack_developer", "ai_ml_engineer", "content_creator"],
    max_size: 4,
    event_name: "DesignJam 2026",
    event_id: "2",
    city: "blr",
    creator_id: "s2",
    completion: 25,
  },
  {
    team_id: "t3",
    team_name: "Neural Nexus",
    team_image: student3,
    member_avatars: [student3, student4],
    members: [
      { name: "Karthik", role: "ai_ml_engineer", avatar: student3 },
      { name: "Ananya", role: "backend_developer", avatar: student4 },
    ],
    open_roles: ["frontend_developer", "product_manager"],
    required_roles: ["ai_ml_engineer", "backend_developer", "frontend_developer", "product_manager"],
    max_size: 4,
    event_name: "AI & Robotics Lab",
    event_id: "5",
    city: "che",
    creator_id: "s3",
    completion: 50,
  },
  {
    team_id: "t4",
    team_name: "Launch Pad",
    team_image: student5,
    member_avatars: [student5],
    members: [
      { name: "Rahul", role: "product_manager", avatar: student5 },
    ],
    open_roles: ["frontend_developer", "backend_developer", "ui_ux_designer"],
    required_roles: ["product_manager", "frontend_developer", "backend_developer", "ui_ux_designer"],
    max_size: 4,
    event_name: "Startup Weekend",
    event_id: "6",
    city: "mum",
    creator_id: "s5",
    completion: 25,
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
