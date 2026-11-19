import { profile } from "@/content/profile";

/** The initials of the site owner, for example "AS". Used by the orb in the Skills section. */
export const initials = profile.name
  .split(/\s+/)
  .map((word) => word[0])
  .join("")
  .toUpperCase();
