export interface Registration {
  eventId: string;
  ticketId: string;
  mode: "solo" | "team";
  registeredAt: number;
}

const KEY = "competa_registrations";

export const getRegistrations = (): Registration[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getRegistration = (eventId: string): Registration | undefined =>
  getRegistrations().find((r) => r.eventId === eventId);

export const isRegistered = (eventId: string): boolean => !!getRegistration(eventId);

export const addRegistration = (
  eventId: string,
  mode: "solo" | "team" = "solo",
  ticketId?: string
): Registration => {
  const all = getRegistrations();
  const existing = all.find((r) => r.eventId === eventId);
  if (existing) return existing;
  const reg: Registration = {
    eventId,
    mode,
    ticketId:
      ticketId ||
      `${eventId.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    registeredAt: Date.now(),
  };
  localStorage.setItem(KEY, JSON.stringify([reg, ...all]));
  return reg;
};

export const removeRegistration = (eventId: string) => {
  const all = getRegistrations().filter((r) => r.eventId !== eventId);
  localStorage.setItem(KEY, JSON.stringify(all));
};
