// Custom hook for fetching parking properties
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { ParkingLot } from "@/lib/types";

export function useProperties() {
  const [properties, setProperties] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ParkingLot[]>("/properties");
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load properties"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOwnerProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ParkingLot[]>("/properties/owner");
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load properties"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { properties, loading, error, fetchProperties, fetchOwnerProperties };
}
