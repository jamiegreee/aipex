import "server-only";
import {
  NeonPostgrestClient,
  fetchWithToken,
} from "@neondatabase/postgrest-js";
import { createAuth } from "./auth";

// Every query uses the learner's JWT and database ownership policies. There is
// no owner connection string or privileged database key in the deployed app.
export async function createClient() {
  // Reuse one caller token for this client, including concurrent reads and any
  // read-only transport retry. It is never shared across requests or accounts.
  let token: Promise<string> | undefined;
  const callerToken = () => token ??= (async () => {
    const { data, error } = await createAuth().token();
    if (error || !data?.token)
      throw new Error("Your session has expired. Sign in again.");
    return data.token;
  })();
  return new NeonPostgrestClient({
    dataApiUrl: process.env.NEON_DATA_API_URL!,
    options: {
      global: {
        fetch: fetchWithToken(callerToken, async (input, init) => {
          const response = await fetch(input, { ...init, cache: "no-store" });
          const operation = new URL(typeof input === "string" || input instanceof URL ? input : input.url).pathname.split("/").at(-1);
          if (operation && ["membership_is_reviewer", "membership_review_queue", "membership_counts", "public_membership_counts"].includes(operation)) {
            // Record the wire status before the SDK can turn a 404 [] into an
            // apparent success. Never record headers, query strings or bodies.
            console.info("Membership data response.", { operation, status: response.status });
          }
          return response;
        }),
      },
    },
  });
}
