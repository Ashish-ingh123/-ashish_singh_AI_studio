import type { ReactNode } from "react";

export const chipClasses =
  "inline-flex items-center rounded-full border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-foreground";

/** A small rounded tag, used for technologies and skills. */
export function Chip({ children }: { children: ReactNode }) {
  return <span className={chipClasses}>{children}</span>;
}
