# hugo-cyberdelic

**A cyberdelic Hugo theme** — 1969 psychedelic concert poster meets cyberpunk holographic future.

Violet-black (#0A0015) voids, neon glow, circuit-board filigree, and worn analog textures. Dark-first, accessible, responsive.

## Features

- **Cyberdelic aesthetic** — neon magenta (#FF00AA), electric blue (#3847FF), holographic cyan (#00FFFF), warm amber (#FFB000) on deep violet-black backgrounds
- **Glitch text effects** with `::before`/`::after` pseudo-elements (screen-reader safe)
- **Fluid typography** via `clamp()` — Space Grotesk for body, Orbitron for display
- **Content-out grid** — full-bleed hero + constrained prose columns
- **Card layout** for list pages with circuit-border decorations
- **Graceful fade-in animations** (respects `prefers-reduced-motion`)
- **SEO-ready** — Open Graph, Twitter Cards, RSS, semantic landmarks
- **Accessible** — skip link, ARIA labels, focus indicators, color contrast, screen-reader safe effects
- **Dark-first** — single dark mode as the primary design (no light mode toggle)

## Quick Start

```bash
# 1. Create a new site
hugo new site my-site
cd my-site

# 2. Add the theme as a git submodule
git init
git submodule add https://github.com/magnus919/hugo-cyberdelic.git themes/hugo-cyberdelic

# 3. Configure your site
echo 'theme = "hugo-cyberdelic"' >> hugo.toml

# 4. Add content
hugo new blog/my-first-post.md

# 5. Build
hugo server -D
```

## Configuration

### hugo.toml

```toml
baseURL = 'https://example.com'
languageCode = 'en-us'
title = 'My Site'
theme = 'hugo-cyberdelic'

[params]
  description = 'Your site description'
  author = 'Your Name'
  ogImage = '/images/og-default.png'

[menu]
  [[menu.main]]
    name = 'Home'
    url = '/'
    weight = 1
  [[menu.main]]
    name = 'Blog'
    url = '/blog'
    weight = 2
```

### Taxonomies

Tags are supported out of the box:

```toml
[taxonomies]
  tag = 'tags'
```

### Cover Images

The theme supports cover images through two methods:

**1. Page bundle (recommended)** — place a `cover.jpg` (or `cover.png`, `cover.webp`) alongside your `index.md`:

```
content/blog/my-post/
├── index.md
└── cover.jpg
```

The image is processed through Hugo Pipes — automatically generates responsive WebP variants and a `srcset` attribute.

**2. Frontmatter path** — for flat `.md` files, set `image` or `cover` in frontmatter:

```yaml
---
title: "My Post"
image: "/images/my-cover.jpg"
---
```

Articles without cover images render cleanly — no image placeholder, no empty space.

### Markdown

To allow inline HTML in markdown content:

```toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

## Fonts

The theme uses Google Fonts:
- **[Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)** — body and headings
- **[Orbitron](https://fonts.google.com/specimen/Orbitron)** — display/hero text
- **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** — code blocks

Loaded via `<link>` in `<head>` with `font-display: swap` — the theme degrades gracefully to system fonts if Google Fonts is unavailable.

## License

MIT
