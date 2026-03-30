// Property routes
import { Router, Request, Response } from "express";
import { db } from "../db";
import { parkingLots, slots, owners, users } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Validation
const createPropertySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  baseRate: z.number().positive(),
  slots: z.number().int().positive(),
});

// Nominatim geocoding helper
async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const params = new URLSearchParams({
      format: "json",
      q: address,
      limit: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { "User-Agent": "SmartPark/1.0" } }
    );

    const data = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}

/**
 * GET /api/properties — Get all parking lots with slots
 */
router.get("/", requireAuth, async (_req: Request, res: Response) => {
  try {
    const allLots = await db.query.parkingLots.findMany({
      with: {
        slots: true,
        owner: {
          with: { user: true },
        },
      },
    });

    res.json(allLots);
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

/**
 * GET /api/properties/:id — Get single parking lot
 */
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const lot = await db.query.parkingLots.findFirst({
      where: eq(parkingLots.id, req.params.id as string),
      with: {
        slots: true,
        owner: { with: { user: true } },
      },
    });

    if (!lot) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    res.json(lot);
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

/**
 * GET /api/properties/owner — Get current owner's properties
 */
router.get("/owner", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, req.auth!.clerkId),
    });

    if (!user || user.role !== "OWNER") {
      res.status(403).json({ error: "Access denied. Owner role required." });
      return;
    }

    const owner = await db.query.owners.findFirst({
      where: eq(owners.userId, user.id),
    });

    if (!owner) {
      res.json([]);
      return;
    }

    const ownerLots = await db.query.parkingLots.findMany({
      where: eq(parkingLots.ownerId, owner.id),
      with: { slots: true },
    });

    res.json(ownerLots);
  } catch (error) {
    console.error("Get owner properties error:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

/**
 * POST /api/properties — Create a parking lot (owner only)
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const body = createPropertySchema.parse(req.body);

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, req.auth!.clerkId),
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get or verify owner
    let owner = await db.query.owners.findFirst({
      where: eq(owners.userId, user.id),
    });

    if (!owner) {
      // Create owner record
      const [newOwner] = await db
        .insert(owners)
        .values({ userId: user.id })
        .returning();
      owner = newOwner;

      // Update user role
      await db
        .update(users)
        .set({ role: "OWNER", updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    // Geocode address
    const coords = await geocodeAddress(body.address);

    // Create parking lot
    const [lot] = await db
      .insert(parkingLots)
      .values({
        name: body.name,
        address: body.address,
        baseRate: body.baseRate,
        capacity: body.slots,
        lat: coords?.lat,
        lng: coords?.lng,
        ownerId: owner.id,
      })
      .returning();

    // Auto-generate slots
    const slotValues = Array.from({ length: body.slots }, (_, i) => ({
      number: `S-${i + 1}`,
      size: "MEDIUM" as const,
      status: "FREE" as const,
      lotId: lot.id,
    }));

    await db.insert(slots).values(slotValues);

    // Return lot with slots
    const createdLot = await db.query.parkingLots.findFirst({
      where: eq(parkingLots.id, lot.id),
      with: { slots: true },
    });

    res.status(201).json(createdLot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error("Create property error:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
});

export default router;
