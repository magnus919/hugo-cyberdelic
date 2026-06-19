/**
 * Nested menu interactions for hugo-cyberdelic
 *
 * Desktop:
 *   - Hover opens dropdowns (with debounce to prevent accidental triggers)
 *   - Escape closes dropdowns
 *   - Flyout positions away from viewport edges
 *
 * Mobile:
 *   - Hamburger toggles slide-out navigation panel
 *   - Tap to expand/collapse submenus
 *   - Large tap targets (min 44px)
 *
 * Keyboard:
 *   - Tab navigates through top-level items
 *   - Enter/Space opens/closes parent items
 *   - Arrow keys navigate within and between menus
 *   - Escape closes current submenu
 *   - ArrowRight opens submenu, ArrowLeft closes it
 *
 * ARIA:
 *   - aria-haspopup, aria-expanded, aria-controls on parent buttons
 *   - aria-current="page" on active items
 *   - role=menubar, role=menu, role=menuitem
 */
(function () {
  'use strict';

  /** Polyfill for Element.matches if needed */
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  /** Polyfill for Element.closest if needed */
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // --- Selectors ---
  var SELECTORS = {
    nav: '.cd-nav',
    navList: '.cd-nav-list',
    navItem: '.cd-nav-item',
    navItemParent: '.cd-nav-item--parent',
    navLink: '.cd-nav-link',
    navSub: '.cd-nav-sub',
    hamburger: '.cd-hamburger',
    header: '.cd-header',
  };

  // --- State ---
  var isMobile = window.innerWidth <= 1024;
  var openSubmenus = []; // Stack of open submenu <ul> elements
  var hoverTimeout = null;
  var closeTimeout = null;
  var HOVER_DELAY = 150; // ms before opening on hover
  var CLOSE_DELAY = 250; // ms before closing on cursor leave

  // --- DOM references ---
  var navEl = document.querySelector(SELECTORS.nav);
  var navList = document.querySelector(SELECTORS.navList);
  var hamburger = document.querySelector(SELECTORS.hamburger);

  // --- Utilities ---

  /** Check if current viewport is mobile */
  function checkViewport() {
    isMobile = window.innerWidth <= 1024;
  }

  /** Get all top-level menu items */
  function getTopLevelItems() {
    if (!navList) return [];
    return Array.prototype.slice.call(navList.querySelectorAll(':scope > .cd-nav-item'));
  }

  /** Get all items in a specific submenu */
  function getSubmenuItems(subUl) {
    if (!subUl) return [];
    return Array.prototype.slice.call(subUl.querySelectorAll(':scope > .cd-nav-item'));
  }

  /** Get the submenu <ul> for a parent item */
  function getSubmenu(item) {
    return item.querySelector('.' + SELECTORS.navSub.replace('.', ''));
  }

  /** Get the link/button inside a nav item */
  function getNavLink(item) {
    return item.querySelector('.' + SELECTORS.navLink.replace('.', ''));
  }

  /** Check if a menu item has children */
  function hasChildren(item) {
    return item.hasAttribute('data-has-children');
  }

  /** Find the closest parent submenu (for keyboard nav) */
  function getParentSubmenu(item) {
    return item.parentElement && item.parentElement.closest
      ? item.parentElement.closest(SELECTORS.navSub)
      : null;
  }

  /** Find parent nav-item from a submenu */
  function getParentNavItem(subUl) {
    if (!subUl || !subUl.parentElement) return null;
    return subUl.parentElement.closest ? subUl.parentElement.closest(SELECTORS.navItem) : null;
  }

  /** Check if an open submenu's parent is the nav-list root */
  function isRootSubmenu(subUl) {
    return subUl && subUl.classList.contains('cd-nav-sub--root');
  }

  // --- Viewport edge detection ---

  /** Check if a submenu would overflow the viewport and apply positioning class */
  function adjustFlyoutPosition(subUl) {
    if (!subUl || !subUl.getBoundingClientRect) return;

    var rect = subUl.getBoundingClientRect();
    var viewportW = window.innerWidth;
    var viewportH = window.innerHeight;

    subUl.classList.remove('cd-nav-sub--left', 'cd-nav-sub--right', 'cd-nav-sub--bottom');

    // Horizontal overflow (right edge)
    if (rect.right > viewportW) {
      var parentItem = getParentNavItem(subUl);
      if (parentItem) {
        // Check if this is a 2nd+ level flyout (not root level)
        var parentSub = getParentSubmenu(parentItem);
        if (parentSub && !isRootSubmenu(parentSub)) {
          subUl.classList.add('cd-nav-sub--left');
        } else {
          subUl.classList.add('cd-nav-sub--right');
        }
      }
    }

    // Vertical overflow
    if (rect.bottom > viewportH) {
      subUl.classList.add('cd-nav-sub--bottom');
    }
  }

  /** Adjust all open submenus' positions (call on resize/scroll) */
  function adjustAllOpenPositions() {
    var openSubs = document.querySelectorAll(SELECTORS.navSub + '[aria-hidden="false"]');
    openSubs.forEach(function (sub) {
      adjustFlyoutPosition(sub);
    });
  }

  // --- ARIA management ---

  /** Open a submenu */
  function openSubmenu(item, focusFirst) {
    if (focusFirst === void 0) focusFirst = false;

    if (!item || !hasChildren(item)) return;

    var sub = getSubmenu(item);
    var link = getNavLink(item);

    if (!sub || !link) return;

    // Mark this submenu as open
    sub.setAttribute('aria-hidden', 'false');
    link.setAttribute('aria-expanded', 'true');

    // Add to open stack if not already there
    if (openSubmenus.indexOf(sub) === -1) {
      openSubmenus.push(sub);
    }

    // Apply active class to parent
    item.classList.add('cd-nav-item--open');

    // Adjust flyout position
    adjustFlyoutPosition(sub);

    // Focus first item
    if (focusFirst) {
      var firstItem = getSubmenuItems(sub)[0];
      if (firstItem) {
        var firstLink = getNavLink(firstItem);
        if (firstLink) firstLink.focus();
      }
    }
  }

  /** Close a submenu */
  function closeSubmenu(item, focusParent) {
    if (focusParent === void 0) focusParent = true;

    if (!item) return;

    var sub = getSubmenu(item);
    var link = getNavLink(item);

    if (sub) {
      sub.setAttribute('aria-hidden', 'true');
    }

    if (link) {
      link.setAttribute('aria-expanded', 'false');
    }

    // Remove from open stack
    var idx = openSubmenus.indexOf(sub);
    if (idx !== -1) {
      openSubmenus.splice(idx, 1);
    }

    // Also close all descendant submenus
    if (sub) {
      var childOpen = sub.querySelectorAll(SELECTORS.navSub + '[aria-hidden="false"]');
      childOpen.forEach(function (childSub) {
        var childItem = getParentNavItem(childSub);
        if (childItem) {
          closeSubmenu(childItem, false);
        }
      });
    }

    item.classList.remove('cd-nav-item--open');

    // Focus the parent button
    if (focusParent && link) {
      link.focus();
    }
  }

  /** Close all open submenus */
  function closeAllSubmenus() {
    var items = document.querySelectorAll(SELECTORS.navItem + '--open');
    items.forEach(function (item) {
      closeSubmenu(item, false);
    });
    openSubmenus = [];
  }

  /** Toggle a submenu open/closed */
  function toggleSubmenu(item) {
    if (!item || !hasChildren(item)) return;

    var sub = getSubmenu(item);
    var isOpen = sub && sub.getAttribute('aria-hidden') === 'false';

    if (isOpen) {
      // Close only this one, keeping focus on parent
      closeSubmenu(item, false);
      // Focus back on trigger
      var link = getNavLink(item);
      if (link) link.focus();
    } else {
      // Close siblings at same level
      var parent = item.parentElement;
      if (parent) {
        var siblings = parent.querySelectorAll(':scope > .cd-nav-item--parent.cd-nav-item--open');
        siblings.forEach(function (sib) {
          if (sib !== item) closeSubmenu(sib, false);
        });
      }
      openSubmenu(item, false);
    }
  }

  // --- Event Handlers ---

  /** On hamburger click — toggle mobile nav */
  function onHamburgerClick(e) {
    e.stopPropagation();
    if (!navEl || !hamburger) return;

    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function openMobileNav() {
    if (!navEl || !hamburger) return;

    navEl.classList.add('cd-nav--open');
    hamburger.classList.add('cd-hamburger--active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';

    // Close any open submenus from desktop mode
    closeAllSubmenus();

    // Focus first menu item
    setTimeout(function () {
      var firstItem = getTopLevelItems()[0];
      if (firstItem) {
        var firstLink = getNavLink(firstItem);
        if (firstLink) firstLink.focus();
      }
    }, 100);
  }

  function closeMobileNav() {
    if (!navEl || !hamburger) return;

    navEl.classList.remove('cd-nav--open');
    hamburger.classList.remove('cd-hamburger--active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle menu');
    document.body.style.overflow = '';

    // Close all submenus
    closeAllSubmenus();
  }

  // --- Desktop Hover ---

  function onItemMouseEnter(e) {
    if (isMobile) return;

    var item = e.currentTarget;
    if (!hasChildren(item)) return;

    clearTimeout(hoverTimeout);
    clearTimeout(closeTimeout);

    hoverTimeout = setTimeout(function () {
      // Close siblings
      var parent = item.parentElement;
      if (parent) {
        var siblings = parent.querySelectorAll(':scope > .cd-nav-item--parent.cd-nav-item--open');
        siblings.forEach(function (sib) {
          if (sib !== item) closeSubmenu(sib, false);
        });
      }
      openSubmenu(item, false);
    }, HOVER_DELAY);
  }

  function onItemMouseLeave(e) {
    if (isMobile) return;

    var item = e.currentTarget;

    clearTimeout(hoverTimeout);

    // Give a small delay so cursor moving into the dropdown doesn't close it
    closeTimeout = setTimeout(function () {
      // Only close if cursor isn't inside the item or its submenu
      var related = e.relatedTarget;
      if (item.contains(related)) return;
      closeSubmenu(item, false);
    }, CLOSE_DELAY);
  }

  function onSubmenuMouseEnter() {
    if (isMobile) return;
    clearTimeout(closeTimeout);
  }

  function onSubmenuMouseLeave(e) {
    if (isMobile) return;

    var sub = e.currentTarget;
    clearTimeout(closeTimeout);

    closeTimeout = setTimeout(function () {
      var related = e.relatedTarget;
      if (sub.contains(related)) return;
      var parentItem = getParentNavItem(sub);
      if (parentItem) {
        closeSubmenu(parentItem, false);
      }
    }, CLOSE_DELAY);
  }

  // --- Keyboard Navigation ---

  function onKeydown(e) {
    // Only handle keyboard when not on mobile
    // On mobile, native focus/keyboard still works, but we handle it
    // differently - Arrow keys navigate within open menus

    var item = e.target.closest(SELECTORS.navItem);
    if (!item) return;

    var key = e.key;
    var handled = true;

    switch (key) {
      case 'ArrowDown':
        onArrowDown(e, item);
        break;
      case 'ArrowUp':
        onArrowUp(e, item);
        break;
      case 'ArrowRight':
        onArrowRight(e, item);
        break;
      case 'ArrowLeft':
        onArrowLeft(e, item);
        break;
      case 'Escape':
        onEscape(e, item);
        break;
      case 'Enter':
      case ' ':
        onEnterSpace(e, item);
        break;
      default:
        handled = false;
        break;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /** ArrowDown: move to next item, or open submenu and focus first child */
  function onArrowDown(e, item) {
    var sub = getSubmenu(item);
    var isOpen = sub && sub.getAttribute('aria-hidden') === 'false';

    if (isOpen) {
      // Submenu is open, focus first child
      var items = getSubmenuItems(sub);
      if (items.length > 0) {
        var firstLink = getNavLink(items[0]);
        if (firstLink) firstLink.focus();
      }
    } else {
      // Move to next sibling item
      var next = item.nextElementSibling;
      if (next) {
        var nextLink = getNavLink(next);
        if (nextLink) nextLink.focus();
      }
    }
  }

  /** ArrowUp: move to previous item, or if in submenu, focus parent */
  function onArrowUp(e, item) {
    var prev = item.previousElementSibling;
    if (prev) {
      var prevLink = getNavLink(prev);
      if (prevLink) prevLink.focus();
    } else {
      // At the first item of a submenu, focus back on parent trigger
      var parentSub = getParentSubmenu(item);
      if (parentSub) {
        var parentItem = getParentNavItem(parentSub);
        if (parentItem) {
          var parentLink = getNavLink(parentItem);
          if (parentLink) parentLink.focus();
        }
      }
    }
  }

  /** ArrowRight: open submenu and focus first child */
  function onArrowRight(e, item) {
    if (!hasChildren(item)) return;

    var sub = getSubmenu(item);
    if (!sub) return;

    // Open the submenu
    openSubmenu(item, false);

    // Focus first child
    var items = getSubmenuItems(sub);
    if (items.length > 0) {
      var firstLink = getNavLink(items[0]);
      if (firstLink) firstLink.focus();
    }
  }

  /** ArrowLeft: close submenu and focus parent */
  function onArrowLeft(e, item) {
    var parentSub = getParentSubmenu(item);
    if (parentSub) {
      var parentItem = getParentNavItem(parentSub);
      if (parentItem) {
        closeSubmenu(parentItem, true);
      }
    }
  }

  /** Escape: close current submenu and focus parent */
  function onEscape(e, item) {
    var parentSub = getParentSubmenu(item);
    if (parentSub) {
      // Close this submenu
      var parentItem = getParentNavItem(parentSub);
      if (parentItem) {
        closeSubmenu(parentItem, true);
      }
    } else if (isMobile && navEl && navEl.classList.contains('cd-nav--open')) {
      // On mobile, Escape closes the entire nav
      closeMobileNav();
    }
  }

  /** Enter/Space: activate link or toggle submenu */
  function onEnterSpace(e, item) {
    if (hasChildren(item)) {
      e.preventDefault();
      toggleSubmenu(item);
    }
    // For leaf items, let the default link navigation happen
  }

  // --- Focus management: close submenus when focus leaves the nav ---

  function onFocusOut(e) {
    // If focus leaves the nav entirely, close all submenus
    var nav = navEl;
    if (!nav) return;

    // Use a microtask to let the next focus settle
    setTimeout(function () {
      if (!nav.contains(document.activeElement)) {
        closeAllSubmenus();
      }
    }, 0);
  }

  // --- Resize handler ---

  function onResize() {
    var wasMobile = isMobile;
    checkViewport();

    if (wasMobile && !isMobile) {
      // Transitioned from mobile to desktop
      if (navEl) navEl.classList.remove('cd-nav--open');
      if (hamburger) {
        hamburger.classList.remove('cd-hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
      closeAllSubmenus();
    } else if (!wasMobile && isMobile) {
      // Transitioned from desktop to mobile
      closeAllSubmenus();
    }

    // Re-adjust flyout positions
    adjustAllOpenPositions();
  }

  // --- Click-outside handler ---

  function onDocumentClick(e) {
    // Close mobile menu if clicking outside
    if (isMobile && navEl && navEl.classList.contains('cd-nav--open')) {
      if (!hamburger.contains(e.target) && !navEl.contains(e.target)) {
        closeMobileNav();
      }
    }

    // Close open submenus if clicking outside (desktop)
    if (!isMobile && openSubmenus.length > 0) {
      var nav = navEl;
      if (nav && !nav.contains(e.target)) {
        closeAllSubmenus();
      }
    }
  }

  // --- Click handler for mobile submenu toggle ---

  function onNavLinkClick(e) {
    if (!isMobile) return;

    var item = e.currentTarget.closest(SELECTORS.navItem);
    if (!item || !hasChildren(item)) return;

    e.preventDefault();
    toggleSubmenu(item);
  }

  // --- Hover handlers for submenu mouse events ---

  function attachSubmenuEvents() {
    document.querySelectorAll(SELECTORS.navSub).forEach(function (sub) {
      sub.removeEventListener('mouseenter', onSubmenuMouseEnter);
      sub.removeEventListener('mouseleave', onSubmenuMouseLeave);
      sub.addEventListener('mouseenter', onSubmenuMouseEnter);
      sub.addEventListener('mouseleave', onSubmenuMouseLeave);
    });
  }

  // --- Initialization ---

  function init() {
    if (!navEl || !navList) return;

    // Make sure all submenus are hidden by default
    document.querySelectorAll(SELECTORS.navSub).forEach(function (sub) {
      sub.setAttribute('aria-hidden', 'true');
    });

    // --- Hamburger (mobile) ---
    if (hamburger) {
      hamburger.addEventListener('click', onHamburgerClick);
    }

    // --- Desktop hover ---
    var allItems = document.querySelectorAll(SELECTORS.navItem);
    allItems.forEach(function (item) {
      item.addEventListener('mouseenter', onItemMouseEnter);
      item.addEventListener('mouseleave', onItemMouseLeave);
    });

    // --- Submenu hover (keep open when hovering dropdown) ---
    attachSubmenuEvents();

    // --- Keyboard navigation ---
    navEl.addEventListener('keydown', onKeydown);

    // --- Focus out ---
    navEl.addEventListener('focusout', onFocusOut);

    // --- Click-outside ---
    document.addEventListener('click', onDocumentClick);

    // --- Mobile link clicks (toggle submenus instead of navigating) ---
    document.querySelectorAll(SELECTORS.navLink + '--parent').forEach(function (link) {
      link.addEventListener('click', onNavLinkClick);
    });
    // Also handle regular links that might be parents on mobile
    document
      .querySelectorAll(SELECTORS.navItemParent + ' .' + SELECTORS.navLink.replace('.', ''))
      .forEach(function (link) {
        link.addEventListener('click', onNavLinkClick);
      });

    // --- Resize ---
    window.addEventListener('resize', onResize);

    // --- Check initial viewport ---
    checkViewport();

    // If there's any MutationObserver-based re-attachment needed in the future:
    // Observe for dynamically added submenus (unlikely in static Hugo, but future-proof)
    var observer = new MutationObserver(function () {
      attachSubmenuEvents();
    });
    if (navList) {
      observer.observe(navList, { childList: true, subtree: true });
    }
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
