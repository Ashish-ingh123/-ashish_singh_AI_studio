import { LogoMark } from "@/components/og/logo-mark";
import { ogTheme } from "@/components/og/theme";

type Props = {
  /** Width and height in pixels. */
  size: number;
  /**
   * Draw the mark on a solid tile of the page's dark colour, with room round it. For
   * the Apple icon: iOS fills see-through areas with black and cuts the corners itself,
   * so that icon must cover its whole square.
   */
  tile?: boolean;
};

/** How much of the tile's height the mark takes, which keeps it clear of iOS's corners. */
const TILE_SHARE = 0.62;

/**
 * The site icon: the small version of the logo's mark, the hexagon with the letter A and
 * no dot. Rendered to PNG by next/og, not by the browser.
 *
 * Without a tile the hexagon is as tall as the icon and the rest is see-through, so in a
 * browser tab it sits on whatever colour the tab has.
 */
export function BrandMark({ size, tile = false }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(tile && { backgroundColor: ogTheme.background }),
      }}
    >
      <LogoMark height={tile ? size * TILE_SHARE : size} small />
    </div>
  );
}
