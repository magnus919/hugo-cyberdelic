// assets/js/gallery.js — Gallery lightbox with arrow key navigation
// Vanilla ES6, no framework. Loaded via Hugo Pipes.
// Opens a lightbox overlay when clicking gallery thumbnails,
// supports arrow key navigation between images, and shows
// an image counter (e.g. "3 / 8").

(() => {
  'use strict';

  const LIGHTBOX_ID = 'cd-gallery-lightbox';
  var activeIndex = -1;
  var galleryImages = [];
  var activeTrigger = null;

  function getGalleryData() {
    var galleries = document.querySelectorAll('.cd-gallery');
    var allImages = [];

    galleries.forEach(function (gallery) {
      var items = gallery.querySelectorAll('.cd-gallery-item .cd-gallery-thumb');
      items.forEach(function (img) {
        allImages.push({
          src: img.currentSrc || img.src,
          alt: img.alt || '',
        });
      });
    });

    return allImages;
  }

  function createLightbox() {
    var existing = document.getElementById(LIGHTBOX_ID);
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = LIGHTBOX_ID;
    overlay.className = 'cd-lightbox cd-lightbox--gallery';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image gallery lightbox');

    var backdrop = document.createElement('div');
    backdrop.className = 'cd-lightbox-backdrop';

    var img = document.createElement('img');
    img.className = 'cd-lightbox-image';
    img.setAttribute('tabindex', '0');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'cd-lightbox-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'cd-lightbox-prev';
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><polyline points="15 18 9 12 15 6"></polyline></svg>';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'cd-lightbox-next';
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><polyline points="9 18 15 12 9 6"></polyline></svg>';

    var counter = document.createElement('span');
    counter.className = 'cd-lightbox-counter';

    overlay.appendChild(backdrop);
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    overlay.appendChild(img);
    overlay.appendChild(counter);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    return {
      overlay: overlay,
      img: img,
      closeBtn: closeBtn,
      prevBtn: prevBtn,
      nextBtn: nextBtn,
      counter: counter,
    };
  }

  function updateLightbox(index) {
    if (index < 0 || index >= galleryImages.length) return;

    activeIndex = index;
    var data = galleryImages[index];
    var lightbox = document.getElementById(LIGHTBOX_ID);
    if (!lightbox) return;

    var img = lightbox.querySelector('.cd-lightbox-image');
    var counter = lightbox.querySelector('.cd-lightbox-counter');
    var prevBtn = lightbox.querySelector('.cd-lightbox-prev');
    var nextBtn = lightbox.querySelector('.cd-lightbox-next');

    img.src = data.src;
    img.alt = data.alt;

    if (counter) {
      counter.textContent = index + 1 + ' / ' + galleryImages.length;
    }

    if (prevBtn) {
      prevBtn.disabled = index === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = index === galleryImages.length - 1;
    }
  }

  function openLightbox(index) {
    if (index < 0 || index >= galleryImages.length) return;

    var els = createLightbox();
    activeIndex = index;
    updateLightbox(index);

    // Trigger reflow for CSS transition
    els.overlay.offsetHeight;
    els.overlay.classList.add('cd-lightbox--open');

    els.closeBtn.focus();
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

  function navigateTo(direction) {
    var newIndex = activeIndex + direction;
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    updateLightbox(newIndex);
    // Focus the image element for accessibility
    var img = document.querySelector('#' + LIGHTBOX_ID + ' .cd-lightbox-image');
    if (img) img.focus();
  }

  function openGalleryFromThumb(thumb) {
    if (!thumb || !thumb.src) return;

    var allImages = getGalleryData();
    if (allImages.length === 0) return;

    var thumbSrc = thumb.currentSrc || thumb.src;
    var idx = -1;
    for (var i = 0; i < allImages.length; i++) {
      if (allImages[i].src === thumbSrc) {
        idx = i;
        break;
      }
    }

    if (idx === -1) return;

    galleryImages = allImages;
    activeTrigger = thumb;
    openLightbox(idx);
  }

  function handleImageClick(e) {
    // Support clicking on either the thumbnail img or its parent figure
    var thumb = e.target.closest('.cd-gallery-thumb');
    var item = e.target.closest('.cd-gallery-item');
    if (!thumb && !item) return;

    // If clicked on the figure, find the img inside it
    if (!thumb && item) {
      thumb = item.querySelector('.cd-gallery-thumb');
    }

    e.preventDefault();
    openGalleryFromThumb(thumb);
  }

  function handleItemKeyDown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    var item = e.target.closest('.cd-gallery-item');
    if (!item) return;

    e.preventDefault();

    var thumb = item.querySelector('.cd-gallery-thumb');
    openGalleryFromThumb(thumb);
  }

  function handleKeyDown(e) {
    var overlay = document.getElementById(LIGHTBOX_ID);
    if (!overlay) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateTo(-1);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateTo(1);
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

    var prevBtn = e.target.closest('.cd-lightbox-prev');
    if (prevBtn && !prevBtn.disabled) {
      navigateTo(-1);
      return;
    }

    var nextBtn = e.target.closest('.cd-lightbox-next');
    if (nextBtn && !nextBtn.disabled) {
      navigateTo(1);
      return;
    }
  }

  function handleResize() {
    // Gallery lightbox image sizing is handled by CSS
    // No JavaScript resize handling needed
  }

  function init() {
    var galleries = document.querySelectorAll('.cd-gallery');
    if (!galleries.length) return;

    document.addEventListener('click', handleImageClick);
    document.addEventListener('click', handleOverlayClick);
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleItemKeyDown);
    window.addEventListener('resize', handleResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
