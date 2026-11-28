/**
 * Colours for the generated images (Open Graph cards and icons). They are drawn outside
 * the page, so CSS variables cannot be used; these mirror the tokens in globals.css.
 */
export const ogTheme = {
  // Dark tokens: the cards are always dark because dark cards read best in link previews.
  background: "#11071f",
  foreground: "#f5f1fc",
  muted: "#b9aed0",
  border: "#2c1b4a",
  accent: "#b78cff",
  // The corner glow on the cards: violet fading to nothing.
  glow: "rgba(139, 61, 255, 0.42)",
  glowEnd: "rgba(139, 61, 255, 0)",
  // The Ashvanta mark as it is on the dark page (--logo-*): blue left leg, the right leg
  // in the text colour (the navy reversed), orange swoosh cut out of the dark ground.
  mark: {
    blue: "#1f6feb",
    navy: "#f5f1fc",
    orange: "#f58a1f",
    cut: "#11071f",
  },
  // The icons: the mark exactly as drawn, navy and all, on a white tile, so that it
  // reads in light and dark browser tabs alike (the owner, 2026-11-28).
  iconTile: "#ffffff",
  iconMark: {
    blue: "#1f6feb",
    navy: "#0b2a5b",
    orange: "#f58a1f",
    cut: "#ffffff",
  },
} as const;

/** Which colour each part of the mark takes: see ogTheme.mark and ogTheme.iconMark. */
export type MarkColours = { blue: string; navy: string; orange: string; cut: string };
