import "server-only";
import { createClient } from "./database";
export type Progress = {
  course_slug: string;
  lesson_slug: string;
  response: string;
  quiz_answers: number[];
  quiz_revision: string;
  quiz_score: number | null;
  completed_at: string | null;
  updated_at: string;
};
export async function learningData(userId: string) {
  const client = await createClient();
  const [enrollments, progress] = await Promise.all([
    client
      .from("course_enrollments")
      .select("course_slug, created_at")
      .eq("user_id", userId),
    client
      .from("lesson_progress")
      .select(
        "course_slug, lesson_slug, response, quiz_answers, quiz_revision, quiz_score, completed_at, updated_at",
      )
      .eq("user_id", userId),
  ]);
  if (enrollments.error || progress.error)
    throw new Error(
      "Your learning record could not be loaded. Please try again.",
    );
  return {
    enrollments: enrollments.data ?? [],
    progress: (progress.data ?? []) as Progress[],
  };
}
