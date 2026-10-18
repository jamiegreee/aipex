import type { MetadataRoute } from "next";
import { courses } from "@/content/courses";
import { communityEnabled, gatheringsEnabled } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/charter",
    ...(communityEnabled ? ["/community"] : []),
    ...(gatheringsEnabled ? ["/gatherings"] : []),
    "/courses",
    ...courses.map((c) => `/courses/${c.slug}`),
  ].map((path) => ({
    url: `https://theaipex.org${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
