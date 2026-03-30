// App-wide constants and configuration

export const COLORS = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",
  cyan: "#06b6d4",
  cyanLight: "#22d3ee",

  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  light: {
    background: "#f7f9fc",
    card: "#ffffff",
    border: "#f3f4f6",
    text: "#111827",
    textSecondary: "#6b7280",
  },
  dark: {
    background: "#0a0a0a",
    card: "#171717",
    border: "#262626",
    text: "#ffffff",
    textSecondary: "#a3a3a3",
  },

  booking: {
    ACTIVE: "#22c55e",
    COMPLETED: "#3b82f6",
    CANCELLED: "#ef4444",
    EXPIRED: "#9ca3af",
  },

  slot: {
    FREE: "#22c55e",
    RESERVED: "#f59e0b",
    OCCUPIED: "#ef4444",
  },
} as const;

export const GRADIENT = {
  primary: ["#2563eb", "#06b6d4"] as const,
  dark: ["#1e3a8a", "#0891b2"] as const,
  success: ["#16a34a", "#22c55e"] as const,
};

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";

export const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export const DEFAULT_BASE_RATE = 50; // ₹ per hour
export const CURRENCY_SYMBOL = "₹";

export const MAP_DEFAULTS = {
  region: {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 10,
    longitudeDelta: 10,
  },
  markerColors: {
    default: "#2563eb",
    selected: "#f59e0b",
    booked: "#22c55e",
    destination: "#ef4444",
  },
};

export const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";
export const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";
