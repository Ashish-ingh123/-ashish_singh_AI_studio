import { Award, GraduationCap, Trophy, type LucideIcon } from "lucide-react";
import { cardClasses } from "@/components/card";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { Section } from "@/components/section";
import { profile } from "@/content/profile";

// One entry in the Education or Certifications list. Every entry after the first gets a
// thin line above it. The line is a see-through tint of the accent, not the border token:
// in the dark theme the card's violet sheen is about as bright as that token, so a
// border-coloured line would almost disappear.
const entryClasses =
  "border-t border-accent/20 py-4 first:border-t-0 first:pt-0 last:pb-0";

/** The heading of one group inside a card: an icon tile and the group's title. */
function GroupHeading({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
    </div>
  );
}

function yearRange(start: string, end: string) {
  return start === end ? end : `${start} – ${end}`;
}

/**
 * Two equal cards. Education and certifications are short lists, so they share one card,
 * one under the other; the achievements are sentences and fill the other. With three
 * cards in a row the two short lists each left half a card empty.
 */
export function Education() {
  const labels = profile.labels.education;

  return (
    <Section id="education" space="compact">
      {/* h-full on the reveal wrappers and the cards keeps the two cards equally tall. */}
      <RevealGroup className="grid gap-6 lg:grid-cols-2">
        <RevealItem className="h-full">
          <div className={`${cardClasses} h-full p-6`}>
            <GroupHeading icon={GraduationCap} title={labels.education} />
            <ul className="mt-5">
              {profile.education.map((entry) => (
                <li
                  key={`${entry.degree}-${entry.end}`}
                  className={entryClasses}
                >
                  <h4 className="font-semibold">{entry.degree}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.institution}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {yearRange(entry.start, entry.end)}
                    {entry.detail ? ` · ${entry.detail}` : ""}
                  </p>
                </li>
              ))}
            </ul>

            {/* The second group, set off from the first by the same thin line. */}
            <div className="mt-6 border-t border-accent/20 pt-6">
              <GroupHeading icon={Award} title={labels.certifications} />
              <ul className="mt-5">
                {profile.certifications.map((certificate) => (
                  <li key={certificate.name} className={entryClasses}>
                    <h4 className="font-semibold">{certificate.name}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {certificate.issuer}
                      {certificate.detail ? ` · ${certificate.detail}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RevealItem>

        <RevealItem className="h-full">
          <div className={`${cardClasses} h-full p-6`}>
            <GroupHeading icon={Trophy} title={labels.achievements} />
            <ul className="mt-5 space-y-3">
              {profile.achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="flex gap-3 text-sm leading-relaxed sm:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:mt-2.5"
                  />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
