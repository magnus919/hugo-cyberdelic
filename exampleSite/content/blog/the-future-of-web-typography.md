---
title: 'The Future of Web Typography'
date: 2026-06-15
description: 'Variable fonts, fluid type scales, and the evolution of readable text on the web.'
tags: ['design', 'typography', 'web']
cover: '/images/placeholder.svg'
---

## Beyond Pixels

Web typography has come a long way from the days of `font-size: 14px` and
`Arial, Helvetica, sans-serif`. Today, we have a rich ecosystem of font technologies, layout
methods, and rendering improvements that make text on the web truly beautiful.

> Typography is the craft of endowing human language with a durable visual form. — Robert
> Bringhurst, _The Elements of Typographic Style_

## Fluid Typography

The `clamp()` CSS function has revolutionized responsive typography. No more
breakpoint-by-breakpoint font size adjustments:

```css
h1 {
  font-size: clamp(2rem, 1.5rem + 2.5vw, 4rem);
}
```

This creates a font size that:

- **Scales up** with the viewport
- **Never goes below** a minimum size (accessibility)
- **Never exceeds** a maximum size (layout constraints)

### The Scale

hugo-cyberdelic uses a minor third scale (1.2 ratio) implemented with `clamp()`:

| Step | Size    | Usage                       |
| ---- | ------- | --------------------------- |
| -2   | 0.83rem | Captions, code              |
| -1   | 1rem    | Metadata, small text        |
| 0    | 1.25rem | Body text                   |
| 1    | 1.56rem | Small headings, card titles |
| 2    | 1.95rem | Section headings            |
| 3    | 2.44rem | Page titles                 |
| 4    | 3.05rem | Hero headings               |
| 5    | 3.81rem | Large hero                  |
| 6    | 4.77rem | Display text                |

## Variable Fonts

Variable fonts are the next frontier. A single font file contains multiple axes of variation —
weight, width, slant, optical size — giving designers unprecedented control:

```css
@font-face {
  font-family: 'MyVariableFont';
  src: url('myfont.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-stretch: 75% 125%;
}

body {
  font-family: 'MyVariableFont', sans-serif;
  font-weight: 400;
  font-variation-settings:
    'wght' 400,
    'wdth' 100;
}
```

## Font Loading Strategy

Performance matters. Here's how hugo-cyberdelic loads Google Fonts:

1. **Preconnect** to Google Fonts origins to warm up the connection
2. **Preload** critical font files
3. **Swap** with system fonts while loading (FOUT, not FOIT)
4. **Font-display: swap** in the @font-face declaration

## Choosing Typefaces

hugo-cyberdelic uses three typefaces, each with a specific role:

- **Orbitron** — Display font for hero text and site title (futuristic, geometric)
- **Space Grotesk** — Body and heading font (modern, readable, slightly quirky)
- **JetBrains Mono** — Code and monospace text (ligatures, coding-friendly)

## Readability in Dark Mode

Reading text on dark backgrounds requires careful attention to:

- **Contrast ratio** — Body text should meet WCAG AA (4.5:1 minimum)
- **Font weight** — Slightly heavier weights read better on dark backgrounds
- **Letter spacing** — Generous tracking improves legibility of light-on-dark text
- **Line height** — 1.6–1.7 for body text on dark backgrounds
