import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/database";
import { currentUser, authConfigured } from "@/lib/auth";
import { findCourse, quizRevision } from "@/content/courses";
import { allLessons, grade, wordCount } from "@/lib/courses";
import { coursesEnabled } from "@/lib/site";

export const dynamic = "force-dynamic";
const reply = (body: object, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export async function POST(request: NextRequest) {
  if (!coursesEnabled) return reply({ error: "Not found." }, 404);
  // Next's internal URL can use localhost while the browser uses 127.0.0.1.
  // Compare to the actual request Host, which a cross-origin browser cannot set.
  let origin: URL;
  try {
    origin = new URL(request.headers.get("origin") ?? "");
  } catch {
    return reply(
      { error: "This request could not be verified. Refresh the page." },
      403,
    );
  }
  if (
    origin.host !== request.headers.get("host") ||
    !["http:", "https:"].includes(origin.protocol)
  )
    return reply(
      { error: "This request could not be verified. Refresh the page." },
      403,
    );
  if (Number(request.headers.get("content-length") ?? 0) > 100000)
    return reply({ error: "Your response is too long." }, 413);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 100000)
      return reply({ error: "Your response is too long." }, 413);
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Invalid submission." }, 400);
  }
  if (!body || typeof body !== "object")
    return reply({ error: "Invalid submission." }, 400);
  const course = findCourse(body.course);
  if (!course) return reply({ error: "Course not found." }, 404);
  if (!authConfigured())
    return reply(
      {
        error:
          "Learning accounts are being configured. Please try again shortly.",
      },
      503,
    );
  const client = await createClient();
  const user = await currentUser(true);
  if (!user)
    return reply(
      { error: "Your session has expired. Sign in again to save your work." },
      401,
    );
  if (body.action === "enroll") {
    const { error } = await client
      .from("course_enrollments")
      .upsert(
        { user_id: user.id, course_slug: course.slug },
        { onConflict: "user_id,course_slug", ignoreDuplicates: true },
      );
    return error
      ? reply({ error: "We could not enrol you. Please try again." }, 500)
      : reply({ success: true });
  }
  const lesson = allLessons(course).find((l) => l.slug === body.lesson);
  if (!lesson || !["save", "complete"].includes(body.action))
    return reply({ error: "Lesson or action not found." }, 400);
  if (typeof body.response !== "string" || body.response.length > 50000)
    return reply(
      { error: "Write a response of up to 50,000 characters." },
      400,
    );
  const { data: enrollment, error: enrollmentError } = await client
    .from("course_enrollments")
    .select("course_slug")
    .eq("user_id", user.id)
    .eq("course_slug", course.slug)
    .maybeSingle();
  if (enrollmentError)
    return reply(
      { error: "We could not check your enrolment. Try again." },
      500,
    );
  if (!enrollment)
    return reply({ error: "Enrol in this course before saving work." }, 403);
  const { data: existing, error: readError } = await client
    .from("lesson_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("course_slug", course.slug)
    .eq("lesson_slug", lesson.slug)
    .maybeSingle();
  if (readError)
    return reply(
      { error: "We could not load your learning record. Try again." },
      500,
    );
  if (body.quizRevision !== quizRevision)
    return reply(
      {
        error:
          "The course checks have changed. Keep a copy of your unsaved answer, then refresh this lesson before saving.",
      },
      409,
    );
  const answers = body.answers;
  if (
    !Array.isArray(answers) ||
    answers.length !== lesson.questions.length ||
    answers.some(
      (a, i) =>
        !Number.isInteger(a) ||
        a < -1 ||
        a >= lesson.questions[i].options.length,
    )
  )
    return reply({ error: "Invalid knowledge-check answers." }, 400);
  const feedback = body.action === "complete" ? grade(lesson, answers) : null;
  if (body.action === "complete" && !feedback)
    return reply({ error: "Answer every knowledge-check question." }, 400);
  const score = feedback
    ? Math.round(
        (100 * feedback.filter((f) => f.correct).length) / feedback.length,
      )
    : null;
  const minimum = lesson.minimumWords ?? 60;
  const enoughWork = wordCount(body.response) >= minimum;
  const completed = Boolean(
    feedback && score === 100 && enoughWork && body.reviewed === true,
  );
  const row: Record<string, unknown> = {
    user_id: user.id,
    course_slug: course.slug,
    lesson_slug: lesson.slug,
    response: body.response,
    quiz_answers: answers,
    quiz_revision: quizRevision,
  };
  if (feedback) row.quiz_score = score;
  if (completed)
    row.completed_at = existing?.completed_at ?? new Date().toISOString();
  const { error } = await client
    .from("lesson_progress")
    .upsert(row, { onConflict: "user_id,course_slug,lesson_slug" });
  if (error)
    return reply(
      {
        error:
          "Your work could not be saved. Keep this page open and try again.",
      },
      500,
    );
  return reply({
    saved: true,
    completed: completed || Boolean(existing?.completed_at),
    feedback,
    score,
    message:
      body.action === "save"
        ? "Saved to your account."
        : completed
          ? "Lesson complete. Your work is saved."
          : !enoughWork
            ? `Your draft is saved. Write at least ${minimum} words, review it against the rubric, then retry.`
            : !body.reviewed
              ? "Your draft is saved. Review your work against the rubric and tick the self-review box."
              : "Your work is saved. Read the feedback and retry the questions to complete this lesson.",
  });
}
