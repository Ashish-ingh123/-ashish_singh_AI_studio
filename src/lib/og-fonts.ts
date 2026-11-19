import { cacheLife } from "next/cache";

const FAMILY = "Geist";
const WEIGHTS = [400, 700] as const;
type Weight = (typeof WEIGHTS)[number];

const CSS_URL = `https://fonts.googleapis.com/css2?family=${FAMILY}:wght@${WEIGHTS.join(";")}`;
// Google Fonts chooses the file format from the browser it sees. Presenting an old Safari
// gets plain TrueType files, the one format next/og can read.
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

type FontFile = { weight: Weight; base64: string };

/**
 * Downloads the font files once per build. "use cache" stores the result with the build
 * output, which is what lets the image routes that call it be prerendered as static files.
 */
async function fetchFontFiles(): Promise<FontFile[]> {
  "use cache";
  cacheLife("max");

  const cssResponse = await fetch(CSS_URL, { headers: { "User-Agent": LEGACY_UA } });
  if (!cssResponse.ok) {
    throw new Error(`Google Fonts stylesheet request failed: ${cssResponse.status}`);
  }
  const css = await cssResponse.text();

  const files: FontFile[] = [];
  const face =
    /font-weight:\s*(\d+);[\s\S]*?src:\s*url\(([^)]+)\)\s*format\('truetype'\)/g;
  for (const [, weightText, url] of css.matchAll(face)) {
    const weight = WEIGHTS.find((known) => known === Number(weightText));
    if (!weight) continue;
    const fileResponse = await fetch(url);
    if (!fileResponse.ok) {
      throw new Error(`Font file download failed: ${fileResponse.status}`);
    }
    const bytes = Buffer.from(await fileResponse.arrayBuffer());
    files.push({ weight, base64: bytes.toString("base64") });
  }
  if (files.length !== WEIGHTS.length) {
    throw new Error("Google Fonts did not return every requested weight");
  }
  return files;
}

export type OgFont = {
  name: string;
  data: Buffer;
  weight: Weight;
  style: "normal";
};

/**
 * Fonts for next/og. Passing any font replaces its bundled default, Geist Regular, so both
 * weights come together. If Google Fonts cannot be reached during the build, this returns
 * undefined and next/og falls back to the bundled regular weight instead of failing.
 */
export async function loadOgFonts(): Promise<OgFont[] | undefined> {
  try {
    const files = await fetchFontFiles();
    return files.map((file) => ({
      name: FAMILY,
      data: Buffer.from(file.base64, "base64"),
      weight: file.weight,
      style: "normal",
    }));
  } catch (error) {
    console.warn(
      `[og] Could not load ${FAMILY} from Google Fonts; using the font bundled with next/og.`,
      error instanceof Error ? error.message : error,
    );
    return undefined;
  }
}
