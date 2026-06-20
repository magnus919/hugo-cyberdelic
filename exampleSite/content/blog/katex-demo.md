---
title: 'Mathematical Notation with KaTeX'
date: 2026-06-10
draft: false
tags: ['math', 'demo', 'shortcodes', 'katex']
description:
  'Demonstrating the KaTeX shortcode with inline and block math, complex expressions, and accessible
  rendering.'
---

The KaTeX shortcode renders LaTeX mathematical notation using the KaTeX library loaded from CDN. It
supports both inline and block math modes, renders complex expressions correctly, and gracefully
falls back to raw LaTeX when the CDN is unavailable.

## Inline Math

Inline math renders within the flow of a paragraph. For example, Einstein's famous equation
{{< katex inline="true" >}}E=mc^2{{< /katex >}} relates energy to mass and the speed of light.

You can also write inline expressions like the quadratic formula {{< katex inline="true" >}}x =
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}{{< /katex >}} within a sentence without breaking the text flow.

The Pythagorean theorem {{< katex inline="true" >}}a^2 + b^2 = c^2{{< /katex >}} is one of the most
fundamental relationships in geometry.

## Block Math

Block math renders as a centered block-level element with vertical spacing. Here is the quadratic
formula displayed as a block:

{{< katex >}} x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} {{< /katex >}}

And here is Euler's identity, often called the most beautiful equation in mathematics:

{{< katex >}} e^{i\pi} + 1 = 0 {{< /katex >}}

## Complex Expressions

KaTeX handles complex mathematical notation with ease. Here is the definition of the derivative:

{{< katex >}} \frac{d}{dx} \int\_{a}^{x} f(t) \, dt = f(x) {{< /katex >}}

The Gaussian integral:

{{< katex >}} \int\_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi} {{< /katex >}}

The Riemann zeta function:

{{< katex >}} \zeta(s) = \sum\_{n=1}^{\infty} \frac{1}{n^s} = \prod\_{p \text{ prime}} \frac{1}{1 -
p^{-s}} {{< /katex >}}

Taylor series expansion:

{{< katex >}} e^x = \sum\_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} +
\cdots {{< /katex >}}

A matrix representation:

{{< katex >}} \begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc} \begin{pmatrix}
d & -b \\ -c & a \end{pmatrix} {{< /katex >}}

## Mixed Inline and Block

This paragraph contains inline math like {{< katex inline="true" >}}\sum\_{k=1}^n k =
\frac{n(n+1)}{2}{{< /katex >}} followed by a block expression below:

{{< katex >}} \lim\_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e {{< /katex >}}

And then back to inline math in the next paragraph with {{< katex inline="true" >}}\sin^2 \theta +
\cos^2 \theta = 1{{< /katex >}}.

## Accessibility

Each math expression includes an `aria-label` attribute containing the LaTeX source, making it
accessible to screen readers. The rendered math is announced by assistive technology with the
mathematical expression.

## Fallback Behavior

If the KaTeX CDN is unavailable, the shortcode displays the raw LaTeX source inside a styled
`<code>` element so the content remains readable.
