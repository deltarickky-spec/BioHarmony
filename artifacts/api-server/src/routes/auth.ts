/**
 * BioHarmony Authentication Routes
 *
 * POST /api/auth/login — authenticate with email + password, receive JWT token
 * POST /api/auth/register — (admin only) register a new practitioner login
 */

import { Router, type IRouter } from "express";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { verifyPassword, signJwt } from "../lib/crypto";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTH_DATA_PATH = resolve(__dirname, "..", "data", "practitioners-auth.json");

interface AuthRecord {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
}

interface AuthStore {
  practitioners: AuthRecord[];
  nextId: number;
}

function loadAuthStore(): AuthStore {
  try {
    const raw = readFileSync(AUTH_DATA_PATH, "utf-8");
    return JSON.parse(raw) as AuthStore;
  } catch {
    return { practitioners: [], nextId: 1 };
  }
}

function saveAuthStore(store: AuthStore): void {
  writeFileSync(AUTH_DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
}

// ── Login ──────────────────────────────────────────────────────────────────────

const LoginSchema = z.object({
  email: z.string().email().max(255).trim().toLowerCase(),
  password: z.string().min(1).max(200),
});

router.post("/auth/login", (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid request. Email and password are required.",
      details: parsed.error.issues,
    });
    return;
  }

  const { email, password } = parsed.data;
  const store = loadAuthStore();
  const practitioner = store.practitioners.find(
    (p) => p.email.toLowerCase() === email.toLowerCase(),
  );

  if (!practitioner) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  if (!verifyPassword(password, practitioner.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = signJwt(
    practitioner.id,
    practitioner.email,
    practitioner.name,
    practitioner.role,
  );

  req.log?.info?.({ id: practitioner.id, email: practitioner.email }, "Practitioner logged in");

  res.json({
    token,
    practitioner: {
      id: practitioner.id,
      email: practitioner.email,
      name: practitioner.name,
      role: practitioner.role,
    },
  });
});

// ── Verify token (for session check) ───────────────────────────────────────────

router.get("/auth/verify", requireAuth, (req, res) => {
  res.json({
    valid: true,
    practitioner: {
      id: req.user!.sub,
      email: req.user!.email,
      name: req.user!.name,
      role: req.user!.role,
    },
  });
});

export default router;
