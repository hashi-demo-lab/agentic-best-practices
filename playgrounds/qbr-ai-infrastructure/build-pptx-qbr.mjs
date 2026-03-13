import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import { execSync } from "child_process";
import { statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
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
  FaBullhorn,
  FaSearch,
  FaCompass,
  FaTools,
  FaStar,
  FaGraduationCap,
  FaBrain,
  FaProjectDiagram,
} from "react-icons/fa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "../..");
const SKILL_DIR = resolve(REPO_ROOT, ".claude/skills/ibm-deck");
const CAPTURE_SCRIPT = resolve(SKILL_DIR, "scripts/capture-title.mjs");
const IMAGES_DIR = resolve(__dirname, "images");

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

// --- Gradient SVG → PNG helpers ---
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

// --- Fresh shadow/option factory functions (pptxgenjs mutates objects) ---
const cardShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 8,
  offset: 2,
  angle: 135,
  opacity: 0.08,
});

// --- Pixel-to-inch helper ---
const px = (v) => v / 192;

// --- Capture title/closing slides ---
function captureSlide(opts) {
  const args = [
    `node "${CAPTURE_SCRIPT}"`,
    `--line1 "${opts.line1}"`,
    opts.line2 ? `--line2 "${opts.line2}"` : "",
    opts.subtitle ? `--subtitle "${opts.subtitle}"` : "",
    `--output "${opts.output}"`,
    opts.type ? `--type ${opts.type}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  console.log(`Capturing: ${opts.line1}...`);
  execSync(args, { stdio: "inherit", cwd: REPO_ROOT });

  const stats = statSync(opts.output);
  const sizeKB = Math.round(stats.size / 1024);
  console.log(`  → ${sizeKB} KB`);
}

async function buildPresentation() {
  // =====================================================================
  // STEP 0: CAPTURE TITLE & CLOSING SLIDES
  // =====================================================================
  const titlePng = resolve(IMAGES_DIR, "slide-title.png");
  const closingPng = resolve(IMAGES_DIR, "slide-closing.png");

  captureSlide({
    line1: "AI-Driven Infrastructure",
    line2: "Sales Enablement Brief",
    subtitle: "HashiCorp Quarterly Business Review — CY26 Q1",
    output: titlePng,
  });

  captureSlide({
    line1: "Let's Accelerate",
    line2: "Your Customers' AI Journey",
    subtitle: "Contact your services lead to discuss opportunity qualification",
    output: closingPng,
  });

  // =====================================================================
  // BUILD PPTX
  // =====================================================================
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "HashiCorp Sales Enablement";
  pres.title = "HashiCorp QBR — AI-Driven Infrastructure";

  // =====================================================================
  // SLIDE 1: TITLE (full-bleed captured image)
  // =====================================================================
  const s1 = pres.addSlide();
  s1.addImage({ path: titlePng, x: 0, y: 0, w: 10, h: 5.625 });

  // =====================================================================
  // SLIDE 2: SITUATION — Where Your Customers Are Today
  // =====================================================================
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  s2.addText("SITUATION", {
    x: 0.7, y: 0.35, w: 5, h: 0.2,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  s2.addText("Where Your Customers Are Today", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.4,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s2.addText(
    "Most enterprise Terraform users have a solid IaC foundation — but platform teams can't keep pace with demand",
    {
      x: 0.7, y: 1.05, w: 8.6, h: 0.3,
      fontSize: 12, fontFace: "Arial",
      color: C.gray70, margin: 0,
    }
  );

  const situationCards = [
    {
      icon: FaCheckCircle,
      iconColor: "#" + C.blue60,
      accentColor: C.blue60,
      gradientColors: ["#0043CE", "#0F62FE", "#4589FF"],
      title: "Terraform in Production",
      desc: "Git workflows, CI/CD pipelines, and private registry already established",
    },
    {
      icon: FaUsers,
      iconColor: "#" + C.purple60,
      accentColor: C.purple60,
      gradientColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      title: "Platform Teams Under Pressure",
      desc: "Module demand outpaces delivery capacity by weeks or months",
    },
    {
      icon: FaClock,
      iconColor: "#" + C.yellow50,
      accentColor: C.yellow50,
      gradientColors: ["#8A6800", "#B28600", "#F59E0B"],
      title: "Slow Design Cycles",
      desc: "Weeks-to-months lead times for new infrastructure patterns and modules",
    },
    {
      icon: FaCogs,
      iconColor: "#" + C.teal60,
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      title: "Growing Complexity",
      desc: "Multi-cloud, compliance mandates, and security overhead compound the challenge",
    },
  ];

  const cardW = 4.1;
  const cardH = 1.35;
  const cardGapX = 0.4;
  const cardGapY = 0.2;
  const gridStartX = 0.7;
  const gridStartY = 1.4;

  for (let i = 0; i < situationCards.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + cardGapX);
    const cy = gridStartY + row * (cardH + cardGapY);
    const ch = situationCards[i];

    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    const vBar = await renderVerticalGradientBar(ch.gradientColors, 8, 260);
    s2.addImage({ data: vBar, x: cx, y: cy, w: 0.08, h: cardH });

    const iconData = await iconToBase64Png(ch.icon, ch.iconColor, 256);
    s2.addImage({ data: iconData, x: cx + 0.2, y: cy + 0.2, w: 0.38, h: 0.38 });

    s2.addText(ch.title, {
      x: cx + 0.7, y: cy + 0.15, w: cardW - 0.9, h: 0.4,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    s2.addText(ch.desc, {
      x: cx + 0.7, y: cy + 0.6, w: cardW - 0.9, h: 0.7,
      fontSize: 11, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.55, w: 8.6, h: 0.5,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const compassIcon = await iconToBase64Png(FaCompass, "#" + C.blue60, 256);
  s2.addImage({ data: compassIcon, x: 0.9, y: 4.62, w: 0.3, h: 0.3 });

  s2.addText(
    [
      { text: "Key insight: ", options: { bold: true, color: C.gray100 } },
      { text: "Your customers have the IaC foundation. What they need is a safe path to AI velocity.", options: { color: C.gray70 } },
    ],
    {
      x: 1.35, y: 4.55, w: 7.8, h: 0.5,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 3: COMPLICATION — AI for Infrastructure Is High-Reward, High-Risk
  // =====================================================================
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  s3.addText("COMPLICATION", {
    x: 0.7, y: 0.35, w: 5, h: 0.2,
    fontSize: 10, fontFace: "Arial",
    color: C.red60, bold: true, charSpacing: 3, margin: 0,
  });

  s3.addText("AI for Infrastructure Is High-Reward, High-Risk", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.4,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s3.addText(
    "Customers see the potential but lack the guardrails, workflows, and expertise to adopt safely",
    {
      x: 0.7, y: 1.05, w: 8.6, h: 0.3,
      fontSize: 12, fontFace: "Arial",
      color: C.gray70, margin: 0,
    }
  );

  const complicationCards = [
    {
      icon: FaExclamationTriangle,
      iconColor: "#" + C.red60,
      accentColor: C.red60,
      gradientColors: ["#A01520", "#DA1E28", "#FF4D55"],
      title: "Security Risks",
      desc: "Overprivileged agents risk destruction, secret leakage, and policy violations",
    },
    {
      icon: FaClock,
      iconColor: "#" + C.yellow50,
      accentColor: C.yellow50,
      gradientColors: ["#8A6800", "#B28600", "#F59E0B"],
      title: "Delivery Bottlenecks",
      desc: "Platform teams capacity-constrained; demand outpaces delivery by weeks",
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
      icon: FaGraduationCap,
      iconColor: "#" + C.teal60,
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      title: "Skill Gaps",
      desc: "App teams lack infra expertise; platform teams lack AI workflow experience",
    },
  ];

  for (let i = 0; i < complicationCards.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + cardGapX);
    const cy = gridStartY + row * (cardH + cardGapY);
    const ch = complicationCards[i];

    s3.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    const vBar = await renderVerticalGradientBar(ch.gradientColors, 8, 260);
    s3.addImage({ data: vBar, x: cx, y: cy, w: 0.08, h: cardH });

    const iconData = await iconToBase64Png(ch.icon, ch.iconColor, 256);
    s3.addImage({ data: iconData, x: cx + 0.2, y: cy + 0.2, w: 0.38, h: 0.38 });

    s3.addText(ch.title, {
      x: cx + 0.7, y: cy + 0.15, w: cardW - 0.9, h: 0.4,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    s3.addText(ch.desc, {
      x: cx + 0.7, y: cy + 0.6, w: cardW - 0.9, h: 0.7,
      fontSize: 11, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.55, w: 8.6, h: 0.5,
    fill: { color: "FFF0F0" },
    line: { color: C.red60, width: 1 },
  });

  const bulbIcon = await iconToBase64Png(FaLightbulb, "#" + C.red60, 256);
  s3.addImage({ data: bulbIcon, x: 0.9, y: 4.62, w: 0.3, h: 0.3 });

  s3.addText(
    [
      { text: "The opening: ", options: { bold: true, color: C.gray100 } },
      { text: "Customers see the potential but fear the risk. That tension is your opening.", options: { color: C.gray70 } },
    ],
    {
      x: 1.35, y: 4.55, w: 7.8, h: 0.5,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 4: ANSWER pt1 — Spec-Driven AI Infrastructure (3-col pillars)
  // =====================================================================
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  s4.addText("THE ANSWER", {
    x: 0.7, y: 0.35, w: 5, h: 0.2,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60, bold: true, charSpacing: 3, margin: 0,
  });

  s4.addText("Spec-Driven AI Infrastructure", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.4,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s4.addText(
    "Three pillars that let customers adopt AI-assisted infrastructure without compromising governance",
    {
      x: 0.7, y: 1.05, w: 8.6, h: 0.3,
      fontSize: 12, fontFace: "Arial",
      color: C.gray70, margin: 0,
    }
  );

  const answerPillars = [
    {
      icon: FaShieldAlt,
      iconColor: "#" + C.green60,
      accentColor: C.green60,
      gradientColors: ["#0E6027", "#198038", "#34D478"],
      title: "Guardrails & Controls",
      items: [
        "RBAC and agent isolation",
        "Secrets management via Vault",
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
        "Spec-driven development",
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
        "Modules: weeks → hours",
        "Composition: hours → minutes",
        "Providers: months → weeks",
        "Team upskilling via paired sessions",
      ],
    },
  ];

  const pillarW = 2.75;
  const pillarH = 2.95;
  const pillarGap = 0.45;
  const pillarStartX = 0.7;
  const pillarStartY = 1.5;

  for (let i = 0; i < answerPillars.length; i++) {
    const pilX = pillarStartX + i * (pillarW + pillarGap);
    const p = answerPillars[i];

    s4.addShape(pres.shapes.RECTANGLE, {
      x: pilX, y: pillarStartY, w: pillarW, h: pillarH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    const barImg = await renderGradientBar(p.gradientColors, 400, 8, 0);
    s4.addImage({ data: barImg, x: pilX, y: pillarStartY, w: pillarW, h: 0.08 });

    const iconData = await iconToBase64Png(p.icon, p.iconColor, 256);
    s4.addImage({
      data: iconData,
      x: pilX + 0.25, y: pillarStartY + 0.25, w: 0.42, h: 0.42,
    });

    s4.addText(p.title, {
      x: pilX + 0.25, y: pillarStartY + 0.78, w: pillarW - 0.5, h: 0.35,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    const bullets = p.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < p.items.length - 1,
        fontSize: 11, color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s4.addText(bullets, {
      x: pilX + 0.25, y: pillarStartY + 1.2, w: pillarW - 0.5, h: 1.6,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.65, w: 8.6, h: 0.55,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  const checkIcon = await iconToBase64Png(FaCheckCircle, "#" + C.teal60, 256);
  s4.addImage({ data: checkIcon, x: 0.9, y: 4.73, w: 0.3, h: 0.3 });

  s4.addText(
    [
      { text: "Proven at scale: ", options: { bold: true, color: C.gray100 } },
      { text: "Provider migrations completed in 3 hours at CBA. Modules delivered same-day.", options: { color: C.gray70 } },
    ],
    {
      x: 1.35, y: 4.65, w: 7.8, h: 0.55,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 5: ANSWER pt2 — The Building Blocks (4-column prerequisites)
  // =====================================================================
  const s5 = pres.addSlide();
  s5.background = { color: C.white };

  s5.addText("PREREQUISITES", {
    x: 0.7, y: 0.35, w: 5, h: 0.2,
    fontSize: 10, fontFace: "Arial",
    color: C.magenta60, bold: true, charSpacing: 3, margin: 0,
  });

  s5.addText("The Building Blocks Most Orgs Don't Have", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.4,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s5.addText(
    "AI-assisted infrastructure requires mature foundations across four domains",
    {
      x: 0.7, y: 1.05, w: 8.6, h: 0.3,
      fontSize: 12, fontFace: "Arial",
      color: C.gray70, margin: 0,
    }
  );

  const prereqs = [
    {
      icon: FaLayerGroup,
      iconColor: "#" + C.blue60,
      accentColor: C.blue60,
      gradientColors: ["#0043CE", "#0F62FE", "#4589FF"],
      title: "IaC Maturity",
      mandatory: false,
      items: [
        "Git workflows in place",
        "Private registry configured",
        "CI/CD pipelines operational",
        "Documented module standards",
      ],
    },
    {
      icon: FaLock,
      iconColor: "#" + C.green60,
      accentColor: C.green60,
      gradientColors: ["#0E6027", "#198038", "#34D478"],
      title: "Security & Governance",
      mandatory: false,
      items: [
        "RBAC policies defined",
        "Vault secrets management",
        "Policy-as-code gates",
        "Agent isolation patterns",
      ],
    },
    {
      icon: FaClipboardCheck,
      iconColor: "#" + C.purple60,
      accentColor: C.purple60,
      gradientColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      title: "Verification",
      mandatory: false,
      items: [
        "Testing practices in place",
        "Sandbox environments ready",
        "Observability configured",
        "Stakeholder alignment",
      ],
    },
    {
      icon: FaBrain,
      iconColor: "#" + C.teal60,
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      title: "AI & Tooling",
      mandatory: true,
      items: [
        "Frontier model access",
        "Agentic tooling deployed",
        "SDD methodology adopted",
        "Prompt engineering patterns",
      ],
    },
  ];

  const preW = 2.0;
  const preH = 2.95;
  const preGap = 0.27;
  const preStartX = 0.7;
  const preStartY = 1.5;

  for (let i = 0; i < prereqs.length; i++) {
    const preX = preStartX + i * (preW + preGap);
    const pr = prereqs[i];
    const isMandatory = pr.mandatory;

    // Card background
    s5.addShape(pres.shapes.RECTANGLE, {
      x: preX, y: preStartY, w: preW, h: preH,
      fill: { color: isMandatory ? "E8F7F7" : C.gray10 },
      line: isMandatory ? { color: pr.accentColor, width: 1.5 } : undefined,
      shadow: cardShadow(),
    });

    // Top accent bar (gradient)
    const barImg5 = await renderGradientBar(pr.gradientColors, 400, 8, 0);
    s5.addImage({ data: barImg5, x: preX, y: preStartY, w: preW, h: 0.08 });

    // REQUIRED badge
    if (isMandatory) {
      s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: preX + preW - 1.15, y: preStartY + 0.15, w: 0.95, h: 0.26,
        fill: { color: pr.accentColor }, rectRadius: 0.05,
      });
      s5.addText("REQUIRED", {
        x: preX + preW - 1.15, y: preStartY + 0.15, w: 0.95, h: 0.26,
        fontSize: 8, fontFace: "Arial", color: C.white,
        bold: true, align: "center", valign: "middle",
        charSpacing: 1.5, margin: 0,
      });
    }

    // Icon
    const iconData = await iconToBase64Png(pr.icon, pr.iconColor, 256);
    s5.addImage({
      data: iconData,
      x: preX + 0.2, y: preStartY + 0.25, w: 0.38, h: 0.38,
    });

    // Card title
    s5.addText(pr.title, {
      x: preX + 0.2, y: preStartY + 0.75, w: preW - 0.4, h: 0.35,
      fontSize: 13, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
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

    s5.addText(bullets, {
      x: preX + 0.2, y: preStartY + 1.15, w: preW - 0.4, h: 1.65,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.65, w: 8.6, h: 0.55,
    fill: { color: "F5F0FF" },
    line: { color: C.magenta60, width: 1 },
  });

  const toolsIcon = await iconToBase64Png(FaTools, "#" + C.magenta60, 256);
  s5.addImage({ data: toolsIcon, x: 0.9, y: 4.73, w: 0.3, h: 0.3 });

  s5.addText(
    [
      { text: "Services opportunity: ", options: { bold: true, color: C.gray100 } },
      { text: "10+ prerequisites, 6-12 months to build internally. This is where the services conversation starts.", options: { color: C.gray70 } },
    ],
    {
      x: 1.35, y: 4.65, w: 7.8, h: 0.55,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 6: ANSWER pt3 — Resident Technology Services (3-col timeline)
  // =====================================================================
  const s6 = pres.addSlide();
  s6.background = { color: C.white };

  s6.addText("ENGAGEMENT MODEL", {
    x: 0.7, y: 0.35, w: 5, h: 0.2,
    fontSize: 10, fontFace: "Arial",
    color: C.blue60, bold: true, charSpacing: 3, margin: 0,
  });

  s6.addText("Resident Technology Services", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.4,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s6.addText(
    "A phased engagement that builds capability progressively — from assessment to autonomous operation",
    {
      x: 0.7, y: 1.05, w: 8.6, h: 0.3,
      fontSize: 12, fontFace: "Arial",
      color: C.gray70, margin: 0,
    }
  );

  const timelinePhases = [
    {
      num: "1",
      title: "Assess & Establish",
      subtitle: "WEEKS 1-4",
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
      subtitle: "WEEKS 5-12",
      accentColor: C.teal60,
      gradientColors: ["#007D79", "#009D9A", "#2DD4BF"],
      items: [
        "Workshops and paired sessions",
        "SDD methodology adoption",
        "First AI-assisted module delivered",
        "CI/CD and policy integration",
      ],
    },
    {
      num: "3",
      title: "Scale & Handoff",
      subtitle: "WEEKS 13+",
      accentColor: C.green60,
      gradientColors: ["#0E6027", "#198038", "#34D478"],
      items: [
        "Cross-team adoption patterns",
        "Documented runbooks and standards",
        "Measured outcomes against KPIs",
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

    s6.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tlStartY, w: tlW, h: tlH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    const barImg6 = await renderGradientBar(tp.gradientColors, 400, 8, 0);
    s6.addImage({ data: barImg6, x: tx, y: tlStartY, w: tlW, h: 0.08 });

    // Number circle
    s6.addShape(pres.shapes.OVAL, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.2,
      w: 0.48, h: 0.48,
      fill: { color: tp.accentColor },
    });

    s6.addText(tp.num, {
      x: tx + tlW / 2 - 0.24, y: tlStartY + 0.2,
      w: 0.48, h: 0.48,
      fontSize: 20, fontFace: "Arial",
      color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Phase title
    s6.addText(tp.title, {
      x: tx + 0.2, y: tlStartY + 0.8, w: tlW - 0.4, h: 0.35,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, align: "center", margin: 0,
    });

    // Stage label
    s6.addText(tp.subtitle, {
      x: tx + 0.2, y: tlStartY + 1.1, w: tlW - 0.4, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: C.gray50, bold: true, align: "center", charSpacing: 2, margin: 0,
    });

    // Bullet items
    const bullets = tp.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < tp.items.length - 1,
        fontSize: 10, color: C.gray70,
        paraSpaceAfter: 4,
      },
    }));

    s6.addText(bullets, {
      x: tx + 0.2, y: tlStartY + 1.4, w: tlW - 0.4, h: 1.45,
      fontFace: "Arial", valign: "top", margin: 0,
    });

    // Arrow connector between cards
    if (i < timelinePhases.length - 1) {
      const arrowIcon = await iconToBase64Png(FaArrowRight, "#" + tp.accentColor, 256);
      s6.addImage({
        data: arrowIcon,
        x: tx + tlW + tlGap / 2 - 0.14,
        y: tlStartY + tlH / 2 - 0.14,
        w: 0.28, h: 0.28,
      });
    }
  }

  // Bottom callout bar
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.7, w: 8.6, h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const handshakeIcon = await iconToBase64Png(FaHandshake, "#" + C.blue60, 256);
  s6.addImage({ data: handshakeIcon, x: 0.9, y: 4.77, w: 0.35, h: 0.35 });

  s6.addText(
    [
      { text: "Trusted advisor model: ", options: { bold: true, color: C.gray100 } },
      { text: "Independent expert who stays until the team is self-sufficient.", options: { color: C.gray70 } },
    ],
    {
      x: 1.4, y: 4.7, w: 7.7, h: 0.55,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 7: How to Bring This to Your Customers (3-col sales signals)
  // =====================================================================
  const s7 = pres.addSlide();
  s7.background = { color: C.white };

  s7.addText("SALES PLAYBOOK", {
    x: 0.7, y: 0.35, w: 5, h: 0.2,
    fontSize: 10, fontFace: "Arial",
    color: C.green60, bold: true, charSpacing: 3, margin: 0,
  });

  s7.addText("How to Bring This to Your Customers", {
    x: 0.7, y: 0.6, w: 8.6, h: 0.4,
    fontSize: 22, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  s7.addText(
    "Three customer signals and how to lead the conversation",
    {
      x: 0.7, y: 1.05, w: 8.6, h: 0.3,
      fontSize: 12, fontFace: "Arial",
      color: C.gray70, margin: 0,
    }
  );

  const salesPillars = [
    {
      icon: FaSearch,
      iconColor: "#" + C.blue60,
      accentColor: C.blue60,
      gradientColors: ["#0043CE", "#0F62FE", "#4589FF"],
      title: "Exploring AI for IaC",
      signal: "Using Terraform at scale, asking about AI/copilot tools",
      leadWith: "Lead with speed + safety",
      items: [
        "Demo AI-assisted module delivery",
        "Show guardrails-first approach",
        "Quantify acceleration metrics",
        "Reference CBA case study",
      ],
    },
    {
      icon: FaShieldAlt,
      iconColor: "#" + C.red60,
      accentColor: C.red60,
      gradientColors: ["#A01520", "#DA1E28", "#FF4D55"],
      title: "Worried About Risk",
      signal: "Concerned about security and compliance, hesitant on AI",
      leadWith: "Lead with governance",
      items: [
        "Emphasize human-in-loop gates",
        "Show policy-as-code controls",
        "Highlight agent isolation patterns",
        "Map to their compliance framework",
      ],
    },
    {
      icon: FaUserTie,
      iconColor: "#" + C.purple60,
      accentColor: C.purple60,
      gradientColors: ["#627EEF", "#8A3FFC", "#D946EF"],
      title: "Want Expert Guidance",
      signal: "Platform team stretched thin, looking for consulting",
      leadWith: "Lead with services",
      items: [
        "Present 3-stage engagement model",
        "Emphasize knowledge transfer",
        "Highlight self-sufficiency goal",
        "Position as trusted advisor",
      ],
    },
  ];

  const spW = 2.75;
  const spH = 3.15;
  const spGap = 0.45;
  const spStartX = 0.7;
  const spStartY = 1.45;

  for (let i = 0; i < salesPillars.length; i++) {
    const spX = spStartX + i * (spW + spGap);
    const sp = salesPillars[i];

    s7.addShape(pres.shapes.RECTANGLE, {
      x: spX, y: spStartY, w: spW, h: spH,
      fill: { color: C.gray10 }, shadow: cardShadow(),
    });

    const barImg7 = await renderGradientBar(sp.gradientColors, 400, 8, 0);
    s7.addImage({ data: barImg7, x: spX, y: spStartY, w: spW, h: 0.08 });

    // Icon
    const iconData = await iconToBase64Png(sp.icon, sp.iconColor, 256);
    s7.addImage({
      data: iconData,
      x: spX + 0.25, y: spStartY + 0.2, w: 0.38, h: 0.38,
    });

    // Pillar title (single line)
    s7.addText(sp.title, {
      x: spX + 0.25, y: spStartY + 0.68, w: spW - 0.5, h: 0.3,
      fontSize: 13, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Signal description (constrained to 2 lines)
    s7.addText(sp.signal, {
      x: spX + 0.25, y: spStartY + 1.0, w: spW - 0.5, h: 0.42,
      fontSize: 10, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });

    // "Lead with..." badge — fixed Y for consistent alignment
    const badgeY = spStartY + 1.52;
    s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: spX + 0.2, y: badgeY, w: spW - 0.4, h: 0.28,
      fill: { color: sp.accentColor }, rectRadius: 0.05,
    });
    s7.addText(sp.leadWith.toUpperCase(), {
      x: spX + 0.2, y: badgeY, w: spW - 0.4, h: 0.28,
      fontSize: 9, fontFace: "Arial", color: C.white,
      bold: true, align: "center", valign: "middle",
      charSpacing: 1.5, margin: 0,
    });

    // Action items
    const bullets = sp.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < sp.items.length - 1,
        fontSize: 10, color: C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s7.addText(bullets, {
      x: spX + 0.25, y: badgeY + 0.4, w: spW - 0.5, h: 1.15,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Bottom callout bar
  s7.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.8, w: 8.6, h: 0.5,
    fill: { color: "F0FFF4" },
    line: { color: C.green60, width: 1 },
  });

  const starIcon = await iconToBase64Png(FaStar, "#" + C.green60, 256);
  s7.addImage({ data: starIcon, x: 0.9, y: 4.87, w: 0.28, h: 0.28 });

  s7.addText(
    [
      { text: "The hook: ", options: { bold: true, color: C.gray100 } },
      { text: "AI speed with enterprise safety. We're the only vendor that delivers both.", options: { color: C.gray70 } },
    ],
    {
      x: 1.35, y: 4.8, w: 7.8, h: 0.5,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
    }
  );

  // =====================================================================
  // SLIDE 8: CLOSING (full-bleed captured image)
  // =====================================================================
  const s8 = pres.addSlide();
  s8.addImage({ path: closingPng, x: 0, y: 0, w: 10, h: 5.625 });

  // =====================================================================
  // WRITE OUTPUT
  // =====================================================================
  const outputPath = resolve(
    REPO_ROOT,
    "HashiCorp-QBR-AI-Infrastructure.pptx"
  );
  await pres.writeFile({ fileName: outputPath });
  console.log(`\n✅ Built: ${outputPath}`);
}

buildPresentation().catch(console.error);
