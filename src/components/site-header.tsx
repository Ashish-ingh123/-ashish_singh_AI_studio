"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { buttonClasses } from "@/components/button-link";
import { profile, type NavItem } from "@/content/profile";
import { Logo } from "@/components/logo";
import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { useActiveSection } from "@/hooks/use-active-section";

// Computed once at module load so the hook receives the same array on every render. The
// hook watches every section, so the highlight is right wherever the visitor is; only the
// sections in profile.menu get a link, in the menu's order.
const sectionIds = profile.nav.map((item) => item.id);
const menuItems = profile.menu.map((id) => {
  const item = profile.nav.find((entry) => entry.id === id);
  if (!item) throw new Error(`profile.menu names "${id}", which is not in profile.nav`);
  return item;
});

const labels = profile.labels.header;
const paletteLabels = profile.labels.palette;

// The command palette's code is a chunk of its own, fetched the first time it is needed.
// ssr: false, because there is nothing to render until a visitor opens it.
const CommandPalette = dynamic(
  () =>
    import("@/components/command-palette").then(
      (loaded) => loaded.CommandPalette,
    ),
  { ssr: false },
);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // "Wanted" loads the palette's code; "open" shows it. Resting the pointer on the
  // button is enough to want it, so it is usually there by the time of the click.
  const [paletteWanted, setPaletteWanted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // The header's own "Start a project" button. It is shown while the hero's button is
  // off screen, and on pages that have no hero at all, so the way to get in touch is
  // always one click away without ever being on screen twice.
  const [actionShown, setActionShown] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const heroAction = document.querySelector("[data-hero-action]");
    // The observer reports once straight away, so a page without a hero button needs
    // the same: a frame's wait keeps this out of the effect's own run.
    if (!heroAction) {
      const frame = requestAnimationFrame(() => setActionShown(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) =>
      setActionShown(!entry.isIntersecting),
    );
    observer.observe(heroAction);
    return () => observer.disconnect();
    // Each page has its own hero button, or none, so this runs again per page.
  }, [pathname]);

  // Ctrl+K, or Cmd+K on a Mac, opens the palette from anywhere on the page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") {
        return;
      }
      // Some browsers use this combination for their own search box.
      event.preventDefault();
      setPaletteWanted(true);
      setPaletteOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  // The logo is the way back to the top. A link to the page you are already on does
  // nothing in Next.js, so on the homepage the click is handled here: the page goes to
  // the top, and a "#section" left in the address is dropped without adding a step to
  // the browser's history. On any other page it stays an ordinary link home. Clicks
  // meant to open a new tab or window are left alone.
  function onLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    setOpen(false);
    // Glides or jumps as scroll-behavior in globals.css says: it jumps for visitors who
    // prefer reduced motion.
    window.scrollTo({ top: 0 });
    if (window.location.hash) window.history.replaceState(null, "", pathname);
  }

  const active = useActiveSection(sectionIds);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // While the mobile menu is open: Escape closes it and returns focus to the button that
  // opened it, and a tap anywhere outside the header closes it too.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/*
          The logo is the link to the top of the site. Its name for screen readers is
          profile.brand.label, which the Logo gives once as hidden text; the drawing and
          the letters are hidden from them, so the name is not read twice. With the four
          menu links (Step 3, 2026-11-28) the word fits at every width: at 768px there is
          69px either side of the menu. shrink-0 keeps the mark its full size where the
          header is tightest.
        */}
        <Link
          href="/"
          onClick={onLogoClick}
          className="flex shrink-0 items-center rounded-md"
        >
          <Logo labelled animated />
        </Link>

        <nav aria-label={labels.main} className="hidden items-center gap-1 md:flex">
          {menuItems.map((item) => (
            <DesktopNavLink
              key={item.id}
              item={item}
              active={active === item.id}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/*
            From xl only. It was set when the menu had seven links, which at 1024px left
            no room for it; with four it may fit from lg, untried. A phone's menu already
            has Contact. The button always keeps its place, so nothing in the header moves
            when it fades in or out; while it is hidden, inert takes it out of the Tab
            order and away from screen readers and clicks.
          */}
          <span
            inert={!actionShown}
            className={`mr-1 hidden transition-opacity duration-200 xl:inline-flex motion-reduce:transition-none ${
              actionShown ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              href="/#contact"
              className={`${buttonClasses("primary")} whitespace-nowrap`}
            >
              {profile.hero.primaryAction}
            </Link>
          </span>
          {/*
            The palette's button: the way in for touch screens, and for anyone who does
            not know the shortcut. Its name carries the shortcut, and a mouse sees it as
            a tooltip.
          */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-accent/50 hover:bg-muted"
            aria-label={`${paletteLabels.open} (${paletteLabels.shortcut})`}
            title={`${paletteLabels.open} (${paletteLabels.shortcut})`}
            aria-haspopup="dialog"
            onPointerEnter={() => setPaletteWanted(true)}
            onFocus={() => setPaletteWanted(true)}
            onClick={() => {
              setOpen(false);
              setPaletteWanted(true);
              setPaletteOpen(true);
            }}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-accent/50 hover:bg-muted md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? labels.closeMenu : labels.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/*
        The panel is positioned over the page instead of pushing it down. That keeps the
        layout stable while it opens and closes, which matters when a tap on a link starts a
        smooth scroll at the same moment the panel collapses.
      */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id={menuId}
            aria-label={labels.main}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-border bg-background shadow-lg md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
          >
            <ul className="flex flex-col px-4 py-2 sm:px-6">
              {menuItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`/#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted ${
                        isActive ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <ScrollProgress />

      {paletteWanted && (
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
        />
      )}
    </header>
  );
}

function DesktopNavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <a
      href={`/#${item.id}`}
      aria-current={active ? "true" : undefined}
      className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {item.label}
      {active && (
        // layoutId lets Motion slide the underline from the old link to the new one.
        <motion.span
          layoutId="active-section-underline"
          className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-accent"
          aria-hidden="true"
        />
      )}
    </a>
  );
}
