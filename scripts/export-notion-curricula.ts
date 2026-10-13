import { writeFileSync } from "node:fs";
import { courses, contentVersion } from "../src/content/courses";
import { allLessons } from "../src/lib/courses";

const destination = process.argv[2];
if (!destination) throw new Error("Provide a JSON output path");
const indent = (text: string) =>
  text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => "\t" + line)
    .join("\n");
const notionText = (text: string) =>
  text
    .replace(/^#{2,4} (.+)$/gm, "**$1**")
    .replace(/(?:^\|[^\n]+\|\n?)+/gm, (block) => {
      const rows = block
        .trim()
        .split("\n")
        .filter((line) => !/^\|[\s:|\-]+\|$/.test(line));
      return (
        '<table fit-page-width="true" header-row="true">\n' +
        rows
          .map(
            (row) =>
              "\t<tr>\n" +
              row
                .slice(1, -1)
                .split("|")
                .map(
                  (cell) =>
                    "\t\t<td>" +
                    cell
                      .trim()
                      .replaceAll("&", "&amp;")
                      .replaceAll("<", "&lt;")
                      .replaceAll(">", "&gt;") +
                    "</td>",
                )
                .join("\n") +
              "\n\t</tr>",
          )
          .join("\n") +
        "\n</table>\n"
      );
    });
const docs = courses.map((course) => {
  const chunks = [
    `## Course overview\n[Open the live course](https://theaipex.org/courses/${course.slug})\n**Edition:** ${contentVersion}. Sources checked <mention-date start="2026-10-13"/>.\n**Duration:** ${course.duration}. Free, online and self-paced; estimates include selected readings, case exercises and the capstone, and have not yet been validated with learners.\n${course.description}\n**Audience:** ${course.audience}\n**Prerequisite:** ${course.prerequisite}\n**Outcome:** ${course.outcome}`,
    `## Teaching and source policy\nOriginal AIPEX teaching connects to external government/regulator guidance, international frameworks, independent accountability research and academic papers. These have different authority and scope; citations do not imply endorsement or establish that the fictional intervention works. Read the selected sections rather than every publication in full.\nAll case packets are invented learning material. Keep final-case observations, illustrative planning assumptions and unresolved questions separate. UK-led cases teach practical methods, not a comprehensive world-policy survey; replace institutional/legal assumptions for another jurisdiction.`,
    `## Quality review\nReviewed <mention-date start="2026-10-13"/>. All 24 lessons across the two courses now have concrete evidence packets, stronger scenario checks and expanded worked answers. Sources were checked against the methods and claims they support.\nThe ICO's March 2026 automated-decision guidance remains labelled draft; DPIA guidance is under DUAA review. Older AI Playbook legal wording is not used as current law. ATRS has defined mandatory scope; local-government adoption is recommended. Documentation frameworks are not deployment certification.\n[Read the complete claim-to-source review](https://github.com/jamiegreee/aipex/blob/main/docs/course-quality-review.md)`,
    `## Completion and assessment\nEach lesson has two checks, a written exercise and a self-review rubric. Both checks must be correct, the minimum response length met and self-review completed. The minimum is a participation check; aim for the exercise's requested scope and length. Written work is self-assessed. Worked answers are examples, not mandatory conclusions. No accreditation or external professional assessment is claimed. Revised question editions preserve written work and prior completion without preselecting answers from superseded questions.`,
    "## Full curriculum",
  ];
  let n = 0;
  for (const [m, module] of course.modules.entries()) {
    chunks.push(`## Module ${m + 1}: ${module.title}`);
    for (const lesson of module.lessons) {
      n++;
      const sections = [
        `**Lesson ${n} of 12 · ${lesson.minutes} minutes including practice**\n[Live lesson](https://theaipex.org/courses/${course.slug}/${lesson.slug})`,
        "**Learning objectives**\n" +
          lesson.objectives.map((t) => "- " + t).join("\n"),
        "**Teaching**\n" + notionText(lesson.body),
        "**Written exercise**\n" +
          lesson.exercise +
          `\n**Minimum for completion:** ${lesson.minimumWords ?? 60} words.`,
        "**Self-review rubric**\n" +
          lesson.rubric.map((t) => "- " + t).join("\n"),
        "**Worked answer**\n" + notionText(lesson.modelAnswer),
        "**Knowledge checks**",
      ];
      lesson.questions.forEach((q, i) =>
        sections.push(
          `**Question ${i + 1}: ${q.prompt}**\n${q.options.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}`).join("\n")}\n**Correct answer:** ${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}\n**Explanation:** ${q.explanation}`,
        ),
      );
      if (lesson.videos?.length)
        sections.push(
          "**Optional video**\n" +
            lesson.videos
              .map(
                (v) =>
                  `[${v.title}](${v.url}) · ${v.duration}\n${v.focus}\n**Apply:** ${v.task}\n${v.accessibility}\n[Read instead: ${v.textAlternative.title}](${v.textAlternative.url})`,
              )
              .join("\n"),
        );
      sections.push(
        "**Guided reading**\n" +
          lesson.resources
            .map((r) => `- [${r.title}](${r.url})\n\t${r.guidance}`)
            .join("\n"),
      );
      chunks.push(
        `### Lesson ${n}: ${lesson.title} {toggle="true"}\n${indent(sections.join("\n\n"))}`,
      );
    }
  }
  const refs = [
    ...new Map(
      allLessons(course).flatMap((l) =>
        l.resources.map((r) => [r.url, r] as const),
      ),
    ).values(),
  ];
  chunks.push(
    "## Source index\n" +
      refs.map((r) => `- [${r.title}](${r.url})`).join("\n"),
  );
  return {
    slug: course.slug,
    title: course.title + " — Full Curriculum",
    content: chunks.join("\n\n"),
  };
});
writeFileSync(destination, JSON.stringify(docs));
console.log(
  JSON.stringify(
    docs.map(({ content, ...meta }) => ({
      ...meta,
      characters: content.length,
    })),
  ),
);
writeFileSync(
  "docs/course-sources.md",
  [
    "# AIPEX course sources",
    "Reviewed 13 October 2026. Every lesson links its teaching method to multiple annotated external readings. See [the claim-to-source quality review](course-quality-review.md) for the support, scope and limitations checked. The case packets and operational thresholds are AIPEX fictional teaching assumptions, not findings or prescribed requirements from the publications. ICO ADM guidance is labelled draft and DPIA guidance is under review; the course distinguishes these from older Playbook legal wording. Selected readings are included in the workload; reading all publications in full is not required.",
    ...courses.flatMap((c) => [
      "## " + c.title,
      ...allLessons(c).flatMap((l) => [
        "### " + l.title,
        ...l.resources.map((r) => `- [${r.title}](${r.url}): ${r.guidance}`),
        ...(l.videos ?? []).map(
          (v) =>
            `- Optional video: [${v.title}](${v.url}) (${v.duration}). ${v.focus} ${v.task} ${v.accessibility}`,
        ),
      ]),
    ]),
  ].join("\n\n") + "\n",
);
