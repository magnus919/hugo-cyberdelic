/**
 * code-copy.js — Clipboard copy button for every <pre><code> block
 *
 * Features:
 * - Injects a copy button into each <pre> inside .cd-article-body
 * - Uses Clipboard API with execCommand('copy') fallback
 * - Visual feedback: checkmark + "Copied!" for 2 seconds, then reverts
 * - Keyboard accessible: Tab to focus, Enter/Space to activate
 * - Graceful failure: shows error state without uncaught exceptions
 */

(function () {
  'use strict';

  var COPY_BTN_CLASS = 'cd-code-copy-btn';
  var COPY_BTN_COPIED_CLASS = 'cd-code-copy-btn--copied';
  var COPY_BTN_ERROR_CLASS = 'cd-code-copy-btn--error';

  var FEEDBACK_DURATION_MS = 2000;

  /**
   * Create a simple SVG icon string for clipboard.
   * @returns {string} SVG markup
   */
  function clipboardIcon() {
    return (
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
      '</svg>'
    );
  }

  /**
   * Create a checkmark SVG icon string.
   * @returns {string} SVG markup
   */
  function checkIcon() {
    return (
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="20 6 9 17 4 12"/>' +
      '</svg>'
    );
  }

  /**
   * Create an X/error SVG icon string.
   * @returns {string} SVG markup
   */
  function errorIcon() {
    return (
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="18" y1="6" x2="6" y2="18"/>' +
      '<line x1="6" y1="6" x2="18" y2="18"/>' +
      '</svg>'
    );
  }

  /**
   * Get the text content of a code block, trimming leading/trailing whitespace.
   * @param {HTMLPreElement} preEl - The <pre> element
   * @returns {string} The text content
   */
  function getCodeText(preEl) {
    var codeEl = preEl.querySelector('code');
    if (!codeEl) {
      return preEl.textContent.trim();
    }
    return codeEl.textContent.trim();
  }

  /**
   * Show feedback state on the copy button.
   * @param {HTMLButtonElement} btn - The copy button
   * @param {string} state - 'copied' or 'error'
   * @param {string} label - The text label to show
   * @param {string} iconSvg - The SVG markup for the icon
   */
  function showFeedback(btn, state, label, iconSvg) {
    // Clear any existing feedback timer
    var timerId = btn.getAttribute('data-copy-timer');
    if (timerId) {
      clearTimeout(parseInt(timerId, 10));
      btn.removeAttribute('data-copy-timer');
    }

    // Reset classes
    btn.classList.remove(COPY_BTN_COPIED_CLASS, COPY_BTN_ERROR_CLASS);
    btn.classList.add(state === 'copied' ? COPY_BTN_COPIED_CLASS : COPY_BTN_ERROR_CLASS);

    // Update content
    var oldLabel = btn.getAttribute('data-original-label') || btn.getAttribute('aria-label');
    if (!btn.getAttribute('data-original-label')) {
      btn.setAttribute('data-original-label', oldLabel);
    }
    var oldIcon = btn.getAttribute('data-original-icon');
    if (!oldIcon) {
      oldIcon = btn.innerHTML;
      btn.setAttribute('data-original-icon', oldIcon);
    }

    btn.innerHTML = iconSvg + ' ' + label;

    // Set timer to revert
    var timer = setTimeout(function () {
      revertButton(btn);
    }, FEEDBACK_DURATION_MS);

    btn.setAttribute('data-copy-timer', String(timer));
  }

  /**
   * Revert the button to its original state.
   * @param {HTMLButtonElement} btn
   */
  function revertButton(btn) {
    btn.classList.remove(COPY_BTN_COPIED_CLASS, COPY_BTN_ERROR_CLASS);

    var originalIcon = btn.getAttribute('data-original-icon');
    var originalLabel = btn.getAttribute('data-original-label');

    if (originalIcon) {
      btn.innerHTML = originalIcon;
    }

    if (originalLabel) {
      btn.setAttribute('aria-label', originalLabel);
    }

    btn.removeAttribute('data-original-icon');
    btn.removeAttribute('data-original-label');
    btn.removeAttribute('data-copy-timer');
  }

  /**
   * Copy text using the execCommand('copy') fallback with a temporary textarea.
   * Must be called synchronously within a user-initiated event handler.
   * @param {string} text - The text to copy
   * @returns {boolean} True if copy succeeded, false otherwise
   */
  function execCommandCopy(text) {
    try {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      var success = document.execCommand('copy');
      document.body.removeChild(textarea);

      return success;
    } catch (e) {
      return false;
    }
  }

  /**
   * Handle the copy action for a button.
   * Attempts execCommand synchronously first (works with user activation in all browsers).
   * Falls back to Clipboard API asynchronously if execCommand fails.
   *
   * @param {HTMLButtonElement} btn
   * @param {HTMLPreElement} preEl
   */
  function handleCopy(btn, preEl) {
    var text = getCodeText(preEl);

    // Try execCommand('copy') synchronously first — this runs within the click
    // handler while the browser's transient user activation is still available.
    if (execCommandCopy(text)) {
      showFeedback(btn, 'copied', 'Copied!', checkIcon());
      return;
    }

    // execCommand failed — try Clipboard API asynchronously.
    // This works on secure origins (HTTPS, localhost) even without direct
    // user activation in some browsers.
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(
        function () {
          showFeedback(btn, 'copied', 'Copied!', checkIcon());
        },
        function () {
          showFeedback(btn, 'error', 'Copy failed', errorIcon());
        },
      );
    } else {
      showFeedback(btn, 'error', 'Copy failed', errorIcon());
    }
  }

  /**
   * Inject a copy button into a single <pre> element.
   * @param {HTMLPreElement} preEl
   */
  function injectButton(preEl) {
    // Skip if button already exists (idempotent)
    if (preEl.querySelector('.' + COPY_BTN_CLASS)) {
      return;
    }

    // Skip if no code content
    var codeEl = preEl.querySelector('code');
    if (!codeEl) return;

    var btn = document.createElement('button');
    btn.className = COPY_BTN_CLASS;
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.innerHTML = clipboardIcon();

    // Click handler
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      handleCopy(btn, preEl);
    });

    // Make the pre element position relative so absolute positioning works
    var computedStyle = window.getComputedStyle(preEl);
    if (computedStyle.position === 'static') {
      preEl.style.position = 'relative';
    }

    preEl.insertBefore(btn, preEl.firstChild);
  }

  /**
   * Initialize: find all <pre> elements in article body and inject copy buttons.
   */
  function init() {
    var articleBody = document.querySelector('.cd-article-body');
    if (!articleBody) return;

    var preElements = articleBody.querySelectorAll('pre');
    if (!preElements.length) return;

    preElements.forEach(injectButton);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
