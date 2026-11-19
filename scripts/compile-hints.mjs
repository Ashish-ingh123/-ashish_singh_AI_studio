/*
  Adds a compile hint to the script files every page loads at start-up. It runs after
  `next build` (see the build script in package.json) and uses no packages.

  Why: on a first visit Chrome compiles a function the first time it is called, on the
  main thread. For the framework's own files (React DOM, the Next.js client runtime) and
  the Motion library that is a lot of functions at once, and it was the largest single
  task while the page starts. A file whose first line is the comment below is compiled
  ahead of time on a background thread while it downloads, so the main thread only has
  to run it. Chrome and Edge read the comment from version 136; every other browser
  skips it like any comment.

  Which files: the prerendered pages in .next/server/app list their start-up scripts as
  <script src> tags. Those of 30 KB and more get the hint. Smaller files have too little
  to compile to matter, and the polyfill file (marked noModule) is never downloaded by a
  browser that understands the hint.

  Next.js does not offer this itself, so this edits files it has generated. If a later
  version lays the build out differently, the step finds nothing, says so, and the build
  still succeeds without the hint. It never fails a build.
*/

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HINT = "//# allFunctionsCalledOnLoad\n";
const MIN_BYTES = 30_000;
const PAGES = join(".next", "server", "app");
const CHUNKS = join(".next", "static", "chunks");
// A script tag that loads a chunk. The first group is the file's path inside CHUNKS.
const SCRIPT_TAG =
  /<script\b[^>]*\bsrc="\/_next\/static\/chunks\/([^"?]+\.js)[^"]*"[^>]*>/gi;

/** Every .html file under a folder, at any depth. */
function htmlFiles(folder) {
  const found = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) found.push(...htmlFiles(path));
    else if (entry.name.endsWith(".html")) found.push(path);
  }
  return found;
}

function addHints() {
  // The start-up scripts of all pages, each name once.
  const names = new Set();
  for (const page of htmlFiles(PAGES)) {
    for (const [tag, name] of readFileSync(page, "utf8").matchAll(SCRIPT_TAG)) {
      if (!/\bnomodule\b/i.test(tag)) names.add(name);
    }
  }

  const hinted = [];
  for (const name of [...names].sort()) {
    const file = join(CHUNKS, name);
    if (statSync(file).size < MIN_BYTES) continue;
    const code = readFileSync(file, "utf8");
    // Running the step twice on one build must not add the line twice.
    if (!code.startsWith(HINT)) writeFileSync(file, HINT + code);
    hinted.push(name);
  }
  return hinted;
}

try {
  const hinted = addHints();
  if (hinted.length > 0) {
    console.log(
      `compile hints: ${hinted.length} start-up scripts (${hinted.join(", ")})`,
    );
  } else {
    console.warn(
      "compile hints: no start-up scripts found, nothing changed. The site works without the hint, but check this step against the current Next.js build output.",
    );
  }
} catch (error) {
  console.warn(
    `compile hints: skipped (${error instanceof Error ? error.message : error}). The site works without the hint.`,
  );
}
