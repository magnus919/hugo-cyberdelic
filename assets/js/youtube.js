// assets/js/youtube.js — YouTube lite embed: click-to-load privacy-friendly iframe
// Replaces placeholder with youtube-nocookie.com iframe on click or keyboard activation.
// Vanilla ES6, no dependencies.

(() => {
  'use strict';

  const SELECTOR_PLACEHOLDER = '.cd-youtube-placeholder';

  /**
   * Create an iframe element for the YouTube video.
   * @param {string} videoId - The YouTube video ID
   * @param {string} title - The video title for accessibility
   * @returns {HTMLIFrameElement}
   */
  function createIframe(videoId, title) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    iframe.title = title;
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.setAttribute('aria-label', title);
    return iframe;
  }

  /**
   * Activate the YouTube embed: replace the placeholder with an iframe.
   * @param {HTMLElement} placeholder - The placeholder element to replace
   */
  function activateEmbed(placeholder) {
    const videoId = placeholder.dataset.youtubeId;
    const title = placeholder.dataset.youtubeTitle || 'YouTube video';

    if (!videoId) return;

    const container = placeholder.closest('.cd-youtube');
    if (!container) return;

    const iframe = createIframe(videoId, title);

    // Replace placeholder content with iframe
    placeholder.replaceWith(iframe);
  }

  /**
   * Handle click events on placeholders.
   * @param {MouseEvent} event
   */
  function handleClick(event) {
    const placeholder = event.currentTarget;
    activateEmbed(placeholder);
  }

  /**
   * Handle keyboard events on placeholders (Enter or Space to activate).
   * @param {KeyboardEvent} event
   */
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const placeholder = event.currentTarget;
      activateEmbed(placeholder);
    }
  }

  /**
   * Initialize YouTube embed placeholders.
   */
  function init() {
    const placeholders = document.querySelectorAll(SELECTOR_PLACEHOLDER);
    if (!placeholders.length) return;

    placeholders.forEach((placeholder) => {
      // Remove existing listeners to prevent duplicates (idempotent init)
      placeholder.removeEventListener('click', handleClick);
      placeholder.removeEventListener('keydown', handleKeydown);

      placeholder.addEventListener('click', handleClick);
      placeholder.addEventListener('keydown', handleKeydown);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
