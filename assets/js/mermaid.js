// assets/js/mermaid.js — Render Mermaid diagrams as SVG
// Loads diagram text from data-diagram attribute, renders via mermaid.render(),
// and provides a graceful error message on syntax errors.
// Vanilla ES6, no dependencies except Mermaid CDN loaded separately.

(() => {
  'use strict';

  const SELECTOR_CONTAINER = '.cd-mermaid';
  const SELECTOR_FALLBACK = '.cd-mermaid-fallback';
  const SELECTOR_SVG_CONTAINER = '.cd-mermaid-svg';

  let uniqueId = 0;

  /**
   * Generate a unique ID for each mermaid diagram on the page.
   * @returns {string}
   */
  function nextId() {
    uniqueId += 1;
    return `cd-mermaid-diagram-${uniqueId}`;
  }

  /**
   * Create an error message element for display in the diagram container.
   * @param {string} message - The error message to display
   * @returns {HTMLElement}
   */
  function createErrorMessage(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'cd-mermaid-error';
    errorEl.setAttribute('role', 'alert');

    const icon = document.createElement('span');
    icon.className = 'cd-mermaid-error-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '\u26A0\uFE0F'; // Warning sign

    const text = document.createElement('span');
    text.className = 'cd-mermaid-error-text';
    text.textContent = message;

    errorEl.appendChild(icon);
    errorEl.appendChild(text);

    return errorEl;
  }

  /**
   * Render a single mermaid diagram.
   * @param {HTMLElement} container - The .cd-mermaid container element
   */
  async function renderDiagram(container) {
    const fallback = container.querySelector(SELECTOR_FALLBACK);
    const svgContainer = container.querySelector(SELECTOR_SVG_CONTAINER);

    if (!fallback || !svgContainer) return;

    // Read the diagram text from the <pre> fallback element
    const diagramText = fallback.textContent;
    if (!diagramText || !diagramText.trim()) return;

    // Check that Mermaid library is loaded
    if (typeof window.mermaid === 'undefined') {
      // Mermaid CDN hasn't loaded yet — add a retry with a timeout
      setTimeout(() => renderDiagram(container), 500);
      return;
    }

    const diagramId = nextId();

    try {
      // Use mermaid.parse() to check for syntax errors before rendering
      try {
        await window.mermaid.parse(diagramText);
      } catch (parseError) {
        // mermaid.parse throws on syntax error
        const errorMsg = parseError.message || 'Diagram could not be rendered: syntax error';
        // Show a clean error message
        container.classList.add('cd-mermaid--rendered');
        svgContainer.appendChild(createErrorMessage(errorMsg));
        return;
      }

      // Render the diagram
      const { svg } = await window.mermaid.render(diagramId, diagramText);

      // Hide the fallback pre and insert the SVG
      container.classList.add('cd-mermaid--rendered');
      svgContainer.innerHTML = svg;
    } catch (error) {
      // Catch any unexpected errors during rendering
      const errorMsg =
        error.message ||
        'Diagram could not be rendered. Please check the diagram syntax and try again.';
      container.classList.add('cd-mermaid--rendered');
      svgContainer.innerHTML = '';
      svgContainer.appendChild(createErrorMessage(errorMsg));
    }
  }

  /**
   * Initialize mermaid rendering for all diagram containers on the page.
   */
  function init() {
    const containers = document.querySelectorAll(SELECTOR_CONTAINER);
    if (!containers.length) return;

    // Configure Mermaid with cyberdelic-compatible theme colors
    if (typeof window.mermaid !== 'undefined') {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          background: '#0A0015',
          primaryColor: '#3847FF',
          primaryBorderColor: '#00FFFF',
          primaryTextColor: '#FFFFFF',
          secondaryColor: '#FF00AA',
          secondaryBorderColor: '#FF00AA',
          secondaryTextColor: '#FFFFFF',
          tertiaryColor: '#0A0015',
          tertiaryBorderColor: '#3847FF',
          tertiaryTextColor: '#FFFFFF',
          lineColor: '#00FFFF',
          textColor: '#E0E0E0',
          mainBkg: '#0A0015',
          nodeBorder: '#00FFFF',
          clusterBkg: '#1A0025',
          clusterBorder: '#3847FF',
          edgeLabelBackground: '#0A0015',
          nodeTextColor: '#E0E0E0',
          titleColor: '#FFB000',
        },
      });
    }

    containers.forEach(renderDiagram);
  }

  /**
   * Wait for Mermaid CDN to be available, then initialize.
   */
  function waitForMermaid() {
    if (typeof window.mermaid !== 'undefined') {
      init();
      return;
    }

    // Check again in 100ms intervals for up to 10 seconds
    let attempts = 0;
    const maxAttempts = 100;
    const interval = setInterval(() => {
      attempts += 1;
      if (typeof window.mermaid !== 'undefined') {
        clearInterval(interval);
        init();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        // Mermaid failed to load — show error messages in all containers
        const containers = document.querySelectorAll(SELECTOR_CONTAINER);
        containers.forEach((container) => {
          const svgContainer = container.querySelector(SELECTOR_SVG_CONTAINER);
          container.classList.add('cd-mermaid--rendered');
          if (svgContainer) {
            svgContainer.innerHTML = '';
            svgContainer.appendChild(
              createErrorMessage(
                'Diagram could not be loaded: Mermaid library failed to load. Please check your network connection and try again.',
              ),
            );
          }
        });
      }
    }, 100);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMermaid);
  } else {
    waitForMermaid();
  }
})();
