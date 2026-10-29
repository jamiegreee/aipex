import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CourseArt from "@/components/learning/CourseArt";
import EnrollButton from "@/components/learning/EnrollButton";
import { courses } from "@/content/courses";
import { allLessons } from "@/lib/courses";
import { currentUser } from "@/lib/auth";
import { learningData } from "@/lib/learning";
import { signOut } from "@/app/auth/actions";
import { coursesEnabled } from "@/lib/site";
export const metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  if (!coursesEnabled) redirect("/tools");
  const user = await currentUser();
  if (!user) redirect("/login?next=/learn");
  const data = await learningData(user.id);
  const params = await searchParams;
  const totalCompleted = data.progress.filter((p) => p.completed_at).length;
  const name =
    typeof user.name === "string"
      ? user.name.trim().slice(0, 80)
      : "";
  return (
    <>
      <Navigation />
      <main id="main" className="container learning-dashboard">
        <header className="dashboard-header">
          <div>
            <p className="label">Your learning space</p>
            <h1>
              {name ? (
                <>
                  Keep going, <em>{name}.</em>
                </>
              ) : (
                <>
                  Make it <em>your practice.</em>
                </>
              )}
            </h1>
            <p>Your course progress and written work, saved in one place.</p>
          </div>
          <div className="account-controls">
            <p>{user.email}</p>
            <form action={signOut}>
              <button className="text-link" type="submit">
                Sign out →
              </button>
            </form>
          </div>
        </header>
        {params.password === "updated" && (
          <p className="form-success" role="status">
            Your password has been updated.
          </p>
        )}
        <div className="dashboard-stats">
          <div>
            <strong>{data.enrollments.length}</strong>
            <span>Courses started</span>
          </div>
          <div>
            <strong>{totalCompleted}</strong>
            <span>Lessons completed</span>
          </div>
          <div>
            <strong>
              {data.progress.filter((p) => p.response.trim()).length}
            </strong>
            <span>Exercises saved</span>
          </div>
        </div>
        <div className="dashboard-courses">
          {courses.map((course) => {
            const lessons = allLessons(course);
            const enrolled = data.enrollments.some(
              (e) => e.course_slug === course.slug,
            );
            const complete = new Set(
              data.progress
                .filter((p) => p.course_slug === course.slug && p.completed_at)
                .map((p) => p.lesson_slug),
            );
            const next =
              lessons.find((l) => !complete.has(l.slug)) ?? lessons[0];
            const pct = Math.round((100 * complete.size) / lessons.length);
            return (
              <article key={course.slug} className="dashboard-course">
                <CourseArt theme={course.theme} compact />
                <div>
                  <p className="label">
                    {enrolled
                      ? pct === 100
                        ? "✓ Course complete"
                        : "In progress"
                      : "Ready when you are"}{" "}
                    / {course.duration}
                  </p>
                  <h2>
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                  </h2>
                  <p>{course.subtitle}</p>
                  {enrolled && (
                    <>
                      <div
                        className="progress-track"
                        role="progressbar"
                        aria-label={`${course.title} progress`}
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <span style={{ width: `${pct}%` }} />
                      </div>
                      <p className="small-copy">
                        {complete.size} / {lessons.length} complete · {pct}%
                      </p>
                    </>
                  )}
                  <EnrollButton
                    course={course.slug}
                    signedIn
                    enrolled={enrolled}
                    destination={`/courses/${course.slug}/${next.slug}`}
                  />
                  {enrolled && (
                  <a
                      href={`/learn/portfolio?course=${course.slug}`}
                      className="text-link"
                    download
                    >
                      Download your portfolio ↓
                  </a>
                  )}
                  {pct === 100 && (
                    <p className="completion-note">
                      You’ve completed all lessons and checks. Your written work
                      was self-assessed; this is a learning record rather than
                      an accredited qualification. Revisit lessons whenever you
                      like.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <section className="saved-work">
          <div>
            <p className="label">Your working portfolio</p>
            <h2>
              Ideas worth
              <br />
              <em>coming back to.</em>
            </h2>
            <p>
              Drafts are saved when you choose Save draft or Check answers &
              complete. Open an exercise to keep developing your answer.
            </p>
          </div>
          <div>
            {data.progress.filter((p) => p.response.trim()).length === 0 ? (
              <p className="empty-work">
                Your first saved exercise will appear here. Start a lesson,
                write your response and save your draft.
              </p>
            ) : (
              <ul>
                {[...data.progress]
                  .filter((p) => p.response.trim())
                  .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
                  .map((p) => {
                    const course = courses.find(
                      (c) => c.slug === p.course_slug,
                    );
                    const lesson =
                      course &&
                      allLessons(course).find((l) => l.slug === p.lesson_slug);
                    if (!course || !lesson) return null;
                    return (
                      <li key={`${p.course_slug}/${p.lesson_slug}`}>
                        <Link
                          href={`/courses/${p.course_slug}/${p.lesson_slug}#practice-heading`}
                        >
                          <span className="label">
                            {course.title} ·{" "}
                            {p.completed_at ? "Complete" : "Draft"}
                          </span>
                          <h3>{lesson.title}</h3>
                          <p>
                            {p.response.slice(0, 160)}
                            {p.response.length > 160 ? "…" : ""}
                          </p>
                          <span className="small-copy">
                            Saved{" "}
                            {new Date(p.updated_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                timeZone: "Europe/London",
                              },
                            )}{" "}
                            ↗
                          </span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
