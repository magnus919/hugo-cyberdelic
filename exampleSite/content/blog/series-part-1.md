---
title: 'Hugo Template Architecture: Blocks, Partials, and Composition'
date: 2026-06-01
description:
  "Understanding Hugo's block-based template inheritance system and how to compose pages from
  reusable partials."
authors: ['neon-writer']
tags: ['hugo', 'tutorial', 'templates', 'web-development']
series: ['Hugo Theme Development']
series_weight: 1
---

## Understanding Hugo Templates

Hugo's template system is built on Go's `html/template` package. It uses a block-based inheritance
model where a base template defines the page shell and child templates fill in specific sections.

### The Base Template

Every page starts with `baseof.html`. This template defines the HTML skeleton:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>{{ block "title" . }}{{ .Site.Title }}{{ end }}</title>
  </head>
  <body>
    <main>{{ block "main" . }}{{ end }}</main>
  </body>
</html>
```

Child templates then define the `title` and `main` blocks to fill in page-specific content.

### Partials: Reusable Components

Partials are the building blocks of Hugo themes. They're self-contained template snippets that can
be included anywhere:

```go-html-template
{{ partial "header.html" . }}
```

### Block Composition

The real power comes from composing blocks. A list page might define:

```go-html-template
{{ define "main" }}
<h1>{{ .Title }}</h1>
<div class="card-grid">
  {{ range .Pages }}
    {{ partial "card.html" . }}
  {{ end }}
</div>
{{ end }}
```

This pattern keeps templates DRY and maintainable.
