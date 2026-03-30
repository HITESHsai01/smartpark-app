// Utility functions — formatters, helpers
import { formatDistanceToNow, format } from "date-fns";
import { CURRENCY_SYMBOL } from "./constants";

/**
 * Format a number as INR currency
 */
export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString("en-IN")}`;
}

/**
 * Format a date string to readable format
 */
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
}

/**
 * Format a date string to short format
 */
export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), "dd MMM, hh:mm a");
}

/**
 * Get relative time from now (e.g., "2 hours ago")
 */
export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

/**
 * Get the first letter of a name for avatar
 */
export function getInitial(name: string | null | undefined): string {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

/**
 * Truncate text to a max length
 */
export function truncate(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Calculate booking amount
 */
export function calculateAmount(
  baseRate: number,
  durationHours: number
): number {
  return baseRate * durationHours;
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * Format duration in minutes
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
