import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole } from "@/hooks/useRole";

const SESSION_KEY = "competa_session_id";
const PERMISSION_KEY = "competa_location_permission"; // "granted" | "denied"

const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const recordPing = async (pos: GeolocationPosition) => {
  const sessionId = getSessionId();
  await supabase.from("user_locations" as any).insert({
    session_id: sessionId,
    role: getUserRole(),
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? null,
    user_agent: navigator.userAgent,
  });
};

/**
 * Requests browser location permission (only once per session) and streams
 * realtime location pings to the backend.
 */
export const useLocationTracker = () => {
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    if (localStorage.getItem(PERMISSION_KEY) === "denied") return;

    let cancelled = false;

    const start = () => {
      // Initial ping
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          localStorage.setItem(PERMISSION_KEY, "granted");
          recordPing(pos);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            localStorage.setItem(PERMISSION_KEY, "denied");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Realtime watcher
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          if (cancelled) return;
          recordPing(pos);
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 30000 }
      );
    };

    start();

    return () => {
      cancelled = true;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);
};
