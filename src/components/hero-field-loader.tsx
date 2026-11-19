"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The field's code travels as its own file (a separate chunk) and is never rendered on the
// server: next/dynamic with ssr: false is React.lazy for a component that only makes sense
// in a browser. ssr: false is allowed only inside a client component, which is why this
// small wrapper exists.
const HeroField = dynamic(
  () => import("@/components/hero-field").then((loaded) => loaded.HeroField),
  { ssr: false },
);

type Props = {
  labels: string[];
  queryLabel: string;
};

/**
 * Mounts the hero's field only once the browser is idle, so the picture never competes
 * with the first paint of the headline or with React attaching itself to the page.
 */
export function HeroFieldLoader({ labels, queryLabel }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    // requestIdleCallback waits for a quiet moment, and the timeout is the longest it may
    // wait. Safari gained it only recently, so there is a plain timer to fall back on.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 300);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <HeroField labels={labels} queryLabel={queryLabel} /> : null;
}
