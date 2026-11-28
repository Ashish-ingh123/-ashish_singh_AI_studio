import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Chip } from "@/components/chip";
import { GitHubIcon } from "@/components/icons";
import { ProjectVisual, type CoveredEdge } from "@/components/project-visual";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { Section } from "@/components/section";
import { StatusBadge } from "@/components/status-badge";
import { profile, type Project } from "@/content/profile";

/**
 * Where the text sits in a row from the lg breakpoint up. Below lg every row is a single
 * column: the picture first, the text under it.
 */
type Arrangement = "textLeft" | "textRight" | "textOnly";

/** The classes that differ from one arrangement to the next, one entry per part of a row. */
type RowClasses = {
  /** The row itself, which is the article. */
  row: string;
  /** The grid cell that holds the picture. */
  visual: string;
  /** The text block as a whole. */
  text: string;
  /** The line with the small label and the status badge. */
  labelRow: string;
  /** The description card. */
  card: string;
  /** The row of chips and the row of links. */
  chipsAndLinks: string;
  /** The edge of the picture that the description card lies over. */
  coveredEdge?: CoveredEdge;
};

// Two equal columns from lg. Below lg the row is one column of at most 42rem, so a tablet
// does not stretch a four-line terminal window across the whole screen.
const twoColumns =
  "mx-auto grid max-w-2xl grid-cols-1 items-center gap-8 lg:max-w-none lg:grid-cols-2 lg:gap-x-12";

/*
  Every row has the same markup order (picture, then text), which is the order a phone
  shows and a screen reader reads. From lg, CSS alone decides the sides: lg:order-last
  moves the picture into the second column on the rows where the text goes first.

  The overlap follows the reference design. A negative margin pulls the description card
  6rem toward the picture: 3rem of that crosses the gap between the columns (gap-x-12) and
  the other 3rem lies over the edge of the terminal window, which keeps that strip empty
  (coveredEdge in project-visual.tsx).

  Record<Arrangement, ...> is a Dictionary whose keys the compiler checks: leave an
  arrangement out and the build fails.
*/
const rowClasses: Record<Arrangement, RowClasses> = {
  textLeft: {
    row: twoColumns,
    visual: "lg:order-last",
    text: "",
    labelRow: "",
    card: "lg:-mr-24",
    chipsAndLinks: "",
    coveredEdge: "left",
  },
  // The mirror image: the label, title, tagline, chips and links line up on the right.
  textRight: {
    row: twoColumns,
    visual: "",
    text: "lg:text-right",
    labelRow: "lg:flex-row-reverse",
    card: "lg:-ml-24",
    chipsAndLinks: "lg:justify-end",
    coveredEdge: "right",
  },
  // A project without a picture: one centred column at every width.
  textOnly: {
    row: "mx-auto max-w-2xl",
    visual: "",
    text: "",
    labelRow: "",
    card: "",
    chipsAndLinks: "",
  },
};

/** Rows alternate: the first project has its text on the left, the next on the right. */
function arrangementOf(project: Project, index: number): Arrangement {
  if (!project.visual) return "textOnly";
  return index % 2 === 0 ? "textLeft" : "textRight";
}

const externalLinkClasses =
  "inline-flex items-center gap-1.5 rounded-sm py-1 transition-colors hover:text-accent";

/** The links under a project. Renders nothing when the project has none. */
function ProjectLinks({
  project,
  className,
}: {
  project: Project;
  className: string;
}) {
  // A case-study page exists only for a project with both a slug and a write-up.
  const caseStudyHref =
    project.slug && project.caseStudy ? `/projects/${project.slug}` : undefined;
  const repo = project.links?.repo;
  const demo = project.links?.demo;
  if (!caseStudyHref && !repo && !demo) return null;

  const labels = profile.labels.projects;
  // Every project repeats the same link words, so each link also carries the project's
  // name for screen readers. Sighted visitors get it from the heading above.
  const ofProject = <span className="sr-only">: {project.name}</span>;

  return (
    <div
      className={`mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium ${className}`}
    >
      {caseStudyHref && (
        <Link
          href={caseStudyHref}
          className="group inline-flex items-center gap-1.5 rounded-sm py-1 text-accent"
        >
          {/* The underline is on the words only, so it stops short of the arrow. */}
          <span className="link-draw">{labels.caseStudy}</span>
          {ofProject}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
      {repo && (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className={externalLinkClasses}
        >
          <GitHubIcon className="h-4 w-4" aria-hidden="true" />
          <span className="link-draw">{labels.repo}</span>
          {ofProject}
        </a>
      )}
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className={externalLinkClasses}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="link-draw">{labels.demo}</span>
          {ofProject}
        </a>
      )}
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const classes = rowClasses[arrangementOf(project, index)];
  const labels = profile.labels.projects;
  // The article takes its name from the heading, so a screen reader announces the project
  // before the terminal lines, which come first in the markup.
  const titleId = `project-${index + 1}-title`;

  return (
    // The picture and the text are the two items of one group, so they fade in one after
    // the other when the row scrolls into view.
    <RevealGroup>
      <article aria-labelledby={titleId} className={classes.row}>
        {project.visual && (
          <RevealItem className={classes.visual}>
            <ProjectVisual
              visual={project.visual}
              coveredEdge={classes.coveredEdge}
            />
          </RevealItem>
        )}
        {/*
          z-10 puts the whole text block in front of the picture: the card has to cover
          the window's edge, and the glow must never be painted over the words.
        */}
        <RevealItem className={`relative z-10 ${classes.text}`}>
          <div
            className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${classes.labelRow}`}
          >
            <p className="text-sm font-medium text-accent">{labels.featured}</p>
            <StatusBadge status={project.status} />
          </div>
          <h3
            id={titleId}
            className="mt-3 font-display text-title font-bold text-balance break-words"
          >
            {project.name}
          </h3>
          <p className="mt-2 font-medium text-accent">{project.tagline}</p>
          {/*
            A see-through panel: the blur softens whatever lies behind it, which from lg
            includes the edge of the terminal window. The text stays left-aligned even in
            the right-aligned rows, because a ragged left edge makes a paragraph hard to
            read.
          */}
          <p
            className={`mt-6 rounded-2xl border border-border bg-card/80 p-5 text-left text-sm leading-relaxed text-muted-foreground shadow-[0_18px_44px_-18px_var(--glow)] backdrop-blur-md sm:p-6 sm:text-base ${classes.card}`}
          >
            {project.description}
          </p>
          <ul
            className={`mt-6 flex flex-wrap gap-2 ${classes.chipsAndLinks}`}
            aria-label={labels.technologies}
          >
            {project.tech.map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>
          <ProjectLinks project={project} className={classes.chipsAndLinks} />
        </RevealItem>
      </article>
    </RevealGroup>
  );
}

/**
 * The projects as "featured project" rows, after the reference design: the text on one
 * side, a picture on the other, the sides swapping from row to row, and the description
 * card reaching over the edge of the picture. A project with onHome: false is left out
 * (BillingRecon, which has its own sections); the rows alternate among those shown.
 */
export function Projects() {
  const shown = profile.projects.filter((project) => project.onHome !== false);
  return (
    <Section id="projects" space="roomy">
      {/* A flex column, not a grid: a grid column could be pushed wider by long content. */}
      <ul className="flex flex-col gap-20 lg:gap-28">
        {shown.map((project, index) => (
          <li key={project.name}>
            <ProjectRow project={project} index={index} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
