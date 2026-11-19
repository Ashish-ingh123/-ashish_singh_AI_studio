import { Badge } from "@/components/badge";
import { releaseTone } from "@/components/case-study/status";
import type { Release } from "@/content/profile";

export function Roadmap({ releases }: { releases: Release[] }) {
  return (
    <ol className="relative ml-2 border-l border-border pl-6">
      {releases.map((release) => {
        const active = release.status === "In progress";
        return (
          <li key={release.name} className="relative pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-[calc(-1.5rem_-_6px)] h-3 w-3 rounded-full border-2 border-background ${
                active ? "bg-accent" : "bg-border"
              }`}
            />
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-semibold">{release.name}</h3>
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
