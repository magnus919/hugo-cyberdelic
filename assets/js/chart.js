// assets/js/chart.js — Render Chart.js charts from data attributes
// Reads chart configuration from data-chart-* attributes on <canvas> elements,
// creates Chart.js instances with cyberdelic-compatible colors, and provides
// graceful CDN fallback showing the accessible data table when Chart.js fails.
// Vanilla ES6, no dependencies except Chart.js CDN loaded separately.

(() => {
  'use strict';

  const SELECTOR_CONTAINER = '.cd-chart';
  const SELECTOR_CANVAS = '.cd-chart-canvas';
  const SELECTOR_TABLE = '.cd-chart-table';
  const SELECTOR_ERROR = '.cd-chart-error';

  /**
   * Cyberdelic-themed color palette for chart datasets.
   */
  const CYBER_COLORS = [
    '#3847FF', // blue
    '#FF00AA', // magenta
    '#00FFFF', // cyan
    '#FFB000', // amber
    '#7A00FF', // purple
    '#00FF88', // green
    '#FF4444', // red
    '#FF8800', // orange
  ];

  /**
   * Parse a comma-separated string into an array of trimmed values.
   * @param {string} str - Comma-separated values
   * @returns {string[]}
   */
  function parseCSV(str) {
    if (!str || !str.trim()) return [];
    return str.split(',').map((s) => s.trim());
  }

  /**
   * Parse a comma-separated string into an array of numbers.
   * @param {string} str - Comma-separated numbers
   * @returns {number[]}
   */
  function parseNumbers(str) {
    return parseCSV(str).map(Number);
  }

  /**
   * Get a color for a given index, cycling through the palette.
   * @param {number} index - Data point index
   * @returns {string}
   */
  function getColor(index) {
    return CYBER_COLORS[index % CYBER_COLORS.length];
  }

  /**
   * Create an error element to display inside the chart container.
   * @param {string} message - Error message text
   * @returns {HTMLElement}
   */
  function createErrorMessage(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'cd-chart-error';
    errorEl.setAttribute('role', 'alert');

    const text = document.createElement('span');
    text.className = 'cd-chart-error-text';
    text.textContent = message;

    errorEl.appendChild(text);
    return errorEl;
  }

  /**
   * Show the data table visibly (remove sr-only class) and hide the canvas.
   * Called when Chart.js CDN fails to load.
   * @param {HTMLElement} container - The .cd-chart container
   */
  function showFallbackTable(container) {
    const canvas = container.querySelector(SELECTOR_CANVAS);
    const table = container.querySelector(SELECTOR_TABLE);
    const errorMsg = container.querySelector(SELECTOR_ERROR);

    if (canvas) {
      canvas.style.display = 'none';
    }

    if (table) {
      table.classList.remove('cd-sr-only');
    }

    if (errorMsg) {
      errorMsg.classList.remove('cd-sr-only');
    }
  }

  /**
   * Render a single chart from its container.
   * @param {HTMLElement} container - The .cd-chart container element
   */
  function renderChart(container) {
    const canvas = container.querySelector(SELECTOR_CANVAS);
    if (!canvas) return;

    // Read chart config from data attributes
    const chartType = canvas.getAttribute('data-chart-type') || 'bar';
    const labelsStr = canvas.getAttribute('data-chart-labels') || '';
    const datasetLabel = canvas.getAttribute('data-chart-dataset') || 'Dataset';
    const dataStr = canvas.getAttribute('data-chart-data') || '';
    const bgStr = canvas.getAttribute('data-chart-bg') || '';
    const borderStr = canvas.getAttribute('data-chart-border') || '';
    const chartTitle = canvas.getAttribute('data-chart-title') || '';

    if (!labelsStr || !dataStr) return;

    const labels = parseCSV(labelsStr);
    const data = parseNumbers(dataStr);
    const bgColors = parseCSV(bgStr);
    const borderColors = parseCSV(borderStr);

    // Check that Chart.js is available
    if (typeof Chart === 'undefined') {
      // Chart.js CDN hasn't loaded yet — retry
      setTimeout(() => renderChart(container), 500);
      return;
    }

    // Build chart datasets configuration
    const isPieType = ['pie', 'doughnut', 'polarArea'].includes(chartType);
    const datasets = [];

    if (isPieType) {
      // Pie/doughnut: single dataset with individual colors per slice
      const bg = data.map((_, i) => bgColors[i] || getColor(i));
      const border = data.map((_, i) => borderColors[i] || bgColors[i] || 'transparent');

      datasets.push({
        label: datasetLabel,
        data: data,
        backgroundColor: bg,
        borderColor: border.length > 0 ? border : undefined,
        borderWidth: 1,
      });
    } else {
      // Bar/line/radar: single dataset with uniform color (or individual if specified)
      const bg =
        bgColors.length > 0 ? (bgColors.length === 1 ? bgColors[0] : bgColors) : getColor(0);

      const border =
        borderColors.length > 0
          ? borderColors.length === 1
            ? borderColors[0]
            : borderColors
          : undefined;

      datasets.push({
        label: datasetLabel,
        data: data,
        backgroundColor: bg,
        borderColor: border,
        borderWidth: border ? 1 : 0,
      });
    }

    // Build chart options
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#E0D0F0',
            font: {
              family: "'Space Grotesk', 'Inter', system-ui, sans-serif",
            },
          },
        },
      },
    };

    // Add title if provided
    if (chartTitle) {
      options.plugins.title = {
        display: true,
        text: chartTitle,
        color: '#FFFFFF',
        font: {
          family: "'Space Grotesk', 'Inter', system-ui, sans-serif",
          size: 16,
          weight: '600',
        },
        padding: {
          bottom: 16,
        },
      };
    }

    // Add scales for non-pie types
    if (!isPieType) {
      options.scales = {
        x: {
          ticks: {
            color: '#8A7A9A',
            font: {
              family: "'Space Grotesk', 'Inter', system-ui, sans-serif",
            },
          },
          grid: {
            color: 'rgba(42, 0, 64, 0.5)',
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#8A7A9A',
            font: {
              family: "'Space Grotesk', 'Inter', system-ui, sans-serif",
            },
          },
          grid: {
            color: 'rgba(42, 0, 64, 0.5)',
          },
        },
      };
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const chart = new Chart(canvas, {
        type: chartType,
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: options,
      });
    } catch (error) {
      // Show error state on render failure
      const canvasWrap = canvas.closest('.cd-chart-canvas-wrap');
      if (canvasWrap) {
        const existingError = canvasWrap.querySelector('.cd-chart-error');
        if (!existingError) {
          canvasWrap.appendChild(
            createErrorMessage(
              error.message || 'Chart could not be rendered. Please check the data and try again.',
            ),
          );
        }
      }
    }
  }

  /**
   * Initialize all chart containers on the page.
   */
  function init() {
    const containers = document.querySelectorAll(SELECTOR_CONTAINER);
    if (!containers.length) return;

    containers.forEach(renderChart);
  }

  /**
   * Wait for Chart.js CDN to be available, then initialize.
   * On timeout, show fallback table for all chart containers.
   */
  function waitForChartJS() {
    if (typeof Chart !== 'undefined') {
      init();
      return;
    }

    const maxAttempts = 100; // 10 seconds at 100ms intervals
    let attempts = 0;

    const interval = setInterval(() => {
      attempts += 1;

      if (typeof Chart !== 'undefined') {
        clearInterval(interval);
        init();
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        // Chart.js failed to load — show fallback tables
        const containers = document.querySelectorAll(SELECTOR_CONTAINER);
        containers.forEach(showFallbackTable);
      }
    }, 100);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForChartJS);
  } else {
    waitForChartJS();
  }
})();
