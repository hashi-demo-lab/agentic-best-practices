/**
 * build-strategic-impact.mjs
 *
 * Generates a single-slide IBM Carbon-style deck called strategic-impact.pptx
 * showing 4 compounding-value cards in a horizontal row with gradient accents,
 * SVG→PNG hero titles, connectors, and a bottom callout bar.
 *
 * Run from repo root:
 *   node .claude/skills/ibm-deck-workspace/iteration-1/eval-strategic-impact/without_skill/outputs/build-strategic-impact.mjs
 */

import PptxGenJS from "pptxgenjs";
import sharp from "sharp";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "strategic-impact.pptx");

// ---------------------------------------------------------------------------
// Pixel → Inch helper  (IBM Carbon grid: 1 in = 96 px at 96 dpi)
// ---------------------------------------------------------------------------
const DPI = 96;
const px = (pixels) => pixels / DPI;

// ---------------------------------------------------------------------------
// IBM Carbon palette & card definitions
// ---------------------------------------------------------------------------
const COLORS = {
  bg: "161616",        // Gray 100
  cardBg: "262626",    // Gray 90
  text: "F4F4F4",      // Gray 10
  textSecondary: "C6C6C6", // Gray 30
  textTertiary: "8D8D8D",  // Gray 50
  divider: "393939",   // Gray 80
  calloutBg: "1A1A2E",
};

const CARDS = [
  {
    step: "01",
    title: "Establish",
    subtitle: "Foundation & Governance",
    gradient: ["#6929C4", "#A56EFF"],   // Purple 60 → Purple 40
    tint: "1E1432",                      // Purple-tinted card bg
    bullets: [
      "Define AI-assisted IaC policies",
      "Set up guardrail frameworks",
      "Create approval gate processes",
      "Baseline security & compliance",
    ],
    outcome: "Controlled AI foundation with zero drift risk",
  },
  {
    step: "02",
    title: "Enable",
    subtitle: "Team Adoption & Workflows",
    gradient: ["#0072C3", "#33B1FF"],   // Blue 60 → Cyan 40
    tint: "141E2E",
    bullets: [
      "Onboard teams to SDD workflow",
      "Integrate MCP tool servers",
      "Deploy spec-driven pipelines",
      "Establish feedback loops",
    ],
    outcome: "80% faster first-draft infrastructure code",
  },
  {
    step: "03",
    title: "Accelerate",
    subtitle: "Velocity & Confidence",
    gradient: ["#007D79", "#08BDBA"],   // Teal 60 → Teal 40
    tint: "14292A",
    bullets: [
      "Auto-generate Terraform modules",
      "AI-powered plan review & risk",
      "Cross-stack dependency mapping",
      "Predictive cost optimization",
    ],
    outcome: "3x deployment velocity with 60% fewer errors",
  },
  {
    step: "04",
    title: "Scale",
    subtitle: "Enterprise Transformation",
    gradient: ["#A2191F", "#FA4D56"],   // Red 60 → Red 40  (warm = growth)
    tint: "2A1418",
    bullets: [
      "Multi-cloud governance at scale",
      "Self-healing infrastructure loops",
      "Organization-wide AI standards",
      "Continuous compliance assurance",
    ],
    outcome: "Enterprise-grade AI-IaC operating model",
  },
];

// ---------------------------------------------------------------------------
// SVG → PNG rendering (gradient hero titles via sharp)
// ---------------------------------------------------------------------------
async function renderGradientTitle(text, gradientColors, width = 220, height = 52) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientColors[0]}"/>
        <stop offset="100%" stop-color="${gradientColors[1]}"/>
      </linearGradient>
    </defs>
    <text x="0" y="${height * 0.78}" font-family="Arial, Helvetica, sans-serif"
          font-size="${height * 0.72}px" font-weight="700" fill="url(#g)">
      ${text}
    </text>
  </svg>`;

  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(width * 2, height * 2)  // 2x for retina clarity
    .png()
    .toBuffer();

  return pngBuffer;
}

// ---------------------------------------------------------------------------
// Build the deck
// ---------------------------------------------------------------------------
async function buildDeck() {
  const pptx = new PptxGenJS();

  // Presentation metadata
  pptx.author = "IBM Consulting";
  pptx.title = "Strategic Impact — Compounding Value of AI-Driven IaC";
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches

  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  // --- Slide Title ---
  slide.addText("STRATEGIC IMPACT", {
    x: px(64),
    y: px(32),
    w: px(500),
    h: px(28),
    fontSize: 11,
    fontFace: "Arial",
    color: COLORS.textTertiary,
    bold: true,
    letterSpacing: 2,
  });

  slide.addText("Compounding Value of AI-Driven Infrastructure as Code", {
    x: px(64),
    y: px(58),
    w: px(900),
    h: px(40),
    fontSize: 22,
    fontFace: "Arial",
    color: COLORS.text,
    bold: true,
  });

  // --- Layout constants ---
  const cardW = px(280);
  const cardH = px(480);
  const cardGap = px(48);
  const connectorW = px(32);
  const totalRow = 4 * cardW + 3 * (cardGap + connectorW + cardGap);
  const startX = (13.33 - totalRow) / 2; // center horizontally
  const cardY = px(130);

  // Pre-render all gradient title PNGs
  const titleImages = await Promise.all(
    CARDS.map((c) => renderGradientTitle(c.title, c.gradient, 220, 52))
  );

  // --- Draw each card ---
  for (let i = 0; i < CARDS.length; i++) {
    const card = CARDS[i];
    const cardX =
      startX + i * (cardW + cardGap + connectorW + cardGap);

    // Card background (rounded rectangle)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: card.tint },
      rectRadius: 0.1,
      line: { color: COLORS.divider, width: 0.75 },
    });

    // Gradient accent bar at top (small rounded rect clipped to top area)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: px(6),
      fill: {
        type: "gradient",
        color1: card.gradient[0].replace("#", ""),
        color2: card.gradient[1].replace("#", ""),
        angle: 90,
      },
      rectRadius: 0.1,
    });

    // Step number
    const innerX = cardX + px(20);
    let curY = cardY + px(24);

    slide.addText(card.step, {
      x: innerX,
      y: curY,
      w: px(50),
      h: px(28),
      fontSize: 13,
      fontFace: "Arial",
      color: card.gradient[1].replace("#", ""),
      bold: true,
    });
    curY += px(32);

    // Gradient hero title (SVG→PNG)
    slide.addImage({
      data: `image/png;base64,${titleImages[i].toString("base64")}`,
      x: innerX,
      y: curY,
      w: px(220),
      h: px(52),
    });
    curY += px(56);

    // Subtitle
    slide.addText(card.subtitle, {
      x: innerX,
      y: curY,
      w: cardW - px(40),
      h: px(24),
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.textSecondary,
    });
    curY += px(32);

    // Divider line 1
    slide.addShape(pptx.ShapeType.line, {
      x: innerX,
      y: curY,
      w: cardW - px(40),
      h: 0,
      line: { color: COLORS.divider, width: 0.75 },
    });
    curY += px(14);

    // Bullet items
    const bulletOpts = card.bullets.map((b) => ({
      text: b,
      options: {
        fontSize: 9.5,
        fontFace: "Arial",
        color: COLORS.textSecondary,
        bullet: { code: "2022", color: card.gradient[1].replace("#", "") },
        lineSpacingMultiple: 1.4,
        paraSpaceBefore: 2,
      },
    }));

    slide.addText(bulletOpts, {
      x: innerX,
      y: curY,
      w: cardW - px(40),
      h: px(140),
      valign: "top",
    });
    curY += px(146);

    // Divider line 2
    slide.addShape(pptx.ShapeType.line, {
      x: innerX,
      y: curY,
      w: cardW - px(40),
      h: 0,
      line: { color: COLORS.divider, width: 0.75 },
    });
    curY += px(14);

    // Outcome text
    slide.addText(card.outcome, {
      x: innerX,
      y: curY,
      w: cardW - px(40),
      h: px(44),
      fontSize: 9,
      fontFace: "Arial",
      color: COLORS.text,
      bold: true,
      italic: true,
      valign: "top",
    });

    // --- Arrow connector between cards ---
    if (i < CARDS.length - 1) {
      const arrowX = cardX + cardW + cardGap - px(4);
      const arrowY = cardY + cardH / 2 - px(10);

      // FaArrowRight style: use a triangle + line
      // We use a right-arrow shape
      slide.addShape(pptx.ShapeType.rightArrow, {
        x: arrowX,
        y: arrowY,
        w: connectorW + px(8),
        h: px(20),
        fill: { color: COLORS.divider },
        line: { color: COLORS.divider, width: 0 },
      });
    }
  }

  // --- Bottom callout bar ---
  const calloutY = cardY + cardH + px(32);
  const calloutH = px(52);
  const calloutW = totalRow;

  slide.addShape(pptx.ShapeType.roundRect, {
    x: startX,
    y: calloutY,
    w: calloutW,
    h: calloutH,
    fill: { color: COLORS.calloutBg },
    rectRadius: 0.06,
    line: { color: "2A2A4A", width: 0.75 },
  });

  // Rich text callout
  slide.addText(
    [
      {
        text: "Compounding Returns  ",
        options: {
          fontSize: 11,
          fontFace: "Arial",
          color: "A56EFF",
          bold: true,
        },
      },
      {
        text: "Each phase builds on the previous — ",
        options: {
          fontSize: 10,
          fontFace: "Arial",
          color: COLORS.textSecondary,
        },
      },
      {
        text: "governance ",
        options: {
          fontSize: 10,
          fontFace: "Arial",
          color: "A56EFF",
          bold: true,
        },
      },
      {
        text: "enables ",
        options: { fontSize: 10, fontFace: "Arial", color: COLORS.textSecondary },
      },
      {
        text: "adoption",
        options: {
          fontSize: 10,
          fontFace: "Arial",
          color: "33B1FF",
          bold: true,
        },
      },
      {
        text: ", adoption drives ",
        options: { fontSize: 10, fontFace: "Arial", color: COLORS.textSecondary },
      },
      {
        text: "velocity",
        options: {
          fontSize: 10,
          fontFace: "Arial",
          color: "08BDBA",
          bold: true,
        },
      },
      {
        text: ", velocity unlocks ",
        options: { fontSize: 10, fontFace: "Arial", color: COLORS.textSecondary },
      },
      {
        text: "enterprise scale",
        options: {
          fontSize: 10,
          fontFace: "Arial",
          color: "FA4D56",
          bold: true,
        },
      },
      {
        text: ".",
        options: { fontSize: 10, fontFace: "Arial", color: COLORS.textSecondary },
      },
    ],
    {
      x: startX + px(24),
      y: calloutY,
      w: calloutW - px(48),
      h: calloutH,
      valign: "middle",
    }
  );

  // --- Write file ---
  const outData = await pptx.write({ outputType: "nodebuffer" });
  writeFileSync(OUTPUT_PATH, outData);
  console.log(`Wrote: ${OUTPUT_PATH}`);
}

buildDeck().catch((err) => {
  console.error(err);
  process.exit(1);
});
