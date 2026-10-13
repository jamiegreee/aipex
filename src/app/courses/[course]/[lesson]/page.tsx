import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CourseMarkdown from "@/components/learning/CourseMarkdown";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnrollButton from "@/components/learning/EnrollButton";
import LessonPractice from "@/components/learning/LessonPractice";
import ReaderOutline from "@/components/learning/ReaderOutline";
import { findCourse, quizRevision } from "@/content/courses";
import { allLessons } from "@/lib/courses";
import { answersForRevision } from "@/lib/course-revision";
import { currentUser } from "@/lib/auth";
import { learningData } from "@/lib/learning";
type Params = { course: string; lesson: string };
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const p = await params;
  const c = findCourse(p.course);
  const l = c && allLessons(c).find((x) => x.slug === p.lesson);
  return {
    title: l ? `${l.title} · ${c?.title}` : "Lesson",
    robots: { index: false, follow: true },
  };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const p = await params;
  const course = findCourse(p.course);
  if (!course) notFound();
  const lessons = allLessons(course);
  const index = lessons.findIndex((l) => l.slug === p.lesson);
  if (index < 0) notFound();
  const lesson = lessons[index];
  const user = await currentUser();
  if (!user && index > 0)
    redirect(
      `/signup?next=${encodeURIComponent(`/courses/${course.slug}/${lesson.slug}`)}`,
    );
  const data = user
    ? await learningData(user.id)
    : { enrollments: [], progress: [] };
  const enrolled = data.enrollments.some((e) => e.course_slug === course.slug);
  const progress = data.progress.filter((x) => x.course_slug === course.slug);
  const saved = progress.find((x) => x.lesson_slug === lesson.slug);
  const completed = new Set(
    progress.filter((x) => x.completed_at).map((x) => x.lesson_slug),
  );
  const pct = Math.round((100 * completed.size) / lessons.length);
  return (
    <>
      <Navigation />
      <main id="main" className="container lesson-layout">
        <aside className="lesson-sidebar">
          <Link className="breadcrumb" href={`/courses/${course.slug}`}>
            ← Course overview
          </Link>
          <h2>{course.title}</h2>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Course progress"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="small-copy">
            {completed.size} / {lessons.length} lessons complete
          </p>
          <ReaderOutline>
            {course.modules.map((m, mi) => (
              <div key={m.title}>
                <p className="label">
                  0{mi + 1} / {m.title}
                </p>
                <ol>
                  {m.lessons.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/courses/${course.slug}/${l.slug}`}
                        aria-current={
                          l.slug === lesson.slug ? "page" : undefined
                        }
                      >
                        <span
                          className="lesson-indicator"
                          aria-label={
                            completed.has(l.slug) ? "Completed" : "Not complete"
                          }
                        >
                          {completed.has(l.slug) ? "✓" : "○"}
                        </span>
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </ReaderOutline>
          <Link href="/learn" className="text-link">
            My learning →
          </Link>
        </aside>
        <article className="lesson-reader">
          <header className="lesson-header">
            <p className="label">
              Lesson {String(index + 1).padStart(2, "0")} / {lessons.length} ·{" "}
              {lesson.minutes} min including practice
            </p>
            <h1>{lesson.title}</h1>
            <ul className="lesson-objectives">
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </header>
          <div className="lesson-prose">
            <CourseMarkdown>{lesson.body}</CourseMarkdown>
          </div>
          {enrolled ? (
            <LessonPractice
              key={`${lesson.slug}:${quizRevision}`}
              course={course.slug}
              lesson={lesson.slug}
              exercise={lesson.exercise}
              rubric={lesson.rubric}
              minimum={lesson.minimumWords ?? 60}
              questions={lesson.questions.map((q) => ({
                prompt: q.prompt,
                options: q.options,
              }))}
              savedResponse={saved?.response ?? ""}
              savedAnswers={answersForRevision(saved, quizRevision)}
              quizRevision={quizRevision}
              revisedChecks={Boolean(
                saved && saved.quiz_revision !== quizRevision,
              )}
              initiallyComplete={Boolean(saved?.completed_at)}
            />
          ) : (
            <section className="practice preview-practice">
              <p className="label">Your first exercise</p>
              <h2>Try the method.</h2>
              <p>{lesson.exercise}</p>
              <h3>Review criteria</h3>
              <ul>
                {lesson.rubric.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Create an account and enrol free to save your answer, take the
                checks and track your progress.
              </p>
              <EnrollButton
                course={course.slug}
                destination={`/courses/${course.slug}/${lesson.slug}`}
                signedIn={Boolean(user)}
                enrolled={false}
              />
            </section>
          )}
          <details className="worked-answer">
            <summary>
              Compare with a worked answer <span aria-hidden="true">+</span>
            </summary>
            <div className="lesson-prose">
              <CourseMarkdown>{lesson.modelAnswer}</CourseMarkdown>
            </div>
            <p className="small-copy">
              This is one defensible approach. Different recommendations can be
              sound if your reasoning, evidence and conditions support them.
            </p>
          </details>
          {lesson.videos?.length ? (
            <section
              className="lesson-resources lesson-videos"
              aria-labelledby="video-heading"
            >
              <p className="label">Optional video</p>
              <h2 id="video-heading">Watch, then apply.</h2>
              {lesson.videos.map((video) => (
                <div key={video.url}>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    {video.title} ↗
                  </a>
                  <p className="small-copy">
                    {video.duration} · {video.accessibility}
                  </p>
                  <p>{video.focus}</p>
                  <p>
                    <strong>Try this:</strong> {video.task}
                  </p>
                  <a
                    href={video.textAlternative.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read instead: {video.textAlternative.title} ↗
                  </a>
                </div>
              ))}
            </section>
          ) : null}
          <section className="lesson-resources">
            <p className="label">Guided reading</p>
            <ul>
              {lesson.resources.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.title} ↗
                  </a>
                  {r.guidance && <p className="small-copy">{r.guidance}</p>}
                </li>
              ))}
            </ul>
            <p className="small-copy">
              Selected sections of external guidance and research. These are
              reading tasks, not additional completion checks. Frameworks,
              research and legal requirements have different authority; check
              current guidance and its scope for a real decision.
            </p>
          </section>
          <nav className="lesson-pagination" aria-label="Lesson navigation">
            {index > 0 ? (
              <Link href={`/courses/${course.slug}/${lessons[index - 1].slug}`}>
                ← Previous lesson
              </Link>
            ) : (
              <Link href={`/courses/${course.slug}`}>← Course overview</Link>
            )}
            {index < lessons.length - 1 ? (
              <Link href={`/courses/${course.slug}/${lessons[index + 1].slug}`}>
                Next lesson →
              </Link>
            ) : (
              <Link href="/learn">Review your learning →</Link>
            )}
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
