import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaExclamationTriangle,
  FaLock,
  FaClock,
  FaChartLine,
  FaRocket,
  FaShieldAlt,
  FaCogs,
  FaUsers,
  FaClipboardCheck,
  FaServer,
  FaKey,
  FaHandshake,
} from "react-icons/fa";

// --- Icon helpers ---
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

// --- SVG gradient helpers ---
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

// --- Carbon Design Tokens (NO "#" prefix) ---
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
  type: "outer",
  color: "000000",
  blur: 8,
  offset: 2,
  angle: 135,
  opacity: 0.08,
});

// --- Image paths (relative to repo root) ---
const OUTPUTS_DIR =
  ".claude/skills/ibm-deck-workspace/iteration-1/eval-hybrid-proposal/with_skill/outputs";

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "Technology Services";
  pres.title = "Technology Services Proposal";

  // =========================================================================
  // SLIDE 1 — Title (HTML capture, full-bleed PNG)
  // =========================================================================
  const s1 = pres.addSlide();
  s1.addImage({
    path: `${OUTPUTS_DIR}/slide-title.png`,
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
  });

  // =========================================================================
  // SLIDE 2 — The Challenge (2x2 grid of risk/challenge cards)
  // =========================================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("CHALLENGES", {
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
  s2.addText("The Challenge", {
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
    "Critical risks that demand a structured technology services approach",
    {
      x: 0.7,
      y: 1.0,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // Challenge cards data
  const challenges = [
    {
      icon: FaExclamationTriangle,
      title: "Security Vulnerabilities",
      desc: "Legacy systems expose critical attack surfaces with outdated patches and unmonitored access points.",
      gradient: ["#A01520", "#DA1E28", "#FF4D55"],
      accent: C.red60,
    },
    {
      icon: FaClock,
      title: "Operational Inefficiency",
      desc: "Manual processes and siloed workflows create bottlenecks, slowing delivery and increasing error rates.",
      gradient: ["#8A6800", "#B28600", "#F59E0B"],
      accent: C.yellow50,
    },
    {
      icon: FaLock,
      title: "Compliance Gaps",
      desc: "Evolving regulatory requirements outpace current governance frameworks, risking audit failures.",
      gradient: ["#627EEF", "#8A3FFC", "#D946EF"],
      accent: C.purple60,
    },
    {
      icon: FaChartLine,
      title: "Scalability Constraints",
      desc: "Current architecture limits growth capacity, unable to handle projected demand without significant rework.",
      gradient: ["#007D79", "#009D9A", "#2DD4BF"],
      accent: C.teal60,
    },
  ];

  const cardW = 4.1,
    cardH = 1.35;
  const cardGapX = 0.4,
    cardGapY = 0.2;
  const gridStartX = 0.7,
    gridStartY = 1.5;

  for (let i = 0; i < challenges.length; i++) {
    const ch = challenges[i];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + cardGapX);
    const cy = gridStartY + row * (cardH + cardGapY);

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: cardW,
      h: cardH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Gradient left accent bar
    const vBar = await renderVerticalGradientBar(ch.gradient, 8, 260);
    s2.addImage({ data: vBar, x: cx, y: cy, w: 0.08, h: cardH });

    // Icon
    const iconData = await iconToBase64Png(ch.icon, "#" + ch.accent, 256);
    s2.addImage({
      data: iconData,
      x: cx + 0.22,
      y: cy + 0.2,
      w: 0.38,
      h: 0.38,
    });

    // Card title
    s2.addText(ch.title, {
      x: cx + 0.72,
      y: cy + 0.12,
      w: cardW - 0.95,
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
      x: cx + 0.72,
      y: cy + 0.55,
      w: cardW - 0.95,
      h: 0.7,
      fontSize: 11,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.55,
    w: 8.6,
    h: 0.55,
    fill: { color: "FFF0F0" },
    line: { color: C.red60, width: 1 },
  });

  const calloutIcon2 = await iconToBase64Png(
    FaExclamationTriangle,
    "#" + C.red60,
    256
  );
  s2.addImage({
    data: calloutIcon2,
    x: 0.9,
    y: 4.62,
    w: 0.35,
    h: 0.35,
  });

  s2.addText(
    [
      {
        text: "Impact: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "Without intervention, these challenges compound — increasing cost, risk, and time-to-market.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.4,
      y: 4.55,
      w: 7.7,
      h: 0.55,
      fontSize: 11,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =========================================================================
  // SLIDE 3 — Value Proposition (3-column pillar layout)
  // =========================================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Section label
  s3.addText("VALUE PROPOSITION", {
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
  s3.addText("Value Proposition", {
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
  s3.addText("What our technology services engagement delivers", {
    x: 0.7,
    y: 1.0,
    w: 8.6,
    h: 0.3,
    fontSize: 12,
    fontFace: "Arial",
    color: C.gray70,
    margin: 0,
  });

  const pillars = [
    {
      icon: FaRocket,
      title: "Accelerated Delivery",
      items: [
        "Automated CI/CD pipelines",
        "Infrastructure as Code adoption",
        "Reduced deployment cycles",
        "Faster time-to-market",
      ],
      gradient: ["#0043CE", "#0F62FE", "#4589FF"],
      accent: C.blue60,
    },
    {
      icon: FaShieldAlt,
      title: "Enhanced Security",
      items: [
        "Zero-trust architecture",
        "Automated compliance checks",
        "Secrets management",
        "Continuous vulnerability scanning",
      ],
      gradient: ["#627EEF", "#8A3FFC", "#D946EF"],
      accent: C.purple60,
    },
    {
      icon: FaCogs,
      title: "Operational Excellence",
      items: [
        "Standardized workflows",
        "Self-service provisioning",
        "Observability and monitoring",
        "Cost optimization controls",
      ],
      gradient: ["#007D79", "#009D9A", "#2DD4BF"],
      accent: C.teal60,
    },
  ];

  const pillarW = 2.75,
    pillarH = 2.85;
  const pillarGap = 0.45;
  const pStartX = 0.7,
    pStartY = 1.55;

  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    const px = pStartX + i * (pillarW + pillarGap);

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: pStartY,
      w: pillarW,
      h: pillarH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Gradient top accent bar
    const bar = await renderGradientBar(p.gradient, 400, 8, 0);
    s3.addImage({ data: bar, x: px, y: pStartY, w: pillarW, h: 0.08 });

    // Icon
    const iconData = await iconToBase64Png(p.icon, "#" + p.accent, 256);
    s3.addImage({
      data: iconData,
      x: px + 0.25,
      y: pStartY + 0.25,
      w: 0.42,
      h: 0.42,
    });

    // Pillar title
    s3.addText(p.title, {
      x: px + 0.25,
      y: pStartY + 0.78,
      w: pillarW - 0.5,
      h: 0.35,
      fontSize: 15,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      margin: 0,
    });

    // Bullet items
    const bullets = p.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < p.items.length - 1,
        fontSize: 11,
        color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s3.addText(bullets, {
      x: px + 0.25,
      y: pStartY + 1.2,
      w: pillarW - 0.5,
      h: 1.5,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.65,
    w: 8.6,
    h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const calloutIcon3 = await iconToBase64Png(
    FaHandshake,
    "#" + C.blue60,
    256
  );
  s3.addImage({
    data: calloutIcon3,
    x: 0.9,
    y: 4.72,
    w: 0.35,
    h: 0.35,
  });

  s3.addText(
    [
      {
        text: "Outcome: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "A resilient, scalable technology foundation that drives measurable business value.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.4,
      y: 4.65,
      w: 7.7,
      h: 0.55,
      fontSize: 11,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =========================================================================
  // SLIDE 4 — Pre-requisites (4 narrow columns, last card highlighted)
  // =========================================================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Section label
  s4.addText("PRE-REQUISITES", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: C.teal60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  // Title
  s4.addText("Pre-requisites", {
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
  s4.addText("What needs to be in place before the engagement begins", {
    x: 0.7,
    y: 1.0,
    w: 8.6,
    h: 0.3,
    fontSize: 12,
    fontFace: "Arial",
    color: C.gray70,
    margin: 0,
  });

  const prereqs = [
    {
      icon: FaUsers,
      title: "Stakeholder Alignment",
      items: [
        "Executive sponsor identified",
        "Cross-functional team formed",
        "Success metrics defined",
        "Communication plan agreed",
      ],
      gradient: ["#0043CE", "#0F62FE", "#4589FF"],
      accent: C.blue60,
    },
    {
      icon: FaServer,
      title: "Environment Access",
      items: [
        "Cloud account provisioned",
        "Network connectivity verified",
        "CI/CD tooling available",
        "Monitoring stack deployed",
      ],
      gradient: ["#627EEF", "#8A3FFC", "#D946EF"],
      accent: C.purple60,
    },
    {
      icon: FaClipboardCheck,
      title: "Documentation",
      items: [
        "Architecture diagrams current",
        "Runbooks reviewed",
        "Change management process",
        "Incident response playbook",
      ],
      gradient: ["#0E6027", "#198038", "#34D478"],
      accent: C.green60,
    },
    {
      icon: FaKey,
      title: "Security Baseline",
      items: [
        "Identity provider configured",
        "SSO and MFA enforced",
        "Secrets vault operational",
        "Audit logging enabled",
      ],
      gradient: ["#007D79", "#009D9A", "#2DD4BF"],
      accent: C.teal60,
      required: true,
    },
  ];

  const preW = 2.0,
    preH = 2.95;
  const preGap = 0.27;
  const preStartX = 0.7,
    preStartY = 1.5;

  for (let i = 0; i < prereqs.length; i++) {
    const pr = prereqs[i];
    const isMandatory = pr.required === true;
    const cx = preStartX + i * (preW + preGap);
    const cy = preStartY;

    // Card background (tinted + bordered if mandatory)
    s4.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: preW,
      h: preH,
      fill: { color: isMandatory ? "E8F7F7" : C.gray10 },
      line: isMandatory ? { color: pr.accent, width: 1.5 } : undefined,
      shadow: cardShadow(),
    });

    // Gradient top accent bar
    const bar = await renderGradientBar(pr.gradient, 400, 8, 0);
    s4.addImage({ data: bar, x: cx, y: cy, w: preW, h: 0.08 });

    // REQUIRED badge (only on mandatory card)
    if (isMandatory) {
      s4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx + preW - 1.15,
        y: cy + 0.15,
        w: 0.95,
        h: 0.26,
        fill: { color: pr.accent },
        rectRadius: 0.05,
      });
      s4.addText("REQUIRED", {
        x: cx + preW - 1.15,
        y: cy + 0.15,
        w: 0.95,
        h: 0.26,
        fontSize: 8,
        fontFace: "Arial",
        color: C.white,
        bold: true,
        align: "center",
        valign: "middle",
        charSpacing: 1.5,
        margin: 0,
      });
    }

    // Icon
    const iconData = await iconToBase64Png(pr.icon, "#" + pr.accent, 256);
    s4.addImage({
      data: iconData,
      x: cx + 0.2,
      y: cy + 0.2,
      w: 0.38,
      h: 0.38,
    });

    // Card title
    s4.addText(pr.title, {
      x: cx + 0.2,
      y: cy + 0.7,
      w: preW - 0.4,
      h: 0.35,
      fontSize: 13,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      margin: 0,
    });

    // Bullet items
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
      x: cx + 0.2,
      y: cy + 1.15,
      w: preW - 0.4,
      h: 1.6,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.7,
    w: 8.6,
    h: 0.55,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  const calloutIcon4 = await iconToBase64Png(
    FaClipboardCheck,
    "#" + C.teal60,
    256
  );
  s4.addImage({
    data: calloutIcon4,
    x: 0.9,
    y: 4.77,
    w: 0.35,
    h: 0.35,
  });

  s4.addText(
    [
      {
        text: "Security Baseline is mandatory: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "All identity and secrets infrastructure must be operational before Day 1.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.4,
      y: 4.7,
      w: 7.7,
      h: 0.55,
      fontSize: 11,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =========================================================================
  // SLIDE 5 — Closing / Thank You (HTML capture, full-bleed PNG)
  // =========================================================================
  const s5 = pres.addSlide();
  s5.addImage({
    path: `${OUTPUTS_DIR}/slide-closing.png`,
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
  });

  // =========================================================================
  // Write PPTX
  // =========================================================================
  await pres.writeFile({
    fileName: `${OUTPUTS_DIR}/technology-services-proposal.pptx`,
  });
  console.log("Done — technology-services-proposal.pptx written.");
}

buildPresentation().catch(console.error);
