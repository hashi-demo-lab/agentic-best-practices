import pptxgen from "pptxgenjs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imgDir = resolve(__dirname, "images");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Simon Lynch";
pres.title = "Modernizing Terraform — AI-Driven Infrastructure";
pres.subject = "Spec-Driven Development with Agentic AI";

// Helpers
function addImageSlide(pngName) {
  const slide = pres.addSlide();
  slide.background = { color: "000000" };
  slide.addImage({
    path: resolve(imgDir, pngName),
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
  });
  return slide;
}

function addTitleSlide(title, subtitle) {
  const slide = pres.addSlide();
  slide.background = { color: "000000" };
  slide.addText(title, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 40,
    fontFace: "Arial",
    color: "E0E0E8",
    bold: true,
    align: "center",
    valign: "middle",
  });
  slide.addText(subtitle, {
    x: 0.5,
    y: 3.0,
    w: 9,
    h: 1.0,
    fontSize: 22,
    fontFace: "Arial",
    color: "8888A0",
    align: "center",
    valign: "middle",
  });
  return slide;
}

function addDividerSlide(sectionTitle, sectionSubtitle) {
  const slide = pres.addSlide();
  slide.background = { color: "000000" };
  slide.addText(sectionTitle, {
    x: 0.5,
    y: 2.0,
    w: 9,
    h: 1.2,
    fontSize: 36,
    fontFace: "Arial",
    color: "B44DFF",
    bold: true,
    align: "center",
    valign: "middle",
  });
  if (sectionSubtitle) {
    slide.addText(sectionSubtitle, {
      x: 1,
      y: 3.2,
      w: 8,
      h: 0.8,
      fontSize: 18,
      fontFace: "Arial",
      color: "8888A0",
      italic: true,
      align: "center",
      valign: "middle",
    });
  }
  return slide;
}

// ── Act 1: Why (Slides 1-5) ──

// Slide 1: Title
addImageSlide("slide-01-title.png");

// Slide 2: The Problem
addImageSlide("slide-02-problem.png");

// Slide 3: The Vision
addImageSlide("slide-03-vision.png");

// Slide 4: Agentic IaC Workflows
addImageSlide("slide-04-agentic-iac-workflows.png");

// Slide 5: Section divider — Foundations
addImageSlide("slide-divider-foundations.png");

// ── Act 2: Foundations (Slides 6-13) ──

// Slide 6: Skills
addImageSlide("slide-06-skills.png");

// Slide 7: Subagents — What they are
addImageSlide("slide-07-subagents.png");

// Slide 8: Subagent Architecture
addImageSlide("slide-07-08-subagents.png");

// Slide 8: Context Engineering
addImageSlide("slide-09-context-engineering.png");

// Slide 9: Concurrent Execution
addImageSlide("slide-10-concurrent-patterns.png");

// Slide 10: Maximizing Throughput
addImageSlide("slide-11-maximizing-throughput.png");

// Slide 11: Decision Framework
addImageSlide("slide-12-decision-framework.png");

// Slide 12: The Agentic Loop
addImageSlide("slide-13-agentic-loop.png");

// Slide 13: Observability
addImageSlide("slide-14-observability.png");

// Slide 14: Section divider — Platform Guardrails
addImageSlide("slide-divider-guardrails.png");

// ── Act 3: Platform Guardrails (Slides 15-18) ──

// Slide 15: Dev Containers
addImageSlide("slide-20-devcontainers.png");

// Slide 16: Git Integration
addImageSlide("slide-21-git-integration.png");

// Slide 17: HCP Terraform Identity
addImageSlide("slide-22-agent-identity.png");

// Slide 18: HCP Terraform RBAC & Isolation
addImageSlide("slide-23-hcp-rbac.png");

// Slide 19: MCP Tools
addImageSlide("slide-18-mcp-tools.png");

// Slide 19: Deny Permissions
addImageSlide("slide-19-deny-permissions.png");

// Slide 20: Section divider — Spec-Driven Development
addImageSlide("slide-divider-sdd.png");

// ── Act 4: SDD Methodology (Slides 20-24) ──

// Slide 20: SDD Overview (the 4 phases)
addImageSlide("slide-20-sdd-overview.png");

// Slide 21: Constitutions
addImageSlide("slide-21-constitutions.png");

// Slide 22: Design Templates
addImageSlide("slide-21-design-templates.png");

// Slide 23: The Design Document
addImageSlide("slide-22-design-doc.png");

// Slide 23: Quality Scoring
addImageSlide("slide-23-quality.png");

// Slide 24: The Orchestrator Pattern
addImageSlide("slide-24-orchestrator.png");

// Slide 25: Section divider — Workflows
addImageSlide("slide-divider-workflows.png");

// ── Act 5: Workflows (Slides 26-37) ──

// Slide 26: Workflow Comparison Matrix
addImageSlide("slide-26-comparison.png");

// Slide 27: Consumer Overview
addImageSlide("slide-27-consumer.png");

// Slide 28: Consumer Plan
addImageSlide("slide-28-consumer-plan.png");

// Slide 29: Consumer Implement
addImageSlide("slide-29-consumer-impl.png");

// Slide 30: Module Overview
addImageSlide("slide-30-module.png");

// Slide 31: Module Plan
addImageSlide("slide-31-module-plan.png");

// Slide 32: Module Implement
addImageSlide("slide-32-module-impl.png");

// Slide 33: Provider Overview
addImageSlide("slide-33-provider.png");

// Slide 34: Provider Plan
addImageSlide("slide-34-provider-plan.png");

// Slide 35: Provider Implement
addImageSlide("slide-35-provider-impl.png");

// Slide 36: Repository Tour (was 37, e2e chain removed)
addImageSlide("slide-37-repo-structure.png");

// Slide 38: Section divider — Getting Started
addImageSlide("slide-divider-getting-started.png");

// ── Act 6: Getting Started (Slides 39-40) ──

// Slide 39: Adoption Path
addImageSlide("slide-39-adoption.png");

// Slide 40: Resources & Next Steps
addImageSlide("slide-40-resources.png");

// ── Write ──

const outputPath = resolve(__dirname, "..", "AI-Terraform-Enablement.pptx");
await pres.writeFile({ fileName: outputPath });
console.log(`PPTX written to: ${outputPath}`);
console.log(`Total slides: ${pres.slides.length}`);
