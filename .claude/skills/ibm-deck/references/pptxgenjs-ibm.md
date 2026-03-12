# pptxgenjs IBM Carbon Patterns

Complete code examples for building IBM Carbon-styled PPTX slides with pptxgenjs. These patterns are extracted from production decks and handle common pitfalls.

## Table of Contents

- [Full Build Script Structure](#full-build-script-structure)
- [Shadow Factories](#shadow-factories)
- [Card with Icon + Accent Bar](#card-with-icon--accent-bar)
- [3-Column Pillar Layout](#3-column-pillar-layout)
- [Metric Callout Cards](#metric-callout-cards)
- [Timeline / Phase Cards](#timeline--phase-cards)
- [2-Column Outcome + Stats Layout](#2-column-outcome--stats-layout)
- [Icon Rendering Pipeline](#icon-rendering-pipeline)
- [Rich Text (Bold + Regular Mix)](#rich-text-bold--regular-mix)
- [Number Circle Badge](#number-circle-badge)
- [Callout Bar with Icon](#callout-bar-with-icon)
- [Tinted Background Boxes](#tinted-background-boxes)

---

## Full Build Script Structure

```javascript
import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import { FaShieldAlt, FaRocket, FaCogs, FaUsers } from "react-icons/fa";

// --- Icon helper ---
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// --- IBM Carbon Design Tokens (NO "#" prefix!) ---
const C = {
  white: "FFFFFF",
  gray10: "F4F4F4",
  gray20: "E0E0E0",
  gray30: "C6C6C6",
  gray50: "8D8D8D",
  gray70: "525252",
  gray100: "161616",
  blue60: "0F62FE",
  purple60: "8A3FFC",
  teal60: "009D9A",
  magenta60: "D02670",
  green60: "198038",
  red60: "DA1E28",
  yellow50: "B28600",
  yellow40: "D2A106",
};

// --- Shadow factories (ALWAYS fresh objects) ---
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

const footerBarShadow = () => ({
  type: "outer", color: "000000", blur: 4,
  offset: 1, angle: 270, opacity: 0.06,
});

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";  // 10" × 5.625"
  pres.author = "Author";
  pres.title = "Deck Title";

  // ... slides ...

  await pres.writeFile({ fileName: "output.pptx" });
}

buildPresentation().catch(console.error);
```

---

## Shadow Factories

pptxgenjs mutates option objects after they're passed to `addShape()`. This means if you define a shadow object once and reuse it, the second shape gets corrupted values. Always return fresh objects from factory functions.

```javascript
// CORRECT — factory returns a new object each time
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

// WRONG — same object reused, will be mutated
const shadow = { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 };
s.addShape(pres.shapes.RECTANGLE, { shadow }); // mutates shadow
s.addShape(pres.shapes.RECTANGLE, { shadow }); // gets corrupted values
```

---

## Card with Icon + Accent Bar

A card with a colored left accent bar, icon, title, and description. Used for challenge/risk cards, outcome lists, etc.

```javascript
const cardW = 4.1, cardH = 1.35;
const cx = 0.7, cy = 1.4;
const accentColor = C.red60;

// Card background
slide.addShape(pres.shapes.RECTANGLE, {
  x: cx, y: cy, w: cardW, h: cardH,
  fill: { color: C.gray10 },
  shadow: cardShadow(),
});

// Left accent bar (0.06" wide)
slide.addShape(pres.shapes.RECTANGLE, {
  x: cx, y: cy, w: 0.06, h: cardH,
  fill: { color: accentColor },
});

// Icon (rendered from react-icons)
const iconData = await iconToBase64Png(FaExclamationTriangle, "#" + C.red60, 256);
slide.addImage({
  data: iconData,
  x: cx + 0.2, y: cy + 0.2, w: 0.38, h: 0.38,
});

// Card title
slide.addText("Security Risks", {
  x: cx + 0.7, y: cy + 0.15, w: cardW - 0.9, h: 0.4,
  fontSize: 15, fontFace: "Arial",
  color: C.gray100, bold: true, valign: "middle", margin: 0,
});

// Card description
slide.addText("Description text here", {
  x: cx + 0.7, y: cy + 0.6, w: cardW - 0.9, h: 0.8,
  fontSize: 12, fontFace: "Arial",
  color: C.gray70, valign: "top", margin: 0,
});
```

### 2×2 Grid Layout

```javascript
const cardW = 4.1, cardH = 1.35;
const cardGapX = 0.4, cardGapY = 0.2;
const gridStartX = 0.7, gridStartY = 1.4;

for (let i = 0; i < 4; i++) {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const cx = gridStartX + col * (cardW + cardGapX);
  const cy = gridStartY + row * (cardH + cardGapY);
  // ... add card elements at (cx, cy) ...
}
```

---

## 3-Column Pillar Layout

Three tall cards side by side, each with a top accent bar, icon, title, and bullet list. Good for value propositions, feature comparisons, timeline phases.

```javascript
const pillarW = 2.75, pillarH = 2.95;
const pillarGap = 0.45;
const startX = 0.7, startY = 1.65;

for (let i = 0; i < 3; i++) {
  const px = startX + i * (pillarW + pillarGap);

  // Card background
  slide.addShape(pres.shapes.RECTANGLE, {
    x: px, y: startY, w: pillarW, h: pillarH,
    fill: { color: C.gray10 }, shadow: cardShadow(),
  });

  // Top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: px, y: startY, w: pillarW, h: 0.05,
    fill: { color: accentColor },
  });

  // Icon
  const iconData = await iconToBase64Png(icon, "#" + accentColor, 256);
  slide.addImage({
    data: iconData,
    x: px + 0.25, y: startY + 0.25, w: 0.42, h: 0.42,
  });

  // Pillar title
  slide.addText(title, {
    x: px + 0.25, y: startY + 0.78, w: pillarW - 0.5, h: 0.35,
    fontSize: 14, fontFace: "Arial",
    color: C.gray100, bold: true, margin: 0,
  });

  // Bullet items
  const bullets = items.map((item, idx) => ({
    text: item,
    options: {
      bullet: { code: "2022" },
      breakLine: idx < items.length - 1,
      fontSize: 11, color: C.gray70,
      paraSpaceAfter: 6,
    },
  }));

  slide.addText(bullets, {
    x: px + 0.25, y: startY + 1.2, w: pillarW - 0.5, h: 1.8,
    fontFace: "Arial", valign: "top", margin: 0,
  });
}
```

---

## Metric Callout Cards

Cards with a big metric number, label, and optional status badge. Arranged in 3 columns.

```javascript
const ucW = 2.75, ucH = 3.4;
const ucGap = 0.45;
const startX = 0.7, startY = 1.45;

for (let i = 0; i < 3; i++) {
  const ux = startX + i * (ucW + ucGap);

  // Card background + top accent bar (same as pillar)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: ux, y: startY, w: ucW, h: ucH,
    fill: { color: C.gray10 }, shadow: cardShadow(),
  });

  // Persona label (small uppercase)
  slide.addText("APPLICATION TEAM", {
    x: ux + 0.2, y: startY + 0.2, w: ucW - 0.4, h: 0.25,
    fontSize: 9, fontFace: "Arial",
    color: accentColor, bold: true, charSpacing: 2, margin: 0,
  });

  // Title
  slide.addText("Consumer Workflow", {
    x: ux + 0.2, y: startY + 0.5, w: ucW - 0.4, h: 0.35,
    fontSize: 16, fontFace: "Arial",
    color: C.gray100, bold: true, margin: 0,
  });

  // Description
  slide.addText("Description", {
    x: ux + 0.2, y: startY + 0.9, w: ucW - 0.4, h: 0.75,
    fontSize: 11, fontFace: "Arial",
    color: C.gray70, valign: "top", margin: 0,
  });

  // Metric box (inset white box with border)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: ux + 0.15, y: startY + 1.75, w: ucW - 0.3, h: 1.4,
    fill: { color: C.white },
    line: { color: C.gray20, width: 0.5 },
  });

  // Metric label (centered uppercase)
  slide.addText("COMPOSITION TIME", {
    x: ux + 0.2, y: startY + 1.82, w: ucW - 0.4, h: 0.2,
    fontSize: 8, fontFace: "Arial",
    color: C.gray50, bold: true, charSpacing: 2, align: "center", margin: 0,
  });

  // Big metric
  slide.addText("Hours → Minutes", {
    x: ux + 0.2, y: startY + 2.05, w: ucW - 0.4, h: 0.45,
    fontSize: 24, fontFace: "Arial Black",
    color: accentColor, bold: true, align: "center", margin: 0,
  });

  // Status badge (icon + text)
  const checkIcon = await iconToBase64Png(FaCheckCircle, "#" + C.green60, 256);
  slide.addImage({
    data: checkIcon,
    x: ux + ucW/2 - 0.48, y: startY + 2.7, w: 0.22, h: 0.22,
  });
  slide.addText("Validated", {
    x: ux + ucW/2 - 0.2, y: startY + 2.68, w: 1, h: 0.28,
    fontSize: 12, fontFace: "Arial",
    color: C.green60, bold: true, valign: "middle", margin: 0,
  });
}
```

---

## Timeline / Phase Cards

Three phase cards with numbered circles, used for engagement timelines.

```javascript
const tlW = 2.75, tlH = 2.7;
const tlGap = 0.45;
const startX = 0.7, startY = 1.5;

for (let i = 0; i < 3; i++) {
  const tx = startX + i * (tlW + tlGap);

  // Card bg + top accent (standard pattern)
  // ...

  // Number circle (centered)
  slide.addShape(pres.shapes.OVAL, {
    x: tx + tlW/2 - 0.24, y: startY + 0.2, w: 0.48, h: 0.48,
    fill: { color: accentColor },
  });

  slide.addText(String(i + 1), {
    x: tx + tlW/2 - 0.24, y: startY + 0.2, w: 0.48, h: 0.48,
    fontSize: 20, fontFace: "Arial",
    color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
  });

  // Phase title (centered)
  slide.addText("Assess & Establish", {
    x: tx + 0.2, y: startY + 0.8, w: tlW - 0.4, h: 0.35,
    fontSize: 15, fontFace: "Arial",
    color: C.gray100, bold: true, align: "center", margin: 0,
  });

  // Month label (centered, small uppercase)
  slide.addText("MONTH 1", {
    x: tx + 0.2, y: startY + 1.1, w: tlW - 0.4, h: 0.25,
    fontSize: 9, fontFace: "Arial",
    color: C.gray50, bold: true, align: "center", charSpacing: 2, margin: 0,
  });

  // Bullets at y = startY + 1.45
  // ...

  // Arrow connector between cards (except last)
  if (i < 2) {
    const arrowIcon = await iconToBase64Png(FaArrowRight, "#" + accentColor, 256);
    slide.addImage({
      data: arrowIcon,
      x: tx + tlW + tlGap/2 - 0.14, y: startY + tlH/2 - 0.14,
      w: 0.28, h: 0.28,
    });
  }
}
```

---

## 2-Column Outcome + Stats Layout

Left column: stacked outcome cards (icon + text). Right column: big stat callouts.

```javascript
// Left column
const ocCardW = 4.5, ocCardH = 0.68;
const ocGap = 0.1, ocStartX = 0.7, ocStartY = 1.45;

for (let i = 0; i < 4; i++) {
  const oy = ocStartY + i * (ocCardH + ocGap);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: ocStartX, y: oy, w: ocCardW, h: ocCardH,
    fill: { color: C.gray10 }, shadow: cardShadow(),
  });

  // Icon at x+0.15, y+0.12, 0.38×0.38
  // Title at x+0.65, y+0.02, fontSize 12 bold
  // Desc at x+0.65, y+0.32, fontSize 10 gray70
}

// Right column
const statStartX = 5.6, statW = 4.0;
const statH = 0.68, statGap = 0.1, statStartY = 1.45;

for (let i = 0; i < 4; i++) {
  const sy = statStartY + i * (statH + statGap);

  // Card bg with left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: statStartX, y: sy, w: statW, h: statH,
    fill: { color: C.gray10 }, shadow: cardShadow(),
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: statStartX, y: sy, w: 0.06, h: statH,
    fill: { color: statColor },
  });

  // Big number (left)
  slide.addText("10x", {
    x: statStartX + 0.2, y: sy, w: 1.1, h: statH,
    fontSize: 24, fontFace: "Arial Black",
    color: statColor, bold: true, valign: "middle", margin: 0,
  });

  // Label (right of number)
  slide.addText("Faster module delivery", {
    x: statStartX + 1.35, y: sy, w: statW - 1.55, h: statH,
    fontSize: 13, fontFace: "Arial",
    color: C.gray100, bold: true, valign: "middle", margin: 0,
  });
}
```

---

## Icon Rendering Pipeline

React Icons are rendered to SVG markup, then converted to PNG via sharp. The resulting base64 string is embedded in the PPTX.

```javascript
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";

function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}
```

Note: The `color` parameter for icon rendering DOES use `"#"` prefix (`"#" + C.green60`), unlike pptxgenjs shape/text colors which never use `"#"`.

---

## Rich Text (Bold + Regular Mix)

Use an array of text objects with per-segment styling:

```javascript
slide.addText([
  { text: "Bold prefix: ", options: { bold: true, color: C.gray100 } },
  { text: "Regular description.", options: { color: C.gray70 } },
], {
  x: 1.4, y: 4.5, w: 7.7, h: 0.55,
  fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
});
```

---

## Number Circle Badge

Colored circle with a number inside, used for timeline phases:

```javascript
slide.addShape(pres.shapes.OVAL, {
  x: tx + tlW/2 - 0.24, y: startY + 0.2,
  w: 0.48, h: 0.48,
  fill: { color: accentColor },
});

slide.addText("1", {
  x: tx + tlW/2 - 0.24, y: startY + 0.2,
  w: 0.48, h: 0.48,
  fontSize: 20, fontFace: "Arial",
  color: C.white, bold: true,
  align: "center", valign: "middle", margin: 0,
});
```

---

## Callout Bar with Icon

Bottom-of-slide callout bar with tinted background, border, icon, and rich text:

```javascript
// Tinted background with border
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 4.5, w: 8.6, h: 0.55,
  fill: { color: "F0F5FF" },   // light blue tint
  line: { color: C.blue60, width: 1 },
});

// Icon
const icon = await iconToBase64Png(FaHandshake, "#" + C.blue60, 256);
slide.addImage({
  data: icon, x: 0.9, y: 4.57, w: 0.35, h: 0.35,
});

// Rich text (positioned after icon)
slide.addText([
  { text: "Label: ", options: { bold: true, color: C.gray100 } },
  { text: "Description text.", options: { color: C.gray70 } },
], {
  x: 1.4, y: 4.5, w: 7.7, h: 0.55,
  fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
});
```

### Tint color guide

| Accent | Tint Background | Border |
|--------|----------------|--------|
| Blue | `"F0F5FF"` | `C.blue60` |
| Green | `"F0FFF4"` | `C.green60` |
| Yellow | `"FFF8F0"` | `C.yellow50` |
| Red | `"FFF0F0"` | `C.red60` |
| Purple | `"F5F0FF"` | `C.purple60` |
| Teal | `"F0FFFC"` | `C.teal60` |

---

## Tinted Background Boxes

For metric boxes or inset panels within cards:

```javascript
// White inset with border
slide.addShape(pres.shapes.RECTANGLE, {
  x: ux + 0.15, y: startY + 1.75,
  w: ucW - 0.3, h: 1.4,
  fill: { color: C.white },
  line: { color: C.gray20, width: 0.5 },
});
```

---

## Gradient Hero Title Text

Render large gradient-colored hero text (e.g., "Establish", "Enable", "Accelerate") as SVG→PNG. This is the only way to achieve gradient text in pptxgenjs:

```javascript
async function renderGradientTitle(text, gradientStops, width = 700, height = 120) {
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  const stops = gradientStops
    .map(s => `<stop offset="${s.offset}%" stop-color="${s.color}"/>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0.3">${stops}</linearGradient></defs>
    <text x="0" y="${height * 0.75}" font-size="${height * 0.82}" font-weight="800"
      font-family="Arial,Helvetica,sans-serif" fill="url(#${gid})">${text}</text>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Usage — adjust width for text length to avoid clipping
const titleRW = title.length > 7 ? 900 : 700;
const titleImg = await renderGradientTitle("Establish", [
  { offset: 0, color: "#627EEF" },
  { offset: 50, color: "#8A3FFC" },
  { offset: 100, color: "#D946EF" },
], titleRW, 120);

// Preserve aspect ratio when placing
const titleW = cardW - px(50);
const titleH = titleW * (120 / titleRW);
slide.addImage({ data: titleImg, x: cx + px(30), y: cy + px(78), w: titleW, h: titleH });
```

---

## Pixel-to-Inch Conversion Helper

When translating pixel-based designs (1920×1080) to pptxgenjs inches, use this helper:

```javascript
const px = (v) => v / 192;  // 1920px = 10" → 192px per inch
```

This keeps coordinates proportionally accurate when porting from HTML mockups. Use for all positions and dimensions:

```javascript
slide.addText("SECTION", {
  x: px(80), y: px(48), w: 5, h: px(24),
  fontSize: 10, ...
});
```

---

## 4-Column Compounding Value Cards (Strategic Impact)

Four cards in a row, each showing a progression stage with gradient hero title, items, and outcome. Uses ROUNDED_RECTANGLE with per-card tinted backgrounds.

**Slide header** — use derived positions to prevent title/subtitle overlap. Choose titleH based on whether the title wraps:

```javascript
// Section label
slide.addText("STRATEGIC IMPACT", {
  x: px(80), y: px(40), w: 5, h: px(20),
  fontSize: 10, fontFace: "Arial", color: accentColor,
  bold: true, charSpacing: 3, margin: 0,
});
// Title — px(90) for single-line, px(170) for two-line wrapping titles
// At fontSize 22 "Arial Black", each line is ~0.37" — two lines need ≥0.74"
const titleY = px(64);
const titleH = px(170);  // use px(90) if title is short/single-line
slide.addText("How This Service Creates Compounding Value", {
  x: px(80), y: titleY, w: px(1760), h: titleH,
  fontSize: 22, fontFace: "Arial", color: C.gray100, bold: true, margin: 0,
});
// Subtitle — always derive from title position + px(16) gap
const subtitleY = titleY + titleH + px(16);
slide.addText("Supporting description text", {
  x: px(80), y: subtitleY, w: px(1760), h: px(30),
  fontSize: 11.5, fontFace: "Arial", color: C.gray70, margin: 0,
});
// Cards start below subtitle
const cardTop = subtitleY + px(60);
```

**Card layout:**

```javascript
const px = (v) => v / 192;
const cardW = px(396);
const cardH = px(540);
const accentH = px(8);
const cardXOffsets = [22, 462, 902, 1342];  // pixel x-offsets

const cards = [
  {
    num: "01", title: "Establish", subtitle: "Guardrails & Controls",
    items: ["RBAC and agent isolation", "Secrets management", "Policy enforcement", "Human-in-loop approvals"],
    outcome: "Zero unreviewed changes\nreach production",
    // Per-card color palette:
    ac1: "627EEF", ac2: "8A3FFC", ac3: "D946EF",  // gradient triplet
    numColor: "8A3FFC",       // step number
    outcomeColor: "6929C4",   // outcome text
    divColor: "C4B0FF",       // divider lines
    bgColor: "F2EEFF",        // card tinted background
    arrowColor: "8A3FFC",     // arrow connector
  },
  // ... more cards with unique color palettes
];

for (let i = 0; i < cards.length; i++) {
  const c = cards[i];
  const cx = px(80) + px(cardXOffsets[i]);
  const cy = px(250);

  // Card background — ROUNDED_RECTANGLE with tinted bg
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: cy, w: cardW, h: cardH,
    rectRadius: 0.08, fill: { color: c.bgColor }, shadow: cardShadow(),
  });

  // Gradient accent bar (with borderRadius for rounded card tops)
  const barImg = await renderGradientBar(
    ["#" + c.ac1, "#" + c.ac2, "#" + c.ac3], 396, 8, 16
  );
  slide.addImage({ data: barImg, x: cx, y: cy, w: cardW, h: accentH });

  // Step number
  slide.addText(c.num, {
    x: cx + px(34), y: cy + px(36), w: px(60), h: px(22),
    fontSize: 9, fontFace: "Arial", color: c.numColor,
    bold: true, charSpacing: 2, margin: 0,
  });

  // Gradient hero title (SVG→PNG)
  const titleGrad = [
    { offset: 0, color: "#" + c.ac1 },
    { offset: 50, color: "#" + c.ac2 },
    { offset: 100, color: "#" + c.ac3 },
  ];
  const titleRW = c.title.length > 7 ? 900 : 700;
  const titleImg = await renderGradientTitle(c.title, titleGrad, titleRW, 120);
  const titleW = cardW - px(50);
  const titleH = titleW * (120 / titleRW);
  slide.addImage({ data: titleImg, x: cx + px(30), y: cy + px(78), w: titleW, h: titleH });

  // Subtitle
  slide.addText(c.subtitle, {
    x: cx + px(34), y: cy + px(158), w: cardW - px(68), h: px(28),
    fontSize: 10.5, fontFace: "Arial", color: C.gray70,
    bold: true, valign: "middle", margin: 0,
  });

  // Top divider line
  slide.addShape(pres.shapes.LINE, {
    x: cx + px(34), y: cy + px(198), w: cardW - px(68), h: 0,
    line: { color: c.divColor, width: 0.5 },
  });

  // Content items
  const itemYs = [240, 282, 324, 366];
  for (let j = 0; j < c.items.length; j++) {
    slide.addText(c.items[j], {
      x: cx + px(20), y: cy + px(itemYs[j]) - px(12),
      w: cardW - px(40), h: px(28),
      fontSize: 9, fontFace: "Arial", color: C.gray70,
      valign: "middle", margin: 0,
    });
  }

  // Bottom divider line
  slide.addShape(pres.shapes.LINE, {
    x: cx + px(34), y: cy + px(410), w: cardW - px(68), h: 0,
    line: { color: c.divColor, width: 0.5 },
  });

  // Outcome text
  slide.addText(c.outcome, {
    x: cx + px(20), y: cy + px(430), w: cardW - px(40), h: px(80),
    fontSize: 9, fontFace: "Arial", color: c.outcomeColor,
    bold: true, valign: "top", margin: 0,
  });

  // Arrow connector to next card
  if (i < cards.length - 1) {
    const arrowXOffsets = [418, 858, 1298];
    const arrowIcon = await iconToBase64Png(FaArrowRight, "#" + c.arrowColor, 256);
    slide.addImage({
      data: arrowIcon,
      x: px(80) + px(arrowXOffsets[i]) - 0.01,
      y: px(250) + px(270),
      w: 0.22, h: 0.22,
    });
  }
}
```

---

## REQUIRED Badge + Mandatory Card Highlighting

For prerequisite/checklist cards where one card needs special emphasis:

```javascript
const isMandatory = i === prereqs.length - 1;  // last card is required

// Card with conditional styling
slide.addShape(pres.shapes.RECTANGLE, {
  x: cx, y: cy, w: cardW, h: cardH,
  fill: { color: isMandatory ? "E8F7F7" : C.gray10 },  // tinted vs default
  line: isMandatory ? { color: accentColor, width: 1.5 } : undefined,
  shadow: cardShadow(),
});

// REQUIRED badge (only on mandatory card)
if (isMandatory) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx + cardW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
    fill: { color: accentColor }, rectRadius: 0.05,
  });
  slide.addText("REQUIRED", {
    x: cx + cardW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
    fontSize: 8, fontFace: "Arial", color: C.white,
    bold: true, align: "center", valign: "middle",
    charSpacing: 1.5, margin: 0,
  });
}

// Bullets with conditional emphasis
const bullets = items.map((item, idx) => ({
  text: item,
  options: {
    bullet: { code: "2022" },
    breakLine: idx < items.length - 1,
    fontSize: 10,
    color: isMandatory ? C.gray100 : C.gray70,  // bolder text on mandatory
    paraSpaceAfter: 5,
  },
}));
```

---

## Full Hybrid Proposal Structure

A production proposal deck uses the hybrid approach — HTML capture for title/closing, pptxgenjs for content:

```javascript
async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";

  // Slide 1: Title (HTML capture → full-bleed PNG)
  const s1 = pres.addSlide();
  s1.addImage({ path: "images/slide-title.png", x: 0, y: 0, w: 10, h: 5.625 });

  // Slides 2-N: Programmatic content slides
  const s2 = pres.addSlide();
  s2.background = { color: C.white };
  // ... challenge cards, pillars, timelines, etc.

  // Last Slide: Closing (HTML capture → full-bleed PNG)
  const sN = pres.addSlide();
  sN.addImage({ path: "images/slide-thankyou.png", x: 0, y: 0, w: 10, h: 5.625 });

  await pres.writeFile({ fileName: "proposal.pptx" });
}
```

The hybrid approach gives you premium branded title/closing slides (layered backgrounds, glows, brand fonts) while keeping content slides fully editable and programmatically precise.
