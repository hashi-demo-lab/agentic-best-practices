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
  pres.author = "HashiCorp Professional Services";
  pres.title =
    "Resident Solution Architect — AI-Driven Infrastructure";

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
    h: 0.3,
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
    h: 0.45,
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
      y: 1.0,
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
      title: "Security Risks",
      desc: "Overprivileged agents risk infrastructure destruction, secret leakage, and policy violations",
    },
    {
      icon: FaClock,
      iconColor: "#" + C.yellow50,
      accentColor: C.yellow50,
      title: "Delivery Bottlenecks",
      desc: "Platform teams are capacity-constrained — module demand outpaces delivery by weeks",
    },
    {
      icon: FaCogs,
      iconColor: "#" + C.purple60,
      accentColor: C.purple60,
      title: "Workflow Immaturity",
      desc: "Traditional IaC workflows weren't designed for AI velocity — controls can't keep pace",
    },
    {
      icon: FaUsers,
      iconColor: "#" + C.teal60,
      accentColor: C.teal60,
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

    // Left accent
    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: 0.06,
      h: cardH,
      fill: { color: ch.accentColor },
    });

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
    "A Resident Solution Architect helps establish the mature practices and strong controls required for safe AI adoption",
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
  // SLIDE 3: RSA VALUE PROPOSITION
  // =====================================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  s3.addText("RESIDENT SOLUTION ARCHITECT", {
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

  s3.addText("What Your Dedicated Expert Delivers", {
    x: 0.7,
    y: 0.65,
    w: 8.6,
    h: 0.55,
    fontSize: 26,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s3.addText(
    "Embedded with your team, bridging the gap between AI capability and enterprise readiness",
    {
      x: 0.7,
      y: 1.15,
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

    // Top accent bar
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: pillarStartY,
      w: pillarW,
      h: 0.05,
      fill: { color: p.accentColor },
    });

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
    h: 0.3,
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
    h: 0.45,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s4.addText(
    "Your RSA guides implementation of battle-tested workflows with measurable acceleration",
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

  // Three use-case cards — outcome-focused, no metrics
  const useCases = [
    {
      accentColor: C.teal60,
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

    // Top accent
    s4.addShape(pres.shapes.RECTANGLE, {
      x: ux,
      y: ucStartY,
      w: ucW,
      h: 0.05,
      fill: { color: uc.accentColor },
    });

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
  // SLIDE 5: ENGAGEMENT TIMELINE (3-6 MONTHS)
  // =====================================================================
  const s5 = pres.addSlide();
  s5.background = { color: C.white };

  s5.addText("ENGAGEMENT TIMELINE", {
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

  s5.addText("Resident Solution Architect: 3\u20136 Months", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.45,
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
      y: 1.0,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // Timeline phases — 3 wide cards for Month 1, Months 2-4, Months 5-6
  const timelinePhases = [
    {
      num: "1",
      title: "Assess & Establish",
      subtitle: "MONTH 1",
      accentColor: C.blue60,
      items: [
        "IaC maturity assessment",
        "Guardrails and governance setup",
        "DevContainer and sandbox config",
        "First workflow implementation",
      ],
    },
    {
      num: "2",
      title: "Enable & Accelerate",
      subtitle: "MONTHS 2 \u2013 4",
      accentColor: C.teal60,
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
      subtitle: "MONTHS 5 \u2013 6",
      accentColor: C.green60,
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

    // Top accent bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x: tx,
      y: tlStartY,
      w: tlW,
      h: 0.05,
      fill: { color: tp.accentColor },
    });

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

    // Month label
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
        text: "Dedicated RSA: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "Assigned and embedded with your team for the full engagement. Candid feedback, hands-on delivery, and a clear path to scale.",
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
    h: 0.3,
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
    h: 0.45,
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
      y: 1.0,
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
      title: "Implemented Use Case",
      desc: "At least one AI-powered IaC workflow deployed and operational with your team",
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
    },
    {
      icon: FaShieldAlt,
      iconColor: "#" + C.blue60,
      title: "Risk",
      desc: "Eliminate misconfigurations before they reach production with automated policy enforcement",
      accent: C.blue60,
    },
    {
      icon: FaClipboardCheck,
      iconColor: "#" + C.green60,
      title: "Cost",
      desc: "Reduce manual review overhead and right-size infrastructure with AI-driven optimization",
      accent: C.green60,
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

    // Left accent
    s6.addShape(pres.shapes.RECTANGLE, {
      x: themeStartX,
      y: ty,
      w: 0.06,
      h: themeH,
      fill: { color: th.accent },
    });

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
  // WRITE FILE
  // =====================================================================
  const fileName = "HashiCorp-RSA-Proposal.pptx";
  await pres.writeFile({ fileName });
  console.log(`Created: ${fileName}`);
}

buildPresentation().catch(console.error);
