import type { ProjectStatus } from "@/content/profile";

const styles: Record<ProjectStatus, string> = {
  "In progress": "border-accent/40 bg-accent/10 text-accent",
  Completed: "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status === "In progress" && (
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
      )}
      {status}
    </span>
  );
}
