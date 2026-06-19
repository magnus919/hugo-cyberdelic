// assets/js/carousel.js — Image carousel with prev/next buttons,
// dot indicators, keyboard navigation, and optional autoplay.
// Vanilla ES6, no framework. Loaded via Hugo Pipes.

(() => {
  'use strict';

  function init() {
    const carousels = document.querySelectorAll('.cd-carousel');
    if (!carousels.length) return;

    carousels.forEach(setupCarousel);
  }

  function setupCarousel(carousel) {
    const slides = carousel.querySelectorAll('.cd-carousel-slide');
    const prevBtn = carousel.querySelector('.cd-carousel-prev');
    const nextBtn = carousel.querySelector('.cd-carousel-next');
    const dots = carousel.querySelectorAll('.cd-carousel-dot');
    const autoplayInterval = parseInt(carousel.dataset.autoplay, 10) || 0;

    var currentIndex = 0;
    var autoplayTimer = null;
    var isTransitioning = false;

    var slideCount = slides.length;

    function showSlide(index) {
      if (isTransitioning) return;
      if (index < 0 || index >= slideCount) return;
      if (index === currentIndex) return;

      isTransitioning = true;

      slides.forEach(function (slide, i) {
        slide.hidden = i !== index;
      });

      if (prevBtn) {
        prevBtn.disabled = index === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = index === slideCount - 1;
      }

      dots.forEach(function (dot, i) {
        dot.classList.toggle('cd-carousel-dot--active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      currentIndex = index;

      // Release transition lock after a short delay
      setTimeout(function () {
        isTransitioning = false;
      }, 50);
    }

    function goToPrev() {
      if (currentIndex > 0) {
        showSlide(currentIndex - 1);
        resetAutoplay();
      }
    }

    function goToNext() {
      if (currentIndex < slideCount - 1) {
        showSlide(currentIndex + 1);
        resetAutoplay();
      }
    }

    // --- Autoplay ---

    function shouldAutoplay() {
      if (autoplayInterval <= 0 || slideCount <= 1) return false;
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function startAutoplay() {
      stopAutoplay();
      if (!shouldAutoplay()) return;
      autoplayTimer = setInterval(function () {
        var nextIndex = currentIndex + 1;
        if (nextIndex >= slideCount) {
          nextIndex = 0; // Wrap around to first
        }
        showSlide(nextIndex);
      }, autoplayInterval);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // --- Event Listeners ---

    if (prevBtn) {
      prevBtn.addEventListener('click', goToPrev);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', goToNext);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.dataset.index, 10);
        showSlide(index);
        resetAutoplay();
      });
    });

    // Keyboard navigation within the carousel
    function handleKeydown(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    }

    carousel.addEventListener('keydown', handleKeydown);

    // Pause autoplay on hover/focus, resume on leave/blur
    if (autoplayInterval > 0 && slideCount > 1) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('focusin', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusout', function () {
        // Only restart if focus moved outside the carousel
        setTimeout(function () {
          if (!carousel.contains(document.activeElement)) {
            startAutoplay();
          }
        }, 100);
      });
    }

    // Listen for reduced-motion changes
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', function () {
      if (motionQuery.matches) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // --- Initialize ---
    showSlide(0);

    if (slideCount > 1 && autoplayInterval > 0) {
      startAutoplay();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
