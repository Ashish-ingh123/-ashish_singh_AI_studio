import { LogoMark } from "@/components/og/logo-mark";
import { ogTheme } from "@/components/og/theme";

/** Standard social preview size. */
export const ogSize = { width: 1200, height: 630 };

type Props = {
  /** Small accent label above the heading, for example "Case study". */
  eyebrow?: string;
  /** Tags shown as outlined pills in the top row. */
  chips: string[];
  heading: string;
  subheading: string;
  /** A filled accent pill in the footer, for example a project status. */
  badge?: string;
  footerLeft: string;
  footerRight: string;
};

/**
 * The layout of every Open Graph card. next/og renders this JSX to a PNG with a subset of
 * CSS: flexbox only, so every box with several children says display: flex.
 */
export function OgCard({
  eyebrow,
  chips,
  heading,
  subheading,
  badge,
  footerLeft,
  footerRight,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px 56px",
        backgroundColor: ogTheme.background,
        color: ogTheme.foreground,
        fontFamily: "Geist",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -280,
          right: -220,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background: `radial-gradient(circle, ${ogTheme.glow} 0%, ${ogTheme.glowEnd} 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 14,
          height: "100%",
          backgroundColor: ogTheme.accent,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {eyebrow && (
          <div
            style={{
              color: ogTheme.accent,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
              marginRight: 10,
            }}
          >
            {eyebrow.toUpperCase()}
          </div>
        )}
        {chips.map((chip) => (
          <div
            key={chip}
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 9999,
              border: `2px solid ${ogTheme.border}`,
              color: ogTheme.muted,
              fontSize: 24,
            }}
          >
            {chip}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          {heading}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 38,
            lineHeight: 1.3,
            color: ogTheme.muted,
          }}
        >
          {subheading}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 26,
          color: ogTheme.muted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {badge && (
            <div
              style={{
                display: "flex",
                padding: "6px 16px",
                borderRadius: 9999,
                backgroundColor: ogTheme.accent,
                color: ogTheme.background,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {badge}
            </div>
          )}
          <div>{footerLeft}</div>
        </div>
        {/*
          The logo's mark signs the card, beside the site's address. It sits here and
          not in the top row because a case study's tags fill that row from edge to edge.
        */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LogoMark height={48} />
          <div>{footerRight}</div>
        </div>
      </div>
    </div>
  );
}
