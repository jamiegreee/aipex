import type { MetadataRoute } from "next";
import { policyTools } from "@/content/policy-tools";
import { policyCases } from "@/content/policy-cases";
import { courses } from "@/content/courses";
import { caseLibraryEnabled, communityEnabled, coursesEnabled, gatheringsEnabled } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/charter",
    "/tools",
    ...policyTools.map(t => `/tools/${t.slug}`),
    ...(caseLibraryEnabled ? ["/cases", ...policyCases.map(c => `/cases/${c.slug}`)] : []),
    ...(communityEnabled ? ["/community"] : []),
    ...(gatheringsEnabled ? ["/gatherings"] : []),
    ...(coursesEnabled ? ["/courses", ...courses.map((c) => `/courses/${c.slug}`)] : []),
  ].map((path) => ({
    url: `https://theaipex.org${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
