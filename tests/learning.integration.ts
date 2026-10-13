// Uses two explicitly confirmed disposable AIPEX QA aliases. No account deletion.
import assert from "node:assert/strict";
import {
  NeonPostgrestClient,
  fetchWithToken,
} from "@neondatabase/postgrest-js";
import { courses, quizRevision } from "../src/content/courses";
import { allLessons } from "../src/lib/courses";
const origin = process.env.NEON_TEST_ORIGIN ?? "http://127.0.0.1:3100";
assert.equal(
  origin,
  "http://127.0.0.1:3100",
  "Run against the local AIPEX app only",
);
assert.equal(
  process.env.NEON_AUTH_BASE_URL,
  process.env.NEON_TEST_AUTH_BASE_URL,
  "Explicitly select the dedicated AIPEX test backend",
);
assert.ok(process.env.NEON_TEST_AUTH_BASE_URL?.includes("neonauth."));
async function learner(label: string) {
  const email = process.env[`NEON_TEST_EMAIL_${label.toUpperCase()}`]!;
  const password = process.env.NEON_TEST_PASSWORD!;
  assert.match(
    email,
    /^green\.jcb\+aipex-qa-[a-z0-9-]+@gmail\.com$/,
    "Use only disposable AIPEX QA aliases",
  );
  const jar = new Map<string, string>();
  const login = await fetch(`${origin}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", origin },
    body: JSON.stringify({ email, password }),
  });
  assert.equal(
    login.status,
    200,
    "A verified QA learner must be able to sign in",
  );
  const data = await login.json();
  assert.ok(data.user?.emailVerified, "Email verification is required");
  const sessionCookies = login.headers.getSetCookie();
  assert.ok(
    sessionCookies.some(
      (c) => c.includes("session_token") && /httponly/i.test(c),
    ),
    "Session cookies must be HttpOnly",
  );
  for (const c of sessionCookies) {
    const [part] = c.split(";");
    const i = part.indexOf("=");
    jar.set(part.slice(0, i), part.slice(i + 1));
  }
  const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  const tokenResponse = await fetch(`${origin}/api/auth/token`, {
    headers: { origin, cookie: cookie() },
  });
  assert.equal(tokenResponse.status, 200);
  const { token } = await tokenResponse.json();
  assert.ok(token);
  const client = new NeonPostgrestClient({
    dataApiUrl: process.env.NEON_DATA_API_URL!,
    options: { global: { fetch: fetchWithToken(async () => token) } },
  });
  const post = async (body: object) => {
    const res = await fetch(`${origin}/api/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json", origin, cookie: cookie() },
      body: JSON.stringify({ quizRevision, ...body }),
    });
    return { status: res.status, body: await res.json() };
  };
  return { client, post, cookie, userId: data.user.id };
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
    const logout = await fetch(`${origin}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        origin,
        cookie: a.cookie(),
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    assert.equal(logout.status, 200);
    assert.ok(
      logout.headers
        .getSetCookie()
        .some((c) => c.includes("session_token") && /max-age=0/i.test(c)),
      "Logout must clear the session cookie",
    );
    const afterLogout = await fetch(`${origin}/api/learning`, {
      method: "POST",
      headers: {
        origin,
        cookie: a.cookie(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "enroll", course: courses[0].slug }),
    });
    assert.equal(afterLogout.status, 401, "Revoked session must not save work");
    console.log(
      "Passed: verified sign-in, HttpOnly cookies, CSRF, enrolment, drafts, grading, all 24 completions, dashboard, portfolio export, cross-user RLS and logout revocation.",
    );
  } catch (error) {
    throw error;
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
