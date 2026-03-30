// Custom hook for fetching bookings
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Booking } from "@/lib/types";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Booking[]>("/bookings");
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOwnerBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Booking[]>("/bookings/owner");
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  return { bookings, loading, error, fetchBookings, fetchOwnerBookings };
}
