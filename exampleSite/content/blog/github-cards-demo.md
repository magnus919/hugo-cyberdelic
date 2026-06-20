---
title: 'GitHub Cards Demo'
date: 2026-06-19
draft: false
tags: ['demo', 'shortcodes']
description: 'Demonstrating the GitHub card shortcode for repos, issues, and pull requests.'
---

## Repository Card

{{< github-card url="torvalds/linux" >}}

## Issue Card

{{< github-card url="microsoft/vscode/issues/1" >}}

## Pull Request Card

{{< github-card url="facebook/react/pull/1" >}}

## Non-existent Repo (Error State)

{{< github-card url="nonexistent-user-12345/nonexistent-repo-67890" >}}
