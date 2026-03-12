import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaBrain, FaRobot, FaShieldAlt,
  FaSearch, FaCogs, FaRocket,
  FaArrowRight,
  FaCheckCircle, FaClock, FaChartLine, FaUsers,
  FaLightbulb, FaLayerGroup, FaTachometerAlt, FaLock,
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

const IMAGES_DIR = ".claude/skills/ibm-deck-workspace/iteration-3/eval-visual-qa/old_skill/outputs/images";

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "HashiCorp Professional Services";
  pres.title = "HashiCorp Professional Services — AI-Driven Terraform Infrastructure";

  // =============================================
  // SLIDE 1: Title Slide (HTML captured)
  // =============================================
  const s1 = pres.addSlide();
  s1.addImage({
    path: `${IMAGES_DIR}/slide-title.png`,
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // =============================================
  // SLIDE 2: Section Divider (HTML captured)
  // =============================================
  const s2 = pres.addSlide();
  s2.addImage({
    path: `${IMAGES_DIR}/slide-divider.png`,
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // =============================================
  // SLIDE 3: AI Capabilities — 3-Column Pillars
  // =============================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Section label
  s3.addText("AI CAPABILITIES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.purple60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s3.addText("Intelligent Infrastructure Automation", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.5,
    fontSize: 24, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s3.addText("Three pillars of AI-driven Terraform excellence", {
    x: 0.7, y: 1.1, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // 3-column pillar data
  const pillars = [
    {
      icon: FaBrain,
      accent: C.purple60,
      title: "AI-Assisted Authoring",
      bullets: [
        "Generate modules from natural language prompts",
        "Context-aware auto-complete for configurations",
        "Enforce org standards during code generation",
        "Reduce boilerplate with smart scaffolding",
      ],
    },
    {
      icon: FaRobot,
      accent: C.blue60,
      title: "Automated Validation",
      bullets: [
        "Pre-plan security and compliance analysis",
        "AI-powered drift detection and remediation",
        "Policy evaluation with Sentinel & OPA",
        "Automated module testing and verification",
      ],
    },
    {
      icon: FaShieldAlt,
      accent: C.teal60,
      title: "Secure Governance",
      bullets: [
        "Policy-as-code guardrails for every deployment",
        "Role-based access control across workspaces",
        "Automated audit trails and change tracking",
        "Cost estimation and budget enforcement",
      ],
    },
  ];

  const pillarW = 2.75, pillarH = 2.85;
  const pillarGap = 0.45;
  const pStartX = 0.7, pStartY = 1.55;

  for (let i = 0; i < 3; i++) {
    const px = pStartX + i * (pillarW + pillarGap);
    const p = pillars[i];

    // Card bg
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px, y: pStartY, w: pillarW, h: pillarH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Top accent bar
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px, y: pStartY, w: pillarW, h: 0.05,
      fill: { color: p.accent },
    });

    // Icon
    const iconData = await iconToBase64Png(p.icon, "#" + p.accent, 256);
    s3.addImage({
      data: iconData,
      x: px + 0.25, y: pStartY + 0.2, w: 0.4, h: 0.4,
    });

    // Pillar title
    s3.addText(p.title, {
      x: px + 0.25, y: pStartY + 0.72, w: pillarW - 0.5, h: 0.35,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Bullet items
    const bullets = p.bullets.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < p.bullets.length - 1,
        fontSize: 10.5, color: C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s3.addText(bullets, {
      x: px + 0.25, y: pStartY + 1.1, w: pillarW - 0.5, h: 1.8,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Callout bar
  const capIcon = await iconToBase64Png(FaLightbulb, "#" + C.purple60, 256);

  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.6, w: 8.6, h: 0.5,
    fill: { color: "F5F0FF" },
    line: { color: C.purple60, width: 1 },
  });

  s3.addImage({
    data: capIcon, x: 0.88, y: 4.66, w: 0.32, h: 0.32,
  });

  s3.addText([
    { text: "AI Advantage: ", options: { bold: true, color: C.gray100 } },
    { text: "Reduce infrastructure provisioning time by 60% with intelligent automation and pre-validated modules.", options: { color: C.gray70 } },
  ], {
    x: 1.35, y: 4.6, w: 7.75, h: 0.5,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // =============================================
  // SLIDE 4: Implementation Approach — 3-Phase Timeline
  // =============================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Section label
  s4.addText("IMPLEMENTATION APPROACH", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s4.addText("Phased Engagement Model", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.5,
    fontSize: 24, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s4.addText("A structured path from assessment to autonomous operations", {
    x: 0.7, y: 1.1, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  const phases = [
    {
      num: "1",
      title: "Assess & Design",
      month: "MONTHS 1-2",
      accent: C.teal60,
      bullets: [
        "Audit existing Terraform estate and maturity",
        "Define AI-ready module architecture",
        "Establish governance framework",
        "Design workspace topology",
      ],
    },
    {
      num: "2",
      title: "Build & Integrate",
      month: "MONTHS 3-4",
      accent: C.blue60,
      bullets: [
        "Deploy AI-assisted authoring pipelines",
        "Implement policy-as-code guardrails",
        "Integrate with CI/CD and VCS workflows",
        "Build reusable module library",
      ],
    },
    {
      num: "3",
      title: "Scale & Optimize",
      month: "MONTHS 5-6",
      accent: C.green60,
      bullets: [
        "Enable self-service provisioning",
        "Activate AI drift detection and remediation",
        "Train platform teams on advanced patterns",
        "Establish continuous improvement loops",
      ],
    },
  ];

  const tlW = 2.75, tlH = 3.05;
  const tlGap = 0.45;
  const tlStartX = 0.7, tlStartY = 1.5;

  for (let i = 0; i < 3; i++) {
    const tx = tlStartX + i * (tlW + tlGap);
    const ph = phases[i];

    // Card bg
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: tlH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Top accent bar
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: 0.05,
      fill: { color: ph.accent },
    });

    // Number circle (centered)
    s4.addShape(pres.shapes.OVAL, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.18, w: 0.48, h: 0.48,
      fill: { color: ph.accent },
    });

    s4.addText(ph.num, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.18, w: 0.48, h: 0.48,
      fontSize: 20, fontFace: "Arial",
      color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Phase title (centered)
    s4.addText(ph.title, {
      x: tx + 0.2, y: tlStartY + 0.78, w: tlW - 0.4, h: 0.32,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, align: "center", margin: 0,
    });

    // Month label (centered, small uppercase)
    s4.addText(ph.month, {
      x: tx + 0.2, y: tlStartY + 1.08, w: tlW - 0.4, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: C.gray50, bold: true, align: "center", charSpacing: 2, margin: 0,
    });

    // Bullet items
    const bullets = ph.bullets.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < ph.bullets.length - 1,
        fontSize: 10.5, color: C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s4.addText(bullets, {
      x: tx + 0.25, y: tlStartY + 1.4, w: tlW - 0.5, h: 1.55,
      fontFace: "Arial", valign: "top", margin: 0,
    });

    // Arrow connector between cards (except last)
    if (i < 2) {
      const arrowIcon = await iconToBase64Png(FaArrowRight, "#" + ph.accent, 256);
      s4.addImage({
        data: arrowIcon,
        x: tx + tlW + tlGap / 2 - 0.14, y: tlStartY + tlH / 2 - 0.14,
        w: 0.28, h: 0.28,
      });
    }
  }

  // Callout bar
  const tlCalloutIcon = await iconToBase64Png(FaClock, "#" + C.teal60, 256);

  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.7, w: 8.6, h: 0.5,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  s4.addImage({
    data: tlCalloutIcon, x: 0.88, y: 4.76, w: 0.32, h: 0.32,
  });

  s4.addText([
    { text: "Engagement Duration: ", options: { bold: true, color: C.gray100 } },
    { text: "6-month structured engagement with optional 12-month extended support and optimization.", options: { color: C.gray70 } },
  ], {
    x: 1.35, y: 4.7, w: 7.75, h: 0.5,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // =============================================
  // SLIDE 5: Expected Outcomes — 4 Stacked Cards + 4 Metric Callouts
  // =============================================
  const s5 = pres.addSlide();
  s5.background = { color: C.white };

  // Section label
  s5.addText("EXPECTED OUTCOMES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.green60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s5.addText("Measurable Business Impact", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.5,
    fontSize: 24, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s5.addText("Proven results from AI-driven Terraform adoption", {
    x: 0.7, y: 1.1, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Left column: 4 stacked cards with icon + text
  const outcomes = [
    {
      icon: FaTachometerAlt,
      accent: C.green60,
      title: "Accelerated Delivery",
      desc: "Reduce infrastructure provisioning from days to minutes with AI-generated, pre-validated modules.",
    },
    {
      icon: FaShieldAlt,
      accent: C.blue60,
      title: "Enhanced Security Posture",
      desc: "Enforce compliance at every stage with automated policy checks and continuous governance.",
    },
    {
      icon: FaLayerGroup,
      accent: C.purple60,
      title: "Operational Consistency",
      desc: "Standardize deployments across teams with a curated, versioned module registry.",
    },
    {
      icon: FaUsers,
      accent: C.teal60,
      title: "Team Enablement",
      desc: "Upskill platform teams with hands-on AI tooling training and self-service workflows.",
    },
  ];

  const ocCardW = 4.3, ocCardH = 0.72;
  const ocGap = 0.12, ocStartX = 0.7, ocStartY = 1.5;

  for (let i = 0; i < 4; i++) {
    const oy = ocStartY + i * (ocCardH + ocGap);
    const oc = outcomes[i];

    // Card bg
    s5.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX, y: oy, w: ocCardW, h: ocCardH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Left accent bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX, y: oy, w: 0.06, h: ocCardH,
      fill: { color: oc.accent },
    });

    // Icon
    const iconData = await iconToBase64Png(oc.icon, "#" + oc.accent, 256);
    s5.addImage({
      data: iconData,
      x: ocStartX + 0.18, y: oy + 0.17, w: 0.38, h: 0.38,
    });

    // Title
    s5.addText(oc.title, {
      x: ocStartX + 0.68, y: oy + 0.04, w: ocCardW - 0.88, h: 0.32,
      fontSize: 12, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    // Description
    s5.addText(oc.desc, {
      x: ocStartX + 0.68, y: oy + 0.36, w: ocCardW - 0.88, h: 0.32,
      fontSize: 10, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Right column: 4 metric callout cards
  const metrics = [
    { value: "10x", label: "Faster provisioning", accent: C.green60 },
    { value: "60%", label: "Less manual effort", accent: C.blue60 },
    { value: "90%", label: "Policy compliance", accent: C.purple60 },
    { value: "3x", label: "Team productivity", accent: C.teal60 },
  ];

  const statStartX = 5.4, statW = 4.2;
  const statH = 0.72, statGap = 0.12, statStartY = 1.5;

  for (let i = 0; i < 4; i++) {
    const sy = statStartY + i * (statH + statGap);
    const m = metrics[i];

    // Card bg
    s5.addShape(pres.shapes.RECTANGLE, {
      x: statStartX, y: sy, w: statW, h: statH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Left accent bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x: statStartX, y: sy, w: 0.06, h: statH,
      fill: { color: m.accent },
    });

    // Big number
    s5.addText(m.value, {
      x: statStartX + 0.2, y: sy, w: 1.1, h: statH,
      fontSize: 26, fontFace: "Arial Black",
      color: m.accent, bold: true, valign: "middle", margin: 0,
    });

    // Label
    s5.addText(m.label, {
      x: statStartX + 1.35, y: sy, w: statW - 1.55, h: statH,
      fontSize: 13, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });
  }

  // Callout bar at bottom
  const outcomeCalloutIcon = await iconToBase64Png(FaChartLine, "#" + C.green60, 256);

  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.85, w: 8.6, h: 0.5,
    fill: { color: "F0FFF4" },
    line: { color: C.green60, width: 1 },
  });

  s5.addImage({
    data: outcomeCalloutIcon, x: 0.88, y: 4.91, w: 0.32, h: 0.32,
  });

  s5.addText([
    { text: "ROI Commitment: ", options: { bold: true, color: C.gray100 } },
    { text: "Measurable outcomes tracked against agreed KPIs throughout the engagement.", options: { color: C.gray70 } },
  ], {
    x: 1.35, y: 4.85, w: 7.75, h: 0.5,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // Write file
  const outputPath = ".claude/skills/ibm-deck-workspace/iteration-3/eval-visual-qa/old_skill/outputs/hc-professional-services.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log(`PPTX saved to ${outputPath}`);
}

buildPresentation().catch(console.error);
