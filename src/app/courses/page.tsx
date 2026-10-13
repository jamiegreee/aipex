import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CourseArt from "@/components/learning/CourseArt";
import { courses, contentVersion } from "@/content/courses";
import { allLessons } from "@/lib/courses";
export const metadata = {
  title: "AI policy courses",
  description:
    "Free, self-paced courses in practical AI policy and governing AI in public services. Full lessons, exercises and saved progress.",
};
export default function Courses() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="container learning-hero">
          <p className="label">
            <span className="status-dot" /> AIPEX / Education
          </p>
          <h1>
            Understand the landscape.
            <br />
            <em>Build the capacity to act.</em>
          </h1>
          <div className="learning-hero-bottom">
            <p>
              Practical courses for people shaping AI policy. Move from
              understanding the debate to making decisions, designing
              interventions and governing real services.
            </p>
            <div className="learning-facts">
              <span>Free & self-paced</span>
              <span>Original AIPEX curriculum</span>
              <span>UK context · transferable skills</span>
            </div>
          </div>
        </section>
        <section
          className="container course-catalog"
          aria-label="Available courses"
        >
          {courses.map((course, index) => (
            <article key={course.slug} className="course-feature">
              <Link
                href={`/courses/${course.slug}`}
                aria-label={`Explore ${course.title}`}
              >
                <CourseArt theme={course.theme} />
              </Link>
              <div className="course-feature-copy">
                <p className="label">
                  Course 0{index + 1} / {course.duration}
                </p>
                <h2>
                  <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                </h2>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>6 modules</span>
                  <span>{allLessons(course).length} lessons</span>
                  <span>Applied capstone</span>
                </div>
                <Link className="button" href={`/courses/${course.slug}`}>
                  Explore the course <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>
        <section className="learning-method">
          <div className="container">
            <p className="label">How you learn</p>
            <div className="method-grid">
              <div>
                <span className="method-number">01</span>
                <h2>Understand.</h2>
                <p>
                  Clear lessons grounded in policy craft and public-service
                  practice. No coding required.
                </p>
              </div>
              <div>
                <span className="method-number">02</span>
                <h2>Try it yourself.</h2>
                <p>
                  Work through a fictional case. Compare your answer with a
                  rubric and worked example.
                </p>
              </div>
              <div>
                <span className="method-number">03</span>
                <h2>Keep the work.</h2>
                <p>
                  Save exercises, pass knowledge checks and build a downloadable
                  portfolio in your account.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container learning-faq">
          <div>
            <p className="label">Before you start</p>
            <h2>
              A little more
              <br />
              <em>about the courses.</em>
            </h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Which course should I take first?</summary>
              <p>
                Start with AI Policy in Practice for policy development across a
                whole decision cycle. Choose Governing AI in Public Services if
                you work on deployment, commissioning or scrutiny. You can take
                either independently.
              </p>
            </details>
            <details>
              <summary>Is this an introduction to AI?</summary>
              <p>
                We assume basic familiarity with AI and the policy debate. These
                courses focus on applying policy skills. They are independently
                developed by AIPEX and are not affiliated with BlueDot or an
                accreditation body.
              </p>
            </details>
            <details>
              <summary>How does completion work?</summary>
              <p>
                Read each lesson, write the exercise, review it against the
                rubric and pass the knowledge checks. Written work is
                self-assessed. Completion is a learning record, not a formal
                qualification.
              </p>
            </details>
            <details>
              <summary>Do I need to attend live sessions?</summary>
              <p>
                No. Everything is available online and self-paced. Create a free
                account to save progress and work across devices.
              </p>
            </details>
            <details>
              <summary>How current is the content?</summary>
              <p>
                Course edition: {contentVersion}. Lessons teach policy methods
                and use fictional cases. Official guidance is linked for further
                reading; check current requirements and use relevant specialist
                advice for a real decision.
              </p>
            </details>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
