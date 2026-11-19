import { SteeringWheel } from "@/components/steering-wheel";
import { TerminalWindow } from "@/components/terminal-window";
import {
  profile,
  type ProjectVisual as ProjectVisualContent,
} from "@/content/profile";

/** The edge of the window that another element on the page lies over. */
export type CoveredEdge = "left" | "right";

/*
  From lg the Projects section rests its description card on one edge of the window, 3rem
  deep. The window pads its content 3rem further in on that side (the usual 1.25rem plus
  3rem makes 17 on Tailwind's spacing scale), so the card never hides a word.
*/
const clearOf: Record<CoveredEdge, string> = {
  left: "lg:pl-17",
  right: "lg:pr-17",
};

/**
 * The picture beside a project: a small terminal window drawn from the content file, with a
 * glow behind it. The words in the window are real content (facts about the project), so
 * screen readers get them too: the title bar is the figure's caption and the lines are a
 * list. Only the glow, the dots, the prompt marks and the cursor are decoration.
 *
 * The window itself is terminal-window.tsx, which types the lines out when it scrolls
 * into view. This part stays on the server and adds what never changes: the glow, and
 * the padding that keeps the text clear of the description card.
 */
export function ProjectVisual({
  visual,
  coveredEdge,
}: {
  visual: ProjectVisualContent;
  /** The edge the description card lies over from lg; leave it out when nothing does. */
  coveredEdge?: CoveredEdge;
}) {
  // The title bar and the body share one horizontal padding, so their text lines up.
  const { steering } = profile.labels.projects;
  const padding = `px-4 sm:px-5 ${coveredEdge ? clearOf[coveredEdge] : ""}`;

  return (
    <div className="relative">
      {/*
        The glow, painted by .project-glow in projects.css. It reaches 12px past the window
        on phones and 20px from sm, which stays inside the section's side padding (16px and
        24px), so it can never make the page scroll sideways. pointer-events-none keeps it
        out of hit testing, so it is never in the way of a click or a text selection.
      */}
      <div
        aria-hidden="true"
        className="project-glow pointer-events-none absolute -inset-x-3 -inset-y-10 sm:-inset-x-5 sm:-inset-y-12"
      />
      {visual.steering ? (
        // The steering-angle project shows a turning wheel in the same kind of window.
        <SteeringWheel
          title={visual.title}
          description={steering.description}
          caption={steering.caption}
          illustrative={steering.illustrative}
          pauseLabel={steering.pause}
          playLabel={steering.play}
          padding={padding}
        />
      ) : (
        <TerminalWindow
          title={visual.title}
          lines={visual.lines}
          replayLabel={profile.labels.projects.replay}
          padding={padding}
        />
      )}
    </div>
  );
}
