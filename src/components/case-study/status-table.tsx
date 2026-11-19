import { Badge } from "@/components/badge";
import { buildTone } from "@/components/case-study/status";
import type { BuildStatus, StatusRow } from "@/content/profile";

const order: BuildStatus[] = ["Built", "Partly built", "Designed", "Not started"];

// How each status is filled in the bar: the more finished, the more accent, the same
// idea as the badge tones. "Not started" is an empty outline.
const barFill: Record<BuildStatus, string> = {
  Built: "bg-accent",
  "Partly built": "bg-accent/45",
  Designed: "bg-muted-foreground/35",
  "Not started": "border border-dashed border-muted-foreground/60",
};

/**
 * A real table so screen readers announce row and column headers. On phones the Note
 * column folds into the Area cell, so the table stays two columns wide and never scrolls.
 */
export function StatusTable({ rows }: { rows: StatusRow[] }) {
  const totals = order
    .map((status) => ({
      status,
      count: rows.filter((row) => row.status === status).length,
    }))
    .filter((total) => total.count > 0);

  return (
    <div>
      {/*
        The totals as one bar, each status taking a share of the width equal to its
        share of the rows (flexGrow is the row count). It is a picture of the badges
        underneath, which carry the same numbers as text, so screen readers skip it.
      */}
      <div aria-hidden="true" className="mb-3 flex h-2 gap-0.5">
        {totals.map(({ status, count }) => (
          <span
            key={status}
            style={{ flexGrow: count }}
            className={`basis-0 rounded-full ${barFill[status]}`}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-2" aria-label="Totals by status">
        {totals.map(({ status, count }) => (
          <li key={status}>
            <Badge tone={buildTone[status]}>
              {status}: {count}
            </Badge>
          </li>
        ))}
      </ul>

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Status of each area of the project: built, partly built, designed or not
            started
          </caption>
          <thead className="bg-muted text-left text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Area
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Status
              </th>
              <th
                scope="col"
                className="hidden px-4 py-3 font-semibold md:table-cell"
              >
                Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.area} className="align-top">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  {row.area}
                  {row.note && (
                    <span className="mt-1 block text-xs font-normal text-muted-foreground md:hidden">
                      {row.note}
                    </span>
                  )}
                </th>
                <td className="px-4 py-3">
                  <Badge tone={buildTone[row.status]}>{row.status}</Badge>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
