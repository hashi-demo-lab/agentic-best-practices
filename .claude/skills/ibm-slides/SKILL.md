---
name: ibm-slides
description: IBM Carbon Design System light-mode slide conversion. Converts dark-mode HTML slides to IBM-branded white backgrounds with Carbon tokens, IBM Plex fonts, and adjusted SVG colors.
user-invocable: true
---

# IBM Light Mode Slide Conversion

## IBM Carbon Design Tokens

### Backgrounds
- Page background: `#ffffff` (white)
- Panel/card fill: `#f4f4f4` (gray-10)
- Code block fill: `#f4f4f4` (gray-10)
- Inner panels: `#f4f4f4` (replaces `rgba(18,18,18,0.9)`)
- Badge backgrounds: use `rgba(token, 0.08)` for tinted fills

### Text Colors
- Primary text: `#161616` (gray-100)
- Secondary text: `#525252` (gray-70)
- Placeholder/muted: `#8d8d8d` (gray-50)
- Disabled: `#a8a8a8` (gray-40)
- Inverse (on dark): `#ffffff`

### Borders
- Default border: `#e0e0e0` (gray-20)
- Subtle border: `#f4f4f4` (gray-10)
- Strong border: `#c6c6c6` (gray-30)

### Interactive Colors (accent mapping)

| Role | Dark Mode | IBM Light | Carbon Token |
|------|-----------|-----------|--------------|
| Teal | `#62D4DC` | `#009d9a` | teal-60 |
| Purple | `#A78BFA` | `#8a3ffc` | purple-60 |
| Pink | `#DC477D` | `#d02670` | magenta-60 |
| Yellow | `#FFCF25` | `#b28600` | yellow-50 dark |
| Green | `#60DEA9` | `#198038` | green-60 |
| Red/Gate | `#EC585D` | `#da1e28` | red-60 |
| Ice blue | `#627EEF` | `#0f62fe` | blue-60 |
| Amber/MCP | `#FFD06C` | `#d2a106` | yellow-40 dark |

## Typography Mapping

| Dark Mode | IBM Light |
|-----------|-----------|
| `'Outfit', sans-serif` | `'IBM Plex Sans', sans-serif` |
| `'Inter', Arial, sans-serif` | `'IBM Plex Sans', sans-serif` |
| `'SF Mono', 'Fira Code', monospace` | `'IBM Plex Mono', monospace` |
| `'Inter Medium', 'Inter', Arial` | `'IBM Plex Sans', sans-serif` |

Font-face block (use in every slide):
```html
<link rel="stylesheet" href="fonts/ibm-plex-sans.css">
```

## Systematic CSS Replacements (every content slide)

### Pass 1 — CSS
1. Replace `@font-face` Outfit block with `<link rel="stylesheet" href="fonts/ibm-plex-sans.css">`
2. `background: #000000` → `background: #ffffff`
3. `color: #FFFFFF` (body) → `color: #161616`
4. `font-family: 'Outfit', sans-serif` → `font-family: 'IBM Plex Sans', sans-serif`
5. `font-family: 'Inter', Arial, sans-serif` → `font-family: 'IBM Plex Sans', sans-serif`
6. Grid: `rgba(255,255,255,0.015)` → `rgba(0,0,0,0.04)`, keep `60px` → `32px`
7. Section label: `color: #FFCF25` → `color: #b28600`
8. Title bar border: `rgba(98,212,220,0.12)` → `#e0e0e0`
9. Title h1: `color: #FFFFFF` → `color: #161616`
10. Subtitle: `color: #CCCCCC` → `color: #525252`
11. Bullet text: `color: #FFFFFF` → `color: #161616`

### Pass 2 — SVG Colors (8 accent swaps)
1. `#62D4DC` → `#009d9a`
2. `#A78BFA` → `#8a3ffc`
3. `#DC477D` → `#d02670`
4. `#FFCF25` → `#b28600`
5. `#60DEA9` → `#198038`
6. `#EC585D` → `#da1e28`
7. `#627EEF` → `#0f62fe`
8. `#FFD06C` → `#d2a106`

### Pass 3 — SVG Structural
1. Dark gradient fills (`#0E0E0E`, `#060606`) → `#ffffff`
2. Inner panels `rgba(18,18,18,0.8)` or `rgba(18,18,18,0.9)` → `#f4f4f4`
3. SVG box strokes `rgba(98,212,220,0.12)` → `#e0e0e0`
4. SVG box strokes `rgba(167,139,250,0.12)` → `#e0e0e0`
5. Gray text: `#9E94A8`, `#82748C` → `#8d8d8d`
6. Gray text: `#CCCCCC` → `#525252`
7. Badge rgba backgrounds: increase opacity by 0.04 (e.g., `0.08` → `0.12`)
8. Badge rgba strokes: increase opacity by 0.1 (e.g., `0.18` → `0.28`)
9. Font-family attributes in SVG: `'SF Mono','Fira Code',monospace` → `'IBM Plex Mono',monospace`
10. Font-family attributes in SVG: `'Inter Medium','Inter',Arial,sans-serif` → `'IBM Plex Sans',sans-serif`
11. Font-family attributes in SVG: `'Inter',Arial,sans-serif` → `'IBM Plex Sans',sans-serif`

### Pass 4 — Special Cases
1. Gradient text (`-webkit-background-clip: text`) → solid `color: #0f62fe`
2. `text-shadow` → remove entirely
3. Dashed connectors: `rgba(98,212,220,0.35)` → `#009d9a` with `opacity="0.5"`
4. Human gate boxes: keep `stroke-dasharray`, use `#da1e28`

## Title & Divider Slide Conversion

### Background
- `background: #ffffff`
- Subtle depth: `radial-gradient(ellipse at 70% 30%, rgba(237,245,255,0.6) 0%, transparent 60%), #ffffff`

### Arc Treatment for White Backgrounds
- Increase all stroke opacities by ~40% (glows dissipate on white)
- Increase stroke-widths by 0.5-1px
- Deep glow: `stdDeviation="35"` (reduced from 45 for tighter glow)
- Soft glow: `stdDeviation="18"` (reduced from 22)
- Title text: `color: #161616`, weight 700
- Subtitle text: `color: #525252`, weight 300
- Remove all `text-shadow`

### Section Divider Colors
- Foundations: purple-60 `#8a3ffc`
- Guardrails: magenta-60 `#d02670`
- SDD: teal-60 `#009d9a`
- Workflows: green-60 `#198038`
- Getting Started: yellow `#b28600`

## Build Pipeline

```bash
cd playgrounds/IBM

# Copy all slide HTMLs to static/
cp *.html static/

# Capture screenshots
node capture-slides-ibm.mjs

# Build PPTX
node build-pptx-ibm.mjs
```

Output: `AI-Terraform-Enablement-IBM.pptx` at repo root.

## QA Checklist

For each slide verify:
- All text readable against white/gray (contrast ≥ 4.5:1)
- SVG elements have visible `#e0e0e0` borders
- Badges visible but subtle on white
- Human gates (red dashed `#da1e28`) prominent
- Code blocks have clear `#f4f4f4` boundaries
- No dark-mode artifacts (white text on white bg)
- Grid overlay subtle but present
- Arc treatments on title/dividers feel premium
