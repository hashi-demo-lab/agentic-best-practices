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
node <skill-dir>/scripts/capture-title.mjs \
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

### Gradient Color Triplets (dark → mid → light)

For SVG → PNG gradient bars and gradient text. Use with `#` prefix (SVG context):

| Accent | Dark | Mid | Light |
|--------|------|-----|-------|
| red60 | `#A01520` | `#DA1E28` | `#FF4D55` |
| yellow50 | `#8A6800` | `#B28600` | `#F59E0B` |
| purple60 | `#627EEF` | `#8A3FFC` | `#D946EF` |
| teal60 | `#007D79` | `#009D9A` | `#2DD4BF` |
| green60 | `#0E6027` | `#198038` | `#34D478` |
| blue60 | `#0043CE` | `#0F62FE` | `#4589FF` |
| magenta60 | `#9F1853` | `#D02670` | `#FF7EB6` |

## Typography

| Element | Font | Size | Weight | Color | Max ~chars |
|---------|------|------|--------|-------|-----------|
| Section label | Arial | 10pt | Bold + charSpacing:3 | accent | 30 |
| Slide title | Arial Black | 22-26pt | Bold | gray100 | 45 |
| Subtitle | Arial | 12-13pt | Regular | gray70 | 90 |
| Card title | Arial | 14-16pt | Bold | gray100 | 35 |
| Body / bullets | Arial | 11-12pt | Regular | gray70 | 60 per line |
| Card body (narrow) | Arial | 9-10pt | Regular | gray70 | 40 per line |
| Card description | Arial | 12pt | Regular | gray70 | 120 |
| Step numbers | Arial | 9pt | Bold + charSpacing:2 | accent | 5 |
| Callout bar text | Arial | 10.5-11pt | Mixed | gray70/100 | 90 |
| Metric number | Arial Black | 24-36pt | Bold | accent | 15 |
| Metric label | Arial | 9pt | Bold + charSpacing:2 | gray50 | 20 |

**Minimum 9pt for any text** — anything smaller is unreadable when projected. Section labels and step numbers that were 7-8pt in early builds were invisible on projectors.

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
node <skill-dir>/scripts/capture-title.mjs \
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
node <skill-dir>/scripts/capture-title.mjs \
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

### Card with Left Accent Bar (Gradient)

```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: cx, y: cy, w: cardW, h: cardH,
  fill: { color: C.gray10 },
  shadow: cardShadow(),  // fresh instance every call
});

// Gradient left accent (w: 0.08 minimum for projection visibility)
const vBar = await renderVerticalGradientBar(gradientColors, 8, 260);
slide.addImage({ data: vBar, x: cx, y: cy, w: 0.08, h: cardH });
```

### Card with Top Accent Bar (Gradient)

```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: px, y: py, w: pillarW, h: pillarH,
  fill: { color: C.gray10 }, shadow: cardShadow(),
});

// Gradient top accent (h: 0.08 minimum for projection visibility)
const bar = await renderGradientBar(gradientColors, 400, 8, 0);
slide.addImage({ data: bar, x: px, y: py, w: pillarW, h: 0.08 });
```

### Arrow Icons Between Cards

LINE shapes with `endArrowType: "triangle"` are too thin to see when projected. Use FaArrowRight icon images instead:

```javascript
import { FaArrowRight } from "react-icons/fa";

const arrowImg = await iconToBase64Png(FaArrowRight, "#" + arrowColor, 256);
slide.addImage({
  data: arrowImg,
  x: arrowX,  // midpoint between cards
  y: arrowY,  // vertically centered on cards
  w: 0.22,
  h: 0.22,
});
```

### Gradient Hero Title Text

Render large gradient-colored text (e.g., card hero titles like "Establish", "Enable") as SVG→PNG. This is the only way to get gradient text in pptxgenjs:

```javascript
const titleGrad = [
  { offset: 0, color: "#627EEF" },
  { offset: 50, color: "#8A3FFC" },
  { offset: 100, color: "#D946EF" },
];
const titleRW = title.length > 7 ? 900 : 700;  // wider SVG for longer text
const titleImg = await renderGradientTitle(title, titleGrad, titleRW, 120);
const titleW = cardW - px(50);
const titleH = titleW * (120 / titleRW);  // preserve aspect ratio
slide.addImage({ data: titleImg, x: cx + px(30), y: cy + px(78), w: titleW, h: titleH });
```

Adjust `titleRW` based on text length to avoid clipping — longer words need a wider SVG canvas.

### REQUIRED / MANDATORY Badge

A filled pill-shaped badge used to flag mandatory items on prerequisite or checklist cards:

```javascript
// Filled accent badge
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: cx + cardW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
  fill: { color: accentColor }, rectRadius: 0.05,
});
slide.addText("REQUIRED", {
  x: cx + cardW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
  fontSize: 8, fontFace: "Arial", color: C.white,
  bold: true, align: "center", valign: "middle", charSpacing: 1.5, margin: 0,
});
```

For mandatory card highlighting, combine a tinted background + colored border:

```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: cx, y: cy, w: cardW, h: cardH,
  fill: { color: "E8F7F7" },  // tinted bg instead of gray10
  line: { color: accentColor, width: 1.5 },  // accent border
  shadow: cardShadow(),
});
```

### Pixel-to-Inch Conversion Helper

For precise positioning when translating pixel-based designs to pptxgenjs inches:

```javascript
const px = (v) => v / 192;  // 1920px = 10 inches → 192px per inch
```

This is useful when porting layouts from 1920×1080 HTML slides to pptxgenjs. Use it for all coordinates to maintain exact proportions.

### Bullet Lists

Bullet text inside cards is the most common source of overflow — text wraps more than expected in narrow columns (2.75" cards have only ~2.35" of usable text width). Keep bullet text short (under 40 chars per bullet) and ensure the text box `h` value leaves room within the card boundary. If the card is `h: 3.0` and bullets start at `y + 1.4`, the bullet text box can be at most `h: 1.45` to stay inside.

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

### 4-Column Compounding Value Cards (Strategic Impact)
- Cards: w≈2.06" (px(396)), h≈2.81" (px(540)), gap calculated from x-offsets
- Use `ROUNDED_RECTANGLE` with `rectRadius: 0.08` and per-card tinted `bgColor`
- Each card: gradient accent bar (borderRadius=16), step number ("01"), gradient hero title (renderGradientTitle), subtitle, divider LINE, 4 items, divider LINE, outcome text
- Arrow connectors (FaArrowRight) between cards
- Start: x=px(102), y=px(250) — use `px = v / 192` helper
- Custom colors per card: `bgColor`, `divColor`, `outcomeColor`, `numColor`, `arrowColor`

### 4-Column Prerequisite / Checklist Cards
- Cards: w=2.0, h=2.95, gap=0.27
- Start: x=0.7, y=1.5
- Last card (or flagged card): tinted bg + colored border + REQUIRED badge
- Badge: ROUNDED_RECTANGLE filled with accent, white "REQUIRED" text, 8pt, charSpacing:1.5
- Mandatory card text uses `gray100` instead of `gray70` for emphasis

## Gradient Fills — NOT SUPPORTED in pptxgenjs v4

pptxgenjs v4 `fill.type` only supports `'solid'` or `'none'`. Using `type: "gradient"` with `color1`/`color2` silently produces **corrupted OOXML** — the PPTX will not open in PowerPoint or Keynote. There is no `GradientFill` interface in the v4 type definitions.

### Workaround: SVG → PNG via sharp

Render gradient elements as SVG, convert to PNG, and embed as images. This gives visual gradients while keeping surrounding text/shapes natively editable.

```javascript
import sharp from "sharp";

// Gradient accent bar (e.g., top of a card)
async function renderGradientBar(colors, width = 396, height = 8, borderRadius = 16) {
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="50%" stop-color="${colors[1]}"/>
        <stop offset="100%" stop-color="${colors[2]}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${borderRadius > 0 ? borderRadius * 2 : height}" rx="${borderRadius}" fill="url(#${gid})"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Vertical gradient bar (e.g., left accent on cards)
async function renderVerticalGradientBar(colors, width = 8, height = 260) {
  const gid = "vb" + Math.random().toString(36).slice(2, 8);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="50%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#${gid})"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Gradient text (e.g., hero titles)
async function renderGradientTitle(text, stops, width = 700, height = 120) {
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  const stopsSvg = stops.map(s => `<stop offset="${s.offset}%" stop-color="${s.color}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0.3">${stopsSvg}</linearGradient></defs>
    <text x="0" y="${height * 0.75}" font-size="${height * 0.82}" font-weight="800"
      font-family="Arial,Helvetica,sans-serif" fill="url(#${gid})">${text}</text>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Usage — horizontal top accent bar (h: 0.08 minimum for projection visibility)
const barImg = await renderGradientBar(["#627EEF", "#8A3FFC", "#D946EF"], 400, 8, 0);
slide.addImage({ data: barImg, x: cx, y: cy, w: cardW, h: 0.08 });

// Usage — vertical left accent bar (w: 0.08 minimum for projection visibility)
const vBarImg = await renderVerticalGradientBar(["#627EEF", "#8A3FFC", "#D946EF"], 8, 260);
slide.addImage({ data: vBarImg, x: cx, y: cy, w: 0.08, h: cardH });

// Usage — gradient hero title text
const titleImg = await renderGradientTitle("Establish", [
  { offset: 0, color: "#627EEF" },
  { offset: 50, color: "#8A3FFC" },
  { offset: 100, color: "#D946EF" },
], 700, 120);
slide.addImage({ data: titleImg, x: cx + 0.15, y: cy + 0.4, w: 1.8, h: 0.31 });
```

**Key details**:
- When `borderRadius > 0`, the SVG `<rect>` height must be `borderRadius * 2` (taller than the bar) so rounded corners clip correctly within the viewBox. When `borderRadius = 0`, use the actual `height` value — otherwise `borderRadius * 2 = 0` produces an invisible zero-height rect.
- Minimum visible size when projected: **0.08"** for both horizontal bar height and vertical bar width. Values of 0.05-0.06" are nearly invisible on projectors.

### rectRadius

`rectRadius` on `ROUNDED_RECTANGLE` is a **fraction from 0.0 to 1.0** (not absolute inches). Values above 1.0 produce invalid OOXML.

## Critical Rules

1. **No "#" prefix on pptxgenjs colors** — see Color Rules table above.
2. **Always `await` async functions** — `iconToBase64Png()` returns a Promise. Missing `await` silently breaks images.
3. **Never reuse shadow/option objects** — always use `() => ({...})` factory functions. pptxgenjs **mutates** shadow objects in place during XML generation, converting values to EMU units. On the second use, these already-converted values get converted again, producing values that overflow INT32 and corrupt the PPTX. Never write shadow objects inline.
4. **No gradient fills** — `fill.type` only supports `'solid'` or `'none'` in v4. Use the SVG → PNG workaround above for gradients.
5. **Set `slide.background = { color: C.white }`** on every content slide — don't rely on defaults.
6. **Coordinates are in inches** — LAYOUT_16x9 is 10" wide × 5.625" tall.
7. **Content padding** — start content at y≈1.4 (0.8-1.0" below header). Too tight looks cramped.
8. **Text overflow** — respect the max character counts in the Typography table. Reduce fontSize or increase dimensions if wrapping occurs.
9. **Footer clearance** — bottom callout bars at y≈4.5-4.75. Taller content layouts (3.0" pillars) push the callout lower.
10. **Working directory** — run build scripts from the repo root. The capture script (`scripts/capture-title.mjs`) resolves all asset paths automatically — no workspace setup needed for title/divider slides.
11. **Title slides are HTML captures** — title slide text lives in the HTML source file, not in `pres.title`. Changing `pres.title` in the build script does NOT update the rendered title slide. To update title text: edit the HTML → recapture via Chrome headless → rebuild PPTX.
12. **Capture from the directory containing assets** — HTML title slides use relative paths to `media/` and `fonts/` folders. Always `cd` into the directory where `media/` and `fonts/` exist, then run Chrome headless from there. Copying the HTML elsewhere without its assets produces a blank white background. **Verify PNG file size after every capture** — the HC CY26 Kit background layers (gradient base, left glow, right glow, arc lines) produce a 3840×2160 PNG around **2–3MB**. If the file is under 2MB, the backgrounds rendered partially or at reduced quality — recapture. Under 200KB means assets failed to load entirely. Compare against a known-good reference if available (e.g., extract `image-1-1.png` from a working PPTX via `unzip` and check its size).
13. **Output filename matches branding** — when rebranding a deck, also update the `fileName` in `pres.writeFile()` to match the new name.
14. **Always rebuild after text changes** — after any edit to the build script, run `node build-<deck>.mjs` to regenerate. Never leave stale PPTX builds.
15. **Case-matching when rebranding** — when replacing branded terms across a deck, match the case of each occurrence: `UPPERCASE` section labels stay uppercase, `Title Case` stays title case, `lowercase` body text stays lowercase.

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
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

This produces `slide-1.jpg`, `slide-2.jpg`, etc.

### Step 2: Visual Inspection via Subagent(s)

Use subagents with fresh eyes — you wrote the code and will see what you expect, not what's actually rendered. Subagents catch what you miss.

For decks with 6+ slides, spawn **multiple subagents in parallel** (e.g., slides 1-3, 4-6, 7-9) to speed up inspection. Each subagent gets a subset of slide images:


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

### Step 3: Fix and Re-verify (Use Subagents)

For each issue found:
1. Fix the code (adjust dimensions, reduce text, increase card height, move elements)
2. Rebuild the PPTX
3. Re-convert to images:
   ```bash
   soffice --headless --convert-to pdf output.pptx
   pdftoppm -jpeg -r 150 output.pdf slide
   ```
4. **Spawn a new subagent** to inspect the fixed slides — don't inspect them yourself. You made the fix and will assume it worked; a subagent with fresh eyes catches regressions.

One fix often creates a new problem — a taller card pushes content into the callout bar, or wider text breaks alignment with adjacent columns. Each verify step should use a subagent. Keep cycling until a subagent pass finds no new issues.

### Common Fixes

| Problem | Fix |
|---------|-----|
| Text clipped at card bottom | Increase card height (`h`) by 0.2-0.3" or reduce bullet count |
| Callout bar overlaps content | Move callout bar down (`y += 0.2`) or shrink content above |
| Text wraps unexpectedly | Reduce `fontSize` by 1-2pt, or increase text box `w` |
| Cards not aligned | Use consistent `y` values; calculate from shared starting point |
| Too tight between elements | Add 0.15-0.2" to gaps; content breathing room matters |

**Do not declare the deck complete until you have completed at least 2 full inspect-fix-verify cycles** — one to catch initial issues, and a second to confirm fixes didn't introduce regressions. Each cycle must use a subagent for the visual inspection.
