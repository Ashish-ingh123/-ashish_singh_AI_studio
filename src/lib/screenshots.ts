import { profile, type Screenshot } from "@/content/profile";

/** Where a screenshot's file is served from (public/images/billingrecon). */
export function shotSrc(shot: Screenshot, theme: "light" | "dark") {
  return `/images/billingrecon/${shot.file}${theme === "dark" ? "-dark" : ""}.webp`;
}

/**
 * A screenshot by id. A missing id is a mistake in profile.ts, so it fails the build
 * instead of leaving a hole on the page.
 */
export function findShot(id: string): Screenshot {
  const shot = profile.product.screenshots.find((entry) => entry.id === id);
  if (!shot) throw new Error(`No screenshot "${id}" in profile.product.screenshots`);
  return shot;
}
