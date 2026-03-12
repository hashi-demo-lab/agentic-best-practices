import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaExclamationTriangle,
  FaCogs,
  FaUsers,
  FaLock,
  FaArrowRight,
  FaSearch,
  FaTools,
  FaRocket,
  FaCheckCircle,
  FaChartLine,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";

// ─── Icon Helpers ─────────────────────────────────────────────────────
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

// ─── SVG Gradient Helpers ─────────────────────────────────────────────
async function renderGradientBar(colors, width = 396, height = 8, borderRadius = 0) {
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

// ─── IBM Carbon Design Tokens (NO "#" prefix!) ───────────────────────
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

// ─── Gradient Triplets (dark, mid, light) ─────────────────────────────
const gradients = {
  blue:    ["#0043CE", "#0F62FE", "#4589FF"],
  purple:  ["#627EEF", "#8A3FFC", "#D946EF"],
  teal:    ["#007D79", "#009D9A", "#2DD4BF"],
  green:   ["#0E6027", "#198038", "#34D478"],
  red:     ["#A01520", "#DA1E28", "#FF4D55"],
  magenta: ["#9F1853", "#D02670", "#FF7EB6"],
};

// ─── Shadow Factories (ALWAYS fresh objects) ──────────────────────────
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

const footerBarShadow = () => ({
  type: "outer", color: "000000", blur: 4,
  offset: 1, angle: 270, opacity: 0.06,
});

// ─── Build Presentation ───────────────────────────────────────────────
async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "IBM Consulting";
  pres.title = "Digital Transformation Services";

  // ═══════════════════════════════════════════════════════════════════
  // SLIDE 1: Title
  // ═══════════════════════════════════════════════════════════════════
  const s1 = pres.addSlide();
  s1.background = { color: C.white };

  // Top accent line (blue60)
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.blue60 },
  });

  // Title
  s1.addText("Digital Transformation\nServices", {
    x: 0.7, y: 1.5, w: 8.6, h: 1.4,
    fontSize: 40, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
    lineSpacingMultiple: 1.1,
  });

  // Subtitle
  s1.addText("Accelerating innovation through technology modernization,\ncloud adoption, and intelligent automation.", {
    x: 0.7, y: 3.0, w: 8.6, h: 0.7,
    fontSize: 16, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Bottom bar
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: C.gray10 },
  });

  s1.addText("IBM Consulting  |  Confidential", {
    x: 0.7, y: 5.125, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, valign: "middle", margin: 0,
  });

  // ═══════════════════════════════════════════════════════════════════
  // SLIDE 2: Challenges — 2x2 Card Grid with Left Gradient Accent Bars
  // ═══════════════════════════════════════════════════════════════════
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("THE CHALLENGE", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.red60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s2.addText("Key Challenges Facing Your Organization", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.45,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s2.addText("Critical obstacles that impede growth and operational efficiency.", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Challenge card data
  const challenges = [
    {
      icon: FaExclamationTriangle,
      iconColor: C.red60,
      gradientKey: "red",
      title: "Legacy System Debt",
      desc: "Aging infrastructure increases maintenance costs and limits ability to adopt modern technologies.",
    },
    {
      icon: FaCogs,
      iconColor: C.purple60,
      gradientKey: "purple",
      title: "Fragmented Processes",
      desc: "Manual workflows and siloed teams reduce throughput and create inconsistent outcomes.",
    },
    {
      icon: FaLock,
      iconColor: C.teal60,
      gradientKey: "teal",
      title: "Security & Compliance",
      desc: "Evolving regulatory requirements strain existing security postures and governance models.",
    },
    {
      icon: FaUsers,
      iconColor: C.blue60,
      gradientKey: "blue",
      title: "Talent & Skills Gap",
      desc: "Difficulty attracting and retaining engineers with modern cloud and AI competencies.",
    },
  ];

  const cardW = 4.1, cardH = 1.35;
  const cardGapX = 0.4, cardGapY = 0.2;
  const gridStartX = 0.7, gridStartY = 1.45;

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
    const vBar = await renderVerticalGradientBar(gradients[ch.gradientKey], 8, 260);
    s2.addImage({ data: vBar, x: cx, y: cy, w: 0.08, h: cardH });

    // Icon
    const iconData = await iconToBase64Png(ch.icon, "#" + ch.iconColor, 256);
    s2.addImage({
      data: iconData,
      x: cx + 0.22, y: cy + 0.2, w: 0.38, h: 0.38,
    });

    // Card title
    s2.addText(ch.title, {
      x: cx + 0.72, y: cy + 0.15, w: cardW - 0.92, h: 0.4,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    // Card description
    s2.addText(ch.desc, {
      x: cx + 0.72, y: cy + 0.58, w: cardW - 0.92, h: 0.7,
      fontSize: 11, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // SLIDE 3: Timeline — 3 Phase Cards with Arrow Connectors
  // ═══════════════════════════════════════════════════════════════════
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Section label
  s3.addText("ENGAGEMENT TIMELINE", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s3.addText("Phased Delivery Approach", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.45,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s3.addText("A structured methodology to deliver measurable value at each stage.", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  const phases = [
    {
      num: "1",
      title: "Discover & Assess",
      duration: "WEEKS 1 \u2013 4",
      bullets: [
        "Current-state architecture review",
        "Stakeholder interviews & alignment",
        "Gap analysis and risk assessment",
        "Transformation roadmap delivery",
      ],
    },
    {
      num: "2",
      title: "Design & Build",
      duration: "WEEKS 5 \u2013 12",
      bullets: [
        "Target-state architecture design",
        "Cloud migration planning",
        "Automation framework setup",
        "Pilot implementation & testing",
      ],
    },
    {
      num: "3",
      title: "Scale & Optimize",
      duration: "WEEKS 13 \u2013 20",
      bullets: [
        "Full production deployment",
        "Team enablement & training",
        "Performance optimization",
        "Continuous improvement model",
      ],
    },
  ];

  const tlW = 2.75, tlH = 2.85;
  const tlGap = 0.45;
  const tlStartX = 0.7, tlStartY = 1.5;

  for (let i = 0; i < 3; i++) {
    const tx = tlStartX + i * (tlW + tlGap);
    const phase = phases[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: tlH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top gradient accent bar
    const topBar = await renderGradientBar(gradients.teal, 400, 8, 0);
    s3.addImage({ data: topBar, x: tx, y: tlStartY, w: tlW, h: 0.08 });

    // Number circle (centered)
    s3.addShape(pres.shapes.OVAL, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.22,
      w: 0.48, h: 0.48,
      fill: { color: C.teal60 },
    });

    s3.addText(phase.num, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.22,
      w: 0.48, h: 0.48,
      fontSize: 20, fontFace: "Arial",
      color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0,
    });

    // Phase title (centered)
    s3.addText(phase.title, {
      x: tx + 0.2, y: tlStartY + 0.82, w: tlW - 0.4, h: 0.35,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, align: "center", margin: 0,
    });

    // Duration label (centered, small uppercase)
    s3.addText(phase.duration, {
      x: tx + 0.2, y: tlStartY + 1.14, w: tlW - 0.4, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: C.gray50, bold: true, align: "center", charSpacing: 2, margin: 0,
    });

    // Bullet items
    const bullets = phase.bullets.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < phase.bullets.length - 1,
        fontSize: 10, color: C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s3.addText(bullets, {
      x: tx + 0.25, y: tlStartY + 1.48, w: tlW - 0.5, h: 1.3,
      fontFace: "Arial", valign: "top", margin: 0,
    });

    // Arrow connector between cards (except last)
    if (i < 2) {
      const arrowIcon = await iconToBase64Png(FaArrowRight, "#" + C.teal60, 256);
      s3.addImage({
        data: arrowIcon,
        x: tx + tlW + tlGap / 2 - 0.14,
        y: tlStartY + tlH / 2 - 0.14,
        w: 0.28, h: 0.28,
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // SLIDE 4: Outcomes with Bottom Callout Bar
  // ═══════════════════════════════════════════════════════════════════
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Section label
  s4.addText("EXPECTED OUTCOMES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.green60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s4.addText("Measurable Business Impact", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.45,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s4.addText("Delivering quantifiable results across cost, speed, quality, and risk.", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Outcome cards — left column (stacked horizontal cards)
  const outcomes = [
    {
      icon: FaChartLine,
      iconColor: C.green60,
      gradientKey: "green",
      title: "Cost Optimization",
      desc: "30-40% reduction in infrastructure and operational costs through cloud migration and automation.",
    },
    {
      icon: FaRocket,
      iconColor: C.blue60,
      gradientKey: "blue",
      title: "Accelerated Delivery",
      desc: "5x faster release cycles with modern CI/CD pipelines and Infrastructure as Code practices.",
    },
    {
      icon: FaShieldAlt,
      iconColor: C.purple60,
      gradientKey: "purple",
      title: "Enhanced Security",
      desc: "Zero-trust architecture with automated compliance checks and policy-as-code enforcement.",
    },
    {
      icon: FaClock,
      iconColor: C.teal60,
      gradientKey: "teal",
      title: "Operational Resilience",
      desc: "99.9% uptime with self-healing infrastructure, automated recovery, and proactive monitoring.",
    },
  ];

  const ocCardW = 4.1, ocCardH = 0.95;
  const ocGapY = 0.12;
  const ocStartX = 0.7, ocStartY = 1.45;

  for (let i = 0; i < 4; i++) {
    const oy = ocStartY + i * (ocCardH + ocGapY);
    const oc = outcomes[i];

    // Card background
    s4.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX, y: oy, w: ocCardW, h: ocCardH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left gradient accent bar
    const vBar = await renderVerticalGradientBar(gradients[oc.gradientKey], 8, 260);
    s4.addImage({ data: vBar, x: ocStartX, y: oy, w: 0.08, h: ocCardH });

    // Icon
    const iconData = await iconToBase64Png(oc.icon, "#" + oc.iconColor, 256);
    s4.addImage({
      data: iconData,
      x: ocStartX + 0.22, y: oy + 0.28, w: 0.38, h: 0.38,
    });

    // Card title
    s4.addText(oc.title, {
      x: ocStartX + 0.72, y: oy + 0.08, w: ocCardW - 0.92, h: 0.35,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    // Card description
    s4.addText(oc.desc, {
      x: ocStartX + 0.72, y: oy + 0.45, w: ocCardW - 0.92, h: 0.45,
      fontSize: 10, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Right column — metric callouts
  const metrics = [
    { value: "30-40%", label: "Cost Reduction", accent: C.green60 },
    { value: "5x", label: "Faster Delivery", accent: C.blue60 },
    { value: "99.9%", label: "Uptime SLA", accent: C.purple60 },
    { value: "60%", label: "Less Manual Effort", accent: C.teal60 },
  ];

  const statStartX = 5.2, statW = 4.1;
  const statH = 0.95, statGapY = 0.12, statStartY = 1.45;

  for (let i = 0; i < 4; i++) {
    const sy = statStartY + i * (statH + statGapY);
    const m = metrics[i];

    // Card background
    s4.addShape(pres.shapes.RECTANGLE, {
      x: statStartX, y: sy, w: statW, h: statH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left accent bar (solid)
    s4.addShape(pres.shapes.RECTANGLE, {
      x: statStartX, y: sy, w: 0.06, h: statH,
      fill: { color: m.accent },
    });

    // Big metric number
    s4.addText(m.value, {
      x: statStartX + 0.2, y: sy, w: 1.4, h: statH,
      fontSize: 28, fontFace: "Arial Black",
      color: m.accent, bold: true, valign: "middle", margin: 0,
    });

    // Metric label
    s4.addText(m.label, {
      x: statStartX + 1.65, y: sy, w: statW - 1.85, h: statH,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });
  }

  // Bottom callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.85, w: 8.6, h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const calloutIcon = await iconToBase64Png(FaCheckCircle, "#" + C.blue60, 256);
  s4.addImage({
    data: calloutIcon, x: 0.9, y: 4.93, w: 0.32, h: 0.32,
  });

  s4.addText([
    { text: "Ready to start: ", options: { bold: true, color: C.gray100 } },
    { text: "Our team can begin the Discovery phase within 2 weeks of engagement approval.", options: { color: C.gray70 } },
  ], {
    x: 1.35, y: 4.85, w: 7.75, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ═══════════════════════════════════════════════════════════════════
  // Write PPTX
  // ═══════════════════════════════════════════════════════════════════
  const outputPath = ".claude/skills/ibm-deck-workspace/iteration-1/4-slide-proposal/with_skill/outputs/digital-transformation.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log(`PPTX written to: ${outputPath}`);
}

buildPresentation().catch(console.error);
