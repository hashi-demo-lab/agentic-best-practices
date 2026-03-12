import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaClock,
  FaBan,
  FaRocket,
  FaCogs,
  FaUsers,
  FaCheckCircle,
  FaServer,
  FaLock,
  FaClipboardList,
  FaHandshake,
} from "react-icons/fa";

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

// --- SVG gradient renderers ---
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

// --- Shadow factories (ALWAYS fresh objects) ---
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

// --- Image base path ---
const IMG_DIR = ".claude/skills/ibm-deck-workspace/iteration-2/eval-hybrid-proposal/with_skill/outputs/images";

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Technology Services";
  pres.title = "Technology Services Proposal";

  // ============================================================
  // SLIDE 1: Title (HTML capture - full-bleed PNG)
  // ============================================================
  const s1 = pres.addSlide();
  s1.addImage({
    path: `${IMG_DIR}/slide-title.png`,
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // ============================================================
  // SLIDE 2: The Challenge — 2x2 grid of risk/challenge cards
  // ============================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("CHALLENGES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.red60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s2.addText("The Challenge", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.35,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle — y (1.0) >= title.y (0.6) + title.h (0.35) + 0.05 = 1.0 ✓
  s2.addText("Critical risks that demand immediate attention and strategic response", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Challenge cards data
  const challenges = [
    {
      icon: FaExclamationTriangle,
      accentColors: ["#A01520", "#DA1E28", "#FF4D55"],
      accentPptx: C.red60,
      title: "Security Vulnerabilities",
      desc: "Legacy systems expose critical security gaps with outdated protocols and unpatched dependencies.",
    },
    {
      icon: FaClock,
      accentColors: ["#8A6800", "#B28600", "#F59E0B"],
      accentPptx: C.yellow50,
      title: "Operational Inefficiency",
      desc: "Manual processes consume engineering hours and delay delivery cycles across teams.",
    },
    {
      icon: FaBan,
      accentColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      accentPptx: C.purple60,
      title: "Scalability Constraints",
      desc: "Current infrastructure cannot scale to meet growing demand without significant rework.",
    },
    {
      icon: FaShieldAlt,
      accentColors: ["#007D79", "#009D9A", "#2DD4BF"],
      accentPptx: C.teal60,
      title: "Compliance Gaps",
      desc: "Regulatory requirements are not consistently met across environments and regions.",
    },
  ];

  const cardW = 4.1, cardH = 1.35;
  const cardGapX = 0.4, cardGapY = 0.2;
  const gridStartX = 0.7, gridStartY = 1.4;

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + cardGapX);
    const cy = gridStartY + row * (cardH + cardGapY);
    const ch = challenges[i];

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left gradient accent bar
    const vBar = await renderVerticalGradientBar(ch.accentColors, 8, 260);
    s2.addImage({ data: vBar, x: cx, y: cy, w: 0.08, h: cardH });

    // Icon
    const iconData = await iconToBase64Png(ch.icon, "#" + ch.accentPptx, 256);
    s2.addImage({
      data: iconData,
      x: cx + 0.2, y: cy + 0.2, w: 0.38, h: 0.38,
    });

    // Card title
    s2.addText(ch.title, {
      x: cx + 0.7, y: cy + 0.15, w: cardW - 0.9, h: 0.4,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    // Card description
    s2.addText(ch.desc, {
      x: cx + 0.7, y: cy + 0.55, w: cardW - 0.9, h: 0.7,
      fontSize: 12, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.5, w: 8.6, h: 0.55,
    fill: { color: "FFF0F0" },
    line: { color: C.red60, width: 1 },
  });

  const calloutIcon2 = await iconToBase64Png(FaExclamationTriangle, "#" + C.red60, 256);
  s2.addImage({
    data: calloutIcon2, x: 0.9, y: 4.57, w: 0.35, h: 0.35,
  });

  s2.addText([
    { text: "Impact: ", options: { bold: true, color: C.gray100 } },
    { text: "These challenges compound over time, increasing risk exposure and reducing competitive advantage.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.5, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ============================================================
  // SLIDE 3: Value Proposition — 3 pillar cards
  // ============================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Section label
  s3.addText("VALUE PROPOSITION", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s3.addText("What We Deliver", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.35,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle — y (1.0) >= title.y (0.6) + title.h (0.35) + 0.05 = 1.0 ✓
  s3.addText("Three core pillars of our technology services engagement", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  const pillars = [
    {
      icon: FaRocket,
      accentColors: ["#0043CE", "#0F62FE", "#4589FF"],
      accentPptx: C.blue60,
      title: "Modernization",
      items: [
        "Cloud-native architecture",
        "Container orchestration",
        "CI/CD pipeline automation",
        "Infrastructure as Code adoption",
      ],
    },
    {
      icon: FaCogs,
      accentColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      accentPptx: C.purple60,
      title: "Optimization",
      items: [
        "Performance tuning & profiling",
        "Cost optimization strategies",
        "Automated monitoring & alerts",
        "Resource right-sizing analysis",
      ],
    },
    {
      icon: FaUsers,
      accentColors: ["#007D79", "#009D9A", "#2DD4BF"],
      accentPptx: C.teal60,
      title: "Enablement",
      items: [
        "Team upskilling & workshops",
        "Self-service platform tooling",
        "Runbook & knowledge transfer",
        "Ongoing advisory support",
      ],
    },
  ];

  const pillarW = 2.75, pillarH = 2.85;
  const pillarGap = 0.45;
  const pillarStartX = 0.7, pillarStartY = 1.5;

  for (let i = 0; i < 3; i++) {
    const px = pillarStartX + i * (pillarW + pillarGap);
    const p = pillars[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px, y: pillarStartY, w: pillarW, h: pillarH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top gradient accent bar
    const topBar = await renderGradientBar(p.accentColors, 400, 8, 0);
    s3.addImage({ data: topBar, x: px, y: pillarStartY, w: pillarW, h: 0.08 });

    // Icon
    const iconData = await iconToBase64Png(p.icon, "#" + p.accentPptx, 256);
    s3.addImage({
      data: iconData,
      x: px + 0.25, y: pillarStartY + 0.25, w: 0.42, h: 0.42,
    });

    // Pillar title
    s3.addText(p.title, {
      x: px + 0.25, y: pillarStartY + 0.78, w: pillarW - 0.5, h: 0.35,
      fontSize: 16, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Bullet items
    const bullets = p.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < p.items.length - 1,
        fontSize: 11, color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s3.addText(bullets, {
      x: px + 0.25, y: pillarStartY + 1.2, w: pillarW - 0.5, h: 1.5,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.55, w: 8.6, h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const calloutIcon3 = await iconToBase64Png(FaHandshake, "#" + C.blue60, 256);
  s3.addImage({
    data: calloutIcon3, x: 0.9, y: 4.62, w: 0.35, h: 0.35,
  });

  s3.addText([
    { text: "Outcome: ", options: { bold: true, color: C.gray100 } },
    { text: "A resilient, scalable, and well-governed technology foundation that accelerates business delivery.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.55, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ============================================================
  // SLIDE 4: Pre-requisites — 4 narrow columns, last highlighted
  // ============================================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Section label
  s4.addText("PRE-REQUISITES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s4.addText("Pre-requisites", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.35,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle — y (1.0) >= title.y (0.6) + title.h (0.35) + 0.05 = 1.0 ✓
  s4.addText("What needs to be in place before the engagement begins", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  const prereqs = [
    {
      icon: FaServer,
      accentColors: ["#0043CE", "#0F62FE", "#4589FF"],
      accentPptx: C.blue60,
      title: "Infrastructure Access",
      items: [
        "Cloud account credentials",
        "Network topology docs",
        "Current architecture diagrams",
        "Access to staging envs",
      ],
    },
    {
      icon: FaUsers,
      accentColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      accentPptx: C.purple60,
      title: "Team Availability",
      items: [
        "Dedicated engineering POC",
        "Weekly sync cadence",
        "Decision-maker access",
        "Knowledge transfer sessions",
      ],
    },
    {
      icon: FaClipboardList,
      accentColors: ["#8A6800", "#B28600", "#F59E0B"],
      accentPptx: C.yellow50,
      title: "Documentation",
      items: [
        "Existing runbooks & SOPs",
        "Incident response plans",
        "Change management process",
        "Compliance requirements",
      ],
    },
    {
      icon: FaLock,
      accentColors: ["#007D79", "#009D9A", "#2DD4BF"],
      accentPptx: C.teal60,
      title: "Security Clearance",
      isMandatory: true,
      items: [
        "Security review approval",
        "Data classification complete",
        "Vendor risk assessment",
        "NDA and MSA executed",
      ],
    },
  ];

  const preCardW = 2.0, preCardH = 2.95;
  const preCardGap = 0.27;
  const preStartX = 0.7, preStartY = 1.5;

  for (let i = 0; i < 4; i++) {
    const cx = preStartX + i * (preCardW + preCardGap);
    const cy = preStartY;
    const pr = prereqs[i];
    const isMandatory = !!pr.isMandatory;

    // Card background — tinted + bordered if mandatory
    s4.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: preCardW, h: preCardH,
      fill: { color: isMandatory ? "E8F7F7" : C.gray10 },
      line: isMandatory ? { color: C.teal60, width: 1.5 } : undefined,
      shadow: cardShadow(),
    });

    // Top gradient accent bar
    const topBar = await renderGradientBar(pr.accentColors, 400, 8, 0);
    s4.addImage({ data: topBar, x: cx, y: cy, w: preCardW, h: 0.08 });

    // REQUIRED badge (only on mandatory card)
    if (isMandatory) {
      s4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx + preCardW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
        fill: { color: C.teal60 }, rectRadius: 0.05,
      });
      s4.addText("REQUIRED", {
        x: cx + preCardW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
        fontSize: 8, fontFace: "Arial", color: C.white,
        bold: true, align: "center", valign: "middle",
        charSpacing: 1.5, margin: 0,
      });
    }

    // Icon
    const iconData = await iconToBase64Png(pr.icon, "#" + pr.accentPptx, 256);
    s4.addImage({
      data: iconData,
      x: cx + 0.25, y: cy + 0.25, w: 0.42, h: 0.42,
    });

    // Card title (h: 0.45 to accommodate 2-line wrap on narrow cards)
    s4.addText(pr.title, {
      x: cx + 0.15, y: cy + 0.78, w: preCardW - 0.3, h: 0.45,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Bullet items (start at cy + 1.3 to clear potential 2-line title)
    const bullets = pr.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < pr.items.length - 1,
        fontSize: 10,
        color: isMandatory ? C.gray100 : C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s4.addText(bullets, {
      x: cx + 0.15, y: cy + 1.3, w: preCardW - 0.3, h: 1.5,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.65, w: 8.6, h: 0.55,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  const calloutIcon4 = await iconToBase64Png(FaCheckCircle, "#" + C.teal60, 256);
  s4.addImage({
    data: calloutIcon4, x: 0.9, y: 4.72, w: 0.35, h: 0.35,
  });

  s4.addText([
    { text: "Note: ", options: { bold: true, color: C.gray100 } },
    { text: "Security Clearance is mandatory before project kickoff. All other items should be completed within the first two weeks.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.65, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ============================================================
  // SLIDE 5: Closing (HTML capture - full-bleed PNG)
  // ============================================================
  const s5 = pres.addSlide();
  s5.addImage({
    path: `${IMG_DIR}/slide-closing.png`,
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // ============================================================
  // Write output
  // ============================================================
  const outputDir = ".claude/skills/ibm-deck-workspace/iteration-2/eval-hybrid-proposal/with_skill/outputs";
  await pres.writeFile({ fileName: `${outputDir}/technology-services-proposal.pptx` });
  console.log("Done: technology-services-proposal.pptx");
}

buildPresentation().catch(console.error);
