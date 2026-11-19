import { profile } from "@/content/profile";

/** The tagline, for example "Full-Stack · .NET · React", as separate items. */
export const taglineParts = profile.tagline
  .split("·")
  .map((part) => part.trim())
  .filter(Boolean);
