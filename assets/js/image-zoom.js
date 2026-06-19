(function () {
  'use strict';

  var toggleEl = document.getElementById('cd-image-zoom-toggle');
  if (!toggleEl || toggleEl.getAttribute('data-enabled') !== 'true') return;

  var LIGHTBOX_ID = 'cd-lightbox';
  var closeLabel = toggleEl.getAttribute('data-close-label') || 'Close lightbox';
  var altLabel = toggleEl.getAttribute('data-alt-label') || 'Image zoom';
  var activeTrigger = null;

  function createLightbox(src, alt) {
    var existing = document.getElementById(LIGHTBOX_ID);
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = LIGHTBOX_ID;
    overlay.className = 'cd-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', alt || altLabel);

    var backdrop = document.createElement('div');
    backdrop.className = 'cd-lightbox-backdrop';

    var img = document.createElement('img');
    img.className = 'cd-lightbox-image';
    img.src = src;
    img.alt = alt || '';
    img.setAttribute('tabindex', '0');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'cd-lightbox-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', closeLabel);
    closeBtn.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    overlay.appendChild(backdrop);
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // Trigger reflow for CSS transition
    overlay.offsetHeight;
    overlay.classList.add('cd-lightbox--open');

    closeBtn.focus();
  }

  function closeLightbox() {
    var overlay = document.getElementById(LIGHTBOX_ID);
    if (!overlay) return;
    overlay.remove();
    if (activeTrigger) {
      activeTrigger.focus({ preventScroll: true });
      activeTrigger = null;
    }
  }

  function handleImageClick(e) {
    // Only handle images inside .cd-article-body
    var img = e.target.closest('.cd-article-body img');
    if (!img) return;
    // Skip images without src (e.g., SVG placeholders)
    if (!img.src) return;
    // Skip images inside galleries (gallery has its own lightbox with navigation)
    if (img.closest('.cd-gallery')) return;
    e.preventDefault();
    // Make the image focusable so focus can return to it
    img.setAttribute('tabindex', '-1');
    activeTrigger = img;
    createLightbox(img.currentSrc || img.src, img.alt);
  }

  function handleKeyDown(e) {
    var overlay = document.getElementById(LIGHTBOX_ID);
    if (!overlay) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
      return;
    }

    if (e.key === 'Tab') {
      var focusable = overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handleOverlayClick(e) {
    var overlay = document.getElementById(LIGHTBOX_ID);
    if (!overlay) return;
    // Close only when clicking the backdrop, not the image or close button
    if (e.target.classList.contains('cd-lightbox-backdrop')) {
      closeLightbox();
    }
  }

  function handleDocumentClick(e) {
    var closeBtn = e.target.closest('.cd-lightbox-close');
    if (closeBtn) {
      closeLightbox();
      return;
    }
  }

  function init() {
    // Delegate click on document to handle zoomable images
    document.addEventListener('click', handleImageClick);
    // Close on backdrop click
    document.addEventListener('click', handleOverlayClick);
    // Close on close button click
    document.addEventListener('click', handleDocumentClick);
    // Keyboard handling
    document.addEventListener('keydown', handleKeyDown);
  }

  // Use DOMContentLoaded to ensure we don't miss early clicks
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
