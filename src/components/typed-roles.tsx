"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Milliseconds per typed letter, per deleted letter, and per pause on a finished role.
// With the three roles in profile.ts they add up to about 4.2 seconds. Keep the total
// under five: text that keeps moving for longer needs a pause control to stay accessible.
const TYPE_MS = 30;
const DELETE_MS = 12;
const HOLD_MS = 600;

/**
 * Types each role in turn, like a terminal, then rests on the last one.
 *
 * The server renders the last role in full, so the line is complete before any script
 * runs. After hydration the effect deletes it and types through the list once. Visitors
 * who prefer reduced motion keep the server-rendered text, and CSS hides the caret.
 */
export function TypedRoles({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const resting = roles[roles.length - 1] ?? "";
  const [text, setText] = useState(resting);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;

    let timer = 0;
    let stopped = false;
    // An awaitable setTimeout, the same idea as Task.Delay in C#.
    const pause = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    async function play() {
      let shown = resting;
      for (const role of roles) {
        await pause(HOLD_MS);
        while (shown.length > 0) {
          if (stopped) return;
          shown = shown.slice(0, -1);
          setText(shown);
          await pause(DELETE_MS);
        }
        for (let end = 1; end <= role.length; end++) {
          if (stopped) return;
          shown = role.slice(0, end);
          setText(shown);
          await pause(TYPE_MS);
        }
      }
      if (!stopped) setDone(true);
    }

    void play();
    // Runs when the component unmounts: stop the loop and cancel the pending timer.
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [reduce, resting, roles]);

  return (
    <>
      {text}
      <span className="typed-caret" data-done={done} />
    </>
  );
}
