import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import { FaArrowRight } from "react-icons/fa";

// --- Pixel-to-inch conversion helper ---
const px = (v) => v / 192; // 1920px = 10" → 192px per inch

// --- Icon helper (async — always await) ---
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
  white:    "FFFFFF",
  gray10:   "F4F4F4",
  gray20:   "E0E0E0",
  gray30:   "C6C6C6",
  gray50:   "8D8D8D",
  gray70:   "525252",
  gray100:  "161616",
  blue60:   "0F62FE",
  purple60: "8A3FFC",
  teal60:   "009D9A",
  green60:  "198038",
  magenta60:"D02670",
  red60:    "DA1E28",
  yellow50: "B28600",
};

// --- Shadow factories (ALWAYS fresh objects — pptxgenjs mutates them) ---
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

// --- Gradient SVG → PNG renderers ---
async function renderGradientBar(colors, width = 396, height = 8, borderRadius = 16) {
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  const rectH = borderRadius > 0 ? borderRadius * 2 : height;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="50%" stop-color="${colors[1]}"/>
        <stop offset="100%" stop-color="${colors[2]}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${rectH}" rx="${borderRadius}" fill="url(#${gid})"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

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
    subtitle: "Self-Service Modules",
    items: [
      "Golden module registry",
      "Automated testing gates",
      "Versioned compositions",
      "Developer onboarding paths",
    ],
    outcome: "Teams ship infrastructure\nwithout central bottlenecks",
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
    subtitle: "AI-Assisted Workflows",
    items: [
      "Spec-driven development",
      "Automated plan reviews",
      "Drift detection & remediation",
      "Context-aware suggestions",
    ],
    outcome: "10x faster module delivery\nwith consistent quality",
    ac1: "007D79", ac2: "009D9A", ac3: "2DD4BF",
    numColor: "009D9A",
    outcomeColor: "005D5D",
    divColor: "9EF0F0",
    bgColor: "E6FAFA",
    arrowColor: "009D9A",
  },
  {
    num: "04",
    title: "Scale",
    subtitle: "Enterprise Governance",
    items: [
      "Multi-cloud orchestration",
      "Cost optimization policies",
      "Compliance-as-code",
      "Continuous audit trails",
    ],
    outcome: "Governance scales with\ngrowth — not headcount",
    ac1: "0E6027", ac2: "198038", ac3: "34D478",
    numColor: "198038",
    outcomeColor: "0E6027",
    divColor: "A7F0BA",
    bgColor: "EDFFF2",
    arrowColor: "198038",
  },
];

// --- Build presentation ---
async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" × 5.625"
  pres.author = "Resident Technology Services";
  pres.title = "Strategic Impact — Compounding Value";

  const slide = pres.addSlide();
  slide.background = { color: C.white }; // REQUIRED on every content slide

  // --- Slide header ---
  // Section label
  slide.addText("STRATEGIC IMPACT", {
    x: px(80), y: px(40), w: 5, h: px(20),
    fontSize: 10, fontFace: "Arial", color: C.purple60,
    bold: true, charSpacing: 3, margin: 0,
  });

  // Title — px(170) for two-line wrapping title
  // "How Resident Technology Services Creates Compounding Value" wraps at fontSize 22
  const titleY = px(64);
  const titleH = px(170); // ~0.89" — fits 2 lines of 22pt Arial Black
  slide.addText("How Resident Technology Services Creates Compounding Value", {
    x: px(80), y: titleY, w: px(1760), h: titleH,
    fontSize: 22, fontFace: "Arial Black", color: C.gray100,
    bold: true, margin: 0,
  });

  // Subtitle — always derived from title position + px(16) gap
  const subtitleY = titleY + titleH + px(16);
  slide.addText("Each phase builds on the last — early guardrails unlock self-service, which feeds AI acceleration at enterprise scale.", {
    x: px(80), y: subtitleY, w: px(1760), h: px(30),
    fontSize: 11.5, fontFace: "Arial", color: C.gray70, margin: 0,
  });

  // --- Bounding box overlap check ---
  // titleY + titleH = px(64) + px(170) = px(234) ≈ 1.22"
  // subtitleY = px(234) + px(16) = px(250) ≈ 1.30"
  // subtitleY + subtitleH = px(250) + px(30) = px(280) ≈ 1.46"
  // Card top = px(310) ≈ 1.61" — clearance from subtitle bottom: 0.15" ✓ (>0.08")

  // --- Cards ---
  const cardW = px(396);
  const cardH = px(540);
  const accentH = px(8);
  const cardXOffsets = [22, 462, 902, 1342]; // pixel x-offsets
  const cardTop = subtitleY + px(60); // cards start below subtitle

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const cx = px(80) + px(cardXOffsets[i]);
    const cy = cardTop;

    // Card background — ROUNDED_RECTANGLE with tinted bg
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      rectRadius: 0.08,
      fill: { color: c.bgColor },
      shadow: cardShadow(),
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
    const heroTitleW = cardW - px(50);
    const heroTitleH = heroTitleW * (120 / titleRW);
    slide.addImage({
      data: titleImg,
      x: cx + px(30), y: cy + px(78),
      w: heroTitleW, h: heroTitleH,
    });

    // Card subtitle
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

    // Content items (4 bullet items)
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
        y: cardTop + px(270),
        w: 0.22, h: 0.22,
      });
    }
  }

  // --- Bottom callout bar ---
  const calloutY = cardTop + cardH + px(20);

  // Bounding box check: cardTop + cardH should be well above calloutY
  // cardTop ≈ px(310) ≈ 1.61", cardH = px(540) ≈ 2.81", bottom ≈ 4.42"
  // calloutY ≈ 4.42" + px(20) ≈ 4.52" — within slide bounds (5.625") ✓

  slide.addShape(pres.shapes.RECTANGLE, {
    x: px(80), y: calloutY, w: px(1760), h: 0.55,
    fill: { color: "F5F0FF" },
    line: { color: C.purple60, width: 1 },
  });

  slide.addText([
    { text: "Compounding returns: ", options: { bold: true, color: C.gray100, fontSize: 11 } },
    { text: "Each phase reduces risk and increases velocity for the next — organizations that start with guardrails reach enterprise scale 3x faster than those that retrofit governance later.", options: { color: C.gray70, fontSize: 11 } },
  ], {
    x: px(80) + 0.2, y: calloutY, w: px(1760) - 0.4, h: 0.55,
    fontFace: "Arial", valign: "middle", margin: 0,
  });

  // --- Write output ---
  const outDir = "/Users/simon.lynch/git/agentic-best-practices/.claude/skills/ibm-deck-workspace/iteration-3/eval-strategic-impact-v2/with_skill/outputs";
  await pres.writeFile({ fileName: `${outDir}/strategic-impact.pptx` });
  console.log("✅ strategic-impact.pptx written to:", outDir);
}

buildPresentation().catch(console.error);
