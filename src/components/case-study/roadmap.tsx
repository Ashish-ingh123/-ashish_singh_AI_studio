import { Badge } from "@/components/badge";
import { releaseTone } from "@/components/case-study/status";
import type { Release } from "@/content/profile";

/**
 * The releases as a line of dots: a built release or one in progress has an accent dot.
 * `heading` is the level of each release's name: h3 under a page's h2 (the case study),
 * h4 where the roadmap sits under an h3 of its own (the homepage's features section).
 */
export function Roadmap({
  releases,
  heading: Heading = "h3",
}: {
  releases: Release[];
  heading?: "h3" | "h4";
}) {
  return (
    <ol className="relative ml-2 border-l border-border pl-6">
      {releases.map((release) => {
        const active =
          release.status === "In progress" || release.status === "Built";
        return (
          <li key={release.name} className="relative pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-[calc(-1.5rem_-_6px)] h-3 w-3 rounded-full border-2 border-background ${
                active ? "bg-accent" : "bg-border"
              }`}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Heading className="font-semibold">{release.name}</Heading>
              <Badge tone={releaseTone[release.status]}>{release.status}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {release.scope}
            </p>
            {release.note && (
              <p className="mt-2 text-sm leading-relaxed">{release.note}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
