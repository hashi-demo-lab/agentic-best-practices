import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaShieldAlt,
  FaRocket,
  FaCogs,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaLightbulb,
  FaHandshake,
  FaUserTie,
  FaClipboardCheck,
  FaArrowRight,
  FaLock,
  FaCode,
  FaLayerGroup,
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

// --- Gradient SVG → PNG helpers (pptxgenjs v4 has no gradient fill support) ---
async function renderGradientTitle(text, gradientStops, width = 700, height = 120) {
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  const stops = gradientStops
    .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}"/>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0.3">${stops}</linearGradient></defs>
    <text x="0" y="${height * 0.75}" font-size="${height * 0.82}" font-weight="800" font-family="Arial,Helvetica,sans-serif" fill="url(#${gid})">${text}</text>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function renderGradientBar(colors, width = 396, height = 8, borderRadius = 16) {
  const gid = "gb" + Math.random().toString(36).slice(2, 8);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${colors[0]}"/><stop offset="50%" stop-color="${colors[1]}"/><stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient></defs>
    <rect width="${width}" height="${borderRadius > 0 ? borderRadius * 2 : height}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#${gid})"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// --- IBM Carbon Design Tokens ---
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

// --- Fresh shadow/option factory functions (pptxgenjs mutates objects) ---
const cardShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 8,
  offset: 2,
  angle: 135,
  opacity: 0.08,
});

const footerBarShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 4,
  offset: 1,
  angle: 270,
  opacity: 0.06,
});

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "HashiCorp Resident Technology Services";
  pres.title =
    "Resident Technology Services — AI-Driven Infrastructure";

  // =====================================================================
  // SLIDE 1: TITLE — full-bleed image from IBM light-theme HTML capture
  // =====================================================================
  const s1 = pres.addSlide();
  s1.addImage({
    path: "playgrounds/IBM/images/slide-rsa-title.png",
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
  });

  // =====================================================================
  // SLIDE 2: THE CHALLENGE
  // =====================================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("THE CHALLENGE", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.2,
    fontSize: 10,
    fontFace: "Arial",
    color: C.red60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  // Title (smaller to prevent wrapping/collision)
  s2.addText("AI for Infrastructure is High-Reward, High-Risk", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.4,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  // Subtitle
  s2.addText(
    "Enterprises need expert guidance to capture value while managing risk",
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

  // 4 risk cards in a 2x2 grid
  const challenges = [
    {
      icon: FaExclamationTriangle,
      iconColor: "#" + C.red60,
      accentColor: C.red60,
      gradientColors: ["#A01520", "#DA1E28", "#FF4D55"],
      title: "Security Risks",
      desc: "Overprivileged agents risk infrastructure destruction, secret leakage, and policy violations",
    },
    {
      icon: FaClock,
      iconColor: "#" + C.yellow50,
      accentColor: C.yellow50,
      gradientColors: ["#8A6800", "#B28600", "#F59E0B"],
      title: "Delivery Bottlenecks",
      desc: "Platform teams are capacity-constrained — module demand outpaces delivery by weeks",
    },
    {
      icon: FaCogs,
      iconColor: "#" + C.purple60,
      accentColor: C.purple60,
      gradientColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      title: "Workflow Immaturity",
      desc: "Traditional IaC workflows weren't designed for AI velocity — controls can't keep pace",
    },
    {
      icon: FaUsers,
      iconColor: "#" + C.teal60,
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      title: "Skill Gaps",
      desc: "App teams lack infrastructure expertise; platform teams lack AI workflow experience",
    },
  ];

  const cardW = 4.1;
  const cardH = 1.35;
  const cardGapX = 0.4;
  const cardGapY = 0.2;
  const gridStartX = 0.7;
  const gridStartY = 1.4;

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
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left accent (vertical gradient bar)
    const vBarGid = "vb" + Math.random().toString(36).slice(2, 8);
    const vBarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="260" viewBox="0 0 8 260">
  <defs><linearGradient id="${vBarGid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${ch.gradientColors[0]}"/>
    <stop offset="50%" stop-color="${ch.gradientColors[1]}"/>
    <stop offset="100%" stop-color="${ch.gradientColors[2]}"/>
  </linearGradient></defs>
  <rect width="8" height="260" fill="url(#${vBarGid})"/>
</svg>`;
    const vBarBuf = await sharp(Buffer.from(vBarSvg)).png().toBuffer();
    const vBarData = "image/png;base64," + vBarBuf.toString("base64");
    s2.addImage({ data: vBarData, x: cx, y: cy, w: 0.08, h: cardH });

    // Icon
    const iconData = await iconToBase64Png(ch.icon, ch.iconColor, 256);
    s2.addImage({
      data: iconData,
      x: cx + 0.2,
      y: cy + 0.2,
      w: 0.38,
      h: 0.38,
    });

    // Card title
    s2.addText(ch.title, {
      x: cx + 0.7,
      y: cy + 0.15,
      w: cardW - 0.9,
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
      x: cx + 0.7,
      y: cy + 0.6,
      w: cardW - 0.9,
      h: 0.8,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout (positioned with safe margin)
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.55,
    w: 8.6,
    h: 0.5,
    fill: { color: "FFF8F0" },
    line: { color: C.yellow50, width: 1 },
  });

  const bulbIcon = await iconToBase64Png(FaLightbulb, "#" + C.yellow50, 256);
  s2.addImage({
    data: bulbIcon,
    x: 0.9,
    y: 4.62,
    w: 0.3,
    h: 0.3,
  });
  s2.addText(
    "A resident technology services engagement helps establish the mature practices and strong controls required for safe AI adoption",
    {
      x: 1.35,
      y: 4.55,
      w: 7.8,
      h: 0.5,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      valign: "middle",
      margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 3: RESIDENT TECHNOLOGY SERVICES VALUE PROPOSITION
  // =====================================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  s3.addText("RESIDENT TECHNOLOGY SERVICES", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.2,
    fontSize: 10,
    fontFace: "Arial",
    color: C.teal60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s3.addText("What Your Dedicated Expert Delivers", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.45,
    fontSize: 26,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s3.addText(
    "Trusted advisor, bridging the gap between AI capability and enterprise readiness",
    {
      x: 0.7,
      y: 1.1,
      w: 8.6,
      h: 0.35,
      fontSize: 13,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // Three value pillars as tall cards
  const pillars = [
    {
      icon: FaShieldAlt,
      iconColor: "#" + C.green60,
      accentColor: C.green60,
      gradientColors: ["#0E6027", "#198038", "#34D478"],
      title: "Guardrails & Controls",
      items: [
        "RBAC and agent isolation patterns",
        "Secrets management with Vault Radar",
        "Policy-as-code enforcement",
        "Human-in-loop gated approvals",
      ],
    },
    {
      icon: FaRocket,
      iconColor: "#" + C.blue60,
      accentColor: C.blue60,
      gradientColors: ["#0043CE", "#0F62FE", "#4589FF"],
      title: "Validated Workflows",
      items: [
        "Spec-driven development methodology",
        "Consumer composition from registry",
        "Module authoring acceleration",
        "Provider lifecycle development",
      ],
    },
    {
      icon: FaChartLine,
      iconColor: "#" + C.purple60,
      accentColor: C.purple60,
      gradientColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      title: "Accelerated Outcomes",
      items: [
        "Module delivery: weeks to hours",
        "Provider development: months to days",
        "Composition: hours to minutes",
        "Team upskilling via paired sessions",
      ],
    },
  ];

  const pillarW = 2.75;
  const pillarH = 2.95;
  const pillarGap = 0.45;
  const pillarStartX = 0.7;
  const pillarStartY = 1.65;

  for (let i = 0; i < pillars.length; i++) {
    const px = pillarStartX + i * (pillarW + pillarGap);
    const p = pillars[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: pillarStartY,
      w: pillarW,
      h: pillarH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top accent bar (gradient)
    const barImg = await renderGradientBar(p.gradientColors, 400, 8, 0);
    s3.addImage({ data: barImg, x: px, y: pillarStartY, w: pillarW, h: 0.08 });

    // Icon
    const iconData = await iconToBase64Png(p.icon, p.iconColor, 256);
    s3.addImage({
      data: iconData,
      x: px + 0.25,
      y: pillarStartY + 0.25,
      w: 0.42,
      h: 0.42,
    });

    // Pillar title
    s3.addText(p.title, {
      x: px + 0.25,
      y: pillarStartY + 0.78,
      w: pillarW - 0.5,
      h: 0.35,
      fontSize: 14,
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
      y: pillarStartY + 1.2,
      w: pillarW - 0.5,
      h: 1.8,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });
  }

  // =====================================================================
  // SLIDE 4: PROVEN USE CASES & METRICS
  // =====================================================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  s4.addText("PROVEN RESULTS", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.2,
    fontSize: 10,
    fontFace: "Arial",
    color: C.green60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s4.addText("Validated Use Cases Across Three Personas", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.4,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s4.addText(
    "Your resident technology services team guides architecture of battle-tested workflows with measurable acceleration",
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

  // Three use-case cards — outcome-focused, no metrics
  const useCases = [
    {
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      persona: "APPLICATION TEAM",
      title: "Consumer Workflow",
      desc: "Deploy and manage infrastructure using natural language from approved private registry modules",
      outcomes: [
        "Self-service provisioning via AI",
        "Guardrailed module consumption",
        "Reduced ticket volume to platform team",
      ],
    },
    {
      accentColor: C.purple60,
      gradientColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      persona: "PLATFORM TEAM",
      title: "Module Authoring",
      desc: "Generate compliant, tested Terraform modules with spec-driven development and automated validation",
      outcomes: [
        "AI-assisted module scaffolding",
        "Automated testing and compliance checks",
        "Consistent module standards at scale",
      ],
    },
    {
      accentColor: C.magenta60,
      gradientColors: ["#9F1853", "#D02670", "#FF7EB6"],
      persona: "ECOSYSTEM",
      title: "Provider Lifecycle",
      desc: "Accelerate Terraform provider development with TDD, API validation, and SDK migration support",
      outcomes: [
        "Faster provider development cycle",
        "Automated SDK migration support",
        "Validated API coverage",
      ],
    },
  ];

  const ucW = 2.75;
  const ucH = 3.0;
  const ucGap = 0.45;
  const ucStartX = 0.7;
  const ucStartY = 1.45;

  for (let i = 0; i < useCases.length; i++) {
    const ux = ucStartX + i * (ucW + ucGap);
    const uc = useCases[i];

    // Card bg
    s4.addShape(pres.shapes.RECTANGLE, {
      x: ux,
      y: ucStartY,
      w: ucW,
      h: ucH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top accent (gradient bar)
    const barImg4 = await renderGradientBar(uc.gradientColors, 400, 8, 0);
    s4.addImage({ data: barImg4, x: ux, y: ucStartY, w: ucW, h: 0.08 });

    // Persona label
    s4.addText(uc.persona, {
      x: ux + 0.2,
      y: ucStartY + 0.2,
      w: ucW - 0.4,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      color: uc.accentColor,
      bold: true,
      charSpacing: 2,
      margin: 0,
    });

    // Title
    s4.addText(uc.title, {
      x: ux + 0.2,
      y: ucStartY + 0.5,
      w: ucW - 0.4,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      margin: 0,
    });

    // Description
    s4.addText(uc.desc, {
      x: ux + 0.2,
      y: ucStartY + 0.85,
      w: ucW - 0.4,
      h: 0.65,
      fontSize: 10,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });

    // Outcome bullets
    const bullets = uc.outcomes.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < uc.outcomes.length - 1,
        fontSize: 10,
        color: C.gray100,
        paraSpaceAfter: 4,
      },
    }));

    s4.addText(bullets, {
      x: ux + 0.2,
      y: ucStartY + 1.6,
      w: ucW - 0.4,
      h: 1.2,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });
  }

  // =====================================================================
  // SLIDE 5: ENGAGEMENT TIMELINE (3 STAGES)
  // =====================================================================
  const s5 = pres.addSlide();
  s5.background = { color: C.white };

  s5.addText("ENGAGEMENT TIMELINE", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.2,
    fontSize: 10,
    fontFace: "Arial",
    color: C.blue60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s5.addText("Resident Technology Services: 3 Stages", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.4,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s5.addText(
    "A phased engagement that builds capability progressively \u2014 from assessment to autonomous operation",
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

  // Timeline phases — 3 wide cards for Stage 1, Stage 2, Stage 3
  const timelinePhases = [
    {
      num: "1",
      title: "Assess & Establish",
      subtitle: "STAGE 1",
      accentColor: C.blue60,
      gradientColors: ["#0043CE", "#0F62FE", "#4589FF"],
      items: [
        "IaC maturity assessment",
        "Guardrails and governance setup",
        "DevContainer and sandbox config",
        "Target first use case",
      ],
    },
    {
      num: "2",
      title: "Enable & Accelerate",
      subtitle: "STAGE 2",
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      items: [
        "Expand to additional use cases",
        "Team enablement workshops",
        "Spec-driven methodology adoption",
        "CI/CD and policy integration",
      ],
    },
    {
      num: "3",
      title: "Scale & Handoff",
      subtitle: "STAGE 3",
      accentColor: C.green60,
      gradientColors: ["#0E6027", "#198038", "#34D478"],
      items: [
        "Cross-team adoption patterns",
        "Document runbooks and standards",
        "Measure outcomes against KPIs",
        "Transition to self-sufficient ops",
      ],
    },
  ];

  const tlW = 2.75;
  const tlH = 3.0;
  const tlGap = 0.45;
  const tlStartX = 0.7;
  const tlStartY = 1.5;

  for (let i = 0; i < timelinePhases.length; i++) {
    const tx = tlStartX + i * (tlW + tlGap);
    const tp = timelinePhases[i];

    // Card bg
    s5.addShape(pres.shapes.RECTANGLE, {
      x: tx,
      y: tlStartY,
      w: tlW,
      h: tlH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top accent bar (gradient)
    const barImg5 = await renderGradientBar(tp.gradientColors, 400, 8, 0);
    s5.addImage({ data: barImg5, x: tx, y: tlStartY, w: tlW, h: 0.08 });

    // Number circle
    s5.addShape(pres.shapes.OVAL, {
      x: tx + tlW / 2 - 0.24,
      y: tlStartY + 0.2,
      w: 0.48,
      h: 0.48,
      fill: { color: tp.accentColor },
    });

    s5.addText(tp.num, {
      x: tx + tlW / 2 - 0.24,
      y: tlStartY + 0.2,
      w: 0.48,
      h: 0.48,
      fontSize: 20,
      fontFace: "Arial",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    // Phase title
    s5.addText(tp.title, {
      x: tx + 0.2,
      y: tlStartY + 0.8,
      w: tlW - 0.4,
      h: 0.35,
      fontSize: 15,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      align: "center",
      margin: 0,
    });

    // Stage label
    s5.addText(tp.subtitle, {
      x: tx + 0.2,
      y: tlStartY + 1.1,
      w: tlW - 0.4,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      color: C.gray50,
      bold: true,
      align: "center",
      charSpacing: 2,
      margin: 0,
    });

    // Bullet items
    const bullets = tp.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < tp.items.length - 1,
        fontSize: 10,
        color: C.gray70,
        paraSpaceAfter: 4,
      },
    }));

    s5.addText(bullets, {
      x: tx + 0.2,
      y: tlStartY + 1.4,
      w: tlW - 0.4,
      h: 1.45,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });

    // Arrow connector between cards (except last)
    if (i < timelinePhases.length - 1) {
      const arrowIcon = await iconToBase64Png(
        FaArrowRight,
        "#" + tp.accentColor,
        256
      );
      s5.addImage({
        data: arrowIcon,
        x: tx + tlW + tlGap / 2 - 0.14,
        y: tlStartY + tlH / 2 - 0.14,
        w: 0.28,
        h: 0.28,
      });
    }
  }

  // Bottom bar
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.7,
    w: 8.6,
    h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const handshakeIcon = await iconToBase64Png(
    FaHandshake,
    "#" + C.blue60,
    256
  );
  s5.addImage({
    data: handshakeIcon,
    x: 0.9,
    y: 4.77,
    w: 0.35,
    h: 0.35,
  });

  s5.addText(
    [
      {
        text: "Trusted Advisor: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "Collaborate with your team for the full engagement. Candid feedback, strategic guidance, and a clear path to scale.",
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

  // =====================================================================
  // SLIDE 6: EXPECTED OUTCOMES
  // =====================================================================
  const s6 = pres.addSlide();
  s6.background = { color: C.white };

  s6.addText("EXPECTED OUTCOMES", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.2,
    fontSize: 10,
    fontFace: "Arial",
    color: C.green60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s6.addText("What You Walk Away With", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.4,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s6.addText(
    "Measurable outcomes delivered across governance, velocity, and team capability",
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

  // Two-column layout: left = outcome list, right = big stats
  // Left column: outcome cards
  const outcomes = [
    {
      icon: FaShieldAlt,
      iconColor: "#" + C.green60,
      title: "Production-Ready Guardrails",
      desc: "RBAC, policy-as-code, secrets management, and agent isolation configured and validated",
    },
    {
      icon: FaRocket,
      iconColor: "#" + C.blue60,
      title: "Workflow Execution",
      desc: "Drive AI transformation for IaC with proven workflows",
    },
    {
      icon: FaClipboardCheck,
      iconColor: "#" + C.teal60,
      title: "Documented Standards",
      desc: "Runbooks, patterns, and best practices codified for repeatable adoption",
    },
    {
      icon: FaUsers,
      iconColor: "#" + C.purple60,
      title: "Enabled Teams",
      desc: "Your engineers trained on spec-driven development and agentic workflows",
    },
  ];

  const ocCardW = 4.5;
  const ocCardH = 0.68;
  const ocGap = 0.1;
  const ocStartX = 0.7;
  const ocStartY = 1.45;

  for (let i = 0; i < outcomes.length; i++) {
    const oy = ocStartY + i * (ocCardH + ocGap);
    const oc = outcomes[i];

    // Card bg
    s6.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX,
      y: oy,
      w: ocCardW,
      h: ocCardH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Icon
    const iconData = await iconToBase64Png(oc.icon, oc.iconColor, 256);
    s6.addImage({
      data: iconData,
      x: ocStartX + 0.15,
      y: oy + 0.12,
      w: 0.38,
      h: 0.38,
    });

    // Title
    s6.addText(oc.title, {
      x: ocStartX + 0.65,
      y: oy + 0.02,
      w: ocCardW - 0.85,
      h: 0.28,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Description
    s6.addText(oc.desc, {
      x: ocStartX + 0.65,
      y: oy + 0.32,
      w: ocCardW - 0.85,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Right column: outcome themes (speed, risk, cost)
  const outcomeThemes = [
    {
      icon: FaRocket,
      iconColor: "#" + C.teal60,
      title: "Speed",
      desc: "Accelerate module delivery and reduce provisioning lead times from days to minutes",
      accent: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
    },
    {
      icon: FaShieldAlt,
      iconColor: "#" + C.blue60,
      title: "Risk",
      desc: "Eliminate misconfigurations before they reach production with automated policy enforcement",
      accent: C.blue60,
      gradientColors: ["#0043CE", "#0F62FE", "#4589FF"],
    },
    {
      icon: FaClipboardCheck,
      iconColor: "#" + C.green60,
      title: "Cost",
      desc: "Reduce manual review overhead and right-size infrastructure with AI-driven optimization",
      accent: C.green60,
      gradientColors: ["#0E6027", "#198038", "#34D478"],
    },
  ];

  const themeStartX = 5.6;
  const themeW = 4.0;
  const themeH = 0.9;
  const themeGap = 0.12;
  const themeStartY = 1.45;

  for (let i = 0; i < outcomeThemes.length; i++) {
    const ty = themeStartY + i * (themeH + themeGap);
    const th = outcomeThemes[i];

    // Card bg
    s6.addShape(pres.shapes.RECTANGLE, {
      x: themeStartX,
      y: ty,
      w: themeW,
      h: themeH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left accent (vertical gradient PNG)
    const vGid = "vg" + Math.random().toString(36).slice(2, 8);
    const vSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="200" viewBox="0 0 8 200">
      <defs><linearGradient id="${vGid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${th.gradientColors[0]}"/>
        <stop offset="50%" stop-color="${th.gradientColors[1]}"/>
        <stop offset="100%" stop-color="${th.gradientColors[2]}"/>
      </linearGradient></defs>
      <rect width="8" height="200" fill="url(#${vGid})"/>
    </svg>`;
    const vBuf = await sharp(Buffer.from(vSvg)).png().toBuffer();
    const vData = "image/png;base64," + vBuf.toString("base64");
    s6.addImage({ data: vData, x: themeStartX, y: ty, w: 0.08, h: themeH });

    // Icon
    const themeIcon = await iconToBase64Png(th.icon, th.iconColor, 256);
    s6.addImage({
      data: themeIcon,
      x: themeStartX + 0.2,
      y: ty + 0.12,
      w: 0.38,
      h: 0.38,
    });

    // Title
    s6.addText(th.title, {
      x: themeStartX + 0.7,
      y: ty + 0.05,
      w: themeW - 0.9,
      h: 0.3,
      fontSize: 14,
      fontFace: "Arial Black",
      color: th.accent,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Description
    s6.addText(th.desc, {
      x: themeStartX + 0.7,
      y: ty + 0.38,
      w: themeW - 0.9,
      h: 0.45,
      fontSize: 10,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Bottom CTA bar
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.7,
    w: 8.6,
    h: 0.5,
    fill: { color: "F0FFF4" },
    line: { color: C.green60, width: 1 },
  });

  const checkBigIcon = await iconToBase64Png(FaCheckCircle, "#" + C.green60, 256);
  s6.addImage({
    data: checkBigIcon,
    x: 0.9,
    y: 4.77,
    w: 0.3,
    h: 0.3,
  });

  s6.addText(
    [
      {
        text: "Ready to start? ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "Partner with HashiCorp to shape your AI-driven IaC roadmap and implement your first use case with dedicated expert guidance.",
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
  // SLIDE 7: STRATEGIC IMPACT — native editable slide with gradient PNGs
  // =====================================================================
  const s7 = pres.addSlide();
  s7.background = { color: C.white };

  const px7 = (v) => v / 192; // 1920px = 10"

  // Header — title wraps to 2 lines, needs h=px7(130) for clearance
  s7.addText("STRATEGIC IMPACT", {
    x: px7(80), y: px7(40), w: 5, h: px7(20),
    fontSize: 10, fontFace: "Arial", color: "996f00",
    bold: true, charSpacing: 3, margin: 0,
  });

  s7.addText("How Resident Technology Services Creates Compounding Value", {
    x: px7(80), y: px7(64), w: px7(1760), h: px7(130),
    fontSize: 22, fontFace: "Arial", color: C.gray100, bold: true, margin: 0,
  });

  s7.addText("Each capability unlocks the next \u2014 building momentum across your organization", {
    x: px7(80), y: px7(200), w: px7(1760), h: px7(30),
    fontSize: 11.5, fontFace: "Arial", color: C.gray70, margin: 0,
  });

  // Card layout constants — pushed down to accommodate taller header
  const s7svgTop = px7(280);
  const s7svgLeft = px7(80);
  const s7cardW = px7(396);
  const s7cardH = px7(540);
  const s7accentH = px7(8);
  const s7cardXOffsets = [22, 462, 902, 1342];

  const s7cards = [
    {
      num: "01", title: "Establish", subtitle: "Guardrails & Controls",
      items: ["RBAC and agent isolation", "Secrets management", "Policy-as-code enforcement", "Human-in-loop approvals"],
      outcome: "Zero unreviewed changes\nreach production",
      ac1: "627EEF", ac2: "8A3FFC", ac3: "D946EF",
      numColor: "8A3FFC", outcomeColor: "6929C4", divColor: "C4B0FF", bgColor: "F2EEFF", arrowColor: "8A3FFC",
    },
    {
      num: "02", title: "Enable", subtitle: "Self-Service Infra",
      items: ["Consumer workflow patterns", "Natural language provisioning", "Registry-backed modules", "Guardrailed consumption"],
      outcome: "Teams provision in minutes,\nnot days",
      ac1: "007D79", ac2: "009D9A", ac3: "2DD4BF",
      numColor: "009D9A", outcomeColor: "005D5D", divColor: "A0DCD9", bgColor: "EBF8F7", arrowColor: "009D9A",
    },
    {
      num: "03", title: "Accelerate", subtitle: "Pattern Authoring",
      items: ["Spec-driven development", "AI-assisted module creation", "Automated test generation", "Cross-team module sharing"],
      outcome: "Module delivery:\nweeks \u2192 hours",
      ac1: "0E6027", ac2: "198038", ac3: "34D478",
      numColor: "198038", outcomeColor: "0E6027", divColor: "A0D4AC", bgColor: "EFF7F0", arrowColor: "198038",
    },
    {
      num: "04", title: "Scale", subtitle: "Organization-Wide",
      items: ["Cross-team adoption", "Consistent standards everywhere", "Self-sufficient operations", "Measurable ROI"],
      outcome: "Every team benefits\nfrom every pattern",
      ac1: "8A6800", ac2: "B28600", ac3: "F59E0B",
      numColor: "B28600", outcomeColor: "7A5800", divColor: "E0C878", bgColor: "FFF9EC", arrowColor: "B28600",
    },
  ];

  for (let i = 0; i < s7cards.length; i++) {
    const c = s7cards[i];
    const cx = s7svgLeft + px7(s7cardXOffsets[i]);
    const cy = s7svgTop + px7(10);

    // Card background
    s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w: s7cardW, h: s7cardH,
      rectRadius: 0.08, fill: { color: c.bgColor }, shadow: cardShadow(),
    });

    // Gradient accent bar (PNG)
    const barImg = await renderGradientBar(["#" + c.ac1, "#" + c.ac2, "#" + c.ac3], 396, 8, 16);
    s7.addImage({ data: barImg, x: cx, y: cy, w: s7cardW, h: s7accentH });

    // Step number
    s7.addText(c.num, {
      x: cx + px7(34), y: cy + px7(36), w: px7(60), h: px7(22),
      fontSize: 9, fontFace: "Arial", color: c.numColor, bold: true, charSpacing: 2, margin: 0,
    });

    // Gradient hero title (PNG)
    const titleGrad = [
      { offset: 0, color: "#" + c.ac1 },
      { offset: 50, color: "#" + c.ac2 },
      { offset: 100, color: "#" + c.ac3 },
    ];
    const titleRW = c.title.length > 7 ? 900 : 700;
    const titleImg = await renderGradientTitle(c.title, titleGrad, titleRW, 120);
    const titleW = s7cardW - px7(50);
    const titleH = titleW * (120 / titleRW);
    s7.addImage({ data: titleImg, x: cx + px7(30), y: cy + px7(78), w: titleW, h: titleH });

    // Subtitle
    s7.addText(c.subtitle, {
      x: cx + px7(34), y: cy + px7(158), w: s7cardW - px7(68), h: px7(28),
      fontSize: 10.5, fontFace: "Arial", color: C.gray70, bold: true, valign: "middle", margin: 0,
    });

    // Top divider
    s7.addShape(pres.shapes.LINE, {
      x: cx + px7(34), y: cy + px7(198), w: s7cardW - px7(68), h: 0,
      line: { color: c.divColor, width: 0.5 },
    });

    // Content items — reduced padding and font to prevent wrapping
    const itemYs = [240, 282, 324, 366];
    for (let j = 0; j < c.items.length; j++) {
      s7.addText(c.items[j], {
        x: cx + px7(20), y: cy + px7(itemYs[j]) - px7(12), w: s7cardW - px7(40), h: px7(28),
        fontSize: 9, fontFace: "Arial", color: C.gray70, valign: "middle", margin: 0,
      });
    }

    // Bottom divider
    s7.addShape(pres.shapes.LINE, {
      x: cx + px7(34), y: cy + px7(410), w: s7cardW - px7(68), h: 0,
      line: { color: c.divColor, width: 0.5 },
    });

    // Outcome text
    s7.addText(c.outcome, {
      x: cx + px7(20), y: cy + px7(430), w: s7cardW - px7(40), h: px7(80),
      fontSize: 9, fontFace: "Arial", color: c.outcomeColor, bold: true, valign: "top", margin: 0,
    });

    // Arrow to next card — larger and more visible
    if (i < s7cards.length - 1) {
      const arrowXOffsets = [418, 858, 1298];
      const arrowIcon = await iconToBase64Png(FaArrowRight, "#" + c.arrowColor, 256);
      s7.addImage({
        data: arrowIcon,
        x: s7svgLeft + px7(arrowXOffsets[i]) - 0.01,
        y: s7svgTop + px7(270),
        w: 0.22, h: 0.22,
      });
    }
  }

  // Bottom callout bar
  s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px7(80), y: px7(940), w: px7(1760), h: px7(54),
    rectRadius: 0.05, fill: { color: "F0FFF4" }, line: { color: C.teal60, width: 0.75 },
  });

  s7.addText("\u2605", {
    x: px7(94), y: px7(940), w: px7(30), h: px7(54),
    fontSize: 13, fontFace: "Arial", color: C.teal60, align: "center", valign: "middle", margin: 0,
  });

  s7.addText([
    { text: "Compounding returns", options: { bold: true, color: C.gray100, fontSize: 10.5 } },
    { text: " \u2014 each stage builds on the last, creating a flywheel of capability that accelerates over time.", options: { color: "393939", fontSize: 10.5 } },
  ], {
    x: px7(136), y: px7(940), w: px7(1700), h: px7(54),
    fontFace: "Arial", valign: "middle", margin: 0,
  });

  // =====================================================================
  // SLIDE 8: PRE-REQUISITES FOR SUCCESS
  // =====================================================================
  const s8_prereqs = pres.addSlide();
  s8_prereqs.background = { color: C.white };

  s8_prereqs.addText("PRE-REQUISITES", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.2,
    fontSize: 10,
    fontFace: "Arial",
    color: C.purple60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s8_prereqs.addText("Enterprise Readiness for AI-Driven IaC", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.4,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s8_prereqs.addText(
    "Key foundations your organization should have in place \u2014 or that resident technology services will help establish",
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

  const prereqs = [
    {
      icon: FaCode,
      iconColor: "#" + C.blue60,
      accentColor: C.blue60,
      gradientColors: ["#0043CE", "#0F62FE", "#4589FF"],
      title: "IaC Maturity",
      items: [
        "Git-based Terraform workflow",
        "Private module registry",
        "CI/CD for plan & apply",
        "Documented standards",
      ],
    },
    {
      icon: FaLock,
      iconColor: "#" + C.magenta60,
      accentColor: C.magenta60,
      gradientColors: ["#9F1853", "#D02670", "#FF7EB6"],
      title: "Security & Governance",
      items: [
        "RBAC via HCP Terraform",
        "Secrets mgmt (Vault etc.)",
        "Policy-as-code framework",
        "Agent isolation capability",
      ],
    },
    {
      icon: FaLayerGroup,
      iconColor: "#" + C.green60,
      accentColor: C.green60,
      gradientColors: ["#0E6027", "#198038", "#34D478"],
      title: "Verification",
      items: [
        "Testing practices for IaC",
        "Dev/sandbox environments",
        "Observability & audit logging",
        "Stakeholder alignment",
      ],
    },
    {
      icon: FaLightbulb,
      iconColor: "#" + C.teal60,
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      title: "AI & Tooling",
      items: [
        "Frontier model access (API)",
        "AI coding agent with skills & subagents",
        "Agentic workflow support",
        "Prompt & context patterns",
      ],
    },
  ];

  const prW = 2.0;
  const prH = 2.95;
  const prGap = 0.27;
  const prStartX = 0.7;
  const prStartY = 1.5;

  for (let i = 0; i < prereqs.length; i++) {
    const px = prStartX + i * (prW + prGap);
    const pr = prereqs[i];

    const isMandatory = i === prereqs.length - 1;

    // Card background — mandatory card gets tinted bg + border
    s8_prereqs.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: prStartY,
      w: prW,
      h: prH,
      fill: { color: isMandatory ? "E8F7F7" : C.gray10 },
      line: isMandatory ? { color: pr.accentColor, width: 1.5 } : undefined,
      shadow: cardShadow(),
    });

    // Top accent bar (gradient PNG)
    const barImg8 = await renderGradientBar(pr.gradientColors, 400, 8, 0);
    s8_prereqs.addImage({ data: barImg8, x: px, y: prStartY, w: prW, h: 0.08 });

    // REQUIRED badge for mandatory card
    if (isMandatory) {
      s8_prereqs.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: px + prW - 1.15,
        y: prStartY + 0.15,
        w: 0.95,
        h: 0.26,
        fill: { color: pr.accentColor },
        rectRadius: 0.05,
      });
      s8_prereqs.addText("REQUIRED", {
        x: px + prW - 1.15,
        y: prStartY + 0.15,
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
    const iconData = await iconToBase64Png(pr.icon, pr.iconColor, 256);
    s8_prereqs.addImage({
      data: iconData,
      x: px + 0.2,
      y: prStartY + 0.2,
      w: 0.36,
      h: 0.36,
    });

    // Title
    s8_prereqs.addText(pr.title, {
      x: px + 0.2,
      y: prStartY + 0.65,
      w: prW - 0.4,
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

    s8_prereqs.addText(bullets, {
      x: px + 0.2,
      y: prStartY + 1.05,
      w: prW - 0.4,
      h: 1.9,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });
  }

  // Bottom note bar
  s8_prereqs.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.7,
    w: 8.6,
    h: 0.5,
    fill: { color: "F5F0FF" },
    line: { color: C.purple60, width: 1 },
  });

  const lightbulbPr = await iconToBase64Png(FaLightbulb, "#" + C.purple60, 256);
  s8_prereqs.addImage({
    data: lightbulbPr,
    x: 0.9,
    y: 4.77,
    w: 0.3,
    h: 0.3,
  });

  s8_prereqs.addText(
    [
      {
        text: "Don\u2019t have all of these in place? ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "That\u2019s exactly what the resident technology services engagement addresses \u2014 we meet you where you are and build the foundations together.",
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
  // SLIDE 9: THANK YOU — full-bleed title card
  // =====================================================================
  const s9 = pres.addSlide();
  s9.addImage({
    path: "playgrounds/IBM/images/slide-rsa-thankyou.png",
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
  });

  // =====================================================================
  // WRITE FILE
  // =====================================================================
  const fileName = "HashiCorp-Resident-Technology-Services-Proposal.pptx";
  await pres.writeFile({ fileName });
  console.log(`Created: ${fileName}`);
}

buildPresentation().catch(console.error);
