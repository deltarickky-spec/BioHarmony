/**
 * BioHarmony Crypto Utilities
 *
 * Password hashing + JWT using Node.js built-in crypto module.
 * No external dependencies (bcrypt/jsonwebtoken) required.
 */

import crypto from "node:crypto";

// ── Constants ──────────────────────────────────────────────────────────────────

const JWT_ISSUER = "bioharmony-api";
const JWT_ALGORITHM = "HS256";
const KEY_LENGTH = 64; // scrypt hash length
const SALT_LENGTH = 16; // random salt bytes
const JWT_EXPIRY_HOURS = 24;

function getJwtSecret(): string {
  return process.env["JWT_SECRET"] ?? "dev-jwt-secret-change-in-production";
}

// ── Password hashing ───────────────────────────────────────────────────────────

/**
 * Hash a plaintext password using scrypt.
 * Returns a string in the format "salt:hash" (hex-encoded).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored "salt:hash" string.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
}

// ── JWT ────────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
  iss: string;
}

/**
 * Create a signed JWT token for a practitioner.
 */
export function signJwt(
  userId: number,
  email: string,
  name: string,
  role: string = "practitioner",
): string {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: JWT_ALGORITHM, typ: "JWT" };
  const payload: JwtPayload = {
    sub: userId,
    email,
    name,
    role,
    iat: now,
    exp: now + JWT_EXPIRY_HOURS * 3600,
    iss: JWT_ISSUER,
  };

  const base64url = (obj: object): string =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64url")
      .replace(/=+$/, "");

  const headerB64 = base64url(header);
  const payloadB64 = base64url(payload);
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode a JWT token.
 * Returns the payload if valid, null otherwise.
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const secret = getJwtSecret();

    // Verify signature
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signatureB64 !== expectedSig) return null;

    // Decode payload
    const payloadJson = Buffer.from(payloadB64!, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson) as JwtPayload;

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    // Check issuer
    if (payload.iss !== JWT_ISSUER) return null;

    return payload;
  } catch {
    return null;
  }
}
