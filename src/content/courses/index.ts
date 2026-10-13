import { policy } from "./policy";
import { services } from "./services";
export const courses = [policy, services];
export const findCourse = (slug: string) =>
  courses.find((c) => c.slug === slug);
export const contentVersion = "2026-10-13";
