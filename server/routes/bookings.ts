// Booking routes
import { Router, Request, Response } from "express";
import { db } from "../db";
import { bookings, slots, vehicles, users, parkingLots, owners } from "../schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Validation
const createBookingSchema = z.object({
  propertyId: z.string().min(1),
  duration: z.number().int().positive(),
  vehicleType: z.string().min(1),
  amount: z.number().positive(),
});

/**
 * GET /api/bookings — Get user's bookings
 */
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, req.auth!.clerkId),
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userBookings = await db.query.bookings.findMany({
      where: eq(bookings.userId, user.id),
      with: {
        slot: {
          with: { lot: true },
        },
        vehicle: true,
      },
      orderBy: (bookings, { desc }) => [desc(bookings.startTime)],
    });

    res.json(userBookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/**
 * GET /api/bookings/owner — Get owner's bookings across all properties
 */
router.get("/owner", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, req.auth!.clerkId),
    });

    if (!user || user.role !== "OWNER") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const owner = await db.query.owners.findFirst({
      where: eq(owners.userId, user.id),
    });

    if (!owner) {
      res.json([]);
      return;
    }

    // Get all lots for this owner
    const ownerLots = await db.query.parkingLots.findMany({
      where: eq(parkingLots.ownerId, owner.id),
    });

    const lotIds = ownerLots.map((l) => l.id);

    // Get all slots for these lots
    const ownerSlots = await db.query.slots.findMany({
      where: (s, { inArray }) => inArray(s.lotId, lotIds),
    });

    const slotIds = ownerSlots.map((s) => s.id);

    if (slotIds.length === 0) {
      res.json([]);
      return;
    }

    // Get all bookings for these slots
    const ownerBookings = await db.query.bookings.findMany({
      where: (b, { inArray }) => inArray(b.slotId, slotIds),
      with: {
        user: true,
        slot: { with: { lot: true } },
        vehicle: true,
      },
      orderBy: (bookings, { desc }) => [desc(bookings.startTime)],
    });

    res.json(ownerBookings);
  } catch (error) {
    console.error("Get owner bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/**
 * POST /api/bookings — Create a booking
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const body = createBookingSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, req.auth!.clerkId),
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Find a free slot in the property
    const freeSlot = await db.query.slots.findFirst({
      where: and(
        eq(slots.lotId, body.propertyId),
        eq(slots.status, "FREE")
      ),
    });

    if (!freeSlot) {
      res.status(400).json({ error: "No free slots available" });
      return;
    }

    // Find or create vehicle
    let vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.userId, user.id),
        eq(vehicles.type, body.vehicleType)
      ),
    });

    if (!vehicle) {
      const [newVehicle] = await db
        .insert(vehicles)
        .values({
          plateNumber: "TBD-0000",
          type: body.vehicleType,
          userId: user.id,
        })
        .returning();
      vehicle = newVehicle;
    }

    // Calculate times
    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + body.duration * 60 * 60 * 1000
    );

    // Create booking
    const [booking] = await db
      .insert(bookings)
      .values({
        userId: user.id,
        slotId: freeSlot.id,
        vehicleId: vehicle.id,
        startTime,
        endTime,
        amount: body.amount,
        status: "ACTIVE",
      })
      .returning();

    // Update slot status to RESERVED
    await db
      .update(slots)
      .set({ status: "RESERVED" })
      .where(eq(slots.id, freeSlot.id));

    // Return full booking
    const fullBooking = await db.query.bookings.findFirst({
      where: eq(bookings.id, booking.id),
      with: {
        slot: { with: { lot: true } },
        vehicle: true,
      },
    });

    res.status(201).json(fullBooking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
