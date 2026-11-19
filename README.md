# Ashish Singh · Portfolio

[![CI](https://github.com/Ashish-ingh123/-ashish_singh_AI_studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Ashish-ingh123/-ashish_singh_AI_studio/actions/workflows/ci.yml)

Personal portfolio site for Ashish Singh, Software Engineer (full-stack: C#, .NET, SQL Server,
React; AI integration with RAG and LLMs). A single page presents the services he offers, his
experience, skills, projects, education and certifications, and makes it easy to get in touch
by phone, email, LinkedIn or GitHub. Projects with a case study get their own page under
`/projects/<slug>`. A small question box, "Ask about Ashish", lets a visitor ask about him
and get a short answer written by an AI model that knows only what this site says. A form in
the Contact section, "Send your requirement", emails the details of a project to the owner.

**Live site:** _add the Vercel URL here after the first deploy_

## Stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16, App Router, Turbopack, TypeScript in strict mode |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Animation | [Motion](https://motion.dev) (`motion/react`) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) for light and dark mode |
| Icons | [lucide-react](https://lucide.dev) |
| AI answers | [Google Gemini API](https://ai.google.dev) through [`@google/genai`](https://www.npmjs.com/package/@google/genai), called from a server route only |
| Tooling | npm, ESLint 9, GitHub Actions, deployed on [Vercel](https://vercel.com) |

The dependency list is kept deliberately small.

## Getting started

Requirements: [Node.js](https://nodejs.org) 20.9 or newer (the site is developed on Node 24 LTS) and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Pages reload as you edit.

### Environment variables

The site runs, builds and passes CI without any. Only the "Ask about Ashish" box and the
"Send your requirement" form need them, and without their values each shows a short "not
available" message instead of working.

| Variable | Needed | What it is |
| --- | --- | --- |
| `GEMINI_API_KEY` | For the question box | A Google Gemini API key, created in [Google AI Studio](https://aistudio.google.com). Read on the server only; it never reaches the browser. |
| `GEMINI_MODEL` | No | The Gemini model to use. Empty means the default named in `src/app/api/ask/route.ts`. |
| `RESEND_API_KEY` | For the form | A [Resend](https://resend.com) API key with the permission "Sending access". Read on the server only. |
| `CONTACT_TO_EMAIL` | For the form | The address that receives the form's emails. It is set only here and in Vercel, never in the code. |
| `CONTACT_FROM_EMAIL` | No | The sender, once a domain is verified in Resend, for example `Website <forms@your-domain>`. Empty means Resend's shared sender, named in `src/app/api/contact/route.ts`. |

Copy `.env.example` to `.env.local`, put the values there and restart the server. `.env.local`
is ignored by git; never commit a real key or the receiving address.

Without a verified domain, Resend sends only from its shared sender and delivers only to the
address the Resend account was registered with, so register the account with the address you
put in `CONTACT_TO_EMAIL`. Gmail may put the first emails in Spam: add a filter for the
sender `onboarding@resend.dev` with "Never send it to Spam".

To test the form locally: with no values it answers "not available"; with them, send one
requirement, check that the email arrives with every field, and press Reply, which must
address the visitor. The terminal prints only Resend's status code when a send fails (403
usually means the receiving address is not the Resend account's own; 401 means a wrong key).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create the production build (includes a type check), then add compile hints to the start-up scripts (see Accessibility and performance) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate the Next.js route types, then run `tsc --noEmit` |

Run `npm run lint` and `npm run typecheck` before opening a pull request; CI runs the same
commands.

## Editing content

- **All text, links and dates live in one typed file:** [`src/content/profile.ts`](src/content/profile.ts).
  Components only render what that object contains, so updating the site means editing that
  file. TypeScript flags missing or misspelled fields.
- **Contact details:** the email address and the mobile number come from `profile.links`. The
  mobile number is shown only in the Contact section.
- **Logo:** the Ashline logo's words are `profile.brand`: the brand's name, the two halves
  of the wordmark (`ash` and `line`), the three parts of the tagline (the middle one is
  set in the accent colour) and the label a screen reader hears for the header link. The
  drawing is not content: its shapes are `src/lib/logo-shapes.ts` and its colours are
  design tokens, tied to each part in `src/app/styles/logo.css`. The component,
  `src/components/logo.tsx`, has three variants: the mark alone, the mark with the
  wordmark (the header and the footer), and the mark with the wordmark and the tagline
  (built, but not placed on the site yet). One rule: the small version of the mark, for
  32px and below, has no dot; the browser-tab icon and the app icons use it. The site's
  title is still `profile.name`: the logo stands beside your name, it does not replace it.
- **Hero:** the words of the first screen, the labels of its two buttons and the skill
  names drawn in the field behind it all come from `profile.hero`. List the skill names
  (`fieldLabels`) in order of importance: a phone shows the first three, and a wide screen
  shows as many as fit its height, so the last of ten can be missing on a short laptop
  screen. Each name must also be a skill in `profile.skills`.
- **Tagline:** `profile.tagline` is the Focus line in About, the row of chips on the share
  image and the first entries of `knowsAbout` in the structured data. Separate its parts
  with `·`.
- **Experience:** a job's `company` is optional. When it is left out, the hero and the
  Experience header show the job's `location` in its place, for example "Software Engineer
  in New Delhi, India". The joining words ("at", "in") come from `profile.roleJoiners`.
  Each of a job's `highlights` is one card, and their titles also form the outline that
  stays pinned beside the cards on a wide screen, so keep a title to two to four words.
  The outline's label is `profile.labels.experience.outline`.
- **Services:** the cards under "What I can build" come from `profile.services`, in the
  order of the list. The grid is drawn for seven services: the first gets the wide card
  that opens it, the fourth card on the page gets a second wide card, and the AI service
  always closes it (see AI pipeline below). Changing a service's words needs nothing else.
  Adding or removing a service changes the count, so afterwards check the grid for gaps at
  phone, tablet and desktop widths; the shapes are chosen in
  `src/components/sections/services.tsx` (`shapeOf`). Each entry names its icon by key, and
  the key picks both the icon (same file) and the line drawing on the card
  (`src/components/service-drawing.tsx`), so a new key needs both, and TypeScript reports
  an error until they exist. The three words in the full-stack drawing are
  `profile.labels.services.stack`; the cloud drawing has no words.
- **AI pipeline:** the five steps under "How a RAG feature answers a question" come from
  `profile.pipeline`. They are the lower half of one service card: `pipeline.service` names
  that service by its icon key, and its card becomes the large one that closes the grid.
  The sentences describe the technique and name no tool; keep them true to what you would
  build.
- **Skills:** the groups come from `profile.skills`, in any order. The section sizes each
  group's cell by how much it holds: the two largest groups sit beside the orb, the third
  fills the strip at the bottom, and the rest share the row in between. With seven groups
  that row holds four, a quarter of the row each on a wide screen; a group name of more
  than about 18 letters takes two lines there on a 1024px screen. Every skill is also
  listed in the page's structured data (`knowsAbout`) and is given to the AI model behind
  "Ask about Ashish", so add only skills you can back up.
- **Site address:** leave `profile.siteUrl` empty until a custom domain exists. On Vercel the
  production URL is picked up automatically at build time. Once a domain is live, set
  `siteUrl` to it so canonical links, Open Graph tags, the sitemap, `robots.txt` and the
  structured data all use the domain.
- **Navigation:** section ids and nav labels come from `profile.nav`.
- **Labels:** small fixed words such as field names and card titles come from
  `profile.labels`, so they can be changed without opening a component.
- **Projects:** a project's `visual` is the terminal window drawn beside it: a title and a
  few lines, which are typed out when the window scrolls into view. Every line must be a
  fact about the project. Keep the lines short: the typing always ends within three
  seconds, so more text only makes it faster. The section's fixed words (the "Featured
  project" line, the link texts, Replay) are `profile.labels.projects`. A project's GitHub
  link is `links.repo`; leave it out until the repository is public. A visual with
  `steering: true` shows a steering wheel turning through example angles in place of the
  lines (`src/components/steering-wheel.tsx`), with a Pause button. Its angles are an
  illustration, not model output, and the label that says so
  (`profile.labels.projects.steering.illustrative`) must stay for as long as that is true.
- **Ask about Ashish:** every word of the question box is `profile.ask`: the heading, the
  suggested questions, the notice about where questions are sent, and the messages for
  when it is busy or unavailable. Keep the suggested questions answerable from this file.
  What the AI model is told (its rules, and which fields of `profile.ts` it may see) is
  `src/lib/ask-context.ts`; the mobile number is deliberately not among them.
- **Send your requirement:** every word of the form in the Contact section is
  `profile.contactForm`: the heading, each field's label, placeholder and error message, the
  timeline options, the button, the messages for sent, failed, unavailable and too many
  messages, the privacy line and the words of the email you receive. "What you need" lists
  the titles of `profile.services` followed by "Other", so a new service appears there by
  itself. The rules (which fields are required, the lengths) are
  `src/lib/contact-form.ts`, used by the form and by the server route alike; `{min}` and
  `{max}` in an error message are filled in from them. Keep the privacy line true: the
  details are emailed through Resend and are not stored on the site. The names a screen
  reader hears for the round icon links are `profile.labels.contact`.
- **Command palette:** the search box that opens with Ctrl+K, or with the search button in
  the header, builds its list from the sections, the case studies and the links, so new
  content appears in it by itself. Its own words are `profile.labels.palette`.
- **Case study page:** its contents list ("On this page") is built from the section
  headings, so a heading you change or add appears there by itself, and the heading also
  becomes the section's address (`#key-principles`). The page's fixed words are
  `profile.labels.caseStudy`.
- **Case studies:** a project with a `slug` and a `caseStudy` gets a page at `/projects/<slug>`.
  Build statuses (`Built`, `Partly built`, `Designed`, `Not started`) must stay honest. Work
  that is designed but not built belongs under `planned`, never under `highlights`.

## Project structure

```
src/
  app/                 Routes, metadata, generated icons, Open Graph images, sitemap, robots
    projects/[slug]/   Case study pages
    api/ask/           Server route behind the "Ask about Ashish" box
    api/contact/       Server route behind the "Send your requirement" form
    styles/            Section-specific CSS, imported by globals.css
  components/          Shared UI (header, footer, logo, theme toggle, reveal animations,
                       badges, orb, the hero's canvas field, the drawings on the service
                       cards, the typing terminal windows)
    sections/          Homepage sections, one file each, composed in app/page.tsx
    case-study/        Architecture diagram, contents list, principles, status table, roadmap
    og/                Drawings used by the generated Open Graph images and icons
  content/profile.ts   The single source of all site content
  hooks/               React hooks (active-section tracking)
  lib/                 Non-content helpers (site URL, case-study lookup, OG fonts, clipboard,
                       the logo's shapes, what the AI model is told, the form's rules,
                       the Origin check and limiter shared by the two server routes)
scripts/               The step that runs after `next build` (compile hints)
public/                Static files served from the site root
.env.example           The environment variables, with placeholders
.github/workflows/     Continuous integration
```

## Accessibility and performance

- Mobile-first layout, designed for phone widths first and then widened.
- Everything works with the keyboard, focus rings stay visible, every image has alt text.
- `prefers-reduced-motion` is respected: the decorative loops, entrance animations and the
  typed line in the hero are switched off, the field behind the hero becomes a still
  picture, the drawings on the service cards and the AI pipeline are shown finished, and
  the project terminals show all their lines at once.
- Target: a Lighthouse score of 95 or higher in every category. To check, build and serve the
  production bundle, then run Lighthouse against it from a second terminal:

  ```bash
  npm run build
  npm run start
  npx lighthouse http://localhost:3000 --view
  ```

  The performance score moves a point or two from run to run, so compare several runs
  before and after a change, never one.
- Compile hints: after `next build`, the build runs
  [`scripts/compile-hints.mjs`](scripts/compile-hints.mjs), which puts the comment
  `//# allFunctionsCalledOnLoad` on the first line of the start-up scripts of 30 KB and
  more (React DOM, the Next.js client runtime, Motion and the site's own client code).
  Chrome and Edge, from version 136, then compile those files on a background thread while
  they download, where they would otherwise compile each function on the main thread the
  first time it is called. Other browsers skip the comment. On the homepage this took the
  main-thread blocking time Lighthouse reports from 73 to 133 ms down to 20 ms or less.
  Next.js has no setting for this, so the step edits files Next.js generated: after
  upgrading Next.js, run a build and check that it still prints the scripts it changed.
  If it finds none it says so and the build succeeds; the site then works as before, only
  without the hint.

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and on pushes
to `main`. It installs dependencies with `npm ci`, then runs lint, typecheck and a production
build. A pull request should not be merged while the check is red.

## Deploying

The site is deployed on Vercel from the GitHub repository. Pushes to `main` go to production;
every pull request gets its own preview URL.

1. Push the repository to GitHub.
2. In Vercel choose **Add New → Project**, import the repository and keep the detected
   Next.js settings.
3. Under **Settings → Environment Variables** add `GEMINI_API_KEY` for Production and
   Preview (and `GEMINI_MODEL` only to change the model), and `RESEND_API_KEY` (mark it
   Sensitive) and `CONTACT_TO_EMAIL` for the form. Without them the site still deploys and
   works; the question box and the form say they are not available. Redeploy after
   changing a variable.
4. Add a rate limit for `/api/ask` and `/api/contact` under **Firewall → Configure → New
   Rule**. Each route has a small limiter of its own (five requests a minute, and three in
   ten minutes), but those live in each server instance's memory; the firewall rule is the
   real limit. The Hobby plan allows one rate-limit rule per project, with a window of at
   most ten minutes, so one rule covers both routes: **Request Path** *starts with*
   `/api/`, action **Rate Limit**, fixed window of 10 minutes, 20 requests, key IP, then
   **Too Many Requests (429)**. On Pro, give each route its own rule. Publish the change.
5. Deploy. Vercel prints the live `*.vercel.app` address. The build log should contain a
   line starting with `compile hints:` that names the scripts it changed. Open one of them
   on the live site (`/_next/static/chunks/<name>`) and check that its first line is
   `//# allFunctionsCalledOnLoad`; if the line is missing from the log, set the project's
   Build Command to `npm run build`.
6. Optional custom domain: **Settings → Domains → Add**, then create the DNS records Vercel
   shows at your registrar. When the domain is live, set `siteUrl` in
   `src/content/profile.ts` to `https://your-domain` and push.

Vercel's **Automatically expose System Environment Variables** setting (on by default) lets the
build read `VERCEL_PROJECT_PRODUCTION_URL`, which the site uses for absolute links until a
domain is configured.

## Design credit

The visual direction (aubergine background, violet glows, glass cards) follows
[Portfolio Design](https://www.figma.com/community/file/1182197835889504018/portfolio-design)
by Ibrahim Memon, shared on Figma Community under CC BY 4.0. The code and graphics in this
repository are written from scratch.

## Working with AI assistants

[`CLAUDE.md`](CLAUDE.md) records the project rules and conventions for sessions with Claude
Code. `AGENTS.md` is written and maintained by Next.js itself.
