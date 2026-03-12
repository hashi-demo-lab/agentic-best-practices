#!/usr/bin/env node
/**
 * Build: Technology Services Proposal
 * Hybrid approach — HTML capture for title/closing, pptxgenjs for content.
 *
 * Run from repo root:
 *   node .claude/skills/ibm-deck-workspace/iteration-3/eval-hybrid-proposal/with_skill/outputs/build-technology-services-proposal.mjs
 */

import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaExclamationTriangle,
  FaLock,
  FaClock,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaCogs,
  FaUsers,
  FaClipboardCheck,
  FaNetworkWired,
  FaKey,
  FaCheckCircle,
} from "react-icons/fa";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Paths ──
const SKILL_DIR = resolve(__dirname, "../../../../../ibm-deck");
const CAPTURE_SCRIPT = resolve(SKILL_DIR, "scripts/capture-title.mjs");
const OUTPUT_DIR = __dirname;
const IMAGES_DIR = resolve(OUTPUT_DIR, "images");
mkdirSync(IMAGES_DIR, { recursive: true });

// ── IBM Carbon Design Tokens (NO "#" prefix!) ──
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

// ── Pixel-to-inch helper (1920px = 10") ──
const px = (v) => v / 192;

// ── Shadow factories (CRITICAL: always return fresh objects) ──
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.08,
});

// ── Icon rendering ──
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

// ── Gradient SVG helpers ──
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

// ══════════════════════════════════════════════════════════════
// STEP 1: Capture title & closing slides via Chrome headless
// ══════════════════════════════════════════════════════════════
console.log("Capturing title slide...");
execSync(
  `node "${CAPTURE_SCRIPT}" ` +
  `--line1 "Technology Services" --line2 "Proposal" ` +
  `--subtitle "Driving Operational Excellence Through Modern Infrastructure" ` +
  `--footer "© Technology Services" ` +
  `--output "${resolve(IMAGES_DIR, "slide-title.png")}"`,
  { stdio: "inherit" }
);

console.log("Capturing closing slide...");
execSync(
  `node "${CAPTURE_SCRIPT}" ` +
  `--line1 "Thank You" --line2 "" ` +
  `--subtitle "Ready to accelerate your technology transformation" ` +
  `--footer "© Technology Services" ` +
  `--output "${resolve(IMAGES_DIR, "slide-closing.png")}"`,
  { stdio: "inherit" }
);

// ══════════════════════════════════════════════════════════════
// STEP 2: Build the PPTX
// ══════════════════════════════════════════════════════════════
async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Technology Services";
  pres.title = "Technology Services Proposal";

  // ────────────────────────────────────────────
  // SLIDE 1: Title (HTML capture → full-bleed)
  // ────────────────────────────────────────────
  const s1 = pres.addSlide();
  s1.addImage({
    path: resolve(IMAGES_DIR, "slide-title.png"),
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // ────────────────────────────────────────────
  // SLIDE 2: The Challenge — 2x2 grid
  // ────────────────────────────────────────────
  const s2 = pres.addSlide();
  s2.background = { color: C.white };

  // Section label
  s2.addText("CURRENT STATE", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.red60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  const s2TitleY = 0.6;
  const s2TitleH = px(90);
  s2.addText("The Challenge", {
    x: 0.7, y: s2TitleY, w: 8.6, h: s2TitleH,
    fontSize: 24, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle — derived from title
  const s2SubY = s2TitleY + s2TitleH + px(6);
  s2.addText("Key risks and obstacles impacting operational efficiency today", {
    x: 0.7, y: s2SubY, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  // 2x2 grid layout
  const challengeCards = [
    {
      icon: FaExclamationTriangle,
      title: "Security Vulnerabilities",
      desc: "Manual provisioning creates inconsistent configurations, exposing critical infrastructure to preventable threats.",
      gradient: ["#A01520", "#DA1E28", "#FF4D55"],
      accent: C.red60,
    },
    {
      icon: FaClock,
      title: "Slow Delivery Cycles",
      desc: "Teams wait days for infrastructure changes, blocking application deployments and business initiatives.",
      gradient: ["#8A6800", "#B28600", "#F59E0B"],
      accent: C.yellow50,
    },
    {
      icon: FaChartLine,
      title: "Uncontrolled Costs",
      desc: "Lack of visibility into resource usage leads to sprawl, wasted spend, and budget overruns.",
      gradient: ["#627EEF", "#8A3FFC", "#D946EF"],
      accent: C.purple60,
    },
    {
      icon: FaLock,
      title: "Compliance Gaps",
      desc: "Ad-hoc processes make it difficult to enforce governance policies and maintain audit readiness.",
      gradient: ["#0043CE", "#0F62FE", "#4589FF"],
      accent: C.blue60,
    },
  ];

  const cardW = 4.1, cardH = 1.45;
  const cardGapX = 0.4, cardGapY = 0.25;
  const gridStartX = 0.7, gridStartY = 1.45;

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + cardGapX);
    const cy = gridStartY + row * (cardH + cardGapY);
    const card = challengeCards[i];

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left gradient accent bar
    const vBar = await renderVerticalGradientBar(card.gradient, 8, 280);
    s2.addImage({ data: vBar, x: cx, y: cy, w: 0.08, h: cardH });

    // Icon
    const iconData = await iconToBase64Png(card.icon, "#" + card.accent, 256);
    s2.addImage({
      data: iconData,
      x: cx + 0.22, y: cy + 0.18, w: 0.38, h: 0.38,
    });

    // Card title
    s2.addText(card.title, {
      x: cx + 0.72, y: cy + 0.12, w: cardW - 0.95, h: 0.4,
      fontSize: 15, fontFace: "Arial",
      color: C.gray100, bold: true, valign: "middle", margin: 0,
    });

    // Card description
    s2.addText(card.desc, {
      x: cx + 0.72, y: cy + 0.58, w: cardW - 0.95, h: 0.78,
      fontSize: 11, fontFace: "Arial",
      color: C.gray70, valign: "top", margin: 0,
    });
  }

  // Callout bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.65, w: 8.6, h: 0.55,
    fill: { color: "FFF0F0" },
    line: { color: C.red60, width: 1 },
  });

  const alertIcon = await iconToBase64Png(FaExclamationTriangle, "#" + C.red60, 256);
  s2.addImage({
    data: alertIcon,
    x: 0.9, y: 4.73, w: 0.32, h: 0.32,
  });

  s2.addText([
    { text: "Impact: ", options: { bold: true, color: C.gray100 } },
    { text: "These challenges compound over time, increasing risk and reducing team velocity.", options: { color: C.gray70 } },
  ], {
    x: 1.35, y: 4.65, w: 7.75, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ────────────────────────────────────────────
  // SLIDE 3: Value Proposition — 3 pillar cards
  // ────────────────────────────────────────────
  const s3 = pres.addSlide();
  s3.background = { color: C.white };

  // Section label
  s3.addText("OUR APPROACH", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.teal60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  const s3TitleY = 0.6;
  const s3TitleH = px(90);
  s3.addText("Value Proposition", {
    x: 0.7, y: s3TitleY, w: 8.6, h: s3TitleH,
    fontSize: 24, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle — derived from title
  const s3SubY = s3TitleY + s3TitleH + px(6);
  s3.addText("What our Technology Services engagement delivers", {
    x: 0.7, y: s3SubY, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  const pillars = [
    {
      icon: FaShieldAlt,
      title: "Security & Governance",
      accent: C.teal60,
      gradient: ["#007D79", "#009D9A", "#2DD4BF"],
      items: [
        "Policy-as-code enforcement",
        "Automated compliance checks",
        "Role-based access controls",
        "Continuous audit readiness",
      ],
    },
    {
      icon: FaRocket,
      title: "Accelerated Delivery",
      accent: C.blue60,
      gradient: ["#0043CE", "#0F62FE", "#4589FF"],
      items: [
        "Self-service infrastructure",
        "Standardized modules & templates",
        "Automated testing pipelines",
        "Reduced time-to-production",
      ],
    },
    {
      icon: FaCogs,
      title: "Operational Efficiency",
      accent: C.purple60,
      gradient: ["#627EEF", "#8A3FFC", "#D946EF"],
      items: [
        "Cost visibility & optimization",
        "Drift detection & remediation",
        "Centralized state management",
        "Scalable platform patterns",
      ],
    },
  ];

  const pillarW = 2.75, pillarH = 2.95;
  const pillarGap = 0.45;
  const pillarStartX = 0.7, pillarStartY = 1.55;

  for (let i = 0; i < 3; i++) {
    const ppx = pillarStartX + i * (pillarW + pillarGap);
    const pillar = pillars[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: ppx, y: pillarStartY, w: pillarW, h: pillarH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top gradient accent bar
    const topBar = await renderGradientBar(pillar.gradient, 400, 8, 0);
    s3.addImage({ data: topBar, x: ppx, y: pillarStartY, w: pillarW, h: 0.08 });

    // Icon
    const pillarIcon = await iconToBase64Png(pillar.icon, "#" + pillar.accent, 256);
    s3.addImage({
      data: pillarIcon,
      x: ppx + 0.25, y: pillarStartY + 0.25, w: 0.42, h: 0.42,
    });

    // Pillar title
    s3.addText(pillar.title, {
      x: ppx + 0.25, y: pillarStartY + 0.78, w: pillarW - 0.5, h: 0.35,
      fontSize: 14, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Bullet items
    const bullets = pillar.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < pillar.items.length - 1,
        fontSize: 11, color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s3.addText(bullets, {
      x: ppx + 0.25, y: pillarStartY + 1.2, w: pillarW - 0.5, h: 1.6,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Callout bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.75, w: 8.6, h: 0.55,
    fill: { color: "F0FFFC" },
    line: { color: C.teal60, width: 1 },
  });

  const handshakeIcon = await iconToBase64Png(FaCheckCircle, "#" + C.teal60, 256);
  s3.addImage({
    data: handshakeIcon,
    x: 0.9, y: 4.83, w: 0.32, h: 0.32,
  });

  s3.addText([
    { text: "Outcome: ", options: { bold: true, color: C.gray100 } },
    { text: "A secure, automated, and cost-efficient infrastructure platform that scales with your business.", options: { color: C.gray70 } },
  ], {
    x: 1.35, y: 4.75, w: 7.75, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ────────────────────────────────────────────
  // SLIDE 4: Pre-requisites — 4 narrow columns
  // ────────────────────────────────────────────
  const s4 = pres.addSlide();
  s4.background = { color: C.white };

  // Section label
  s4.addText("GETTING STARTED", {
    x: 0.7, y: 0.35, w: 5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: C.green60, bold: true, charSpacing: 3, margin: 0,
  });

  // Title
  const s4TitleY = 0.6;
  const s4TitleH = px(90);
  s4.addText("Pre-requisites", {
    x: 0.7, y: s4TitleY, w: 8.6, h: s4TitleH,
    fontSize: 24, fontFace: "Arial Black",
    color: C.gray100, bold: true, margin: 0,
  });

  // Subtitle — derived from title
  const s4SubY = s4TitleY + s4TitleH + px(6);
  s4.addText("What your organization needs in place before we begin", {
    x: 0.7, y: s4SubY, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.gray70, margin: 0,
  });

  const prereqs = [
    {
      icon: FaNetworkWired,
      title: "Network Access",
      accent: C.green60,
      gradient: ["#0E6027", "#198038", "#34D478"],
      items: [
        "VPN or direct connect",
        "Firewall rules documented",
        "DNS delegation plan",
      ],
    },
    {
      icon: FaUsers,
      title: "Team Readiness",
      accent: C.blue60,
      gradient: ["#0043CE", "#0F62FE", "#4589FF"],
      items: [
        "Platform team identified",
        "Engineering leads assigned",
        "Training schedule agreed",
      ],
    },
    {
      icon: FaClipboardCheck,
      title: "Governance Baseline",
      accent: C.purple60,
      gradient: ["#627EEF", "#8A3FFC", "#D946EF"],
      items: [
        "Naming conventions defined",
        "Tagging standards approved",
        "Change process documented",
      ],
    },
    {
      icon: FaKey,
      title: "Identity & Access",
      accent: C.teal60,
      gradient: ["#007D79", "#009D9A", "#2DD4BF"],
      items: [
        "SSO/SAML provider ready",
        "Service accounts provisioned",
        "Least-privilege roles defined",
        "MFA enforced org-wide",
      ],
      required: true,
    },
  ];

  const preW = 2.0, preH = 2.95;
  const preGap = 0.27;
  const preStartX = 0.7, preStartY = 1.5;

  for (let i = 0; i < 4; i++) {
    const cx = preStartX + i * (preW + preGap);
    const cy = preStartY;
    const pre = prereqs[i];
    const isMandatory = pre.required === true;

    // Card background — tinted + bordered for mandatory
    s4.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: preW, h: preH,
      fill: { color: isMandatory ? "E8F7F7" : C.gray10 },
      line: isMandatory ? { color: pre.accent, width: 1.5 } : undefined,
      shadow: cardShadow(),
    });

    // Top gradient accent bar
    const topBar = await renderGradientBar(pre.gradient, 400, 8, 0);
    s4.addImage({ data: topBar, x: cx, y: cy, w: preW, h: 0.08 });

    // REQUIRED badge on mandatory card
    if (isMandatory) {
      s4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx + preW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
        fill: { color: pre.accent }, rectRadius: 0.05,
      });
      s4.addText("REQUIRED", {
        x: cx + preW - 1.15, y: cy + 0.15, w: 0.95, h: 0.26,
        fontSize: 8, fontFace: "Arial", color: C.white,
        bold: true, align: "center", valign: "middle",
        charSpacing: 1.5, margin: 0,
      });
    }

    // Icon
    const preIcon = await iconToBase64Png(pre.icon, "#" + pre.accent, 256);
    s4.addImage({
      data: preIcon,
      x: cx + 0.25, y: cy + 0.25, w: 0.42, h: 0.42,
    });

    // Card title
    s4.addText(pre.title, {
      x: cx + 0.2, y: cy + 0.78, w: preW - 0.4, h: 0.35,
      fontSize: 13, fontFace: "Arial",
      color: C.gray100, bold: true, margin: 0,
    });

    // Bullet items
    const bullets = pre.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < pre.items.length - 1,
        fontSize: 10,
        color: isMandatory ? C.gray100 : C.gray70,
        paraSpaceAfter: 5,
      },
    }));

    s4.addText(bullets, {
      x: cx + 0.2, y: cy + 1.2, w: preW - 0.4, h: 1.6,
      fontFace: "Arial", valign: "top", margin: 0,
    });
  }

  // Callout bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.7, w: 8.6, h: 0.55,
    fill: { color: "F0FFF4" },
    line: { color: C.green60, width: 1 },
  });

  const readyIcon = await iconToBase64Png(FaCheckCircle, "#" + C.green60, 256);
  s4.addImage({
    data: readyIcon,
    x: 0.9, y: 4.78, w: 0.32, h: 0.32,
  });

  s4.addText([
    { text: "Note: ", options: { bold: true, color: C.gray100 } },
    { text: "Identity & Access is mandatory — all other items can be addressed during the engagement.", options: { color: C.gray70 } },
  ], {
    x: 1.35, y: 4.7, w: 7.75, h: 0.55,
    fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
  });

  // ────────────────────────────────────────────
  // SLIDE 5: Closing (HTML capture → full-bleed)
  // ────────────────────────────────────────────
  const s5 = pres.addSlide();
  s5.addImage({
    path: resolve(IMAGES_DIR, "slide-closing.png"),
    x: 0, y: 0, w: 10, h: 5.625,
  });

  // ────────────────────────────────────────────
  // Write PPTX
  // ────────────────────────────────────────────
  const outputFile = resolve(OUTPUT_DIR, "technology-services-proposal.pptx");
  await pres.writeFile({ fileName: outputFile });
  console.log(`\nPPTX saved to: ${outputFile}`);
}

buildPresentation().catch(console.error);
