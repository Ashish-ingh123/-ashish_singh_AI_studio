import { LogoMark } from "@/components/og/logo-mark";
import { ogTheme } from "@/components/og/theme";
import { logoBox } from "@/lib/logo-shapes";

type Props = {
  /** Width and height in pixels. */
  size: number;
  /**
   * The Apple icon: iOS rounds the corners itself and fills see-through areas with black,
   * so that icon is a square tile that covers its whole area, with more room round the
   * mark to keep it clear of the corners iOS cuts.
   */
  apple?: boolean;
};

/** How much of the icon's width the mark takes: a browser tab's icon, the Apple icon. */
const TAB_SHARE = 0.86;
const APPLE_SHARE = 0.7;

/**
 * The site icon: the small version of the Ashvanta mark (no squares) on a white tile, in
 * the logo's own colours, so it reads on light and dark browser tabs alike (the owner
 * chose the tile on 2026-11-28). The tab icon's tile has rounded corners of its own; the
 * Apple icon's is square, because iOS rounds it. Rendered to PNG by next/og, not by the
 * browser.
 */
export function BrandMark({ size, apple = false }: Props) {
  const share = apple ? APPLE_SHARE : TAB_SHARE;
  // The mark is wider than tall, so its width sets the fit; LogoMark takes a height.
  const markHeight = (size * share * logoBox.small.height) / logoBox.small.width;
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ogTheme.iconTile,
        ...(apple ? {} : { borderRadius: size * 0.22 }),
      }}
    >
      <LogoMark height={markHeight} small colours={ogTheme.iconMark} />
    </div>
  );
}
