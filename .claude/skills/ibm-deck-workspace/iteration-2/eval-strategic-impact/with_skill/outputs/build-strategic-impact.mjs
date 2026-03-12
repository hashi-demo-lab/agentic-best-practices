import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import { FaArrowRight } from "react-icons/fa";

// --- Pixel-to-Inch Conversion Helper ---
const px = (v) => v / 192; // 1920px = 10" → 192px per inch

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
};

// --- Shadow factories (ALWAYS fresh objects — pptxgenjs mutates them) ---
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

// --- SVG → PNG gradient helpers ---
async function renderGradientBar(colors, width = 396, height = 8, borderRadius = 16) {
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  const rectHeight = borderRadius > 0 ? borderRadius * 2 : height;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="50%" stop-color="${colors[1]}"/>
        <stop offset="100%" stop-color="${colors[2]}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${rectHeight}" rx="${borderRadius}" fill="url(#${gid})"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

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

// --- Card data ---
const cards = [
  {
    num: "01",
    title: "Establish",
    subtitle: "Guardrails & Controls",
    items: [
      "RBAC and agent isolation",
      "Secrets management",
      "Policy enforcement",
      "Human-in-loop approvals",
    ],
    outcome: "Zero unreviewed changes\nreach production",
    ac1: "627EEF", ac2: "8A3FFC", ac3: "D946EF",
    numColor: "8A3FFC",
    outcomeColor: "6929C4",
    divColor: "C4B0FF",
    bgColor: "F2EEFF",
    arrowColor: "8A3FFC",
  },
  {
    num: "02",
    title: "Enable",
    subtitle: "Developer Productivity",
    items: [
      "Self-service module catalog",
      "Automated code generation",
      "Integrated testing pipeline",
      "Workspace orchestration",
    ],
    outcome: "10x faster module\ndelivery cycles",
    ac1: "0043CE", ac2: "0F62FE", ac3: "4589FF",
    numColor: "0F62FE",
    outcomeColor: "0043CE",
    divColor: "A6C8FF",
    bgColor: "EDF5FF",
    arrowColor: "0F62FE",
  },
  {
    num: "03",
    title: "Accelerate",
    subtitle: "Operational Excellence",
    items: [
      "Drift detection & remediation",
      "Cost optimization insights",
      "Compliance-as-code adoption",
      "Cross-team collaboration",
    ],
    outcome: "80% reduction in\noperational overhead",
    ac1: "007D79", ac2: "009D9A", ac3: "2DD4BF",
    numColor: "009D9A",
    outcomeColor: "005D5D",
    divColor: "9EF0F0",
    bgColor: "E0F7FA",
    arrowColor: "009D9A",
  },
  {
    num: "04",
    title: "Scale",
    subtitle: "Enterprise Transformation",
    items: [
      "Multi-cloud governance",
      "Platform team enablement",
      "Org-wide policy standards",
      "Continuous improvement loops",
    ],
    outcome: "Enterprise-wide IaC\nmaturity achieved",
    ac1: "0E6027", ac2: "198038", ac3: "34D478",
    numColor: "198038",
    outcomeColor: "0E6027",
    divColor: "A7F0BA",
    bgColor: "F0FFF4",
    arrowColor: "198038",
  },
];

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "IBM";
  pres.title = "Strategic Impact";

  const slide = pres.addSlide();
  slide.background = { color: C.white }; // REQUIRED on every content slide

  // ===== SLIDE HEADER =====
  // Section label (uppercase, accented, letter-spaced)
  slide.addText("STRATEGIC IMPACT", {
    x: px(80), y: px(48), w: 5, h: px(24),
    fontSize: 10, fontFace: "Arial", color: C.purple60,
    bold: true, charSpacing: 3, margin: 0,
  });

  // Title — h = px(50) ≈ 0.26", keeps it tight to avoid subtitle overlap
  // title.y + title.h = px(72) + px(50) = px(122)
  slide.addText("Compounding Value Through Structured Enablement", {
    x: px(80), y: px(72), w: px(1760), h: px(50),
    fontSize: 22, fontFace: "Arial Black", color: C.gray100,
    bold: true, margin: 0,
  });

  // Subtitle — y = px(126) > px(122) = title bottom, so no overlap
  slide.addText("Each phase builds on the last — security, speed, operational maturity, and enterprise scale compound over time", {
    x: px(80), y: px(126), w: px(1760), h: px(30),
    fontSize: 11.5, fontFace: "Arial", color: C.gray70, margin: 0,
  });

  // ===== 4-COLUMN COMPOUNDING VALUE CARDS =====
  const cardW = px(396);
  const cardH = px(540);
  const accentH = px(8);
  const cardXOffsets = [22, 462, 902, 1342]; // pixel x-offsets

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const cx = px(80) + px(cardXOffsets[i]);
    const cy = px(250);

    // Card background — ROUNDED_RECTANGLE with per-card tinted bg
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      rectRadius: 0.08, fill: { color: c.bgColor }, shadow: cardShadow(),
    });

    // Gradient accent bar (with borderRadius=16 for rounded card tops)
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

    // Gradient hero title (SVG → PNG)
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

    // Content items — 4 bullet items
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

    // Arrow connector to next card (FaArrowRight)
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

  // ===== BOTTOM CALLOUT BAR =====
  // Cards end at cy + cardH = px(250) + px(540) = px(790) ≈ 4.11"
  // Place callout bar below with some breathing room
  const calloutY = px(820);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: calloutY, w: 8.6, h: 0.55,
    fill: { color: "F5F0FF" }, // purple tint
    line: { color: C.purple60, width: 1 },
  });

  slide.addText([
    { text: "Cumulative Impact: ", options: { bold: true, color: C.gray100 } },
    { text: "Each phase compounds on the last — organizations that follow this progression see ", options: { color: C.gray70 } },
    { text: "3x faster time-to-value ", options: { bold: true, color: C.purple60 } },
    { text: "compared to ad-hoc adoption.", options: { color: C.gray70 } },
  ], {
    x: 0.9, y: calloutY, w: 8.2, h: 0.55,
    fontSize: 10.5, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ===== WRITE FILE =====
  const outputDir = ".claude/skills/ibm-deck-workspace/iteration-2/eval-strategic-impact/with_skill/outputs";
  await pres.writeFile({ fileName: `${outputDir}/strategic-impact.pptx` });
  console.log("Built strategic-impact.pptx");
}

buildPresentation().catch(console.error);
