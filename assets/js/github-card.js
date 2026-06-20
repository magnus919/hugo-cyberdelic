// assets/js/github-card.js — GitHub repo/issue/PR metadata cards
// Fetches data from the GitHub API and renders cyberdelic-styled cards.
// Vanilla ES6, no dependencies.

(() => {
  'use strict';

  const GITHUB_API_BASE = 'https://api.github.com';

  /** Minimum layout shift prevention */
  const CARD_SELECTOR = '.cd-github-card';

  /**
   * Fetch JSON from the GitHub API.
   * @param {string} path - API path (e.g., /repos/owner/repo)
   * @returns {Promise<object>}
   */
  async function fetchGitHubAPI(path) {
    const url = `${GITHUB_API_BASE}${path}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('not_found');
      }
      if (response.status === 403) {
        throw new Error('rate_limited');
      }
      throw new Error('network_error');
    }

    return response.json();
  }

  /**
   * Format a date string for display.
   * @param {string} dateStr - ISO 8601 date string
   * @returns {string}
   */
  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  /**
   * Format a number with commas.
   * @param {number} num
   * @returns {string}
   */
  function formatNumber(num) {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  }

  /**
   * Get the language color for a programming language.
   * @param {string} lang
   * @returns {string}
   */
  function getLanguageColor(lang) {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572a5',
      Go: '#00add8',
      Rust: '#dea584',
      Ruby: '#701516',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051',
      PHP: '#4f5d95',
      Swift: '#f05138',
      Kotlin: '#a97bff',
      Dart: '#00b4ab',
      Lua: '#000080',
      Haskell: '#5e5086',
      Scala: '#c22d40',
      Elixir: '#6e4a7e',
      Clojure: '#db5855',
      Erlang: '#b83998',
      Vue: '#41b883',
      Markdown: '#083fa1',
    };
    return colors[lang] || '#8a7a9a';
  }

  /**
   * Get the state badge color.
   * @param {string} state - "open", "closed", "merged"
   * @returns {string}
   */
  function getStateColor(state) {
    switch (state) {
      case 'open':
        return '#2da44e'; // green
      case 'closed':
        return '#cf222e'; // red
      case 'merged':
        return '#8250df'; // purple
      default:
        return '#8a7a9a';
    }
  }

  /**
   * Get state label text.
   * @param {string} state
   * @returns {string}
   */
  function getStateLabel(state) {
    switch (state) {
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
      case 'merged':
        return 'Merged';
      default:
        return state;
    }
  }

  /**
   * Create a text element.
   * @param {string} tag
   * @param {string} text
   * @param {string[]} [classes]
   * @returns {HTMLElement}
   */
  function createEl(tag, text, classes) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (classes) el.classList.add(...classes);
    return el;
  }

  /**
   * Render a repository card.
   * @param {object} data - GitHub API repo response
   * @param {HTMLElement} container - The card content container
   */
  function renderRepoCard(data, container) {
    const header = container.querySelector('.cd-github-card-header');
    const avatar = header.querySelector('.cd-github-card-avatar');
    const titleLink = header.querySelector('.cd-github-card-title');
    const ownerEl = header.querySelector('.cd-github-card-owner');
    const body = container.querySelector('.cd-github-card-body');
    const desc = body.querySelector('.cd-github-card-description');
    const meta = body.querySelector('.cd-github-card-meta');
    const stats = body.querySelector('.cd-github-card-stats');
    const labels = body.querySelector('.cd-github-card-labels');

    // Avatar
    const ownerName = data.owner ? data.owner.login : '';
    avatar.src = data.owner ? data.owner.avatar_url : '';
    avatar.alt = `${ownerName}'s avatar`;
    avatar.width = 48;
    avatar.height = 48;

    // Title link
    titleLink.href = data.html_url;
    titleLink.textContent = data.full_name || data.name;

    // Owner
    ownerEl.textContent = ownerName;

    // Description
    desc.textContent = data.description || '';

    // Meta (language, updated date)
    meta.innerHTML = '';
    if (data.language) {
      const langDot = createEl('span', '', ['cd-github-card-lang-dot']);
      langDot.style.backgroundColor = getLanguageColor(data.language);
      meta.appendChild(langDot);
      meta.appendChild(createEl('span', data.language, ['cd-github-card-lang']));
    }
    if (data.updated_at) {
      const updatedText = `Updated ${formatDate(data.updated_at)}`;
      meta.appendChild(createEl('span', updatedText, ['cd-github-card-updated']));
    }

    // Stats (stars, forks)
    stats.innerHTML = '';
    if (data.stargazers_count !== undefined) {
      const starCount = formatNumber(data.stargazers_count);
      stats.appendChild(
        createEl('span', `★ ${starCount}`, ['cd-github-card-stat', 'cd-github-card-stat--stars']),
      );
    }
    if (data.forks_count !== undefined) {
      const forkCount = formatNumber(data.forks_count);
      stats.appendChild(
        createEl('span', `⑂ ${forkCount}`, ['cd-github-card-stat', 'cd-github-card-stat--forks']),
      );
    }

    // Clear labels area
    labels.innerHTML = '';
  }

  /**
   * Render an issue or PR card.
   * @param {object} data - GitHub API issue/pull response
   * @param {string} type - "issue" or "pull"
   * @param {HTMLElement} container - The card content container
   */
  function renderIssueCard(data, type, container) {
    const header = container.querySelector('.cd-github-card-header');
    const avatar = header.querySelector('.cd-github-card-avatar');
    const titleLink = header.querySelector('.cd-github-card-title');
    const ownerEl = header.querySelector('.cd-github-card-owner');
    const body = container.querySelector('.cd-github-card-body');
    const desc = body.querySelector('.cd-github-card-description');
    const meta = body.querySelector('.cd-github-card-meta');
    const stats = body.querySelector('.cd-github-card-stats');
    const labels = body.querySelector('.cd-github-card-labels');

    // Determine state (PRs use merged_at for merged state)
    let state = data.state;
    if (type === 'pull' && data.merged_at) {
      state = 'merged';
    }

    // Avatar
    const userLogin = data.user ? data.user.login : '';
    avatar.src = data.user ? data.user.avatar_url : '';
    avatar.alt = `${userLogin}'s avatar`;
    avatar.width = 48;
    avatar.height = 48;

    // Title link
    titleLink.href = data.html_url;
    titleLink.textContent = data.title || '';

    // Owner/repo info (from the card data attributes)
    const cardEl = container.closest(CARD_SELECTOR);
    const owner = cardEl ? cardEl.dataset.ghOwner : '';
    const repo = cardEl ? cardEl.dataset.ghRepo : '';
    ownerEl.textContent = `${owner}/${repo}`;

    // Description (state badge + author + comments)
    desc.innerHTML = '';
    const stateBadge = createEl('span', getStateLabel(state), ['cd-github-card-state-badge']);
    stateBadge.style.backgroundColor = getStateColor(state);
    desc.appendChild(stateBadge);
    desc.appendChild(document.createTextNode(` by ${userLogin}`));

    // Meta (number, type)
    meta.innerHTML = '';
    const numberText = `#${data.number}`;
    meta.appendChild(createEl('span', numberText, ['cd-github-card-number']));
    const typeLabel = type === 'pull' ? 'Pull request' : 'Issue';
    meta.appendChild(createEl('span', typeLabel, ['cd-github-card-type']));

    // Stats (comments count)
    stats.innerHTML = '';
    if (data.comments !== undefined) {
      const commentText = `${data.comments} comments`;
      stats.appendChild(createEl('span', commentText, ['cd-github-card-stat']));
    }

    // Labels
    labels.innerHTML = '';
    if (data.labels && data.labels.length > 0) {
      data.labels.forEach((label) => {
        const labelEl = createEl('span', label.name, ['cd-github-card-label']);
        if (label.color) {
          const bgColor = `#${label.color}`;
          labelEl.style.backgroundColor = bgColor;
          labelEl.style.color = getContrastColor(bgColor);
        }
        labels.appendChild(labelEl);
      });
    }
  }

  /**
   * Get contrasting text color for a given background color.
   * @param {string} hexColor - Hex color string
   * @returns {string} "#000000" or "#ffffff"
   */
  function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  /**
   * Show error in the card.
   * @param {HTMLElement} card - The card container
   * @param {string} errorType - "not_found", "rate_limited", "network_error"
   */
  function showError(card, errorType) {
    const loading = card.querySelector('.cd-github-card-loading');
    const content = card.querySelector('.cd-github-card-content');
    const error = card.querySelector('.cd-github-card-error');
    const errorText = error.querySelector('.cd-github-card-error-text');
    const errorIcon = error.querySelector('.cd-github-card-error-icon');

    loading.hidden = true;
    content.hidden = true;
    error.hidden = false;

    // Set appropriate error message
    switch (errorType) {
      case 'not_found':
        errorText.textContent = 'Repository or resource not found.';
        break;
      case 'rate_limited':
        errorText.textContent = 'GitHub API rate limit exceeded. Please try again later.';
        break;
      default:
        errorText.textContent = 'Could not load GitHub data. Please check your connection.';
    }
  }

  /**
   * Initialize a single GitHub card.
   * @param {HTMLElement} card
   */
  async function initCard(card) {
    const owner = card.dataset.ghOwner;
    const repo = card.dataset.ghRepo;
    const ghType = card.dataset.ghType; // "repo", "issues", "pulls"
    const number = card.dataset.ghNumber;
    const loading = card.querySelector('.cd-github-card-loading');
    const content = card.querySelector('.cd-github-card-content');

    try {
      let data;
      if (ghType === 'repo') {
        // Fetch repo data
        data = await fetchGitHubAPI(`/repos/${owner}/${repo}`);
        renderRepoCard(data, content);
      } else {
        // Fetch issue/PR data
        data = await fetchGitHubAPI(`/repos/${owner}/${repo}/${ghType}/${number}`);
        const itemType = ghType === 'pulls' ? 'pull' : 'issue';
        renderIssueCard(data, itemType, content);
      }

      // Show content, hide loading
      loading.hidden = true;
      content.hidden = false;
    } catch (err) {
      console.error('[GitHub Card] Failed to load:', err.message);
      showError(card, err.message);
    }
  }

  /**
   * Initialize all GitHub cards on the page.
   */
  function init() {
    const cards = document.querySelectorAll(CARD_SELECTOR);
    if (!cards.length) return;

    cards.forEach((card) => {
      initCard(card);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
