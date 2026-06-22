/* =================================================================
   project.js  —  runs only on project.html
   -----------------------------------------------------------------
   1. Reads the ?slug=... value from the URL
   2. Finds that project in data/projects.json
   3. Builds the whole detail page from the data:
        - title, meta, summary
        - design logic (paragraphs)
        - design decisions (decision -> rationale)
        - calculations (rendered as real maths with KaTeX)
        - image gallery (with click-to-zoom lightbox)
        - optional 3D model viewer (only loaded if a model URL exists)
        - download buttons, grouped by SOLIDWORKS / Ansys / other
   4. Updates the page <title> and meta description for SEO/sharing

   KaTeX is loaded by project.html (a script tag in that page). We use
   it here to turn LaTeX strings into formatted equations.
   ================================================================= */
(function () {
  "use strict";

  var root = document.getElementById("project-root");
  if (!root) return; // Not on the project detail page.

  var esc  = window.Site.escapeHtml;
  var slug = window.Site.getParam("slug");

  /* ---- Render a friendly message if something is wrong ---------- */
  function showMessage(title, body) {
    root.innerHTML =
      '<div class="state state--error">' +
        "<h1>" + esc(title) + "</h1>" +
        "<p>" + body + "</p>" +
        '<p><a class="btn btn--primary" href="projects.html">Back to all projects</a></p>' +
      "</div>";
  }

  if (!slug) {
    showMessage("No project selected", "This page needs a project to show. Please return to the gallery and pick one.");
    return;
  }

  /* ---- Turn one calculation object into HTML ------------------- */
  function calcHtml(c, index) {
    // IDs let us target each equation span for KaTeX after insertion.
    var eqId  = "eq-" + index;
    var resId = "res-" + index;
    return (
      '<div class="calc">' +
        (c.title ? '<h3 class="calc__title">' + esc(c.title) + "</h3>" : "") +
        (c.description ? '<p class="calc__desc">' + esc(c.description) + "</p>" : "") +
        (c.equation ? '<div class="calc__eq" id="' + eqId + '" data-tex="' + esc(c.equation) + '"></div>' : "") +
        (c.result ? '<div class="calc__result" id="' + resId + '" data-tex="' + esc(c.result) + '"></div>' : "") +
        (c.note ? '<p class="calc__note">' + esc(c.note) + "</p>" : "") +
      "</div>"
    );
  }

  /* ---- Turn the files[] array into grouped download buttons ---- */
  function downloadsHtml(files) {
    if (!files || !files.length) {
      return '<p class="text-muted">Downloadable files will be added here.</p>';
    }
    // Group the files by category, preserving a sensible order.
    var order = ["SOLIDWORKS", "Ansys", "other"];
    var groups = { SOLIDWORKS: [], Ansys: [], other: [] };
    files.forEach(function (f) {
      var key = groups[f.category] ? f.category : "other";
      groups[key].push(f);
    });

    var fileIcon =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
      '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>' +
      '<path d="M12 11v6M9 14l3 3 3-3"/></svg>';

    return order.map(function (cat) {
      var items = groups[cat];
      if (!items.length) return "";
      var label = cat === "other" ? "Other files" : cat;
      var buttons = items.map(function (f) {
        return (
          '<a class="dl" href="' + esc(f.url) + '" ' +
             'download rel="noopener" ' +
             'aria-label="Download ' + esc(f.label) + (f.size ? ", " + esc(f.size) : "") + '">' +
            '<span class="dl__icon">' + fileIcon + "</span>" +
            '<span class="dl__text">' +
              '<span class="dl__label">' + esc(f.label) + "</span>" +
              (f.size ? '<span class="dl__size">' + esc(f.size) + "</span>" : "") +
            "</span>" +
          "</a>"
        );
      }).join("");

      return (
        '<div class="downloads__group downloads__group--' + cat.toLowerCase() + '">' +
          '<span class="downloads__group-label"><span class="dot"></span>' + esc(label) + "</span>" +
          buttons +
        "</div>"
      );
    }).join("");
  }

  /* ---- Build the full page from a project object --------------- */
  function render(p) {
    // ---- SEO / social: update the document title + description ----
    document.title = p.title + " · Ananth Bandari";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && p.summary) metaDesc.setAttribute("content", p.summary);

    // ---- Meta line (role / tools / date) ----
    var metaBits = [];
    if (p.role) metaBits.push("<span>" + esc(p.role) + "</span>");
    if (p.tools && p.tools.length) metaBits.push("<span>" + esc(p.tools.join(" · ")) + "</span>");
    if (p.date) metaBits.push("<span>" + esc(p.date) + "</span>");

    var tagsHtml = (p.tags || []).map(function (t) {
      return '<li class="tag">' + esc(t) + "</li>";
    }).join("");

    // ---- Design logic: an array of paragraphs (or a single string) ----
    var logic = Array.isArray(p.designLogic) ? p.designLogic : (p.designLogic ? [p.designLogic] : []);
    var logicHtml = logic.map(function (para) { return "<p>" + esc(para) + "</p>"; }).join("");

    // ---- Design decisions: decision + rationale pairs ----
    var decisionsHtml = (p.designDecisions || []).map(function (d) {
      return (
        "<li>" +
          '<span class="decision">' + esc(d.decision) + "</span>" +
          '<p class="rationale">' + esc(d.rationale) + "</p>" +
        "</li>"
      );
    }).join("");

    // ---- Calculations ----
    var calcsHtml = (p.calculations || []).map(calcHtml).join("");

    // ---- Image gallery ----
    var galleryHtml = (p.images || []).map(function (im) {
      return (
        "<figure>" +
          '<img src="' + esc(im.src) + '" alt="' + esc(im.alt || "") + '" ' +
               'loading="lazy" decoding="async" data-zoom="' + esc(im.src) + '">' +
          (im.caption ? "<figcaption>" + esc(im.caption) + "</figcaption>" : "") +
        "</figure>"
      );
    }).join("");

    // ---- Assemble the page ----
    root.innerHTML =
      '<a class="detail__back" href="projects.html">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>' +
        "All projects</a>" +

      '<div class="detail__header">' +
        '<ul class="tags">' + tagsHtml + "</ul>" +
        "<h1>" + esc(p.title) + "</h1>" +
        (metaBits.length ? '<div class="detail__meta">' + metaBits.join("") + "</div>" : "") +
        '<p class="hero__lead">' + esc(p.summary || "") + "</p>" +
      "</div>" +

      '<div class="detail__layout">' +
        '<div class="detail__content">' +

          (galleryHtml
            ? '<section><h2>Renders &amp; results</h2><div class="gallery">' + galleryHtml + "</div></section>"
            : "") +

          // The 3D viewer is injected here later, only if a model exists.
          '<section id="model-section" hidden><h2>Interactive 3D model</h2>' +
            '<p class="text-muted">Drag to rotate · scroll to zoom.</p>' +
            '<div id="model-mount"></div></section>' +

          (logicHtml
            ? '<section><h2>Design logic</h2><div class="prose stack">' + logicHtml + "</div></section>"
            : "") +

          (decisionsHtml
            ? '<section><h2>Key design decisions</h2><ul class="decisions">' + decisionsHtml + "</ul></section>"
            : "") +

          (calcsHtml
            ? '<section><h2>Engineering calculations</h2>' + calcsHtml + "</section>"
            : "") +

        "</div>" +

        '<aside class="downloads">' +
          '<div class="downloads__card">' +
            "<h2>Download files</h2>" +
            '<p class="text-muted" style="font-size:.88rem;margin-bottom:0">' +
              "SOLIDWORKS &amp; Ansys source files. Large files are hosted on GitHub Releases / Cloudflare R2." +
            "</p>" +
            downloadsHtml(p.files) +
          "</div>" +
        "</aside>" +
      "</div>";

    // ---- After the HTML is in the DOM, render the maths ----------
    renderMath();

    // ---- Lazily load the 3D viewer only when a model is provided -
    if (p.model) loadModelViewer(p.model, p.title);

    // ---- Wire up the image lightbox ------------------------------
    initLightbox();
  }

  /* ---- KaTeX: render every [data-tex] element ------------------ */
  function renderMath() {
    if (typeof katex === "undefined") return; // CDN blocked/offline
    document.querySelectorAll("[data-tex]").forEach(function (el) {
      try {
        katex.render(el.getAttribute("data-tex"), el, {
          displayMode: true,
          throwOnError: false
        });
      } catch (e) {
        el.textContent = el.getAttribute("data-tex"); // graceful fallback
      }
    });
    // Also catch any inline $...$ maths inside descriptions/notes.
    if (typeof renderMathInElement === "function") {
      renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "$",  right: "$",  display: false },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    }
  }

  /* ---- 3D model viewer (Google's <model-viewer> web component) --
     We inject the component script only here, so visitors to projects
     WITHOUT a 3D model never download it. Supports .glb / .gltf. */
  function loadModelViewer(url, title) {
    var section = document.getElementById("model-section");
    var mount = document.getElementById("model-mount");
    if (!section || !mount) return;
    section.hidden = false;

    function mountViewer() {
      var mv = document.createElement("model-viewer");
      mv.setAttribute("src", url);
      mv.setAttribute("alt", "Interactive 3D model of " + (title || "the part"));
      mv.setAttribute("camera-controls", "");
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("shadow-intensity", "1");
      mv.setAttribute("loading", "lazy");
      mv.setAttribute("reveal", "auto");
      mount.appendChild(mv);
    }

    if (window.customElements && customElements.get("model-viewer")) {
      mountViewer();
    } else {
      var s = document.createElement("script");
      s.type = "module";
      s.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
      s.onload = mountViewer;
      s.onerror = function () { section.hidden = true; };
      document.head.appendChild(s);
    }
  }

  /* ---- Minimal, accessible image lightbox ---------------------- */
  function initLightbox() {
    var triggers = root.querySelectorAll("[data-zoom]");
    if (!triggers.length) return;

    // Build the overlay once and reuse it.
    var box = document.getElementById("lightbox");
    if (!box) {
      box = document.createElement("div");
      box.id = "lightbox";
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Enlarged image");
      box.innerHTML =
        '<button type="button" class="lightbox__close" aria-label="Close image">&times;</button>' +
        '<img src="" alt="">';
      document.body.appendChild(box);
    }
    var boxImg = box.querySelector("img");
    var closeBtn = box.querySelector(".lightbox__close");
    var lastFocused = null;

    function open(src, alt) {
      lastFocused = document.activeElement;
      boxImg.src = src;
      boxImg.alt = alt || "";
      box.classList.add("is-open");
      closeBtn.focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      box.classList.remove("is-open");
      boxImg.src = "";
      document.removeEventListener("keydown", onKey);
      if (lastFocused) lastFocused.focus();
    }
    function onKey(e) { if (e.key === "Escape") close(); }

    triggers.forEach(function (img) {
      img.addEventListener("click", function () {
        open(img.getAttribute("data-zoom"), img.getAttribute("alt"));
      });
    });
    closeBtn.addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
  }

  /* ---- Load data, find the project, render --------------------- */
  root.innerHTML = '<p class="state">Loading project…</p>';

  window.Site.loadProjects()
    .then(function (projects) {
      var project = projects.filter(function (p) { return p.slug === slug; })[0];
      if (!project) {
        showMessage("Project not found",
          "There is no project with the name “" + esc(slug) + "”. It may have been renamed.");
        return;
      }
      render(project);
    })
    .catch(function (err) {
      console.error(err);
      showMessage("Couldn’t load this project",
        "If you opened the file by double-clicking it, run a local web server instead " +
        "(see the README). On the live site this works automatically.");
    });
})();
