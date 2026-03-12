#!/usr/bin/env node
/**
 * Captures an HC CY26 Kit title slide as a high-res PNG.
 *
 * Takes title text as arguments, substitutes into the bundled HTML template,
 * renders via Chrome headless at 2x scale, and outputs a 3840×2160 PNG
 * ready to embed as a full-bleed pptxgenjs slide.
 *
 * Usage:
 *   node .claude/skills/ibm-deck/scripts/capture-title.mjs \
 *     --line1 "Deck Title" \
 *     --line2 "Second Line" \
 *     --subtitle "Subtitle Text" \
 *     --output path/to/slide-title.png
 *
 * Optional:
 *   --footer "© Company"     (default: "© HashiCorp")
 *   --type title|divider     (default: title)
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { tmpdir } from "os";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SKILL_DIR = resolve(__dirname, "..");
const ASSETS_DIR = resolve(SKILL_DIR, "assets");
const MEDIA_DIR = resolve(ASSETS_DIR, "media");
const FONTS_DIR = resolve(ASSETS_DIR, "fonts");

const CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// --- Parse arguments ---
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : fallback;
}

const line1 = getArg("line1", "Title Line 1");
const line2 = getArg("line2", "");
const subtitle = getArg("subtitle", "");
const footer = getArg("footer", "\u00a9 HashiCorp");
const outputPath = getArg("output", "slide-title.png");
const slideType = getArg("type", "title");

// --- Choose template ---
const templateFile =
  slideType === "divider"
    ? "slide-divider-template.html"
    : "slide-title-template.html";

let html = readFileSync(resolve(ASSETS_DIR, templateFile), "utf-8");

// --- Rewrite relative paths to absolute file:// URLs ---
// Chrome headless blocks file:// access through symlinks, so we embed
// absolute paths directly into the HTML. This is the key fix — relative
// paths like url('media/foo.png') and href="fonts/inter.css" won't resolve
// from a temp directory even with symlinks.
html = html.replace(
  /url\('media\//g,
  `url('file://${MEDIA_DIR}/`
);
html = html.replace(
  /href="fonts\//g,
  `href="file://${FONTS_DIR}/`
);

// --- Substitute placeholders ---
if (slideType === "divider") {
  html = html.replace(/\{\{SECTION_TITLE\}\}/g, line1);
  html = html.replace(/\{\{SECTION_SUBTITLE\}\}/g, subtitle || line2);
} else {
  html = html.replace(/\{\{TITLE\}\}/g, `${line1} \u2014 ${line2}`);
  html = html.replace(/\{\{TITLE_LINE1\}\}/g, line1);
  html = html.replace(/\{\{TITLE_LINE2\}\}/g, line2);
  html = html.replace(/\{\{SUBTITLE\}\}/g, subtitle);
}
html = html.replace("\u00a9 HashiCorp", footer);

// --- Write temp HTML ---
const tempDir = resolve(tmpdir(), `ibm-deck-capture-${Date.now()}`);
mkdirSync(tempDir, { recursive: true });

try {
  const htmlPath = resolve(tempDir, "slide.html");
  writeFileSync(htmlPath, html);

  // Ensure output directory exists
  const outDir = dirname(resolve(outputPath));
  mkdirSync(outDir, { recursive: true });

  // Capture with Chrome headless at 2x
  const absOutput = resolve(outputPath);
  const cmd = [
    `"${CHROME_PATH}"`,
    "--headless",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--allow-file-access-from-files",
    `--screenshot=${absOutput}`,
    "--window-size=1920,1080",
    "--force-device-scale-factor=2",
    `"file://${htmlPath}"`,
  ].join(" ");

  console.log(`Capturing ${slideType} slide...`);
  console.log(`  Line 1: ${line1}`);
  if (line2) console.log(`  Line 2: ${line2}`);
  if (subtitle) console.log(`  Subtitle: ${subtitle}`);

  execSync(cmd, { stdio: "pipe" });

  // Verify output
  const { statSync } = await import("fs");
  const stats = statSync(absOutput);
  const sizeKB = Math.round(stats.size / 1024);
  console.log(`  \u2713 Saved to ${absOutput} (${sizeKB} KB)`);

  if (sizeKB < 100) {
    console.warn(
      "  \u26a0 File seems small — background images may not have loaded."
    );
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
