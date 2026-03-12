/**
 * Q4 Performance Review - IBM Carbon Design PPTX Builder
 *
 * Generates a 2-slide deck:
 *   Slide 1: Programmatic title slide (no HTML capture)
 *   Slide 2: Three metric callout cards with gradient accent bars
 *
 * IBM Carbon accent palette:
 *   Green  — #42be65 / #24a148
 *   Teal   — #08bdba / #009d9a
 *   Blue   — #4589ff / #0f62fe
 */

import PptxGenJS from "pptxgenjs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── IBM Carbon palette ──────────────────────────────────────────────
const CARBON = {
  gray100: "161616",
  gray90: "262626",
  gray80: "393939",
  gray70: "525252",
  gray50: "8d8d8d",
  gray30: "c6c6c6",
  gray10: "f4f4f4",
  white: "ffffff",
  green50: "42be65",
  green60: "24a148",
  teal50: "08bdba",
  teal60: "009d9a",
  blue50: "4589ff",
  blue60: "0f62fe",
};

// ── Gradient accent bar generator (sharp) ───────────────────────────
async function createGradientBar(colorLeft, colorRight, width = 600, height = 12) {
  // Parse hex colors
  const parseHex = (hex) => ({
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  });

  const left = parseHex(colorLeft);
  const right = parseHex(colorRight);

  // Build raw pixel buffer for horizontal gradient
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = x / (width - 1);
      const idx = (y * width + x) * 4;
      pixels[idx] = Math.round(left.r + (right.r - left.r) * t);
      pixels[idx + 1] = Math.round(left.g + (right.g - left.g) * t);
      pixels[idx + 2] = Math.round(left.b + (right.b - left.b) * t);
      pixels[idx + 3] = 255;
    }
  }

  return sharp(pixels, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

// ── Slide 1: Programmatic Title ─────────────────────────────────────
function buildTitleSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { fill: CARBON.gray100 };

  // Thin accent line at very top
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.06,
    fill: { color: CARBON.blue60 },
  });

  // Company / event label
  slide.addText("IBM CARBON", {
    x: 0.8,
    y: 1.2,
    w: 8.4,
    h: 0.4,
    fontSize: 14,
    fontFace: "IBM Plex Sans",
    color: CARBON.blue50,
    bold: true,
    charSpacing: 6,
  });

  // Main title
  slide.addText("Q4 Performance Review", {
    x: 0.8,
    y: 1.7,
    w: 8.4,
    h: 1.0,
    fontSize: 40,
    fontFace: "IBM Plex Sans",
    color: CARBON.white,
    bold: true,
  });

  // Subtitle / date
  slide.addText("October – December 2025  |  Quarterly Business Metrics", {
    x: 0.8,
    y: 2.75,
    w: 8.4,
    h: 0.5,
    fontSize: 16,
    fontFace: "IBM Plex Sans",
    color: CARBON.gray50,
  });

  // Decorative accent bar bottom-left
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 3.5,
    w: 1.6,
    h: 0.05,
    fill: { color: CARBON.green50 },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 2.5,
    y: 3.5,
    w: 1.0,
    h: 0.05,
    fill: { color: CARBON.teal50 },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 3.6,
    y: 3.5,
    w: 0.6,
    h: 0.05,
    fill: { color: CARBON.blue50 },
  });

  // Footer
  slide.addText("Confidential", {
    x: 0.8,
    y: 4.85,
    w: 3,
    h: 0.3,
    fontSize: 10,
    fontFace: "IBM Plex Sans",
    color: CARBON.gray70,
  });
}

// ── Slide 2: Metric Cards ───────────────────────────────────────────
async function buildMetricSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { fill: CARBON.gray100 };

  // Section label
  slide.addText("KEY PERFORMANCE INDICATORS", {
    x: 0.8,
    y: 0.4,
    w: 8.4,
    h: 0.35,
    fontSize: 11,
    fontFace: "IBM Plex Sans",
    color: CARBON.teal50,
    bold: true,
    charSpacing: 4,
  });

  // Slide heading
  slide.addText("Q4 Metrics at a Glance", {
    x: 0.8,
    y: 0.75,
    w: 8.4,
    h: 0.55,
    fontSize: 26,
    fontFace: "IBM Plex Sans",
    color: CARBON.white,
    bold: true,
  });

  // ── Card definitions ───────────────────────────────────────────────
  const cards = [
    {
      gradientLeft: CARBON.green60,
      gradientRight: CARBON.green50,
      accentColor: CARBON.green50,
      kpiValue: "$4.2M",
      kpiLabel: "Revenue",
      delta: "+18.3%",
      deltaDir: "up",
      detail: "vs. Q3 target of $3.8M",
    },
    {
      gradientLeft: CARBON.teal60,
      gradientRight: CARBON.teal50,
      accentColor: CARBON.teal50,
      kpiValue: "97.4%",
      kpiLabel: "Uptime SLA",
      delta: "+2.1%",
      deltaDir: "up",
      detail: "across 14 production services",
    },
    {
      gradientLeft: CARBON.blue60,
      gradientRight: CARBON.blue50,
      accentColor: CARBON.blue50,
      kpiValue: "1,247",
      kpiLabel: "Active Users",
      delta: "+34%",
      deltaDir: "up",
      detail: "monthly active enterprise seats",
    },
  ];

  const cardW = 2.65;
  const cardH = 2.6;
  const gap = 0.35;
  const totalW = cards.length * cardW + (cards.length - 1) * gap;
  const startX = (10 - totalW) / 2; // center across 10" slide
  const cardY = 1.65;
  const barH = 0.1; // gradient bar height in inches

  // Pre-generate gradient bar images
  const barPngs = await Promise.all(
    cards.map((c) => createGradientBar(c.gradientLeft, c.gradientRight, 800, 24))
  );

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const x = startX + i * (cardW + gap);

    // Card background (dark gray)
    slide.addShape(pres.ShapeType.rect, {
      x,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: CARBON.gray90 },
      rectRadius: 0.06,
    });

    // Gradient accent bar at top of card (image)
    slide.addImage({
      data: `data:image/png;base64,${barPngs[i].toString("base64")}`,
      x: x,
      y: cardY,
      w: cardW,
      h: barH,
      rounding: false,
    });

    // KPI value
    slide.addText(c.kpiValue, {
      x: x + 0.25,
      y: cardY + 0.35,
      w: cardW - 0.5,
      h: 0.65,
      fontSize: 36,
      fontFace: "IBM Plex Sans",
      color: CARBON.white,
      bold: true,
    });

    // KPI label
    slide.addText(c.kpiLabel, {
      x: x + 0.25,
      y: cardY + 0.95,
      w: cardW - 0.5,
      h: 0.35,
      fontSize: 14,
      fontFace: "IBM Plex Sans",
      color: CARBON.gray50,
    });

    // Divider line
    slide.addShape(pres.ShapeType.rect, {
      x: x + 0.25,
      y: cardY + 1.4,
      w: cardW - 0.5,
      h: 0.01,
      fill: { color: CARBON.gray80 },
    });

    // Delta badge
    const arrowChar = c.deltaDir === "up" ? "\u25B2" : "\u25BC";
    slide.addText(
      [
        {
          text: `${arrowChar} ${c.delta}`,
          options: {
            fontSize: 14,
            fontFace: "IBM Plex Sans",
            color: c.accentColor,
            bold: true,
          },
        },
        {
          text: `  vs. prior quarter`,
          options: {
            fontSize: 11,
            fontFace: "IBM Plex Sans",
            color: CARBON.gray50,
          },
        },
      ],
      {
        x: x + 0.25,
        y: cardY + 1.55,
        w: cardW - 0.5,
        h: 0.35,
      }
    );

    // Detail text
    slide.addText(c.detail, {
      x: x + 0.25,
      y: cardY + 1.95,
      w: cardW - 0.5,
      h: 0.45,
      fontSize: 11,
      fontFace: "IBM Plex Sans",
      color: CARBON.gray30,
      wrap: true,
    });
  }

  // Footer
  slide.addText("Source: Internal analytics pipeline  |  Updated Dec 31, 2025", {
    x: 0.8,
    y: 4.85,
    w: 8.4,
    h: 0.3,
    fontSize: 9,
    fontFace: "IBM Plex Sans",
    color: CARBON.gray70,
  });
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const pres = new PptxGenJS();

  // Presentation metadata
  pres.author = "IBM Carbon Builder";
  pres.title = "Q4 Performance Review";
  pres.subject = "Quarterly Business Metrics";
  pres.layout = "LAYOUT_16x9";

  // Build slides
  buildTitleSlide(pres);
  await buildMetricSlide(pres);

  // Write to disk
  const outPath = path.join(__dirname, "Q4-Performance-Review.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log(`PPTX written to: ${outPath}`);
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
