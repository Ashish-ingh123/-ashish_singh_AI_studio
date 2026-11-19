import type { ReactNode } from "react";

export type BadgeTone = "accent" | "accent-outline" | "muted" | "muted-outline";

const tones: Record<BadgeTone, string> = {
  accent: "border-accent/40 bg-accent/10 text-accent",
  "accent-outline": "border-accent/50 text-accent",
  muted: "border-border bg-muted text-muted-foreground",
  "muted-outline": "border-dashed border-border text-muted-foreground",
};

/** A small rounded label. The tone says how prominent, or how finished, the thing is. */
export function Badge({
  tone = "muted",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
