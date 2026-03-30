// Nominatim geocoding API helper
import { NOMINATIM_URL } from "./constants";
import type { GeocodingResult } from "./types";

/**
 * Geocode an address string to lat/lng using OpenStreetMap Nominatim
 */
export async function geocodeAddress(
  query: string
): Promise<GeocodingResult | null> {
  try {
    const params = new URLSearchParams({
      format: "json",
      q: query,
      limit: "1",
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        "User-Agent": "SmartPark/1.0",
      },
    });

    const data = await response.json();

    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Search for location suggestions (for autocomplete)
 */
export async function searchLocations(
  query: string
): Promise<GeocodingResult[]> {
  if (!query || query.length < 3) return [];

  try {
    const params = new URLSearchParams({
      format: "json",
      q: query,
      limit: "5",
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        "User-Agent": "SmartPark/1.0",
      },
    });

    const data = await response.json();

    return data.map(
      (item: { lat: string; lon: string; display_name: string }) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
      })
    );
  } catch (error) {
    console.error("Location search error:", error);
    return [];
  }
}
