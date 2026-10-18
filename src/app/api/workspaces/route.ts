import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, currentUser } from "@/lib/auth";
import { createClient } from "@/lib/database";
import { validWorkspace } from "@/lib/policy-workspace";
export const dynamic = "force-dynamic";
const reply = (body: object, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export async function GET(request: NextRequest) {
  try {
    const tool = request.nextUrl.searchParams.get("tool");
    if (
      tool &&
      !["assess-evidence", "compare-options", "plan-oversight"].includes(tool)
    )
      return reply({ error: "Tool not found." }, 400);
    if (!authConfigured()) return reply({ signedIn: false });
    const user = await currentUser(true);
    if (!user) return reply({ signedIn: false });
    const client = await createClient();
    let query = client
      .from("policy_workspaces")
      .select("id,tool_slug,document,updated_at")
      .eq("user_id", user.id);
    if (tool) query = query.eq("tool_slug", tool);
    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .limit(100);
    return error
      ? reply(
          {
            error:
              "Account drafts could not be loaded. Your browser drafts are still available.",
          },
          503,
        )
      : reply({ signedIn: true, drafts: data ?? [] });
  } catch {
    return reply(
      {
        error:
          "Your account could not be checked. You can still work and download your draft.",
      },
      503,
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    if (
      origin.host !== request.headers.get("host") ||
      !["http:", "https:"].includes(origin.protocol)
    )
      return reply({ error: "Refresh the page before saving." }, 403);
  } catch {
    return reply({ error: "Refresh the page before saving." }, 403);
  }
  let body;
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 200000)
      return reply({ error: "This draft is too large." }, 413);
    const raw = await request.text();
    if (raw.length > 200000)
      return reply({ error: "This draft is too large." }, 413);
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Invalid draft." }, 400);
  }
  if (
    !body ||
    !validWorkspace(body.document) ||
    !(
      body.expectedUpdatedAt === null ||
      (typeof body.expectedUpdatedAt === "string" &&
        !Number.isNaN(Date.parse(body.expectedUpdatedAt)))
    )
  )
    return reply({ error: "This draft format is not supported." }, 400);
  try {
    if (!authConfigured())
      return reply(
        {
          error:
            "Account saving is temporarily unavailable. Download your draft to keep a copy.",
        },
        503,
      );
    const user = await currentUser(true);
    if (!user)
      return reply(
        {
          error:
            "Sign in to save to your account. Your browser draft is retained.",
        },
        401,
      );
    const client = await createClient();
    const row = {
      user_id: user.id,
      id: body.document.id,
      tool_slug: body.document.tool,
      document: body.document,
    };
    const result =
      body.expectedUpdatedAt === null
        ? await client
            .from("policy_workspaces")
            .insert(row)
            .select("updated_at")
            .single()
        : await client
            .from("policy_workspaces")
            .update({ document: row.document, tool_slug: row.tool_slug })
            .eq("user_id", user.id)
            .eq("id", row.id)
            .eq("updated_at", body.expectedUpdatedAt)
            .select("updated_at")
            .maybeSingle();
    if (result.error?.code === "23505" || (!result.error && !result.data))
      return reply(
        {
          error:
            "A newer account version exists. Download this draft, then load the account version or save a copy with a new name.",
        },
        409,
      );
    if (result.error || !result.data)
      return reply(
        {
          error:
            "Could not save to your account. Your browser draft is retained; download a copy and try again.",
        },
        503,
      );
    return reply({ saved: true, updatedAt: result.data.updated_at });
  } catch {
    return reply(
      { error: "Account saving failed. Keep a download and try again." },
      503,
    );
  }
}
