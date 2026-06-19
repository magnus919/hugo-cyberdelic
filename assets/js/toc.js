/**
 * toc.js — Table of Contents scroll tracking
 *
 * Features:
 * - IntersectionObserver highlights the active heading in the TOC
 * - Smooth-scroll on TOC link click with URL hash update
 * - Auto-scrolls the TOC container to keep the active entry visible
 * - Mobile toggle via disclosure button (aria-expanded)
 * - Auto-collapses on mobile after clicking a TOC link
 * - Reduced-motion respects prefers-reduced-motion
 */

(function () {
  'use strict';

  var TOC_ACTIVE_CLASS = 'cd-toc-link--active';

  /**
   * Debounce helper
   */
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var args = arguments;
      var ctx = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
        timer = null;
      }, delay);
    };
  }

  /**
   * Check if reduced motion is preferred
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Smooth scroll to an element
   */
  function scrollToElement(el) {
    if (!el) return;
    var headerOffset = 80; // approximate header height
    var top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({
      top: top,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  /**
   * Initialize TOC
   */
  function initToc() {
    var toc = document.querySelector('.cd-toc');
    var tocNav = document.getElementById('cd-toc-nav');
    var tocToggle = document.querySelector('.cd-toc-toggle');
    var articleBody = document.querySelector('.cd-article-body');

    if (!toc || !tocNav || !articleBody) return;

    // --- Collect headings and TOC links ---
    var headings = articleBody.querySelectorAll('h2, h3, h4, h5, h6');
    var tocLinks = tocNav.querySelectorAll('a');
    var linkMap = []; // { heading, link }

    if (headings.length < 2 || tocLinks.length === 0) {
      // Not enough headings, hide TOC entirely
      toc.style.display = 'none';
      return;
    }

    // Build a map of heading -> TOC link
    tocLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      var id = href.substring(1);
      var heading = document.getElementById(id);
      if (heading) {
        linkMap.push({ heading: heading, link: link });
        // Ensure the link has a data-target attribute for smooth scrolling
        link.setAttribute('data-target', id);
      }
    });

    if (linkMap.length === 0) return;

    // --- IntersectionObserver for active tracking ---
    var currentActiveIndex = -1;

    function setActive(index) {
      // Remove active class from all links
      tocLinks.forEach(function (l) {
        l.classList.remove(TOC_ACTIVE_CLASS);
        l.removeAttribute('aria-current');
      });

      if (index >= 0 && index < linkMap.length) {
        var entry = linkMap[index];
        entry.link.classList.add(TOC_ACTIVE_CLASS);
        entry.link.setAttribute('aria-current', 'location');

        // Scroll the TOC container to keep the active link visible
        var tocRect = tocNav.getBoundingClientRect();
        var linkRect = entry.link.getBoundingClientRect();

        if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
          entry.link.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        }

        currentActiveIndex = index;
      }
    }

    var observer = new IntersectionObserver(
      function (entries) {
        // Find the first heading that is entering or currently visible
        var visibleIndex = -1;

        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.isIntersecting) {
            // Find this heading in the linkMap
            for (var j = 0; j < linkMap.length; j++) {
              if (linkMap[j].heading === entry.target) {
                if (visibleIndex === -1 || j > visibleIndex) {
                  visibleIndex = j;
                }
                break;
              }
            }
          }
        }

        if (visibleIndex >= 0 && visibleIndex !== currentActiveIndex) {
          setActive(visibleIndex);
        } else if (visibleIndex < 0 && currentActiveIndex < 0) {
          // No heading visible and none active — activate first one
          setActive(0);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    );

    // Observe all headings
    linkMap.forEach(function (entry) {
      observer.observe(entry.heading);
    });

    // Set initial active state
    setActive(0);

    // --- Click handler for smooth scrolling ---
    tocNav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var targetId = link.getAttribute('data-target');
      if (!targetId) return;

      e.preventDefault();

      var target = document.getElementById(targetId);
      if (target) {
        scrollToElement(target);

        // Update URL hash without triggering scroll (use replaceState)
        history.replaceState(null, '', '#' + targetId);

        // Mobile: collapse TOC after clicking a link
        if (tocToggle && window.innerWidth < 1024) {
          tocToggle.setAttribute('aria-expanded', 'false');
          tocNav.style.display = 'none';
        }
      }
    });

    // --- Mobile toggle ---
    if (tocToggle) {
      // Desktop (>1024px): always show TOC content, hide toggle
      function handleResize() {
        if (window.innerWidth >= 1024) {
          // Desktop: always show nav, hide toggle button
          tocNav.style.display = 'block';
          tocToggle.style.display = 'none';
        } else {
          // Mobile: show toggle button, nav state depends on aria-expanded
          tocToggle.style.display = 'flex';
          // Restore nav display state
          var isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
          tocNav.style.display = isExpanded ? 'block' : 'none';
        }
      }

      tocToggle.addEventListener('click', function () {
        var wasExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
        var newExpanded = !wasExpanded;
        tocToggle.setAttribute('aria-expanded', String(newExpanded));
        tocNav.style.display = newExpanded ? 'block' : 'none';
      });

      // Handle resize
      var debouncedResize = debounce(handleResize, 150);
      window.addEventListener('resize', debouncedResize);
      handleResize();
    }

    // --- Handle initial hash in URL ---
    if (window.location.hash) {
      var initialTarget = document.getElementById(window.location.hash.substring(1));
      if (initialTarget) {
        // Delay to let the page render fully
        setTimeout(function () {
          scrollToElement(initialTarget);
        }, 100);
      }
    }
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToc);
  } else {
    initToc();
  }
})();
