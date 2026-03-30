// Drizzle ORM schema definitions matching the PostgreSQL schema
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("Role", [
  "DRIVER",
  "ADMIN",
  "GUARD",
  "OWNER",
]);

export const slotStatusEnum = pgEnum("SlotStatus", [
  "FREE",
  "RESERVED",
  "OCCUPIED",
]);

export const bookingStatusEnum = pgEnum("BookingStatus", [
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
]);

// Tables
export const users = pgTable("User", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clerkId: text("clerkId").unique().notNull(),
  role: roleEnum("role").default("DRIVER"),
  name: text("name"),
  email: text("email").unique().notNull(),
  phone: text("phone").unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const vehicles = pgTable("Vehicle", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  plateNumber: text("plateNumber").notNull(),
  type: text("type").notNull(),
  model: text("model"),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
});

export const owners = pgTable("Owner", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("userId")
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  documentUrl: text("documentUrl"),
  verified: boolean("verified").default(false),
});

export const parkingLots = pgTable("ParkingLot", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  country: text("country").default("IN"),
  squareFeet: doublePrecision("squareFeet"),
  capacity: integer("capacity").default(1),
  baseRate: doublePrecision("baseRate").default(50.0),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  ownerId: text("ownerId").references(() => owners.id, {
    onDelete: "cascade",
  }),
});

export const slots = pgTable("Slot", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  number: text("number").notNull(),
  size: text("size").default("MEDIUM"),
  status: slotStatusEnum("status").default("FREE"),
  lotId: text("lotId").references(() => parkingLots.id, {
    onDelete: "cascade",
  }),
});

export const bookings = pgTable("Booking", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  slotId: text("slotId").references(() => slots.id, { onDelete: "cascade" }),
  vehicleId: text("vehicleId").references(() => vehicles.id, {
    onDelete: "cascade",
  }),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  amount: doublePrecision("amount"),
  status: bookingStatusEnum("status").default("ACTIVE"),
});

export const payments = pgTable("Payment", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull(),
  method: text("method").notNull(),
  bookingId: text("bookingId")
    .unique()
    .references(() => bookings.id, { onDelete: "cascade" }),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  vehicles: many(vehicles),
  bookings: many(bookings),
  owner: one(owners, {
    fields: [users.id],
    references: [owners.userId],
  }),
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
}));

export const ownersRelations = relations(owners, ({ one, many }) => ({
  user: one(users, {
    fields: [owners.userId],
    references: [users.id],
  }),
  lots: many(parkingLots),
}));

export const parkingLotsRelations = relations(parkingLots, ({ one, many }) => ({
  owner: one(owners, {
    fields: [parkingLots.ownerId],
    references: [owners.id],
  }),
  slots: many(slots),
}));

export const slotsRelations = relations(slots, ({ one, many }) => ({
  lot: one(parkingLots, {
    fields: [slots.lotId],
    references: [parkingLots.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  slot: one(slots, {
    fields: [bookings.slotId],
    references: [slots.id],
  }),
  vehicle: one(vehicles, {
    fields: [bookings.vehicleId],
    references: [vehicles.id],
  }),
}));
