import pptxgen from "pptxgenjs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "IBM Consulting";
pres.title = "Cloud Security Assessment";
pres.subject = "Security Assessment Proposal";

// ─── IBM Carbon Design System Colors ───
const CARBON = {
  gray100: "161616",   // Primary background
  gray90:  "262626",   // Card / elevated surfaces
  gray80:  "393939",   // Borders, subtle elements
  gray70:  "525252",   // Secondary text
  gray50:  "8D8D8D",   // Placeholder text
  gray30:  "C6C6C6",   // Tertiary text
  gray10:  "F4F4F4",   // Primary text on dark
  white:   "FFFFFF",   // Headings / emphasis
  blue60:  "0F62FE",   // IBM Blue (primary interactive)
  blue50:  "4589FF",   // Blue highlight
  blue40:  "78A9FF",   // Light blue accent
  blue80:  "002D9C",   // Deep blue
  blue90:  "001D6C",   // Darkest blue
  cyan50:  "1192E8",   // Supporting accent
  teal50:  "009D9A",   // Supporting accent
  purple60:"8A3FFC",   // Supporting accent
  red60:   "DA1E28",   // Danger / critical
  green50: "24A148",   // Success
};

// ─── Slide dimensions in inches (16:9) ───
const W = 10;
const H = 5.625;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 1 — Title Slide (Branded)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const s1 = pres.addSlide();
s1.background = { color: CARBON.gray100 };

// Top-left accent bar (IBM Blue stripe)
s1.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: W, h: 0.06,
  fill: { color: CARBON.blue60 },
});

// Large geometric accent block — right side
s1.addShape(pres.ShapeType.rect, {
  x: 6.2, y: 0.06, w: 3.8, h: 5.565,
  fill: { color: CARBON.blue90 },
});

// Layered accent rectangles inside the blue block
s1.addShape(pres.ShapeType.rect, {
  x: 6.6, y: 0.8, w: 3.0, h: 2.4,
  fill: { color: CARBON.blue80 },
  rectRadius: 0.04,
});
s1.addShape(pres.ShapeType.rect, {
  x: 7.0, y: 1.6, w: 2.2, h: 1.8,
  fill: { color: CARBON.blue60 },
  rectRadius: 0.04,
});

// Thin horizontal rules in the accent area
s1.addShape(pres.ShapeType.rect, {
  x: 6.6, y: 3.8, w: 3.0, h: 0.008,
  fill: { color: CARBON.blue50 },
});
s1.addShape(pres.ShapeType.rect, {
  x: 6.6, y: 4.2, w: 2.0, h: 0.008,
  fill: { color: CARBON.blue40 },
});

// Security shield icon representation (geometric)
s1.addShape(pres.ShapeType.rect, {
  x: 7.6, y: 1.9, w: 1.0, h: 1.0,
  fill: { color: CARBON.white },
  rectRadius: 0.08,
  shadow: { type: "outer", blur: 8, offset: 2, color: "000000", opacity: 0.3 },
});
s1.addText("🛡", {
  x: 7.6, y: 1.9, w: 1.0, h: 1.0,
  fontSize: 36,
  align: "center",
  valign: "middle",
});

// IBM logo text
s1.addText("IBM", {
  x: 0.6, y: 0.4, w: 2, h: 0.5,
  fontSize: 22,
  fontFace: "IBM Plex Sans",
  color: CARBON.blue50,
  bold: true,
  letterSpacing: 4,
});

// Title text block
s1.addText("Cloud Security\nAssessment", {
  x: 0.6, y: 1.5, w: 5.2, h: 2.0,
  fontSize: 40,
  fontFace: "IBM Plex Sans",
  color: CARBON.white,
  bold: true,
  lineSpacingMultiple: 1.1,
  valign: "top",
});

// Subtitle
s1.addText("Comprehensive Security Posture Review\n& Risk Mitigation Strategy", {
  x: 0.6, y: 3.4, w: 5.2, h: 0.8,
  fontSize: 16,
  fontFace: "IBM Plex Sans",
  color: CARBON.gray50,
  lineSpacingMultiple: 1.3,
  valign: "top",
});

// Thin separator line
s1.addShape(pres.ShapeType.rect, {
  x: 0.6, y: 4.4, w: 2.5, h: 0.008,
  fill: { color: CARBON.blue60 },
});

// Metadata: date and classification
s1.addText("Prepared for Executive Review  |  Q1 2026", {
  x: 0.6, y: 4.6, w: 5.0, h: 0.35,
  fontSize: 11,
  fontFace: "IBM Plex Sans",
  color: CARBON.gray70,
});
s1.addText("CONFIDENTIAL", {
  x: 0.6, y: 4.95, w: 2.0, h: 0.3,
  fontSize: 9,
  fontFace: "IBM Plex Mono",
  color: CARBON.red60,
  bold: true,
  letterSpacing: 2,
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 2 — Content Slide (Assessment Scope)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const s2 = pres.addSlide();
s2.background = { color: CARBON.gray100 };

// Top blue accent bar
s2.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: W, h: 0.04,
  fill: { color: CARBON.blue60 },
});

// Section label
s2.addText("ASSESSMENT SCOPE", {
  x: 0.6, y: 0.35, w: 4, h: 0.3,
  fontSize: 10,
  fontFace: "IBM Plex Mono",
  color: CARBON.blue50,
  bold: true,
  letterSpacing: 2,
});

// Main heading
s2.addText("Security Assessment Framework", {
  x: 0.6, y: 0.7, w: 8.5, h: 0.55,
  fontSize: 28,
  fontFace: "IBM Plex Sans",
  color: CARBON.white,
  bold: true,
});

// Divider line under heading
s2.addShape(pres.ShapeType.rect, {
  x: 0.6, y: 1.35, w: 8.8, h: 0.006,
  fill: { color: CARBON.gray80 },
});

// ── Three-column card layout ──
const cardY = 1.65;
const cardH = 3.2;
const cardW = 2.75;
const gap = 0.22;
const startX = 0.6;

const cards = [
  {
    num: "01",
    title: "Identity & Access\nManagement",
    color: CARBON.blue60,
    items: [
      "IAM policy & role review",
      "Privilege escalation analysis",
      "MFA enforcement audit",
      "Service account hygiene",
      "Cross-account trust mapping",
    ],
  },
  {
    num: "02",
    title: "Network &\nInfrastructure",
    color: CARBON.cyan50,
    items: [
      "VPC segmentation review",
      "Security group analysis",
      "Encryption-in-transit audit",
      "WAF & DDoS posture",
      "DNS & certificate management",
    ],
  },
  {
    num: "03",
    title: "Data Protection\n& Compliance",
    color: CARBON.teal50,
    items: [
      "Encryption-at-rest validation",
      "Data classification mapping",
      "Regulatory gap analysis",
      "Backup & DR assessment",
      "Logging & SIEM integration",
    ],
  },
];

cards.forEach((card, i) => {
  const cx = startX + i * (cardW + gap);

  // Card background
  s2.addShape(pres.ShapeType.rect, {
    x: cx, y: cardY, w: cardW, h: cardH,
    fill: { color: CARBON.gray90 },
    rectRadius: 0.06,
    line: { color: CARBON.gray80, width: 0.5 },
  });

  // Color accent bar at top of card
  s2.addShape(pres.ShapeType.rect, {
    x: cx, y: cardY, w: cardW, h: 0.05,
    fill: { color: card.color },
    rectRadius: 0.06,
  });

  // Card number
  s2.addText(card.num, {
    x: cx + 0.2, y: cardY + 0.2, w: 0.6, h: 0.35,
    fontSize: 20,
    fontFace: "IBM Plex Mono",
    color: card.color,
    bold: true,
  });

  // Card title
  s2.addText(card.title, {
    x: cx + 0.2, y: cardY + 0.55, w: cardW - 0.4, h: 0.7,
    fontSize: 14,
    fontFace: "IBM Plex Sans",
    color: CARBON.white,
    bold: true,
    lineSpacingMultiple: 1.15,
    valign: "top",
  });

  // Divider inside card
  s2.addShape(pres.ShapeType.rect, {
    x: cx + 0.2, y: cardY + 1.3, w: cardW - 0.4, h: 0.004,
    fill: { color: CARBON.gray80 },
  });

  // Bullet items
  const bulletText = card.items.map(item => ({
    text: item,
    options: {
      fontSize: 10.5,
      fontFace: "IBM Plex Sans",
      color: CARBON.gray30,
      bullet: { code: "2022", color: card.color },
      lineSpacingMultiple: 1.55,
      paraSpaceBefore: 2,
    },
  }));

  s2.addText(bulletText, {
    x: cx + 0.2, y: cardY + 1.4, w: cardW - 0.4, h: 1.7,
    valign: "top",
  });
});

// Right-side summary panel
const panelX = startX + 3 * (cardW + gap);
const panelW = W - panelX - 0.6;

s2.addShape(pres.ShapeType.rect, {
  x: panelX, y: cardY, w: panelW, h: cardH,
  fill: { color: CARBON.gray90 },
  rectRadius: 0.06,
  line: { color: CARBON.gray80, width: 0.5 },
});

// Panel accent
s2.addShape(pres.ShapeType.rect, {
  x: panelX, y: cardY, w: panelW, h: 0.05,
  fill: { color: CARBON.purple60 },
  rectRadius: 0.06,
});

s2.addText("KEY METRICS", {
  x: panelX + 0.15, y: cardY + 0.18, w: panelW - 0.3, h: 0.25,
  fontSize: 9,
  fontFace: "IBM Plex Mono",
  color: CARBON.purple60,
  bold: true,
  letterSpacing: 2,
});

const metrics = [
  { value: "200+", label: "Controls\nEvaluated" },
  { value: "3", label: "Cloud\nProviders" },
  { value: "15", label: "Compliance\nFrameworks" },
  { value: "4 wk", label: "Assessment\nTimeline" },
];

metrics.forEach((m, i) => {
  const my = cardY + 0.6 + i * 0.65;
  s2.addText(m.value, {
    x: panelX + 0.15, y: my, w: panelW - 0.3, h: 0.3,
    fontSize: 22,
    fontFace: "IBM Plex Sans",
    color: CARBON.white,
    bold: true,
  });
  s2.addText(m.label, {
    x: panelX + 0.15, y: my + 0.28, w: panelW - 0.3, h: 0.32,
    fontSize: 9,
    fontFace: "IBM Plex Sans",
    color: CARBON.gray50,
    lineSpacingMultiple: 1.15,
  });
});

// Page number
s2.addText("02", {
  x: W - 1, y: H - 0.4, w: 0.5, h: 0.3,
  fontSize: 9,
  fontFace: "IBM Plex Mono",
  color: CARBON.gray70,
  align: "right",
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 3 — Closing Slide
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const s3 = pres.addSlide();
s3.background = { color: CARBON.gray100 };

// Top blue accent bar
s3.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: W, h: 0.06,
  fill: { color: CARBON.blue60 },
});

// Large geometric accent — left side
s3.addShape(pres.ShapeType.rect, {
  x: 0, y: 0.06, w: 3.6, h: 5.565,
  fill: { color: CARBON.blue90 },
});

// Layered accents
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 1.2, w: 2.8, h: 2.0,
  fill: { color: CARBON.blue80 },
  rectRadius: 0.04,
});
s3.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 1.8, h: 1.2,
  fill: { color: CARBON.blue60 },
  rectRadius: 0.04,
});

// Horizontal rules in left panel
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 3.8, w: 2.8, h: 0.008,
  fill: { color: CARBON.blue50 },
});
s3.addShape(pres.ShapeType.rect, {
  x: 0.4, y: 4.2, w: 1.8, h: 0.008,
  fill: { color: CARBON.blue40 },
});

// IBM text in left panel
s3.addText("IBM", {
  x: 0.6, y: 0.5, w: 2, h: 0.5,
  fontSize: 22,
  fontFace: "IBM Plex Sans",
  color: CARBON.white,
  bold: true,
  letterSpacing: 4,
});

// Closing headline
s3.addText("Let's Build a\nMore Secure Future", {
  x: 4.2, y: 0.9, w: 5.2, h: 1.6,
  fontSize: 36,
  fontFace: "IBM Plex Sans",
  color: CARBON.white,
  bold: true,
  lineSpacingMultiple: 1.15,
  valign: "top",
});

// Divider
s3.addShape(pres.ShapeType.rect, {
  x: 4.2, y: 2.6, w: 2.0, h: 0.008,
  fill: { color: CARBON.blue60 },
});

// CTA / Next steps
s3.addText("Next Steps", {
  x: 4.2, y: 2.85, w: 5.0, h: 0.35,
  fontSize: 13,
  fontFace: "IBM Plex Sans",
  color: CARBON.blue50,
  bold: true,
});

const nextSteps = [
  { text: "Schedule kickoff meeting with security team", options: { fontSize: 12, fontFace: "IBM Plex Sans", color: CARBON.gray30, bullet: { code: "2192", color: CARBON.blue50 }, lineSpacingMultiple: 1.7, paraSpaceBefore: 4 } },
  { text: "Provision read-only access to cloud environments", options: { fontSize: 12, fontFace: "IBM Plex Sans", color: CARBON.gray30, bullet: { code: "2192", color: CARBON.blue50 }, lineSpacingMultiple: 1.7 } },
  { text: "Align on compliance frameworks & reporting cadence", options: { fontSize: 12, fontFace: "IBM Plex Sans", color: CARBON.gray30, bullet: { code: "2192", color: CARBON.blue50 }, lineSpacingMultiple: 1.7 } },
  { text: "Deliver findings report within 4 weeks", options: { fontSize: 12, fontFace: "IBM Plex Sans", color: CARBON.gray30, bullet: { code: "2192", color: CARBON.blue50 }, lineSpacingMultiple: 1.7 } },
];

s3.addText(nextSteps, {
  x: 4.2, y: 3.15, w: 5.0, h: 1.5,
  valign: "top",
});

// Contact info card
s3.addShape(pres.ShapeType.rect, {
  x: 4.2, y: 4.6, w: 3.5, h: 0.7,
  fill: { color: CARBON.gray90 },
  rectRadius: 0.06,
  line: { color: CARBON.gray80, width: 0.5 },
});

s3.addText("IBM Security  |  ibm.com/security", {
  x: 4.4, y: 4.65, w: 3.1, h: 0.25,
  fontSize: 10,
  fontFace: "IBM Plex Sans",
  color: CARBON.white,
  bold: true,
});
s3.addText("cloud-security@ibm.com", {
  x: 4.4, y: 4.92, w: 3.1, h: 0.25,
  fontSize: 9,
  fontFace: "IBM Plex Mono",
  color: CARBON.blue40,
});

// Page number
s3.addText("03", {
  x: W - 1, y: H - 0.4, w: 0.5, h: 0.3,
  fontSize: 9,
  fontFace: "IBM Plex Mono",
  color: CARBON.gray70,
  align: "right",
});

// ─── Write file ───
const outPath = resolve(__dirname, "Cloud-Security-Assessment.pptx");
await pres.writeFile({ fileName: outPath });
console.log(`Deck saved to: ${outPath}`);
