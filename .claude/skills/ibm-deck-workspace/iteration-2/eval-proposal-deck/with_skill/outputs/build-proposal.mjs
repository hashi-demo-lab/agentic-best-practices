import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaRobot, FaBrain, FaShieldAlt, FaCogs, FaRocket,
  FaCheckCircle, FaArrowRight, FaChartLine, FaLightbulb,
  FaLayerGroup, FaCode, FaUsersCog, FaClipboardCheck,
  FaTachometerAlt, FaLock, FaHandshake
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
  magenta60:"D02670",
  green60:  "198038",
  red60:    "DA1E28",
  yellow50: "B28600",
};

// --- Shadow factories (ALWAYS fresh objects) ---
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

const OUTPUT_DIR = ".claude/skills/ibm-deck-workspace/iteration-2/eval-proposal-deck/with_skill/outputs";

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "HashiCorp Professional Services";
  pres.title = "AI-Driven Terraform Infrastructure Proposal";

  // ============================================================
  // SLIDE 1: Title Slide (HTML-captured image)
  // ============================================================
  const s1 = pres.addSlide();
  s1.addImage({
    path: `${OUTPUT_DIR}/slide-title.png`,
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // ============================================================
  // SLIDE 2: Section Divider (HTML-captured image)
  // ============================================================
  const s2 = pres.addSlide();
  s2.addImage({
    path: `${OUTPUT_DIR}/slide-divider.png`,
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // ============================================================
  // SLIDE 3: AI Capabilities Overview (3-column pillars)
  // ============================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Header
  s3.addText("AI CAPABILITIES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.purple60, bold: true, charSpacing: 3, margin: 0,
  });

  s3.addText("AI-Powered Terraform Automation", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.55,
    fontSize: 26, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s3.addText("Intelligent infrastructure management across the full lifecycle", {
    x: 0.7, y: 1.15, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // 3-column pillars
  const pillarW = 2.75, pillarH = 2.7;
  const pillarGap = 0.45;
  const pStartX = 0.7, pStartY = 1.6;

  const pillars = [
    {
      icon: FaBrain, accent: C.purple60, title: "Intelligent Code Generation",
      items: [
        "AI-assisted module composition",
        "Context-aware variable injection",
        "Auto-generated documentation",
        "Pattern library recommendations",
      ],
    },
    {
      icon: FaShieldAlt, accent: C.teal60, title: "Policy & Compliance",
      items: [
        "Automated Sentinel policy creation",
        "Drift detection and remediation",
        "Security posture validation",
        "Cost estimation and optimization",
      ],
    },
    {
      icon: FaRocket, accent: C.blue60, title: "Operational Intelligence",
      items: [
        "Predictive failure analysis",
        "Smart workspace orchestration",
        "Automated testing pipelines",
        "Self-healing run recovery",
      ],
    },
  ];

  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    const px = pStartX + i * (pillarW + pillarGap);

    // Card background
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
      x: px + 0.25, y: pStartY + 0.25, w: 0.42, h: 0.42,
    });

    // Pillar title
    s3.addText(p.title, {
      x: px + 0.25, y: pStartY + 0.78, w: pillarW - 0.5, h: 0.35,
      fontSize: 14, fontFace: "Arial",
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
      x: px + 0.25, y: pStartY + 1.2, w: pillarW - 0.5, h: 1.4,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Callout bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.55, w: 8.6, h: 0.55,
    fill: { color: "F5F0FF" },
    line: { color: C.purple60, width: 1 },
  });

  const lightbulbIcon = await iconToBase64Png(FaLightbulb, "#" + C.purple60, 256);
  s3.addImage({ data: lightbulbIcon, x: 0.9, y: 4.62, w: 0.35, h: 0.35 });

  s3.addText([
    { text: "AI-First Approach: ", options: { bold: true, color: C.gray100 } },
    { text: "Every capability is designed around Terraform's provider ecosystem, ensuring deep integration with existing workflows.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.55, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ============================================================
  // SLIDE 4: Implementation Approach (Timeline / Phase Cards)
  // ============================================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Header
  s4.addText("IMPLEMENTATION", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60, bold: true, charSpacing: 3, margin: 0,
  });

  s4.addText("Phased Implementation Approach", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.55,
    fontSize: 26, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s4.addText("A structured 12-week engagement from assessment to production readiness", {
    x: 0.7, y: 1.15, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  const tlW = 2.75, tlH = 2.7;
  const tlGap = 0.45;
  const tlStartX = 0.7, tlStartY = 1.6;

  const phases = [
    {
      num: "1", title: "Assess & Design", month: "WEEKS 1-4", accent: C.teal60,
      items: [
        "Infrastructure audit & baseline",
        "AI readiness assessment",
        "Module library architecture",
        "Policy framework design",
      ],
    },
    {
      num: "2", title: "Build & Integrate", month: "WEEKS 5-8", accent: C.blue60,
      items: [
        "AI pipeline implementation",
        "Module factory deployment",
        "Sentinel policy automation",
        "CI/CD integration setup",
      ],
    },
    {
      num: "3", title: "Optimize & Transfer", month: "WEEKS 9-12", accent: C.green60,
      items: [
        "Performance tuning & validation",
        "Team training & enablement",
        "Runbook & documentation",
        "Handoff & ongoing support plan",
      ],
    },
  ];

  for (let i = 0; i < phases.length; i++) {
    const ph = phases[i];
    const tx = tlStartX + i * (tlW + tlGap);

    // Card background
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: tlH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Top accent bar
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: 0.05,
      fill: { color: ph.accent },
    });

    // Number circle
    s4.addShape(pres.shapes.OVAL, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.2,
      w: 0.48, h: 0.48,
      fill: { color: ph.accent },
    });

    s4.addText(ph.num, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.2,
      w: 0.48, h: 0.48,
      fontSize: 20, fontFace: "Arial",
      color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Phase title (centered)
    s4.addText(ph.title, {
      x: tx + 0.2, y: tlStartY + 0.8, w: tlW - 0.4, h: 0.35,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, align: "center", margin: 0,
    });

    // Month label
    s4.addText(ph.month, {
      x: tx + 0.2, y: tlStartY + 1.1, w: tlW - 0.4, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: C.gray50, bold: true, align: "center", charSpacing: 2, margin: 0,
    });

    // Bullets
    const bullets = ph.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < ph.items.length - 1,
        fontSize: 11, color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s4.addText(bullets, {
      x: tx + 0.25, y: tlStartY + 1.45, w: tlW - 0.5, h: 1.2,
      fontFace: "Arial", valign: "top", margin: 0,
    });

    // Arrow connector between cards
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
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.55, w: 8.6, h: 0.55,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  const handshakeIcon = await iconToBase64Png(FaHandshake, "#" + C.teal60, 256);
  s4.addImage({ data: handshakeIcon, x: 0.9, y: 4.62, w: 0.35, h: 0.35 });

  s4.addText([
    { text: "Collaborative Delivery: ", options: { bold: true, color: C.gray100 } },
    { text: "Each phase includes embedded knowledge transfer to ensure your team is self-sufficient post-engagement.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.55, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ============================================================
  // SLIDE 5: Expected Outcomes (2-column: outcomes + stats)
  // ============================================================
  const s5 = pres.addSlide();
  s5.background = { color: C.white };

  // Header
  s5.addText("EXPECTED OUTCOMES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.green60, bold: true, charSpacing: 3, margin: 0,
  });

  s5.addText("Measurable Business Impact", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.55,
    fontSize: 26, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s5.addText("Projected results based on similar enterprise engagements", {
    x: 0.7, y: 1.15, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Left column: outcome cards
  const outcomes = [
    { icon: FaTachometerAlt, accent: C.green60, title: "Accelerated Delivery", desc: "Reduce infrastructure provisioning from days to minutes with AI-generated modules" },
    { icon: FaLock, accent: C.blue60, title: "Enhanced Security Posture", desc: "Automated policy enforcement catches misconfigurations before they reach production" },
    { icon: FaLayerGroup, accent: C.purple60, title: "Standardized Operations", desc: "Consistent, versioned module library eliminates configuration drift across teams" },
    { icon: FaUsersCog, accent: C.teal60, title: "Team Enablement", desc: "Self-service workflows empower developers while maintaining governance controls" },
  ];

  const ocCardW = 4.5, ocCardH = 0.68;
  const ocGap = 0.1, ocStartX = 0.7, ocStartY = 1.6;

  for (let i = 0; i < outcomes.length; i++) {
    const o = outcomes[i];
    const oy = ocStartY + i * (ocCardH + ocGap);

    // Card bg
    s5.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX, y: oy, w: ocCardW, h: ocCardH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Left accent bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX, y: oy, w: 0.06, h: ocCardH,
      fill: { color: o.accent },
    });

    // Icon
    const icoData = await iconToBase64Png(o.icon, "#" + o.accent, 256);
    s5.addImage({
      data: icoData,
      x: ocStartX + 0.18, y: oy + 0.15, w: 0.38, h: 0.38,
    });

    // Title
    s5.addText(o.title, {
      x: ocStartX + 0.65, y: oy + 0.02, w: ocCardW - 0.85, h: 0.32,
      fontSize: 12, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    // Desc
    s5.addText(o.desc, {
      x: ocStartX + 0.65, y: oy + 0.34, w: ocCardW - 0.85, h: 0.3,
      fontSize: 10, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Right column: stat callouts
  const stats = [
    { value: "10x", label: "Faster module delivery", accent: C.green60 },
    { value: "90%", label: "Reduction in policy violations", accent: C.blue60 },
    { value: "60%", label: "Less manual configuration effort", accent: C.purple60 },
    { value: "3x", label: "Developer productivity gain", accent: C.teal60 },
  ];

  const statStartX = 5.6, statW = 4.0;
  const statH = 0.68, statGap = 0.1, statStartY = 1.6;

  for (let i = 0; i < stats.length; i++) {
    const st = stats[i];
    const sy = statStartY + i * (statH + statGap);

    // Card bg
    s5.addShape(pres.shapes.RECTANGLE, {
      x: statStartX, y: sy, w: statW, h: statH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Left accent bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x: statStartX, y: sy, w: 0.06, h: statH,
      fill: { color: st.accent },
    });

    // Big number
    s5.addText(st.value, {
      x: statStartX + 0.2, y: sy, w: 1.1, h: statH,
      fontSize: 24, fontFace: "Arial Black",
      color: st.accent, bold: true, valign: "middle", margin: 0,
    });

    // Label
    s5.addText(st.label, {
      x: statStartX + 1.35, y: sy, w: statW - 1.55, h: statH,
      fontSize: 13, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });
  }

  // Callout bar
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.55, w: 8.6, h: 0.55,
    fill: { color: "F0FFF4" },
    line: { color: C.green60, width: 1 },
  });

  const chartIcon = await iconToBase64Png(FaChartLine, "#" + C.green60, 256);
  s5.addImage({ data: chartIcon, x: 0.9, y: 4.62, w: 0.35, h: 0.35 });

  s5.addText([
    { text: "Proven Results: ", options: { bold: true, color: C.gray100 } },
    { text: "Metrics based on outcomes from enterprise Terraform engagements across Fortune 500 organizations.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.55, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ============================================================
  // Write the file
  // ============================================================
  await pres.writeFile({ fileName: `${OUTPUT_DIR}/AI-Terraform-Proposal.pptx` });
  console.log("✓ PPTX saved to " + OUTPUT_DIR + "/AI-Terraform-Proposal.pptx");
}

buildPresentation().catch(console.error);
