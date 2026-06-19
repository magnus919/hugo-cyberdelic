---
title: 'Hugo Content Organization: Pages, Bundles, and Taxonomies'
date: 2026-06-02
description:
  'Organizing content effectively in Hugo using page bundles, taxonomy systems, and custom content
  types.'
authors: ['neon-writer']
tags: ['hugo', 'tutorial', 'content', 'taxonomies']
series: ['Hugo Theme Development']
series_weight: 2
---

## Content Architecture in Hugo

Hugo offers flexible content organization through page bundles, taxonomies, and content types.
Choosing the right structure is essential for maintainable sites.

### Page Bundles

Page bundles group related resources (images, data files, translations) with the content:

```
content/blog/my-post/
├── index.md
├── hero.jpg
├── diagram.png
└── data.json
```

Leaf bundles (with `index.md`) represent a single page. Branch bundles (with `_index.md`) represent
section listing pages.

### Taxonomies

Taxonomies group related content. Hugo's built-in taxonomies include tags and categories, but you
can define custom ones like `authors`, `series`, or `topics`:

```toml
[taxonomies]
  tag      = "tags"
  category = "categories"
  author   = "authors"
  series   = "series"
```

Each taxonomy generates listing pages at `/series/series-name/` showing all articles in that series.

### Custom Content Types

You can define custom content types by creating archetypes and templates:

```
archetypes/
├── default.md
└── review.md

layouts/
└── review/
    ├── single.html
    └── list.html
```

This gives you full control over how different content types are rendered.
