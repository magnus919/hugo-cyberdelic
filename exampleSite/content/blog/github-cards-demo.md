---
title: 'GitHub Cards Demo'
date: 2026-06-19
draft: false
tags: ['demo', 'shortcodes']
description: 'Demonstrating the GitHub card shortcode for repos, issues, and pull requests.'
---

## Repository Card

{{< github-card url="magnus919/hugo-cyberdelic" >}}

## Issue Card

{{< github-card url="golang/go/issues/1" >}}

## Pull Request Card

{{< github-card url="lodash/lodash/pull/1" >}}

## Non-existent Repo (Error State)

{{< github-card url="nonexistent-user-12345/nonexistent-repo-67890" >}}
