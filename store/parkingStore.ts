// Zustand store for global parking/map state
import { create } from "zustand";
import type { MapMarkerData, RouteResult, GeocodingResult } from "@/lib/types";

interface ParkingState {
  // Search & destination
  searchQuery: string;
  destination: GeocodingResult | null;

  // Selected parking
  selectedParking: MapMarkerData | null;

  // Route data
  routeToDestination: RouteResult | null;
  routeToParking: RouteResult | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setDestination: (dest: GeocodingResult | null) => void;
  setSelectedParking: (parking: MapMarkerData | null) => void;
  setRouteToDestination: (route: RouteResult | null) => void;
  setRouteToParking: (route: RouteResult | null) => void;
  clearRoute: () => void;
  reset: () => void;
}

export const useParkingStore = create<ParkingState>((set) => ({
  searchQuery: "",
  destination: null,
  selectedParking: null,
  routeToDestination: null,
  routeToParking: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setDestination: (dest) => set({ destination: dest }),
  setSelectedParking: (parking) => set({ selectedParking: parking }),
  setRouteToDestination: (route) => set({ routeToDestination: route }),
  setRouteToParking: (route) => set({ routeToParking: route }),

  clearRoute: () =>
    set({
      routeToDestination: null,
      routeToParking: null,
      selectedParking: null,
    }),

  reset: () =>
    set({
      searchQuery: "",
      destination: null,
      selectedParking: null,
      routeToDestination: null,
      routeToParking: null,
    }),
}));
