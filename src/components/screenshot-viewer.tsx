"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { profile, type Screenshot } from "@/content/profile";
import { shotSrc } from "@/lib/screenshots";

const labels = profile.labels.screens;

/**
 * The full-size view of the page's screenshots (Step 6 of the Ashvanta site, 2026-11-28).
 * Mounted once per page with every screenshot the page shows, in order; a click on any
 * element with data-shot-id (the Shot component's button) opens that screenshot here, so
 * the screenshots themselves stay server-rendered.
 *
 * It is a native dialog opened with showModal(), as the command palette is: the browser
 * supplies the focus trap, Escape, the inert page behind and the backdrop, so none of that
 * is written by hand. The left and right arrow keys, and two buttons, move to the previous
 * and next screenshot; a click on the backdrop closes it; closing gives the focus back to
 * the screenshot that opened it. Nothing in it animates. It renders nothing until opened,
 * so no full-size file is fetched before a visitor asks for one.
 */
export function ScreenshotViewer({ shots }: { shots: Screenshot[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // One listener for the whole page: any screenshot button opens its picture here.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const opener = target.closest<HTMLElement>("[data-shot-id]");
      if (!opener) return;
      const found = shots.findIndex((shot) => shot.id === opener.dataset.shotId);
      if (found < 0) return;
      openerRef.current = opener;
      setIndex(found);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [shots]);

  // Open the dialog once its content is rendered.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (index !== null && dialog && !dialog.open) dialog.showModal();
  }, [index]);

  const step = useCallback(
    (by: number) =>
      setIndex((current) =>
        current === null ? current : (current + by + shots.length) % shots.length,
      ),
    [shots.length],
  );

  if (index === null) return null;
  const shot = shots[index];
  if (!shot) return null;
  const counter = labels.counter
    .replace("{n}", String(index + 1))
    .replace("{total}", String(shots.length));

  return (
    <dialog
      ref={dialogRef}
      aria-label={shot.caption}
      className="screenshot-viewer"
      // The browser fires close for Escape and for dialog.close(): then the state is
      // cleared and the focus returns to the screenshot that opened it.
      onClose={() => {
        setIndex(null);
        openerRef.current?.focus();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
      // A click on the dialog element itself is a click on the backdrop around the panel.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="flex max-h-[92dvh] flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
          <p className="font-mono text-sm text-muted-foreground" aria-live="polite">
            {counter}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
            aria-label={labels.close}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-muted/40 p-2 sm:p-4">
          <Image
            key={`${shot.id}-light`}
            src={shotSrc(shot, "light")}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            sizes="(min-width: 1280px) 1200px, 96vw"
            className={`mx-auto h-auto w-full max-w-[1200px] rounded-lg ${shot.dark ? "dark:hidden" : ""}`}
          />
          {shot.dark && (
            <Image
              key={`${shot.id}-dark`}
              src={shotSrc(shot, "dark")}
              width={shot.width}
              height={shot.height}
              alt={shot.alt}
              sizes="(min-width: 1280px) 1200px, 96vw"
              className="mx-auto hidden h-auto w-full max-w-[1200px] rounded-lg dark:block"
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() => step(-1)}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {labels.previous}
          </button>
          <p className="hidden text-center text-sm text-muted-foreground sm:block">
            {shot.caption}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            {labels.next}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
