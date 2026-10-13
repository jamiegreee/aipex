import "server-only";
import { cache } from "react";
import { createNeonAuth } from "@neondatabase/auth/next/server";

export const authConfigured = () =>
  Boolean(
    process.env.NEON_AUTH_BASE_URL &&
      process.env.NEON_AUTH_COOKIE_SECRET &&
      process.env.NEON_DATA_API_URL,
  );

export function createAuth() {
  if (!authConfigured())
    throw new Error("Learning accounts are not configured.");
  return createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: {
      secret: process.env.NEON_AUTH_COOKIE_SECRET!,
      sameSite: "lax",
      sessionDataTtl: 60,
    },
  });
}

export const currentUser = cache(async (requireFresh = false) => {
  if (!authConfigured()) return null;
  // Mutations validate with the provider so logout/revocation takes effect
  // immediately, even when a browser still holds the short-lived session cache.
  const { data, error } = await createAuth().getSession(
    requireFresh ? { query: { disableCookieCache: "true" } } : undefined,
  );
  if (error?.status === 401 || error?.status === 403) return null;
  if (error)
    throw new Error("Your account could not be checked. Please try again.");
  return data?.user?.emailVerified ? data.user : null;
});
