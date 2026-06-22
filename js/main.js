/* =================================================================
   main.js  —  runs on every page
   -----------------------------------------------------------------
   Responsibilities:
     1. Theme (dark/light) toggle, remembered in localStorage
     2. Mobile navigation (hamburger) open/close
     3. Highlight the current page in the nav
     4. Fill in the current year in the footer
     5. A couple of tiny shared helpers other scripts reuse

   This file is plain, old-fashioned JavaScript (no build step, no
   framework). That keeps the site dependency-free and means you can
   open any .js file and read exactly what runs.
   ================================================================= */
(function () {
  "use strict";

  /* ---------- 1. THEME TOGGLE ------------------------------------
     The <head> of every page runs a tiny inline script FIRST that
     sets data-theme before the page paints (so there is no white
     flash in dark mode). Here we just wire up the click handler and
     keep the choice in localStorage. */
  var root = document.documentElement;

  function applyTheme(theme) {
    // theme is "dark", "light", or null (= follow the OS setting)
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function currentTheme() {
    // What is actually showing right now?
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
      themeToggle.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    });
  }

  /* ---------- 2. MOBILE NAV --------------------------------------- */
  var navToggle = document.querySelector(".nav__toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after a link is tapped (nice on phones)
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3. HIGHLIGHT CURRENT PAGE --------------------------
     Compare each nav link's filename to the page we're on and mark a
     match with aria-current="page" (CSS styles that state). */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    var target = a.getAttribute("href");
    if (!target) return;
    var file = target.split("/").pop() || "index.html";
    // project.html is a child of the Projects section, so light up "Projects" there too
    if (file === here || (here === "project.html" && file === "projects.html")) {
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---------- 4. FOOTER YEAR -------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 5. SHARED HELPERS ----------------------------------
     Exposed on window.Site so projects.js and project.js can reuse
     them without duplicating code. */
  window.Site = {
    // Safely turn user text into HTML-escaped text (prevents broken
    // markup if a project summary ever contains < or &).
    escapeHtml: function (value) {
      var div = document.createElement("div");
      div.textContent = value == null ? "" : String(value);
      return div.innerHTML;
    },
    // Read a query-string value, e.g. getParam("slug") on project.html
    getParam: function (name) {
      return new URLSearchParams(location.search).get(name);
    },
    // Fetch and parse the projects data file. Returns a Promise of an
    // array. Centralised here so both list and detail pages agree on
    // the path and error handling.
    loadProjects: function () {
      return fetch("data/projects.json", { cache: "no-cache" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          return Array.isArray(data) ? data : data.projects || [];
        });
    }
  };

  // Mark the body ready (used for a gentle fade-in if you want one).
  document.body.classList.add("ready");
})();
