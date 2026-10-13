import type { MetadataRoute } from "next";
import { courses } from "@/content/courses";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/community",
    "/gatherings",
    "/courses",
    ...courses.map((c) => `/courses/${c.slug}`),
  ].map((path) => ({
    url: `https://theaipex.org${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
