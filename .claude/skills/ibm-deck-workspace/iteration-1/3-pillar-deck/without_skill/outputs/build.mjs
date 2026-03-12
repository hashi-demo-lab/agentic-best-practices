/**
 * build.mjs – 3-slide IBM Carbon deck: Cloud Migration Strategy
 *
 * Slide 1: Title slide
 * Slide 2: 3 pillar cards (Assess, Migrate, Optimize) with gradient accent bars & icons
 * Slide 3: Closing slide
 *
 * Uses: pptxgenjs, react, react-dom/server, sharp
 * IBM Carbon Design Tokens used throughout.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

// ── IBM Carbon Design Tokens ──────────────────────────────────────────
const carbon = {
  // Gray scale
  gray100: "#161616",
  gray90: "#262626",
  gray80: "#393939",
  gray70: "#525252",
  gray60: "#6f6f6f",
  gray50: "#8d8d8d",
  gray40: "#a8a8a8",
  gray30: "#c6c6c6",
  gray20: "#e0e0e0",
  gray10: "#f4f4f4",
  // Core
  white: "#ffffff",
  black: "#000000",
  // Blue (primary)
  blue60: "#0f62fe",
  blue70: "#0043ce",
  blue80: "#002d9c",
  blue50: "#4589ff",
  blue40: "#78a9ff",
  blue30: "#a6c8ff",
  blue20: "#d0e2ff",
  // Teal
  teal60: "#007d79",
  teal50: "#009d9a",
  teal40: "#08bdba",
  teal30: "#3ddbd9",
  // Purple
  purple60: "#8a3ffc",
  purple50: "#a56eff",
  purple40: "#be95ff",
  // Green
  green60: "#198038",
  green50: "#24a148",
  green40: "#42be65",
  // Cyan
  cyan60: "#0072c3",
  cyan50: "#1192e8",
  cyan40: "#33b1ff",
  // Magenta
  magenta60: "#d02670",
  magenta50: "#ee5396",
  // Spacing
  spacing05: "16px",
  spacing06: "24px",
  spacing07: "32px",
  spacing08: "40px",
  spacing09: "48px",
  spacing10: "64px",
  spacing11: "80px",
  spacing12: "96px",
  spacing13: "160px",
};

const W = 1920;
const H = 1080;

// ── Helper: React element → SVG string → PNG buffer ───────────────────
function renderSvgElement(element) {
  return ReactDOMServer.renderToStaticMarkup(element);
}

async function svgToPng(svgString) {
  return sharp(Buffer.from(svgString), { density: 144 })
    .resize(W * 2, H * 2)
    .png()
    .toBuffer();
}

// ── SLIDE 1: Title Slide ──────────────────────────────────────────────
function TitleSlide() {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
    },
    // Background
    React.createElement("defs", null,
      React.createElement(
        "linearGradient",
        { id: "titleBg", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
        React.createElement("stop", { offset: "0%", stopColor: carbon.gray100 }),
        React.createElement("stop", { offset: "50%", stopColor: "#0d0d1a" }),
        React.createElement("stop", { offset: "100%", stopColor: carbon.gray100 })
      ),
      // Accent gradient for decorative element
      React.createElement(
        "linearGradient",
        { id: "accentBar", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        React.createElement("stop", { offset: "0%", stopColor: carbon.blue60 }),
        React.createElement("stop", { offset: "50%", stopColor: carbon.cyan50 }),
        React.createElement("stop", { offset: "100%", stopColor: carbon.teal50 })
      ),
      // Glow filter
      React.createElement(
        "filter",
        { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%" },
        React.createElement("feGaussianBlur", { stdDeviation: "30", result: "blur" }),
        React.createElement("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })
      )
    ),
    React.createElement("rect", { width: W, height: H, fill: "url(#titleBg)" }),

    // Subtle grid pattern
    ...Array.from({ length: 18 }, (_, i) =>
      React.createElement("line", {
        key: `vg${i}`,
        x1: i * 120,
        y1: 0,
        x2: i * 120,
        y2: H,
        stroke: carbon.gray90,
        strokeWidth: "0.5",
        opacity: "0.4",
      })
    ),
    ...Array.from({ length: 10 }, (_, i) =>
      React.createElement("line", {
        key: `hg${i}`,
        x1: 0,
        y1: i * 120,
        x2: W,
        y2: i * 120,
        stroke: carbon.gray90,
        strokeWidth: "0.5",
        opacity: "0.4",
      })
    ),

    // Decorative glow orbs
    React.createElement("circle", {
      cx: 300, cy: 400, r: 200, fill: carbon.blue60, opacity: "0.06", filter: "url(#glow)"
    }),
    React.createElement("circle", {
      cx: 1600, cy: 700, r: 250, fill: carbon.teal50, opacity: "0.05", filter: "url(#glow)"
    }),

    // IBM logo placeholder (8-bar mark approximation)
    React.createElement(
      "g",
      { transform: "translate(120, 64)" },
      ...[0, 1, 2, 3, 4, 5, 6, 7].map(i =>
        React.createElement("rect", {
          key: `ibm${i}`,
          x: 0,
          y: i * 6,
          width: 32,
          height: 4,
          fill: carbon.blue50,
          rx: 1,
        })
      )
    ),

    // Top accent line
    React.createElement("rect", {
      x: 120, y: 140, width: 80, height: 4, fill: "url(#accentBar)", rx: 2
    }),

    // Section label
    React.createElement(
      "text",
      {
        x: 120,
        y: 190,
        fill: carbon.blue40,
        fontSize: "14",
        fontFamily: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: "600",
        letterSpacing: "2",
      },
      "CLOUD STRATEGY"
    ),

    // Main title
    React.createElement(
      "text",
      {
        x: 120,
        y: 320,
        fill: carbon.white,
        fontSize: "72",
        fontFamily: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: "300",
      },
      "Cloud Migration"
    ),
    React.createElement(
      "text",
      {
        x: 120,
        y: 410,
        fill: carbon.white,
        fontSize: "72",
        fontFamily: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: "600",
      },
      "Strategy"
    ),

    // Subtitle
    React.createElement(
      "text",
      {
        x: 120,
        y: 490,
        fill: carbon.gray40,
        fontSize: "24",
        fontFamily: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: "400",
      },
      "A structured approach to enterprise cloud transformation"
    ),

    // Decorative accent bar at bottom
    React.createElement("rect", {
      x: 0, y: H - 6, width: W, height: 6, fill: "url(#accentBar)"
    }),

    // Bottom info
    React.createElement(
      "text",
      {
        x: 120,
        y: H - 48,
        fill: carbon.gray50,
        fontSize: "16",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        fontWeight: "400",
      },
      "2026  |  Enterprise Architecture  |  Confidential"
    ),

    // Right-side decorative element: abstract cloud migration visual
    React.createElement(
      "g",
      { transform: "translate(1100, 280)" },
      // Source nodes (on-prem)
      ...[0, 1, 2].map(i =>
        React.createElement("rect", {
          key: `src${i}`,
          x: 0,
          y: i * 100,
          width: 120,
          height: 70,
          rx: 4,
          fill: "none",
          stroke: carbon.gray60,
          strokeWidth: 1.5,
          opacity: 0.7,
        })
      ),
      ...[0, 1, 2].map(i =>
        React.createElement("text", {
          key: `srct${i}`,
          x: 60,
          y: i * 100 + 42,
          textAnchor: "middle",
          fill: carbon.gray40,
          fontSize: "13",
          fontFamily: "'IBM Plex Mono', monospace",
        }, ["VM-01", "VM-02", "DB-01"][i])
      ),

      // Arrow paths
      ...[0, 1, 2].map(i =>
        React.createElement("path", {
          key: `arrow${i}`,
          d: `M 130 ${i * 100 + 35} C 250 ${i * 100 + 35}, 280 200, 380 200`,
          fill: "none",
          stroke: carbon.blue50,
          strokeWidth: 2,
          strokeDasharray: "6 4",
          opacity: 0.5 + i * 0.15,
        })
      ),

      // Cloud target
      React.createElement("rect", {
        x: 380, y: 140, width: 200, height: 130, rx: 8,
        fill: carbon.gray90, stroke: carbon.blue60, strokeWidth: 2,
      }),
      // Cloud icon (simplified)
      React.createElement("path", {
        d: "M440 195 Q440 175 460 175 Q470 160 490 160 Q510 160 520 175 Q540 175 540 195 Q540 210 520 210 L460 210 Q440 210 440 195Z",
        fill: "none",
        stroke: carbon.blue40,
        strokeWidth: 2,
      }),
      React.createElement("text", {
        x: 480, y: 248, textAnchor: "middle",
        fill: carbon.white, fontSize: "16",
        fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "600",
      }, "IBM Cloud"),
    )
  );
}

// ── SLIDE 2: Three Pillar Cards ───────────────────────────────────────
function PillarSlide() {
  const pillars = [
    {
      title: "Assess",
      gradientColors: [carbon.blue60, carbon.blue40],
      icon: "assess",
      items: [
        "Application portfolio analysis",
        "Dependency mapping",
        "TCO & ROI modeling",
        "Risk classification",
        "Migration wave planning",
      ],
      number: "01",
    },
    {
      title: "Migrate",
      gradientColors: [carbon.teal60, carbon.teal40],
      icon: "migrate",
      items: [
        "Rehost, refactor, or rebuild",
        "Data migration pipelines",
        "Network & security config",
        "CI/CD modernization",
        "Validation & cutover",
      ],
      number: "02",
    },
    {
      title: "Optimize",
      gradientColors: [carbon.purple60, carbon.purple40],
      icon: "optimize",
      items: [
        "Cost governance & FinOps",
        "Auto-scaling policies",
        "Observability & SRE",
        "Security posture mgmt",
        "Continuous improvement",
      ],
      number: "03",
    },
  ];

  const cardW = 480;
  const cardH = 560;
  const gap = 60;
  const totalW = 3 * cardW + 2 * gap;
  const startX = (W - totalW) / 2;
  const startY = 220;
  const accentH = 8;

  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
    },
    // Defs
    React.createElement("defs", null,
      React.createElement(
        "linearGradient",
        { id: "pageBg2", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
        React.createElement("stop", { offset: "0%", stopColor: carbon.gray100 }),
        React.createElement("stop", { offset: "100%", stopColor: "#0d0d1a" })
      ),
      ...pillars.map((p, i) =>
        React.createElement(
          "linearGradient",
          { key: `grad${i}`, id: `cardGrad${i}`, x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
          React.createElement("stop", { offset: "0%", stopColor: p.gradientColors[0] }),
          React.createElement("stop", { offset: "100%", stopColor: p.gradientColors[1] })
        )
      ),
      React.createElement(
        "linearGradient",
        { id: "titleAccent2", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        React.createElement("stop", { offset: "0%", stopColor: carbon.blue60 }),
        React.createElement("stop", { offset: "100%", stopColor: carbon.teal50 })
      )
    ),

    // Background
    React.createElement("rect", { width: W, height: H, fill: "url(#pageBg2)" }),

    // Subtle grid
    ...Array.from({ length: 18 }, (_, i) =>
      React.createElement("line", {
        key: `vg2${i}`,
        x1: i * 120, y1: 0, x2: i * 120, y2: H,
        stroke: carbon.gray90, strokeWidth: "0.5", opacity: "0.3",
      })
    ),
    ...Array.from({ length: 10 }, (_, i) =>
      React.createElement("line", {
        key: `hg2${i}`,
        x1: 0, y1: i * 120, x2: W, y2: i * 120,
        stroke: carbon.gray90, strokeWidth: "0.5", opacity: "0.3",
      })
    ),

    // Page title
    React.createElement("rect", {
      x: 120, y: 64, width: 60, height: 3, fill: "url(#titleAccent2)", rx: 1.5
    }),
    React.createElement(
      "text",
      {
        x: 120, y: 105,
        fill: carbon.blue40, fontSize: "13",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: "600", letterSpacing: "2",
      },
      "THREE PILLARS"
    ),
    React.createElement(
      "text",
      {
        x: 120, y: 155,
        fill: carbon.white, fontSize: "40",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: "300",
      },
      "Migration Framework"
    ),
    React.createElement(
      "text",
      {
        x: 540, y: 155,
        fill: carbon.gray40, fontSize: "18",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: "400",
      },
      "A phased approach to cloud transformation"
    ),

    // Bottom accent
    React.createElement("rect", {
      x: 0, y: H - 4, width: W, height: 4, fill: "url(#titleAccent2)"
    }),

    // Cards
    ...pillars.flatMap((pillar, i) => {
      const cx = startX + i * (cardW + gap);
      const cy = startY;
      const iconPaths = {
        assess: `M${cx + 38} ${cy + 75} L${cx + 38} ${cy + 50} L${cx + 63} ${cy + 50} L${cx + 63} ${cy + 75} Z M${cx + 45} ${cy + 58} L${cx + 56} ${cy + 58} M${cx + 45} ${cy + 65} L${cx + 56} ${cy + 65} M${cx + 50} ${cy + 44} L${cx + 50} ${cy + 50} M${cx + 42} ${cy + 38} C${cx + 42} ${cy + 34} ${cx + 46} ${cy + 30} ${cx + 50} ${cy + 30} C${cx + 54} ${cy + 30} ${cx + 58} ${cy + 34} ${cx + 58} ${cy + 38}`,
        migrate: `M${cx + 35} ${cy + 55} L${cx + 50} ${cy + 40} L${cx + 65} ${cy + 55} M${cx + 50} ${cy + 42} L${cx + 50} ${cy + 72} M${cx + 30} ${cy + 72} L${cx + 70} ${cy + 72}`,
        optimize: `M${cx + 50} ${cy + 32} L${cx + 50} ${cy + 50} L${cx + 62} ${cy + 58} M${cx + 50} ${cy + 75} A25 25 0 1 1 ${cx + 50} ${cy + 25} A25 25 0 1 1 ${cx + 50} ${cy + 75}`,
      };

      return [
        // Card background
        React.createElement("rect", {
          key: `card${i}`,
          x: cx, y: cy, width: cardW, height: cardH, rx: 4,
          fill: carbon.gray90, stroke: carbon.gray80, strokeWidth: 1,
        }),

        // Gradient accent bar at top
        React.createElement("rect", {
          key: `accent${i}`,
          x: cx, y: cy, width: cardW, height: accentH, rx: 0,
          fill: `url(#cardGrad${i})`,
        }),
        // Clip top corners of accent to match card radius
        React.createElement("rect", {
          key: `accentTL${i}`,
          x: cx, y: cy, width: 4, height: accentH,
          fill: `url(#cardGrad${i})`, rx: 4,
        }),

        // Number
        React.createElement("text", {
          key: `num${i}`,
          x: cx + cardW - 32, y: cy + 52,
          fill: carbon.gray70, fontSize: "48",
          fontFamily: "'IBM Plex Mono', monospace", fontWeight: "300",
          textAnchor: "end", opacity: "0.5",
        }, pillar.number),

        // Icon
        React.createElement("path", {
          key: `icon${i}`,
          d: iconPaths[pillar.icon],
          fill: "none",
          stroke: pillar.gradientColors[1],
          strokeWidth: 2.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),

        // Title
        React.createElement("text", {
          key: `title${i}`,
          x: cx + 32, y: cy + 120,
          fill: carbon.white, fontSize: "32",
          fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "600",
        }, pillar.title),

        // Divider line
        React.createElement("line", {
          key: `div${i}`,
          x1: cx + 32, y1: cy + 145, x2: cx + cardW - 32, y2: cy + 145,
          stroke: carbon.gray70, strokeWidth: 1, opacity: 0.5,
        }),

        // List items
        ...pillar.items.map((item, j) =>
          React.createElement(
            "g",
            { key: `item${i}-${j}` },
            // Bullet dot
            React.createElement("circle", {
              cx: cx + 44, cy: cy + 185 + j * 72,
              r: 4, fill: pillar.gradientColors[1], opacity: 0.8,
            }),
            // Item text
            React.createElement("text", {
              x: cx + 62, y: cy + 190 + j * 72,
              fill: carbon.gray20, fontSize: "18",
              fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "400",
            }, item),
            // Subtle underline
            j < pillar.items.length - 1
              ? React.createElement("line", {
                  x1: cx + 32, y1: cy + 210 + j * 72, x2: cx + cardW - 32, y2: cy + 210 + j * 72,
                  stroke: carbon.gray80, strokeWidth: 0.5,
                })
              : null
          )
        ),
      ];
    })
  );
}

// ── SLIDE 3: Closing Slide ────────────────────────────────────────────
function ClosingSlide() {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
    },
    React.createElement("defs", null,
      React.createElement(
        "linearGradient",
        { id: "closeBg", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
        React.createElement("stop", { offset: "0%", stopColor: carbon.gray100 }),
        React.createElement("stop", { offset: "40%", stopColor: "#0a0a1e" }),
        React.createElement("stop", { offset: "100%", stopColor: carbon.gray100 })
      ),
      React.createElement(
        "linearGradient",
        { id: "closeAccent", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        React.createElement("stop", { offset: "0%", stopColor: carbon.blue60 }),
        React.createElement("stop", { offset: "50%", stopColor: carbon.cyan50 }),
        React.createElement("stop", { offset: "100%", stopColor: carbon.teal50 })
      ),
      React.createElement(
        "filter",
        { id: "glow3", x: "-50%", y: "-50%", width: "200%", height: "200%" },
        React.createElement("feGaussianBlur", { stdDeviation: "40", result: "blur" }),
        React.createElement("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })
      ),
      React.createElement(
        "linearGradient",
        { id: "ctaGrad", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        React.createElement("stop", { offset: "0%", stopColor: carbon.blue60 }),
        React.createElement("stop", { offset: "100%", stopColor: carbon.blue50 })
      )
    ),

    // Background
    React.createElement("rect", { width: W, height: H, fill: "url(#closeBg)" }),

    // Grid
    ...Array.from({ length: 18 }, (_, i) =>
      React.createElement("line", {
        key: `vg3${i}`,
        x1: i * 120, y1: 0, x2: i * 120, y2: H,
        stroke: carbon.gray90, strokeWidth: "0.5", opacity: "0.3",
      })
    ),
    ...Array.from({ length: 10 }, (_, i) =>
      React.createElement("line", {
        key: `hg3${i}`,
        x1: 0, y1: i * 120, x2: W, y2: i * 120,
        stroke: carbon.gray90, strokeWidth: "0.5", opacity: "0.3",
      })
    ),

    // Glow orbs
    React.createElement("circle", {
      cx: W / 2, cy: H / 2 - 60, r: 300, fill: carbon.blue60, opacity: "0.04", filter: "url(#glow3)"
    }),
    React.createElement("circle", {
      cx: W / 2 + 200, cy: H / 2 + 80, r: 200, fill: carbon.teal50, opacity: "0.03", filter: "url(#glow3)"
    }),

    // IBM logo placeholder
    React.createElement(
      "g",
      { transform: "translate(120, 64)" },
      ...[0, 1, 2, 3, 4, 5, 6, 7].map(i =>
        React.createElement("rect", {
          key: `ibm3${i}`,
          x: 0, y: i * 6, width: 32, height: 4,
          fill: carbon.blue50, rx: 1,
        })
      )
    ),

    // Centered content
    // Accent line
    React.createElement("rect", {
      x: W / 2 - 40, y: 320, width: 80, height: 3, fill: "url(#closeAccent)", rx: 1.5
    }),

    // Main message
    React.createElement(
      "text",
      {
        x: W / 2, y: 410,
        fill: carbon.white, fontSize: "56",
        fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "300",
        textAnchor: "middle",
      },
      "Ready to begin your"
    ),
    React.createElement(
      "text",
      {
        x: W / 2, y: 480,
        fill: carbon.white, fontSize: "56",
        fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "600",
        textAnchor: "middle",
      },
      "cloud journey?"
    ),

    // CTA button
    React.createElement("rect", {
      x: W / 2 - 140, y: 530, width: 280, height: 56, rx: 4,
      fill: "url(#ctaGrad)",
    }),
    React.createElement("text", {
      x: W / 2, y: 565,
      fill: carbon.white, fontSize: "18",
      fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "600",
      textAnchor: "middle",
    }, "Schedule a Workshop"),

    // Contact info
    React.createElement("text", {
      x: W / 2, y: 650,
      fill: carbon.gray50, fontSize: "16",
      fontFamily: "'IBM Plex Mono', monospace", fontWeight: "400",
      textAnchor: "middle",
    }, "cloud-migration@ibm.com  |  ibm.com/cloud/migration"),

    // Three summary stats
    ...[
      { label: "Assessment", value: "2-4 wks", x: W / 2 - 320 },
      { label: "Migration", value: "8-16 wks", x: W / 2 },
      { label: "Optimization", value: "Ongoing", x: W / 2 + 320 },
    ].map((stat, i) =>
      React.createElement("g", { key: `stat${i}` },
        React.createElement("text", {
          x: stat.x, y: 760,
          fill: [carbon.blue40, carbon.teal40, carbon.purple40][i],
          fontSize: "36", fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: "600", textAnchor: "middle",
        }, stat.value),
        React.createElement("text", {
          x: stat.x, y: 792,
          fill: carbon.gray50, fontSize: "16",
          fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "400",
          textAnchor: "middle",
        }, stat.label),
      )
    ),

    // Bottom accent
    React.createElement("rect", {
      x: 0, y: H - 6, width: W, height: 6, fill: "url(#closeAccent)"
    }),

    // Footer
    React.createElement("text", {
      x: W / 2, y: H - 40,
      fill: carbon.gray60, fontSize: "14",
      fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: "400",
      textAnchor: "middle",
    }, "\u00A9 2026 IBM Corporation. All rights reserved."),
  );
}

// ── BUILD PIPELINE ────────────────────────────────────────────────────
async function build() {
  console.log("Rendering slides to SVG...");

  const slides = [
    { name: "Title", component: TitleSlide },
    { name: "Pillars", component: PillarSlide },
    { name: "Closing", component: ClosingSlide },
  ];

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "IBM Cloud Architecture";
  pptx.title = "Cloud Migration Strategy";
  pptx.subject = "A structured approach to enterprise cloud transformation";

  for (const slide of slides) {
    console.log(`  Processing: ${slide.name}`);

    const svgString = renderSvgElement(React.createElement(slide.component));
    const pngBuffer = await svgToPng(svgString);

    const base64 = pngBuffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64}`;

    const s = pptx.addSlide();
    s.background = { color: "161616" };
    s.addImage({
      data: dataUri,
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
    });
  }

  const outputDir = path.dirname(new URL(import.meta.url).pathname);
  const outputPath = path.join(outputDir, "migration-strategy.pptx");

  console.log(`Writing PPTX to ${outputPath}`);
  await pptx.writeFile({ fileName: outputPath });
  console.log("Done! PPTX created successfully.");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
