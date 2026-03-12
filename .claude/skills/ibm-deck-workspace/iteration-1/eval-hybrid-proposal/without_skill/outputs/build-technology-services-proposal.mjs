/**
 * build-technology-services-proposal.mjs
 *
 * Hybrid approach: HTML-captured title/closing slides + programmatic Carbon slides.
 * Uses pptxgenjs + playwright-core for HTML capture.
 *
 * IBM Carbon Design System tokens (light theme):
 *   - Background:     #FFFFFF (ui-background)
 *   - Text primary:   #161616 (text-01)
 *   - Text secondary:  #525252 (text-02)
 *   - Text helper:    #6F6F6F (text-03)
 *   - Border subtle:  #E0E0E0 (ui-03)
 *   - Interactive:    #0F62FE (interactive-01)
 *   - Danger:         #DA1E28 (danger-01)
 *   - Support success:#198038 (support-02)
 *   - Support warning:#F1C21B (support-03)
 *   - Cool gray 10:   #F4F4F4
 *   - Cool gray 20:   #E0E0E0
 *   - Cool gray 90:   #21272A
 *   - Blue 60:        #0F62FE
 *   - Blue 70:        #0043CE
 *   - Blue 80:        #002D9C
 *   - Teal 50:        #009D9A
 *   - Purple 60:      #8A3FFC
 *   - Magenta 60:     #D12771
 *
 * Font: IBM Plex Sans (400, 600, 700)
 */

import pptxgenjs from "pptxgenjs";
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Constants ──────────────────────────────────────────────────────
const OUTPUT_DIR = __dirname;
const OUTPUT_FILE = join(OUTPUT_DIR, "technology-services-proposal.pptx");
const TEMP_DIR = join(OUTPUT_DIR, "_tmp_captures");

const CARBON = {
  white: "FFFFFF",
  gray10: "F4F4F4",
  gray20: "E0E0E0",
  gray30: "C6C6C6",
  gray50: "8D8D8D",
  gray60: "6F6F6F",
  gray70: "525252",
  gray80: "393939",
  gray90: "262626",
  gray100: "161616",
  blue60: "0F62FE",
  blue70: "0043CE",
  blue80: "002D9C",
  teal50: "009D9A",
  teal60: "007D79",
  purple60: "8A3FFC",
  magenta60: "D12771",
  red60: "DA1E28",
  green50: "198038",
  yellow30: "F1C21B",
};

// ─── HTML Templates ─────────────────────────────────────────────────

function titleSlideHTML() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1920px; height: 1080px; overflow: hidden;
    font-family: 'IBM Plex Sans', sans-serif;
    background: linear-gradient(135deg, #002D9C 0%, #0043CE 35%, #0F62FE 65%, #4589FF 100%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0 96px 96px 96px;
    position: relative;
  }
  /* Subtle geometric pattern */
  body::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background:
      linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%);
    background-size: 80px 80px;
    background-position: 0 0, 0 40px, 40px -40px, -40px 0px;
  }
  /* Top-right decorative arc */
  .arc {
    position: absolute; top: -200px; right: -100px;
    width: 800px; height: 800px;
    border: 2px solid rgba(255,255,255,0.08);
    border-radius: 50%;
  }
  .arc:nth-child(2) {
    width: 650px; height: 650px;
    top: -130px; right: -40px;
    border-color: rgba(255,255,255,0.05);
  }
  .arc:nth-child(3) {
    width: 500px; height: 500px;
    top: -60px; right: 20px;
    border-color: rgba(255,255,255,0.03);
  }
  .ibm-logo {
    position: absolute; top: 64px; left: 96px;
    font-size: 28px; font-weight: 700; color: rgba(255,255,255,0.95);
    letter-spacing: 3px;
  }
  .tag {
    font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.6);
    letter-spacing: 2.5px; text-transform: uppercase;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 64px; font-weight: 700; color: #FFFFFF;
    line-height: 1.1; margin-bottom: 24px;
    max-width: 1100px;
  }
  .subtitle {
    font-size: 24px; font-weight: 300; color: rgba(255,255,255,0.75);
    max-width: 800px; line-height: 1.5;
  }
  .divider {
    width: 64px; height: 4px;
    background: rgba(255,255,255,0.4);
    margin: 32px 0;
    border-radius: 2px;
  }
  .date {
    font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.5);
    margin-top: 8px;
  }
</style>
</head>
<body>
  <div class="arc"></div>
  <div class="arc"></div>
  <div class="arc"></div>
  <div class="ibm-logo">IBM</div>
  <div class="tag">Technology Services</div>
  <h1>Technology Services Proposal</h1>
  <div class="subtitle">Accelerating digital transformation through enterprise-grade cloud infrastructure, AI-powered automation, and modern platform engineering.</div>
  <div class="divider"></div>
  <div class="date">March 2026 &nbsp;|&nbsp; Confidential</div>
</body>
</html>`;
}

function closingSlideHTML() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1920px; height: 1080px; overflow: hidden;
    font-family: 'IBM Plex Sans', sans-serif;
    background: linear-gradient(135deg, #002D9C 0%, #0043CE 35%, #0F62FE 65%, #4589FF 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative;
  }
  body::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background:
      linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%);
    background-size: 80px 80px;
    background-position: 0 0, 0 40px, 40px -40px, -40px 0px;
  }
  .arc {
    position: absolute; bottom: -300px; left: -200px;
    width: 900px; height: 900px;
    border: 2px solid rgba(255,255,255,0.06);
    border-radius: 50%;
  }
  .arc:nth-child(2) {
    width: 700px; height: 700px;
    bottom: -200px; left: -100px;
    border-color: rgba(255,255,255,0.04);
  }
  .ibm-logo {
    font-size: 48px; font-weight: 700; color: rgba(255,255,255,0.95);
    letter-spacing: 5px; margin-bottom: 48px;
  }
  h1 {
    font-size: 56px; font-weight: 700; color: #FFFFFF;
    margin-bottom: 20px;
  }
  .message {
    font-size: 22px; font-weight: 300; color: rgba(255,255,255,0.7);
    margin-bottom: 64px; text-align: center; max-width: 700px; line-height: 1.6;
  }
  .contact-row {
    display: flex; gap: 64px; align-items: center;
  }
  .contact-item {
    text-align: center;
  }
  .contact-label {
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45);
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 8px;
  }
  .contact-value {
    font-size: 18px; font-weight: 400; color: rgba(255,255,255,0.85);
  }
  .divider-v {
    width: 1px; height: 48px; background: rgba(255,255,255,0.2);
  }
</style>
</head>
<body>
  <div class="arc"></div>
  <div class="arc"></div>
  <div class="ibm-logo">IBM</div>
  <h1>Thank You</h1>
  <div class="message">We look forward to partnering with you on your digital transformation journey.</div>
  <div class="contact-row">
    <div class="contact-item">
      <div class="contact-label">Email</div>
      <div class="contact-value">services@ibm.com</div>
    </div>
    <div class="divider-v"></div>
    <div class="contact-item">
      <div class="contact-label">Web</div>
      <div class="contact-value">ibm.com/services</div>
    </div>
    <div class="divider-v"></div>
    <div class="contact-item">
      <div class="contact-label">Phone</div>
      <div class="contact-value">1-800-IBM-7080</div>
    </div>
  </div>
</body>
</html>`;
}

// ─── Capture HTML to PNG ────────────────────────────────────────────

async function captureHTML(html, outputPath) {
  if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

  const htmlPath = join(TEMP_DIR, `slide_${Date.now()}.html`);
  writeFileSync(htmlPath, html);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
  // Extra wait for fonts
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outputPath, type: "png" });
  await browser.close();
  console.log(`  Captured: ${outputPath}`);
  return outputPath;
}

// ─── Slide Builders ─────────────────────────────────────────────────

function addChallengeSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { fill: CARBON.white };

  // Section tag
  slide.addText("THE CHALLENGE", {
    x: 0.75,
    y: 0.55,
    w: 4,
    h: 0.3,
    fontSize: 11,
    fontFace: "IBM Plex Sans",
    bold: true,
    color: CARBON.blue60,
    letterSpacing: 2.5,
  });

  // Title
  slide.addText("Why Action Is Needed Now", {
    x: 0.75,
    y: 0.85,
    w: 8,
    h: 0.55,
    fontSize: 32,
    fontFace: "IBM Plex Sans",
    bold: true,
    color: CARBON.gray100,
  });

  // Subtitle
  slide.addText(
    "Critical risks threatening operational efficiency and competitive positioning",
    {
      x: 0.75,
      y: 1.4,
      w: 8,
      h: 0.35,
      fontSize: 14,
      fontFace: "IBM Plex Sans",
      color: CARBON.gray70,
    }
  );

  // Divider line
  slide.addShape(pres.ShapeType.rect, {
    x: 0.75,
    y: 1.9,
    w: 8.5,
    h: 0.015,
    fill: { color: CARBON.gray20 },
  });

  // 2x2 challenge cards
  const challenges = [
    {
      icon: "\u26A0",
      title: "Legacy Infrastructure Debt",
      desc: "Aging on-premises systems driving 40% higher maintenance costs with increasing failure rates and security vulnerabilities.",
      accent: CARBON.red60,
    },
    {
      icon: "\u23F1",
      title: "Slow Time-to-Market",
      desc: "Manual deployment pipelines creating 6-8 week release cycles, limiting ability to respond to market demands.",
      accent: CARBON.yellow30,
    },
    {
      icon: "\uD83D\uDD12",
      title: "Security & Compliance Gaps",
      desc: "Inconsistent security posture across environments with fragmented audit trails and policy enforcement.",
      accent: CARBON.magenta60,
    },
    {
      icon: "\uD83D\uDCC9",
      title: "Talent & Skills Shortage",
      desc: "Critical gaps in cloud-native and AI/ML expertise slowing innovation initiatives and increasing vendor dependency.",
      accent: CARBON.purple60,
    },
  ];

  const cardW = 4.05;
  const cardH = 2.2;
  const startX = 0.75;
  const startY = 2.2;
  const gapX = 0.4;
  const gapY = 0.35;

  challenges.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    // Card background
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: y,
      w: cardW,
      h: cardH,
      fill: { color: CARBON.gray10 },
      rectRadius: 0.06,
      shadow: {
        type: "outer",
        blur: 6,
        offset: 2,
        color: "000000",
        opacity: 0.06,
      },
    });

    // Left accent bar (gradient effect via two overlapping rects)
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: y,
      w: 0.06,
      h: cardH,
      fill: { color: c.accent },
      rectRadius: 0.06,
    });
    // Cover the right-side radius of the accent
    slide.addShape(pres.ShapeType.rect, {
      x: x + 0.03,
      y: y,
      w: 0.04,
      h: cardH,
      fill: { color: c.accent },
    });

    // Icon
    slide.addText(c.icon, {
      x: x + 0.28,
      y: y + 0.2,
      w: 0.5,
      h: 0.45,
      fontSize: 24,
      fontFace: "IBM Plex Sans",
    });

    // Card title
    slide.addText(c.title, {
      x: x + 0.28,
      y: y + 0.65,
      w: cardW - 0.55,
      h: 0.35,
      fontSize: 16,
      fontFace: "IBM Plex Sans",
      bold: true,
      color: CARBON.gray100,
    });

    // Card description
    slide.addText(c.desc, {
      x: x + 0.28,
      y: y + 1.0,
      w: cardW - 0.55,
      h: 1.0,
      fontSize: 12.5,
      fontFace: "IBM Plex Sans",
      color: CARBON.gray70,
      lineSpacingMultiple: 1.35,
      valign: "top",
    });
  });

  // Page number
  slide.addText("02", {
    x: 8.9,
    y: 7.0,
    w: 0.6,
    h: 0.3,
    fontSize: 10,
    fontFace: "IBM Plex Sans",
    color: CARBON.gray50,
    align: "right",
  });
}

function addValuePropositionSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { fill: CARBON.white };

  // Section tag
  slide.addText("VALUE PROPOSITION", {
    x: 0.75,
    y: 0.55,
    w: 4,
    h: 0.3,
    fontSize: 11,
    fontFace: "IBM Plex Sans",
    bold: true,
    color: CARBON.teal50,
    letterSpacing: 2.5,
  });

  // Title
  slide.addText("What We Deliver", {
    x: 0.75,
    y: 0.85,
    w: 8,
    h: 0.55,
    fontSize: 32,
    fontFace: "IBM Plex Sans",
    bold: true,
    color: CARBON.gray100,
  });

  // Subtitle
  slide.addText(
    "Three strategic pillars powering your modernization journey",
    {
      x: 0.75,
      y: 1.4,
      w: 8,
      h: 0.35,
      fontSize: 14,
      fontFace: "IBM Plex Sans",
      color: CARBON.gray70,
    }
  );

  // Divider
  slide.addShape(pres.ShapeType.rect, {
    x: 0.75,
    y: 1.9,
    w: 8.5,
    h: 0.015,
    fill: { color: CARBON.gray20 },
  });

  const pillars = [
    {
      num: "01",
      title: "Cloud Platform\nEngineering",
      accent: CARBON.blue60,
      items: [
        "Hybrid cloud architecture design",
        "Infrastructure as Code (Terraform)",
        "Kubernetes & container orchestration",
        "CI/CD pipeline automation",
        "Cost optimization & FinOps",
      ],
    },
    {
      num: "02",
      title: "AI-Powered\nAutomation",
      accent: CARBON.purple60,
      items: [
        "Intelligent workflow automation",
        "Agentic AI for operations",
        "Predictive analytics & monitoring",
        "Natural language interfaces",
        "Automated compliance checks",
      ],
    },
    {
      num: "03",
      title: "Security &\nGovernance",
      accent: CARBON.teal50,
      items: [
        "Zero-trust architecture",
        "Policy-as-Code frameworks",
        "Secrets management (Vault)",
        "Continuous compliance monitoring",
        "Incident response automation",
      ],
    },
  ];

  const pillarW = 2.7;
  const pillarH = 3.8;
  const startX = 0.75;
  const startY = 2.15;
  const gap = 0.35;

  pillars.forEach((p, i) => {
    const x = startX + i * (pillarW + gap);

    // Card background
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: startY,
      w: pillarW,
      h: pillarH,
      fill: { color: CARBON.white },
      line: { color: CARBON.gray20, width: 1 },
      rectRadius: 0.06,
      shadow: {
        type: "outer",
        blur: 8,
        offset: 2,
        color: "000000",
        opacity: 0.05,
      },
    });

    // Top accent strip
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: startY,
      w: pillarW,
      h: 0.05,
      fill: { color: p.accent },
      rectRadius: 0.06,
    });
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: startY + 0.03,
      w: pillarW,
      h: 0.04,
      fill: { color: p.accent },
    });

    // Pillar number
    slide.addText(p.num, {
      x: x + 0.25,
      y: startY + 0.25,
      w: 0.5,
      h: 0.35,
      fontSize: 14,
      fontFace: "IBM Plex Sans",
      bold: true,
      color: p.accent,
    });

    // Pillar title
    slide.addText(p.title, {
      x: x + 0.25,
      y: startY + 0.55,
      w: pillarW - 0.5,
      h: 0.65,
      fontSize: 18,
      fontFace: "IBM Plex Sans",
      bold: true,
      color: CARBON.gray100,
      lineSpacingMultiple: 1.15,
    });

    // Small divider
    slide.addShape(pres.ShapeType.rect, {
      x: x + 0.25,
      y: startY + 1.25,
      w: 0.5,
      h: 0.025,
      fill: { color: CARBON.gray20 },
    });

    // Bullet items
    const bulletTexts = p.items.map((item) => ({
      text: item,
      options: {
        fontSize: 12,
        fontFace: "IBM Plex Sans",
        color: CARBON.gray70,
        bullet: { code: "2022", color: p.accent },
        lineSpacingMultiple: 1.6,
        paraSpaceBefore: 2,
      },
    }));

    slide.addText(bulletTexts, {
      x: x + 0.25,
      y: startY + 1.4,
      w: pillarW - 0.5,
      h: 2.2,
      valign: "top",
    });
  });

  // Page number
  slide.addText("03", {
    x: 8.9,
    y: 7.0,
    w: 0.6,
    h: 0.3,
    fontSize: 10,
    fontFace: "IBM Plex Sans",
    color: CARBON.gray50,
    align: "right",
  });
}

function addPrerequisitesSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { fill: CARBON.white };

  // Section tag
  slide.addText("PRE-REQUISITES", {
    x: 0.75,
    y: 0.55,
    w: 4,
    h: 0.3,
    fontSize: 11,
    fontFace: "IBM Plex Sans",
    bold: true,
    color: CARBON.gray70,
    letterSpacing: 2.5,
  });

  // Title
  slide.addText("What You Need to Get Started", {
    x: 0.75,
    y: 0.85,
    w: 8,
    h: 0.55,
    fontSize: 32,
    fontFace: "IBM Plex Sans",
    bold: true,
    color: CARBON.gray100,
  });

  // Subtitle
  slide.addText(
    "Ensure these foundations are in place for a successful engagement",
    {
      x: 0.75,
      y: 1.4,
      w: 8,
      h: 0.35,
      fontSize: 14,
      fontFace: "IBM Plex Sans",
      color: CARBON.gray70,
    }
  );

  // Divider
  slide.addShape(pres.ShapeType.rect, {
    x: 0.75,
    y: 1.9,
    w: 8.5,
    h: 0.015,
    fill: { color: CARBON.gray20 },
  });

  const prereqs = [
    {
      icon: "\u2601\uFE0F",
      title: "Cloud Account\n& Credentials",
      items: [
        "Active IBM Cloud or AWS/Azure account",
        "Admin-level IAM access provisioned",
        "Billing & quota limits reviewed",
      ],
      required: false,
    },
    {
      icon: "\uD83D\uDC65",
      title: "Stakeholder\nAlignment",
      items: [
        "Executive sponsor identified",
        "Technical lead assigned",
        "Weekly cadence agreed upon",
      ],
      required: false,
    },
    {
      icon: "\uD83D\uDCC1",
      title: "Current State\nDocumentation",
      items: [
        "Architecture diagrams",
        "Network topology overview",
        "Application dependency map",
      ],
      required: false,
    },
    {
      icon: "\uD83D\uDD10",
      title: "Security\nBaseline",
      items: [
        "Compliance framework identified",
        "Data classification completed",
        "Access control policies defined",
      ],
      required: true,
    },
  ];

  const colW = 2.12;
  const colH = 3.8;
  const startX = 0.55;
  const startY = 2.15;
  const gap = 0.2;

  prereqs.forEach((p, i) => {
    const x = startX + i * (colW + gap);
    const isReq = p.required;

    // Card background
    // If required: tinted background + colored border
    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: startY,
      w: colW,
      h: colH,
      fill: { color: isReq ? "EDF5FF" : CARBON.white },
      line: { color: isReq ? CARBON.blue60 : CARBON.gray20, width: isReq ? 1.5 : 1 },
      rectRadius: 0.06,
      shadow: {
        type: "outer",
        blur: isReq ? 10 : 6,
        offset: 2,
        color: isReq ? "0F62FE" : "000000",
        opacity: isReq ? 0.1 : 0.05,
      },
    });

    // REQUIRED badge (only for last card)
    if (isReq) {
      // Badge background
      slide.addShape(pres.ShapeType.rect, {
        x: x + colW - 1.15,
        y: startY + 0.15,
        w: 1.0,
        h: 0.28,
        fill: { color: CARBON.blue60 },
        rectRadius: 0.14,
      });
      // Badge text
      slide.addText("REQUIRED", {
        x: x + colW - 1.15,
        y: startY + 0.15,
        w: 1.0,
        h: 0.28,
        fontSize: 9.5,
        fontFace: "IBM Plex Sans",
        bold: true,
        color: CARBON.white,
        align: "center",
        valign: "middle",
        letterSpacing: 1.5,
      });
    }

    // Icon
    slide.addText(p.icon, {
      x: x + 0.2,
      y: startY + 0.15,
      w: 0.5,
      h: 0.45,
      fontSize: 24,
    });

    // Card title
    slide.addText(p.title, {
      x: x + 0.2,
      y: startY + 0.65,
      w: colW - 0.4,
      h: 0.65,
      fontSize: 15,
      fontFace: "IBM Plex Sans",
      bold: true,
      color: isReq ? CARBON.blue70 : CARBON.gray100,
      lineSpacingMultiple: 1.15,
    });

    // Small divider
    slide.addShape(pres.ShapeType.rect, {
      x: x + 0.2,
      y: startY + 1.35,
      w: 0.4,
      h: 0.02,
      fill: { color: isReq ? CARBON.blue60 : CARBON.gray20 },
    });

    // Checklist items
    const bulletTexts = p.items.map((item) => ({
      text: item,
      options: {
        fontSize: 11.5,
        fontFace: "IBM Plex Sans",
        color: isReq ? CARBON.gray90 : CARBON.gray70,
        bullet: { code: "2713", color: isReq ? CARBON.blue60 : CARBON.green50 },
        lineSpacingMultiple: 1.55,
        paraSpaceBefore: 3,
      },
    }));

    slide.addText(bulletTexts, {
      x: x + 0.2,
      y: startY + 1.5,
      w: colW - 0.4,
      h: 2.1,
      valign: "top",
    });
  });

  // Page number
  slide.addText("04", {
    x: 8.9,
    y: 7.0,
    w: 0.6,
    h: 0.3,
    fontSize: 10,
    fontFace: "IBM Plex Sans",
    color: CARBON.gray50,
    align: "right",
  });
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log("Building Technology Services Proposal...\n");

  // Ensure output dir
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

  // 1) Capture HTML slides
  console.log("[1/5] Capturing title slide...");
  const titlePng = join(TEMP_DIR, "slide-title.png");
  await captureHTML(titleSlideHTML(), titlePng);

  console.log("[5/5] Capturing closing slide...");
  const closingPng = join(TEMP_DIR, "slide-closing.png");
  await captureHTML(closingSlideHTML(), closingPng);

  // 2) Build PPTX
  console.log("\nAssembling PPTX...");
  const pres = new pptxgenjs();
  pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"
  pres.author = "IBM Technology Services";
  pres.company = "IBM";
  pres.title = "Technology Services Proposal";

  // Define a master for blank white slides
  pres.defineSlideMaster({
    title: "CARBON_BLANK",
    background: { fill: CARBON.white },
  });

  // Slide 1: Title (full-bleed captured PNG)
  console.log("  Adding Slide 1: Title (HTML capture)");
  const slide1 = pres.addSlide();
  slide1.addImage({
    path: titlePng,
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  // Slide 2: The Challenge
  console.log("  Adding Slide 2: The Challenge");
  addChallengeSlide(pres);

  // Slide 3: Value Proposition
  console.log("  Adding Slide 3: Value Proposition");
  addValuePropositionSlide(pres);

  // Slide 4: Pre-requisites
  console.log("  Adding Slide 4: Pre-requisites");
  addPrerequisitesSlide(pres);

  // Slide 5: Closing (full-bleed captured PNG)
  console.log("  Adding Slide 5: Closing (HTML capture)");
  const slide5 = pres.addSlide();
  slide5.addImage({
    path: closingPng,
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  // Write
  await pres.writeFile({ fileName: OUTPUT_FILE });
  console.log(`\nDone! Output: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
