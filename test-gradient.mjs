import pptxgen from "pptxgenjs";

/**
 * pptxgenjs v4.0.1 feature compatibility tests.
 *
 * FINDINGS SUMMARY:
 *
 * 1. GRADIENT FILL — BROKEN (silently produces no fill)
 *    pptxgenjs v4 only supports fill.type: 'solid' | 'none'.
 *    Using { type: "gradient", color1, color2 } causes the fill to be
 *    silently dropped — the shape renders with NO fill (transparent).
 *    The genXmlColorSelection() switch has only a 'solid' case; the
 *    default case emits empty string. There is no gradient support at all.
 *    WORKAROUND: Use solid fill with a single color.
 *
 * 2. SHARED SHADOW OBJECT — CORRUPTS PPTX
 *    pptxgenjs mutates shadow objects IN PLACE during XML generation
 *    (gen-xml.ts lines ~5497-5499). It converts user values to EMU:
 *      blur:   10    → 127000       (×12700)
 *      offset: 3     → 38100        (×12700)
 *      angle:  270   → 16200000     (×60000)
 *      opacity:0.06  → 6000         (×100000)
 *    If you share the same object across shapes, the 2nd shape gets
 *    DOUBLE-converted values (e.g., dir=972000000000 > INT32_MAX),
 *    producing a corrupted PPTX that PowerPoint/Keynote cannot open.
 *    FIX: Always use a factory function: const shadow = () => ({...})
 *
 * 3. LINE + endArrowType — WORKS CORRECTLY
 *    Syntax: line: { color, width, endArrowType: "triangle" }
 *    Produces valid <a:tailEnd type="triangle"/> in the XML.
 *
 * 4. rectRadius — WORKS but values must be 0.0–1.0
 *    Values > 1.0 produce adj values > 50000 (OOXML max), which may
 *    cause rendering issues. The type definition documents 0.0–1.0.
 *    rectRadius=0.08 → adj=4000 (small rounding) — GOOD
 *    rectRadius=0.30 → adj=15000 (moderate)       — GOOD
 *    rectRadius=1.00 → adj=50000 (max/pill shape)  — GOOD
 *    rectRadius=5.00 → adj=250000 (INVALID, >50000) — BAD
 */

// ---------- TEST 1: ROUNDED_RECTANGLE with gradient fill ----------
// RESULT: BROKEN — shape has NO fill (genXmlColorSelection ignores type:"gradient")
async function test1_gradientFill() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1,
    y: 1,
    w: 4,
    h: 3,
    rectRadius: 0.08,
    fill: {
      type: "gradient",
      color1: "627EEF",
      color2: "D946EF",
      angle: 180,
    },
  });

  const fileName = "test1-gradient-fill.pptx";
  await pres.writeFile({ fileName });
  console.log(`TEST 1 (gradient fill): Created ${fileName}`);
}

// ---------- TEST 2: ROUNDED_RECTANGLE + solid fill + shadow (factory) ----------
// RESULT: WORKS — factory function returns fresh object each time
async function test2_solidFillShadow() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  const makeShadow = () => ({
    type: "outer",
    color: "000000",
    blur: 10,
    offset: 3,
    angle: 270,
    opacity: 0.06,
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1,
    y: 1,
    w: 4,
    h: 3,
    rectRadius: 0.08,
    fill: { color: "F2EEFF" },
    shadow: makeShadow(),
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6,
    y: 1,
    w: 3,
    h: 3,
    rectRadius: 0.08,
    fill: { color: "EBF8F7" },
    shadow: makeShadow(),
  });

  const fileName = "test2-solid-fill-shadow.pptx";
  await pres.writeFile({ fileName });
  console.log(`TEST 2 (solid fill + shadow factory): Created ${fileName}`);
}

// ---------- TEST 2b: shared shadow object (mutable!) ----------
// RESULT: CORRUPTS PPTX — second shape gets double-converted shadow values
//   blur:   127000       → 1,612,900,000
//   offset: 38100        → 483,870,000
//   angle:  16200000     → 972,000,000,000 (OVERFLOWS INT32!)
//   opacity:6000         → 600,000,000
async function test2b_sharedShadow() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  const sharedShadow = {
    type: "outer",
    color: "000000",
    blur: 10,
    offset: 3,
    angle: 270,
    opacity: 0.06,
  };

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1,
    y: 1,
    w: 4,
    h: 3,
    rectRadius: 0.08,
    fill: { color: "F2EEFF" },
    shadow: sharedShadow,
  });

  console.log("  Shadow after 1st shape:", JSON.stringify(sharedShadow));

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6,
    y: 1,
    w: 3,
    h: 3,
    rectRadius: 0.08,
    fill: { color: "EBF8F7" },
    shadow: sharedShadow,
  });

  console.log("  Shadow after 2nd shape:", JSON.stringify(sharedShadow));

  const fileName = "test2b-shared-shadow.pptx";
  await pres.writeFile({ fileName });
  console.log(`TEST 2b (shared shadow object): Created ${fileName}`);
}

// ---------- TEST 3: LINE shape + endArrowType ----------
// RESULT: WORKS — produces valid <a:tailEnd type="triangle"/>
async function test3_lineArrow() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  s.addShape(pres.shapes.LINE, {
    x: 1,
    y: 2.5,
    w: 3,
    h: 0,
    line: {
      color: "8A3FFC",
      width: 2,
      endArrowType: "triangle",
    },
  });

  const fileName = "test3-line-arrow.pptx";
  await pres.writeFile({ fileName });
  console.log(`TEST 3 (LINE + endArrowType): Created ${fileName}`);
}

// ---------- TEST 4: rectRadius fraction vs absolute ----------
// RESULT: Values 0.0–1.0 work; values > 1.0 produce invalid OOXML adj > 50000
async function test4_rectRadius() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  // 0.08 → adj=4000 — OK
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5,
    y: 1,
    w: 2,
    h: 2,
    rectRadius: 0.08,
    fill: { color: "F2EEFF" },
  });

  // 0.3 → adj=15000 — OK
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 3,
    y: 1,
    w: 2,
    h: 2,
    rectRadius: 0.3,
    fill: { color: "EBF8F7" },
  });

  // 1.0 → adj=50000 — OK (max valid)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.5,
    y: 1,
    w: 2,
    h: 2,
    rectRadius: 1.0,
    fill: { color: "FFF9EC" },
  });

  // 5.0 → adj=250000 — INVALID (exceeds OOXML max of 50000)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 8,
    y: 1,
    w: 2,
    h: 2,
    rectRadius: 5,
    fill: { color: "EFF7F0" },
  });

  const fileName = "test4-rectRadius.pptx";
  await pres.writeFile({ fileName });
  console.log(`TEST 4 (rectRadius fraction vs absolute): Created ${fileName}`);
}

// ---------- TEST 5: solid fill baseline ----------
// RESULT: WORKS — produces valid <a:solidFill><a:srgbClr val="627EEF"/></a:solidFill>
async function test5_solidFillOnly() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1,
    y: 1,
    w: 4,
    h: 3,
    rectRadius: 0.08,
    fill: { color: "627EEF" },
  });

  const fileName = "test5-solid-fill-only.pptx";
  await pres.writeFile({ fileName });
  console.log(`TEST 5 (solid fill baseline): Created ${fileName}`);
}

// ---------- RUN ALL TESTS ----------
async function runAll() {
  const tests = [
    { name: "TEST 1: gradient fill", fn: test1_gradientFill },
    { name: "TEST 2: solid fill + shadow factory", fn: test2_solidFillShadow },
    { name: "TEST 2b: shared shadow object", fn: test2b_sharedShadow },
    { name: "TEST 3: LINE + endArrowType", fn: test3_lineArrow },
    { name: "TEST 4: rectRadius values", fn: test4_rectRadius },
    { name: "TEST 5: solid fill baseline", fn: test5_solidFillOnly },
  ];

  for (const t of tests) {
    try {
      await t.fn();
      console.log(`  -> ${t.name}: SUCCESS (file created)\n`);
    } catch (err) {
      console.error(`  -> ${t.name}: FAILED with error: ${err.message}\n`);
    }
  }

  console.log("=== All tests complete ===");
  console.log(
    "Open each .pptx in PowerPoint/Keynote to verify. test1 and test2b will show problems."
  );
}

runAll();
