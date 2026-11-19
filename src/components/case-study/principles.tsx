import { Badge } from "@/components/badge";
import { cardClasses } from "@/components/card";
import { buildTone } from "@/components/case-study/status";
import type { Principle } from "@/content/profile";

export function Principles({ items }: { items: Principle[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((principle) => (
        <li key={principle.name} className={`${cardClasses} p-5`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold">{principle.name}</h3>
            <Badge tone={buildTone[principle.status]}>{principle.status}</Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {principle.summary}
          </p>
        </li>
      ))}
    </ul>
  );
}
