---
name: ibm-deck
description: Build IBM Carbon Design System styled PPTX presentations from scratch using pptxgenjs. Use this skill whenever the user wants to create, build, or generate an IBM-branded slide deck, presentation, or proposal with Carbon design tokens, IBM Plex fonts, and professional light-theme styling. Also triggers when creating any PPTX with IBM corporate styling, Carbon color tokens, or when the user mentions "IBM deck", "Carbon slides", "IBM presentation", or wants to apply IBM branding to slides. If the user is building a PPTX and mentions IBM or Carbon Design System, use this skill.
user-invocable: true
---

# IBM Carbon Deck Builder

Build professional PPTX decks styled with IBM's Carbon Design System using pptxgenjs.

## Architecture

IBM decks combine two rendering approaches:

- **Title & divider slides**: HTML templates captured as 2x PNG screenshots, then embedded as full-bleed images. This produces premium backgrounds with gradient treatments, arc lines, and layered effects that pptxgenjs can't replicate programmatically.
- **Content slides**: Built programmatically with pptxgenjs using Carbon design tokens. This gives precise control over card layouts, bullet lists, metric callouts, and icons.

Title slides demand visual richness (layered backgrounds, subtle glows) that only HTML/CSS can deliver at high fidelity, while content slides benefit from the programmatic precision of pptxgenjs for consistent spacing and alignment. If HTML capture is not available or desired, use the programmatic title slide pattern below.

## Bundled Assets

This skill is fully self-contained. All assets are in the skill directory:

```
ibm-deck/
├── SKILL.md
├── assets/
│   ├── media/                         ← HC CY26 Kit background images
│   │   ├── hc-gradient-base.png       (gradient base layer)
│   │   ├── hc-glow-left.png          (left glow)
│   │   ├── hc-glow-right.png         (right glow)
│   │   ├── hc-arc-lines.png          (arc lines overlay)
│   │   ├── hc-alternate-bg.png       (alternate background)
│   │   └── hashicorp-logo.svg        (HC logo)
│   ├── fonts/                         ← Font files + CSS declarations
│   │   ├── inter.css                  (Inter font-face — HC CY26 Kit brand font)
│   │   ├── ibm-plex-sans.css         (IBM Plex Sans + Mono font-face)
│   │   ├── Inter-*.woff2             (Light, Regular, Medium, SemiBold, Bold)
│   │   ├── IBMPlexSans-*.woff2       (Light, Regular, Medium, SemiBold, Bold)
│   │   └── IBMPlexMono-*.woff2       (Regular, Medium, SemiBold)
│   ├── slide-title-template.html      ← Title slide with HC CY26 Kit background
│   └── slide-divider-template.html    ← Section divider slide
├── scripts/
│   ├── capture-title.mjs              ← Single-command title/divider capture
│   └── setup-workspace.sh             ← Symlinks media/fonts into working dir
└── references/
    ├── pptxgenjs-ibm.md               ← Complete code patterns
    └── html-capture.md                ← HTML capture pipeline details
```

## Quick Start

```bash
# 1. Install dependencies (project root)
npm install pptxgenjs react react-dom react-icons sharp

# 2. Capture title slide (single command — no workspace setup needed)
node .claude/skills/ibm-deck/scripts/capture-title.mjs \
  --line1 "Deck Title" --line2 "Second Line" \
  --subtitle "Subtitle Text" \
  --output images/slide-title.png

# 3. Write build script (run from repo root so relative paths resolve)
# 4. Run it
node build-<deck-name>.mjs
```

**Important**: Build scripts must be run from the **repository root**. Image paths in `addImage({ path: ... })` resolve relative to `process.cwd()`, not relative to the script file.

## Color Rules

pptxgenjs and SVG/React icons use hex colors differently. Getting this wrong is the most common error:

| Context | Format | Example |
|---------|--------|---------|
| **pptxgenjs** (fill, color, line) | Bare hex, NO `#` | `color: "0F62FE"` |
| **React icon SVG** rendering | WITH `#` prefix | `iconToBase64Png(Icon, "#" + C.blue60)` |
| **HTML/CSS** | Standard `#` prefix | `color: #0F62FE` |

The `#` prefix in pptxgenjs corrupts the PPTX XML and produces invisible elements.

## Carbon Design Tokens

```javascript
const C = {
  // Backgrounds
  white:    "FFFFFF",
  gray10:   "F4F4F4",  // panels, cards, code blocks

  // Borders
  gray20:   "E0E0E0",  // default border
  gray30:   "C6C6C6",  // strong border

  // Text
  gray100:  "161616",  // primary text
  gray70:   "525252",  // secondary text
  gray50:   "8D8D8D",  // placeholder/muted

  // Accents
  blue60:   "0F62FE",  // primary action
  purple60: "8A3FFC",
  teal60:   "009D9A",
  green60:  "198038",
  magenta60:"D02670",
  red60:    "DA1E28",
  yellow50: "B28600",
};
```

## Typography

| Element | Font | Size | Weight | Color | Max ~chars |
|---------|------|------|--------|-------|-----------|
| Section label | Arial | 10pt | Bold + charSpacing:3 | accent | 30 |
| Slide title | Arial Black | 22-26pt | Bold | gray100 | 45 |
| Subtitle | Arial | 12-13pt | Regular | gray70 | 90 |
| Card title | Arial | 14-16pt | Bold | gray100 | 35 |
| Body / bullets | Arial | 11-12pt | Regular | gray70 | 60 per line |
| Card description | Arial | 12pt | Regular | gray70 | 120 |
| Metric number | Arial Black | 24-36pt | Bold | accent | 15 |
| Metric label | Arial | 8-9pt | Bold + charSpacing:2 | gray50 | 20 |

Use `"Arial"` and `"Arial Black"` as fontFace values — universally available in PowerPoint. The HTML title/divider templates use **Inter** (the HashiCorp CY26 Kit brand font), loaded from `assets/fonts/inter.css`. IBM Plex Sans is available in `assets/fonts/` for IBM-branded variants.

## Build Script Skeleton

```javascript
import pptxgen from "pptxgenjs";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";  // 10" × 5.625"
pres.author = "Author Name";
pres.title = "Deck Title";

// ... add slides ...

await pres.writeFile({ fileName: "output.pptx" });
```

## Title Slides

### Option A: HTML Capture (Recommended)

Premium title slides use the bundled capture script — a single command that loads the HC CY26 Kit HTML template, substitutes your text, captures via Chrome headless at 2x, and outputs a 3840×2160 PNG. No workspace setup or symlinks needed.

```bash
node .claude/skills/ibm-deck/scripts/capture-title.mjs \
  --line1 "Deck Title" \
  --line2 "Second Line" \
  --subtitle "Subtitle Text" \
  --output images/slide-title.png
```

**Arguments:**

| Flag | Default | Description |
|------|---------|-------------|
| `--line1` | `"Title Line 1"` | First line of the title |
| `--line2` | `""` | Second line (optional) |
| `--subtitle` | `""` | Subtitle below title |
| `--footer` | `"© HashiCorp"` | Footer text |
| `--type` | `title` | `title` or `divider` |
| `--output` | `slide-title.png` | Output PNG path |

**Embed as full-bleed image:**

```javascript
const s1 = pres.addSlide();
s1.addImage({
  path: "images/slide-title.png",
  x: 0, y: 0, w: 10, h: 5.625,
});
```

The script resolves all asset paths (media/, fonts/) internally using absolute `file://` URLs, so it works from any directory. Background layers: `hc-gradient-base.png` (gradient), `hc-glow-left.png`, `hc-glow-right.png`, `hc-arc-lines.png`.

### Option B: Programmatic Title (No HTML Capture)

When Chrome headless isn't available, build the title slide directly in pptxgenjs:

```javascript
const s1 = pres.addSlide();
s1.background = { color: C.white };

// Top accent line
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.06,
  fill: { color: C.blue60 },
});

// Title
s1.addText("Deck Title", {
  x: 0.7, y: 1.8, w: 8.6, h: 1.0,
  fontSize: 40, fontFace: "Arial Black",
  color: C.gray100, bold: true, margin: 0,
});

// Subtitle
s1.addText("Subtitle Text", {
  x: 0.7, y: 2.8, w: 8.6, h: 0.5,
  fontSize: 18, fontFace: "Arial",
  color: C.gray70, margin: 0,
});

// Bottom bar
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.125, w: 10, h: 0.5,
  fill: { color: C.gray10 },
});

s1.addText("Organization Name", {
  x: 0.7, y: 5.125, w: 8.6, h: 0.5,
  fontSize: 12, fontFace: "Arial",
  color: C.gray70, valign: "middle", margin: 0,
});
```

## Section Divider Slides

Section dividers use the same capture script with `--type divider`:

```bash
node .claude/skills/ibm-deck/scripts/capture-title.mjs \
  --type divider \
  --line1 "Section Title" \
  --subtitle "Section subtitle" \
  --output images/slide-divider.png
```

Design: white background, 54px Inter SemiBold title, 1750px horizontal rule, 22px Inter Light subtitle in gray `#727274`.

## Slide Header Pattern

Every content slide starts with this structure. **Always set the white background** — pptxgenjs defaults may not be white:

```javascript
const slide = pres.addSlide();
slide.background = { color: C.white };  // REQUIRED on every content slide

// Section label (uppercase, accented, letter-spaced)
slide.addText("SECTION NAME", {
  x: 0.7, y: 0.35, w: 5, h: 0.3,
  fontSize: 10, fontFace: "Arial",
  color: C.teal60,  // varies per slide
  bold: true, charSpacing: 3, margin: 0,
});

// Title (use y: 0.65, h: 0.55 for larger 26pt titles)
slide.addText("Slide Title Here", {
  x: 0.7, y: 0.6, w: 8.6, h: 0.45,
  fontSize: 22, fontFace: "Arial Black",
  color: C.gray100, bold: true, margin: 0,
});

// Subtitle
slide.addText("Supporting description text", {
  x: 0.7, y: 1.0, w: 8.6, h: 0.3,
  fontSize: 12, fontFace: "Arial",
  color: C.gray70, margin: 0,
});
```

Content area starts at y ≈ 1.4-1.5. If using a larger 26pt title, push subtitle to y: 1.15 and content to y: 1.5-1.65.

## Key Patterns

Read `references/pptxgenjs-ibm.md` for complete code examples. Quick reference:

### Shadow Factory (CRITICAL)

pptxgenjs **mutates** option objects after passing them to `addShape()`. Reusing a shadow object across shapes produces corrupted values on the second shape. Always define shadows as factory functions at the top of the file — never write shadow objects inline:

```javascript
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});
```

### Card with Left Accent Bar

```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: cx, y: cy, w: cardW, h: cardH,
  fill: { color: C.gray10 },
  shadow: cardShadow(),  // fresh instance every call
});

slide.addShape(pres.shapes.RECTANGLE, {
  x: cx, y: cy, w: 0.06, h: cardH,
  fill: { color: accentColor },
});
```

### Card with Top Accent Bar

```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: px, y: py, w: pillarW, h: pillarH,
  fill: { color: C.gray10 }, shadow: cardShadow(),
});

slide.addShape(pres.shapes.RECTANGLE, {
  x: px, y: py, w: pillarW, h: 0.05,
  fill: { color: accentColor },
});
```

### Bullet Lists

`breakLine` adds a paragraph break after each item. Set it to `false` on the last item to avoid trailing whitespace:

```javascript
const bullets = items.map((item, idx) => ({
  text: item,
  options: {
    bullet: { code: "2022" },
    breakLine: idx < items.length - 1,  // false on last item
    fontSize: 11, color: C.gray70,
    paraSpaceAfter: 6,
  },
}));

slide.addText(bullets, {
  x, y, w, h,
  fontFace: "Arial", valign: "top", margin: 0,
});
```

### React Icons → PNG Base64

`iconToBase64Png()` is **async** — always `await` it. Missing `await` produces `[object Promise]` instead of image data:

```javascript
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import sharp from "sharp";

async function iconToBase64Png(Icon, color, size = 256) {
  const svg = renderToStaticMarkup(createElement(Icon, { color, size: String(size) }));
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// MUST await — this is async
const iconData = await iconToBase64Png(FaShieldAlt, "#" + C.green60, 256);
slide.addImage({ data: iconData, x, y, w: 0.38, h: 0.38 });
```

### Bottom Callout Bar

Position at y ≈ 4.5-4.75 depending on content above. Match tint color to slide accent (see Tint Color Guide below):

```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 4.5, w: 8.6, h: 0.55,
  fill: { color: "F0F5FF" },
  line: { color: C.blue60, width: 1 },
});

slide.addText([
  { text: "Bold prefix: ", options: { bold: true, color: C.gray100 } },
  { text: "Regular description text.", options: { color: C.gray70 } },
], {
  x: 1.4, y: 4.5, w: 7.7, h: 0.55,
  fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
});
```

## Layout Recipes

These are starting points — adjust dimensions based on content volume. All values in inches.

### 2×2 Card Grid (4 items)
- Cards: w=4.1, h=1.35, gapX=0.4, gapY=0.2
- Start: x=0.7, y=1.4

### 3-Column Pillars (3 items)
- Pillars: w=2.75, h=2.7-3.0, gap=0.45
- Start: x=0.7, y=1.5-1.65
- Note: Bottom of 3.0-tall pillars reaches y≈4.65 — push callout bar to y≈4.75

### 2-Column Split (list + stats)
- Left column: x=0.7, w=4.5
- Right column: x=5.6, w=4.0

### Metric Callout Cards (3 items)
- Cards: w=2.75, h=3.4, gap=0.45
- Start: x=0.7, y=1.45
- Inset metric box: x+0.15, y+1.75, w-0.3, h=1.4

### Timeline Phase Cards (3 items)
- Cards: w=2.75, h=2.7, gap=0.45
- Start: x=0.7, y=1.5
- Number circle: centered, 0.48×0.48 `pres.shapes.OVAL`
- Arrow connectors between cards (FaArrowRight icon)

### Stacked Horizontal Cards (4 items)
- Cards: w=4.5, h=0.68, gap=0.10
- Start: x=0.7, y=1.45
- Icon: 0.38×0.38 at x+0.15
- Title at x+0.65, desc below

## Critical Rules

1. **No "#" prefix on pptxgenjs colors** — see Color Rules table above.
2. **Always `await` async functions** — `iconToBase64Png()` returns a Promise. Missing `await` silently breaks images.
3. **Never reuse shadow/option objects** — always use `() => ({...})` factory functions. Never write shadow objects inline.
4. **Set `slide.background = { color: C.white }`** on every content slide — don't rely on defaults.
5. **Coordinates are in inches** — LAYOUT_16x9 is 10" wide × 5.625" tall.
6. **Content padding** — start content at y≈1.4 (0.8-1.0" below header). Too tight looks cramped.
7. **Text overflow** — respect the max character counts in the Typography table. Reduce fontSize or increase dimensions if wrapping occurs.
8. **Footer clearance** — bottom callout bars at y≈4.5-4.75. Taller content layouts (3.0" pillars) push the callout lower.
9. **Working directory** — run build scripts from the repo root. The capture script (`scripts/capture-title.mjs`) resolves all asset paths automatically — no workspace setup needed for title/divider slides.

## Tint Color Guide

For callout bars and tinted backgrounds — match to the slide's section accent:

| Accent | Tint Background | Border |
|--------|----------------|--------|
| Blue | `"F0F5FF"` | `C.blue60` |
| Green | `"F0FFF4"` | `C.green60` |
| Yellow | `"FFF8F0"` | `C.yellow50` |
| Red | `"FFF0F0"` | `C.red60` |
| Purple | `"F5F0FF"` | `C.purple60` |
| Teal | `"F0FFFC"` | `C.teal60` |

## QA Pipeline (Required)

**Assume there are problems. Your job is to find them.**

Your first render is almost never pixel-perfect. Text wraps differently than you expect, cards overflow by a fraction of an inch, callout bars collide with content above them. These issues are invisible in code but obvious in a screenshot. You cannot skip this step — visual review is mandatory before delivering the deck.

### Step 1: Convert to Images

```bash
python .claude/skills/pptx/scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

This produces `slide-1.jpg`, `slide-2.jpg`, etc.

### Step 2: Visual Inspection via Subagent

Use a subagent with fresh eyes — you wrote the code and will see what you expect, not what's actually rendered. The subagent catches what you miss.

Spawn a subagent with this prompt, listing every slide image:

```
Visually inspect these slides. Assume there are issues — find them.

Look for:
- Overlapping elements (text bleeding through shapes, lines crossing words)
- Text overflow or cut off at card/box boundaries (truncated words, clipped lines)
- Decorative lines or accent bars positioned for single-line text but title wrapped to two lines
- Callout bars or footers colliding with content above them
- Elements too close together (< 0.3" gaps) or cards nearly touching
- Uneven gaps (large empty area in one place, cramped in another)
- Insufficient margin from slide edges (< 0.5")
- Columns or similar elements not aligned consistently
- Low-contrast text (light gray on white, dark on dark)
- Low-contrast icons (icons blending into background without a contrasting circle)
- Text boxes too narrow causing excessive line wrapping
- Bullet text extending beyond its card or column boundary

For each slide, list ALL issues found, even minor ones. If a slide looks clean, say so — but look hard first.

Read and analyze these images:
1. /path/to/slide-1.jpg (Expected: [brief description of slide])
2. /path/to/slide-2.jpg (Expected: [brief description of slide])
...
```

### Step 3: Fix and Re-verify

For each issue found:
1. Fix the code (adjust dimensions, reduce text, increase card height, move elements)
2. Rebuild the PPTX
3. Re-convert only the affected slides:
   ```bash
   python .claude/skills/pptx/scripts/office/soffice.py --headless --convert-to pdf output.pptx
   pdftoppm -jpeg -r 150 -f N -l N output.pdf slide-fixed
   ```
4. Inspect the fixed slides (via subagent or directly)

One fix often creates a new problem — a taller card pushes content into the callout bar, or wider text breaks alignment with adjacent columns. Re-verify until a full pass finds no new issues.

### Common Fixes

| Problem | Fix |
|---------|-----|
| Text clipped at card bottom | Increase card height (`h`) by 0.2-0.3" or reduce bullet count |
| Callout bar overlaps content | Move callout bar down (`y += 0.2`) or shrink content above |
| Text wraps unexpectedly | Reduce `fontSize` by 1-2pt, or increase text box `w` |
| Cards not aligned | Use consistent `y` values; calculate from shared starting point |
| Too tight between elements | Add 0.15-0.2" to gaps; content breathing room matters |

**Do not declare the deck complete until you have completed at least one full inspect-fix-verify cycle.**
