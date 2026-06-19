---
title: 'Using GitHub-Flavored Alerts'
date: 2026-06-19
description: 'A demonstration of all five GitHub-flavored alert variants in hugo-cyberdelic.'
authors: ['cybernaut']
tags: ['shortcodes', 'features', 'documentation']
cover: '/images/placeholder.svg'
---

This page demonstrates the GitHub-flavored alerts shortcode. Each variant has a distinct icon,
color, and ARIA role.

## Note

{{< alert type="note" >}} This is a **note** alert with _italic text_ and `inline code`. It's the
least severe variant and uses a blue accent with `role="note"`.

It supports multiple paragraphs too. Here's a [link to Hugo](https://gohugo.io). {{< /alert >}}

## Tip

{{< alert type="tip" >}} A **tip** provides helpful advice. It uses a cyan accent and `role="note"`.

You can include code blocks:

```bash
hugo server -D
```

{{< /alert >}}

## Important

{{< alert type="important" >}} **Important** alerts indicate key information users shouldn't miss.
They use a purple accent and `role="alert"`.

> Blockquotes work too inside the alert body. {{< /alert >}}

## Warning

{{< alert type="warning" >}} **Warning** alerts signal caution. They use an amber accent and
`role="alert"`.

Unordered lists also render:

- Item one
- Item two
- Item three {{< /alert >}}

## Caution

{{< alert type="caution" >}} **Caution** is the most severe variant. It uses a magenta accent and
`role="alert"`.

Ordered lists work too:

1. First step
2. Second step
3. Third step {{< /alert >}}

## Default Fallback (Missing Type)

When no `type` parameter is provided, the shortcode defaults to `note`:

{{< alert >}} This alert has no type parameter. It gracefully defaults to the **note** variant.
{{< /alert >}}

## Invalid Type Fallback

When an invalid type is provided, it also defaults to `note`:

{{< alert type="warn" >}} This uses `type="warn"` which is not a valid variant. It falls back to
**note** gracefully. {{< /alert >}}

{{< alert type="danger" >}} This uses `type="danger"` which is also invalid. It falls back to
**note** without errors. {{< /alert >}}
