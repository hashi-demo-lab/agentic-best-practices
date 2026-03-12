/**
 * HashiCorp Professional Services - AI-Driven Terraform Infrastructure Proposal
 * IBM Carbon Design System aesthetic
 * 5 slides: Title, Section Divider, AI Capabilities, Implementation Approach, Expected Outcomes
 */
import PptxGenJS from "pptxgenjs";

const pptx = new PptxGenJS();

// ─── IBM Carbon Design Tokens ───────────────────────────────────────────────
const C = {
  // Gray scale
  gray100: "161616",   // Primary background
  gray90:  "262626",   // Card / elevated surface
  gray80:  "393939",   // Borders, subtle dividers
  gray70:  "525252",   // Secondary text
  gray60:  "6f6f6f",
  gray50:  "8d8d8d",   // Placeholder text
  gray30:  "c6c6c6",
  gray20:  "e0e0e0",
  gray10:  "f4f4f4",   // Light surface
  white:   "ffffff",
  // Carbon interactive / accent
  blue60:  "0f62fe",   // Primary interactive
  blue70:  "0043ce",
  blue50:  "4589ff",
  blue40:  "78a9ff",
  blue20:  "d0e2ff",
  // Supporting palette
  teal50:  "009d9a",
  teal40:  "08bdba",
  teal20:  "9ef0f0",
  purple60:"8a3ffc",
  purple40:"be95ff",
  green50: "24a148",
  green40: "42be65",
  green20: "a7f0ba",
  cyan50:  "1192e8",
  cyan40:  "33b1ff",
  magenta50:"ee5396",
};

// ─── Presentation metadata ──────────────────────────────────────────────────
pptx.author = "HashiCorp Professional Services";
pptx.company = "HashiCorp";
pptx.subject = "AI-Driven Terraform Infrastructure Proposal";
pptx.title = "AI-Driven Terraform Infrastructure";
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in

// ─── Helper: Carbon-style horizontal rule ───────────────────────────────────
function addRule(slide, { x = 0.75, y, w = 11.83, color = C.blue60, h = 0.02 }) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x, y, w, h, fill: { color }, line: { width: 0 },
  });
}

// ─── Helper: Carbon icon circle with letter ─────────────────────────────────
function addIconCircle(slide, { x, y, letter, bg = C.blue60 }) {
  slide.addShape(pptx.shapes.OVAL, {
    x, y, w: 0.48, h: 0.48,
    fill: { color: bg },
    line: { width: 0 },
  });
  slide.addText(letter, {
    x, y, w: 0.48, h: 0.48,
    fontSize: 16, fontFace: "IBM Plex Sans",
    color: C.white, bold: true,
    align: "center", valign: "middle",
  });
}

// ─── Helper: stat card ──────────────────────────────────────────────────────
function addStatCard(slide, { x, y, w, h, value, label, accent = C.blue60 }) {
  // Card bg
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: C.gray90 },
    line: { color: C.gray80, width: 0.75 },
  });
  // Accent top bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.01, y: y + 0.01, w: w - 0.02, h: 0.04,
    fill: { color: accent }, line: { width: 0 },
  });
  // Value
  slide.addText(value, {
    x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.55,
    fontSize: 28, fontFace: "IBM Plex Sans",
    color: accent, bold: true, align: "center",
  });
  // Label
  slide.addText(label, {
    x: x + 0.15, y: y + 0.72, w: w - 0.3, h: 0.45,
    fontSize: 11, fontFace: "IBM Plex Sans",
    color: C.gray30, align: "center", valign: "top",
  });
}

// ─── Helper: content card with bullet items ─────────────────────────────────
function addContentCard(slide, { x, y, w, h, title, items, accent = C.blue60, iconLetter }) {
  // Card background
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: C.gray90 },
    line: { color: C.gray80, width: 0.75 },
  });
  // Accent left stripe
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.01, y: y + 0.15, w: 0.04, h: h - 0.3,
    fill: { color: accent }, line: { width: 0 },
  });
  // Icon circle
  if (iconLetter) {
    addIconCircle(slide, { x: x + 0.25, y: y + 0.22, letter: iconLetter, bg: accent });
  }
  // Title
  slide.addText(title, {
    x: x + 0.85, y: y + 0.2, w: w - 1.1, h: 0.4,
    fontSize: 16, fontFace: "IBM Plex Sans",
    color: C.white, bold: true,
  });
  // Bullet items
  const bulletObjs = items.map(item => ({
    text: item,
    options: {
      fontSize: 12, fontFace: "IBM Plex Sans", color: C.gray30,
      bullet: { code: "2022", color: accent },
      paraSpaceAfter: 6,
    },
  }));
  slide.addText(bulletObjs, {
    x: x + 0.35, y: y + 0.65, w: w - 0.65, h: h - 0.85,
    valign: "top",
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  slide.background = { fill: C.gray100 };

  // Decorative geometric elements (top-right corner)
  const arcColors = [C.blue60, C.purple60, C.teal50, C.cyan50];
  arcColors.forEach((color, i) => {
    // Horizontal lines fanning from top-right
    slide.addShape(pptx.shapes.LINE, {
      x: 9.0 + i * 0.4, y: 0.3 + i * 0.45,
      w: 4.33 - i * 0.4, h: 0,
      line: { color, width: 2.0, dashType: "solid" },
    });
  });
  // Vertical accent lines
  arcColors.forEach((color, i) => {
    slide.addShape(pptx.shapes.LINE, {
      x: 12.5 - i * 0.4, y: 0.2,
      w: 0, h: 1.6 - i * 0.3,
      line: { color, width: 1.5, dashType: "solid" },
    });
  });

  // Subtle bottom-left geometric lines
  [C.teal50, C.blue60].forEach((color, i) => {
    slide.addShape(pptx.shapes.LINE, {
      x: 0.2 + i * 0.35, y: 6.2 - i * 0.3,
      w: 2.5 - i * 0.5, h: 0,
      line: { color, width: 1.5, dashType: "solid" },
    });
  });

  // Blue rule
  addRule(slide, { x: 0.75, y: 2.2, w: 3.5, color: C.blue60 });

  // "HASHICORP PROFESSIONAL SERVICES" label
  slide.addText("HASHICORP PROFESSIONAL SERVICES", {
    x: 0.75, y: 2.35, w: 8, h: 0.35,
    fontSize: 12, fontFace: "IBM Plex Mono",
    color: C.blue50, bold: true, letterSpacing: 3,
  });

  // Main title
  slide.addText("AI-Driven Terraform\nInfrastructure", {
    x: 0.75, y: 2.85, w: 8, h: 1.8,
    fontSize: 44, fontFace: "IBM Plex Sans",
    color: C.white, bold: true, lineSpacingMultiple: 1.05,
  });

  // Subtitle
  slide.addText("Accelerating cloud adoption through intelligent automation,\npolicy-as-code, and agentic infrastructure workflows.", {
    x: 0.75, y: 4.65, w: 7.5, h: 0.85,
    fontSize: 16, fontFace: "IBM Plex Sans",
    color: C.gray50, lineSpacingMultiple: 1.3,
  });

  // Bottom metadata bar
  addRule(slide, { x: 0.75, y: 6.5, w: 11.83, color: C.gray80 });

  slide.addText("Confidential", {
    x: 0.75, y: 6.6, w: 2.5, h: 0.35,
    fontSize: 10, fontFace: "IBM Plex Sans", color: C.gray50,
  });
  slide.addText("Q2 2026", {
    x: 5.5, y: 6.6, w: 2.5, h: 0.35,
    fontSize: 10, fontFace: "IBM Plex Sans", color: C.gray50, align: "center",
  });
  slide.addText("Proposal", {
    x: 10.0, y: 6.6, w: 2.58, h: 0.35,
    fontSize: 10, fontFace: "IBM Plex Sans", color: C.gray50, align: "right",
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — SECTION DIVIDER
// ═══════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  slide.background = { fill: C.gray100 };

  // Large "01" watermark
  slide.addText("01", {
    x: 7.5, y: 0.5, w: 6, h: 6,
    fontSize: 220, fontFace: "IBM Plex Sans",
    color: C.gray90, bold: true, align: "right", valign: "middle",
  });

  // Accent geometric lines on right side
  [C.blue60, C.teal50, C.purple60].forEach((color, i) => {
    // Horizontal accent lines
    slide.addShape(pptx.shapes.LINE, {
      x: 10.5 + i * 0.3, y: 1.0 + i * 0.6,
      w: 2.83 - i * 0.3, h: 0,
      line: { color, width: 2.5 },
    });
    // Vertical accent ticks
    slide.addShape(pptx.shapes.LINE, {
      x: 12.6 - i * 0.3, y: 0.8 + i * 0.5,
      w: 0, h: 0.8 - i * 0.15,
      line: { color, width: 2.0 },
    });
  });

  // Blue accent rule
  addRule(slide, { x: 0.75, y: 2.8, w: 2.5, color: C.blue60, h: 0.04 });

  // Section label
  slide.addText("SECTION 01", {
    x: 0.75, y: 3.0, w: 5, h: 0.35,
    fontSize: 12, fontFace: "IBM Plex Mono",
    color: C.blue50, bold: true,
  });

  // Section title
  slide.addText("AI Capabilities &\nService Overview", {
    x: 0.75, y: 3.45, w: 7, h: 1.6,
    fontSize: 40, fontFace: "IBM Plex Sans",
    color: C.white, bold: true, lineSpacingMultiple: 1.1,
  });

  // Section description
  slide.addText("How HashiCorp Professional Services leverages AI to transform\ninfrastructure provisioning, compliance, and operational efficiency.", {
    x: 0.75, y: 5.1, w: 7, h: 0.8,
    fontSize: 14, fontFace: "IBM Plex Sans",
    color: C.gray50, lineSpacingMultiple: 1.35,
  });

  // Bottom rule
  addRule(slide, { x: 0.75, y: 6.5, w: 11.83, color: C.gray80 });
}


// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — AI CAPABILITIES OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  slide.background = { fill: C.gray100 };

  // Title bar
  slide.addText("AI CAPABILITIES", {
    x: 0.75, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, fontFace: "IBM Plex Mono",
    color: C.blue50, bold: true,
  });
  slide.addText("Intelligent Infrastructure Automation", {
    x: 0.75, y: 0.7, w: 9, h: 0.5,
    fontSize: 26, fontFace: "IBM Plex Sans",
    color: C.white, bold: true,
  });
  slide.addText("AI-powered tools and agentic workflows that accelerate every stage of the infrastructure lifecycle.", {
    x: 0.75, y: 1.2, w: 9, h: 0.35,
    fontSize: 13, fontFace: "IBM Plex Sans", color: C.gray50,
  });

  addRule(slide, { x: 0.75, y: 1.65, w: 11.83, color: C.gray80 });

  // Three capability cards
  const capabilities = [
    {
      title: "Agentic Code Generation",
      accent: C.blue60,
      icon: "A",
      items: [
        "AI agents generate production-ready Terraform modules from natural language",
        "Spec-Driven Development (SDD) ensures deterministic, reviewable outputs",
        "Automated HCL scaffolding with best-practice patterns built in",
        "Context-aware suggestions using organizational module registry",
      ],
    },
    {
      title: "Policy & Compliance AI",
      accent: C.teal50,
      icon: "P",
      items: [
        "AI-assisted Sentinel and OPA policy authoring and validation",
        "Automated drift detection with intelligent remediation plans",
        "Continuous compliance scanning against CIS/SOC2/HIPAA benchmarks",
        "Natural language policy queries for audit and reporting",
      ],
    },
    {
      title: "Workflow Orchestration",
      accent: C.purple60,
      icon: "W",
      items: [
        "MCP-enabled tool integration for Terraform plan/apply/state operations",
        "Human-in-the-loop approval gates for production deployments",
        "Intelligent blast-radius analysis before infrastructure changes",
        "Automated runbook execution with AI-driven incident response",
      ],
    },
  ];

  const cardW = 3.75;
  const gap = 0.29;
  const startX = 0.75;
  capabilities.forEach((cap, i) => {
    addContentCard(slide, {
      x: startX + i * (cardW + gap),
      y: 1.9,
      w: cardW,
      h: 4.35,
      title: cap.title,
      items: cap.items,
      accent: cap.accent,
      iconLetter: cap.icon,
    });
  });

  // Bottom rule
  addRule(slide, { x: 0.75, y: 6.7, w: 11.83, color: C.gray80 });
  slide.addText("HashiCorp Professional Services  |  AI-Driven Terraform Infrastructure", {
    x: 0.75, y: 6.8, w: 8, h: 0.3,
    fontSize: 9, fontFace: "IBM Plex Sans", color: C.gray60,
  });
  slide.addText("3", {
    x: 11.8, y: 6.8, w: 0.78, h: 0.3,
    fontSize: 9, fontFace: "IBM Plex Sans", color: C.gray60, align: "right",
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — IMPLEMENTATION APPROACH
// ═══════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  slide.background = { fill: C.gray100 };

  // Title bar
  slide.addText("IMPLEMENTATION", {
    x: 0.75, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, fontFace: "IBM Plex Mono",
    color: C.blue50, bold: true,
  });
  slide.addText("Phased Delivery Approach", {
    x: 0.75, y: 0.7, w: 9, h: 0.5,
    fontSize: 26, fontFace: "IBM Plex Sans",
    color: C.white, bold: true,
  });
  slide.addText("A structured 12-week engagement with clear milestones, knowledge transfer, and measurable success criteria.", {
    x: 0.75, y: 1.2, w: 10, h: 0.35,
    fontSize: 13, fontFace: "IBM Plex Sans", color: C.gray50,
  });

  addRule(slide, { x: 0.75, y: 1.65, w: 11.83, color: C.gray80 });

  // Phase timeline — 4 phases as connected cards
  const phases = [
    {
      num: "01", title: "Discover", weeks: "Weeks 1-2", accent: C.blue60,
      items: [
        "Infrastructure audit & maturity assessment",
        "Identify high-value AI automation targets",
        "Define success metrics and KPIs",
      ],
    },
    {
      num: "02", title: "Foundation", weeks: "Weeks 3-5", accent: C.teal50,
      items: [
        "Deploy Terraform Cloud / Enterprise",
        "Configure AI agent sandbox environment",
        "Establish policy-as-code baseline",
      ],
    },
    {
      num: "03", title: "Accelerate", weeks: "Weeks 6-9", accent: C.purple60,
      items: [
        "Implement agentic SDD workflows",
        "Integrate MCP tool server with CI/CD",
        "Train teams on AI-assisted operations",
      ],
    },
    {
      num: "04", title: "Optimize", weeks: "Weeks 10-12", accent: C.green50,
      items: [
        "Production rollout & blast-radius tuning",
        "Advanced policy & compliance automation",
        "Handoff with full runbook documentation",
      ],
    },
  ];

  const phaseW = 2.78;
  const phaseGap = 0.2;
  const phaseStartX = 0.75;
  const phaseY = 1.95;
  const phaseH = 3.5;

  phases.forEach((phase, i) => {
    const px = phaseStartX + i * (phaseW + phaseGap);

    // Card bg
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: px, y: phaseY, w: phaseW, h: phaseH, rectRadius: 0.08,
      fill: { color: C.gray90 },
      line: { color: C.gray80, width: 0.75 },
    });

    // Top accent bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: px + 0.01, y: phaseY + 0.01, w: phaseW - 0.02, h: 0.05,
      fill: { color: phase.accent }, line: { width: 0 },
    });

    // Phase number
    slide.addText(phase.num, {
      x: px + 0.2, y: phaseY + 0.2, w: 0.6, h: 0.45,
      fontSize: 28, fontFace: "IBM Plex Sans",
      color: phase.accent, bold: true,
    });

    // Phase title
    slide.addText(phase.title, {
      x: px + 0.2, y: phaseY + 0.65, w: phaseW - 0.4, h: 0.35,
      fontSize: 18, fontFace: "IBM Plex Sans",
      color: C.white, bold: true,
    });

    // Weeks badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: px + 0.2, y: phaseY + 1.05, w: 1.2, h: 0.3, rectRadius: 0.04,
      fill: { color: C.gray80 }, line: { width: 0 },
    });
    slide.addText(phase.weeks, {
      x: px + 0.2, y: phaseY + 1.05, w: 1.2, h: 0.3,
      fontSize: 9, fontFace: "IBM Plex Mono",
      color: C.gray20, align: "center", valign: "middle",
    });

    // Bullets
    const bulletObjs = phase.items.map(item => ({
      text: item,
      options: {
        fontSize: 11, fontFace: "IBM Plex Sans", color: C.gray30,
        bullet: { code: "2022", color: phase.accent },
        paraSpaceAfter: 6,
      },
    }));
    slide.addText(bulletObjs, {
      x: px + 0.2, y: phaseY + 1.55, w: phaseW - 0.4, h: phaseH - 1.85,
      valign: "top",
    });

    // Connector arrow between phases
    if (i < phases.length - 1) {
      const arrowX = px + phaseW + 0.02;
      const arrowY2 = phaseY + phaseH / 2;
      slide.addShape(pptx.shapes.RIGHT_ARROW, {
        x: arrowX, y: arrowY2 - 0.08, w: 0.16, h: 0.16,
        fill: { color: C.gray70 }, line: { width: 0 },
      });
    }
  });

  // Engagement summary bar
  const barY = phaseY + phaseH + 0.35;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.75, y: barY, w: 11.83, h: 0.55, rectRadius: 0.06,
    fill: { color: C.gray90 },
    line: { color: C.gray80, width: 0.75 },
  });

  const summaryItems = [
    { label: "Duration", value: "12 Weeks" },
    { label: "Team", value: "2 Senior Engineers + 1 Architect" },
    { label: "Approach", value: "Agile sprints with bi-weekly demos" },
    { label: "Outcome", value: "Self-sufficient AI-enabled platform team" },
  ];
  const segW = 11.83 / 4;
  summaryItems.forEach((item, i) => {
    slide.addText([
      { text: `${item.label}: `, options: { color: C.gray50, fontSize: 10, fontFace: "IBM Plex Sans" } },
      { text: item.value, options: { color: C.white, fontSize: 10, fontFace: "IBM Plex Sans", bold: true } },
    ], {
      x: 0.75 + i * segW + 0.15, y: barY, w: segW - 0.3, h: 0.55,
      valign: "middle",
    });
  });

  // Footer
  addRule(slide, { x: 0.75, y: 6.7, w: 11.83, color: C.gray80 });
  slide.addText("HashiCorp Professional Services  |  AI-Driven Terraform Infrastructure", {
    x: 0.75, y: 6.8, w: 8, h: 0.3,
    fontSize: 9, fontFace: "IBM Plex Sans", color: C.gray60,
  });
  slide.addText("4", {
    x: 11.8, y: 6.8, w: 0.78, h: 0.3,
    fontSize: 9, fontFace: "IBM Plex Sans", color: C.gray60, align: "right",
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — EXPECTED OUTCOMES
// ═══════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  slide.background = { fill: C.gray100 };

  // Title bar
  slide.addText("OUTCOMES", {
    x: 0.75, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, fontFace: "IBM Plex Mono",
    color: C.blue50, bold: true,
  });
  slide.addText("Expected Business Impact", {
    x: 0.75, y: 0.7, w: 9, h: 0.5,
    fontSize: 26, fontFace: "IBM Plex Sans",
    color: C.white, bold: true,
  });
  slide.addText("Projected improvements based on HashiCorp engagements with Fortune 500 infrastructure teams.", {
    x: 0.75, y: 1.2, w: 10, h: 0.35,
    fontSize: 13, fontFace: "IBM Plex Sans", color: C.gray50,
  });

  addRule(slide, { x: 0.75, y: 1.65, w: 11.83, color: C.gray80 });

  // KPI stat cards — top row
  const stats = [
    { value: "70%", label: "Faster Module\nDevelopment", accent: C.blue60 },
    { value: "90%", label: "Policy Compliance\nAutomation", accent: C.teal50 },
    { value: "60%", label: "Reduction in\nMisconfigurations", accent: C.purple60 },
    { value: "3x", label: "Deployment\nFrequency Increase", accent: C.green50 },
  ];

  const statW = 2.65;
  const statGap = 0.27;
  const statStartX = 0.75;
  stats.forEach((stat, i) => {
    addStatCard(slide, {
      x: statStartX + i * (statW + statGap),
      y: 1.95,
      w: statW,
      h: 1.3,
      value: stat.value,
      label: stat.label,
      accent: stat.accent,
    });
  });

  // Bottom section: two columns — Business Outcomes & Technical Outcomes
  const colY = 3.55;
  const colH = 2.85;
  const colW = 5.77;

  // Left column: Business Outcomes
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.75, y: colY, w: colW, h: colH, rectRadius: 0.08,
    fill: { color: C.gray90 },
    line: { color: C.gray80, width: 0.75 },
  });
  // Left stripe
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.76, y: colY + 0.15, w: 0.04, h: colH - 0.3,
    fill: { color: C.cyan50 }, line: { width: 0 },
  });

  addIconCircle(slide, { x: 1.0, y: colY + 0.22, letter: "B", bg: C.cyan50 });

  slide.addText("Business Outcomes", {
    x: 1.6, y: colY + 0.2, w: 4.5, h: 0.4,
    fontSize: 16, fontFace: "IBM Plex Sans",
    color: C.white, bold: true,
  });

  const bizItems = [
    "Reduced infrastructure provisioning time from weeks to hours",
    "Lower operational costs through automated drift remediation",
    "Improved audit readiness with continuous compliance reporting",
    "Faster time-to-market for new application environments",
    "Reduced risk of outages through AI-powered blast-radius analysis",
  ];
  slide.addText(bizItems.map(item => ({
    text: item,
    options: {
      fontSize: 12, fontFace: "IBM Plex Sans", color: C.gray30,
      bullet: { code: "2022", color: C.cyan50 },
      paraSpaceAfter: 6,
    },
  })), {
    x: 1.1, y: colY + 0.65, w: colW - 0.6, h: colH - 0.85,
    valign: "top",
  });

  // Right column: Technical Outcomes
  const rightX = 0.75 + colW + 0.29;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: rightX, y: colY, w: colW, h: colH, rectRadius: 0.08,
    fill: { color: C.gray90 },
    line: { color: C.gray80, width: 0.75 },
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: rightX + 0.01, y: colY + 0.15, w: 0.04, h: colH - 0.3,
    fill: { color: C.magenta50 }, line: { width: 0 },
  });

  addIconCircle(slide, { x: rightX + 0.25, y: colY + 0.22, letter: "T", bg: C.magenta50 });

  slide.addText("Technical Outcomes", {
    x: rightX + 0.85, y: colY + 0.2, w: 4.5, h: 0.4,
    fontSize: 16, fontFace: "IBM Plex Sans",
    color: C.white, bold: true,
  });

  const techItems = [
    "Standardized module library with AI-generated documentation",
    "Fully integrated CI/CD pipeline with Terraform Cloud",
    "Sentinel/OPA policy suite covering 95%+ of compliance rules",
    "Agentic workflow platform with MCP tool server integration",
    "Self-service infrastructure catalog for development teams",
  ];
  slide.addText(techItems.map(item => ({
    text: item,
    options: {
      fontSize: 12, fontFace: "IBM Plex Sans", color: C.gray30,
      bullet: { code: "2022", color: C.magenta50 },
      paraSpaceAfter: 6,
    },
  })), {
    x: rightX + 0.35, y: colY + 0.65, w: colW - 0.6, h: colH - 0.85,
    valign: "top",
  });

  // Footer
  addRule(slide, { x: 0.75, y: 6.7, w: 11.83, color: C.gray80 });
  slide.addText("HashiCorp Professional Services  |  AI-Driven Terraform Infrastructure", {
    x: 0.75, y: 6.8, w: 8, h: 0.3,
    fontSize: 9, fontFace: "IBM Plex Sans", color: C.gray60,
  });
  slide.addText("5", {
    x: 11.8, y: 6.8, w: 0.78, h: 0.3,
    fontSize: 9, fontFace: "IBM Plex Sans", color: C.gray60, align: "right",
  });
}


// ─── Write file ─────────────────────────────────────────────────────────────
const outPath = "./HashiCorp-AI-Terraform-Proposal.pptx";
await pptx.writeFile({ fileName: outPath });
console.log(`PPTX written to ${outPath}`);
