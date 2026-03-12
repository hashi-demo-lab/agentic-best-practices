import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import { FaRocket, FaEye, FaShieldAlt, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

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
  yellow40: "D2A106",
};

// --- Shadow factories (ALWAYS fresh objects) ---
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

const footerBarShadow = () => ({
  type: "outer", color: "000000", blur: 4,
  offset: 1, angle: 270, opacity: 0.06,
});

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "IBM Consulting";
  pres.title = "DevOps Consulting Services";

  // =========================================================================
  // SLIDE 1: Title Slide (programmatic, white bg)
  // =========================================================================
  const s1 = pres.addSlide();
  s1.background = { fill: C.white };

  // Blue accent bar at top
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.blue60 },
  });

  // Section label
  s1.addText("IBM CONSULTING", {
    x: 0.7, y: 1.4, w: 8.6, h: 0.35,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  // Big title
  s1.addText("DevOps Consulting\nServices", {
    x: 0.7, y: 1.8, w: 8.6, h: 1.2,
    fontSize: 36, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
    lineSpacingMultiple: 1.0,
  });

  // Subtitle
  s1.addText("Accelerating delivery through automation, observability, and security", {
    x: 0.7, y: 3.1, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Date line
  s1.addText("March 2026  |  Confidential", {
    x: 0.7, y: 3.65, w: 8.6, h: 0.3,
    fontSize: 11, fontFace: "Arial",
    color: C.gray50, margin: 0,
  });

  // Bottom accent bar
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06,
    fill: { color: C.blue60 },
  });

  // =========================================================================
  // SLIDE 2: Value Proposition - 3 Pillar Cards
  // =========================================================================
  const s2 = pres.addSlide();
  s2.background = { fill: C.white };

  // Section label
  s2.addText("VALUE PROPOSITION", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s2.addText("Three Pillars of DevOps Excellence", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.45,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s2.addText("Our approach delivers measurable outcomes across three critical dimensions", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // 3-column pillar layout
  const pillarW = 2.75, pillarH = 2.95;
  const pillarGap = 0.45;
  const pillarStartX = 0.7, pillarStartY = 1.65;

  const pillars = [
    {
      icon: FaRocket,
      accentColor: C.blue60,
      title: "Automation",
      items: [
        "CI/CD pipeline modernization",
        "Infrastructure as Code adoption",
        "GitOps workflow implementation",
        "Automated testing frameworks",
      ],
    },
    {
      icon: FaEye,
      accentColor: C.teal60,
      title: "Observability",
      items: [
        "Full-stack monitoring setup",
        "Distributed tracing integration",
        "SLO/SLI definition & tracking",
        "Incident response automation",
      ],
    },
    {
      icon: FaShieldAlt,
      accentColor: C.green60,
      title: "Security",
      items: [
        "Shift-left security practices",
        "Supply chain protection",
        "Policy-as-Code guardrails",
        "Secrets management & rotation",
      ],
    },
  ];

  for (let i = 0; i < 3; i++) {
    const px = pillarStartX + i * (pillarW + pillarGap);
    const { icon, accentColor, title, items } = pillars[i];

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: px, y: pillarStartY, w: pillarW, h: pillarH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Top accent bar
    s2.addShape(pres.shapes.RECTANGLE, {
      x: px, y: pillarStartY, w: pillarW, h: 0.05,
      fill: { color: accentColor },
    });

    // Icon
    const iconData = await iconToBase64Png(icon, "#" + accentColor, 256);
    s2.addImage({
      data: iconData,
      x: px + 0.25, y: pillarStartY + 0.25, w: 0.42, h: 0.42,
    });

    // Pillar title
    s2.addText(title, {
      x: px + 0.25, y: pillarStartY + 0.78, w: pillarW - 0.5, h: 0.35,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Bullet items
    const bullets = items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < items.length - 1,
        fontSize: 11, color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s2.addText(bullets, {
      x: px + 0.25, y: pillarStartY + 1.2, w: pillarW - 0.5, h: 1.8,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // =========================================================================
  // SLIDE 3: Metric Callouts - Time Savings
  // =========================================================================
  const s3 = pres.addSlide();
  s3.background = { fill: C.white };

  // Section label
  s3.addText("EXPECTED OUTCOMES", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s3.addText("Measurable Time Savings", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.45,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s3.addText("Proven results from engagements across enterprise DevOps transformations", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // 3-column metric cards
  const ucW = 2.75, ucH = 3.4;
  const ucGap = 0.45;
  const ucStartX = 0.7, ucStartY = 1.45;

  const metrics = [
    {
      accentColor: C.blue60,
      label: "DEPLOYMENT TEAM",
      title: "Pipeline Automation",
      description: "End-to-end CI/CD pipelines with automated testing, security scanning, and progressive delivery",
      metricLabel: "DEPLOYMENT FREQUENCY",
      metricValue: "10x",
      statusText: "Validated",
    },
    {
      accentColor: C.teal60,
      label: "PLATFORM TEAM",
      title: "Infrastructure as Code",
      description: "Terraform modules with automated compliance, drift detection, and self-service provisioning",
      metricLabel: "INCIDENT REDUCTION",
      metricValue: "80%",
      statusText: "Validated",
    },
    {
      accentColor: C.green60,
      label: "SECURITY TEAM",
      title: "DevSecOps Integration",
      description: "Shift-left security with policy-as-code, vulnerability scanning, and automated remediation",
      metricLabel: "COMPLIANCE CHECKS",
      metricValue: "3+",
      statusText: "Validated",
    },
  ];

  for (let i = 0; i < 3; i++) {
    const ux = ucStartX + i * (ucW + ucGap);
    const m = metrics[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: ux, y: ucStartY, w: ucW, h: ucH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Top accent bar
    s3.addShape(pres.shapes.RECTANGLE, {
      x: ux, y: ucStartY, w: ucW, h: 0.05,
      fill: { color: m.accentColor },
    });

    // Persona label (small uppercase)
    s3.addText(m.label, {
      x: ux + 0.2, y: ucStartY + 0.2, w: ucW - 0.4, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: m.accentColor, bold: true, charSpacing: 2, margin: 0,
    });

    // Title
    s3.addText(m.title, {
      x: ux + 0.2, y: ucStartY + 0.5, w: ucW - 0.4, h: 0.35,
      fontSize: 16, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Description
    s3.addText(m.description, {
      x: ux + 0.2, y: ucStartY + 0.9, w: ucW - 0.4, h: 0.75,
      fontSize: 11, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });

    // Metric box (inset white box with border)
    s3.addShape(pres.shapes.RECTANGLE, {
      x: ux + 0.15, y: ucStartY + 1.75, w: ucW - 0.3, h: 1.4,
      fill: { color: C.white },
      line: { color: C.gray20, width: 0.5 },
    });

    // Metric label (centered uppercase)
    s3.addText(m.metricLabel, {
      x: ux + 0.2, y: ucStartY + 1.82, w: ucW - 0.4, h: 0.2,
      fontSize: 8, fontFace: "Arial",
      color: C.gray50, bold: true, charSpacing: 2, align: "center", margin: 0,
    });

    // Big metric number
    s3.addText(m.metricValue, {
      x: ux + 0.2, y: ucStartY + 2.05, w: ucW - 0.4, h: 0.45,
      fontSize: 36, fontFace: "Arial Black",
      color: m.accentColor, bold: true, align: "center", margin: 0,
    });

    // Status badge (checkmark icon + text)
    const checkIcon = await iconToBase64Png(FaCheckCircle, "#" + C.green60, 256);
    s3.addImage({
      data: checkIcon,
      x: ux + ucW / 2 - 0.48, y: ucStartY + 2.7, w: 0.22, h: 0.22,
    });
    s3.addText(m.statusText, {
      x: ux + ucW / 2 - 0.2, y: ucStartY + 2.68, w: 1, h: 0.28,
      fontSize: 12, fontFace: "Arial",
      color: C.green60, bold: true, valign: "middle", margin: 0,
    });
  }

  // =========================================================================
  // SLIDE 4: Engagement Timeline - 3 Phases
  // =========================================================================
  const s4 = pres.addSlide();
  s4.background = { fill: C.white };

  // Section label
  s4.addText("ENGAGEMENT TIMELINE", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.purple60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s4.addText("Three-Phase Delivery Approach", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.45,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s4.addText("A structured engagement model from assessment through sustained optimization", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Timeline cards
  const tlW = 2.75, tlH = 2.7;
  const tlGap = 0.45;
  const tlStartX = 0.7, tlStartY = 1.5;

  const phases = [
    {
      accentColor: C.blue60,
      title: "Assess & Establish",
      month: "MONTH 1",
      items: [
        "Current state assessment",
        "Toolchain & pipeline audit",
        "Maturity model baseline",
        "Quick-win identification",
      ],
    },
    {
      accentColor: C.teal60,
      title: "Build & Automate",
      month: "MONTHS 2-3",
      items: [
        "CI/CD pipeline build-out",
        "IaC module development",
        "Monitoring stack deployment",
        "Team enablement workshops",
      ],
    },
    {
      accentColor: C.green60,
      title: "Optimize & Scale",
      month: "MONTHS 4-6",
      items: [
        "Performance optimization",
        "Self-service platform rollout",
        "Advanced observability",
        "Knowledge transfer & handoff",
      ],
    },
  ];

  for (let i = 0; i < 3; i++) {
    const tx = tlStartX + i * (tlW + tlGap);
    const phase = phases[i];

    // Card background
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: tlH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Top accent bar
    s4.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: 0.05,
      fill: { color: phase.accentColor },
    });

    // Number circle (centered)
    s4.addShape(pres.shapes.OVAL, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.2, w: 0.48, h: 0.48,
      fill: { color: phase.accentColor },
    });

    s4.addText(String(i + 1), {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.2, w: 0.48, h: 0.48,
      fontSize: 20, fontFace: "Arial",
      color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Phase title (centered)
    s4.addText(phase.title, {
      x: tx + 0.2, y: tlStartY + 0.8, w: tlW - 0.4, h: 0.35,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, align: "center", margin: 0,
    });

    // Month label (centered, small uppercase)
    s4.addText(phase.month, {
      x: tx + 0.2, y: tlStartY + 1.1, w: tlW - 0.4, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: C.gray50, bold: true, align: "center", charSpacing: 2, margin: 0,
    });

    // Bullet items
    const bullets = phase.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < phase.items.length - 1,
        fontSize: 11, color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s4.addText(bullets, {
      x: tx + 0.25, y: tlStartY + 1.45, w: tlW - 0.5, h: 1.2,
      fontFace: "Arial", valign: "top", margin: 0,
    });

    // Arrow connector between cards (except last)
    if (i < 2) {
      const arrowIcon = await iconToBase64Png(FaArrowRight, "#" + phase.accentColor, 256);
      s4.addImage({
        data: arrowIcon,
        x: tx + tlW + tlGap / 2 - 0.14, y: tlStartY + tlH / 2 - 0.14,
        w: 0.28, h: 0.28,
      });
    }
  }

  // Bottom callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.5, w: 8.6, h: 0.55,
    fill: { color: "F5F0FF" }, // purple tint
    line: { color: C.purple60, width: 1 },
    shadow: footerBarShadow(),
  });

  const clockIcon = await iconToBase64Png(FaClock, "#" + C.purple60, 256);
  s4.addImage({
    data: clockIcon, x: 0.9, y: 4.57, w: 0.35, h: 0.35,
  });

  s4.addText([
    { text: "Typical engagement: ", options: { bold: true, color: C.gray100 } },
    { text: "6 months from assessment to full handoff, with quick wins delivered in the first 30 days.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.5, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // Write file
  const outputPath = new URL("outputs/DevOps-Consulting-Services.pptx", import.meta.url).pathname;
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation saved to: ${outputPath}`);
}

buildPresentation().catch(console.error);
