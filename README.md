# Ananth Bandari — Mechanical Design & Simulation Portfolio

A fast, accessible, **static** portfolio website for showcasing SOLIDWORKS CAD
models, assemblies, and Ansys analyses — with the design reasoning, the
calculations, renders, and **downloadable source files** for every project.

- **No backend, no database, no server.** Just HTML, CSS, and vanilla JavaScript.
- **Data-driven.** Every project lives in one file: [`data/projects.json`](data/projects.json).
  You add a project by editing data — never by writing new HTML.
- **Free to host.** GitHub Pages serves the site; big CAD/FEA files live on
  GitHub Releases (≤ 2 GB each) or Cloudflare R2 (for anything bigger).
- **Spike-proof by design.** Nothing here scales cost with visitors. See
  [“What could ever cost money”](#11-what-could-ever-cost-money-and-the-early-warning-signs).

> **New to all this?** Read top to bottom once. Every command is copy-paste ready.
> You don’t need to be a developer.

---

## Table of contents

1. [What’s in here (file tree)](#1-whats-in-here-file-tree)
2. [Before you go live — a 5-minute checklist](#2-before-you-go-live--a-5-minute-checklist)
3. [Run the site on your own computer](#3-run-the-site-on-your-own-computer)
4. [Put it on the internet (GitHub Pages)](#4-put-it-on-the-internet-github-pages)
5. [Point www.ananthbandari.bio at it (custom domain + HTTPS)](#5-point-wwwananthbandaribio-at-it-custom-domain--https)
6. [Upload big files to a GitHub Release and get their URLs](#6-upload-big-files-to-a-github-release-and-get-their-urls)
7. [Cloudflare R2 (only for files over 2 GB)](#7-cloudflare-r2-only-for-files-over-2-gb)
8. [Add a new project (the repeatable routine)](#8-add-a-new-project-the-repeatable-routine)
9. [Optional extras (contact form, 3D models, search)](#9-optional-extras)
10. [Design decisions, briefly](#10-design-decisions-briefly)
11. [What could ever cost money (and the early warning signs)](#11-what-could-ever-cost-money-and-the-early-warning-signs)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. What’s in here (file tree)

```
Portfolio Website/
├── index.html              # Home / About
├── projects.html           # Projects gallery (search + tag filter)
├── project.html            # ONE detail page that renders any project (?slug=...)
├── resume.html             # Résumé / CV + PDF download button
├── contact.html            # Email, LinkedIn, optional contact form
├── 404.html                # Friendly "page not found"
│
├── data/
│   └── projects.json       # ⭐ YOUR PROJECT DATABASE — edit this to add projects
│
├── css/
│   └── styles.css          # All styling (one file, commented, light + dark theme)
│
├── js/
│   ├── main.js             # Shared: theme toggle, mobile menu, nav highlight
│   ├── projects.js         # Builds the gallery + search/filter
│   └── project.js          # Builds a project detail page + maths + 3D viewer
│
├── assets/
│   ├── img/
│   │   ├── favicon.svg              # Browser tab icon
│   │   ├── og-image.svg             # Social-share card (export a PNG — see checklist)
│   │   ├── profile.svg             # Your portrait placeholder (replace with a photo)
│   │   └── projects/               # Project images/renders (SVG placeholders for now)
│   ├── models/             # OPTIONAL .glb 3D models (see assets/models/README.txt)
│   └── resume/             # Put Ananth-Bandari-Resume.pdf here
│
├── CNAME                   # Tells GitHub Pages your domain is www.ananthbandari.bio
├── .nojekyll               # Tells GitHub Pages to serve files as-is (no Jekyll)
├── .gitignore              # Stops huge CAD/FEA files being committed by accident
├── robots.txt              # Lets search engines in; points to the sitemap
├── sitemap.xml             # Helps search engines find your pages
├── site.webmanifest        # App name/icon metadata
└── README.md               # This file
```

---

## 2. Before you go live — a 5-minute checklist

These are the only spots with placeholders. Search-and-replace, then you’re done.
Each is harmless if you skip it — the site still works — but do them for a polished result.

- [ ] **Résumé PDF.** Save your CV as `assets/resume/Ananth-Bandari-Resume.pdf`
      (then delete `assets/resume/PUT-YOUR-RESUME-PDF-HERE.txt`).
- [x] **GitHub profile link — already done.** The footer links point to
      `https://github.com/ananthkbandari`. Change it only if you want a
      different profile URL.
- [ ] **Your photo.** Replace `assets/img/profile.svg` with a real square photo
      (e.g. `profile.jpg`) and update the `<img src="...">` in `index.html`.
- [x] **Social-share image — already done.** A ready `assets/img/og-image.png`
      (1200×630) is included, and the pages point at it, so LinkedIn/X link
      previews work immediately. Only redo this if you edit `og-image.svg`: open
      the SVG in your browser and screenshot it, or use a free converter like
      <https://cloudconvert.com/svg-to-png> (width 1200, height 630).
- [ ] **Check the skills wording.** I added a “Design & Simulation” skill group
      (SOLIDWORKS, Ansys, FEA…) to match this portfolio’s focus — your résumé
      didn’t list those explicitly. Adjust the text in `index.html` and
      `resume.html` so it’s accurate to you.
- [ ] **Sample projects.** The two projects in `data/projects.json` are examples
      with placeholder download URLs (`REPLACE_ME`). Replace them with your real
      projects (see [section 8](#8-add-a-new-project-the-repeatable-routine)).
- [ ] *(Optional)* **Contact form.** Off by default. Turn on in
      [section 9](#9-optional-extras) if you want it.

---

## 3. Run the site on your own computer

> **Important:** don’t just double-click `index.html`. Browsers block JavaScript
> from reading local files (`projects.json` won’t load and the gallery stays
> empty). You need a tiny local web server — it’s one command. On the live
> GitHub Pages site this is automatic, so this only matters for previewing.

### Option A — Python (already on most computers)

Open a terminal **in this folder** and run:

```bash
# If you have Python 3 (check with: python --version)
python -m http.server 8000
```

Then open **<http://localhost:8000>** in your browser. Press `Ctrl + C` to stop.

> On some systems the command is `python3` instead of `python`.

### Option B — VS Code “Live Server” (nice for editing)

1. Install [VS Code](https://code.visualstudio.com/) (free).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Open this folder in VS Code, right-click `index.html` → **“Open with Live Server.”**
   It opens a browser and auto-refreshes when you save.

### Option C — Node (if you already have it)

```bash
npx serve
```

---

## 4. Put it on the internet (GitHub Pages)

You’ll create a free GitHub account + repository, upload these files, and turn on
Pages. No payment method required, ever.

### 4.1 Create the repository

1. Sign up / sign in at <https://github.com>.
2. Click **New repository** (the green button).
3. Name it anything (e.g. `portfolio`). Set it **Public**. Don’t add a README
   (you already have one). Click **Create repository**.

### 4.2 Upload the files — pick one way

**Easiest (drag-and-drop, no tools):**
1. On the empty repo page, click **“uploading an existing file.”**
2. Drag in **everything inside this folder** (all files and folders).
3. Scroll down, click **Commit changes**.

**Or with Git (if you’re comfortable):**

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/ananthkbandari/portfolio.git
git push -u origin main
```

### 4.3 Turn on Pages

1. In the repo: **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **“Deploy from a branch.”**
3. Branch: **`main`**, folder: **`/ (root)`**. Click **Save**.
4. Wait ~1 minute. The page shows a link like
   `https://ananthkbandari.github.io/portfolio/`. Open it — your site is live. 🎉

> If images/styles look broken on `username.github.io/portfolio/`, don’t worry —
> that’s because the site expects to live at the **root** of a domain. Once you
> attach your custom domain (next section), everything resolves correctly.

---

## 5. Point www.ananthbandari.bio at it (custom domain + HTTPS)

You own `ananthbandari.bio`. We’ll make **`www.ananthbandari.bio`** the main
address and have the bare `ananthbandari.bio` redirect to it. The `CNAME` file in
this repo already contains `www.ananthbandari.bio`, so GitHub knows your domain.

### 5.1 Add DNS records at your domain registrar

Log in wherever you bought the domain (the place you manage DNS) and add these
records. There are two groups: one **CNAME** for `www`, and four **A** + four
**AAAA** records for the bare domain (the “apex”/“root”).

**For the `www` subdomain → CNAME:**

| Type  | Name (Host) | Value (Target)            |
| ----- | ----------- | ------------------------- |
| CNAME | `www`       | `ananthkbandari.github.io` |

> Replace `ananthkbandari` with your GitHub username. Note: **no `https://`,
> no trailing slash** — just `yourusername.github.io`.

**For the apex/root `ananthbandari.bio` → A records (IPv4):**

| Type | Name (Host)   | Value             |
| ---- | ------------- | ----------------- |
| A    | `@` (or root) | `185.199.108.153` |
| A    | `@`           | `185.199.109.153` |
| A    | `@`           | `185.199.110.153` |
| A    | `@`           | `185.199.111.153` |

**And the matching AAAA records (IPv6) — recommended:**

| Type | Name (Host) | Value                   |
| ---- | ----------- | ----------------------- |
| AAAA | `@`         | `2606:50c0:8000::153`   |
| AAAA | `@`         | `2606:50c0:8001::153`   |
| AAAA | `@`         | `2606:50c0:8002::153`   |
| AAAA | `@`         | `2606:50c0:8003::153`   |

> **Using Cloudflare for DNS?** (You will have a Cloudflare account if you use R2.)
> You can manage `ananthbandari.bio`’s DNS there. Add the same records, **but set
> them to “DNS only” (grey cloud, not orange)** at first so GitHub can issue your
> HTTPS certificate. Cloudflare also supports a CNAME on the apex (“CNAME
> flattening”), so instead of the A/AAAA rows you may add a single
> `CNAME  @  →  ananthkbandari.github.io`. Once HTTPS works you can switch the
> cloud to orange with SSL mode **Full (strict)** if you want Cloudflare’s CDN.

### 5.2 Tell GitHub the custom domain

1. Repo **Settings → Pages → Custom domain**.
2. Enter **`www.ananthbandari.bio`** and click **Save**.
   (This matches the `CNAME` file already in the repo.)
3. GitHub runs a DNS check. It can take anywhere from a few minutes to ~24 hours
   for DNS to propagate — be patient if it’s not instant.

### 5.3 Enable HTTPS

1. Once the DNS check passes, GitHub automatically requests a free SSL
   certificate (Let’s Encrypt). This can take a little while after the domain
   verifies.
2. When the **“Enforce HTTPS”** checkbox on the Pages settings becomes available,
   **tick it**. Now visitors always get the secure `https://` version.

That’s it. `https://www.ananthbandari.bio` serves your site, and
`ananthbandari.bio` redirects to it.

---

## 6. Upload big files to a GitHub Release and get their URLs

This is where your SOLIDWORKS parts/assemblies and Ansys archives live. GitHub
Releases are **free**, allow **up to 2 GB per file**, and **don’t bill for
downloads**. The files are *attached to your repo as a release*, not committed
into it — so your site stays small and fast.

### Steps

1. In your repo, click **Releases** (right sidebar) → **“Draft a new release.”**
2. **Choose a tag** → type a new tag like `v1.0` → “Create new tag on publish.”
3. Give it a title (e.g. `Project files v1.0`).
4. **Drag your files** into the “Attach binaries” box at the bottom
   (`.SLDPRT`, `.SLDASM`, `.wbpz`, drawings, etc.). Wait for each to finish
   uploading. *(For a folder/assembly, zip it first.)*
5. Click **Publish release**.
6. **Copy each file’s download URL:** right-click the attached file → **“Copy
   link address.”** It looks like:

   ```
   https://github.com/ananthkbandari/portfolio/releases/download/v1.0/go-kart-knuckle.SLDPRT
   ```

7. Paste that URL into the matching `"url"` field in `data/projects.json`
   (see [section 8](#8-add-a-new-project-the-repeatable-routine)).

> **Tip:** You can keep adding files to the *same* release later, or make a new
> release per project (e.g. `knuckle-v1`, `arm-v1`). Either is fine.

---

## 7. Cloudflare R2 (only for files over 2 GB)

Most CAD/FEA files fit comfortably under GitHub’s 2 GB limit, so **you may never
need this.** Use R2 only for a single file bigger than 2 GB, or if you outgrow
Releases. R2’s key property: **downloads (egress) are always free**, so traffic
can’t bill you.

### 7.1 Create a bucket

1. Sign up at <https://dash.cloudflare.com>. R2 requires a **card on file**
   (but see [section 11](#11-what-could-ever-cost-money-and-the-early-warning-signs)
   — downloads are free, so a traffic spike can’t charge you).
2. In the dashboard sidebar: **R2 → Create bucket**. Name it e.g. `portfolio-files`.

### 7.2 Upload files

- Open the bucket → **Upload** → drag your large file(s) in.

### 7.3 Make objects publicly downloadable + get a stable URL

Pick **one** of these:

**A) Quick — the free `r2.dev` public URL:**
1. Bucket → **Settings → Public access → R2.dev subdomain → “Allow Access.”**
2. Cloudflare gives the bucket a public address like
   `https://pub-abc123....r2.dev`.
3. A file’s stable URL is that address + `/` + the file name, e.g.
   `https://pub-abc123.r2.dev/quadcopter-arm-topology.wbpz`.
4. Paste it into the `"url"` field in `projects.json`.

**B) Nicer — a custom domain (e.g. `files.ananthbandari.bio`):**
1. Bucket → **Settings → Custom Domains → Connect Domain.**
2. Enter a subdomain like `files.ananthbandari.bio`. Cloudflare adds the DNS
   record for you (your domain must be on Cloudflare DNS for this).
3. Your stable URLs become `https://files.ananthbandari.bio/your-file.wbpz`.

### 7.4 Turn on usage alerts (so you’re never surprised)

1. Cloudflare dashboard → **Notifications** (under **Manage Account**) → **Add.**
2. Find the **R2** product notifications and create one for **storage usage**
   (e.g. notify me when storage reaches **8 GB**, comfortably under the 10 GB
   free tier).
3. Save. Cloudflare emails you before you’d ever reach a paid threshold.

---

## 8. Add a new project (the repeatable routine)

This is the whole point of the site: **add projects by editing one file.** No new
HTML, no code. Here’s the loop you’ll repeat every time.

### Step 1 — Host the big files, copy their URLs
- Files ≤ 2 GB → attach to a **GitHub Release** ([section 6](#6-upload-big-files-to-a-github-release-and-get-their-urls)) and copy each link.
- Any file > 2 GB → **Cloudflare R2** ([section 7](#7-cloudflare-r2-only-for-files-over-2-gb)) and copy each link.

### Step 2 — Add your images
- Put optimised renders/screenshots in `assets/img/projects/`.
- **Optimise first** so pages stay fast: resize to ~1600 px wide max and compress
  with a free tool like <https://squoosh.app> (aim for under ~300 KB each).
  Note each image’s path, e.g. `assets/img/projects/my-part-cover.jpg`.

### Step 3 — Add one entry to `data/projects.json`
Open `data/projects.json`. Copy an existing `{ ... }` block (everything between
and including the curly braces), paste it as a **new item at the top** of the
`"projects": [ ... ]` list, add a comma between blocks, and edit the values.

Here is the shape of one project, with every field explained:

```jsonc
{
  "title": "My New Part",                 // Shown as the heading
  "slug": "my-new-part",                  // URL id: lowercase-with-dashes, UNIQUE
  "summary": "One or two sentences for the card and the top of the page.",
  "cover": "assets/img/projects/my-part-cover.jpg",  // the card thumbnail
  "tags": ["SOLIDWORKS", "Ansys", "Sheet Metal"],    // used by search + filters
  "tools": ["SOLIDWORKS 2024", "Ansys Mechanical"],  // optional meta line
  "role": "Design + FEA",                            // optional meta line
  "date": "2025",                                     // optional meta line

  "designLogic": [
    "First paragraph of how you approached the design.",
    "Second paragraph (add as many as you like)."
  ],

  "designDecisions": [
    { "decision": "What you chose.", "rationale": "Why you chose it." },
    { "decision": "Another choice.", "rationale": "The reasoning." }
  ],

  "calculations": [
    {
      "title": "Bending stress check",
      "description": "Plain-English setup for the equation.",
      "equation": "\\sigma = \\frac{M c}{I}",          // LaTeX (see note below)
      "result":   "\\sigma \\approx 84\\ \\text{MPa}", // optional highlighted line
      "note": "What the number means / safety factor."
    }
  ],

  "images": [
    { "src": "assets/img/projects/my-part-1.jpg", "alt": "Describe it for accessibility", "caption": "Optional caption" }
  ],

  "model": "",   // optional .glb URL for an in-browser 3D viewer; "" = none

  "files": [
    { "label": "Part (.SLDPRT)",  "category": "SOLIDWORKS", "size": "5 MB",  "url": "https://github.com/.../my-part.SLDPRT" },
    { "label": "FEA (.wbpz)",     "category": "Ansys",      "size": "60 MB", "url": "https://github.com/.../my-part.wbpz" },
    { "label": "Drawing (.PDF)",  "category": "other",      "size": "300 KB","url": "https://github.com/.../my-part.pdf" }
  ]
}
```

**The one gotcha — equations and backslashes.** Equations use LaTeX. Because this
is a JSON file, **every backslash must be doubled.** So LaTeX `\frac{M c}{I}`
becomes `"\\frac{M c}{I}"` in the file. If maths doesn’t show up, a single
backslash is almost always the reason. (You don’t need `$...$` around it — the
`equation` and `result` fields are rendered as maths automatically.)

**`category` must be one of:** `"SOLIDWORKS"`, `"Ansys"`, or `"other"`. The
download buttons are grouped and colour-coded by this.

### Step 4 — Check it, then publish
1. Preview locally ([section 3](#3-run-the-site-on-your-own-computer)) and click into the new project.
2. If JSON looks broken, paste the file into <https://jsonlint.com> — it points to
   the exact line. (Common slips: a missing comma between blocks, or a trailing
   comma after the last item.)
3. Commit & push (or drag-drop the changed files on GitHub). **Pages redeploys
   automatically** in ~1 minute.

That’s the whole routine. Unlimited projects, unlimited download links per
project — all from this one file.

---

## 9. Optional extras

### Turn on the contact form
The Contact page has a ready-made form that needs **no server**, powered by the
free tier of **Formspree**:
1. Sign up at <https://formspree.io> (free).
2. Create a new form; it gives you an endpoint like
   `https://formspree.io/f/abcwxyz`.
3. In `contact.html`, find `action="https://formspree.io/f/your-form-id"` and
   replace `your-form-id` with your real id.
4. Submit the form once yourself to confirm/verify it. Done — messages now arrive
   in your email. (A hidden “honeypot” field is already included to reduce spam.)

If you’d rather keep it simple, just delete the form block and rely on the email
button + LinkedIn link.

### Add an interactive 3D model to a project
See `assets/models/README.txt`. In short: export your part as a **`.glb`**,
host it (in the repo if small, or on a Release if large), and set the project’s
`"model"` field to that URL. The viewer only loads for projects that have one.

### Search & tag filtering
Already built in on the Projects page — no setup. It searches titles, summaries,
and tags, and the tag buttons are generated automatically from your data.

---

## 10. Design decisions, briefly

- **Plain HTML/CSS/JS, no framework or build step.** You can open any file and
  read exactly what runs. Nothing to “compile,” nothing to break, fastest
  possible loads.
- **Type system:** a native system-font stack (the fonts already on the
  visitor’s device). It looks clean and professional, loads instantly, and adds
  **zero** network requests — directly serving the “fast / minimal dependencies”
  goal. Swap in a self-hosted font later if you want a signature look.
- **Colour system:** a calm “engineering paper + blueprint” palette — cool slate
  neutrals so it reads as precise and technical, with a **single blue accent**
  doing all interactive work (links, buttons, focus rings). One accent keeps it
  disciplined and credible rather than flashy. A full **dark mode** is included
  (auto by device + a manual toggle).
- **Maths: KaTeX (not MathJax).** KaTeX renders equations instantly and
  synchronously with no “flash,” is smaller, and is self-contained. For the
  self-contained equations a CAD/FEA portfolio needs, it’s the faster, lighter
  pick. It’s loaded **only** on project detail pages.
- **3D viewer: Google’s `<model-viewer>`.** A tiny, accessible web component for
  `.glb`/`.gltf`. It’s **loaded on demand** — only for a project that actually has
  a model — so other pages pay nothing for it.
- **Accessibility & SEO baked in:** semantic landmarks, skip link, alt text,
  keyboard-friendly menu/lightbox, visible focus states, good contrast; plus
  per-page title/description, Open Graph tags, canonical URLs, `robots.txt`,
  `sitemap.xml`, and a favicon.
- **Performance:** images are lazy-loaded with width/height hints (no layout
  jump), dependencies are minimal and CDN-cached, and the data file is fetched
  once.

---

## 11. What could ever cost money (and the early warning signs)

**Short version: nothing here can produce a surprise bill from a traffic spike.**
None of it scales cost with visitors. Here’s the full picture.

| Service | Free? | Card needed? | Can a traffic spike bill me? | The only meters that could ever cost |
| --- | --- | --- | --- | --- |
| **GitHub Pages** (the website) | Yes | **No** | **No** | Soft *fair-use* limits (~100 GB/month bandwidth, ~1 GB site size). Hitting them throttles/emails you — it does **not** charge you. A static portfolio won’t get close. |
| **GitHub Releases** (CAD/FEA files) | Yes | **No** | **No** | None for normal use. No storage or bandwidth charges for release downloads. 2 GB per-file limit. |
| **Cloudflare R2** (only >2 GB files) | Yes, to a point | **Yes** | **No** | **Downloads are always free.** Storage is free up to **10 GB**; beyond that ≈ **$0.015/GB/month**. Operation counts have huge free tiers (millions/month) a portfolio won’t approach. |

**So the only thing to keep half an eye on is R2 storage going over 10 GB** — and
even then it’s about 1.5 cents per extra GB per month, not a spike.

**Early-warning setup (do once):**
- **R2 usage alert** at ~8 GB ([section 7.4](#74-turn-on-usage-alerts-so-youre-never-surprised)).
- Optional: in Cloudflare **Billing**, you can review usage anytime.

**Habits that keep you firmly in free territory:**
- Prefer **GitHub Releases** for files (free, no card) — only reach for R2 when a
  single file is over 2 GB.
- Keep the master copies of everything in your **iCloud Drive** (your private
  backup). iCloud is never used to serve the website.
- Optimise images before adding them (keeps the Pages site well under limits).

---

## 12. Troubleshooting

**The gallery is empty / “Couldn’t load projects.”**
You opened the file directly (`file://`). Use a local server
([section 3](#3-run-the-site-on-your-own-computer)). On the live site this never
happens.

**Equations show as raw text like `\frac{...}`.**
A backslash isn’t doubled in `projects.json`. LaTeX `\frac` must be `\\frac` in
the JSON file. Also check the page has internet access (KaTeX loads from a CDN).

**A project page says “Project not found.”**
The `?slug=` in the URL doesn’t match any `"slug"` in `projects.json`. Slugs must
be unique and match exactly (lowercase, dashes).

**My new project broke the site.**
JSON is picky. Run the file through <https://jsonlint.com>. Usual culprits: a
missing comma between two project blocks, or a trailing comma after the last item
in a list.

**Custom domain shows “not secure” or a certificate error.**
DNS hasn’t finished propagating, or HTTPS hasn’t been provisioned yet. Wait
(can be up to 24 h), confirm the DNS records in
[section 5.1](#51-add-dns-records-at-your-domain-registrar), then tick **Enforce
HTTPS**. On Cloudflare, make sure the Pages records are **“DNS only” (grey
cloud)** while the certificate is issued.

**Images don’t show on `username.github.io/portfolio/` but the site otherwise works.**
Expected before the custom domain is attached — the site is built to live at a
domain root. It resolves once `www.ananthbandari.bio` is connected.

---

*Built as a static site. Hosted free on GitHub Pages. Big files on GitHub
Releases / Cloudflare R2. No backend, no surprise bills.*
