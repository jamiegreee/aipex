import type { LessonVideo } from "@/lib/courses";
import { resources } from "./resources";

// NIST player and full English transcript reviewed 13 October 2026.
// Link to the publisher's player; no third-party embed loads on lesson pages.
const nist: Omit<LessonVideo, "focus" | "task"> = {
  title: "NIST: Introduction to the AI Risk Management Framework (2023)",
  url: "https://www.nist.gov/video/introduction-nist-ai-risk-management-framework-ai-rmf-10-explainer-video",
  duration: "6 min 31 sec",
  accessibility:
    "English captions and Show Transcript in the publisher’s player. Reading alternative below.",
  textAlternative: { title: "NIST AI RMF Core", url: resources.nist.url },
};
export const lessonVideos: Record<string, LessonVideo[]> = {
  "institutions-and-authority": [
    {
      ...nist,
      focus:
        "Use 00:53–01:25 for the framework’s voluntary scope, then 03:33–04:05 for GOVERN, MAP, MEASURE and MANAGE. The recording introduces the 2023 framework; its future-work statements are historical, not a current law or organisation update.",
      task: "Give one Northbridge action an owner under each function. Then name the separate instrument or agreement needed for that actor to act. Which proposed action remains outside Northbridge’s authority?",
    },
  ],
  "start-with-the-service": [
    {
      ...nist,
      focus:
        "Watch the overview, especially 02:05–02:37 on the people involved and 03:33–04:05 on the four functions. Use it to broaden Eastmere’s system map beyond the model. The recording is an introduction, not evidence that a particular deployment is safe.",
      task: "Map the service owner to GOVERN, residents and the workflow to MAP, task and reviewer tests to MEASURE, and pause/fallback decisions to MANAGE. Name one resident need the supplier’s demo does not address.",
    },
  ],
};
