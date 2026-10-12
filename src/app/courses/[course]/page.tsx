import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CourseArt from "@/components/learning/CourseArt";
import EnrollButton from "@/components/learning/EnrollButton";
import { findCourse, contentVersion } from "@/content/courses";
import { allLessons } from "@/lib/courses";
import { currentUser } from "@/lib/supabase/server";
import { learningData } from "@/lib/learning";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const c = findCourse((await params).course);
  return { title: c?.title ?? "Course", description: c?.description };
}
export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const course = findCourse((await params).course);
  if (!course) notFound();
  const user = await currentUser();
  const data = user
    ? await learningData(user.id)
    : { enrollments: [], progress: [] };
  const enrolled = data.enrollments.some((e) => e.course_slug === course.slug);
  const lessons = allLessons(course);
  const complete = new Set(
    data.progress
      .filter((p) => p.course_slug === course.slug && p.completed_at)
      .map((p) => p.lesson_slug),
  );
  const next = lessons.find((l) => !complete.has(l.slug)) ?? lessons[0];
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="container course-intro">
          <div>
            <Link href="/courses" className="breadcrumb">
              ← All courses
            </Link>
            <p className="label">Self-paced / {course.duration} / Free</p>
            <h1>{course.title}</h1>
            <p className="course-subtitle">{course.subtitle}</p>
            <p>{course.description}</p>
            <EnrollButton
              course={course.slug}
              signedIn={Boolean(user)}
              enrolled={enrolled}
              destination={`/courses/${course.slug}/${next.slug}`}
            />
            <Link
              href={`/courses/${course.slug}/${lessons[0].slug}`}
              className="text-link"
            >
              Preview the first lesson →
            </Link>
          </div>
          <CourseArt theme={course.theme} />
        </section>
        <section className="course-outcomes">
          <div className="container outcomes-grid">
            <div>
              <p className="label">Who it’s for</p>
              <p>{course.audience}</p>
            </div>
            <div>
              <p className="label">Before you begin</p>
              <p>{course.prerequisite}</p>
            </div>
            <div>
              <p className="label">What you’ll make</p>
              <p>{course.outcome}</p>
            </div>
          </div>
        </section>
        <section className="container curriculum">
          <div className="curriculum-heading">
            <p className="label">The full curriculum</p>
            <h2>
              Learn the method.
              <br />
              <em>Practise the judgment.</em>
            </h2>
            <p>
              Read, apply, check and reflect. Each lesson includes an exercise,
              worked answer and knowledge checks.
            </p>
            {enrolled && (
              <p className="progress-text">
                {complete.size} of {lessons.length} lessons completed
              </p>
            )}
            <p className="small-copy">
              Edition {contentVersion} · Duration includes reading and practice.
            </p>
          <a
              href={`/courses/${course.slug}/workbook`}
              className="text-link"
            download
            >
              Download exercise workbook ↓
          </a>
          </div>
          <div className="module-list">
            {course.modules.map((module, i) => (
              <details key={module.title} open className="module">
                <summary>
                  <span className="label">0{i + 1}</span>
                  <h3>{module.title}</h3>
                  <span aria-hidden="true">−</span>
                </summary>
                <ol>
                  {module.lessons.map((l) => (
                    <li key={l.slug}>
                      <Link href={`/courses/${course.slug}/${l.slug}`}>
                        <span>
                          {complete.has(l.slug) ? "✓ " : ""}
                          {l.title}
                        </span>
                        <span className="lesson-duration">
                          {l.minutes} min <span aria-hidden="true">↗</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
