// Run only against the dedicated local AIPEX stack. Never deletes production data.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { courses } from "../src/content/courses";
import { allLessons } from "../src/lib/courses";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
assert.equal(
  url,
  "http://127.0.0.1:55421",
  "Integration tests are restricted to the dedicated local database",
);
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const origin = "http://127.0.0.1:3100";
const id = randomUUID().slice(0, 8);
const password = `Aipex-test-${randomUUID()}`;
const users: string[] = [];
async function learner(label: string) {
  const email = `aipex-${label}-${id}@example.test`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  assert.ifError(error);
  users.push(data.user!.id);
  const jar = new Map<string, string>();
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (values) => values.forEach((c) => jar.set(c.name, c.value)),
    },
  });
  const login = await client.auth.signInWithPassword({ email, password });
  assert.ifError(login.error);
  const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  const post = async (body: object) => {
    const res = await fetch(`${origin}/api/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json", origin, cookie: cookie() },
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  };
  return { client, post, cookie, userId: data.user!.id };
}
async function main() {
  try {
    const a = await learner("a");
    const b = await learner("b");
    const unauth = await fetch(`${origin}/api/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json", origin },
      body: JSON.stringify({ action: "enroll", course: courses[0].slug }),
    });
    assert.equal(unauth.status, 401);
    const crossOrigin = await fetch(`${origin}/api/learning`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://evil.example",
        cookie: a.cookie(),
      },
      body: JSON.stringify({ action: "enroll", course: courses[0].slug }),
    });
    assert.equal(crossOrigin.status, 403);
    for (const course of courses) {
      assert.equal(
        (await a.post({ action: "enroll", course: course.slug })).status,
        200,
      );
      assert.equal(
        (await a.post({ action: "enroll", course: course.slug })).status,
        200,
      );
      const first = allLessons(course)[0];
      const base = {
        course: course.slug,
        lesson: first.slug,
        answers: first.questions.map((q) => q.answer),
        reviewed: true,
      };
      const short = await a.post({
        ...base,
        action: "complete",
        response: "Too short.",
      });
      assert.equal(short.body.completed, false);
      const wrong = await a.post({
        ...base,
        action: "complete",
        response: first.modelAnswer,
        answers: first.questions.map((q) => (q.answer + 1) % q.options.length),
      });
      assert.equal(wrong.body.completed, false);
      const unchecked = await a.post({
        ...base,
        action: "complete",
        response: first.modelAnswer,
        reviewed: false,
      });
      assert.equal(unchecked.body.completed, false);
      for (const lesson of allLessons(course)) {
        const response = lesson.modelAnswer + "\n" + lesson.modelAnswer;
        const result = await a.post({
          action: "complete",
          course: course.slug,
          lesson: lesson.slug,
          response,
          answers: lesson.questions.map((q) => q.answer),
          reviewed: true,
          user_id: b.userId,
        });
        assert.equal(result.status, 200);
        assert.equal(result.body.completed, true, lesson.slug);
        assert.equal(result.body.score, 100);
      }
      const draft = await a.post({
        ...base,
        action: "save",
        response: first.modelAnswer,
      });
      assert.equal(
        draft.body.completed,
        true,
        "Saving a later draft must preserve completion",
      );
    }
    const { data: own, error: ownError } = await a.client
      .from("lesson_progress")
      .select("*");
    assert.ifError(ownError);
    assert.equal(own?.length, 24);
    assert.ok(own?.every((p) => p.user_id === a.userId && p.completed_at));
    const { data: hidden, error: hiddenError } = await b.client
      .from("lesson_progress")
      .select("*");
    assert.ifError(hiddenError);
    assert.equal(hidden?.length, 0);
    const forged = await b.client.from("lesson_progress").insert({
      user_id: a.userId,
      course_slug: courses[0].slug,
      lesson_slug: "forged",
      response: "forged",
    });
    assert.ok(forged.error, "RLS must reject writing another learner's row");
    const changed = await b.client
      .from("lesson_progress")
      .update({ response: "tampered" })
      .eq("user_id", a.userId)
      .select();
    assert.ifError(changed.error);
    assert.equal(changed.data?.length, 0);
    const dashboard = await fetch(`${origin}/learn`, {
      headers: { cookie: a.cookie() },
    });
    assert.equal(dashboard.status, 200);
    assert.ok((await dashboard.text()).includes("Course complete"));
    const portfolio = await fetch(`${origin}/learn/portfolio`, {
      headers: { cookie: a.cookie() },
    });
    assert.equal(portfolio.status, 200);
    const text = await portfolio.text();
    assert.ok(
      text.includes(courses[0].title) &&
        text.includes(courses[1].title) &&
        text.includes("Status: Completed"),
    );
    assert.match(portfolio.headers.get("cache-control")!, /no-store/);
    const otherPortfolio = await fetch(`${origin}/learn/portfolio`, {
      headers: { cookie: b.cookie() },
    });
    assert.ok(!(await otherPortfolio.text()).includes("Status: Completed"));
    const confirmationEmail = `aipex-confirm-${id}@example.test`;
    const generated = await admin.auth.admin.generateLink({
      type: "signup",
      email: confirmationEmail,
      password,
    });
    assert.ifError(generated.error);
    users.push(generated.data.user!.id);
    const confirmation = await fetch(
      `${origin}/auth/confirm?type=email&token_hash=${generated.data.properties!.hashed_token}`,
      { redirect: "manual" },
    );
    assert.equal(confirmation.status, 307);
    assert.equal(confirmation.headers.get("location"), `${origin}/learn`);
    assert.ok(
      confirmation.headers.getSetCookie().some((c) => c.includes("auth-token")),
      "Confirmation must establish a session",
    );
    assert.ok(
      confirmation.headers
        .getSetCookie()
        .filter((c) => c.includes("auth-token"))
        .every((c) => /httponly/i.test(c)),
      "Auth session cookies must be HttpOnly",
    );
    const resetPage = await fetch(`${origin}/reset-password`, {
      headers: { cookie: a.cookie() },
    });
    const resetHtml = await resetPage.text();
    const form = new FormData();
    const decode = (s: string) =>
      s
        .replaceAll("&quot;", '"')
        .replaceAll("&#x27;", "'")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&");
    let actionFields = 0;
    for (const input of resetHtml.matchAll(/<input\b[^>]*>/g)) {
      const name = input[0].match(/name="([^"]*)"/)?.[1];
      if (!name?.startsWith("$ACTION")) continue;
      form.append(
        decode(name),
        decode(input[0].match(/value="([^"]*)"/)?.[1] ?? ""),
      );
      actionFields++;
    }
    assert.ok(
      actionFields > 0,
      "Reset page must provide a progressively enhanced server action",
    );
    const newPassword = `Updated-local-${randomUUID()}`;
    form.set("password", newPassword);
    form.set("confirm", newPassword);
    const reset = await fetch(`${origin}/reset-password`, {
      method: "POST",
      headers: { origin, cookie: a.cookie() },
      body: form,
      redirect: "manual",
    });
    assert.equal(reset.status, 303);
    assert.ok(
      reset.headers.get("location")?.includes("/learn?password=updated"),
    );
    const changedLogin = await a.client.auth.signInWithPassword({
      email: `aipex-a-${id}@example.test`,
      password: newPassword,
    });
    assert.ifError(changedLogin.error);
    console.log(
      "Passed: authentication, confirmation, password update, CSRF, enrolment, saved drafts, grading, all 24 completions, dashboard, export and cross-user isolation.",
    );
  } finally {
    for (const user of users) {
      const { error } = await admin.auth.admin.deleteUser(user);
      assert.ifError(error);
    }
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
