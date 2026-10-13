import { policy } from "./policy";
import { services } from "./services";
import { withSourceNotes } from "./source-notes";
export const courses = [policy, services].map(withSourceNotes);
export const findCourse = (slug: string) =>
  courses.find((c) => c.slug === slug);
export const contentVersion = "2026-10-13 · reviewed edition";
export const quizRevision = "2026-10-13-reviewed";
