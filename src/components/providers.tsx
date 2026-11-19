"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";

/**
 * Client-side providers that wrap the whole app.
 *
 * - ThemeProvider (next-themes) puts a "light" or "dark" class on <html>, remembers the
 *   visitor's choice in localStorage, and follows the OS setting when the choice is "system".
 *   New visitors start in dark, the look the site is designed around.
 *   It also injects a tiny script into <head> that applies the theme before the first paint,
 *   which is what prevents the white flash on reload.
 * - MotionConfig with reducedMotion="user" makes every Motion animation respect the OS
 *   "reduce motion" setting without per-component code.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
