---
title: 'Hugo Theme Configuration: Params, i18n, and Menus'
date: 2026-06-03
description:
  'How to configure Hugo themes effectively using params.toml, i18n translation strings, and
  structured menu definitions.'
authors: ['neon-writer']
tags: ['hugo', 'tutorial', 'configuration', 'i18n']
series: ['Hugo Theme Development']
series_weight: 3
---

## Theme Configuration Best Practices

A well-structured Hugo theme provides sensible defaults while allowing site owners to override
everything. This is achieved through Hugo's config cascade system.

### Params.toml: Feature Toggles

All theme features should be togglable via `params.toml`:

```toml
# Feature toggles default to false — opt-in by site owners
showReadingTime = false
showRelated     = false
showSeries      = false
showSearch      = false
```

Site owners enable features by setting them to `true` in their own `params.toml`.

### Internationalization (i18n)

All user-facing strings should come from i18n, never hardcoded:

```go-html-template
{{ i18n "series.part_of" (dict "Part" $part "Total" $total "Title" $seriesTitle) }}
```

Translation keys follow a `component.element` naming pattern and live in `i18n/en.yaml`.

### Menu Configuration

Hugo menus support nested structures for multi-level navigation. Menus can be defined inline in
`hugo.toml` or in a separate `menus.en.toml`:

```toml
[[menu.main]]
  name       = "Blog"
  identifier = "blog"
  url        = "/blog/"
  weight     = 20

[[menu.main]]
  name       = "Tech"
  parent     = "blog"
  url        = "/categories/tech/"
  weight     = 21
```

This concludes our three-part series on Hugo theme development. You've learned about template
architecture, content organization, and configuration — the three pillars of building great Hugo
themes.
