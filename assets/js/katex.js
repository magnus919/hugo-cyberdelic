// assets/js/katex.js — Render KaTeX math expressions
// Waits for KaTeX library to load from CDN, then renders all math containers.
// Falls back to raw LaTeX in <code>/<pre> if KaTeX fails to load.
// Vanilla ES6, no dependencies.

(() => {
  'use strict';

  const SELECTOR_MATH = '.cd-katex';
  const SELECTOR_FALLBACK = '.cd-katex-fallback';

  /**
   * Render a single KaTeX math element.
   * @param {HTMLElement} el - The .cd-katex container element
   */
  function renderElement(el) {
    // Get the LaTeX source from the fallback element
    const fallback = el.querySelector(SELECTOR_FALLBACK);
    if (!fallback) return;

    const latex = fallback.textContent;
    if (!latex || !latex.trim()) return;

    // Determine display mode from class
    const isInline = el.classList.contains('cd-katex--inline');
    const displayMode = !isInline;

    // Check that KaTeX library is loaded
    if (typeof window.katex === 'undefined') {
      // KaTeX CDN hasn't loaded yet — retry in 200ms
      setTimeout(() => renderElement(el), 200);
      return;
    }

    try {
      // Save aria-label before render (katex.render replaces innerHTML)
      const ariaLabel = el.getAttribute('aria-label') || latex;

      // Render KaTeX directly into the container element
      window.katex.render(latex.trim(), el, {
        throwOnError: false,
        displayMode: displayMode,
      });

      // Restore aria-label and role (katex.render clears element attributes)
      el.setAttribute('aria-label', ariaLabel);
      el.setAttribute('role', 'math');

      el.classList.add('cd-katex--rendered');
    } catch (error) {
      // On render error, keep the fallback visible
      console.warn('KaTeX render error:', error.message);
    }
  }

  /**
   * Initialize KaTeX rendering for all math containers on the page.
   */
  function renderAll() {
    const containers = document.querySelectorAll(SELECTOR_MATH);
    if (!containers.length) return;

    containers.forEach(renderElement);
  }

  /**
   * Wait for the KaTeX CDN library to be available, then render.
   */
  function waitForKaTeX() {
    if (typeof window.katex !== 'undefined') {
      renderAll();
      return;
    }

    // Poll every 100ms for up to ~10 seconds
    let attempts = 0;
    const maxAttempts = 100;
    const interval = setInterval(() => {
      attempts += 1;
      if (typeof window.katex !== 'undefined') {
        clearInterval(interval);
        renderAll();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        // KaTeX CDN failed to load — fallback (raw LaTeX) remains visible
        console.warn('KaTeX library failed to load. Using raw LaTeX fallback.');
      }
    }, 100);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForKaTeX);
  } else {
    waitForKaTeX();
  }
})();
