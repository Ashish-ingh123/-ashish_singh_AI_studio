import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown, Info } from "lucide-react";
import { ArchitectureDiagram } from "@/components/case-study/architecture-diagram";
import { Toc, type TocItem } from "@/components/case-study/toc";
import { Principles } from "@/components/case-study/principles";
import { Roadmap } from "@/components/case-study/roadmap";
import { StatusTable } from "@/components/case-study/status-table";
import { Chip } from "@/components/chip";
import { StatusBadge } from "@/components/status-badge";
import { profile, type CaseStudySection } from "@/content/profile";
import { caseStudies, caseStudyPath, findCaseStudy } from "@/lib/case-studies";

type Params = { slug: string };
type Props = { params: Promise<Params> };

// Next's dev check for instant navigation wants `params` read inside <Suspense>. This page
// reads the slug first on purpose: an unknown slug must reach notFound() before any HTML is
// sent. Once a response has started (a Suspense fallback counts) it is 200 and cannot become
// a real 404, as in ASP.NET once the body is being written. `instant = false` marks the page
// as allowed to wait for its data instead. Rendering does not change: the slugs from
// generateStaticParams are still built ahead of time.
export const instant = false;

// These slugs are prerendered at build time; any other slug falls through to notFound().
export function generateStaticParams(): Params[] {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findCaseStudy(slug);
  // An unknown slug is a 404 here too. Returning empty metadata instead would give the
  // not-found page the homepage's title.
  if (!project) notFound();
  const path = caseStudyPath(project);
  return {
    // The root layout's title template appends the site owner's name.
    title: project.name,
    description: project.tagline,
    alternates: { canonical: path },
    // A page's openGraph replaces the layout's whole openGraph object, so siteName repeats.
    openGraph: {
      type: "article",
      siteName: profile.name,
      title: project.name,
      description: project.tagline,
      url: path,
    },
  };
}

/**
 * A heading as an id: lower case, with every run of other characters turned into one
 * hyphen. "Built vs designed" becomes "built-vs-designed". The contents list links to
 * these ids, and they are what appears in the address bar after a jump.
 */
function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Part({ heading, children }: { heading: string; children: ReactNode }) {
  const id = sectionId(heading);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12">
      <h2
        id={`${id}-heading`}
        className="text-xl font-semibold tracking-tight sm:text-2xl"
      >
        {heading}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function TextSection({ section }: { section: CaseStudySection }) {
  return (
    <Part heading={section.heading}>
      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-3 leading-relaxed text-muted-foreground first:mt-0"
        >
          {paragraph}
        </p>
      ))}
      {section.bullets && <Bullets items={section.bullets} />}
    </Part>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findCaseStudy(slug);
  if (!project) notFound();
  const study = project.caseStudy;
  const labels = profile.labels.caseStudy;

  // The page's sections in the order they are rendered below, for the contents list.
  // A section the case study leaves out is left out here too.
  const headings = [
    study.problem?.heading,
    study.architecture && labels.architecture,
    study.principles && labels.principles,
    study.statusTable && labels.status,
    study.roadmap && labels.roadmap,
    ...(study.sections?.map((section) => section.heading) ?? []),
  ].filter((heading): heading is string => Boolean(heading));
  const contents: TocItem[] = headings.map((heading) => ({
    id: sectionId(heading),
    label: heading,
  }));

  return (
    // relative: the pinned contents list below is placed against this article.
    <article className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      {/*
        Wide screens: the contents list in the empty margin to the right of the text.
        The aside is as tall as the article and sits just outside its right edge
        (left-full); the list inside is sticky, so it stays 96px from the top while the
        article scrolls. It appears from xl, the first width at which the margin has
        room for it. Narrower screens get the same list folded away under the intro.
      */}
      {contents.length > 1 && (
        <aside className="absolute inset-y-0 left-full hidden w-52 py-20 pl-2 xl:block">
          <nav aria-labelledby="contents-wide" className="sticky top-24">
            <p id="contents-wide" className="mb-3 font-mono text-sm text-accent">
              {labels.contents}
            </p>
            <Toc items={contents} />
          </nav>
        </aside>
      )}

      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span className="link-draw">{labels.back}</span>
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-heading font-semibold">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-2 text-lg text-accent">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={labels.technologies}>
          {project.tech.map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
      </header>

      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
        {study.intro}
      </p>

      {study.statusSummary && (
        <p className="mt-6 flex gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{study.statusSummary}</span>
        </p>
      )}

      {/*
        Narrow screens: the contents list as a native <details>, which opens and closes
        without any script and is closed to begin with, so it costs one line.
      */}
      {contents.length > 1 && (
        <details className="group mt-6 rounded-xl border border-border bg-card/60 xl:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 font-mono text-sm text-accent [&::-webkit-details-marker]:hidden">
            {labels.contents}
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <nav aria-label={labels.contents} className="px-4 pb-4">
            <Toc items={contents} />
          </nav>
        </details>
      )}

      {study.problem && <TextSection section={study.problem} />}

      {study.architecture && (
        <Part heading={labels.architecture}>
          <ArchitectureDiagram
            layers={study.architecture.layers}
            rule={study.architecture.rule}
            title={labels.diagramTitle}
          />
          {study.architecture.points && (
            <Bullets items={study.architecture.points} />
          )}
        </Part>
      )}

      {study.principles && (
        <Part heading={labels.principles}>
          <Principles items={study.principles} />
        </Part>
      )}

      {study.statusTable && (
        <Part heading={labels.status}>
          <StatusTable rows={study.statusTable} />
        </Part>
      )}

      {study.roadmap && (
        <Part heading={labels.roadmap}>
          <Roadmap releases={study.roadmap} />
        </Part>
      )}

      {study.sections?.map((section) => (
        <TextSection key={section.heading} section={section} />
      ))}
    </article>
  );
}
