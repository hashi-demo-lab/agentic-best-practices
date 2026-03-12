import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import { FaShieldAlt, FaSearch, FaClipboardCheck, FaLock, FaCheckCircle, FaHandshake } from "react-icons/fa";

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
  green60: "198038",
  red60: "DA1E28",
  yellow50: "B28600",
  magenta60: "D02670",
};

// --- Shadow factories (ALWAYS fresh objects) ---
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

const OUTPUT_DIR = ".claude/skills/ibm-deck-workspace/iteration-2/eval-title-capture/with_skill/outputs";

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Cloud Security Team";
  pres.title = "Cloud Security Assessment - Proposal";

  // =========================================================
  // SLIDE 1: Title (HTML-captured with HC CY26 Kit background)
  // =========================================================
  const s1 = pres.addSlide();
  s1.addImage({
    path: `${OUTPUT_DIR}/slide-title.png`,
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // =========================================================
  // SLIDE 2: Content — Assessment Overview (3-Column Pillars)
  // =========================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("CLOUD SECURITY", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  // Slide title
  s2.addText("Assessment Approach", {
    x: 0.7, y: 0.65, w: 8.6, h: 0.55,
    fontSize: 26, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s2.addText("A structured three-phase methodology to evaluate, strengthen, and validate your cloud security posture", {
    x: 0.7, y: 1.15, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // 3-Column Pillars
  const pillarW = 2.75, pillarH = 2.7;
  const pillarGap = 0.45;
  const startX = 0.7, startY = 1.65;

  const pillars = [
    {
      icon: FaSearch,
      accent: C.blue60,
      title: "Discovery & Analysis",
      items: [
        "Cloud infrastructure inventory",
        "IAM policy & role assessment",
        "Network segmentation review",
        "Data classification mapping",
        "Compliance gap analysis",
      ],
    },
    {
      icon: FaShieldAlt,
      accent: C.purple60,
      title: "Risk & Remediation",
      items: [
        "Threat modeling & attack paths",
        "Vulnerability prioritization",
        "Security control validation",
        "Remediation roadmap",
        "Quick-win implementations",
      ],
    },
    {
      icon: FaClipboardCheck,
      accent: C.green60,
      title: "Governance & Compliance",
      items: [
        "Policy framework alignment",
        "Regulatory compliance mapping",
        "Security baseline standards",
        "Monitoring & alerting setup",
        "Executive summary report",
      ],
    },
  ];

  for (let i = 0; i < 3; i++) {
    const px = startX + i * (pillarW + pillarGap);
    const p = pillars[i];

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: px, y: startY, w: pillarW, h: pillarH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Top accent bar
    s2.addShape(pres.shapes.RECTANGLE, {
      x: px, y: startY, w: pillarW, h: 0.05,
      fill: { color: p.accent },
    });

    // Icon
    const iconData = await iconToBase64Png(p.icon, "#" + p.accent, 256);
    s2.addImage({
      data: iconData,
      x: px + 0.25, y: startY + 0.25, w: 0.42, h: 0.42,
    });

    // Pillar title
    s2.addText(p.title, {
      x: px + 0.25, y: startY + 0.78, w: pillarW - 0.5, h: 0.35,
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

    s2.addText(bullets, {
      x: px + 0.25, y: startY + 1.2, w: pillarW - 0.5, h: 1.5,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.55, w: 8.6, h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const handshakeIcon = await iconToBase64Png(FaHandshake, "#" + C.blue60, 256);
  s2.addImage({
    data: handshakeIcon, x: 0.9, y: 4.63, w: 0.35, h: 0.35,
  });

  s2.addText([
    { text: "Engagement Timeline: ", options: { bold: true, color: C.gray100 } },
    { text: "4-6 weeks from kickoff to final report delivery, with weekly progress updates and stakeholder reviews.", options: { color: C.gray70 } },
  ], {
    x: 1.4, y: 4.55, w: 7.7, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // =========================================================
  // SLIDE 3: Closing — Next Steps / Contact
  // =========================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Top accent line
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.blue60 },
  });

  // Section label
  s3.addText("NEXT STEPS", {
    x: 0.7, y: 0.6, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  s3.addText("Ready to Get Started", {
    x: 0.7, y: 0.9, w: 8.6, h: 0.55,
    fontSize: 26, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle
  s3.addText("Let's discuss how we can strengthen your cloud security posture", {
    x: 0.7, y: 1.4, w: 8.6, h: 0.3,
    fontSize: 13, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // Next steps cards - stacked horizontal cards
  const steps = [
    {
      icon: FaCheckCircle,
      accent: C.green60,
      title: "Schedule Discovery Workshop",
      desc: "Half-day session to align on scope, priorities, and key stakeholders",
    },
    {
      icon: FaLock,
      accent: C.blue60,
      title: "Share Environment Access",
      desc: "Provide read-only access to cloud accounts for automated scanning",
    },
    {
      icon: FaClipboardCheck,
      accent: C.purple60,
      title: "Review & Approve Statement of Work",
      desc: "Finalize timeline, deliverables, and engagement terms",
    },
  ];

  const stepCardW = 8.6, stepCardH = 0.78;
  const stepGap = 0.15;
  const stepStartX = 0.7, stepStartY = 1.95;

  for (let i = 0; i < steps.length; i++) {
    const sy = stepStartY + i * (stepCardH + stepGap);
    const step = steps[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: stepStartX, y: sy, w: stepCardW, h: stepCardH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    // Left accent bar
    s3.addShape(pres.shapes.RECTANGLE, {
      x: stepStartX, y: sy, w: 0.06, h: stepCardH,
      fill: { color: step.accent },
    });

    // Number circle
    s3.addShape(pres.shapes.OVAL, {
      x: stepStartX + 0.2, y: sy + 0.15, w: 0.48, h: 0.48,
      fill: { color: step.accent },
    });

    s3.addText(String(i + 1), {
      x: stepStartX + 0.2, y: sy + 0.15, w: 0.48, h: 0.48,
      fontSize: 20, fontFace: "Arial",
      color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Step title
    s3.addText(step.title, {
      x: stepStartX + 0.85, y: sy + 0.05, w: stepCardW - 1.1, h: 0.38,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    // Step description
    s3.addText(step.desc, {
      x: stepStartX + 0.85, y: sy + 0.40, w: stepCardW - 1.1, h: 0.35,
      fontSize: 11, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Contact info section
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.2, w: 8.6, h: 0.02,
    fill: { color: C.gray20 },
  });

  s3.addText("Cloud Security Assessment Team", {
    x: 0.7, y: 4.4, w: 4, h: 0.3,
    fontSize: 14, fontFace: "Arial",
    color: C.gray100, bold: true, margin: 0,
  });

  s3.addText("cloud-security@company.com", {
    x: 0.7, y: 4.7, w: 4, h: 0.25,
    fontSize: 11, fontFace: "Arial",
    color: C.blue60, margin: 0,
  });

  // Bottom bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: C.gray10 },
  });

  s3.addText("Confidential", {
    x: 0.7, y: 5.125, w: 8.6, h: 0.5,
    fontSize: 10, fontFace: "Arial",
    color: C.gray50, valign: "middle", margin: 0,
  });

  // Write the file
  const outputPath = `${OUTPUT_DIR}/Cloud-Security-Assessment.pptx`;
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation saved to ${outputPath}`);
}

buildPresentation().catch(console.error);
