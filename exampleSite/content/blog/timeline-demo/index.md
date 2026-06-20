---
title: 'Timeline Shortcode Demo'
date: 2026-06-19
description: 'A demonstration of the vertical timeline shortcode with cyberdelic styling.'
authors: ['magnus']
tags: ['shortcodes', 'features', 'documentation', 'timeline']
cover: 'cover.png'
---

This page demonstrates the timeline shortcode. The timeline renders a vertical list of items
connected by a continuous cyberdelic-styled line. Each item includes a date, title, and body
content.

## Project Milestones

{{< timeline >}} {{< timeline-item date="2024-01-15" title="Project Kickoff" >}} Initial planning
session and team assembly. Defined core requirements and identified key milestones for the first
phase of development. {{< /timeline-item >}}
{{< timeline-item date="2024-03-20" title="Alpha Release" >}} First internal alpha with basic
functionality. Includes core features such as user authentication, content management, and the
initial dashboard interface. {{< /timeline-item >}}
{{< timeline-item date="2024-06-10" title="Beta Launch" >}} Public beta release with expanded
features:

    - User feedback system
    - Performance optimizations
    - API documentation
    - Community forums

    Over 1,000 users joined during the first week.

{{< /timeline-item >}} {{< timeline-item date="2024-09-01" title="Version 1.0" >}} Stable production
release with full feature set. Includes advanced analytics, team collaboration tools, and
enterprise-grade security. The platform now supports millions of daily active users.
{{< /timeline-item >}} {{< timeline-item date="2024-12-15" title="Version 2.0 Preview" >}} Announced
next-generation platform with AI-powered features, real-time collaboration, and a completely
redesigned interface. Early access available for select partners. {{< /timeline-item >}}
{{< /timeline >}}

## Feature Rollout Timeline

{{< timeline >}} {{< timeline-item date="2024-02-01" title="Search & Discovery" >}} Elasticsearch
integration enabling full-text search across all documents with faceted filtering and relevance
scoring. {{< /timeline-item >}}
{{< timeline-item date="2024-04-15" title="Real-time Notifications" >}} WebSocket-based notification
system with support for email, SMS, and in-app delivery channels. {{< /timeline-item >}}
{{< timeline-item date="2024-07-01" title="Data Export & API" >}} Comprehensive REST API with rate
limiting, API keys, and data export capabilities in JSON, CSV, and PDF formats.
{{< /timeline-item >}} {{< /timeline >}}

## Empty Timeline

When no items are provided, the timeline renders nothing at all:

{{< timeline >}} {{< /timeline >}}

There should be no visible timeline container above this paragraph.
