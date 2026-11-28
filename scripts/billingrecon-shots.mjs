// One-off: BillingRecon's screenshots for the website (Step 6 of the Ashvanta site,
// 2026-11-28). Reads the PNGs of BillingRecon's docs/ui (read only), crops them and writes
// WebP files into public/images/billingrecon. Uses sharp, which Next.js already installs
// for its image optimisation: no package of our own. Run it again when BillingRecon's
// screenshots are retaken:
//
//   node scripts/billingrecon-shots.mjs [path to BillingRecon's docs/ui]
//
// It prints each file's width and height, which profile.product.screenshots must match.
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const source =
  process.argv[2] ??
  "C:/aptran2026/BillingRecon/BillingRecon/BillingRecon/BillingRecon/docs/ui";
const target = path.join(import.meta.dirname, "..", "public", "images", "billingrecon");
mkdirSync(target, { recursive: true });

// A full-page screenshot is cut to its first screen (1440 x 900): below that, the
// sidebar's background stops while the page goes on. The printed bill is cut to the page
// beside the sidebar instead, so the whole document shows. The phone view keeps the first
// screen and a half.
const firstScreen = { left: 0, top: 0, width: 1440, height: 900 };
const shots = [
  ["dashboard-built", firstScreen, true],
  ["bill-editor", firstScreen, true],
  ["bill-posted", firstScreen, true],
  ["allocating", firstScreen, true],
  ["inbox", firstScreen, true],
  ["statement", firstScreen, true],
  ["bill-printed-letterhead", { left: 240, top: 0, width: 1200, height: 1335 }, true],
  ["shift-close", firstScreen, false],
  ["accounting-export", firstScreen, false],
  ["report-bills", firstScreen, true],
  ["users", firstScreen, false],
  ["second-step-enrol", firstScreen, false],
  ["dashboard-built-phone", { left: 0, top: 0, width: 390, height: 1266 }, true],
];

for (const [name, crop, hasDark] of shots) {
  for (const variant of hasDark ? ["", "-dark"] : [""]) {
    // The phone's dark file is dashboard-built-phone-dark, as in BillingRecon.
    const file = `${name}${variant}`;
    const out = path.join(target, `${file}.webp`);
    const info = await sharp(path.join(source, `${file}.png`))
      .extract(crop)
      .webp({ quality: 80, effort: 6 })
      .toFile(out);
    console.log(`${file}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}
