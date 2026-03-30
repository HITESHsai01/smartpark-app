// TypeScript interfaces for the entire app

export type Role = "DRIVER" | "ADMIN" | "GUARD" | "OWNER";
export type SlotStatus = "FREE" | "RESERVED" | "OCCUPIED";
export type BookingStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export interface User {
  id: string;
  clerkId: string;
  role: Role;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string; // CAR, BIKE, SUV, etc.
  model: string | null;
  userId: string;
}

export interface Owner {
  id: string;
  userId: string;
  documentUrl: string | null;
  verified: boolean;
  user?: User;
}

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  country: string;
  squareFeet: number | null;
  capacity: number;
  baseRate: number;
  lat: number | null;
  lng: number | null;
  ownerId: string;
  owner?: Owner;
  slots?: Slot[];
}

export interface Slot {
  id: string;
  number: string;
  size: string; // SMALL, MEDIUM, LARGE
  status: SlotStatus;
  lotId: string;
  lot?: ParkingLot;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string | null;
  amount: number | null;
  status: BookingStatus;
  user?: User;
  slot?: Slot & { lot?: ParkingLot };
  vehicle?: Vehicle;
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  method: string;
  bookingId: string;
  booking?: Booking;
}

// API request/response types
export interface CreateBookingRequest {
  propertyId: string;
  duration: number;
  vehicleType: string;
  amount: number;
}

export interface CreatePropertyRequest {
  name: string;
  address: string;
  baseRate: number;
  slots: number;
}

export interface UpgradeToOwnerRequest {
  address: string;
  country: string;
  squareFeet: number;
  capacity: number;
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

export interface RouteResult {
  coordinates: Array<{ latitude: number; longitude: number }>;
  distance: number; // in km
  duration: number; // in minutes
}

export interface MapMarkerData {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  address: string;
  rate: number;
  freeSlots: number;
  totalSlots: number;
  isBooked: boolean;
}
