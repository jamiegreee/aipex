import { findCourse, contentVersion } from "@/content/courses";
import { allLessons } from "@/lib/courses";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ course: string }> },
) {
  const course = findCourse((await params).course);
  if (!course) return new Response("Course not found", { status: 404 });
  const text = [
    `# ${course.title} — Exercise workbook`,
    `AIPEX | Edition ${contentVersion}`,
    course.outcome,
    "Use fictional or anonymised examples. Course checks and saved progress are available at https://theaipex.org/courses/" +
      course.slug,
    ...allLessons(course).flatMap((l) => [
      `## ${l.title}`,
      l.exercise,
      "### Review criteria\n" + l.rubric.map((x) => "- " + x).join("\n"),
      "### Guided reading\n" +
        l.resources
          .map(
            (r) =>
              `- [${r.title}](${r.url}) — ${r.guidance ?? "Read alongside the exercise."}`,
          )
          .join("\n"),
      "### Your answer\n\n[Write your response here]",
    ]),
  ].join("\n\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${course.slug}-workbook.md"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
