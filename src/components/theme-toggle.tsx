"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";

const modes = ["light", "dark", "system"] as const;
type Mode = (typeof modes)[number];

const icons = { light: Sun, dark: Moon, system: Monitor } as const;

function isMode(value: string | undefined): value is Mode {
  return modes.some((mode) => mode === value);
}

// true once React is running in the browser, false while rendering on the server and
// during hydration. useSyncExternalStore is the lint-approved way to express this.
const subscribeToNothing = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

/** One button that cycles light, dark and system, with an animated icon swap. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const reduce = useReducedMotion();

  // The server cannot know the visitor's saved choice, so until the component is mounted
  // in the browser it shows the neutral "system" icon. That keeps server and client HTML
  // identical and avoids a hydration warning.
  const current: Mode = mounted && isMode(theme) ? theme : "system";
  const next = modes[(modes.indexOf(current) + 1) % modes.length];
  const Icon = icons[current];

  function switchTheme() {
    const apply = () => setTheme(next);
    // View Transitions: the browser snapshots the page, runs the change, then crossfades
    // the two snapshots (timing lives in globals.css). flushSync makes React apply the
    // new theme inside that callback instead of on its own schedule. Browsers without
    // the API, and visitors who prefer reduced motion, get the instant switch.
    if (reduce || typeof document.startViewTransition !== "function") {
      apply();
      return;
    }
    document.startViewTransition(() => {
      flushSync(apply);
    });
  }

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label={`Theme: ${current}. Switch to ${next}`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-accent/50 hover:bg-muted"
    >
      {mounted ? (
        // Mounted only after hydration, so the first icon appears without an animation and
        // only later clicks animate the swap.
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current}
            className="inline-flex"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
