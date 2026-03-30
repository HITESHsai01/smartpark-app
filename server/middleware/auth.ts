// Clerk JWT verification middleware for Express
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/express";

// Extend Express Request type to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        clerkId: string;
      };
    }
  }
}

/**
 * Middleware to verify Clerk JWT and attach user info to request
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing authorization token" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT token using Clerk
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    req.auth = {
      userId: payload.sub,
      clerkId: payload.sub,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
