import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.f945ba251fbd41c08ea642c37f4991a3",
  appName: "competa",
  webDir: "dist",
  server: {
    url: "https://f945ba25-1fbd-41c0-8ea6-42c37f4991a3.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  ios: {
    contentInset: "always",
  },
  android: {
    backgroundColor: "#f5f6f8",
  },
};

export default config;
