import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CourseMarkdown from "../src/components/learning/CourseMarkdown";
import { answersForRevision } from "../src/lib/course-revision";
import test from "node:test";
import { courses, quizRevision } from "../src/content/courses";
import { allLessons, grade, safeNext, wordCount } from "../src/lib/courses";

test("both complete curricula have teaching, practice, checks and a capstone", () => {
  assert.equal(courses.length, 2);
  assert.equal(new Set(courses.map((c) => c.slug)).size, 2);
  for (const course of courses) {
    assert.equal(course.modules.length, 6);
    const lessons = allLessons(course);
    assert.equal(lessons.length, 12);
    assert.equal(new Set(lessons.map((l) => l.slug)).size, 12);
    for (const lesson of lessons) {
      assert.ok(
        wordCount(lesson.body) >= 250,
        `${lesson.slug} needs substantive teaching`,
      );
      assert.ok(lesson.objectives.length >= 2);
      assert.ok(lesson.rubric.length >= 4);
      assert.ok(
        wordCount(lesson.modelAnswer) >= 60,
        `${lesson.slug} needs a worked answer`,
      );
      assert.equal(lesson.questions.length, 2);
      for (const q of lesson.questions) {
        assert.ok(q.answer >= 0 && q.answer < q.options.length);
        assert.equal(new Set(q.options).size, q.options.length);
        assert.ok(q.explanation.length > 40);
      }
      assert.ok(
        lesson.resources.length >= 2,
        `${lesson.slug} needs multiple external perspectives`,
      );
      assert.ok(lesson.resources.every((r) => r.url.startsWith("https://")));
      assert.equal(
        new Set(lesson.resources.map((r) => r.url)).size,
        lesson.resources.length,
      );
      for (const source of lesson.resources) {
        assert.ok(!new URL(source.url).hostname.endsWith("theaipex.org"));
        assert.ok(
          source.guidance && source.guidance.length > 40,
          `${lesson.slug} needs a specific reading task`,
        );
        assert.ok(
          lesson.body.includes(source.url),
          `${lesson.slug} must connect its sources to the teaching`,
        );
      }
    }
    assert.ok(lessons.at(-1)!.slug.startsWith("capstone-"));
    assert.ok(lessons.at(-1)!.minimumWords! >= 300);
    const hosts = new Set(
      lessons.flatMap((l) => l.resources.map((r) => new URL(r.url).hostname)),
    );
    assert.ok(
      hosts.size >= 4,
      `${course.slug} needs sources beyond a single publisher`,
    );
    assert.ok(
      hosts.has("arxiv.org"),
      `${course.slug} needs relevant original research`,
    );
    assert.ok(
      hosts.has("www.adalovelaceinstitute.org"),
      `${course.slug} needs an independent accountability perspective`,
    );
  }
});
test("grading rejects incomplete, malformed and out-of-range answers", () => {
  const lesson = allLessons(courses[0])[0];
  for (const input of [
    null,
    {},
    [],
    [0],
    [-1, 0],
    [0, 99],
    ["1", 1],
    [1.1, 1],
    [1, 1, 1],
  ])
    assert.equal(grade(lesson, input), null);
  assert.ok(
    grade(
      lesson,
      lesson.questions.map((q) => q.answer),
    )!.every((f) => f.correct),
  );
  assert.ok(
    grade(
      lesson,
      lesson.questions.map((q) => (q.answer + 1) % q.options.length),
    )!.every((f) => !f.correct),
  );
});
test("post-login destinations cannot redirect to an external origin", () => {
  for (const input of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/\nevil",
    "/\t/evil.example",
    "/ /evil.example",
    null,
    1,
  ])
    assert.equal(safeNext(input), "/learn");
  assert.equal(
    safeNext("/courses/ai-policy-in-practice"),
    "/courses/ai-policy-in-practice",
  );
  assert.equal(wordCount(" \n one  two\tthree "), 3);
  assert.equal(wordCount(""), 0);
});

test("changed question editions preserve work without reinterpreting old option indexes", () => {
  const saved = {
    quiz_revision: "2026-10-13-initial",
    quiz_answers: [1, 1],
    response: "My saved work",
    completed_at: "2026-10-13T12:00:00Z",
  };
  const before = structuredClone(saved);
  assert.deepEqual(answersForRevision(saved, quizRevision), []);
  assert.deepEqual(saved, before);
  assert.deepEqual(
    answersForRevision({ ...saved, quiz_revision: quizRevision }, quizRevision),
    [1, 1],
  );
  assert.deepEqual(answersForRevision(undefined, quizRevision), []);
  assert.deepEqual(
    answersForRevision({ quiz_answers: [1, 1] }, quizRevision),
    [],
  );
});

test("all revised checks grade, and the capstone examples meet the requested length", () => {
  for (const course of courses) {
    for (const lesson of allLessons(course)) {
      assert.ok(
        grade(
          lesson,
          lesson.questions.map((q) => q.answer),
        )!.every((f) => f.correct),
      );
      assert.ok(
        grade(
          lesson,
          lesson.questions.map((q) => (q.answer + 1) % q.options.length),
        )!.every((f) => !f.correct),
      );
    }
    const capstone = allLessons(course).at(-1)!;
    const words = wordCount(capstone.modelAnswer);
    assert.ok(
      words >= (course.slug === "ai-policy-in-practice" ? 600 : 500),
      `${capstone.slug} example too short: ${words}`,
    );
    assert.ok(
      words <= (course.slug === "ai-policy-in-practice" ? 900 : 800),
      `${capstone.slug} example too long: ${words}`,
    );
  }
});

test("case tables render as accessible tables in teaching and worked answers", () => {
  let tableLessons = 0;
  for (const course of courses)
    for (const lesson of allLessons(course)) {
      for (const text of [lesson.body, lesson.modelAnswer]) {
        const html = renderToStaticMarkup(
          createElement(CourseMarkdown, null, text),
        );
        if (/^\|.*\|$/m.test(text)) {
          tableLessons++;
          assert.match(html, /<table>/);
          assert.match(html, /<th>/);
          assert.match(
            html,
            /role="region" aria-label="Case evidence table" tabindex="0"/,
          );
        }
      }
    }
  assert.ok(tableLessons >= 10);
});
