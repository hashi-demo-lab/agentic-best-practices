import pptxgen from "pptxgenjs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import sharp from "sharp";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaBug,
  FaBalanceScale,
  FaUserSecret,
  FaLock,
  FaCloudUploadAlt,
  FaClipboardCheck,
} from "react-icons/fa";

// --- Icon helper (from skill) ---
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
  type: "outer",
  color: "000000",
  blur: 8,
  offset: 2,
  angle: 135,
  opacity: 0.08,
});

const footerBarShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 4,
  offset: 1,
  angle: 270,
  opacity: 0.06,
});

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "IBM Security";
  pres.title = "Cloud Security Best Practices";

  // =========================================================================
  // SLIDE 1 — Title Slide (programmatic, testing content patterns)
  // =========================================================================
  // The skill says title slides should use HTML capture for premium look,
  // but we're explicitly testing the programmatic approach here.
  const s1 = pres.addSlide();

  // Dark background to simulate the premium title treatment
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: C.gray100 },
  });

  // Accent line across top
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.06,
    fill: { color: C.blue60 },
  });

  // Shield icon (large, centered)
  const shieldIcon = await iconToBase64Png(FaShieldAlt, "#" + C.blue60, 256);
  s1.addImage({
    data: shieldIcon,
    x: 4.5,
    y: 1.2,
    w: 1.0,
    h: 1.0,
  });

  // Title line 1
  s1.addText("Cloud Security", {
    x: 0.7,
    y: 2.4,
    w: 8.6,
    h: 0.7,
    fontSize: 36,
    fontFace: "Arial Black",
    color: C.white,
    bold: true,
    align: "center",
    margin: 0,
  });

  // Title line 2
  s1.addText("Best Practices", {
    x: 0.7,
    y: 3.0,
    w: 8.6,
    h: 0.7,
    fontSize: 36,
    fontFace: "Arial Black",
    color: C.blue60,
    bold: true,
    align: "center",
    margin: 0,
  });

  // Subtitle
  s1.addText("Securing Your Cloud Infrastructure in 2026", {
    x: 0.7,
    y: 3.8,
    w: 8.6,
    h: 0.4,
    fontSize: 14,
    fontFace: "Arial",
    color: C.gray50,
    align: "center",
    margin: 0,
  });

  // Bottom accent line
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 5.565,
    w: 10,
    h: 0.06,
    fill: { color: C.blue60 },
  });

  // =========================================================================
  // SLIDE 2 — Challenges: 4 Risk Cards in 2x2 Grid
  // =========================================================================
  const s2 = pres.addSlide();

  // Slide header (section label + title + subtitle)
  s2.addText("CLOUD SECURITY", {
    x: 0.7,
    y: 0.35,
    w: 5,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: C.red60,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s2.addText("Key Security Challenges", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.45,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s2.addText(
    "Critical risks that organizations face when operating in the cloud",
    {
      x: 0.7,
      y: 1.0,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // 2x2 grid layout (from skill)
  const cardW = 4.1,
    cardH = 1.35;
  const cardGapX = 0.4,
    cardGapY = 0.2;
  const gridStartX = 0.7,
    gridStartY = 1.5;

  const challenges = [
    {
      icon: FaExclamationTriangle,
      color: C.red60,
      title: "Data Breaches",
      desc: "Unauthorized access to sensitive data through exploited vulnerabilities, weak credentials, or misconfigured access controls.",
    },
    {
      icon: FaBug,
      color: C.magenta60,
      title: "Misconfigurations",
      desc: "Improperly configured cloud resources that expose storage buckets, databases, or APIs to the public internet.",
    },
    {
      icon: FaBalanceScale,
      color: C.yellow50,
      title: "Compliance Gaps",
      desc: "Failure to meet regulatory requirements (SOC2, HIPAA, PCI-DSS) due to inconsistent policy enforcement across environments.",
    },
    {
      icon: FaUserSecret,
      color: C.purple60,
      title: "Insider Threats",
      desc: "Malicious or negligent actions by employees and contractors with privileged access to cloud resources.",
    },
  ];

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + cardGapX);
    const cy = gridStartY + row * (cardH + cardGapY);
    const ch = challenges[i];

    // Card background
    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: cardW,
      h: cardH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Left accent bar (0.06" wide)
    s2.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: 0.06,
      h: cardH,
      fill: { color: ch.color },
    });

    // Icon (rendered from react-icons)
    const iconData = await iconToBase64Png(ch.icon, "#" + ch.color, 256);
    s2.addImage({
      data: iconData,
      x: cx + 0.2,
      y: cy + 0.2,
      w: 0.38,
      h: 0.38,
    });

    // Card title
    s2.addText(ch.title, {
      x: cx + 0.7,
      y: cy + 0.15,
      w: cardW - 0.9,
      h: 0.4,
      fontSize: 15,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Card description
    s2.addText(ch.desc, {
      x: cx + 0.7,
      y: cy + 0.6,
      w: cardW - 0.9,
      h: 0.7,
      fontSize: 11,
      fontFace: "Arial",
      color: C.gray70,
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.55,
    w: 8.6,
    h: 0.55,
    fill: { color: "FFF0F0" },
    line: { color: C.red60, width: 1 },
  });

  const alertIcon = await iconToBase64Png(
    FaExclamationTriangle,
    "#" + C.red60,
    256
  );
  s2.addImage({
    data: alertIcon,
    x: 0.9,
    y: 4.62,
    w: 0.35,
    h: 0.35,
  });

  s2.addText(
    [
      {
        text: "60% of breaches ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "involve cloud misconfigurations as a contributing factor.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.4,
      y: 4.55,
      w: 7.7,
      h: 0.55,
      fontSize: 11,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =========================================================================
  // SLIDE 3 — Recommendations: 3 Columns of Best Practices
  // =========================================================================
  const s3 = pres.addSlide();

  // Slide header
  s3.addText("RECOMMENDATIONS", {
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

  s3.addText("Security Best Practices", {
    x: 0.7,
    y: 0.6,
    w: 8.6,
    h: 0.45,
    fontSize: 22,
    fontFace: "Arial Black",
    color: C.gray100,
    bold: true,
    margin: 0,
  });

  s3.addText(
    "Proven strategies to strengthen your cloud security posture",
    {
      x: 0.7,
      y: 1.0,
      w: 8.6,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: C.gray70,
      margin: 0,
    }
  );

  // 3-column pillar layout (from skill)
  const pillarW = 2.75,
    pillarH = 2.95;
  const pillarGap = 0.45;
  const startX = 0.7,
    startY = 1.65;

  const pillars = [
    {
      icon: FaLock,
      color: C.blue60,
      title: "Access & Identity",
      items: [
        "Enforce multi-factor authentication across all accounts",
        "Implement least-privilege IAM policies",
        "Rotate credentials and API keys on a regular schedule",
        "Use federated identity with SSO providers",
        "Audit access logs continuously",
      ],
    },
    {
      icon: FaCloudUploadAlt,
      color: C.teal60,
      title: "Infrastructure Hardening",
      items: [
        "Enable encryption at rest and in transit",
        "Use Infrastructure as Code for consistent deployments",
        "Apply security groups and network segmentation",
        "Automate vulnerability scanning in CI/CD",
        "Implement immutable infrastructure patterns",
      ],
    },
    {
      icon: FaClipboardCheck,
      color: C.green60,
      title: "Governance & Compliance",
      items: [
        "Establish cloud security policies and standards",
        "Automate compliance checks with policy-as-code",
        "Maintain audit trails for all resource changes",
        "Conduct regular penetration testing",
        "Create and rehearse incident response playbooks",
      ],
    },
  ];

  for (let i = 0; i < 3; i++) {
    const px = startX + i * (pillarW + pillarGap);
    const p = pillars[i];

    // Card background
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: startY,
      w: pillarW,
      h: pillarH,
      fill: { color: C.gray10 },
      shadow: cardShadow(),
    });

    // Top accent bar
    s3.addShape(pres.shapes.RECTANGLE, {
      x: px,
      y: startY,
      w: pillarW,
      h: 0.05,
      fill: { color: p.color },
    });

    // Icon
    const iconData = await iconToBase64Png(p.icon, "#" + p.color, 256);
    s3.addImage({
      data: iconData,
      x: px + 0.25,
      y: startY + 0.25,
      w: 0.42,
      h: 0.42,
    });

    // Pillar title
    s3.addText(p.title, {
      x: px + 0.25,
      y: startY + 0.78,
      w: pillarW - 0.5,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      color: C.gray100,
      bold: true,
      margin: 0,
    });

    // Bullet items
    const bullets = p.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: "2022" },
        breakLine: idx < p.items.length - 1,
        fontSize: 11,
        color: C.gray70,
        paraSpaceAfter: 6,
      },
    }));

    s3.addText(bullets, {
      x: px + 0.25,
      y: startY + 1.2,
      w: pillarW - 0.5,
      h: 1.7,
      fontFace: "Arial",
      valign: "top",
      margin: 0,
    });
  }

  // Bottom callout bar
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.7,
    y: 4.75,
    w: 8.6,
    h: 0.55,
    fill: { color: "F0F5FF" },
    line: { color: C.blue60, width: 1 },
  });

  const shieldCalloutIcon = await iconToBase64Png(
    FaShieldAlt,
    "#" + C.blue60,
    256
  );
  s3.addImage({
    data: shieldCalloutIcon,
    x: 0.9,
    y: 4.82,
    w: 0.35,
    h: 0.35,
  });

  s3.addText(
    [
      {
        text: "Defense in depth: ",
        options: { bold: true, color: C.gray100 },
      },
      {
        text: "Layer multiple security controls so that no single point of failure compromises the entire environment.",
        options: { color: C.gray70 },
      },
    ],
    {
      x: 1.4,
      y: 4.75,
      w: 7.7,
      h: 0.55,
      fontSize: 11,
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  // =========================================================================
  // Write the PPTX
  // =========================================================================
  const outputDir = new URL("./outputs/", import.meta.url).pathname;
  const outputPath = outputDir + "cloud-security-best-practices.pptx";

  await pres.writeFile({ fileName: outputPath });
  console.log(`PPTX written to: ${outputPath}`);
}

buildPresentation().catch(console.error);
