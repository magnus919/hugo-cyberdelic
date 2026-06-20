---
title: 'Building with Design Tokens'
date: 2026-06-12
description:
  'How CSS custom properties power a consistent, maintainable design system in hugo-cyberdelic.'
authors: ['magnus', 'cybernaut']
tags: ['design', 'css', 'development']
cover: 'cover.png'
---

## What Are Design Tokens?

Design tokens are the atomic values that make up a design system — colors, typography, spacing,
shadows, and animations. By storing these values in a single source of truth, you ensure consistency
across your entire interface.

In hugo-cyberdelic, design tokens are implemented as CSS custom properties in a dedicated
`@layer design-tokens` cascade layer.

## The Token Structure

### Color Palette

The cyberdelic palette is defined as a set of `--cd-*` custom properties:

```css
:root {
  --cd-bg: #0a0015;
  --cd-bg-alt: #120022;
  --cd-bg-card: #16002a;
  --cd-text: #e0d0f0;
  --cd-text-dim: #8a7a9a;
  --cd-text-bright: #ffffff;
  --cd-accent-blue: #3847ff;
  --cd-accent-magenta: #ff00aa;
  --cd-accent-cyan: #00ffff;
  --cd-accent-amber: #ffb000;
  --cd-accent-purple: #7a00ff;
}
```

### Typography Scale

The fluid type scale uses `clamp()` to create responsive typography without breakpoints:

```css
--cd-step-0: clamp(1rem, 0.9115rem + 0.4427vw, 1.25rem);
--cd-step-1: clamp(1.2rem, 1.0755rem + 0.6224vw, 1.5625rem);
--cd-step-2: clamp(1.44rem, 1.2665rem + 0.8671vw, 1.9531rem);
```

> The scale follows a minor third ratio (1.2), providing a harmonious progression from captions to
> hero headings.

### Spacing Scale

A consistent spacing scale ensures vertical and horizontal rhythm throughout the design:

```css
--cd-space-1: 0.25rem;
--cd-space-2: 0.5rem;
--cd-space-3: 0.75rem;
--cd-space-4: 1rem;
--cd-space-5: 1.5rem;
--cd-space-6: 2rem;
--cd-space-7: 3rem;
--cd-space-8: 4rem;
--cd-space-9: 6rem;
```

## Using Tokens in Components

Every component in hugo-cyberdelic references design tokens rather than hardcoded values:

```css
.cd-card {
  background: var(--cd-bg-card);
  border: 1px solid var(--cd-border);
  border-radius: var(--cd-radius-md);
}

.cd-card:hover {
  border-color: color-mix(in srgb, var(--cd-accent-cyan) 30%, transparent);
  box-shadow: 0 0 16px var(--cd-glow-blue);
}
```

## The `color-mix()` Function

Modern CSS provides `color-mix()` for creating derivative colors from design tokens:

```css
blockquote {
  border-inline-start: 3px solid var(--cd-accent-magenta);
  background: color-mix(in srgb, var(--cd-accent-magenta) 6%, var(--cd-bg-alt));
}
```

This pattern allows you to create tinted surfaces that automatically adapt if the accent color
changes — no manual color calculation needed.

## Benefits of Design Tokens

1. **Consistency** — One source of truth for every visual property
2. **Maintainability** — Update the palette in one place, and every component reflects the change
3. **Theming** — Swap token values to create entirely different visual identities
4. **Accessibility** — Enforce contrast ratios by controlling token relationships
5. **Performance** — CSS custom properties are computed at render time with zero runtime cost

## Image Gallery Demo

The gallery shortcode renders a responsive grid of images with click-to-open lightbox and arrow key
navigation. Here's a 3-column gallery:

{{< gallery columns="3" >}} ![Abstract neon patterns](https://picsum.photos/id/21/800/600)
![Cyberpunk cityscape](https://picsum.photos/id/22/800/600)
![Holographic grid](https://picsum.photos/id/23/800/600)
![Violet horizon](https://picsum.photos/id/24/800/600)
![Digital wave forms](https://picsum.photos/id/25/800/600)
![Neon geometry](https://picsum.photos/id/26/800/600) {{< /gallery >}}

And a 2-column gallery:

{{< gallery columns="2" >}} ![Fractal exploration](https://picsum.photos/id/27/800/600)
![Light trails at dusk](https://picsum.photos/id/28/800/600)
![Digital dreamscape](https://picsum.photos/id/29/800/600) {{< /gallery >}}
