# Agentic Best Practices

## Slide Deck Workflow

The presentation `AI-Terraform-Enablement.pptx` is built from HTML playground files. Never edit the PPTX directly.

### Pipeline

```
playgrounds/*.html          # Source slides (editable)
        |
        v  (copy to static/)
playgrounds/static/*.html   # Frozen versions for capture
        |
        v  (capture-slides.mjs)
playgrounds/images/*.png    # 1920x1080 @2x screenshots
        |
        v  (build-pptx.mjs)
AI-Terraform-Enablement.pptx  # Final deck (image-per-slide)
```

### Commands

```bash
# 1. Edit the HTML slide in playgrounds/
# 2. Copy to static/
cp playgrounds/slide-XX-name.html playgrounds/static/slide-XX-name.html

# 3. Capture all slides as PNGs
node playgrounds/capture-slides.mjs

# 4. Rebuild the PPTX
node playgrounds/build-pptx.mjs
```

### Adding a New Slide

1. Create `playgrounds/slide-XX-name.html` (1920x1080, black bg, overflow:hidden)
2. Copy to `playgrounds/static/`
3. Add `addImageSlide("slide-XX-name.png")` to `build-pptx.mjs` at the correct position
4. Run capture + build

### Design Conventions

- Body: `width: 1920px; height: 1080px; overflow: hidden; background: #000000`
- Grid overlay: subtle white grid lines at 60px spacing
- Title bar: section label (12px yellow uppercase), h1 (36px white), subtitle (20px gray)
- Layout: ~38-42% bullets left, ~58-62% visual right, 64px gap
- Colors: `#62D4DC` (teal), `#A78BFA` (purple), `#DC477D` (pink), `#FFCF25` (yellow), `#60DEA9` (green), `#EC585D` (red/gate), `#627EEF` (ice blue), `#FFD06C` (amber/MCP)
- SVG text: 16px minimum for code/headings, 14px minimum for body text
- Use the pptx skill (`/pptx`) for any PPTX-related tasks

### Content Positioning Lessons

- **Content padding**: Flow diagrams and content areas need generous top padding (70-100px) below the title bar; 10-40px is too tight and makes content feel "too high"
- **SVG badges**: Place badges BELOW their parent SVG boxes (not inside), with 8px gap to avoid text overlap. Inside-box badges always risk overlapping last text line
- **Vertical centering**: Using `justify-content: center` in tall containers creates excessive blank space; prefer `flex-start` with explicit padding-top
- **Cross-column alignment**: When multiple cards have MUST/SHOULD sections, use `min-height` on the MUST group to align SHOULD badges horizontally
- **Human gates**: Use dashed-border red boxes (`#EC585D`, `stroke-dasharray="4 3"`) for HUMAN APPROVAL indicators, positioned above the flow

### Title & Divider Slide Design

- Title and section dividers use premium gradient treatment: 4-layer SVG arcs (deepglow, softglow, glow, crisp)
- Background: layered `radial-gradient` mesh tinted per section color + deep `linear-gradient` base
- Font: Outfit from Google Fonts (800 weight title, 300 weight subtitle)
- Arcs sweep from top edge (y=0) to right edge (x=1920), starting at x=700-1620
- Each section has unique color tinting: Foundations=#A78BFA, Guardrails=#DC477D, SDD=#62D4DC, Workflows=#60DEA9, Getting Started=#FFCF25
- Title slide uses full 11-color spectrum (purple→indigo→cyan→teal→green→pink→rose→gold)
- Filter chain: deepglow (stdDeviation=45), softglow (22), glow (8), crisp (no filter)
- Dividers use 7 arcs; title uses 11 arcs for more dramatic effect

### Website / Editorial Sync

The learning pathway editorial HTML is also published to the submodule:

```bash
# After editing playgrounds/learning-pathway-editorial.html:
cp playgrounds/learning-pathway-editorial.html terraform-agentic-workflows/.foundations/design/sdd-workflow-playground.html
```

Always copy the latest editorial HTML to the submodule before committing.

### Quick Verification

```bash
# Screenshot a single slide for quick check
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --screenshot=/tmp/test.png --window-size=1920,1080 --force-device-scale-factor=2 \
  "file://$(pwd)/slide-XX-name.html"
```
