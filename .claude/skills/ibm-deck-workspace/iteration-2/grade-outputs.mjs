#!/usr/bin/env node
/**
 * Grades ibm-deck skill eval outputs.
 * Checks: PNG file size (title background loaded), PPTX exists, slide count.
 */
import { statSync, readdirSync, existsSync } from "fs";
import { resolve } from "path";

const ITER_DIR = resolve(import.meta.dirname);

function findFile(dir, ext) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter(f => f.endsWith(ext));
  return files.length > 0 ? resolve(dir, files[0]) : null;
}

function gradeRun(evalName, runType, outputDir, assertions) {
  const results = [];

  for (const a of assertions) {
    let passed = false;
    let evidence = "";

    if (a.id === "title-png-size") {
      const png = findFile(outputDir, "-title.png") || findFile(outputDir, "title.png");
      if (png) {
        const sizeKB = Math.round(statSync(png).size / 1024);
        passed = sizeKB > 500;
        evidence = `Found ${png}: ${sizeKB} KB (threshold: >500KB)`;
      } else {
        // Check for any PNG
        const anyPng = findFile(outputDir, ".png");
        if (anyPng) {
          const sizeKB = Math.round(statSync(anyPng).size / 1024);
          passed = sizeKB > 500;
          evidence = `No *title.png found. Largest PNG: ${anyPng} (${sizeKB} KB)`;
        } else {
          evidence = "No PNG files found in output directory";
        }
      }
    } else if (a.id === "pptx-generated") {
      const pptx = findFile(outputDir, ".pptx");
      if (pptx) {
        const sizeKB = Math.round(statSync(pptx).size / 1024);
        passed = sizeKB > 10;
        evidence = `Found ${pptx}: ${sizeKB} KB`;
      } else {
        evidence = "No .pptx file found";
      }
    } else if (a.id === "five-slides") {
      // We'll check this manually or via markitdown
      evidence = "Requires manual check or markitdown extraction";
      passed = null; // unknown
    } else {
      // Manual assertions
      evidence = "Requires manual review";
      passed = null;
    }

    results.push({ text: a.text, passed, evidence });
  }

  return results;
}

// Grade all runs
const evals = [
  {
    name: "eval-title-capture",
    assertions: [
      { id: "title-png-size", text: "Captured title PNG is larger than 500KB" },
      { id: "pptx-generated", text: "A valid .pptx file is generated" },
    ],
  },
  {
    name: "eval-proposal-deck",
    assertions: [
      { id: "title-png-size", text: "Captured title PNG is larger than 500KB" },
      { id: "pptx-generated", text: "A valid .pptx file is generated" },
    ],
  },
];

for (const ev of evals) {
  for (const runType of ["with_skill", "without_skill"]) {
    const outputDir = resolve(ITER_DIR, ev.name, runType, "outputs");
    if (!existsSync(outputDir)) {
      console.log(`\n⏭  ${ev.name}/${runType}: output dir not found, skipping`);
      continue;
    }

    const results = gradeRun(ev.name, runType, outputDir, ev.assertions);
    console.log(`\n📊 ${ev.name}/${runType}:`);
    for (const r of results) {
      const icon = r.passed === true ? "✅" : r.passed === false ? "❌" : "❓";
      console.log(`  ${icon} ${r.text}`);
      console.log(`     ${r.evidence}`);
    }
  }
}
