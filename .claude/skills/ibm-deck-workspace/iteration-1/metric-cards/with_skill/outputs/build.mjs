import pptxgen from "pptxgenjs";
import sharp from "sharp";

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

// --- Gradient bar renderer (SVG -> PNG via sharp) ---
async function renderGradientBar(colors, width = 396, height = 8, borderRadius = 0) {
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

// --- Gradient color triplets (dark -> mid -> light) ---
const gradients = {
  green:  ["#0E6027", "#198038", "#34D478"],
  teal:   ["#007D79", "#009D9A", "#2DD4BF"],
  blue:   ["#0043CE", "#0F62FE", "#4589FF"],
};

// --- Metric data ---
const metrics = [
  {
    label: "REVENUE GROWTH",
    title: "Annual Revenue",
    description: "Year-over-year revenue growth driven by new product launches and market expansion.",
    metricLabel: "GROWTH RATE",
    metricValue: "+24%",
    accentColor: C.green60,
    gradient: gradients.green,
    tintBg: "F0FFF4",
  },
  {
    label: "CUSTOMER SUCCESS",
    title: "Retention Rate",
    description: "Customer retention improved through enhanced support programs and product reliability.",
    metricLabel: "RETENTION",
    metricValue: "97.3%",
    accentColor: C.teal60,
    gradient: gradients.teal,
    tintBg: "F0FFFC",
  },
  {
    label: "OPERATIONAL EFFICIENCY",
    title: "Cost Optimization",
    description: "Infrastructure costs reduced through automation and cloud-native migration initiatives.",
    metricLabel: "COST REDUCTION",
    metricValue: "-18%",
    accentColor: C.blue60,
    gradient: gradients.blue,
    tintBg: "F0F5FF",
  },
];

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";  // 10" x 5.625"
  pres.author = "Q4 Performance Team";
  pres.title = "Q4 Performance Review";

  // =========================================================
  // SLIDE 1 — Programmatic Title Slide (no HTML capture)
  // =========================================================
  const s1 = pres.addSlide();
  s1.background = { color: C.white };

  // Top accent line
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.blue60 },
  });

  // Title
  s1.addText("Q4 Performance Review", {
    x: 0.7, y: 1.8, w: 8.6, h: 1.0,
    fontSize: 40, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s1.addText("Key Performance Indicators & Business Metrics", {
    x: 0.7, y: 2.8, w: 8.6, h: 0.5,
    fontSize: 18, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Bottom bar
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: C.gray10 },
  });

  s1.addText("FY2026 Q4  |  Confidential", {
    x: 0.7, y: 5.125, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, valign: "middle", margin: 0,
  });

  // =========================================================
  // SLIDE 2 — Metric Callout Cards (3 columns)
  // =========================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };  // REQUIRED on every content slide

  // Section label (uppercase, accented, letter-spaced)
  s2.addText("PERFORMANCE METRICS", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60,
    bold: true, charSpacing: 3, margin: 0,
  });

  // Slide title
  s2.addText("Q4 Key Performance Indicators", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.45,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s2.addText("Critical metrics tracking organizational performance across revenue, retention, and efficiency.", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // --- Metric cards layout ---
  const ucW = 2.75, ucH = 3.4;
  const ucGap = 0.45;
  const startX = 0.7, startY = 1.45;

  for (let i = 0; i < 3; i++) {
    const m = metrics[i];
    const ux = startX + i * (ucW + ucGap);

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: ux, y: startY, w: ucW, h: ucH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Gradient top accent bar (h: 0.08 minimum for projection visibility)
    const bar = await renderGradientBar(m.gradient, 400, 8, 0);
    s2.addImage({ data: bar, x: ux, y: startY, w: ucW, h: 0.08 });

    // Category label (small uppercase)
    s2.addText(m.label, {
      x: ux + 0.2, y: startY + 0.2, w: ucW - 0.4, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: m.accentColor, bold: true, charSpacing: 2, margin: 0,
    });

    // Card title
    s2.addText(m.title, {
      x: ux + 0.2, y: startY + 0.5, w: ucW - 0.4, h: 0.35,
      fontSize: 16, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Description
    s2.addText(m.description, {
      x: ux + 0.2, y: startY + 0.9, w: ucW - 0.4, h: 0.75,
      fontSize: 11, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });

    // Metric box (inset white box with border)
    s2.addShape(pres.shapes.RECTANGLE, {
      x: ux + 0.15, y: startY + 1.75, w: ucW - 0.3, h: 1.4,
      fill: { color: C.white },
      line: { color: C.gray20, width: 0.5 },
    });

    // Metric label (centered uppercase)
    s2.addText(m.metricLabel, {
      x: ux + 0.2, y: startY + 1.85, w: ucW - 0.4, h: 0.2,
      fontSize: 9, fontFace: "Arial",
      color: C.gray50, bold: true, charSpacing: 2, align: "center", margin: 0,
    });

    // Big metric number
    s2.addText(m.metricValue, {
      x: ux + 0.2, y: startY + 2.15, w: ucW - 0.4, h: 0.6,
      fontSize: 36, fontFace: "Arial Black",
      color: m.accentColor, bold: true, align: "center", margin: 0,
    });

    // Metric context line
    s2.addText("vs. prior quarter", {
      x: ux + 0.2, y: startY + 2.8, w: ucW - 0.4, h: 0.2,
      fontSize: 10, fontFace: "Arial",
      color: C.gray50, align: "center", margin: 0,
    });
  }

  // --- Bottom callout bar ---
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 5.0, w: 8.6, h: 0.45,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  s2.addText([
    { text: "Q4 Highlights: ", options: { bold: true, color: C.gray100 } },
    { text: "All three KPIs exceeded quarterly targets, reflecting strong execution across teams.", options: { color: C.gray70 } },
  ], {
    x: 0.9, y: 5.0, w: 8.2, h: 0.45,
    fontSize: 10.5, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // =========================================================
  // Write the PPTX
  // =========================================================
  const outputPath = ".claude/skills/ibm-deck-workspace/iteration-1/metric-cards/with_skill/outputs/Q4-Performance-Review.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log(`PPTX written to: ${outputPath}`);
}

buildPresentation().catch(console.error);
