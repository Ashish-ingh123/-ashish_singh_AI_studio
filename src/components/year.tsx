"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

/**
 * The current year, computed in the browser.
 *
 * The page is prerendered to static HTML at build time, and Next.js (with Cache Components
 * on) refuses to read the clock during that prerender. Reading it on the client instead
 * keeps the page static and keeps the year correct after New Year without a rebuild.
 * The server renders an empty string; the browser fills in the year right after hydration.
 */
export function Year() {
  const year = useSyncExternalStore(
    subscribeToNothing,
    () => String(new Date().getFullYear()),
    () => "",
  );
  return <>{year}</>;
}
