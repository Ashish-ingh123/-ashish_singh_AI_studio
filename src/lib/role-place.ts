import { profile, type Experience } from "@/content/profile";

export type RolePlace = {
  /** The small word between the role and the place: "at" or "in". */
  joiner: string;
  /** The company, or the job's location when it names no company. */
  name: string;
  /** True when name is the job's location. */
  isLocation: boolean;
};

/**
 * What follows a job's role on the page: "at" and the company when the entry names one,
 * otherwise "in" and the job's location. A job without a company keeps its employer
 * private. The hero's "currently" line and the Experience header both use this, so the
 * two can never disagree.
 */
export function rolePlace(job: Experience): RolePlace {
  if (job.company) {
    return {
      joiner: profile.roleJoiners.company,
      name: job.company,
      isLocation: false,
    };
  }
  return {
    joiner: profile.roleJoiners.location,
    name: job.location,
    isLocation: true,
  };
}
