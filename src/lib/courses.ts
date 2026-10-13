export type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type Lesson = {
  slug: string;
  title: string;
  minutes: number;
  objectives: string[];
  body: string;
  exercise: string;
  rubric: string[];
  modelAnswer: string;
  questions: Question[];
  resources: { title: string; url: string; guidance?: string }[];
  minimumWords?: number;
};
export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  audience: string;
  prerequisite: string;
  outcome: string;
  theme: "blue" | "pink";
  modules: { title: string; lessons: Lesson[] }[];
};
export const allLessons = (course: Course) =>
  course.modules.flatMap((m) => m.lessons);
export const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;
export function grade(lesson: Lesson, answers: unknown) {
  if (
    !Array.isArray(answers) ||
    answers.length !== lesson.questions.length ||
    answers.some(
      (a, i) =>
        !Number.isInteger(a) ||
        a < 0 ||
        a >= lesson.questions[i].options.length,
    )
  )
    return null;
  return lesson.questions.map((q, i) => ({
    correct: answers[i] === q.answer,
    answer: q.answer,
    explanation: q.explanation,
  }));
}
export function safeNext(value: unknown, fallback = "/learn") {
  return typeof value === "string" &&
    /^\/(?!\/)/.test(value) &&
    !/[\\\u0000-\u0020\u007f]/.test(value)
    ? value
    : fallback;
}
