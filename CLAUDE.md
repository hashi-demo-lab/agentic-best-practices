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
- Colors: `#62D4DC` (teal), `#A78BFA` (purple), `#DC477D` (pink), `#FFCF25` (yellow), `#60DEA9` (green)
- SVG text: 16px minimum for code/headings, 14px minimum for body text
- Use the pptx skill (`/pptx`) for any PPTX-related tasks
