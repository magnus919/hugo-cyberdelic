# AGENTS.md — hugo-cyberdelic

A cyberdelic Hugo theme: 1969 psychedelic concert poster meets cyberpunk holographic future.

## Project Type

Hugo CMS theme — HTML templates, CSS, static assets. No backend, no database, no JavaScript runtime
dependencies.

## Quick Start

```bash
# From a Hugo site that uses this theme as a submodule:
hugo server -D

# Or, to test the theme in isolation, create a scratch site:
hugo new site /tmp/scratch
cd /tmp/scratch
git init
git submodule add https://github.com/magnus919/hugo-cyberdelic.git themes/hugo-cyberdelic
echo 'theme = "hugo-cyberdelic"' >> hugo.toml
hugo new blog/hello.md
hugo server -D
```

## Build

```bash
# Development server with drafts and live reload
hugo server -D

# Production build
hugo --minify
```

## Project Layout

```
.
├── archetypes/          # Hugo content archetypes
│   └── default.md
├── assets/
│   └── css/
│       └── main.css     # All styles in a single file
├── images/              # Theme screenshots / preview
├── layouts/
│   ├── _default/
│   │   ├── baseof.html  # Base template (shell)
│   │   ├── list.html    # List page (blog index, tag pages)
│   │   └── single.html  # Single article page
│   ├── partials/
│   │   ├── head.html    # <head> metadata, OG, fonts, RSS
│   │   ├── css.html     # Hugo Pipes: fingerprint & minify in prod
│   │   ├── js.html      # JS placeholder (empty, reserved)
│   │   ├── header.html  # Sticky header with nav
│   │   ├── footer.html  # Page footer
│   │   └── cover.html   # Cover image resolver (bundle + frontmatter)
│   ├── 404.html
│   └── index.html       # Homepage: hero + card grid
├── LICENSE              # MIT
├── README.md
├── theme.toml           # Hugo theme metadata
└── AGENTS.md            # This file
```

## CSS Architecture

All styles live in `assets/css/main.css` and use `@layer` cascade:

```
@layer reset          # Box-sizing, margin/padding zero, base normalization
@layer design-tokens  # CSS custom properties: palette, typography, spacing, radii
@layer base           # Element defaults: body, headings, links, code, tables
@layer composition    # Layout patterns: content-out grid (.cd-page), flow, card grid
@layer blocks         # BEM-lite components: header, nav, hero, card, article, footer
@layer utilities      # Screen-reader-only, prose width
@layer effects        # Animations: glitch text, fade-in, circuit-border, reduced-motion
```

**Rules when editing CSS:**

- Always add new styles to the correct `@layer`
- Never add styles outside a `@layer` block
- Use existing design tokens (`var(--cd-*)`) — do not hardcode colors or spacing
- Class naming convention: `cd-` prefix, lowercase, hyphen-delimited (e.g., `.cd-card-title`)
- Respect `prefers-reduced-motion` — all animations must have a reduced-motion fallback in the
  `effects` layer
- Hugo Pipes processes this file in `css.html`: development serves raw CSS, production minifies +
  fingerprints

## Template Conventions

- Use Hugo block-based template inheritance (`baseof.html` defines blocks, child templates override
  them)
- All templates extend `layouts/_default/baseof.html`
- Page metadata (title, description) uses `define` blocks
- Partials are self-contained and receive data via the Hugo `.` context
- Accessibility: semantic HTML landmarks (`<header role="banner">`, `<main>`,
  `<footer role="contentinfo">`), skip link, ARIA labels on navigation, screen-reader-only utility
  class

## Linting & Formatting

```bash
# Format all files
npx prettier --write .

# Lint CSS
npx stylelint 'assets/css/**/*.css'

# Run pre-commit checks
pre-commit run --all-files
```

## Dependencies

- **Hugo** >= 0.120.0 (extended edition for SCSS/Sass; this theme uses plain CSS, so standard
  edition works)
- **Google Fonts** loaded via `<link>`: Space Grotesk, Orbitron, JetBrains Mono (degrade gracefully
  to system fonts)
- **Node.js** (dev only) for Prettier, stylelint, and pre-commit hooks — not required to use the
  theme

## Design Tokens Quick Reference

| Token                 | Value                                |
| --------------------- | ------------------------------------ |
| `--cd-bg`             | `#0A0015` (deep violet-black)        |
| `--cd-accent-blue`    | `#3847FF`                            |
| `--cd-accent-magenta` | `#FF00AA`                            |
| `--cd-accent-cyan`    | `#00FFFF`                            |
| `--cd-accent-amber`   | `#FFB000`                            |
| `--cd-font-body`      | Space Grotesk, Inter, system-ui      |
| `--cd-font-display`   | Orbitron, Space Grotesk, sans-serif  |
| `--cd-font-mono`      | JetBrains Mono, Fira Code, monospace |
