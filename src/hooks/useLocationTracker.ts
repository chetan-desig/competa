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

// Module-level guards so React StrictMode double-mounts don't duplicate pings
let started = false;
let lastSent: { lat: number; lng: number; t: number } | null = null;
const MIN_INTERVAL_MS = 30_000; // throttle: at most every 30s
const MIN_DELTA_DEG = 0.0001;   // ~11m movement threshold

const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.state_district ||
      data?.address?.state ||
      null
    );
  } catch {
    return null;
  }
};

const recordPing = async (pos: GeolocationPosition) => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const now = Date.now();

  // Throttle: skip if too soon AND barely moved
  if (
    lastSent &&
    now - lastSent.t < MIN_INTERVAL_MS &&
    Math.abs(lat - lastSent.lat) < MIN_DELTA_DEG &&
    Math.abs(lng - lastSent.lng) < MIN_DELTA_DEG
  ) {
    return;
  }
  lastSent = { lat, lng, t: now };

  const city = await reverseGeocode(lat, lng);

  const { error } = await supabase.from("user_locations" as any).insert({
    session_id: getSessionId(),
    role: getUserRole(),
    latitude: lat,
    longitude: lng,
    accuracy: pos.coords.accuracy ?? null,
    user_agent: navigator.userAgent,
    city,
  });
  if (error) console.error("[location] insert failed:", error.message);
};

/**
 * Requests browser location permission (once per session) and streams
 * realtime location pings to the backend — deduped + throttled.
 */
export const useLocationTracker = () => {
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    if (localStorage.getItem(PERMISSION_KEY) === "denied") return;
    if (started) return; // guard against StrictMode double-mount
    started = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
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

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => recordPing(pos),
      () => {},
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 30_000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      started = false;
    };
  }, []);
};
