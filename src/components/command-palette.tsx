"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Copy,
  ExternalLink,
  FileText,
  Hash,
  Search,
  Send,
  Sparkles,
  SunMoon,
  type LucideIcon,
} from "lucide-react";
import { ASK_EVENT } from "@/components/ask-box-loader";
import { CONTACT_FORM_EVENT } from "@/components/contact-form-loader";
import { profile } from "@/content/profile";
import { caseStudies, caseStudyPath } from "@/lib/case-studies";
import { writeToClipboard } from "@/lib/clipboard";

const labels = profile.labels.palette;

/** What a command does when it is chosen. */
type Action =
  | { kind: "go"; href: string }
  | { kind: "open"; href: string }
  | { kind: "copy"; text: string }
  | { kind: "ask" }
  | { kind: "requirement" }
  | { kind: "theme" };

type Command = {
  id: string;
  group: string;
  label: string;
  icon: LucideIcon;
  action: Action;
};

// Every command comes from content that already exists: the sections from the nav list,
// the projects that have a case study, and the links. The phone number is not here: it
// is shown only in the Contact section.
const commands: Command[] = [
  ...profile.nav.map((item) => ({
    id: `section-${item.id}`,
    group: labels.groups.sections,
    label: item.heading ?? item.label,
    icon: Hash,
    action: { kind: "go", href: `/#${item.id}` } as const,
  })),
  ...caseStudies.map((project) => ({
    id: `project-${project.slug}`,
    group: labels.groups.projects,
    label: `${project.name}: ${project.tagline}`,
    icon: FileText,
    action: { kind: "go", href: caseStudyPath(project) } as const,
  })),
  {
    id: "ask",
    group: labels.groups.contact,
    label: profile.ask.heading,
    icon: Sparkles,
    action: { kind: "ask" },
  },
  {
    id: "requirement",
    group: labels.groups.contact,
    label: profile.contactForm.paletteLabel,
    icon: Send,
    action: { kind: "requirement" },
  },
  {
    id: "copy-email",
    group: labels.groups.contact,
    label: profile.labels.copy.idle,
    icon: Copy,
    action: { kind: "copy", text: profile.links.email },
  },
  {
    id: "linkedin",
    group: labels.groups.contact,
    label: labels.linkedin,
    icon: ExternalLink,
    action: { kind: "open", href: profile.links.linkedin },
  },
  {
    id: "github",
    group: labels.groups.contact,
    label: labels.github,
    icon: ExternalLink,
    action: { kind: "open", href: profile.links.github },
  },
  {
    id: "theme",
    group: labels.groups.appearance,
    label: labels.theme,
    icon: SunMoon,
    action: { kind: "theme" },
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * The command palette: a search box over a short list of places to go and things to do.
 *
 * It is the browser's own <dialog>, opened with showModal(). That gives, without any
 * code here, what a modal needs: focus cannot leave it, Escape closes it, the page
 * behind it cannot be clicked, and focus returns to where it was when it closes.
 *
 * Inside is the standard "combobox" arrangement. Focus stays in the text box the whole
 * time; the arrow keys only move a highlight through the list, and aria-activedescendant
 * tells a screen reader which line is highlighted. So typing and choosing never fight
 * over the keyboard.
 */
export function CommandPalette({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  // The line read out after a copy; empty when there is nothing to say.
  const [status, setStatus] = useState("");
  const closeTimer = useRef<number | undefined>(undefined);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const baseId = useId();

  // The dialog element is opened and closed by method calls, not by a prop, so the
  // "open" prop is carried over to it here.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // A plain "contains" search: with this few commands anything cleverer would only
  // make the results harder to predict.
  const shown = useMemo(() => {
    const wanted = query.trim().toLowerCase();
    if (!wanted) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.group}`.toLowerCase().includes(wanted),
    );
  }, [query]);

  // The commands in the order they are listed, gathered under their group headings.
  const groups = useMemo(() => {
    const byGroup = new Map<string, Command[]>();
    for (const command of shown) {
      byGroup.set(command.group, [...(byGroup.get(command.group) ?? []), command]);
    }
    return Array.from(byGroup, ([name, items]) => ({ name, items }));
  }, [shown]);

  // Typing can shorten the list to less than the highlighted line's position.
  const current = Math.min(active, Math.max(shown.length - 1, 0));
  const optionId = (command: Command) => `${baseId}-${command.id}`;

  // Keep the highlighted line on screen when the arrow keys move it past the edge.
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [current, shown]);

  /** Fires when the dialog has closed, however that happened (Escape included). */
  function onDialogClose() {
    window.clearTimeout(closeTimer.current);
    setQuery("");
    setActive(0);
    setStatus("");
    onClose();
  }

  function close() {
    dialogRef.current?.close();
  }

  async function run(command: Command) {
    const { action } = command;
    if (action.kind === "copy") {
      const ok = await writeToClipboard(action.text);
      const copy = profile.labels.copy;
      // Stay open for a moment so that the result can be seen and read out.
      setStatus(ok ? copy.copied : copy.failed);
      window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(close, ok ? 900 : 2500);
      return;
    }
    close();
    if (action.kind === "go") router.push(action.href);
    if (action.kind === "ask") {
      // Go to the question box, then ask it to load and take the cursor. The short wait
      // lets the homepage appear first when this is chosen on another page.
      router.push("/#ask");
      window.setTimeout(() => window.dispatchEvent(new Event(ASK_EVENT)), 600);
    }
    if (action.kind === "requirement") {
      // The same for the form in Contact: go to it, then ask it to load and take the cursor.
      router.push("/#requirement");
      window.setTimeout(
        () => window.dispatchEvent(new Event(CONTACT_FORM_EVENT)),
        600,
      );
    }
    if (action.kind === "open") {
      window.open(action.href, "_blank", "noopener,noreferrer");
    }
    if (action.kind === "theme") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const last = shown.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(current >= last ? 0 : current + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(current <= 0 ? last : current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(last);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = shown[current];
      if (command) void run(command);
    }
  }

  // The dialog element covers its own backdrop, so a click that lands on the dialog
  // itself, and not on anything inside it, was a click outside the panel.
  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) close();
  }

  const listId = `${baseId}-list`;
  const activeCommand = shown[current];

  return (
    <dialog
      ref={dialogRef}
      aria-label={labels.title}
      className="palette"
      onClose={onDialogClose}
      onClick={onDialogClick}
    >
      <div className="palette-panel">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          {/* 16px text: anything smaller makes an iPhone zoom in when the box is tapped. */}
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeCommand ? optionId(activeCommand) : undefined
            }
            aria-label={labels.placeholder}
            placeholder={labels.placeholder}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="palette-input h-14 w-full bg-transparent text-base placeholder:text-muted-foreground"
          />
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={labels.title}
          className="palette-list"
        >
          {groups.map((group, groupIndex) => {
            // An id cannot hold a space, so the heading is numbered, not named.
            const headingId = `${baseId}-group-${groupIndex}`;
            return (
              <div key={group.name} role="group" aria-labelledby={headingId}>
                <p
                  id={headingId}
                  className="px-3 pt-3 pb-1.5 font-mono text-xs text-muted-foreground"
                >
                  {group.name}
                </p>
                {group.items.map((command) => {
                  const selected = command === activeCommand;
                  const Icon = command.icon;
                  return (
                    <div
                      key={command.id}
                      id={optionId(command)}
                      role="option"
                      aria-selected={selected}
                      // A tap or click chooses; moving a mouse over a line highlights
                      // it, so the mouse and the arrow keys share one highlight.
                      onClick={() => void run(command)}
                      onPointerMove={() => setActive(shown.indexOf(command))}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm ${
                        selected
                          ? "bg-accent/15 text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${selected ? "text-accent" : ""}`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 truncate">{command.label}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {shown.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {labels.empty}
            </p>
          )}
        </div>

        {/* Read out when it changes; it takes no room while it is empty. */}
        <p
          role="status"
          aria-live="polite"
          className={
            status
              ? "border-t border-border px-4 py-2.5 text-sm text-foreground"
              : "sr-only"
          }
        >
          {status}
        </p>
      </div>
    </dialog>
  );
}
