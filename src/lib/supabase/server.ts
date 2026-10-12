import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

export const authConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
export async function createClient() {
  if (!authConfigured())
    throw new Error("Learning accounts are not configured.");
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        httpOnly: true,
        secure: (
          process.env.NEXT_PUBLIC_SITE_URL || "https://theaipex.org"
        ).startsWith("https:"),
        sameSite: "lax",
      },
      cookies: {
        getAll: () => store.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) =>
              store.set(name, value, options),
            );
          } catch {
            /* Rendering cannot write cookies; proxy handles refresh. */
          }
        },
      },
    },
  );
}
export const currentUser = cache(async () => {
  if (!authConfigured()) return null;
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
});
