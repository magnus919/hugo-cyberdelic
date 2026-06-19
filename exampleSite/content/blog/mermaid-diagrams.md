---
title: 'Mermaid Diagrams in hugo-cyberdelic'
date: 2026-06-19
description: 'A demonstration of Mermaid diagram shortcode rendering flowcharts, sequence diagrams, and more.'
authors: ['magnus', 'neon-writer']
tags: ['shortcodes', 'features', 'mermaid']
---

This page demonstrates the Mermaid diagram shortcode. Mermaid lets you create diagrams using text
definitions that are rendered as SVG.

## Flowchart

A basic flowchart showing a simple decision process:

{{< mermaid title="Flowchart: Decision Process" >}} graph TD A[Start] --> B{Is it working?} B
-->|Yes| C[Great!] B -->|No| D[Debug] D --> B {{< /mermaid >}}

## Sequence Diagram

A sequence diagram showing an API interaction:

{{< mermaid title="Sequence Diagram: API Call" >}} sequenceDiagram participant User participant
Browser participant Server

    User->>Browser: Click submit
    Browser->>Server: POST /api/submit
    Server-->>Browser: 200 OK
    Browser-->>User: Show success

{{< /mermaid >}}

## Class Diagram

A simple class diagram:

{{< mermaid title="Class Diagram: Data Model" >}} classDiagram class Animal { +String name +int age
+makeSound() void } class Dog { +String breed +fetch() void } class Cat { +String color +purr() void
} Animal <|-- Dog Animal <|-- Cat {{< /mermaid >}}

## State Diagram

A state machine diagram:

{{< mermaid title="State Diagram: Order Process" >}} stateDiagram-v2 [*] --> Pending Pending -->
Processing: Submit Processing --> Shipped: Ship Processing --> Cancelled: Cancel Shipped --> [*]
Cancelled --> [*] {{< /mermaid >}}

## Gantt Chart

A Gantt chart showing project timeline:

{{< mermaid title="Gantt Chart: Project Plan" >}} gantt title Project Timeline dateFormat YYYY-MM-DD
section Planning Research :a1, 2026-01-01, 30d Design :a2, after a1, 20d section Development
Frontend :b1, after a2, 40d Backend :b2, after a2, 40d section Testing QA Testing :c1, after b1, 20d
Deployment :c2, after c1, 10d {{< /mermaid >}}

## Responsive Behavior

The diagram container uses `max-width: 100%` with `overflow-x: auto` so wide diagrams remain
accessible on narrow viewports without breaking the page layout.
