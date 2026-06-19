/**
 * heading-anchors.js — Permalink anchor icons on heading hover
 *
 * Features:
 * - Adds a permalink anchor (#) to each h2-h6 heading in the article body
 * - Hidden by default, shown on heading hover or focus
 * - Disambiguates duplicate heading text with numeric suffixes (summary, summary-1)
 * - Clicking updates the URL hash without page reload
 * - Accessible: aria-label with heading text, decorative icon aria-hidden
 * - Touch devices: always visible (no hover state available)
 */

(function () {
  'use strict';

  var HEADING_SELECTOR = 'h2, h3, h4, h5, h6';

  /**
   * Build a clean fragment ID from heading text.
   * Matches Hugo's Goldmark heading ID generation:
   * lowercase, spaces to hyphens, strip non-alphanumeric.
   */
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Add heading anchors to all h2-h6 inside the article body.
   */
  function initHeadingAnchors() {
    // Respect showHeadingAnchors config toggle
    var configEl = document.getElementById('cd-heading-anchor-label');
    if (configEl && configEl.getAttribute('data-enabled') !== 'true') {
      return;
    }

    var articleBody = document.querySelector('.cd-article-body');
    if (!articleBody) return;

    var headings = articleBody.querySelectorAll(HEADING_SELECTOR);
    if (!headings.length) return;

    var usedIds = {};
    var permalinkLabel = '';
    // Read i18n data attribute set by template, fall back to English
    var labelEl = document.getElementById('cd-heading-anchor-label');
    if (labelEl) {
      permalinkLabel = labelEl.getAttribute('data-label') || 'Permalink to';
    } else {
      permalinkLabel = 'Permalink to';
    }

    headings.forEach(function (heading) {
      // Determine heading ID
      var id = heading.getAttribute('id');
      var headingText = heading.textContent.trim();

      // If no id from Hugo, generate one from text
      if (!id) {
        id = slugify(headingText);
      }

      // Disambiguate duplicate IDs
      if (usedIds[id] !== undefined) {
        var suffix = 1;
        var newId = id + '-' + suffix;
        while (usedIds[newId] !== undefined) {
          suffix++;
          newId = id + '-' + suffix;
        }
        id = newId;
      }
      usedIds[id] = true;

      // Update the heading's id attribute
      heading.setAttribute('id', id);

      // Create the permalink anchor element
      var anchor = document.createElement('a');
      anchor.setAttribute('href', '#' + id);
      anchor.setAttribute('aria-label', permalinkLabel + ' "' + headingText + '"');
      anchor.setAttribute('class', 'cd-heading-anchor');
      anchor.setAttribute('tabindex', '-1');

      // Decorative icon — aria-hidden
      var icon = document.createElement('span');
      icon.setAttribute('class', 'cd-heading-anchor-icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '#';
      anchor.appendChild(icon);

      // Insert anchor into heading
      heading.appendChild(anchor);

      // Click handler: update URL without page reload
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        if (targetId) {
          history.replaceState(null, '', '#' + targetId);
        }
      });
    });
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeadingAnchors);
  } else {
    initHeadingAnchors();
  }
})();
