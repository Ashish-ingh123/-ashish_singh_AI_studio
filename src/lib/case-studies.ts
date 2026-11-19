import { profile, type CaseStudy, type Project } from "@/content/profile";

export type CaseStudyProject = Project & { slug: string; caseStudy: CaseStudy };

/** Only projects with both a slug and a case study get a page of their own. */
export const caseStudies = profile.projects.filter(
  (project): project is CaseStudyProject =>
    project.slug !== undefined && project.caseStudy !== undefined,
);

export function findCaseStudy(slug: string): CaseStudyProject | undefined {
  return caseStudies.find((project) => project.slug === slug);
}

/** The site path of a case-study page. */
export function caseStudyPath(project: CaseStudyProject): string {
  return `/projects/${project.slug}`;
}
