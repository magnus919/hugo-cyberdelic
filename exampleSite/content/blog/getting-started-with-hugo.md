---
title: 'Getting Started with Hugo'
date: 2026-06-05
description:
  "A practical guide to building static websites with Hugo, the world's fastest static site
  generator."
authors: ['neon-writer']
tags: ['tutorial', 'hugo', 'web-development']
cover: '/images/placeholder.svg'
---

## Why Hugo?

Hugo is a static site generator written in Go. It's known for its incredible build speed, flexible
templating system, and zero runtime dependencies. This site you're browsing right now is built with
Hugo.

## Installation

Installing Hugo on macOS is straightforward:

```bash
# Using Homebrew
brew install hugo

# Verify installation
hugo version
```

On Linux:

```bash
# Download the latest release
wget https://github.com/gohugoio/hugo/releases/download/v0.160.0/hugo_extended_0.160.0_linux-amd64.deb
sudo dpkg -i hugo_extended_0.160.0_linux-amd64.deb
```

## Creating a New Site

```bash
hugo new site my-awesome-site
cd my-awesome-site
```

This creates a directory structure with the following layout:

```
my-awesome-site/
├── archetypes/
├── assets/
├── config/
├── content/
├── data/
├── layouts/
├── static/
├── themes/
└── hugo.toml
```

## Adding a Theme

```bash
# Clone the theme
git init
git submodule add https://github.com/magnus919/hugo-cyberdelic.git themes/hugo-cyberdelic

# Configure
echo 'theme = "hugo-cyberdelic"' >> hugo.toml
```

> Pro tip: You can also use Hugo Modules to manage themes. See the
> [Hugo documentation](https://gohugo.io/hugo-modules/) for details.

## Creating Content

Hugo makes content creation simple:

```bash
hugo new blog/my-first-post.md
```

This creates a new Markdown file with front matter:

```yaml
---
title: 'My First Post'
date: 2026-06-05
draft: true
tags: []
description: ''
---
```

## Building and Serving

To preview your site locally:

```bash
# Start the development server with live reload
hugo server -D
```

To build for production:

```bash
hugo --minify
```

The output will be in the `public/` directory, ready to deploy to any static hosting provider.

## Template Architecture

Hugo uses Go's `html/template` package with block-based template inheritance. The key templates in
hugo-cyberdelic are:

| Template      | Purpose                                |
| ------------- | -------------------------------------- |
| `baseof.html` | The shell layout — DOCTYPE, head, body |
| `index.html`  | Homepage — hero section + card grid    |
| `single.html` | Single article page                    |
| `list.html`   | Section listing pages (blog, tags)     |
| `404.html`    | Custom error page                      |

## Next Steps

Now that you have Hugo running, explore the theme's features:

- Customize the config files in `config/_default/`
- Add your own content in the `content/` directory
- Override templates by creating files in `layouts/`
- Enable features through `params.toml` toggles

The cyberdelic void awaits. 🚀
