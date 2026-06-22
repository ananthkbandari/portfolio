/* =================================================================
   projects.js  —  runs only on projects.html
   -----------------------------------------------------------------
   Reads data/projects.json (via Site.loadProjects) and:
     1. Renders a card for every project into the gallery grid
     2. Provides a live keyword search box
     3. Provides clickable tag filters
   Add a project by editing the JSON only — this file never changes.
   ================================================================= */
(function () {
  "use strict";

  var grid     = document.getElementById("project-grid");
  var searchEl = document.getElementById("project-search");
  var tagBar   = document.getElementById("tag-filter");
  var countEl  = document.getElementById("result-count");
  if (!grid) return; // Not on the projects page.

  var ALL = [];            // every project from the JSON
  var activeTag = "All";   // currently selected tag filter
  var query = "";          // current search text (lowercased)

  /* ---- Build one project card's HTML --------------------------- */
  function cardHtml(p) {
    var esc = window.Site.escapeHtml;
    var href = "project.html?slug=" + encodeURIComponent(p.slug);

    // Show up to three tags on the card to keep it tidy.
    var tags = (p.tags || []).slice(0, 3).map(function (t) {
      return '<li class="tag">' + esc(t) + "</li>";
    }).join("");

    // width/height hints + lazy loading prevent layout shift and
    // defer off-screen images for speed.
    var img = p.cover
      ? '<img src="' + esc(p.cover) + '" alt="" loading="lazy" decoding="async" width="640" height="400">'
      : "";

    return (
      '<article class="card">' +
        '<a href="' + href + '" aria-label="Open project: ' + esc(p.title) + '">' +
          '<div class="card__media">' + img + "</div>" +
        "</a>" +
        '<div class="card__body">' +
          '<ul class="tags">' + tags + "</ul>" +
          '<h3 class="card__title"><a href="' + href + '">' + esc(p.title) + "</a></h3>" +
          '<p class="card__summary">' + esc(p.summary || "") + "</p>" +
          '<div class="card__footer">' +
            '<a class="btn btn--ghost" href="' + href + '">View project ' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
            "</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* ---- Decide which projects match search + tag ---------------- */
  function matches(p) {
    var tagOk = activeTag === "All" || (p.tags || []).indexOf(activeTag) !== -1;
    if (!tagOk) return false;
    if (!query) return true;
    // Search across title, summary and tags.
    var haystack = [p.title, p.summary, (p.tags || []).join(" ")]
      .join(" ").toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  /* ---- Render the grid for the current filters ----------------- */
  function render() {
    var list = ALL.filter(matches);

    if (countEl) {
      countEl.textContent =
        list.length + (list.length === 1 ? " project" : " projects");
    }

    if (list.length === 0) {
      grid.innerHTML =
        '<p class="state">No projects match your search. Try a different keyword or tag.</p>';
      return;
    }
    grid.innerHTML = list.map(cardHtml).join("");
  }

  /* ---- Build the tag filter buttons ---------------------------- */
  function buildTagBar() {
    if (!tagBar) return;
    var set = {};
    ALL.forEach(function (p) {
      (p.tags || []).forEach(function (t) { set[t] = true; });
    });
    var tags = ["All"].concat(Object.keys(set).sort());

    tagBar.innerHTML = tags.map(function (t) {
      var pressed = t === activeTag ? "true" : "false";
      var cls = t === activeTag ? "tag tag--accent" : "tag";
      return (
        '<button type="button" class="' + cls + '" data-tag="' +
        window.Site.escapeHtml(t) + '" aria-pressed="' + pressed + '">' +
        window.Site.escapeHtml(t) + "</button>"
      );
    }).join("");

    tagBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-tag]");
      if (!btn) return;
      activeTag = btn.getAttribute("data-tag");
      buildTagBar();   // re-render to move the highlight
      render();
    });
  }

  /* ---- Wire up the search box ---------------------------------- */
  if (searchEl) {
    searchEl.addEventListener("input", function () {
      query = searchEl.value.trim().toLowerCase();
      render();
    });
  }

  /* ---- Load data and go ---------------------------------------- */
  grid.innerHTML = '<p class="state">Loading projects…</p>';

  window.Site.loadProjects()
    .then(function (projects) {
      ALL = projects;
      buildTagBar();
      render();
    })
    .catch(function (err) {
      console.error(err);
      // The most common cause for a beginner is opening index.html by
      // double-clicking (file://), where fetch() is blocked. Tell them
      // the fix in plain language.
      grid.innerHTML =
        '<div class="state state--error">' +
          "<p><strong>Couldn’t load the projects.</strong></p>" +
          "<p>If you opened the file by double-clicking it, run a local " +
          "web server instead (see the README, “Run the site locally”). " +
          "On the live GitHub Pages site this works automatically.</p>" +
        "</div>";
    });
})();
