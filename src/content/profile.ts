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
 * The words of the hero. The role in its "currently" line, and the company or location
 * after it, come from experience.
 */
export type Hero = {
  /** Small line before the name, for example "Hello! I am". */
  greeting: string;
  /** Lead-in above the big statement. */
  lead: string;
  /** The big statement, without its final highlighted word. */
  statement: string;
  /** The last word of the statement, drawn in the accent gradient and circled. */
  highlight: string;
  /** One line under the statement. */
  note: string;
  /** Start of the typed line, for example "I'm". */
  rolePrefix: string;
  /**
   * Roles typed one after another, each with its article ("a" or "an"). The last one
   * stays on screen, and is also what visitors who prefer reduced motion see.
   */
  roles: string[];
  /** Words before the current role, for example "Currently working as a". */
  currentLabel: string;
  /** Text of the main button, which leads to the Contact section. */
  primaryAction: string;
  /** Text of the second button, which leads to the Projects section. */
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

export type ReleaseStatus = "In progress" | "Designed" | "Planned";

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
 * The words of the Ashline logo (src/components/logo.tsx). The drawing itself, a hexagon
 * with the letter A, lives in the code; everything that is text lives here.
 */
export type Brand = {
  /** The brand's name as written in running text. */
  name: string;
  /**
   * The wordmark, in two halves set side by side with no space between them: the first
   * in the text colour and a medium weight, the second in the accent colour and a
   * regular weight.
   */
  wordmark: { lead: string; accent: string };
  /**
   * The line under the wordmark, in three parts joined by spaces; the middle part is set
   * in the accent colour. Not to be confused with profile.tagline, the list of skills.
   */
  tagline: { before: string; accent: string; after: string };
  /**
   * What a screen reader calls the logo where it is a link, as in the header. It must
   * contain the wordmark's letters, so that what is heard matches what is seen.
   */
  label: string;
};

export type Profile = {
  name: string;
  title: string;
  /** The Ashline brand: the words of the logo. The site's title is still `name`. */
  brand: Brand;
  tagline: string;
  location: string;
  /** Short status shown as a pill in the hero. */
  availability: string;
  hero: Hero;
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
  /** Section links shown in the header, in page order. */
  nav: NavItem[];
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

export const profile: Profile = {
  name: "Ashish Singh",
  title: "Software Engineer",
  brand: {
    name: "Ashline",
    wordmark: { lead: "ash", accent: "line" },
    tagline: { before: "From first", accent: "line", after: "to live." },
    label: "Ashline, home page",
  },
  tagline: "Full-Stack · .NET · React · Cloud · AI",
  location: "New Delhi, India",
  availability: "Available for projects",
  hero: {
    greeting: "Hello! I am",
    lead: "A developer who",
    statement: "Turns ideas into working",
    highlight: "software",
    note: "From the database to the UI, with AI built in where it helps.",
    rolePrefix: "I'm",
    roles: ["a Full-Stack Developer", "an AI Integrator", "a Software Engineer"],
    currentLabel: "Currently working as a",
    primaryAction: "Start a project",
    secondaryAction: "View projects",
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
  summary:
    "Software Engineer building production software across the stack with C#, .NET, SQL Server, AngularJS and React, with experience in Docker, Redis and AWS. In my current role I develop and maintain a large healthcare ERP: billing workflows, payment and fiscal e-invoicing integrations, WhatsApp messaging, scheduled reporting and production debugging. I am also available for projects, from full-stack web apps and APIs to containerised microservices, cloud deployments on AWS, and AI features built on retrieval-augmented generation (RAG) and LLMs.",
  pitch:
    "I build software end to end: web apps, APIs, third-party integrations, containerised microservices and AI features powered by RAG and LLMs. If you have something to build, I can help.",
  currentlyBuilding:
    "Currently building BillingRecon, a multi-tenant receivables service on .NET 10, ASP.NET Core and EF Core.",
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
    { id: "about", label: "About" },
    { id: "services", label: "Services", heading: "What I can build" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education", heading: "Education & Certifications" },
    { id: "contact", label: "Contact" },
  ],
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
      tagline: "Billing Reconciliation & Dues Recovery Service",
      status: "In progress",
      slug: "billingrecon",
      visual: {
        title: "dotnet test",
        lines: [
          "Api → Infrastructure → Application → Domain",
          "Architecture tests: layer rules enforced",
          "Tenant filter, write guard, audit stamps: covered",
          "493 tests passed",
        ],
      },
      tech: [
        ".NET 10",
        "ASP.NET Core",
        "EF Core",
        "SQL Server",
        "xUnit",
        "Serilog",
        "Clean Architecture",
        "Multi-tenant",
      ],
      description:
        "A multi-tenant receivables service for small clinics, diagnostic labs and nursing homes. It is designed to record every financial event immutably, keep balances provably correct, reconcile against bank and gateway statements, and drive recovery of dues. Built as a Clean Architecture modular monolith with four projects (Domain, Application, Infrastructure, Api); module boundaries are folders and namespaces enforced by architecture tests.",
      highlights: [
        "Layered architecture (Domain, Application, Infrastructure, Api) with the dependency rules enforced by automated architecture tests.",
        "RFC 9457 problem-details error contract with typed error codes and a global exception handler.",
        "Correlation-ID middleware so every log line and error response can be traced back to one request.",
        "Structured JSON logging with Serilog and Seq, with PII masking so patient data never reaches the logs.",
        "Tenant isolation in EF Core: global query filter, a write-guard interceptor and audit stamping, all covered by tests.",
        "Startup-validated configuration, health endpoints and OpenAPI docs with Scalar in Development.",
        "493 passing automated tests, none of which needs Docker or a database.",
      ],
      planned: [
        "Billing: bills, line items and the bill state machine (Draft, Finalized, PartiallyPaid, Paid, Void).",
        "Payments and allocation, including overpayments held as on-account credit.",
        "Append-only receivables ledger with cached balances that are verified against the ledger.",
        "Later releases: reconciliation against bank statements, dues recovery, insurance and corporate billing, and a React + TypeScript frontend.",
      ],
      caseStudy: {
        intro:
          "BillingRecon is a side project where I apply ASP.NET Core, EF Core and Clean Architecture to a problem with real rules: a receivables service for small clinics, diagnostic labs and nursing homes. It is designed to be the single source of truth for what patients, insurers and corporates owe.",
        statusSummary:
          "Honest status: the engineering foundation is built and covered by 493 automated tests. Every business feature, from bills to reconciliation, is designed and documented but not built yet.",
        problem: {
          heading: "The problem",
          paragraphs: [
            "Small clinics, labs and nursing homes bill patients, insurers and corporates, and collect partial or lump-sum payments through cash, card, UPI, cheque, bank transfer and insurer settlements. Over time the balances drift, and money is lost to unallocated payments, untracked dues, duplicate entries and follow-ups that never happen.",
            "The service is designed to record every financial event immutably, keep balances provably correct, reconcile them against bank and gateway statements, and drive the recovery of dues.",
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
            status: "Designed",
            summary:
              "Amounts are decimal, never float: decimal(18,2) for amounts, (19,4) for unit prices and (9,3) for quantities. Rounding happens once, at line level and away from zero, and a bill-level round-off is a visible adjustment line, so paise never disappear silently.",
          },
          {
            name: "Immutable records",
            status: "Designed",
            summary:
              "Posted financial records are never updated or deleted. A correction is a new record, such as a reversal, a credit note or an adjustment, and each one writes its own ledger entry in the same database transaction.",
          },
          {
            name: "Idempotency",
            status: "Designed",
            summary:
              "Every request that moves money carries an Idempotency-Key. A replayed request returns the stored response instead of creating a second payment, which is what makes retries safe.",
          },
          {
            name: "Concurrency control",
            status: "Partly built",
            summary:
              "Every table carries a row version. The API returns it as an ETag and requires If-Match on updates, so two people editing the same bill get a 409 Conflict instead of a silent lost update. The column convention exists; the ETag handling is designed.",
          },
          {
            name: "Gapless numbering",
            status: "Designed",
            summary:
              "Bill and receipt numbers come from a per-tenant number series that hands out consecutive numbers under a lock, so printed documents form an unbroken, auditable sequence.",
          },
          {
            name: "Maker-checker",
            status: "Designed",
            summary:
              "Write-offs, refunds and adjustments above a threshold need a second person to approve them, and the approver can never be the requester.",
          },
        ],
        statusTable: [
          {
            area: "Solution layout, central package management, analyzers, banned APIs",
            status: "Built",
          },
          {
            area: "Architecture tests for layer and module rules",
            status: "Built",
          },
          {
            area: "Domain primitives (Result, Error, typed ids, Entity, AggregateRoot) and the Tenant aggregate",
            status: "Built",
          },
          { area: "Configuration validated at startup", status: "Built" },
          {
            area: "Structured logging with Serilog and Seq, PII masking, correlation ids",
            status: "Built",
          },
          {
            area: "Error contract: RFC 9457 problem details, error codes, global exception handler",
            status: "Built",
          },
          { area: "OpenAPI with Scalar in Development", status: "Built" },
          {
            area: "EF Core conventions (typed ids, row version, audit columns, tenant filter), tenant write guard, audit stamping",
            status: "Built",
            note: "Verified against the model and generated SQL, not yet against a live SQL Server",
          },
          {
            area: "Health endpoints",
            status: "Partly built",
            note: "The unhealthy path is tested; the healthy path needs SQL Server",
          },
          {
            area: "First migration (tenants) and database startup",
            status: "Partly built",
            note: "Matches the model; never applied to a real SQL Server in the audited copy",
          },
          {
            area: "Docker Compose with SQL Server 2022 and Seq",
            status: "Designed",
            note: "The file exists but has not been run",
          },
          { area: "Users, roles and JWT authentication", status: "Designed" },
          { area: "Patients and payers", status: "Designed" },
          { area: "Bills, line items, credit notes", status: "Designed" },
          { area: "Payments, allocation, refunds", status: "Designed" },
          {
            area: "Receivables ledger and cached, verifiable balances",
            status: "Designed",
          },
          {
            area: "Adjustments and maker-checker approvals",
            status: "Designed",
          },
          {
            area: "Idempotency keys, ETag concurrency, gapless number series",
            status: "Designed",
            note: "The row version column already exists",
          },
          {
            area: "Aging, outstanding and collection reports",
            status: "Designed",
          },
          {
            area: "Reconciliation, dues recovery, insurance and corporate billing",
            status: "Designed",
            note: "Outline only, for later releases",
          },
          {
            area: "Integration tests with Testcontainers, CI workflow, React frontend",
            status: "Not started",
          },
        ],
        roadmap: [
          {
            name: "R1 · MVP",
            scope:
              "Tenants, users and roles, patients, payers, bills and line items, payments with manual and automatic allocation, credit notes, adjustments and refunds with approval, receivables ledger, audit trail, aging and collection reports, a minimal React UI, Docker and CI.",
            status: "In progress",
            note: "Phases 0 and 1, the foundation, are done. The business features start with payers, patients and bills.",
          },
          {
            name: "R2 · Reconciliation",
            scope:
              "Internal integrity checks of cached balances against the ledger, bank, UPI and gateway statement import, a matching engine and a discrepancy workflow.",
            status: "Designed",
          },
          {
            name: "R3 · Dues recovery",
            scope:
              "Recovery cases, prioritisation, follow-up actions, promise-to-pay, reminders through a notification abstraction and scheduled jobs.",
            status: "Designed",
          },
          {
            name: "R4 · Insurance and corporate",
            scope:
              "Split billing between patient and payer, claim tracking from claimed to settled, TDS and disallowance handling, corporate credit limits and consolidated statements.",
            status: "Designed",
          },
          {
            name: "R5 · Production maturity",
            scope:
              "OpenTelemetry, load testing, performance tuning, backup and restore drills and final documentation.",
            status: "Planned",
          },
        ],
        sections: [
          {
            heading: "Testing approach",
            paragraphs: [
              "Unit tests use xUnit with Shouldly, architecture tests guard the layer boundaries, and the EF Core model and generated SQL are checked without a database. Integration tests against a real SQL Server in Docker are planned for the next phases; the EF in-memory provider is deliberately avoided because it does not enforce constraints or transactions.",
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
    "Laid the foundation of BillingRecon with 493 passing automated tests.",
  ],
};
