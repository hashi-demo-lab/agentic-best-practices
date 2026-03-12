import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaExclamationTriangle,
  FaClock,
  FaCogs,
  FaUsers,
  FaArrowRight,
  FaRocket,
  FaChartLine,
  FaShieldAlt,
  FaCheckCircle,
  FaLightbulb,
  FaBullseye,
} from "react-icons/fa";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// --- IBM Carbon Design System Tokens ---
const C = {
  // Neutrals
  white: "FFFFFF",
  gray10: "F4F4F4",
  gray20: "E0E0E0",
  gray30: "C6C6C6",
  gray50: "8D8D8D",
  gray60: "6F6F6F",
  gray70: "525252",
  gray80: "393939",
  gray90: "262626",
  gray100: "161616",
  // IBM Blue
  blue20: "D0E2FF",
  blue40: "78A9FF",
  blue60: "0F62FE",
  blue70: "0043CE",
  blue80: "002D9C",
  // Supporting colors
  purple60: "8A3FFC",
  teal50: "009D9A",
  teal60: "007D79",
  magenta60: "D02670",
  green50: "24A148",
  green60: "198038",
  red60: "DA1E28",
  yellow30: "F1C21B",
  cyan50: "1192E8",
  coolGray10: "F2F4F8",
  coolGray20: "DDE1E6",
  coolGray90: "21272A",
};

// --- Shadow factory (pptxgenjs mutates objects) ---
const cardShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 6,
  offset: 2,
  angle: 135,
  opacity: 0.10,
});

const softShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 4,
  offset: 1,
  angle: 180,
  opacity: 0.06,
});

// --- Helper: IBM 8-bar logo as SVG → base64 PNG ---
async function ibmLogoBase64(color = "#FFFFFF", width = 400) {
  // Simplified IBM 8-bar logo using horizontal bars
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" width="${width}" height="${Math.round(width * 0.4)}">
    <defs><style>rect { fill: ${color}; }</style></defs>
    <!-- I -->
    <rect x="0" y="0" width="80" height="12"/>
    <rect x="0" y="20" width="80" height="12"/>
    <rect x="20" y="40" width="40" height="12"/>
    <rect x="20" y="60" width="40" height="12"/>
    <rect x="20" y="80" width="40" height="12"/>
    <rect x="20" y="100" width="40" height="12"/>
    <rect x="0" y="120" width="80" height="12"/>
    <rect x="0" y="140" width="80" height="12"/>
    <!-- B -->
    <rect x="100" y="0" width="100" height="12"/>
    <rect x="100" y="20" width="100" height="12"/>
    <rect x="120" y="40" width="40" height="12"/><rect x="170" y="40" width="20" height="12"/>
    <rect x="120" y="60" width="60" height="12"/>
    <rect x="120" y="80" width="60" height="12"/>
    <rect x="120" y="100" width="40" height="12"/><rect x="170" y="100" width="25" height="12"/>
    <rect x="100" y="120" width="100" height="12"/>
    <rect x="100" y="140" width="95" height="12"/>
    <!-- M -->
    <rect x="220" y="0" width="170" height="12"/>
    <rect x="220" y="20" width="170" height="12"/>
    <rect x="240" y="40" width="30" height="12"/><rect x="290" y="40" width="30" height="12"/><rect x="340" y="40" width="30" height="12"/>
    <rect x="240" y="60" width="30" height="12"/><rect x="290" y="60" width="30" height="12"/><rect x="340" y="60" width="30" height="12"/>
    <rect x="240" y="80" width="30" height="12"/><rect x="290" y="80" width="30" height="12"/><rect x="340" y="80" width="30" height="12"/>
    <rect x="240" y="100" width="30" height="12"/><rect x="340" y="100" width="30" height="12"/>
    <rect x="220" y="120" width="40" height="12"/><rect x="330" y="120" width="40" height="12"/>
    <rect x="220" y="140" width="40" height="12"/><rect x="330" y="140" width="40" height="12"/>
  </svg>`;
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// --- Helper: generate gradient accent bar as base64 PNG ---
async function gradientBarPng(colorTop, colorBottom, width = 12, height = 300) {
  // Create a vertical gradient bar using sharp's raw pixel generation
  const channels = 4; // RGBA
  const pixels = Buffer.alloc(width * height * channels);

  const topR = parseInt(colorTop.slice(0, 2), 16);
  const topG = parseInt(colorTop.slice(2, 4), 16);
  const topB = parseInt(colorTop.slice(4, 6), 16);
  const botR = parseInt(colorBottom.slice(0, 2), 16);
  const botG = parseInt(colorBottom.slice(2, 4), 16);
  const botB = parseInt(colorBottom.slice(4, 6), 16);

  for (let y = 0; y < height; y++) {
    const t = y / (height - 1);
    const r = Math.round(topR + (botR - topR) * t);
    const g = Math.round(topG + (botG - topG) * t);
    const b = Math.round(topB + (botB - topB) * t);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = 255;
    }
  }

  const pngBuffer = await sharp(pixels, {
    raw: { width, height, channels },
  }).png().toBuffer();

  return "image/png;base64," + pngBuffer.toString("base64");
}

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "IBM Consulting";
  pres.title = "Digital Transformation Services";

  // =====================================================================
  // SLIDE 1: TITLE SLIDE
  // IBM Blue hero with 8-bar logo, title, and subtitle
  // =====================================================================
  const s1 = pres.addSlide();
  s1.background = { color: C.blue60 };

  // Dark gradient overlay at bottom for depth
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 3.5,
    w: 10,
    h: 2.125,
    fill: { color: C.blue80 },
  });

  // Subtle accent line across slide
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 3.5,
    w: 10,
    h: 0.02,
    fill: { color: C.blue40 },
  });

  // IBM Logo (top-left)
  const ibmLogo = await ibmLogoBase64("#FFFFFF", 400);
  s1.addImage({
    data: ibmLogo,
    x: 0.7,
    y: 0.5,
    w: 1.3,
    h: 0.52,
  });

  // Section label
  s1.addText("IBM CONSULTING", {
    x: 0.7,
    y: 1.5,
    w: 5,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    color: C.blue20,
    bold: true,
    charSpacing: 4,
    margin: 0,
  });

  // Main title
  s1.addText("Digital Transformation\nServices", {
    x: 0.7,
    y: 1.9,
    w: 7,
    h: 1.4,
    fontSize: 40,
    fontFace: "Arial Black",
    color: C.white,
    bold: true,
    lineSpacingMultiple: 1.1,
    margin: 0,
  });

  // Subtitle
  s1.addText(
    "Accelerating enterprise modernization through cloud, AI, and automation",
    {
      x: 0.7,
      y: 3.75,
      w: 7,
      h: 0.45,
      fontSize: 16,
      fontFace: "Arial",
      color: C.blue20,
      margin: 0,
    }
  );

  // Date and confidentiality
  s1.addText("March 2026  |  Confidential", {
    x: 0.7,
    y: 4.7,
    w: 5,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    color: C.blue40,
    margin: 0,
  });

  // Decorative accent squares (IBM design pattern)
  const accentColors = [C.cyan50, C.teal50, C.green50, C.purple60];
  for (let i = 0; i < 4; i++) {
    s1.addShape(pres.shapes.RECTANGLE, {
      x: 8.1 + i * 0.35,
      y: 4.7,
      w: 0.25,
      h: 0.25,
      fill: { color: accentColors[i] },
    });
  }

  // =====================================================================
  // SLIDE 2: THE CHALLENGE — 2x2 grid with gradient accent bars + icons
  // =====================================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("THE CHALLENGE", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: C.red60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  // Title
  s2.addText("Why Transformation Stalls", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.45,
    fontSize: 24,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  // Subtitle
  s2.addText(
    "Enterprises face compounding barriers that delay modernization and erode competitive advantage",
    {
      x: 0.7,
      y: 1.05,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // 4 challenge cards in a 2x2 grid
  const challenges = [
    {
      icon: FaExclamationTriangle,
      iconColor: "#" + C.red60,
      gradientTop: C.red60,
      gradientBottom: C.magenta60,
      title: "Legacy System Debt",
      desc: "Aging monolithic architectures resist change, slow feature delivery, and inflate maintenance costs across the portfolio",
    },
    {
      icon: FaClock,
      iconColor: "#" + C.cyan50,
      gradientTop: C.cyan50,
      gradientBottom: C.blue60,
      title: "Time-to-Market Pressure",
      desc: "Competitors ship faster while manual processes and siloed teams create bottlenecks at every stage of delivery",
    },
    {
      icon: FaCogs,
      iconColor: "#" + C.purple60,
      gradientTop: C.purple60,
      gradientBottom: C.blue80,
      title: "Integration Complexity",
      desc: "Disconnected data systems, inconsistent APIs, and hybrid cloud sprawl make end-to-end automation elusive",
    },
    {
      icon: FaUsers,
      iconColor: "#" + C.teal50,
      gradientTop: C.teal50,
      gradientBottom: C.green60,
      title: "Skills & Culture Gap",
      desc: "Teams lack cloud-native expertise while organizational inertia resists the process changes transformation demands",
    },
  ];

  const cardW = 4.1;
  const cardH = 1.55;
  const cardGapX = 0.4;
  const cardGapY = 0.25;
  const gridStartX = 0.7;
  const gridStartY = 1.5;

  // Pre-generate gradient bars
  const gradientBars = await Promise.all(
    challenges.map((ch) => gradientBarPng(ch.gradientTop, ch.gradientBottom, 16, 400))
  );

  for (let i = 0; i < challenges.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + cardGapX);
    const cy = gridStartY + row * (cardH + cardGapY);
    const ch = challenges[i];

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: cardW,
      h: cardH,
      fill: { color: C.coolGray10 },
      shadow: cardShadow(),
    });

    // Left gradient accent bar
    s2.addImage({
      data: gradientBars[i],
      x: cx,
      y: cy,
      w: 0.07,
      h: cardH,
    });

    // Icon
    const iconData = await iconToBase64Png(ch.icon, ch.iconColor, 256);
    s2.addImage({
      data: iconData,
      x: cx + 0.22,
      y: cy + 0.22,
      w: 0.42,
      h: 0.42,
    });

    // Card title
    s2.addText(ch.title, {
      x: cx + 0.78,
      y: cy + 0.18,
      w: cardW - 1.0,
      h: 0.4,
      fontSize: 15,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Card description
    s2.addText(ch.desc, {
      x: cx + 0.78,
      y: cy + 0.65,
      w: cardW - 1.0,
      h: 0.85,
      fontSize: 11,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Bottom insight bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.7,
    w: 8.6,
    h: 0.5,
    fill: { color: "FFF1F1" },
    line: { color: C.red60, width: 1 },
    shadow: softShadow(),
  });

  const bulbIcon = await iconToBase64Png(FaLightbulb, "#" + C.red60, 256);
  s2.addImage({
    data: bulbIcon,
    x: 0.9,
    y: 4.78,
    w: 0.28,
    h: 0.28,
  });

  s2.addText(
    [
      { text: "78% of enterprises ", options: { bold: true, color: C.gray100 } },
      {
        text: "report stalled transformation initiatives due to one or more of these challenges.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.35,
      y: 4.7,
      w: 7.8,
      h: 0.5,
      fontSize: 11,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 3: TIMELINE — 3 phase cards with arrow connectors
  // =====================================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Section label
  s3.addText("ENGAGEMENT TIMELINE", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: C.blue60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  // Title
  s3.addText("Three Phases to Transformation", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.45,
    fontSize: 24,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  // Subtitle
  s3.addText(
    "A structured approach that delivers quick wins while building toward sustained enterprise-wide change",
    {
      x: 0.7,
      y: 1.05,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  const phases = [
    {
      num: "1",
      title: "Discover & Assess",
      subtitle: "WEEKS 1 \u2013 4",
      accentColor: C.blue60,
      items: [
        "Current-state architecture review",
        "Process and capability mapping",
        "Technology gap analysis",
        "Transformation roadmap design",
        "Quick-win identification",
      ],
    },
    {
      num: "2",
      title: "Build & Modernize",
      subtitle: "WEEKS 5 \u2013 16",
      accentColor: C.teal50,
      items: [
        "Cloud migration execution",
        "API and microservices build",
        "Data platform modernization",
        "AI/ML integration pilots",
        "DevOps pipeline automation",
      ],
    },
    {
      num: "3",
      title: "Scale & Optimize",
      subtitle: "WEEKS 17 \u2013 24",
      accentColor: C.green50,
      items: [
        "Enterprise-wide rollout",
        "Performance optimization",
        "Team enablement programs",
        "Governance framework activation",
        "Continuous improvement handoff",
      ],
    },
  ];

  const phaseW = 2.65;
  const phaseH = 3.25;
  const phaseGap = 0.55;
  const phaseStartX = 0.7;
  const phaseStartY = 1.5;

  for (let i = 0; i < phases.length; i++) {
    const px = phaseStartX + i * (phaseW + phaseGap);
    const phase = phases[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: phaseStartY,
      w: phaseW,
      h: phaseH,
      fill: { color: C.coolGray10 },
      shadow: cardShadow(),
    });

    // Top accent bar
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: phaseStartY,
      w: phaseW,
      h: 0.06,
      fill: { color: phase.accentColor },
    });

    // Phase number circle
    s3.addShape(pres.shapes.OVAL, {
      x: px + phaseW / 2 - 0.26,
      y: phaseStartY + 0.22,
      w: 0.52,
      h: 0.52,
      fill: { color: phase.accentColor },
    });

    s3.addText(phase.num, {
      x: px + phaseW / 2 - 0.26,
      y: phaseStartY + 0.22,
      w: 0.52,
      h: 0.52,
      fontSize: 22,
      fontFace: "Arial",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    // Phase title
    s3.addText(phase.title, {
      x: px + 0.15,
      y: phaseStartY + 0.85,
      w: phaseW - 0.3,
      h: 0.35,
      fontSize: 15,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      align: "center",
      margin: 0,
    });

    // Month label
    s3.addText(phase.subtitle, {
      x: px + 0.15,
      y: phaseStartY + 1.15,
      w: phaseW - 0.3,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      color: C.gray50,
      bold: true,
      align: "center",
      charSpacing: 2,
      margin: 0,
    });

    // Divider line
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px + 0.2,
      y: phaseStartY + 1.45,
      w: phaseW - 0.4,
      h: 0.01,
      fill: { color: C.coolGray20 },
    });

    // Bullet items
    const bullets = phase.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < phase.items.length - 1,
        fontSize: 10.5,
        color: C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s3.addText(bullets, {
      x: px + 0.2,
      y: phaseStartY + 1.55,
      w: phaseW - 0.4,
      h: 1.6,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });

    // Arrow connector between cards (except last)
    if (i < phases.length - 1) {
      const arrowIcon = await iconToBase64Png(
        FaArrowRight,
        "#" + phase.accentColor,
        256
      );
      s3.addImage({
        data: arrowIcon,
        x: px + phaseW + phaseGap / 2 - 0.16,
        y: phaseStartY + phaseH / 2 - 0.16,
        w: 0.32,
        h: 0.32,
      });
    }
  }

  // =====================================================================
  // SLIDE 4: OUTCOMES — key results with bottom callout bar
  // =====================================================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Section label
  s4.addText("EXPECTED OUTCOMES", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: C.green50,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  // Title
  s4.addText("Measurable Business Impact", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.45,
    fontSize: 24,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  // Subtitle
  s4.addText(
    "Tangible results delivered across speed, efficiency, and organizational capability",
    {
      x: 0.7,
      y: 1.05,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // Outcome metric cards — two columns
  const outcomeCards = [
    {
      icon: FaRocket,
      iconColor: "#" + C.blue60,
      accentColor: C.blue60,
      metric: "40%",
      label: "Faster Time-to-Market",
      desc: "Streamlined delivery pipelines and cloud-native architectures accelerate feature releases",
    },
    {
      icon: FaChartLine,
      iconColor: "#" + C.teal50,
      accentColor: C.teal50,
      metric: "60%",
      label: "Reduction in Ops Overhead",
      desc: "Automation of manual processes frees engineering capacity for innovation",
    },
    {
      icon: FaShieldAlt,
      iconColor: "#" + C.green50,
      accentColor: C.green50,
      metric: "3x",
      label: "Improved Resilience",
      desc: "Modern architectures with built-in observability reduce incident frequency and recovery time",
    },
    {
      icon: FaBullseye,
      iconColor: "#" + C.purple60,
      accentColor: C.purple60,
      metric: "90%",
      label: "Team Adoption Rate",
      desc: "Structured enablement programs drive sustained adoption of new tools and practices",
    },
  ];

  const ocW = 4.1;
  const ocH = 1.2;
  const ocGapX = 0.4;
  const ocGapY = 0.2;
  const ocStartX = 0.7;
  const ocStartY = 1.5;

  for (let i = 0; i < outcomeCards.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ox = ocStartX + col * (ocW + ocGapX);
    const oy = ocStartY + row * (ocH + ocGapY);
    const oc = outcomeCards[i];

    // Card background
    s4.addShape(pres.shapes.RECTANGLE, {
      x: ox,
      y: oy,
      w: ocW,
      h: ocH,
      fill: { color: C.coolGray10 },
      shadow: cardShadow(),
    });

    // Left accent bar
    s4.addShape(pres.shapes.RECTANGLE, {
      x: ox,
      y: oy,
      w: 0.06,
      h: ocH,
      fill: { color: oc.accentColor },
    });

    // Big metric number
    s4.addText(oc.metric, {
      x: ox + 0.2,
      y: oy + 0.1,
      w: 0.8,
      h: 0.55,
      fontSize: 32,
      fontFace: "Arial Black",
      color: oc.accentColor,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    // Icon
    const iconData = await iconToBase64Png(oc.icon, oc.iconColor, 256);
    s4.addImage({
      data: iconData,
      x: ox + 0.38,
      y: oy + 0.72,
      w: 0.28,
      h: 0.28,
    });

    // Label
    s4.addText(oc.label, {
      x: ox + 1.1,
      y: oy + 0.1,
      w: ocW - 1.3,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Description
    s4.addText(oc.desc, {
      x: ox + 1.1,
      y: oy + 0.5,
      w: ocW - 1.3,
      h: 0.6,
      fontSize: 10.5,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.35,
    w: 8.6,
    h: 0.85,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1.2 },
    shadow: softShadow(),
  });

  // IBM logo in callout
  const ibmLogoSmall = await ibmLogoBase64("#0F62FE", 200);
  s4.addImage({
    data: ibmLogoSmall,
    x: 0.9,
    y: 4.52,
    w: 0.65,
    h: 0.26,
  });

  // Callout divider
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 1.75,
    y: 4.48,
    w: 0.015,
    h: 0.55,
    fill: { color: C.blue40 },
  });

  // Callout text
  s4.addText(
    [
      {
        text: "Ready to accelerate your transformation? ",
        options: { bold: true, color: C.gray100, fontSize: 12 },
      },
      {
        text: "\nIBM Consulting partners with you from strategy through execution \u2014 delivering measurable outcomes backed by deep industry expertise and proven methodologies.",
        options: { color: C.gray70, fontSize: 10.5 },
      },
    ],
    {
      x: 1.95,
      y: 4.38,
      w: 7.2,
      h: 0.8,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // Accent squares in bottom-right (IBM design pattern)
  for (let i = 0; i < 4; i++) {
    s4.addShape(pres.shapes.RECTANGLE, {
      x: 8.6 + i * 0.2,
      y: 5.3,
      w: 0.14,
      h: 0.14,
      fill: { color: accentColors[i] },
    });
  }

  // =====================================================================
  // WRITE FILE
  // =====================================================================
  const outputPath = resolve(__dirname, "digital-transformation.pptx");
  await pres.writeFile({ fileName: outputPath });
  console.log(`Created: ${outputPath}`);
}

buildPresentation().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
