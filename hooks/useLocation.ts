// Custom hook for device location using expo-location
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

interface LocationState {
  latitude: number;
  longitude: number;
  heading: number | null;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function startWatching() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            setError("Location permission denied");
            setLoading(false);
          }
          return;
        }

        // Get initial position
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            heading: currentLocation.coords.heading,
          });
          setLoading(false);
        }

        // Watch position updates
        watchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10,
            timeInterval: 5000,
          },
          (newLocation) => {
            if (isMounted) {
              setLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                heading: newLocation.coords.heading,
              });
            }
          }
        );
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to get location"
          );
          setLoading(false);
        }
      }
    }

    startWatching();

    return () => {
      isMounted = false;
      watchRef.current?.remove();
    };
  }, []);

  return { location, error, loading };
}
