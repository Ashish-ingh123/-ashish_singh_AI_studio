import type { CSSProperties } from "react";
import {
  BrainCircuit,
  FileSearch,
  MessageCircleQuestionMark,
  MessageSquareQuote,
  TextQuote,
  type LucideIcon,
} from "lucide-react";
import { PipelinePlayer } from "@/components/pipeline-player";
import { profile, type PipelineIcon } from "@/content/profile";

// The content file names an icon by key; this lookup turns the key into a component.
// Record<PipelineIcon, ...> makes TypeScript insist that every key has an icon.
const icons: Record<PipelineIcon, LucideIcon> = {
  query: MessageCircleQuestionMark,
  retrieval: FileSearch,
  context: TextQuote,
  model: BrainCircuit,
  answer: MessageSquareQuote,
};

/**
 * The lower half of the AI service card: how a RAG feature answers a question, as five
 * stages that a pulse travels through once when they scroll into view.
 *
 * For a screen reader it is simply an ordered list of five named steps, each with its
 * sentence, and the line over the stages is the list's name. The icons, the lines between
 * the stages and the pulse are decoration. The words stay at full contrast throughout:
 * only the icons and lines are dim before the pulse arrives.
 */
export function RagPipeline() {
  const { pipeline } = profile;
  const last = pipeline.stages.length - 1;

  return (
    <PipelinePlayer title={pipeline.title} replayLabel={pipeline.replayLabel}>
      {pipeline.stages.map((stage, index) => {
        const Icon = icons[stage.icon];
        return (
          // --i is the stage's place in the line. pipeline.css multiplies it by the
          // time one hop takes, which gives each stage the moment the pulse reaches it.
          <li
            key={stage.name}
            className="pipeline-stage"
            style={{ "--i": index } as CSSProperties}
          >
            <span aria-hidden="true" className="pipeline-node">
              <Icon />
            </span>
            {/* The line to the next stage, with the pulse that travels along it. */}
            {index < last && (
              <span aria-hidden="true" className="pipeline-rail">
                <span className="pipeline-rail-fill" />
                <span className="pipeline-pulse" />
              </span>
            )}
            <h4 className="pipeline-name font-display text-base leading-snug font-semibold">
              {stage.name}
            </h4>
            <p className="pipeline-text text-sm leading-relaxed text-muted-foreground">
              {stage.text}
            </p>
          </li>
        );
      })}
    </PipelinePlayer>
  );
}
