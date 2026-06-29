import { randomInt } from "node:crypto";

// Excludes visually ambiguous characters (0, 1, I, L, O).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CLIENT_ID_PATTERN = /^BH-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function createClientId(): string {
  const groups = Array.from({ length: 3 }, () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join(""),
  );
  return `BH-${groups.join("-")}`;
}

export function normalizeClientId(value: string): string | null {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");
  return CLIENT_ID_PATTERN.test(normalized) ? normalized : null;
}

export function legacyNumericId(value: string): number | null {
  const cleaned = value.trim().toUpperCase().replace(/^BH-?/, "");
  if (!/^\d{1,8}$/.test(cleaned)) return null;
  const id = Number.parseInt(cleaned, 10);
  return id > 0 ? id : null;
}
