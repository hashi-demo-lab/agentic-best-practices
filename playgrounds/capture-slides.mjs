#!/usr/bin/env node
import { chromium } from 'playwright-core';
import { readdir } from 'fs/promises';
import { resolve, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STATIC_DIR = resolve(__dirname, 'static');
const OUTPUT_DIR = resolve(__dirname, 'images');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const WIDTH = 1920;
const HEIGHT = 1080;

async function main() {
  const files = (await readdir(STATIC_DIR))
    .filter(f => f.endsWith('.html'))
    .sort();

  if (files.length === 0) {
    console.error('No HTML files found in', STATIC_DIR);
    process.exit(1);
  }

  console.log(`Found ${files.length} static HTML files to capture.\n`);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
  });

  for (const file of files) {
    const filePath = resolve(STATIC_DIR, file);
    const pngName = file.replace('.html', '.png');
    const outputPath = resolve(OUTPUT_DIR, pngName);

    const page = await context.newPage();
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

    // Wait a moment for any CSS rendering to settle
    await page.waitForTimeout(500);

    await page.screenshot({
      path: outputPath,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });

    const stats = await import('fs').then(fs =>
      fs.promises.stat(outputPath)
    );
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`  ✓ ${pngName} (${sizeKB} KB)`);

    await page.close();
  }

  await browser.close();
  console.log(`\nDone! ${files.length} screenshots saved to ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
