import {
  Boxes,
  Bug,
  CalendarClock,
  Database,
  MessagesSquare,
  MonitorSmartphone,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import { cardClasses } from "@/components/card";
import { Chip } from "@/components/chip";
import { ExperienceRail } from "@/components/experience-rail";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import {
  profile,
  type ExperienceHighlight,
  type HighlightIcon,
} from "@/content/profile";
import { rolePlace } from "@/lib/role-place";

// The content file names an icon by key; this lookup turns the key into a component.
// Record<HighlightIcon, ...> makes TypeScript insist that every key has an icon.
const icons: Record<HighlightIcon, LucideIcon> = {
  modules: Boxes,
  sql: Database,
  invoice: ReceiptText,
  kiosk: MonitorSmartphone,
  messaging: MessagesSquare,
  reports: CalendarClock,
  debugging: Bug,
};

/**
 * One piece of work as a card. The card is a small grid of its own: on a phone the icon
 * sits beside the title and the text runs underneath at full width, which keeps its
 * lines a readable length. From sm up the icon stands to the left of both, as in the
 * design.
 */
function HighlightCard({ highlight }: { highlight: ExperienceHighlight }) {
  const Icon = icons[highlight.icon];
  return (
    // content-start keeps the rows packed at the top when a taller neighbour stretches
    // the card; without it the grid would share the spare height out between the rows.
    // minmax(0,1fr) and wrap-break-word stop a very long word from widening the card.
    <div
      className={`${cardClasses} grid h-full grid-cols-[auto_minmax(0,1fr)] content-start items-center gap-x-4 gap-y-3 p-5 wrap-break-word sm:gap-x-5 sm:gap-y-2 sm:p-6`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent sm:row-span-2 sm:self-start">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      {/* The heading font rule in globals.css stops at h3, so an h4 asks for it itself. */}
      <h4 className="font-display text-lg leading-snug font-semibold">
        {highlight.title}
      </h4>
      <p className="col-span-full text-sm leading-relaxed text-muted-foreground sm:col-start-2">
        {highlight.text}
      </p>
    </div>
  );
}

/**
 * Work experience: for each job a header (the role, then its company or, when the job
 * names none, its location; dates; technologies) and a column of cards, one card per
 * piece of work.
 *
 * On a wide and tall enough screen the header stays pinned on the left while the cards
 * scroll past on the right, with an outline of the cards under it that shows which one is
 * being read. Everywhere else the header sits above the cards, and a thin line down their
 * left side fills card by card instead. The layout and both kinds of progress are in
 * src/app/styles/experience.css; experience-rail.tsx tells them which card is current.
 */
export function Experience() {
  const labels = profile.labels.experience;

  return (
    <Section id="experience">
      {profile.experience.map((job, jobIndex) => {
        // The company, or the location when the job names no company.
        const place = rolePlace(job);
        const lastCard = job.highlights.length - 1;
        // Each card needs an id for its line in the outline to point at.
        const cardId = (position: number) =>
          `work-${jobIndex + 1}-${position + 1}`;
        const outlineId = `work-${jobIndex + 1}-outline`;

        return (
          <ExperienceRail
            key={`${job.role}-${job.start}`}
            className={`job ${jobIndex > 0 ? "mt-16 sm:mt-24" : ""}`}
          >
            <Reveal className="job-side">
              <header>
                {/*
                  Poppins is loaded in its heavy weights only, so the quiet joining
                  word ("at" or "in") uses the body font.
                */}
                <h3 className="font-display text-title font-semibold text-balance">
                  {job.role}{" "}
                  <span className="font-sans font-normal text-muted-foreground">
                    {place.joiner}
                  </span>{" "}
                  <span className="text-accent">{place.name}</span>
                </h3>
                {/*
                  One line with dots between the parts from the sm breakpoint up. A phone
                  is too narrow for that, so there each part gets a line of its own and
                  the dots are hidden. The location is left out here when the heading
                  already shows it.
                */}
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="block sm:inline">
                    {job.start} – {job.end}
                  </span>
                  {!place.isLocation && (
                    <>
                      <span className="hidden sm:inline">{" · "}</span>
                      <span className="block sm:inline">{job.location}</span>
                    </>
                  )}
                  <span className="hidden sm:inline">{" · "}</span>
                  <span className="block sm:inline">{job.context}</span>
                </p>
                <ul
                  className="mt-4 flex flex-wrap gap-2"
                  aria-label={labels.technologies}
                >
                  {job.tech.map((tech) => (
                    <li key={tech}>
                      <Chip>{tech}</Chip>
                    </li>
                  ))}
                </ul>
              </header>

              {/*
                The outline: the cards by title, each a link to its card. experience.css
                shows it only where the header is pinned; elsewhere it is display: none,
                which also takes it out of the Tab order and away from screen readers.
                data-state starts as "ahead" and experience-rail.tsx changes it.
              */}
              <nav aria-labelledby={outlineId} className="job-rail">
                <p id={outlineId} className="font-mono text-sm text-accent">
                  {labels.outline}
                </p>
                <ol className="mt-2.5">
                  {job.highlights.map((highlight, position) => (
                    <li
                      key={highlight.title}
                      data-rail
                      data-state="ahead"
                      className="job-rail-item"
                    >
                      <a
                        href={`#${cardId(position)}`}
                        data-rail-link
                        className="job-rail-link"
                      >
                        <span aria-hidden="true" className="job-rail-dot" />
                        {highlight.title}
                      </a>
                      {/* The stretch of line from this dot down to the next one. */}
                      {position < lastCard && (
                        <span aria-hidden="true" className="job-rail-line">
                          <span className="job-fill" />
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>

            {/*
              Each card has its own Reveal instead of one RevealGroup round the list.
              A group reveals all its items when its top edge comes into view, and seven
              stacked cards on a phone are several screens tall: the lower cards would
              have finished fading in long before anyone scrolled to them.
            */}
            <ul className="job-work">
              {job.highlights.map((highlight, position) => (
                <li
                  key={highlight.title}
                  id={cardId(position)}
                  data-work
                  data-state="ahead"
                  className="job-work-item"
                >
                  {/*
                    The progress line beside the cards, for screens where nothing is
                    pinned: a dot level with the card's icon, and the stretch of line
                    from it down to the next card's dot.
                  */}
                  <span aria-hidden="true" className="job-node" />
                  {position < lastCard && (
                    <span aria-hidden="true" className="job-spine">
                      <span className="job-fill" />
                    </span>
                  )}
                  <Reveal className="h-full">
                    <HighlightCard highlight={highlight} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </ExperienceRail>
        );
      })}
    </Section>
  );
}
