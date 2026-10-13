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
      "### Teaching and case materials\n" +
        l.body.replace(/^##(#+)? /gm, (_, deeper) => `####${deeper ?? ""} `),
      "### Exercise\n" + l.exercise,
      "### Review criteria\n" + l.rubric.map((x) => "- " + x).join("\n"),
      "### Guided reading\n" +
        l.resources
          .map(
            (r) =>
              `- [${r.title}](${r.url}) — ${r.guidance ?? "Read alongside the exercise."}`,
          )
          .join("\n"),
      ...(l.videos ?? []).map(
        (v) =>
          `### Optional video\n[${v.title}](${v.url}) · ${v.duration}\n${v.focus}\n${v.task}\n${v.accessibility}\n[Reading alternative](${v.textAlternative.url})`,
      ),
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
