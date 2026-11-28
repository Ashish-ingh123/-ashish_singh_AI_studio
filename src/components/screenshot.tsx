import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { profile, type Screenshot } from "@/content/profile";
import { shotSrc } from "@/lib/screenshots";

/**
 * One BillingRecon screenshot in a frame, with its caption (Step 6 of the Ashvanta site,
 * 2026-11-28). The light file shows in the light theme and the dark file, when there is
 * one, in the dark theme: both are lazy-loaded next/image elements and the other one is
 * display: none, which a browser does not fetch, so only the one on screen is downloaded.
 *
 * The frame is a button carrying data-shot-id: ScreenshotViewer, mounted once on the page,
 * opens the full-size view for it. The button's name says so and includes the alt text, so
 * the images inside are empty-alt decoration of the button. Without script the button does
 * nothing, and the screenshot is still there to see.
 */
export function Shot({
  shot,
  sizes,
  className,
}: {
  shot: Screenshot;
  /** How wide the frame is at each screen width, for next/image's choice of file. */
  sizes: string;
  className?: string;
}) {
  const label = profile.labels.screens.open.replace("{alt}", shot.alt);
  // A phone's screen, much taller than wide, keeps a phone's width instead of the column's.
  const tall = shot.height > shot.width * 1.5;
  return (
    <figure className={`${tall ? "mx-auto max-w-60" : ""} ${className ?? ""}`}>
      <button
        type="button"
        data-shot-id={shot.id}
        aria-label={label}
        aria-haspopup="dialog"
        className="group relative block w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_18px_44px_-24px_var(--glow)] transition-[border-color,box-shadow] duration-200 hover:border-accent/50"
      >
        <Image
          src={shotSrc(shot, "light")}
          width={shot.width}
          height={shot.height}
          alt=""
          sizes={sizes}
          className={`h-auto w-full ${shot.dark ? "dark:hidden" : ""}`}
        />
        {shot.dark && (
          <Image
            src={shotSrc(shot, "dark")}
            width={shot.width}
            height={shot.height}
            alt=""
            sizes={sizes}
            className="hidden h-auto w-full dark:block"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/85 text-foreground opacity-80 transition-opacity group-hover:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>
      <figcaption className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {shot.caption}
      </figcaption>
    </figure>
  );
}
