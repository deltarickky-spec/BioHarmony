/**
 * JWT authentication middleware for BioHarmony API.
 * Verifies Bearer tokens on protected routes.
 */

import { type Request, type Response, type NextFunction } from "express";
import { verifyJwt, type JwtPayload } from "../lib/crypto";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Express middleware that requires a valid JWT Bearer token.
 * On success, sets req.user with the decoded payload.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header. Use: Bearer <token>" });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({ error: "Empty token" });
    return;
  }

  const payload = verifyJwt(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Express middleware that optionally attaches user info if a valid token is present.
 * Does NOT reject the request if no token is present — use for public routes
 * that optionally know who the user is.
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const payload = verifyJwt(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}
