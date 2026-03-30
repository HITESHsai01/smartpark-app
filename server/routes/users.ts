// User routes
import { Router, Request, Response } from "express";
import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Validation
const createUserSchema = z.object({
  clerkId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

/**
 * POST /api/users — Create user after Clerk sign-up
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const body = createUserSchema.parse(req.body);

    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.clerkId, body.clerkId),
    });

    if (existing) {
      res.json(existing);
      return;
    }

    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: body.clerkId,
        name: body.name,
        email: body.email,
        role: "DRIVER",
      })
      .returning();

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * GET /api/users/me — Get current user by clerkId
 */
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, req.auth!.clerkId),
      with: { vehicles: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

export default router;
