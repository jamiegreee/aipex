import assert from "node:assert/strict";
import test from "node:test";
import { courses } from "../src/content/courses";
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
      assert.ok(lesson.resources.length > 0);
      assert.ok(lesson.resources.every((r) => r.url.startsWith("https://")));
    }
    assert.ok(lessons.at(-1)!.slug.startsWith("capstone-"));
    assert.ok(lessons.at(-1)!.minimumWords! >= 300);
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
