import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import { learningData } from "@/lib/learning";
import { courses, contentVersion } from "@/content/courses";
import { allLessons } from "@/lib/courses";
import { siteUrl } from "@/lib/site-url";
import { coursesEnabled } from "@/lib/site";
import { notFound } from "next/navigation";
export async function GET(request: NextRequest) {
  if (!coursesEnabled) notFound();
  const user = await currentUser();
  if (!user)
    return NextResponse.redirect(new URL("/login?next=/learn", siteUrl()));
  const requested = request.nextUrl.searchParams.get("course");
  const selected = courses.filter((c) => !requested || c.slug === requested);
  if (!selected.length)
    return new NextResponse("Course not found", { status: 404 });
  const data = await learningData(user.id);
  const text = [
    `# AIPEX — Your learning portfolio`,
    `Course edition: ${contentVersion}. Exported ${new Date().toISOString().slice(0, 10)}.`,
    "Written exercises are self-assessed. This portfolio is not an accredited qualification.",
    ...selected.flatMap((c) => [
      `## ${c.title}`,
      ...allLessons(c).flatMap((l) => {
        const p = data.progress.find(
          (x) => x.course_slug === c.slug && x.lesson_slug === l.slug,
        );
        return [
          `### ${l.title}`,
          `Status: ${p?.completed_at ? "Completed" : p?.response ? "Draft" : "Not started"}`,
          `Exercise: ${l.exercise}`,
          p?.response || "No saved response.",
        ];
      }),
    ]),
  ].join("\n\n");
  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="aipex-${requested || "learning"}-portfolio.md"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
