import pptxgen from "pptxgenjs";
import sharp from "sharp";

// Render gradient hero text as SVG → PNG for PPTX embedding
async function renderGradientTitle(text, gradientStops, width = 700, height = 120) {
  const gradientId = "g" + Math.random().toString(36).slice(2, 8);
  const stops = gradientStops
    .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}"/>`)
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="0.3">
        ${stops}
      </linearGradient>
    </defs>
    <text x="0" y="${height * 0.75}" font-size="${height * 0.82}" font-weight="800" font-family="Arial,Helvetica,sans-serif" fill="url(#${gradientId})">${text}</text>
  </svg>`;

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Render a gradient accent bar as SVG → PNG for PPTX embedding
// The bar clips to match rounded top corners of the card beneath it.
async function renderGradientBar(colors, width = 396, height = 8, borderRadius = 16) {
  const gradientId = "gb" + Math.random().toString(36).slice(2, 8);
  // Since the bar height (8px) < borderRadius (16px), we draw a full
  // rounded-top rect taller than the bar and clip it to the bar height.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="50%" stop-color="${colors[1]}"/>
        <stop offset="100%" stop-color="${colors[2]}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${borderRadius * 2}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#${gradientId})"/>
  </svg>`;

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Factory function — pptxgenjs mutates shadow objects
const cardShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 10,
  offset: 3,
  angle: 270,
  opacity: 0.06,
});

async function buildNativeSlide7() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";

  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  // 1920px = 10", so 192px = 1"
  const px = (v) => v / 192;

  // --- HEADER ---
  s.addText("STRATEGIC IMPACT", {
    x: px(80),
    y: px(48),
    w: 5,
    h: px(24),
    fontSize: 7,
    fontFace: "Arial",
    color: "996f00",
    bold: true,
    charSpacing: 3,
    margin: 0,
  });

  s.addText(
    "How the Resident Solution Architect Creates Compounding Value",
    {
      x: px(80),
      y: px(72),
      w: px(1760),
      h: px(50),
      fontSize: 20,
      fontFace: "Arial",
      color: "000000",
      bold: true,
      margin: 0,
    }
  );

  s.addText(
    "Each capability unlocks the next \u2014 building momentum across your organization",
    {
      x: px(80),
      y: px(126),
      w: px(1760),
      h: px(30),
      fontSize: 11.5,
      fontFace: "Arial",
      color: "525252",
      margin: 0,
    }
  );

  // SVG area positioning
  const svgTop = px(282);
  const svgLeft = px(80);
  const cardW = px(396);
  const cardH = px(540);
  const accentBarH = px(8);
  const cardXOffsets = [22, 462, 902, 1342];

  const cards = [
    {
      num: "01",
      title: "Establish",
      subtitle: "Guardrails & Controls",
      items: [
        "RBAC and agent isolation",
        "Secrets management",
        "Policy-as-code enforcement",
        "Human-in-loop approvals",
      ],
      outcome: "Zero unreviewed changes\nreach production",
      accentColor1: "627EEF",
      accentColor2: "8A3FFC",
      accentColor3: "D946EF",
      numColor: "8A3FFC",
      outcomeColor: "6929C4",
      dividerColor: "C4B0FF",
      bgColor: "F2EEFF",
      arrowColor: "8A3FFC",
    },
    {
      num: "02",
      title: "Enable",
      subtitle: "Self-Service Infra",
      items: [
        "Consumer workflow patterns",
        "Natural language provisioning",
        "Registry-backed modules",
        "Guardrailed consumption",
      ],
      outcome: "Teams provision in minutes,\nnot days",
      accentColor1: "007D79",
      accentColor2: "009D9A",
      accentColor3: "2DD4BF",
      numColor: "009D9A",
      outcomeColor: "005D5D",
      dividerColor: "A0DCD9",
      bgColor: "EBF8F7",
      arrowColor: "009D9A",
    },
    {
      num: "03",
      title: "Accelerate",
      subtitle: "Pattern Authoring",
      items: [
        "Spec-driven development",
        "AI-assisted module creation",
        "Automated test generation",
        "Cross-team module sharing",
      ],
      outcome: "Module delivery:\nweeks \u2192 hours",
      accentColor1: "0E6027",
      accentColor2: "198038",
      accentColor3: "34D478",
      numColor: "198038",
      outcomeColor: "0E6027",
      dividerColor: "A0D4AC",
      bgColor: "EFF7F0",
      arrowColor: "198038",
    },
    {
      num: "04",
      title: "Scale",
      subtitle: "Organization-Wide",
      items: [
        "Cross-team adoption",
        "Consistent standards everywhere",
        "Self-sufficient operations",
        "Measurable ROI",
      ],
      outcome: "Every team benefits\nfrom every pattern",
      accentColor1: "8A6800",
      accentColor2: "B28600",
      accentColor3: "F59E0B",
      numColor: "B28600",
      outcomeColor: "7A5800",
      dividerColor: "E0C878",
      bgColor: "FFF9EC",
      arrowColor: "B28600",
    },
  ];

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const cx = svgLeft + px(cardXOffsets[i]);
    const cy = svgTop + px(10);

    // Card background — solid fill (gradient fills can corrupt PPTX)
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx,
      y: cy,
      w: cardW,
      h: cardH,
      rectRadius: 0.08,
      fill: { color: c.bgColor },
      shadow: cardShadow(),
    });

    // Accent bar — gradient PNG image
    const barImg = await renderGradientBar(
      ["#" + c.accentColor1, "#" + c.accentColor2, "#" + c.accentColor3],
      396,
      8,
      16
    );
    s.addImage({
      data: barImg,
      x: cx,
      y: cy,
      w: cardW,
      h: accentBarH,
    });

    // Step number
    s.addText(c.num, {
      x: cx + px(34),
      y: cy + px(36),
      w: px(60),
      h: px(22),
      fontSize: 8,
      fontFace: "Arial",
      color: c.numColor,
      bold: true,
      charSpacing: 2,
      margin: 0,
    });

    // Hero title — gradient PNG image
    const titleGradient = [
      { offset: 0, color: "#" + c.accentColor1 },
      { offset: 50, color: "#" + c.accentColor2 },
      { offset: 100, color: "#" + c.accentColor3 },
    ];
    const titleRenderW = c.title.length > 7 ? 900 : 700;
    const titleImg = await renderGradientTitle(
      c.title,
      titleGradient,
      titleRenderW,
      120
    );
    const titleImgW = cardW - px(50);
    const titleImgH = titleImgW * (120 / titleRenderW);
    s.addImage({
      data: titleImg,
      x: cx + px(30),
      y: cy + px(78),
      w: titleImgW,
      h: titleImgH,
    });

    // Subtitle — pushed down to avoid overlapping hero title image
    s.addText(c.subtitle, {
      x: cx + px(34),
      y: cy + px(158),
      w: cardW - px(68),
      h: px(28),
      fontSize: 10.5,
      fontFace: "Arial",
      color: "525252",
      bold: true,
      valign: "middle",
      margin: 0,
    });

    // Top divider
    s.addShape(pres.shapes.LINE, {
      x: cx + px(34),
      y: cy + px(198),
      w: cardW - px(68),
      h: 0,
      line: { color: c.dividerColor, width: 0.5 },
    });

    // Content items — individually positioned
    const itemYs = [240, 282, 324, 366];
    for (let j = 0; j < c.items.length; j++) {
      s.addText(c.items[j], {
        x: cx + px(34),
        y: cy + px(itemYs[j]) - px(12),
        w: cardW - px(68),
        h: px(28),
        fontSize: 10,
        fontFace: "Arial",
        color: "525252",
        valign: "middle",
        margin: 0,
      });
    }

    // Bottom divider
    s.addShape(pres.shapes.LINE, {
      x: cx + px(34),
      y: cy + px(410),
      w: cardW - px(68),
      h: 0,
      line: { color: c.dividerColor, width: 0.5 },
    });

    // Outcome text
    s.addText(c.outcome, {
      x: cx + px(34),
      y: cy + px(430),
      w: cardW - px(68),
      h: px(80),
      fontSize: 9.5,
      fontFace: "Arial",
      color: c.outcomeColor,
      bold: true,
      valign: "top",
      margin: 0,
    });

    // Arrow to next card
    if (i < cards.length - 1) {
      const arrowXOffsets = [420, 860, 1300];
      s.addShape(pres.shapes.LINE, {
        x: svgLeft + px(arrowXOffsets[i]),
        y: svgTop + px(280),
        w: px(48),
        h: 0,
        line: {
          color: c.arrowColor,
          width: 2,
          endArrowType: "triangle",
        },
      });
    }
  }

  // Bottom callout bar
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px(80),
    y: px(990),
    w: px(1760),
    h: px(54),
    rectRadius: 0.05,
    fill: { color: "F0FFF4" },
    line: { color: "009D9A", width: 0.75 },
  });

  s.addText("\u2605", {
    x: px(94),
    y: px(990),
    w: px(30),
    h: px(54),
    fontSize: 13,
    fontFace: "Arial",
    color: "009D9A",
    align: "center",
    valign: "middle",
    margin: 0,
  });

  s.addText(
    [
      {
        text: "Compounding returns",
        options: { bold: true, color: "000000", fontSize: 9.5 },
      },
      {
        text: " \u2014 each stage builds on the last, creating a flywheel of capability that accelerates over time.",
        options: { color: "393939", fontSize: 9.5 },
      },
    ],
    {
      x: px(136),
      y: px(990),
      w: px(1700),
      h: px(54),
      fontFace: "Arial",
      valign: "middle",
      margin: 0,
    }
  );

  const fileName = "experiment-native-slide7.pptx";
  await pres.writeFile({ fileName });
  console.log(`Created: ${fileName}`);
}

buildNativeSlide7().catch(console.error);
