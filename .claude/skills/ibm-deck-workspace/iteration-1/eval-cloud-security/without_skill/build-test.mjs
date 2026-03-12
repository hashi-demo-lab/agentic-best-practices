/**
 * Cloud Security Best Practices — IBM Carbon Design System styled PPTX
 *
 * IBM Carbon palette & typography references:
 *   - Gray 100 (#161616) — primary background
 *   - Gray 90  (#262626) — card / surface
 *   - Gray 80  (#393939) — elevated surface / borders
 *   - Gray 70  (#525252) — subtle text
 *   - Gray 10  (#f4f4f4) — primary text on dark
 *   - White    (#ffffff) — headings on dark
 *   - Blue 60  (#0f62fe) — primary interactive / accent
 *   - Blue 70  (#0043ce) — hover state
 *   - Red 50   (#fa4d56) — danger
 *   - Yellow 30 (#f1c21b) — warning
 *   - Green 50 (#24a148) — success
 *   - Teal 50  (#009d9a) — info accent
 *   - Purple 60 (#8a3ffc) — support accent
 *
 * Typography: IBM Plex Sans (Carbon's typeface)
 *   - Headings: Semibold (600) / Bold (700)
 *   - Body: Regular (400)
 *   - Productive heading-05: 32px
 *   - Productive heading-03: 20px
 *   - Body-long-02: 16px
 *   - Label-01: 12px
 */

import pptxgenjs from "pptxgenjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pptx = new pptxgenjs();

// ── IBM Carbon Tokens ──────────────────────────────────────────────
const C = {
  gray100: "161616",
  gray90:  "262626",
  gray80:  "393939",
  gray70:  "525252",
  gray60:  "6f6f6f",
  gray50:  "8d8d8d",
  gray30:  "c6c6c6",
  gray10:  "f4f4f4",
  white:   "ffffff",
  blue60:  "0f62fe",
  blue70:  "0043ce",
  blue80:  "002d9c",
  red50:   "fa4d56",
  red60:   "da1e28",
  yellow30:"f1c21b",
  green50: "24a148",
  teal50:  "009d9a",
  teal70:  "005d5d",
  purple60:"8a3ffc",
  purple70:"6929c4",
};

const FONT = "IBM Plex Sans";

// ── Presentation metadata ──────────────────────────────────────────
pptx.author = "Cloud Security Team";
pptx.company = "IBM";
pptx.title = "Cloud Security Best Practices";
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in

// ── Helper: draw a thin accent line ────────────────────────────────
function accentLine(slide, { x, y, w, color }) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.04,
    fill: { color },
  });
}

// ── Helper: draw Carbon-style top nav bar ──────────────────────────
function carbonNavBar(slide) {
  // Top bar (Gray 100 strip — 0.55 in tall)
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.55,
    fill: { color: C.gray100 },
  });

  // IBM logo text
  slide.addText("IBM", {
    x: 0.5, y: 0.12, w: 1, h: 0.32,
    fontSize: 16, fontFace: FONT, bold: true,
    color: C.white,
  });

  // Nav items (decorative)
  const navItems = ["Security", "Compliance", "Architecture", "Resources"];
  navItems.forEach((item, i) => {
    slide.addText(item, {
      x: 1.8 + i * 1.5, y: 0.12, w: 1.4, h: 0.32,
      fontSize: 11, fontFace: FONT,
      color: C.gray30,
    });
  });
}

// ══════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title Slide
// ══════════════════════════════════════════════════════════════════════
function buildTitleSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.gray100 };

  carbonNavBar(slide);

  // Blue accent block (left side, large vertical stripe)
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0.55, w: 0.18, h: 6.95,
    fill: { color: C.blue60 },
  });

  // Decorative grid dots (Carbon style subtle pattern)
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 9.5 + col * 0.35, y: 1.2 + row * 0.35, w: 0.06, h: 0.06,
        fill: { color: C.gray80 },
      });
    }
  }

  // Overline label
  slide.addText("IBM CLOUD / SECURITY", {
    x: 0.8, y: 1.8, w: 6, h: 0.35,
    fontSize: 12, fontFace: FONT, bold: true,
    color: C.blue60,
    letterSpacing: 2,
  });

  // Title
  slide.addText("Cloud Security\nBest Practices", {
    x: 0.8, y: 2.3, w: 7.5, h: 2.0,
    fontSize: 44, fontFace: FONT, bold: true,
    color: C.white,
    lineSpacingMultiple: 1.15,
  });

  // Blue accent line under title
  accentLine(slide, { x: 0.8, y: 4.45, w: 2.5, color: C.blue60 });

  // Subtitle / description
  slide.addText(
    "A comprehensive guide to securing cloud-native infrastructure,\nidentity management, and data protection across hybrid environments.",
    {
      x: 0.8, y: 4.7, w: 7.5, h: 1.0,
      fontSize: 16, fontFace: FONT,
      color: C.gray50,
      lineSpacingMultiple: 1.5,
    }
  );

  // Date & metadata
  slide.addText("March 2026  |  Version 2.1", {
    x: 0.8, y: 6.0, w: 5, h: 0.4,
    fontSize: 12, fontFace: FONT,
    color: C.gray60,
  });

  // Large decorative "shield" icon area (right side) — built from shapes
  // Outer shield shape approximated with a rounded rectangle + triangle
  const shieldX = 9.0;
  const shieldY = 2.0;

  // Shield body (rounded rect)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: shieldX, y: shieldY, w: 3.0, h: 2.8,
    fill: { color: C.gray90 },
    line: { color: C.blue60, width: 1.5 },
    rectRadius: 0.15,
  });

  // Shield bottom point (triangle)
  slide.addShape(pptx.ShapeType.triangle, {
    x: shieldX + 0.3, y: shieldY + 2.5, w: 2.4, h: 1.2,
    fill: { color: C.gray90 },
    line: { color: C.blue60, width: 1.5 },
    rotate: 180,
  });

  // Inner cover rect to merge shapes
  slide.addShape(pptx.ShapeType.rect, {
    x: shieldX + 0.15, y: shieldY + 2.2, w: 2.7, h: 0.65,
    fill: { color: C.gray90 },
  });

  // Checkmark inside shield (text icon)
  slide.addText("\u2713", {
    x: shieldX + 0.6, y: shieldY + 0.8, w: 1.8, h: 1.5,
    fontSize: 60, fontFace: FONT, bold: true,
    color: C.blue60,
    align: "center", valign: "middle",
  });

  // Bottom bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.05, w: 13.33, h: 0.45,
    fill: { color: C.gray90 },
  });

  slide.addText("Confidential  |  For internal use only", {
    x: 0.8, y: 7.08, w: 5, h: 0.35,
    fontSize: 10, fontFace: FONT,
    color: C.gray60,
  });
}

// ══════════════════════════════════════════════════════════════════════
// SLIDE 2 — Challenges (4 Risk Cards)
// ══════════════════════════════════════════════════════════════════════
function buildChallengesSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.gray100 };

  carbonNavBar(slide);

  // Section label
  slide.addText("CHALLENGES", {
    x: 0.8, y: 0.85, w: 4, h: 0.35,
    fontSize: 12, fontFace: FONT, bold: true,
    color: C.blue60,
  });

  // Heading
  slide.addText("Key Cloud Security Risks", {
    x: 0.8, y: 1.2, w: 8, h: 0.6,
    fontSize: 32, fontFace: FONT, bold: true,
    color: C.white,
  });

  // Blue accent line
  accentLine(slide, { x: 0.8, y: 1.9, w: 2.0, color: C.blue60 });

  // Subtitle
  slide.addText(
    "Organizations face evolving threats across identity, data, network, and compliance domains.",
    {
      x: 0.8, y: 2.05, w: 9, h: 0.5,
      fontSize: 14, fontFace: FONT,
      color: C.gray50,
    }
  );

  // ── Risk Cards ─────────────────────────────────────────────────
  const cards = [
    {
      number: "01",
      title: "Identity & Access",
      severity: "CRITICAL",
      sevColor: C.red50,
      icon: "\uD83D\uDD11", // key
      stat: "61%",
      statLabel: "of breaches involve credentials",
      bullets: [
        "Misconfigured IAM policies",
        "Over-privileged service accounts",
        "Lack of MFA enforcement",
        "Stale access credentials",
      ],
    },
    {
      number: "02",
      title: "Data Exposure",
      severity: "HIGH",
      sevColor: C.red50,
      icon: "\uD83D\uDCC1", // folder
      stat: "45%",
      statLabel: "of orgs had a cloud data leak",
      bullets: [
        "Unencrypted data at rest",
        "Public storage buckets",
        "Insufficient key management",
        "Cross-region data residency",
      ],
    },
    {
      number: "03",
      title: "Network Threats",
      severity: "HIGH",
      sevColor: C.yellow30,
      icon: "\uD83C\uDF10", // globe
      stat: "3.2M",
      statLabel: "attacks per cloud tenant / year",
      bullets: [
        "Open security group rules",
        "Lateral movement risks",
        "DDoS attack surface",
        "Insufficient micro-segmentation",
      ],
    },
    {
      number: "04",
      title: "Compliance Drift",
      severity: "MEDIUM",
      sevColor: C.yellow30,
      icon: "\uD83D\uDCCB", // clipboard
      stat: "78%",
      statLabel: "fail continuous compliance",
      bullets: [
        "Manual audit processes",
        "Regulatory framework gaps",
        "Shadow IT proliferation",
        "Inconsistent policy enforcement",
      ],
    },
  ];

  const cardW = 2.75;
  const cardH = 3.8;
  const gap = 0.3;
  const startX = 0.8;
  const startY = 2.75;

  cards.forEach((card, i) => {
    const cx = startX + i * (cardW + gap);

    // Card background
    slide.addShape(pptx.ShapeType.rect, {
      x: cx, y: startY, w: cardW, h: cardH,
      fill: { color: C.gray90 },
      line: { color: C.gray80, width: 0.75 },
      rectRadius: 0.05,
    });

    // Top color accent bar on card
    slide.addShape(pptx.ShapeType.rect, {
      x: cx, y: startY, w: cardW, h: 0.06,
      fill: { color: card.sevColor },
    });

    // Card number
    slide.addText(card.number, {
      x: cx + 0.2, y: startY + 0.2, w: 0.6, h: 0.35,
      fontSize: 14, fontFace: FONT, bold: true,
      color: C.gray60,
    });

    // Severity badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: cx + cardW - 1.15, y: startY + 0.2, w: 0.95, h: 0.28,
      fill: { color: card.sevColor },
      rectRadius: 0.03,
    });
    slide.addText(card.severity, {
      x: cx + cardW - 1.15, y: startY + 0.2, w: 0.95, h: 0.28,
      fontSize: 9, fontFace: FONT, bold: true,
      color: C.white,
      align: "center", valign: "middle",
    });

    // Card title
    slide.addText(card.title, {
      x: cx + 0.2, y: startY + 0.6, w: cardW - 0.4, h: 0.4,
      fontSize: 16, fontFace: FONT, bold: true,
      color: C.white,
    });

    // Stat callout
    slide.addText(card.stat, {
      x: cx + 0.2, y: startY + 1.05, w: cardW - 0.4, h: 0.5,
      fontSize: 28, fontFace: FONT, bold: true,
      color: C.blue60,
    });
    slide.addText(card.statLabel, {
      x: cx + 0.2, y: startY + 1.5, w: cardW - 0.4, h: 0.3,
      fontSize: 10, fontFace: FONT,
      color: C.gray50,
    });

    // Thin divider
    slide.addShape(pptx.ShapeType.rect, {
      x: cx + 0.2, y: startY + 1.95, w: cardW - 0.4, h: 0.015,
      fill: { color: C.gray80 },
    });

    // Bullet points
    const bulletText = card.bullets.map((b) => ({
      text: b,
      options: {
        fontSize: 11,
        fontFace: FONT,
        color: C.gray30,
        bullet: { code: "2022", color: C.gray50 },
        lineSpacingMultiple: 1.5,
        paraSpaceBefore: 2,
      },
    }));
    slide.addText(bulletText, {
      x: cx + 0.2, y: startY + 2.1, w: cardW - 0.4, h: 1.5,
      valign: "top",
    });
  });

  // Bottom bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.05, w: 13.33, h: 0.45,
    fill: { color: C.gray90 },
  });

  slide.addText("Cloud Security Best Practices  |  Challenges", {
    x: 0.8, y: 7.08, w: 6, h: 0.35,
    fontSize: 10, fontFace: FONT,
    color: C.gray60,
  });

  slide.addText("2 / 3", {
    x: 11.5, y: 7.08, w: 1, h: 0.35,
    fontSize: 10, fontFace: FONT,
    color: C.gray60,
    align: "right",
  });
}

// ══════════════════════════════════════════════════════════════════════
// SLIDE 3 — Recommendations (3 Columns)
// ══════════════════════════════════════════════════════════════════════
function buildRecommendationsSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.gray100 };

  carbonNavBar(slide);

  // Section label
  slide.addText("RECOMMENDATIONS", {
    x: 0.8, y: 0.85, w: 4, h: 0.35,
    fontSize: 12, fontFace: FONT, bold: true,
    color: C.blue60,
  });

  // Heading
  slide.addText("Security Implementation Strategy", {
    x: 0.8, y: 1.2, w: 10, h: 0.6,
    fontSize: 32, fontFace: FONT, bold: true,
    color: C.white,
  });

  // Blue accent line
  accentLine(slide, { x: 0.8, y: 1.9, w: 2.0, color: C.blue60 });

  // Subtitle
  slide.addText(
    "Three pillars for a defense-in-depth cloud security posture.",
    {
      x: 0.8, y: 2.05, w: 9, h: 0.45,
      fontSize: 14, fontFace: FONT,
      color: C.gray50,
    }
  );

  // ── Three Recommendation Columns ──────────────────────────────
  const columns = [
    {
      pillar: "PILLAR 1",
      title: "Zero Trust Architecture",
      accentColor: C.blue60,
      iconText: "\uD83D\uDD12", // lock
      description:
        "Implement identity-centric security that verifies every request regardless of network location.",
      items: [
        { label: "Identity Federation", detail: "Centralize IAM with SAML/OIDC across all cloud providers" },
        { label: "Least Privilege", detail: "Enforce just-in-time access with automatic expiration policies" },
        { label: "Micro-segmentation", detail: "Isolate workloads with service mesh and network policies" },
        { label: "Continuous Verification", detail: "Real-time posture checks on every API call and session" },
      ],
    },
    {
      pillar: "PILLAR 2",
      title: "Data Protection & Encryption",
      accentColor: C.teal50,
      iconText: "\uD83D\uDEE1\uFE0F", // shield
      description:
        "Ensure end-to-end encryption and robust key management across all data states.",
      items: [
        { label: "Encryption Everywhere", detail: "AES-256 at rest, TLS 1.3 in transit, confidential computing" },
        { label: "Key Management", detail: "HSM-backed key lifecycle with automatic rotation schedules" },
        { label: "Data Classification", detail: "Automated tagging and DLP policies for sensitive workloads" },
        { label: "Backup & Recovery", detail: "Immutable backups with cross-region replication and testing" },
      ],
    },
    {
      pillar: "PILLAR 3",
      title: "Compliance Automation",
      accentColor: C.purple60,
      iconText: "\u2699\uFE0F", // gear
      description:
        "Shift compliance left with policy-as-code and continuous monitoring frameworks.",
      items: [
        { label: "Policy as Code", detail: "OPA/Rego guardrails enforced in CI/CD pipelines at deploy" },
        { label: "Continuous Monitoring", detail: "Real-time drift detection against CIS, NIST, SOC 2 benchmarks" },
        { label: "Automated Remediation", detail: "Self-healing infrastructure with event-driven runbooks" },
        { label: "Audit Trail", detail: "Immutable logs with SIEM integration and forensic readiness" },
      ],
    },
  ];

  const colW = 3.65;
  const colH = 4.35;
  const colGap = 0.35;
  const colStartX = 0.8;
  const colStartY = 2.7;

  columns.forEach((col, i) => {
    const cx = colStartX + i * (colW + colGap);

    // Column card background
    slide.addShape(pptx.ShapeType.rect, {
      x: cx, y: colStartY, w: colW, h: colH,
      fill: { color: C.gray90 },
      line: { color: C.gray80, width: 0.75 },
      rectRadius: 0.05,
    });

    // Top accent bar
    slide.addShape(pptx.ShapeType.rect, {
      x: cx, y: colStartY, w: colW, h: 0.06,
      fill: { color: col.accentColor },
    });

    // Pillar label
    slide.addText(col.pillar, {
      x: cx + 0.25, y: colStartY + 0.2, w: 1.5, h: 0.25,
      fontSize: 10, fontFace: FONT, bold: true,
      color: col.accentColor,
    });

    // Title
    slide.addText(col.title, {
      x: cx + 0.25, y: colStartY + 0.5, w: colW - 0.5, h: 0.45,
      fontSize: 16, fontFace: FONT, bold: true,
      color: C.white,
    });

    // Description
    slide.addText(col.description, {
      x: cx + 0.25, y: colStartY + 1.0, w: colW - 0.5, h: 0.6,
      fontSize: 11, fontFace: FONT,
      color: C.gray50,
      lineSpacingMultiple: 1.4,
    });

    // Divider
    slide.addShape(pptx.ShapeType.rect, {
      x: cx + 0.25, y: colStartY + 1.65, w: colW - 0.5, h: 0.015,
      fill: { color: C.gray80 },
    });

    // Items
    col.items.forEach((item, j) => {
      const iy = colStartY + 1.8 + j * 0.6;

      // Item label (bold)
      slide.addText(item.label, {
        x: cx + 0.25, y: iy, w: colW - 0.5, h: 0.22,
        fontSize: 11, fontFace: FONT, bold: true,
        color: C.gray10,
      });

      // Item detail
      slide.addText(item.detail, {
        x: cx + 0.25, y: iy + 0.22, w: colW - 0.5, h: 0.3,
        fontSize: 10, fontFace: FONT,
        color: C.gray50,
        lineSpacingMultiple: 1.3,
      });
    });
  });

  // Bottom bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.05, w: 13.33, h: 0.45,
    fill: { color: C.gray90 },
  });

  slide.addText("Cloud Security Best Practices  |  Recommendations", {
    x: 0.8, y: 7.08, w: 7, h: 0.35,
    fontSize: 10, fontFace: FONT,
    color: C.gray60,
  });

  slide.addText("3 / 3", {
    x: 11.5, y: 7.08, w: 1, h: 0.35,
    fontSize: 10, fontFace: FONT,
    color: C.gray60,
    align: "right",
  });
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════

buildTitleSlide();
buildChallengesSlide();
buildRecommendationsSlide();

const outputDir = join(__dirname, "outputs");
const outputPath = join(outputDir, "Cloud-Security-Best-Practices.pptx");

pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`PPTX saved to: ${outputPath}`);
  console.log("Slides: 3 (Title, Challenges, Recommendations)");
  console.log("Styling: IBM Carbon Design System (Gray 100 dark theme)");
}).catch((err) => {
  console.error("Error generating PPTX:", err);
  process.exit(1);
});
