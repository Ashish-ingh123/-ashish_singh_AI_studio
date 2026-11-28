import type { BadgeTone } from "@/components/badge";
import type { BuildStatus, ReleaseStatus } from "@/content/profile";

/** Badge tone for each build status: the more finished, the more accent. */
export const buildTone: Record<BuildStatus, BadgeTone> = {
  Built: "accent",
  "Partly built": "accent-outline",
  Designed: "muted",
  "Not started": "muted-outline",
};

export const releaseTone: Record<ReleaseStatus, BadgeTone> = {
  Built: "accent",
  "In progress": "accent-outline",
  Designed: "muted",
  Planned: "muted-outline",
};
