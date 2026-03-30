// Auth & owner upgrade routes
import { Router, Request, Response } from "express";
import { db } from "../db";
import { users, owners, parkingLots, slots } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Validation
const upgradeSchema = z.object({
  address: z.string().min(1),
  country: z.string().default("India"),
  squareFeet: z.number().optional(),
  capacity: z.number().int().positive(),
});

// Nominatim geocoding
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
    const data = (await response.json()) as any[];
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

/**
 * POST /api/owner/upgrade — Upgrade driver to owner
 */
router.post(
  "/owner/upgrade",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const body = upgradeSchema.parse(req.body);

      // Get current user
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, req.auth!.clerkId),
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Check if already owner
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
      }

      // Update user role to OWNER
      await db
        .update(users)
        .set({ role: "OWNER", updatedAt: new Date() })
        .where(eq(users.id, user.id));

      // Geocode address
      const coords = await geocodeAddress(body.address);

      // Create parking lot
      const [lot] = await db
        .insert(parkingLots)
        .values({
          name: `${user.name}'s Parking`,
          address: body.address,
          country: body.country,
          squareFeet: body.squareFeet,
          capacity: body.capacity,
          baseRate: 50,
          lat: coords?.lat,
          lng: coords?.lng,
          ownerId: owner.id,
        })
        .returning();

      // Auto-generate slots
      const slotValues = Array.from({ length: body.capacity }, (_, i) => ({
        number: `S-${i + 1}`,
        size: "MEDIUM" as const,
        status: "FREE" as const,
        lotId: lot.id,
      }));

      await db.insert(slots).values(slotValues);

      res.status(201).json({
        message: "Upgraded to owner successfully",
        owner,
        lot,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      console.error("Upgrade to owner error:", error);
      res.status(500).json({ error: "Failed to upgrade to owner" });
    }
  }
);

export default router;
