"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { buttonClasses } from "@/components/button-link";
import { profile } from "@/content/profile";
import { writeToClipboard } from "@/lib/clipboard";

type State = "idle" | "copied" | "failed";

const labels = profile.labels.copy;

/**
 * Copies the email address to the clipboard and shows a short toast.
 * The visually hidden status element announces the result to screen readers.
 */
export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();

  // Clear any pending timer when the component unmounts.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    const ok = await writeToClipboard(email);
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  }

  const message =
    state === "copied" ? labels.copied : state === "failed" ? labels.failed : "";

  return (
    <div className="relative inline-flex">
      <button type="button" onClick={copy} className={buttonClasses("primary")}>
        {state === "copied" ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {state === "copied" ? labels.done : labels.idle}
      </button>

      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>

      <AnimatePresence>
        {state !== "idle" && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-md"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
