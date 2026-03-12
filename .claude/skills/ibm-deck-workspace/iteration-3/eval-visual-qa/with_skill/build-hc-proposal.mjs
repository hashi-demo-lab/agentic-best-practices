import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaRobot,
  FaBrain,
  FaCogs,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaLightbulb,
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
  type: "outer",
  color: "000000",
  blur: 8,
  offset: 2,
  angle: 135,
  opacity: 0.08,
});

const OUTPUT_DIR =
  ".claude/skills/ibm-deck-workspace/iteration-3/eval-visual-qa/with_skill/outputs";

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "HashiCorp Professional Services";
  pres.title =
    "AI-Driven Terraform Infrastructure — HashiCorp Professional Services";

  // =========================================================================
  // SLIDE 1 — Title Slide (HTML capture with HC CY26 Kit background)
  // =========================================================================
  const s1 = pres.addSlide();
  s1.addImage({
    path: `${OUTPUT_DIR}/images/slide-title.png`,
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
  });

  // =========================================================================
  // SLIDE 2 — Section Divider (HTML capture)
  // =========================================================================
  const s2 = pres.addSlide();
  s2.addImage({
    path: `${OUTPUT_DIR}/images/slide-divider.png`,
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
  });

  // =========================================================================
  // SLIDE 3 — AI Capabilities (3-Column Pillars with 4 bullets each)
  // =========================================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Header
  s3.addText("AI CAPABILITIES", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: C.purple60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s3.addText("AI-Powered Infrastructure Automation", {
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
    "Three pillars of intelligent infrastructure delivery with HashiCorp tooling",
    {
      x: 0.7,
      y: 1.15,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // Pillar data
  const pillars = [
    {
      icon: FaBrain,
      accent: C.purple60,
      title: "Intelligent Generation",
      bullets: [
        "AI-assisted module scaffolding from natural language",
        "Context-aware config with built-in best practices",
        "Automated variable and output inference",
        "Smart dependency resolution across providers",
      ],
    },
    {
      icon: FaShieldAlt,
      accent: C.teal60,
      title: "Automated Governance",
      bullets: [
        "Policy-as-code generation with Sentinel and OPA",
        "Real-time compliance validation before apply",
        "Drift detection with AI-driven remediation",
        "Automated security scanning of generated code",
      ],
    },
    {
      icon: FaRocket,
      accent: C.blue60,
      title: "Accelerated Delivery",
      bullets: [
        "CI/CD pipeline generation for Terraform workflows",
        "Automated testing with plan analysis and validation",
        "Self-service provisioning through conversational AI",
        "Intelligent cost estimation and optimization",
      ],
    },
  ];

  const pillarW = 2.75,
    pillarH = 2.95;
  const pillarGap = 0.45;
  const pillarStartX = 0.7,
    pillarStartY = 1.55;

  for (let i = 0; i < 3; i++) {
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
      fill: { color: p.accent },
    });

    // Icon
    const iconData = await iconToBase64Png(p.icon, "#" + p.accent, 256);
    s3.addImage({
      data: iconData,
      x: px + 0.25,
      y: pillarStartY + 0.2,
      w: 0.42,
      h: 0.42,
    });

    // Pillar title
    s3.addText(p.title, {
      x: px + 0.25,
      y: pillarStartY + 0.72,
      w: pillarW - 0.5,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      margin: 0,
    });

    // Bullet items
    const bullets = p.bullets.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < p.bullets.length - 1,
        fontSize: 10,
        color: C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s3.addText(bullets, {
      x: px + 0.25,
      y: pillarStartY + 1.1,
      w: pillarW - 0.5,
      h: 1.75,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.8,
    w: 8.6,
    h: 0.5,
    fill: { color: "F5F0FF" },
    line: { color: C.purple60, width: 1 },
  });

  const lightbulbIcon = await iconToBase64Png(
    FaLightbulb,
    "#" + C.purple60,
    256
  );
  s3.addImage({
    data: lightbulbIcon,
    x: 0.88,
    y: 4.87,
    w: 0.3,
    h: 0.3,
  });

  s3.addText(
    [
      {
        text: "HashiCorp Advantage: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "Purpose-built AI integrations across the entire Terraform lifecycle — from code generation to production governance.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.35,
      y: 4.8,
      w: 7.75,
      h: 0.5,
      fontSize: 10.5,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =========================================================================
  // SLIDE 4 — Implementation Approach (3-Phase Timeline with 4 bullets each)
  // =========================================================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Header
  s4.addText("IMPLEMENTATION APPROACH", {
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

  s4.addText("Phased Engagement Model", {
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

  s4.addText(
    "A structured three-phase approach to AI-driven infrastructure transformation",
    {
      x: 0.7,
      y: 1.15,
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
      title: "Assess & Establish",
      timeLabel: "WEEKS 1 \u2013 4",
      accent: C.teal60,
      bullets: [
        "Audit current Terraform maturity and AI readiness",
        "Define governance policies and compliance rules",
        "Deploy HCP Terraform with workspace strategy",
        "Configure Sentinel policies for baseline guardrails",
      ],
    },
    {
      num: "2",
      title: "Integrate & Automate",
      timeLabel: "WEEKS 5 \u2013 10",
      accent: C.blue60,
      bullets: [
        "Integrate AI code generation into developer workflows",
        "Build reusable private module registry with versioning",
        "Implement CI/CD pipelines with automated plan reviews",
        "Deploy policy-as-code for security and cost controls",
      ],
    },
    {
      num: "3",
      title: "Scale & Optimize",
      timeLabel: "WEEKS 11 \u2013 16",
      accent: C.purple60,
      bullets: [
        "Enable self-service provisioning with no-code modules",
        "Train platform teams on AI-assisted operations",
        "Establish continuous optimization feedback loops",
        "Hand off runbooks and operational documentation",
      ],
    },
  ];

  const tlW = 2.75,
    tlH = 3.0;
  const tlGap = 0.45;
  const tlStartX = 0.7,
    tlStartY = 1.55;

  for (let i = 0; i < 3; i++) {
    const tx = tlStartX + i * (tlW + tlGap);
    const ph = phases[i];

    // Card background
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx,
      y: tlStartY,
      w: tlW,
      h: tlH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top accent bar
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx,
      y: tlStartY,
      w: tlW,
      h: 0.05,
      fill: { color: ph.accent },
    });

    // Number circle
    s4.addShape(pres.shapes.OVAL, {
      x: tx + tlW / 2 - 0.24,
      y: tlStartY + 0.18,
      w: 0.48,
      h: 0.48,
      fill: { color: ph.accent },
    });

    s4.addText(ph.num, {
      x: tx + tlW / 2 - 0.24,
      y: tlStartY + 0.18,
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
    s4.addText(ph.title, {
      x: tx + 0.2,
      y: tlStartY + 0.76,
      w: tlW - 0.4,
      h: 0.32,
      fontSize: 14,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      align: "center",
      margin: 0,
    });

    // Time label
    s4.addText(ph.timeLabel, {
      x: tx + 0.2,
      y: tlStartY + 1.06,
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

    // Bullets
    const bullets = ph.bullets.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < ph.bullets.length - 1,
        fontSize: 10.5,
        color: C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s4.addText(bullets, {
      x: tx + 0.2,
      y: tlStartY + 1.38,
      w: tlW - 0.4,
      h: 1.55,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });

    // Arrow connector between cards (except last)
    if (i < 2) {
      const arrowIcon = await iconToBase64Png(
        FaArrowRight,
        "#" + ph.accent,
        256
      );
      s4.addImage({
        data: arrowIcon,
        x: tx + tlW + tlGap / 2 - 0.14,
        y: tlStartY + tlH / 2 - 0.14,
        w: 0.28,
        h: 0.28,
      });
    }
  }

  // Bottom callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.75,
    w: 8.6,
    h: 0.5,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  const clockIcon = await iconToBase64Png(FaClock, "#" + C.teal60, 256);
  s4.addImage({
    data: clockIcon,
    x: 0.88,
    y: 4.82,
    w: 0.3,
    h: 0.3,
  });

  s4.addText(
    [
      {
        text: "Engagement Timeline: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "16-week program with defined milestones, knowledge transfer at every phase, and operational readiness by completion.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.35,
      y: 4.75,
      w: 7.75,
      h: 0.5,
      fontSize: 10.5,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =========================================================================
  // SLIDE 5 — Expected Outcomes (4 stacked cards + 4 metric callouts)
  // =========================================================================
  const s5 = pres.addSlide();
  s5.background = { color: C.white };

  // Header
  s5.addText("EXPECTED OUTCOMES", {
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

  s5.addText("Measurable Business Impact", {
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

  s5.addText(
    "Tangible results from AI-driven Terraform infrastructure transformation",
    {
      x: 0.7,
      y: 1.15,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // Left column — 4 stacked cards with descriptions
  const outcomes = [
    {
      icon: FaRocket,
      accent: C.green60,
      title: "Faster Provisioning",
      desc: "Reduce infrastructure lead time from weeks to hours with AI-generated Terraform",
    },
    {
      icon: FaShieldAlt,
      accent: C.teal60,
      title: "Stronger Governance",
      desc: "Automated policy enforcement ensures 100% compliance before any deployment",
    },
    {
      icon: FaUsers,
      accent: C.blue60,
      title: "Team Enablement",
      desc: "Upskill platform teams with AI-assisted workflows and reusable patterns",
    },
    {
      icon: FaChartLine,
      accent: C.purple60,
      title: "Cost Optimization",
      desc: "AI-driven analysis identifies savings opportunities across cloud spend",
    },
  ];

  const ocCardW = 4.45,
    ocCardH = 0.72;
  const ocGap = 0.12,
    ocStartX = 0.7,
    ocStartY = 1.55;

  for (let i = 0; i < 4; i++) {
    const oy = ocStartY + i * (ocCardH + ocGap);
    const oc = outcomes[i];

    // Card background
    s5.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX,
      y: oy,
      w: ocCardW,
      h: ocCardH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left accent bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x: ocStartX,
      y: oy,
      w: 0.06,
      h: ocCardH,
      fill: { color: oc.accent },
    });

    // Icon
    const iconData = await iconToBase64Png(oc.icon, "#" + oc.accent, 256);
    s5.addImage({
      data: iconData,
      x: ocStartX + 0.18,
      y: oy + 0.17,
      w: 0.38,
      h: 0.38,
    });

    // Card title
    s5.addText(oc.title, {
      x: ocStartX + 0.68,
      y: oy + 0.04,
      w: ocCardW - 0.88,
      h: 0.32,
      fontSize: 13,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Card description
    s5.addText(oc.desc, {
      x: ocStartX + 0.68,
      y: oy + 0.36,
      w: ocCardW - 0.88,
      h: 0.32,
      fontSize: 10.5,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Right column — 4 metric callout cards
  const metrics = [
    {
      number: "10x",
      label: "Faster module delivery",
      accent: C.green60,
    },
    {
      number: "100%",
      label: "Policy compliance at deploy",
      accent: C.teal60,
    },
    {
      number: "60%",
      label: "Reduction in manual effort",
      accent: C.blue60,
    },
    {
      number: "40%",
      label: "Cloud cost savings identified",
      accent: C.purple60,
    },
  ];

  const statStartX = 5.55,
    statW = 3.95;
  const statH = 0.72,
    statGap = 0.12,
    statStartY = 1.55;

  for (let i = 0; i < 4; i++) {
    const sy = statStartY + i * (statH + statGap);
    const m = metrics[i];

    // Card background
    s5.addShape(pres.shapes.RECTANGLE, {
      x: statStartX,
      y: sy,
      w: statW,
      h: statH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left accent bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x: statStartX,
      y: sy,
      w: 0.06,
      h: statH,
      fill: { color: m.accent },
    });

    // Big metric number
    s5.addText(m.number, {
      x: statStartX + 0.2,
      y: sy,
      w: 1.15,
      h: statH,
      fontSize: 26,
      fontFace: "Arial Black",
      color: m.accent,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Metric label
    s5.addText(m.label, {
      x: statStartX + 1.4,
      y: sy,
      w: statW - 1.6,
      h: statH,
      fontSize: 13,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      valign: "middle",
      margin: 0,
    });
  }

  // Bottom callout bar
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.85,
    w: 8.6,
    h: 0.5,
    fill: { color: "F0FFF4" },
    line: { color: C.green60, width: 1 },
  });

  const checkIcon = await iconToBase64Png(FaCheckCircle, "#" + C.green60, 256);
  s5.addImage({
    data: checkIcon,
    x: 0.88,
    y: 4.92,
    w: 0.3,
    h: 0.3,
  });

  s5.addText(
    [
      { text: "ROI Commitment: ", options: { bold: true, color: C.gray100 } },
      {
        text: "HashiCorp Professional Services delivers measurable outcomes with defined success criteria at every engagement milestone.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.35,
      y: 4.85,
      w: 7.75,
      h: 0.5,
      fontSize: 10.5,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // Write output
  await pres.writeFile({
    fileName: `${OUTPUT_DIR}/HC-Professional-Services-AI-Terraform.pptx`,
  });
  console.log("PPTX written successfully.");
}

buildPresentation().catch(console.error);
