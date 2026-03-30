// OSRM routing API helper
import { OSRM_URL } from "./constants";
import type { RouteResult } from "./types";

interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Get driving route between two points using OSRM
 */
export async function getRoute(
  start: Coordinate,
  end: Coordinate
): Promise<RouteResult | null> {
  try {
    const url = `${OSRM_URL}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map(
      (coord: [number, number]) => ({
        latitude: coord[1],
        longitude: coord[0],
      })
    );

    return {
      coordinates,
      distance: route.distance / 1000, // meters to km
      duration: route.duration / 60, // seconds to minutes
    };
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
}

/**
 * Get multi-leg route (user → destination → parking)
 */
export async function getMultiLegRoute(
  userLocation: Coordinate,
  destination: Coordinate,
  parking: Coordinate
): Promise<{
  leg1: RouteResult | null;
  leg2: RouteResult | null;
  totalDistance: number;
  totalDuration: number;
}> {
  const [leg1, leg2] = await Promise.all([
    getRoute(userLocation, destination),
    getRoute(destination, parking),
  ]);

  return {
    leg1,
    leg2,
    totalDistance: (leg1?.distance || 0) + (leg2?.distance || 0),
    totalDuration: (leg1?.duration || 0) + (leg2?.duration || 0),
  };
}
