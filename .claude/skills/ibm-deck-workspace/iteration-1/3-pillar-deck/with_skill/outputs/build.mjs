import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import { FaSearchPlus, FaCloudUploadAlt, FaChartLine, FaArrowRight, FaRocket } from "react-icons/fa";
import { fileURLToPath } from "url";
import path from "path";

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

// --- Gradient bar renderers (SVG → PNG via sharp) ---
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

// --- Gradient color triplets ---
const gradients = {
  blue:   ["#0043CE", "#0F62FE", "#4589FF"],
  teal:   ["#007D79", "#009D9A", "#2DD4BF"],
  green:  ["#0E6027", "#198038", "#34D478"],
  purple: ["#627EEF", "#8A3FFC", "#D946EF"],
};

// --- Resolve output path ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "migration-strategy.pptx");

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "IBM Cloud Strategy";
  pres.title = "Cloud Migration Strategy";

  // ============================================================
  // SLIDE 1: Title Slide (Programmatic — Option B from skill)
  // ============================================================
  const s1 = pres.addSlide();
  s1.background = { color: C.white };

  // Top accent line (blue gradient bar)
  const titleBar = await renderGradientBar(gradients.blue, 1920, 12, 0);
  s1.addImage({ data: titleBar, x: 0, y: 0, w: 10, h: 0.08 });

  // Section label
  s1.addText("IBM CLOUD", {
    x: 0.7, y: 1.4, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 4, margin: 0,
  });

  // Title
  s1.addText("Cloud Migration Strategy", {
    x: 0.7, y: 1.75, w: 8.6, h: 1.0,
    fontSize: 40, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s1.addText("A structured approach to assess, migrate, and optimize\nyour workloads on IBM Cloud", {
    x: 0.7, y: 2.8, w: 8.6, h: 0.7,
    fontSize: 18, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Decorative line separator
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.6, w: 2.0, h: 0.04,
    fill: { color: C.blue60 },
  });

  // Date / metadata
  s1.addText("Q1 2026  |  Strategy & Architecture", {
    x: 0.7, y: 3.8, w: 8.6, h: 0.4,
    fontSize: 13, fontFace: "Arial",
    color: C.gray50, margin: 0,
  });

  // Bottom bar
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: C.gray10 },
  });

  s1.addText("IBM Cloud  |  Confidential", {
    x: 0.7, y: 5.125, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, valign: "middle", margin: 0,
  });

  // ============================================================
  // SLIDE 2: Three Pillar Cards (Assess, Migrate, Optimize)
  // ============================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("MIGRATION FRAMEWORK", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s2.addText("Three Pillars of Cloud Migration", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.55,
    fontSize: 26, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s2.addText("A phased approach that minimizes risk and maximizes business value at every stage.", {
    x: 0.7, y: 1.15, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // --- Pillar data ---
  const pillars = [
    {
      icon: FaSearchPlus,
      title: "Assess",
      accent: C.blue60,
      gradient: gradients.blue,
      bullets: [
        "Inventory existing workloads",
        "Evaluate cloud readiness",
        "Identify dependencies & risks",
        "Define migration priorities",
        "Estimate TCO & ROI",
      ],
    },
    {
      icon: FaCloudUploadAlt,
      title: "Migrate",
      accent: C.teal60,
      gradient: gradients.teal,
      bullets: [
        "Select migration patterns",
        "Provision target environments",
        "Execute phased migrations",
        "Validate data integrity",
        "Cutover with minimal downtime",
      ],
    },
    {
      icon: FaChartLine,
      title: "Optimize",
      accent: C.green60,
      gradient: gradients.green,
      bullets: [
        "Right-size cloud resources",
        "Implement auto-scaling policies",
        "Optimize cost management",
        "Enhance security posture",
        "Continuous performance tuning",
      ],
    },
  ];

  const pillarW = 2.75, pillarH = 3.0;
  const pillarGap = 0.45;
  const startX = 0.7, startY = 1.6;

  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    const px = startX + i * (pillarW + pillarGap);

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: px, y: startY, w: pillarW, h: pillarH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Gradient top accent bar (h: 0.08 minimum for projection visibility)
    const bar = await renderGradientBar(p.gradient, 400, 8, 0);
    s2.addImage({ data: bar, x: px, y: startY, w: pillarW, h: 0.08 });

    // Icon (rendered from react-icons — uses "#" prefix)
    const iconData = await iconToBase64Png(p.icon, "#" + p.accent, 256);
    s2.addImage({
      data: iconData,
      x: px + 0.25, y: startY + 0.25, w: 0.42, h: 0.42,
    });

    // Pillar title
    s2.addText(p.title, {
      x: px + 0.25, y: startY + 0.78, w: pillarW - 0.5, h: 0.35,
      fontSize: 16, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Bullet items
    const bullets = p.bullets.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < p.bullets.length - 1,
        fontSize: 11, color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s2.addText(bullets, {
      x: px + 0.25, y: startY + 1.2, w: pillarW - 0.5, h: 1.65,
      fontFace: "Arial", valign: "top", margin: 0,
    });

    // Arrow connector between pillars (except last)
    if (i < pillars.length - 1) {
      const arrowColor = C.gray50;
      const arrowImg = await iconToBase64Png(FaArrowRight, "#" + arrowColor, 256);
      s2.addImage({
        data: arrowImg,
        x: px + pillarW + pillarGap / 2 - 0.11,
        y: startY + pillarH / 2 - 0.11,
        w: 0.22,
        h: 0.22,
      });
    }
  }

  // Bottom callout bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.75, w: 8.6, h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const rocketIcon = await iconToBase64Png(FaRocket, "#" + C.blue60, 256);
  s2.addImage({
    data: rocketIcon,
    x: 0.9, y: 4.82, w: 0.35, h: 0.35,
  });

  s2.addText([
    { text: "End-to-end support: ", options: { bold: true, color: C.gray100 } },
    { text: "IBM provides guided workshops, automated tooling, and expert architects at every phase.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.75, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ============================================================
  // SLIDE 3: Closing Slide
  // ============================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Top accent line (blue gradient bar)
  const closingBar = await renderGradientBar(gradients.blue, 1920, 12, 0);
  s3.addImage({ data: closingBar, x: 0, y: 0, w: 10, h: 0.08 });

  // Main closing message
  s3.addText("Ready to Begin\nYour Cloud Journey?", {
    x: 0.7, y: 1.4, w: 8.6, h: 1.3,
    fontSize: 36, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Supporting text
  s3.addText("Let us help you assess your workloads, plan a migration path,\nand optimize for long-term success on IBM Cloud.", {
    x: 0.7, y: 2.8, w: 8.6, h: 0.7,
    fontSize: 16, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Decorative line separator
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.7, w: 2.0, h: 0.04,
    fill: { color: C.blue60 },
  });

  // Contact information
  s3.addText("Contact your IBM Cloud representative to schedule a discovery workshop.", {
    x: 0.7, y: 3.9, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  s3.addText("ibm.com/cloud/migration", {
    x: 0.7, y: 4.3, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial",
    color: C.blue60, bold: true, margin: 0,
  });

  // Bottom bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: C.gray10 },
  });

  s3.addText("IBM Cloud  |  Confidential", {
    x: 0.7, y: 5.125, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, valign: "middle", margin: 0,
  });

  // ============================================================
  // Write PPTX
  // ============================================================
  await pres.writeFile({ fileName: outputPath });
  console.log(`PPTX written to: ${outputPath}`);
}

buildPresentation().catch(console.error);
