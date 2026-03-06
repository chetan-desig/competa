import { useMemo } from "react";

export type UserRole = "student" | "organizer" | null;

const STUDENT_CAN = [
  "browse_events",
  "save_event",
  "join_event",
  "swipe_match",
  "create_team",
  "join_team",
  "team_chat",
  "upload_project",
  "view_certificates",
] as const;

const ORGANIZER_CAN = [
  "browse_events",
  "create_event",
  "publish_event",
  "edit_event",
  "delete_event",
  "feature_event",
  "view_event_analytics",
  "invite_students",
  "post_open_roles",
] as const;

export type Permission = (typeof STUDENT_CAN)[number] | (typeof ORGANIZER_CAN)[number];

export const getUserRole = (): UserRole => {
  const role = localStorage.getItem("competa_role");
  if (role === "student" || role === "organizer") return role;
  return null;
};

export const setUserRole = (role: UserRole) => {
  if (role) {
    localStorage.setItem("competa_role", role);
  } else {
    localStorage.removeItem("competa_role");
  }
};

export const canDo = (permission: Permission): boolean => {
  const role = getUserRole();
  if (role === "student") return (STUDENT_CAN as readonly string[]).includes(permission);
  if (role === "organizer") return (ORGANIZER_CAN as readonly string[]).includes(permission);
  return false;
};

export const useRole = () => {
  const role = useMemo(() => getUserRole(), []);

  return {
    role,
    isStudent: role === "student",
    isOrganizer: role === "organizer",
    canDo: (p: Permission) => canDo(p),
  };
};
