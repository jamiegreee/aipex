import "server-only";
import {
  NeonPostgrestClient,
  fetchWithToken,
} from "@neondatabase/postgrest-js";
import { createAuth } from "./auth";

// Every query uses the learner's JWT and database ownership policies. There is
// no owner connection string or privileged database key in the deployed app.
export async function createClient() {
  return new NeonPostgrestClient({
    dataApiUrl: process.env.NEON_DATA_API_URL!,
    options: {
      global: {
        fetch: fetchWithToken(async () => {
          const { data, error } = await createAuth().token();
          if (error || !data?.token)
            throw new Error("Your session has expired. Sign in again.");
          return data.token;
        }),
      },
    },
  });
}
