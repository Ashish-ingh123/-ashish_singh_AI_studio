/**
 * All site content lives in this one file. Change text here, never in components.
 * The phone number in links.phone is shown only in the Contact section.
 */

export type Links = {
  email: string;
  /** Mobile number in international format, written the way it should be displayed. */
  phone: string;
  linkedin: string;
  github: string;
};

/** The page sections, used both for header links and for the anchor ids on the page. */
export type SectionId =
  | "product"
  | "features"
  | "about"
  | "services"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "contact";

export type NavItem = {
  id: SectionId;
  /** Short text for the navbar. */
  label: string;
  /** Longer title for the section heading; the label is used when absent. */
  heading?: string;
};

/**
 * Small fixed words that sections print beside the content: field names and card titles.
 * They live here so that no text is typed into a component.
 */
export type Labels = {
  /** The facts panel in the About section. Each value comes from the field named here. */
  about: {
    /** Printed over profile.title. */
    role: string;
    /** Printed over profile.tagline. */
    focus: string;
    /** Printed over profile.location. */
    location: string;
    /** Printed over profile.availability. */
    availability: string;
    /** Printed over profile.currentlyBuilding. */
    now: string;
  };
  /** Titles of the three groups in the Education section. */
  education: {
    education: string;
    certifications: string;
    achievements: string;
  };
  /** The Services section. */
  services: {
    /**
     * The three layers named in the drawing on the full-stack service card, from the top
     * one down. Decoration: the card's own text already says the same thing.
     */
    stack: [string, string, string];
  };
  /** The Experience section. */
  experience: {
    /**
     * Small line over the list of a job's pieces of work that stays pinned beside the
     * cards on a wide screen. It is also what a screen reader calls that list.
     */
    outline: string;
    /** What a screen reader calls a job's list of technology chips. */
    technologies: string;
  };
  /** The header that sits on every page. */
  header: {
    /** What a screen reader calls the list of section links. */
    main: string;
    /** Names of the menu button on a phone, closed and open. */
    openMenu: string;
    closeMenu: string;
  };
  /** The button that copies the email address, in Contact and in the command palette. */
  copy: {
    /** Text of the button. */
    idle: string;
    /** Text of the button for a moment after a successful copy. */
    done: string;
    /** The short message shown, and read out, after a copy. */
    copied: string;
    failed: string;
  };
  /** The Contact section: names a screen reader hears, also shown as tooltips. */
  contact: {
    /** What a screen reader calls the row of round icon links. */
    links: string;
    linkedin: string;
    github: string;
  };
  /**
   * The footer. Its links are the sections named in `links`, with their menu labels; the
   * phone number is never among them (rule 5).
   */
  footer: {
    /** What a screen reader calls the footer's row of section links. */
    nav: string;
    links: SectionId[];
  };
  /**
   * The command palette: the search box that opens from the header button or with
   * Ctrl+K and lists the sections, the case studies and a few actions.
   */
  palette: {
    /** Name of the header button. */
    open: string;
    /** The key combination, as it is shown beside the button's name. */
    shortcut: string;
    /** What a screen reader calls the dialog. */
    title: string;
    /** Greyed-out text in the empty search box. */
    placeholder: string;
    /** Shown when nothing matches what was typed. */
    empty: string;
    /** Headings of the four groups of commands. */
    groups: {
      sections: string;
      projects: string;
      contact: string;
      appearance: string;
    };
    /** Names of the commands that are not taken from other content. */
    linkedin: string;
    github: string;
    theme: string;
  };
  /** The case study pages. */
  caseStudy: {
    /** Text of the link back to the homepage's Projects section. */
    back: string;
    /** What a screen reader calls the list of technology chips. */
    technologies: string;
    /** Title of the list of the page's sections; also its name for a screen reader. */
    contents: string;
    /** Headings of the sections whose content is not plain text. */
    architecture: string;
    principles: string;
    status: string;
    roadmap: string;
    /** What a screen reader calls the architecture drawing. */
    diagramTitle: string;
  };
  /** The Projects section. */
  projects: {
    /** Small line over every project's name. */
    featured: string;
    /** Text of the link to a project's case study page. */
    caseStudy: string;
    /** Text of the link to a project's source code. */
    repo: string;
    /** Text of the link to a project's live demo. */
    demo: string;
    /** What a screen reader calls the list of technology chips. */
    technologies: string;
    /** Text of the button that types a project's terminal lines again. */
    replay: string;
    /**
     * The steering-wheel animation that stands in for the terminal on a project whose
     * visual has `steering` set. Its motion is an example, never model output, and the
     * `illustrative` line must stay visible beside it for as long as that is true.
     */
    steering: {
      /** What a screen reader calls the picture. It must say that it is an illustration. */
      description: string;
      /** Small line over the angle. */
      caption: string;
      /** Always shown beside the wheel. */
      illustrative: string;
      /** Names of the button that stops and restarts the motion. */
      pause: string;
      play: string;
    };
  };
};

/** Picks the icon drawn on an experience card; the icons themselves live in the section. */
export type HighlightIcon =
  | "modules"
  | "sql"
  | "invoice"
  | "kiosk"
  | "messaging"
  | "reports"
  | "debugging";

/** One piece of work from a job, shown as a card in the Experience section. */
export type ExperienceHighlight = {
  icon: HighlightIcon;
  /** Two to four words naming what was built. */
  title: string;
  text: string;
};

export type Experience = {
  role: string;
  /**
   * Employer name. Optional: leave it out to keep an employer private, and the hero and
   * the Experience header show the location in its place.
   */
  company?: string;
  /** City and country. Shown in place of the company when the entry has none. */
  location: string;
  /** Short month and year, for example "Jul 2025". */
  start: string;
  /** Short month and year, or "Present" for the current role. */
  end: string;
  /** One line describing the product or team. */
  context: string;
  tech: string[];
  highlights: ExperienceHighlight[];
};

export type SkillCategory = {
  category: string;
  items: string[];
};

/**
 * The words of the hero: the company's first screen (Step 3 of the Ashvanta site,
 * 2026-11-28). The company's name comes from profile.brand, the founder's from
 * profile.name and profile.location. Every claim about BillingRecon must be built
 * (BILLINGRECON-FACTS.md beside the repository).
 */
export type Hero = {
  /** The pill at the top, for example "Hospital billing software · India". */
  badge: string;
  /**
   * The first line of the heading is greeting, the founder's name, founderOf and the
   * company's name: "Hello! I am Ashish Singh, founder of Ashvanta Technologies" (the
   * owner's wording, 2026-11-28).
   */
  greeting: string;
  /** The words between the founder's name and the company's, for example ", founder of". */
  founderOf: string;
  /**
   * Lead-in above the big statement. The headline (lead, statement, highlight) is the
   * site's original one, which the owner chose to keep on 2026-11-28.
   */
  lead: string;
  /** The big statement, without its final highlighted word. */
  statement: string;
  /** The last word of the statement, drawn in the accent gradient and circled. */
  highlight: string;
  /** One line under the statement: what the company builds, BillingRecon included. */
  note: string;
  /**
   * Start of the typed line, for example "We build:". The longest phrase after it must
   * fit one line of a 360px phone (about 37 letters in all): the line does not wrap.
   */
  rolePrefix: string;
  /**
   * Phrases typed one after another after rolePrefix; each must be built. The last one
   * stays on screen, and is also what visitors who prefer reduced motion see. Keep the
   * three under about 65 letters in all, so the run stays under five seconds.
   */
  roles: string[];
  /** The closing paragraph of the hero. */
  closing: string;
  /** Text of the main button, which leads to the Contact section. */
  primaryAction: string;
  /** Text of the second button, which leads to the BillingRecon section. */
  secondaryAction: string;
  /**
   * Skill names drawn beside a few points of the field behind the hero. Decoration only:
   * each must be backed by an entry in the skills list. Put them in order of importance:
   * a phone has room for the first three, and a wide screen seats as many as fit its
   * height, which is nine on a common laptop, so a tenth name is left out on a short one.
   */
  fieldLabels: string[];
  /** The word drawn beside the field's travelling point, which stands for a search query. */
  fieldQueryLabel: string;
};

/**
 * Picks the icon and the small drawing on a service card; both live in the components
 * (sections/services.tsx and service-drawing.tsx).
 */
export type ServiceIcon =
  | "fullStack"
  | "backend"
  | "integrations"
  | "cloud"
  | "ai"
  | "automation"
  | "support";

/**
 * One kind of work offered to clients, shown as a card in the Services section. The order
 * of the list is the order on the page, and it also decides the sizes: the first service
 * gets the wide card that opens the grid, and with seven services the fourth card on the
 * page is a second wide one. The service named by pipeline.service always closes the
 * grid, wherever it stands in the list.
 */
export type Service = {
  icon: ServiceIcon;
  title: string;
  description: string;
};

/** Picks the icon drawn for a pipeline stage; the icons themselves live in the component. */
export type PipelineIcon =
  | "query"
  | "retrieval"
  | "context"
  | "model"
  | "answer";

/** One step of the pipeline. */
export type PipelineStage = {
  icon: PipelineIcon;
  /** One or two words naming the step. */
  name: string;
  /**
   * One sentence saying what happens in the step. It describes the technique and names no
   * tool, so it stays true whatever a particular project uses.
   */
  text: string;
};

/**
 * The lower half of one service card: how a retrieval-augmented generation (RAG) feature
 * answers a question. An explanation of the technique, not a claim about a past project.
 */
export type Pipeline = {
  /**
   * The service this explains, named by its icon key. That service's card becomes the
   * large one that closes the grid, with the stages under its own title and description.
   */
  service: ServiceIcon;
  /** One line over the stages. It is also what a screen reader calls the list. */
  title: string;
  /** In the order the data flows; a pulse travels through them in this order. */
  stages: PipelineStage[];
  /** Text of the button that plays the animation again. */
  replayLabel: string;
};

/**
 * The words of "Ask about Ashish", the question box above the Contact section. A visitor
 * types a question and an AI model answers it from the content of this file only. The
 * box must always say plainly that the answers are AI-generated, and never suggest that
 * the site's owner is typing them.
 */
export type Ask = {
  heading: string;
  /** The badge beside the heading. It must say that the answers are AI-generated. */
  aiLabel: string;
  intro: string;
  inputLabel: string;
  placeholder: string;
  /** Text of the button that sends the question. */
  submit: string;
  /** Text of the button that stops an answer while it is being written. */
  stop: string;
  /**
   * Ready-made questions shown as buttons. Each must be answerable from this file, or
   * the box would open with a question it cannot answer.
   */
  suggestions: string[];
  /**
   * Shown under the box at all times: where the question goes and what not to type.
   * Keep it true to how the provider handles the text.
   */
  dataNotice: string;
  /** Shown when the provider's quota or rate limit is used up, or a visitor asks too fast. */
  busy: string;
  /** Shown when the box is switched off, for example because no API key is set. */
  unavailable: string;
  /** Shown for any other failure. */
  error: string;
  /** Shown when the model returns no text at all. */
  empty: string;
};

/** The fields of the "Send your requirement" form, in the order they are shown. */
export type ContactField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "service"
  | "budget"
  | "timeline"
  | "details";

/** The answers offered for "Timeline". The key is what the form sends; the label is shown. */
export type ContactTimeline = "asap" | "month" | "quarter" | "unsure";

/** What one field of the form says about itself. */
export type ContactFieldWords = {
  label: string;
  /** Greyed-out example text inside an empty field; a select has none. */
  placeholder?: string;
  /**
   * Shown under the field when what was typed breaks its rule. The rules themselves
   * (which fields are required, the lengths) are src/lib/contact-form.ts; {min} and {max}
   * are replaced by that field's limits.
   */
  error: string;
};

/**
 * The words of the "Send your requirement" form in the Contact section. A visitor fills
 * in what they need, and the details are sent to the site's owner as one email. Nothing
 * is stored on the site, and the privacy line must keep saying what really happens.
 */
export type ContactForm = {
  heading: string;
  intro: string;
  /** Added to the label of every field that may be left empty. */
  optional: string;
  fields: Record<ContactField, ContactFieldWords>;
  /** The first, empty line of the two selects. */
  choose: string;
  /** The last line of "What you need", after the titles of profile.services. */
  otherService: string;
  /** The answers offered for "Timeline", in order. */
  timelines: { key: ContactTimeline; label: string }[];
  /** Text of the send button, at rest and while the email is being sent. */
  submit: string;
  sending: string;
  /** Read out when the form is sent with mistakes in it. */
  checkFields: string;
  /** The thank-you message shown after the email has been sent. */
  sent: string;
  /** Shown when sending failed. It points to the email link above the form. */
  failed: string;
  /** Shown when the form is switched off, for example because no API key is set. */
  unavailable: string;
  /** Shown when one visitor has sent too many messages in a short time. */
  busy: string;
  /** Text of the email link printed after a failure message. */
  emailInstead: string;
  /** Shown in place of the form when the browser runs no script. */
  noScript: string;
  /**
   * Shown under the form at all times: what happens to the details. Keep it true to how
   * the email is really sent; it names the delivery service on purpose.
   */
  privacy: string;
  /** Name of the form's entry in the command palette. */
  paletteLabel: string;
  /** The words of the email the owner receives. The field names are the labels above. */
  email: {
    /** {name} is the visitor's name and {service} is what they chose. */
    subject: string;
    /** Printed for a field the visitor left empty. */
    notGiven: string;
    /** The last line; {site} is the site's address. */
    footer: string;
  };
};

export type ProjectStatus = "In progress" | "Completed";

export type CaseStudySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

/** How far along one area of a project is. Never mark designed work as built. */
export type BuildStatus = "Built" | "Partly built" | "Designed" | "Not started";

export type ReleaseStatus = "Built" | "In progress" | "Designed" | "Planned";

export type ArchitectureLayer = {
  name: string;
  /** Two short lines (about 24 characters each) describing what lives in the layer. */
  contents: [string, string];
};

export type Principle = {
  name: string;
  summary: string;
  status: BuildStatus;
};

export type StatusRow = {
  area: string;
  status: BuildStatus;
  note?: string;
};

export type Release = {
  name: string;
  scope: string;
  status: ReleaseStatus;
  note?: string;
};

/** Long-form write-up shown at /projects/[slug]. Every part except intro is optional. */
export type CaseStudy = {
  intro: string;
  /** One honest sentence about how much is actually built. */
  statusSummary?: string;
  problem?: CaseStudySection;
  architecture?: {
    /** Ordered from the innermost layer outwards; each layer references only the previous one. */
    layers: ArchitectureLayer[];
    /** The dependency rule in plain words; also the diagram caption and description. */
    rule: string;
    points?: string[];
  };
  principles?: Principle[];
  statusTable?: StatusRow[];
  roadmap?: Release[];
  /** Any further sections, rendered after the roadmap. */
  sections?: CaseStudySection[];
};

/**
 * The panel drawn beside a project: a small terminal window with a few lines of text,
 * typed out in order when the window scrolls into view. Facts only: every line must be
 * true of the project and backed by its description or highlights. Keep the lines short:
 * the typing always ends within three seconds, so more text only makes it faster.
 */
export type ProjectVisual = {
  /** Text in the window's title bar, for example a command. */
  title: string;
  lines: string[];
  /**
   * When true the window shows a steering wheel turning through example angles in place
   * of the lines (steering-wheel.tsx), labelled as an illustration. Leave `lines` empty.
   */
  steering?: boolean;
};

export type Project = {
  name: string;
  tagline: string;
  status: ProjectStatus;
  /** Shown next to the project when present. */
  visual?: ProjectVisual;
  /** URL segment for the case study page; only projects with a caseStudy need one. */
  slug?: string;
  tech: string[];
  description: string;
  /** Work that is actually built and verified. */
  highlights: string[];
  /** Work that is designed but not built yet. Never shown as done. */
  planned?: string[];
  links?: {
    repo?: string;
    demo?: string;
  };
  caseStudy?: CaseStudy;
  /**
   * false keeps the project off the homepage's Projects section while its case study
   * page stays. BillingRecon has its own sections on the homepage (product, features)
   * since Step 4 of the Ashvanta site, 2026-11-28.
   */
  onHome?: boolean;
};

/**
 * BillingRecon on the homepage: the product and features sections (Step 4 of the Ashvanta
 * site, 2026-11-28). Every claim must be built, and say so, or say "Planned": the source
 * is BILLINGRECON-FACTS.md beside the repository. "Built" means built and tested in
 * development; no hospital uses it yet, and the site must not suggest one does.
 */
export type FeatureIcon =
  | "patients"
  | "catalogue"
  | "bills"
  | "payments"
  | "approvals"
  | "ledger"
  | "reports"
  | "printing"
  | "shift"
  | "export"
  | "security"
  | "import";

export type FeatureStatus = "Built" | "Planned";

export type ProductFeature = {
  icon: FeatureIcon;
  title: string;
  text: string;
  status: FeatureStatus;
  /** A limit worth saying out loud, shown under the text, for example "not yet tried in Tally". */
  note?: string;
};

export type Product = {
  /** What BillingRecon is, in one sentence: the section's intro beside its heading. */
  intro: string;
  /** Who uses it, and who it does not serve yet. */
  audience: string;
  /** The heading over the promises. */
  promiseHeading: string;
  /** The financial-correctness rules in plain words, each built. */
  promises: { title: string; text: string }[];
  /** The honest status line: built and tested in development, not yet at a hospital. */
  status: string;
  /** What the second button says: the way to the features. */
  featuresAction: string;
  /** The features section's intro beside its heading. */
  featuresIntro: string;
  features: ProductFeature[];
  /** The heading over the "how it works" steps. */
  flowHeading: string;
  /** The everyday flow of money through BillingRecon, in order. */
  flow: { name: string; text: string }[];
  /** The heading over the releases. */
  releasesHeading: string;
  releases: Release[];
};

export type Education = {
  degree: string;
  institution: string;
  start: string;
  end: string;
  detail?: string;
};

export type Certification = {
  name: string;
  issuer: string;
  detail?: string;
};

/**
 * The company: Ashvanta Technologies. Its words are used by the logo
 * (src/components/logo.tsx), the site's metadata (src/app/layout.tsx) and the
 * Organization in the structured data (src/components/site-json-ld.tsx). The drawing of
 * the mark lives in the code (src/lib/logo-shapes.ts); everything that is text lives here.
 */
export type Brand = {
  /** The company's full name as written in running text. */
  name: string;
  /**
   * The word set beside the mark in the logo. Only the first word of the name: at the
   * sizes the logo is used on the page, the full lockup's "TECHNOLOGIES" and tagline
   * shrink past reading (the owner's choice, 2026-11-28).
   */
  wordmark: string;
  /** The second line of the large logo, set in spaced capitals under the wordmark. */
  kind: string;
  /** The company's line: "Technology for a Better Tomorrow." */
  tagline: string;
  /**
   * One or two sentences on what the company does, for search results and link
   * previews. Every claim must be true of the BillingRecon repository today.
   */
  description: string;
  /**
   * What a screen reader calls the logo where it is a link, as in the header. It must
   * contain the wordmark's letters, so that what is heard matches what is seen.
   */
  label: string;
};

export type Profile = {
  name: string;
  title: string;
  /** The company, Ashvanta Technologies: the logo's words and the site's name. */
  brand: Brand;
  tagline: string;
  location: string;
  /** Short status shown as a pill in the hero. */
  availability: string;
  hero: Hero;
  /** BillingRecon's sections on the homepage. */
  product: Product;
  /** The first sentence doubles as the search-result description, so keep it self-contained. */
  summary: string;
  /** One or two sentences for the hero, under the name and title. */
  pitch: string;
  /** Shown in the About section after the summary. */
  currentlyBuilding: string;
  /** Shown in the Services section above the cards. */
  servicesIntro: string;
  /** Shown in the Contact section above the buttons. */
  contactNote: string;
  /**
   * Absolute address of the live site, for example "https://ashishsingh.dev". Leave it
   * empty until you own a domain: the Vercel production URL is used automatically.
   */
  siteUrl: string;
  links: Links;
  /**
   * Every homepage section, in page order: its anchor id, its menu label and its heading.
   * A section's number ("01", "02" ...) is its place in this list, so every section that
   * uses the Section component must be listed here, in the menu or not.
   */
  nav: NavItem[];
  /**
   * The sections the header's menu links to, in the menu's own order (it need not be the
   * page's). The rest of nav stays on the page, numbered, but out of the menu. Since Step 3
   * of the Ashvanta site (2026-11-28) the CV sections are not in the menu.
   */
  menu: SectionId[];
  labels: Labels;
  services: Service[];
  pipeline: Pipeline;
  ask: Ask;
  contactForm: ContactForm;
  /**
   * The small words that join a role to its place: "at" before a company, "in" before a
   * location. Used by the hero's "currently" line and the Experience header.
   */
  roleJoiners: { company: string; location: string };
  experience: Experience[];
  /**
   * The order here does not matter: the Skills section gives the larger cells to the
   * groups that hold more.
   */
  skills: SkillCategory[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  achievements: string[];
};

/**
 * BillingRecon's releases, shared by the homepage's features section (product.releases) and
 * the case study's roadmap, so the two can never disagree. Release 1 is built; the rest are
 * planned (BILLINGRECON-FACTS.md section 7).
 */
const billingReconReleases: Release[] = [
  {
    name: "Release 1",
    scope:
      "Hospitals, users and roles; patients and self-pay payers; the service catalogue; bills, credit notes, payments with allocation, reversals, refunds and adjustments; the double-entry ledger with its reconciliation; the audit trail; reports, the dashboard and the screens for all of it.",
    status: "Built",
    note: "Tagged v1.0.0 on 24 November 2026. Built since: the redesigned screens, printing on letterhead, import and onboarding, cashier shifts and day-end, two-step sign-in, the Tally export, nightly reconciliation alerts and tables to filter and sort.",
  },
  {
    name: "R2 · Reconciliation",
    scope:
      "Bank and payment-gateway statements imported and matched to payments, with suspense cash and reconciliation reports.",
    status: "Planned",
  },
  {
    name: "R3 · Recovery",
    scope:
      "The ageing of dues, reminders, promises to pay, disputes, and write-offs under approval.",
    status: "Planned",
  },
  {
    name: "R4 · Insurance and corporate",
    scope:
      "Insurers, TPAs and corporate accounts: claims, pre-authorisation, split billing, payer pricing and credit limits.",
    status: "Planned",
  },
  {
    name: "R5 · Maturity",
    scope:
      "Period close, hardening, metrics and tracing, backup and recovery drills, and GST and compliance reporting.",
    status: "Planned",
  },
];

export const profile: Profile = {
  name: "Ashish Singh",
  title: "Software Engineer",
  brand: {
    name: "Ashvanta Technologies",
    wordmark: "Ashvanta",
    kind: "Technologies",
    tagline: "Technology for a Better Tomorrow.",
    description:
      "Ashvanta Technologies builds BillingRecon, billing, payments and receivables software for hospitals and clinics in India.",
    label: "Ashvanta Technologies, home page",
  },
  tagline: "Full-Stack · .NET · React · Cloud · AI",
  location: "New Delhi, India",
  availability: "Available for projects",
  hero: {
    badge: "Custom software · AI · BillingRecon",
    greeting: "Hello! I am",
    founderOf: ", founder of",
    lead: "A developer who",
    statement: "Turns ideas into working",
    highlight: "software",
    note: "Web apps, APIs, integrations and AI features built to order, and BillingRecon, our billing and receivables software for hospitals and clinics in India.",
    rolePrefix: "We build:",
    roles: [
      "web apps and APIs",
      "AI features with RAG",
      "hospital billing apps",
    ],
    closing:
      "From a single feature to a complete product: tell us what you need, or ask for a demo of BillingRecon.",
    primaryAction: "Request a demo",
    secondaryAction: "See BillingRecon",
    fieldLabels: [
      "RAG",
      ".NET",
      "AWS",
      "Docker",
      "React",
      "LLMs",
      "SQL Server",
      "C#",
      "Node.js",
      "Python",
    ],
    fieldQueryLabel: "query",
  },
  product: {
    intro:
      "BillingRecon is billing, payments and receivables software for hospitals and clinics in India.",
    audience:
      "It is made for a hospital's billing clerks, cashiers, supervisors and administrators, and for read-only viewers such as auditors. Today every payer is the patient or a guarantor; insurers, TPAs and corporate accounts come in release 4.",
    promiseHeading: "The money is always right",
    promises: [
      {
        title: "Exact rupees and paise",
        text: "Amounts are exact decimals, rounded once per line, never floating point.",
      },
      {
        title: "Nothing posted is changed",
        text: "A posted bill or payment is never edited or deleted; a mistake is put right by a new document.",
      },
      {
        title: "A double-entry ledger",
        text: "Every rupee is recorded twice, in the same step as its document, and the balances are checked against it every night.",
      },
      {
        title: "A second person approves",
        text: "Refunds, adjustments, credit notes and large bills take effect only when someone other than their author approves.",
      },
      {
        title: "No gaps in the numbers",
        text: "Bill, payment and refund numbers run without gaps for each hospital and financial year.",
      },
      {
        title: "Each hospital apart",
        text: "One installation serves many hospitals, and no hospital ever sees another's data.",
      },
    ],
    status: "Built and tested in development; not yet in use at a hospital.",
    featuresAction: "See the features",
    featuresIntro:
      "Twelve parts, all built and tested in development. Each card says what it does today.",
    features: [
      {
        icon: "patients",
        title: "Patients and payers",
        text: "Register patients with an MRN and set up who pays: the patient or a guarantor. People are deactivated, never deleted.",
        status: "Built",
      },
      {
        icon: "catalogue",
        title: "Service catalogue",
        text: "A price list of services with their tax rate, picked straight into a bill.",
        status: "Built",
      },
      {
        icon: "bills",
        title: "Bills and credit notes",
        text: "Draft a bill from the catalogue or free-text lines, post it with its number, and reduce a posted bill only by an approved credit note.",
        status: "Built",
      },
      {
        icon: "payments",
        title: "Payments and allocation",
        text: "Cash, card, UPI, bank transfer or cheque, applied to bills oldest first; money not yet applied is kept and reported.",
        status: "Built",
      },
      {
        icon: "approvals",
        title: "Refunds, reversals and adjustments",
        text: "Refunds, a bounced cheque's reversal, discounts, write-offs and rounding, each taking effect only after a second person approves.",
        status: "Built",
      },
      {
        icon: "ledger",
        title: "Receivables ledger",
        text: "Every posting goes into a double-entry ledger in the same step, and each night a reconciliation checks every hospital's balances against it.",
        status: "Built",
      },
      {
        icon: "reports",
        title: "Dashboard and reports",
        text: "Headline figures, billing against collections, the ageing of dues, and registers to filter, sort and export to CSV.",
        status: "Built",
      },
      {
        icon: "printing",
        title: "Printing on letterhead",
        text: "Bills, receipts and refund vouchers with the hospital's logo and signature, on A4, A5 or an 80 mm roll; a later copy says Duplicate.",
        status: "Built",
      },
      {
        icon: "shift",
        title: "Cashier shift and day-end",
        text: "Open a shift with a float, close it with a count of the cash; a difference needs another person's approval. Day-end report and closing slip.",
        status: "Built",
      },
      {
        icon: "export",
        title: "Accountant's export for Tally",
        text: "One balanced voucher per ledger posting in Tally's XML format, with the ledger names set for each hospital.",
        status: "Built",
        note: "Not yet tried in Tally itself.",
      },
      {
        icon: "security",
        title: "Users, roles and two-step sign-in",
        text: "Five roles with their own permissions, a code from an authenticator app for administrators and supervisors, and sign-out that ends every session.",
        status: "Built",
      },
      {
        icon: "import",
        title: "Import and onboarding",
        text: "Bring in patients, guarantors and opening balances from an old system, each batch approved by a second person.",
        status: "Built",
        note: "So far tried on a sample hospital's data only.",
      },
    ],
    flowHeading: "How it works",
    flow: [
      { name: "Bill", text: "Drafted from the catalogue" },
      { name: "Post", text: "Its number and its ledger lines" },
      { name: "Payment", text: "Cash, card, UPI or cheque" },
      { name: "Allocate", text: "To the bills, oldest first" },
      { name: "Receipt", text: "Printed on the letterhead" },
      { name: "Nightly check", text: "Balances against the ledger" },
    ],
    releasesHeading: "Releases",
    releases: billingReconReleases,
  },
  summary:
    "Software Engineer building production software across the stack with C#, .NET, SQL Server, AngularJS and React, with experience in Docker, Redis and AWS. In my current role I develop and maintain a large healthcare ERP: billing workflows, payment and fiscal e-invoicing integrations, WhatsApp messaging, scheduled reporting and production debugging. I am also available for projects, from full-stack web apps and APIs to containerised microservices, cloud deployments on AWS, and AI features built on retrieval-augmented generation (RAG) and LLMs.",
  pitch:
    "I build software end to end: web apps, APIs, third-party integrations, containerised microservices and AI features powered by RAG and LLMs. If you have something to build, I can help.",
  currentlyBuilding:
    "Building BillingRecon, billing and receivables software for hospitals and clinics in India: release 1 is built; release 2, bank reconciliation, is planned.",
  servicesIntro:
    "Have an idea, or a problem in software you already run? This is the kind of work I take on, from a single feature to a complete product.",
  contactNote:
    "Have something to build, or need another developer on your team? Call or email me, or send the details with the form below.",
  siteUrl: "",
  links: {
    email: "ashishsingh17708@gmail.com",
    phone: "+91 95870 77198",
    linkedin: "https://www.linkedin.com/in/ashish-singh-430864230",
    github: "https://github.com/Ashish-singh123",
  },
  nav: [
    { id: "product", label: "BillingRecon" },
    { id: "features", label: "Features", heading: "What BillingRecon does" },
    { id: "about", label: "About" },
    { id: "services", label: "Services", heading: "What I can build" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education", heading: "Education & Certifications" },
    { id: "contact", label: "Contact" },
  ],
  menu: ["product", "features", "services", "about", "contact"],
  labels: {
    about: {
      role: "Role",
      focus: "Focus",
      location: "Based in",
      availability: "Status",
      now: "Right now",
    },
    education: {
      education: "Education",
      certifications: "Certifications",
      achievements: "Achievements",
    },
    services: {
      stack: ["UI", "API", "Database"],
    },
    experience: {
      outline: "In this role",
      technologies: "Technologies",
    },
    header: {
      main: "Main",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    copy: {
      idle: "Copy email",
      done: "Copied",
      copied: "Email copied",
      failed: "Copy failed, select the address instead",
    },
    contact: {
      links: "Contact links",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    footer: {
      nav: "Footer",
      links: ["product", "contact"],
    },
    palette: {
      open: "Search",
      shortcut: "Ctrl K",
      title: "Command palette",
      placeholder: "Type a command or search",
      empty: "No results",
      groups: {
        sections: "Go to",
        projects: "Projects",
        contact: "Contact",
        appearance: "Appearance",
      },
      linkedin: "Open LinkedIn",
      github: "Open GitHub",
      theme: "Switch theme",
    },
    caseStudy: {
      back: "Back to projects",
      technologies: "Technologies",
      contents: "On this page",
      architecture: "Architecture",
      principles: "Key principles",
      status: "Built vs designed",
      roadmap: "Roadmap",
      diagramTitle: "Architecture layers",
    },
    projects: {
      featured: "Featured project",
      caseStudy: "Read the case study",
      repo: "GitHub",
      demo: "Live demo",
      technologies: "Technologies",
      replay: "Replay",
      steering: {
        description:
          "Illustration: a steering wheel turning to a predicted steering angle, with the angle in degrees beside it. The motion is an example, not model output.",
        caption: "Predicted steering angle",
        illustrative: "Illustrative, not model output",
        pause: "Pause",
        play: "Play",
      },
    },
  },
  services: [
    {
      icon: "fullStack",
      title: "Full-stack web applications",
      description:
        "Complete web apps from the database to the UI: React or AngularJS front ends on .NET or Node.js back ends.",
    },
    {
      icon: "backend",
      title: "Backend APIs and databases",
      description:
        "REST APIs, business logic and well-designed data on SQL Server, MySQL or MongoDB, with stored procedures and queries tuned to stay fast.",
    },
    {
      icon: "integrations",
      title: "Third-party integrations",
      description:
        "Payments, e-invoicing and messaging wired into your product, such as card terminals, fiscal e-invoicing, and WhatsApp OTP and notifications.",
    },
    {
      icon: "cloud",
      title: "Cloud and microservices",
      description:
        "Services containerised with Docker and run as microservices, with Redis for caching, and deployments on AWS using EC2, S3, RDS and Lambda.",
    },
    {
      icon: "ai",
      title: "AI features with RAG and LLMs",
      description:
        "AI built into your software: chat and search over your own documents using retrieval-augmented generation (RAG), and LLM-powered features inside existing workflows.",
    },
    {
      icon: "automation",
      title: "Automation and reporting",
      description:
        "Scheduled jobs and recurring reports that run on their own and reach the right people on time.",
    },
    {
      icon: "support",
      title: "Support for live systems",
      description:
        "Production debugging and fixes for software that is already in use, plus performance tuning where it is slow.",
    },
  ],
  pipeline: {
    service: "ai",
    title: "How a RAG feature answers a question",
    stages: [
      {
        icon: "query",
        name: "Query",
        text: "Someone asks a question in plain words.",
      },
      {
        icon: "retrieval",
        name: "Retrieval",
        text: "The question is compared with your documents, and the closest passages are fetched.",
      },
      {
        icon: "context",
        name: "Context",
        text: "Those passages go into the prompt, right beside the question.",
      },
      {
        icon: "model",
        name: "LLM",
        text: "The model writes its answer from what it was given, not from memory.",
      },
      {
        icon: "answer",
        name: "Answer",
        text: "The reply comes back with its sources, so it can be checked.",
      },
    ],
    replayLabel: "Replay",
  },
  ask: {
    heading: "Ask about Ashish",
    aiLabel: "AI-generated, answers only from this site",
    intro:
      "Have a quick question about my experience, skills or projects? Ask it here and an AI assistant will answer from what is written on this site.",
    inputLabel: "Your question",
    placeholder: "For example: what has he built with .NET?",
    submit: "Ask",
    stop: "Stop",
    suggestions: [
      "What kind of work does Ashish take on?",
      "What has he built with C# and .NET?",
      "What is BillingRecon, and how far along is it?",
      "Which AI skills does he have?",
      "What experience does he have with Docker, Redis and AWS?",
    ],
    dataNotice:
      "Questions are sent to Google's Gemini API to write the answer, and Google may use them to improve its products. Please do not enter personal information. The answers are written by an AI model, not by Ashish, and can be wrong.",
    busy: "The assistant is busy right now. Please try again in a minute.",
    unavailable:
      "The assistant is not available at the moment. You can reach me through the Contact section.",
    error: "Something went wrong. Please try again.",
    empty: "The assistant had no answer for that. Try asking it another way.",
  },
  contactForm: {
    heading: "Send your requirement",
    intro:
      "Tell me what you need and I will reply by email. A few lines are enough to start.",
    optional: "optional",
    fields: {
      name: {
        label: "Name",
        placeholder: "Your name",
        error: "Please enter your name, {min} to {max} characters.",
      },
      email: {
        label: "Email",
        placeholder: "you@example.com",
        error: "Please enter a valid email address.",
      },
      phone: {
        label: "Phone",
        placeholder: "With the country code",
        error: "Use only digits, spaces and + - ( ) here, up to {max} characters.",
      },
      company: {
        label: "Company",
        placeholder: "Company or organisation",
        error: "Please keep this to {max} characters.",
      },
      service: {
        label: "What you need",
        error: "Please choose what you need.",
      },
      budget: {
        label: "Budget range",
        placeholder: "For example: 3,000 USD",
        error: "Please keep this to {max} characters.",
      },
      timeline: {
        label: "Timeline",
        error: "Please choose one of the options.",
      },
      details: {
        label: "Project details",
        placeholder: "What should it do, who is it for, and what exists already?",
        error: "Please describe the project in {min} to {max} characters.",
      },
    },
    choose: "Choose one",
    otherService: "Other",
    timelines: [
      { key: "asap", label: "As soon as possible" },
      { key: "month", label: "Within a month" },
      { key: "quarter", label: "1 to 3 months" },
      { key: "unsure", label: "Not sure yet" },
    ],
    submit: "Send requirement",
    sending: "Sending",
    checkFields: "Please check the marked fields.",
    sent: "Thank you. Your requirement has been sent, and I will reply to the email address you gave.",
    failed:
      "Your requirement could not be sent. Please try again, or use the email address above.",
    unavailable:
      "The form is not available at the moment. Please use the email address above.",
    busy: "Too many messages were sent from this connection. Please try again later, or use the email address above.",
    emailInstead: "Email me instead",
    noScript:
      "The form needs JavaScript. Please use the email address or the phone number above.",
    privacy:
      "Your details are emailed to me through Resend, an email delivery service, and are not stored on this site.",
    paletteLabel: "Send a requirement",
    email: {
      subject: "New requirement from {name}: {service}",
      notGiven: "Not given",
      footer: "Sent from the form on {site}.",
    },
  },
  roleJoiners: { company: "at", location: "in" },
  experience: [
    {
      // No company on purpose: the current employer is not named anywhere on the site.
      role: "Software Engineer",
      location: "New Delhi, India",
      start: "Jul 2025",
      end: "Present",
      context: "Healthcare ERP product",
      tech: [
        "C#",
        ".NET Framework",
        "ASP.NET Web Forms",
        "Web API",
        "ASMX",
        "SQL Server",
        "AngularJS",
      ],
      highlights: [
        {
          icon: "modules",
          title: "Healthcare ERP modules",
          text: "Developed and maintained modules of a large healthcare ERP using C#, ASP.NET Web Forms, ASMX/Web API services, SQL Server and AngularJS, implementing business logic, service endpoints and database operations across billing, OPD and IPD workflows.",
        },
        {
          icon: "sql",
          title: "T-SQL and stored procedures",
          text: "Wrote and optimized complex T-SQL queries and stored procedures using joins, CTEs, window functions (ROW_NUMBER, RANK, LAG/LEAD), aggregations and correlated subqueries to drive billing, vendor-rate and reporting features over transactional production data.",
        },
        {
          icon: "invoice",
          title: "Fiscal e-invoicing",
          text: "Integrated government fiscal e-invoicing, through a third-party provider, into the billing flow, implementing configuration-driven enablement, post-commit submission and QR-code rendering on printed invoices while guarding against duplicate fiscal submissions on retry.",
        },
        {
          icon: "kiosk",
          title: "Self-service OPD kiosk",
          text: "Built a self-service OPD kiosk flow with WhatsApp OTP-based login and Pine Labs card-terminal payment integration, handling OTP issuance and verification, terminal state and payment confirmation against the billing module.",
        },
        {
          icon: "messaging",
          title: "WhatsApp notification engine",
          text: "Implemented a configurable WhatsApp notification engine over event-driven queue tables, supporting event routing, group CC rules and queue-driven message processing for operational alerts and reports.",
        },
        {
          icon: "reports",
          title: "Scheduled report automation",
          text: "Automated recurring report generation using the Quartz scheduler and Crystal Reports, moving long-running report work off the request path and delivering output to stakeholders on a fixed schedule.",
        },
        {
          icon: "debugging",
          title: "Production debugging",
          text: "Debugged and resolved production issues across the application, including a cross-application logout defect fixed through session cookie isolation, and access-control defects in shared restrict/allow permission panels.",
        },
      ],
    },
  ],
  skills: [
    {
      category: "Languages",
      items: ["C#", "SQL (T-SQL)", "JavaScript", "Python", "C++", "C"],
    },
    {
      category: "Backend & Web",
      items: [
        ".NET Framework",
        "ASP.NET",
        "ASP.NET Web Forms",
        "ASP.NET Core",
        "EF Core",
        "Web API",
        "ASMX",
        "REST APIs",
        "API Integration",
        "Node.js",
        "Express.js",
        "JWT",
      ],
    },
    {
      category: "Frontend",
      items: ["AngularJS", "JavaScript", "jQuery", "React", "HTML/CSS"],
    },
    {
      category: "Databases",
      items: [
        "SQL Server",
        "Stored Procedures",
        "Query Optimization",
        "MySQL",
        "MongoDB",
      ],
    },
    {
      category: "Cloud & Microservices",
      items: [
        "Docker",
        "Microservices",
        "Redis",
        "AWS",
        "EC2",
        "S3",
        "RDS",
        "Lambda",
      ],
    },
    {
      category: "AI & Machine Learning",
      items: [
        "LLM integration",
        "RAG",
        "Machine Learning",
        "Deep Learning",
        "Computer Vision",
        "CNNs",
        "Transfer Learning",
        "TensorFlow",
        "Keras",
        "OpenCV",
        "NumPy",
      ],
    },
    {
      category: "Tools & Practices",
      items: [
        "Git",
        "Visual Studio",
        "SSMS",
        "Quartz Scheduler",
        "Crystal Reports",
        "Postman",
        "Production Support & Debugging",
        "Agile",
      ],
    },
  ],
  projects: [
    {
      name: "BillingRecon",
      tagline: "Billing, payments and receivables for hospitals in India",
      status: "In progress",
      slug: "billingrecon",
      // BillingRecon has its own sections on the homepage (product, features); this entry
      // feeds its case study page and the Ask box.
      onHome: false,
      visual: {
        title: "billingrecon",
        lines: [
          "Release 1: v1.0.0, 24 November 2026",
          "Ledger: double-entry, checked every night",
          "Refunds and adjustments: maker-checker",
          "Built and tested in development",
        ],
      },
      tech: [
        ".NET 10",
        "ASP.NET Core",
        "EF Core",
        "SQL Server",
        "React",
        "TypeScript",
        "xUnit",
        "Playwright",
        "Docker",
        "Multi-tenant",
      ],
      description:
        "Billing, payments and receivables software for hospitals and clinics in India: bills, credit notes, payments, refunds and adjustments under maker-checker, a double-entry receivables ledger checked every night, reports, printing on letterhead and an export for Tally. Built and tested in development; not yet in use at a hospital.",
      highlights: [
        "Bills and credit notes with gapless numbers per hospital and financial year, and payments by cash, card, UPI, bank transfer or cheque, allocated to bills oldest first.",
        "Refunds, reversals and adjustments that take effect only after a second, different person approves.",
        "A double-entry receivables ledger written in the same step as each document, with a reconciliation of every hospital's balances each night.",
        "An append-only audit trail, and no hard deletes of financial records.",
        "Dashboard and reports with CSV export, and lists and reports to filter, sort and choose columns.",
        "Printing of bills, receipts and refund vouchers on the hospital's letterhead, on A4, A5 or an 80 mm roll.",
        "Cashier shifts with a day-end report, two-step sign-in for administrators and supervisors, and an accountant's export in Tally's XML format (not yet tried in Tally itself).",
        "A React and TypeScript front end in light and dark themes, checked with Playwright and axe for accessibility.",
      ],
      planned: [
        "Release 2: bank and payment-gateway statements imported and matched to payments.",
        "Release 3: recovery of dues, with reminders, promises to pay and disputes.",
        "Release 4: insurers, TPAs and corporate accounts, with claims and split billing.",
        "Release 5: period close, metrics and tracing, recovery drills, and GST and compliance reporting.",
      ],
      caseStudy: {
        intro:
          "BillingRecon is billing, payments and receivables software for hospitals and clinics in India, built by Ashvanta Technologies on ASP.NET Core, EF Core and SQL Server with a React front end. It is the single source of truth for what each patient and guarantor owes.",
        statusSummary:
          "Honest status: release 1 and the work after it are built and tested in development; BillingRecon is not yet in use at a hospital. Bank reconciliation, recovery, and insurance and corporate billing are planned.",
        problem: {
          heading: "The problem",
          paragraphs: [
            "Small clinics, labs and nursing homes bill patients, insurers and corporates, and collect partial or lump-sum payments through cash, card, UPI, cheque, bank transfer and insurer settlements. Over time the balances drift, and money is lost to unallocated payments, untracked dues, duplicate entries and follow-ups that never happen.",
            "BillingRecon records every financial event immutably and keeps balances provably correct today; reconciling them against bank and gateway statements, and driving the recovery of dues, are its next releases.",
          ],
        },
        architecture: {
          layers: [
            {
              name: "Domain",
              contents: ["Entities and rules", "References nothing"],
            },
            {
              name: "Application",
              contents: ["Use cases and DTOs", "Ports (interfaces)"],
            },
            {
              name: "Infrastructure",
              contents: ["EF Core, SQL, logging", "Implements the ports"],
            },
            {
              name: "Api",
              contents: ["Controllers, middleware", "Composition root"],
            },
          ],
          rule: "Each layer references only the layer inside it: Api references Infrastructure, Infrastructure references Application, Application references Domain, and Domain references nothing. Architecture tests fail the test run when any arrow is violated.",
          points: [
            "A modular monolith with Clean Architecture layers in four projects: Domain, Application, Infrastructure and Api. Module boundaries are folders and namespaces, and automated architecture tests enforce them.",
            "Multi-tenant from the first table: every row belongs to one tenant, reads go through a global query filter, saves pass a tenant write guard, and every change is audit-stamped.",
            "A Result type with typed errors carries business failures; exceptions stay reserved for bugs and infrastructure faults. Errors reach the client as RFC 9457 problem details with stable error codes.",
            "Every request carries a correlation id that appears on each log line and error response, and logs are structured JSON with personal data masked before it is written.",
          ],
        },
        principles: [
          {
            name: "Decimal money",
            status: "Built",
            summary:
              "Amounts are exact decimals, never floating point. Rounding happens once, at line level, and a total is the sum of the rounded lines, so paise never disappear silently.",
          },
          {
            name: "Immutable records",
            status: "Built",
            summary:
              "Posted financial records are never updated or deleted. A correction is a new record, such as a reversal, a credit note or an adjustment, and each one writes its own ledger entry in the same database transaction.",
          },
          {
            name: "Idempotency",
            status: "Built",
            summary:
              "Every request that moves money carries an Idempotency-Key. A replayed request returns the stored response instead of creating a second payment, which is what makes retries safe.",
          },
          {
            name: "Concurrency control",
            status: "Built",
            summary:
              "Every table carries a row version. The API returns it as an ETag and requires If-Match on updates, so two people editing the same bill get a 409 Conflict instead of a silent lost update.",
          },
          {
            name: "Gapless numbering",
            status: "Built",
            summary:
              "Bill, payment, credit note, adjustment and refund numbers come from a number series per hospital, document type and Indian financial year, with no gaps: a failed posting gives its number back.",
          },
          {
            name: "Maker-checker",
            status: "Built",
            summary:
              "Reversals, adjustments, credit notes, refunds and bills above a hospital's threshold take effect only when a second person approves them, and neither the requester nor the document's author can approve.",
          },
        ],
        statusTable: [
          {
            area: "Engineering foundation: layout, architecture tests, logging with PII masking, error contract, tenant isolation",
            status: "Built",
          },
          { area: "Users, roles and JWT authentication", status: "Built" },
          { area: "Patients, payers and the service catalogue", status: "Built" },
          { area: "Bills, line items, credit notes", status: "Built" },
          { area: "Payments, allocation, reversals, refunds", status: "Built" },
          {
            area: "Receivables ledger and cached, verifiable balances",
            status: "Built",
          },
          {
            area: "Adjustments and maker-checker approvals",
            status: "Built",
          },
          {
            area: "Idempotency keys, ETag concurrency, gapless number series",
            status: "Built",
          },
          {
            area: "Reports, dashboard and CSV export",
            status: "Built",
          },
          {
            area: "React front end, light and dark themes, accessibility checks",
            status: "Built",
          },
          {
            area: "Printing on letterhead, import and onboarding, cashier shifts and day-end",
            status: "Built",
          },
          {
            area: "Two-step sign-in, accountant's export for Tally, nightly reconciliation alerts",
            status: "Built",
            note: "The Tally file has not yet been tried in Tally itself",
          },
          {
            area: "Docker Compose for the whole stack, integration tests on SQL Server 2022",
            status: "Built",
            note: "Run on SQL Server 2022 on 24 November 2026; later database tests ran on LocalDB",
          },
          {
            area: "CI workflow and production deployment files",
            status: "Partly built",
            note: "The files exist; neither has run yet",
          },
          {
            area: "Bank reconciliation, dues recovery, insurance and corporate billing",
            status: "Not started",
            note: "Releases 2 to 4",
          },
        ],
        roadmap: billingReconReleases,
        sections: [
          {
            heading: "Testing approach",
            paragraphs: [
              "Unit tests use xUnit with Shouldly, architecture tests guard the layer boundaries, integration tests run against SQL Server 2022 in Docker through Testcontainers, and browser tests use Playwright with axe accessibility checks. The EF in-memory provider is deliberately avoided because it does not enforce constraints or transactions.",
              "On 24 November 2026 the backend ran on .NET 10 and SQL Server 2022: 1,277 of 1,280 integration tests passed, and the three timing tests that failed were fixed afterwards. The database tests of later work have so far run on LocalDB, and the CI workflow has not yet run on GitHub.",
            ],
          },
        ],
      },
    },
    {
      name: "Steering-angle prediction CNN",
      tagline: "An end-to-end driving model after NVIDIA's architecture",
      status: "Completed",
      visual: {
        title: "steering-model",
        lines: [],
        steering: true,
      },
      tech: ["Python", "TensorFlow", "Keras", "OpenCV", "NumPy", "CNN"],
      description:
        "A steering-angle prediction model based on the NVIDIA end-to-end driving architecture, trained on a custom driving dataset with preprocessing and augmentation.",
      highlights: [
        "Developed a steering-angle prediction model based on NVIDIA's end-to-end driving architecture using convolutional neural networks.",
        "Trained on a custom driving dataset with preprocessing, augmentation and normalization pipelines to improve model generalization.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech, Information Technology",
      institution: "Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur",
      start: "2021",
      end: "2025",
    },
  ],
  certifications: [
    {
      name: "Deep Learning (Elite)",
      issuer: "NPTEL, IIT Ropar",
      detail: "12-week course",
    },
    {
      name: "Computer Vision (Elite)",
      issuer: "NPTEL, IIT Kharagpur",
      detail: "12-week course",
    },
  ],
  // Only real, verifiable work goes here: each line restates something from the
  // experience or projects above.
  achievements: [
    "Integrated fiscal e-invoicing into the billing flow of a production healthcare ERP, with safeguards against duplicate submissions on retry.",
    "Built a self-service OPD kiosk flow with WhatsApp OTP login and Pine Labs card-terminal payments.",
    "Built a configurable WhatsApp notification engine on event-driven queue tables for operational alerts and reports.",
    "Built release 1 of BillingRecon: billing, payments, refunds and a double-entry receivables ledger for hospitals.",
  ],
};
