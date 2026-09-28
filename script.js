/* =============================================================================
   RENDERER + INTERACTIONS
   -----------------------------------------------------------------------------
   Reads window.PROFILE, builds the page, wires the small interactions.
   You shouldn't need to edit this to make a new employee page — edit profile.js.
   New layout idea? Add a function to LAYOUTS below; that's the extension point.
   ========================================================================== */
(function () {
  "use strict";
  var P = window.PROFILE;
  if (!P) return;

  /* ---- tiny DOM helper --------------------------------------------------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }
  var C = P.content;
  function initials(name) {
    return (name || "?").trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  /* =========================================================================
     THEME  — flip a few attributes on <html>, everything else is CSS.
     ======================================================================== */
  function applyTheme(t) {
    t = t || {};
    var root = document.documentElement;
    root.setAttribute("data-theme", t.preset || "paper");
    root.setAttribute("data-fonts", t.fonts || "editorial");
    root.setAttribute("data-radius", String(t.radius != null ? t.radius : 2));
    root.setAttribute("data-density", t.density || "comfortable");
    root.setAttribute("data-bg", t.background || "grid");
    root.setAttribute("data-photo", t.photo || "square");
    root.setAttribute("data-orientation", t.orientation || "scroll");
    // per-profile colour overrides (blank → fall back to the preset's value)
    setVar(root, "--accent", t.accent);
    setVar(root, "--bg", t.bg);
    setVar(root, "--surface", t.surface);
  }
  function setVar(root, name, val) {
    if (val) root.style.setProperty(name, val);
    else root.style.removeProperty(name);
  }

  /* =========================================================================
     MASTHEAD
     ======================================================================== */
  function makeAvatar(id) {
    var box = el("div", { class: "avatar", tabindex: "0", role: "button", "aria-label": "Profile photo — drop an image or click to choose" });
    if (id.avatar) box.appendChild(el("img", { src: id.avatar, alt: "Portrait of " + id.name }));
    else box.appendChild(el("span", { class: "monogram", "aria-hidden": "true", text: initials(id.name) }));
    box.appendChild(el("span", { class: "avatar__hint", "aria-hidden": "true", text: "Drop / click photo" }));
    box.appendChild(el("input", { type: "file", accept: "image/*", tabindex: "-1", "aria-hidden": "true", style: "display:none" }));
    return box;
  }

  function renderMasthead(id, intro) {
    var avatar = makeAvatar(id);

    var metaRows = [];
    function row(label, value) {
      if (!value) return;
      metaRows.push(el("div", null, [document.createTextNode(label + " "), el("b", { text: value })]));
    }
    row("Role", id.role);
    row("Team", id.team);
    row("Location", id.location);
    row("Time", id.timezone);
    if (id.status) metaRows.push(el("div", { class: "status", text: id.status }));

    var aside = el("div", { class: "masthead__aside" }, [
      avatar,
      el("div", { class: "identity-meta" }, metaRows)
    ]);

    var name = el("h1", { class: "masthead__name display" }, [
      document.createTextNode(id.name),
      id.pronouns ? el("span", { class: "masthead__pron", text: id.pronouns }) : null
    ]);

    var kids = [name, aside];
    if (intro && intro.lead) kids.push(el("p", { class: "masthead__lead", text: intro.lead }));
    if (intro && intro.body) kids.push(el("p", { class: "masthead__body", text: intro.body }));

    return el("header", { class: "masthead", id: "top" }, el("div", { class: "masthead__grid" }, kids));
  }

  /* =========================================================================
     LAYOUT PRIMITIVES  — each returns the section BODY node.
     Add a key here to add a layout. Missing/extra fields degrade gracefully.
     ======================================================================== */
  var LAYOUTS = {

    feature: function (c) {
      var kids = [];
      if (c.lead) kids.push(el("p", { class: "l-feature__lead", text: c.lead }));
      if (c.points) kids.push(el("ul", { class: "l-feature__points" },
        c.points.map(function (p) { return el("li", null, el("span", { text: p })); })));
      if (c.body) kids.push(el("p", { style: "max-width:var(--measure)", text: c.body }));
      return el("div", null, kids);
    },

    // single project: shape is the project itself (name shown as the section title)
    project: function (c) { return projectBlock(c, false); },

    // several projects: content.projects = [ {name, summary, role, ...}, ... ]
    projects: function (c) {
      var wrap = el("div", { class: "l-projects" },
        (c.projects || []).map(function (p) { return projectBlock(p, true); }));
      // "Add project" appears only in edit mode (styled in CSS)
      wrap.appendChild(el("button", { class: "l-projects__add", type: "button", "aria-label": "Add a project", text: "+  Add project" }));
      return wrap;
    },

    split: function (c) {
      var main = el("div", { class: "l-split__body" }, [
        c.lead ? el("p", { class: "lead", style: "font-size:1.4rem", text: c.lead }) : null,
        c.body ? el("p", { style: "margin-top:1rem", text: c.body }) : null
      ]);
      var aside = c.image ? renderMedia(c.image)
        : el("div", { class: "l-split__aside" }, (c.aside || "") && el("p", { text: c.aside }));
      return el("div", { class: "l-split__grid" }, [main, aside]);
    },

    list: function (c) {
      var loose = c.style === "loose";
      return el("ul", { class: "l-list" + (loose ? " l-list--loose" : "") },
        (c.items || []).map(function (it) {
          if (typeof it === "string") return el("li", null, el("span", { class: "li-title", text: it }));
          return el("li", null, [
            el("span", { class: "li-title", text: it.title }),
            it.note ? el("span", { class: "li-note", text: it.note }) : null
          ]);
        }));
    },

    tags: function (c) {
      var kids = [];
      if (c.note) kids.push(el("p", { class: "l-tags__note", text: c.note }));
      kids.push(el("ul", { class: "l-tags__wrap" },
        (c.tags || []).map(function (t) { return el("li", { class: "tag", text: t }); })));
      return el("div", null, kids);
    },

    metadata: function (c) {
      var dl = el("dl", { class: "l-meta__rows" });
      (c.rows || []).forEach(function (r) {
        dl.appendChild(el("dt", { text: r.label }));
        dl.appendChild(el("dd", { text: r.value }));
      });
      return el("div", { class: "l-meta" }, dl);
    },

    facts: function (c) {
      return el("div", { class: "l-facts" }, (c.facts || []).map(function (f, i) {
        var d = el("details", { class: "fact" }, [
          el("summary", { class: "fact__btn" }, [
            el("span", null, [
              el("span", { class: "fact__num", text: "F" + (i + 1) }),
              el("p", { class: "fact__text", text: f.fact })
            ]),
            f.detail ? el("span", { class: "fact__sign", "aria-hidden": "true", text: "+" }) : null
          ]),
          f.detail ? el("div", { class: "fact__detail", text: f.detail }) : null
        ]);
        if (!f.detail) d.querySelector("summary").style.cursor = "default";
        return d;
      }));
    },

    quote: function (c) {
      return el("figure", { class: "l-quote" }, [
        el("blockquote", { text: "“" + (c.quote || "") + "”" }),
        c.cite ? el("figcaption", { text: c.cite }) : null
      ]);
    },

    favorites: function (c) {
      return el("div", { class: "l-fav" }, (c.items || []).map(function (it) {
        return el("div", null, [
          el("span", { class: "fav-label", text: it.label }),
          el("span", { class: "fav-value", text: it.value })
        ]);
      }));
    },

    links: function (c) { return renderLinkList(c.links || [], false); },

    compact: function (c) {
      return el("ul", { class: "l-compact" }, (c.items || []).map(function (t) {
        return el("li", { text: typeof t === "string" ? t : t.title });
      }));
    },

    gallery: function (c) {
      return el("div", { class: "l-gallery" }, (c.images || []).map(renderMedia));
    },

    // fallback for text-only or unknown sections
    text: function (c) {
      return el("div", { style: "max-width:var(--measure)" }, [
        c.lead ? el("p", { class: "lead", style: "font-size:1.3rem;margin-bottom:1rem", text: c.lead }) : null,
        c.body ? el("p", { text: c.body }) : null
      ]);
    }
  };

  var PLACEHOLDER_IMG = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560"><rect width="800" height="560" fill="#efece4"/><text x="400" y="290" font-family="ui-monospace,monospace" font-size="24" fill="#9a958a" text-anchor="middle">Drop or click to add a photo</text></svg>');

  function newProjectData() {
    return {
      name: "New project",
      role: "Your role",
      focus: "Focus",
      status: "Status",
      summary: "What it is, in a sentence or two. Click to edit.",
      stack: ["Tool", "Tool"],
      notes: ["A note worth keeping."],
      image: { src: PLACEHOLDER_IMG, alt: "Project image", treatment: "framed", zoom: false },
      links: [{ label: "Link", href: "#", value: "example.com" }]
    };
  }

  function projectBlock(c, showName) {
    var left = [];
    if (showName && c.name) left.push(el("h3", { class: "l-project__name display" }, c.name));
    if (c.summary) left.push(el("p", { class: "l-project__summary", text: c.summary }));
    var spec = el("dl", { class: "spec" });
    function pair(dt, dd) { if (!dd) return; spec.appendChild(el("dt", { text: dt })); spec.appendChild(el("dd", { text: dd })); }
    pair("role", c.role); pair("focus", c.focus); pair("status", c.status);
    if (spec.children.length) left.push(spec);
    if (c.stack && c.stack.length) left.push(el("div", { class: "chiprow" },
      c.stack.map(function (s) { return el("span", { class: "chip", text: s }); })));
    if (c.links && c.links.length) left.push(renderLinkList(c.links, true));
    if (c.notes && c.notes.length) left.push(el("ul", { class: "project-notes" },
      c.notes.map(function (n) { return el("li", { text: n }); })));

    var kids = [el("div", null, left)];
    if (c.image) kids.push(renderMedia(c.image));
    var grid = el("div", { class: "l-project__grid" }, kids);
    // remove control (multi-project only; shown in edit mode via CSS)
    if (showName) grid.appendChild(el("button", { class: "l-project__remove", type: "button", "aria-label": "Remove this project", title: "Remove project", text: "✕" }));
    return grid;
  }

  function renderMedia(m) {
    if (!m || !m.src) return null;
    var treat = m.treatment || "framed";
    var editable = m.editable !== false; // images are replaceable in edit mode by default
    var img = el("img", { src: m.src, alt: m.alt || "", loading: "lazy" });
    var fig = el("figure", {
      class: "media media--" + treat + (m.zoom !== false ? " media--zoomable" : "") + (editable ? " media--editable" : "")
    }, [
      img,
      editable ? el("span", { class: "media__hint", "aria-hidden": "true", text: "Drop / click photo" }) : null,
      editable ? el("input", { type: "file", accept: "image/*", tabindex: "-1", "aria-hidden": "true", style: "display:none" }) : null,
      m.caption ? el("figcaption", { text: m.caption }) : null
    ]);
    if (m.zoom !== false) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("data-zoom", "");
      img.setAttribute("aria-label", "Enlarge image" + (m.alt ? ": " + m.alt : ""));
    }
    return fig;
  }

  function renderLinkList(links, compact) {
    var wrap = el("div", { class: "l-links" });
    links.forEach(function (l) {
      var value = el("span", { class: "link-value", text: l.value || l.href });
      var label = el("span", { class: "link-label", text: l.label });
      var kids = [label, value];
      if (l.copy) {
        kids.push(el("button", { class: "copy-btn", type: "button", "aria-label": "Copy " + l.label, "data-copy": l.value || l.href, text: "copy" }));
      }
      if (l.href && !l.copy) {
        wrap.appendChild(el("a", { href: l.href, class: "link-row" }, kids));
      } else {
        wrap.appendChild(el("div", { class: "link-row" }, kids));
      }
    });
    return wrap;
  }

  /* =========================================================================
     SECTION SHELL
     ======================================================================== */
  function renderSection(s, index, showNumbers) {
    var body = (LAYOUTS[s.layout] || LAYOUTS.text)(s.content || {});
    var head = [];
    if (s.eyebrow || showNumbers) {
      var eb = el("p", { class: "eyebrow" });
      if (showNumbers) eb.appendChild(el("span", { class: "idx", text: ("0" + index).slice(-2) + " /" }));
      if (s.eyebrow) eb.appendChild(el("span", { text: s.eyebrow.toUpperCase() }));
      head.push(eb);
    }
    if (s.title) head.push(el("h2", { class: "section__title", id: "sec-" + s.id }, s.title));

    if (s.meta) {
      var meta = el("div", { class: "section__meta" });
      if (s.meta.status) meta.appendChild(el("span", { class: "tag-status", text: s.meta.status }));
      if (s.meta.updated) meta.appendChild(el("span", { class: "mono", text: "Updated " + s.meta.updated }));
      head.push(meta);
    }

    return el("section", {
      class: "section sec--" + s.layout,
      id: s.id,
      "aria-labelledby": s.title ? "sec-" + s.id : null
    }, [
      head.length ? el("div", { class: "section__head" }, head) : null,
      el("div", { class: "section__body" }, body)
    ]);
  }

  /* =========================================================================
     INTERACTIONS
     ======================================================================== */
  function copy(text, btn) {
    var done = function () { btn.setAttribute("data-copied", "1"); btn.textContent = "copied"; setTimeout(function () { btn.removeAttribute("data-copied"); btn.textContent = "copy"; }, 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else { try { var t = el("textarea", { text: text }); document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); done(); } catch (e) {} }
  }

  var lb;
  function openLightbox(m) {
    if (!lb) {
      lb = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Enlarged image", hidden: "" }, [
        el("button", { class: "lightbox__close", type: "button", "aria-label": "Close", text: "Close ✕" })
      ]);
      lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox__close")) closeLightbox(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
      document.body.appendChild(lb);
    }
    var old = lb.querySelector("img"); if (old) old.remove();
    lb.appendChild(el("img", { src: m.src, alt: m.alt || "" }));
    lb.hidden = false;
    lb.querySelector(".lightbox__close").focus();
  }
  function closeLightbox() { if (lb) lb.hidden = true; }

  /* ---- delegated interactions (survive in-place edits & photo swap) ------- */
  var editing = function () { return document.body.classList.contains("editing"); };
  document.addEventListener("click", function (e) {
    var t = e.target;
    var cp = t.closest && t.closest(".copy-btn");
    if (cp) { e.preventDefault(); copy(cp.getAttribute("data-copy"), cp); return; }
    // add a project (edit mode)
    var addBtn = t.closest && t.closest(".l-projects__add");
    if (addBtn) {
      e.preventDefault();
      var block = projectBlock(newProjectData(), true);
      addBtn.parentNode.insertBefore(block, addBtn);
      if (editing()) block.querySelectorAll(EDITABLE).forEach(function (n) { n.setAttribute("contenteditable", "true"); });
      persistEdits();
      block.scrollIntoView({ block: "center" });
      return;
    }
    // remove a project (edit mode)
    var rm = t.closest && t.closest(".l-project__remove");
    if (rm) {
      e.preventDefault();
      var pg = rm.closest(".l-project__grid");
      if (pg) { pg.remove(); persistEdits(); }
      return;
    }
    // avatar: replace photo anytime
    var av = t.closest && t.closest(".avatar");
    if (av) { if (t.matches("input")) return; var ai = av.querySelector("input[type=file]"); if (ai) ai.click(); return; }
    // project/media image: replace while editing, else zoom
    var med = t.closest && t.closest(".media--editable");
    if (med && editing()) { if (t.matches("input")) return; var mi = med.querySelector("input[type=file]"); if (mi) mi.click(); return; }
    if (editing()) return; // no zoom while editing
    var im = t.closest && t.closest("img[data-zoom]");
    if (im) openLightbox({ src: im.getAttribute("src"), alt: im.getAttribute("alt") });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var a = document.activeElement; if (!a || !a.matches) return;
    if (a.matches(".avatar")) { e.preventDefault(); var inp = a.querySelector("input[type=file]"); if (inp) inp.click(); }
    else if (a.matches("img[data-zoom]") && !editing()) { e.preventDefault(); openLightbox({ src: a.getAttribute("src"), alt: a.getAttribute("alt") }); }
  });
  // photo drop — avatar (anytime) and project/media images (anytime)
  function dropTarget(e) { return (e.target.closest && (e.target.closest(".avatar") || e.target.closest(".media--editable"))) || null; }
  document.addEventListener("dragover", function (e) { var d = dropTarget(e); if (d) { e.preventDefault(); d.classList.add("is-drop"); } });
  document.addEventListener("dragleave", function (e) { var d = dropTarget(e); if (d) d.classList.remove("is-drop"); });
  document.addEventListener("drop", function (e) {
    var d = dropTarget(e); if (!d) return;
    e.preventDefault(); d.classList.remove("is-drop");
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (d.classList.contains("avatar")) setAvatarPhoto(d, f); else setMediaPhoto(d, f);
  });
  document.addEventListener("change", function (e) {
    if (!e.target.matches) return;
    if (e.target.matches(".avatar input[type=file]")) setAvatarPhoto(e.target.closest(".avatar"), e.target.files && e.target.files[0]);
    else if (e.target.matches(".media--editable input[type=file]")) setMediaPhoto(e.target.closest(".media--editable"), e.target.files && e.target.files[0]);
  });
  // persist in-place text edits (debounced)
  document.addEventListener("input", function () { if (editing()) persistEdits(); });

  function setMediaPhoto(fig, file) {
    if (!fig || !file || !/^image\//.test(file.type)) return;
    toDataURL(file).then(function (d) {
      var img = fig.querySelector("img");
      if (img) { img.setAttribute("src", d); img.removeAttribute("loading"); }
      persistEdits();
    });
  }

  function setAvatarPhoto(box, file) {
    if (!box || !file || !/^image\//.test(file.type)) return;
    toDataURL(file).then(function (d) {
      [].slice.call(box.querySelectorAll("img, .monogram")).forEach(function (n) { n.remove(); });
      box.insertBefore(el("img", { src: d, alt: "Portrait of " + P.identity.name }), box.querySelector(".avatar__hint"));
      persistEdits();
    });
  }

  /* ---- in-place editing + persistence ------------------------------------ */
  var EDITABLE = [
    ".docrule .mono",
    ".masthead__name", ".masthead__pron", ".masthead__lead", ".masthead__body",
    ".identity-meta div",
    ".eyebrow span:last-child", ".section__title",
    ".section__meta .tag-status", ".section__meta .mono",
    ".l-feature__lead", ".l-feature__points li span",
    ".li-title", ".li-note", ".tag", ".l-tags__note",
    ".l-meta dt", ".l-meta dd",
    ".fact__text", ".fact__detail",
    ".l-quote blockquote", ".l-quote figcaption",
    ".fav-label", ".fav-value",
    ".link-label", ".link-value",
    ".l-compact li",
    ".l-project__name", ".l-project__summary", ".spec dt", ".spec dd",
    ".project-notes li", ".chip", ".media figcaption",
    ".colophon span"
  ].join(",");

  function toggleEdit(on) {
    document.body.classList.toggle("editing", on);
    document.querySelectorAll(EDITABLE).forEach(function (n) {
      if (on) n.setAttribute("contenteditable", "true");
      else n.removeAttribute("contenteditable");
    });
    var banner = document.getElementById("edit-banner");
    if (banner) banner.hidden = !on;
    if (on) persistEdits();
  }

  function editsKey() { return "intro:edits:" + slug(P.identity.name); }
  var saveTimer;
  function persistEdits() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        var clone = document.getElementById("page").cloneNode(true);
        // save the content, not the transient editing/motion state
        clone.querySelectorAll("[contenteditable]").forEach(function (n) { n.removeAttribute("contenteditable"); });
        clone.querySelectorAll(".reveal").forEach(function (n) { n.classList.remove("reveal", "is-in"); });
        localStorage.setItem(editsKey(), clone.innerHTML);
      } catch (e) {}
    }, 300);
  }
  function restoreEdits() {
    try {
      var saved = localStorage.getItem(editsKey());
      if (saved) { document.getElementById("page").innerHTML = saved; return true; }
    } catch (e) {}
    return false;
  }
  function resetEdits() { try { localStorage.removeItem(editsKey()); } catch (e) {} location.reload(); }
  function hasEdits() { try { return !!localStorage.getItem(editsKey()); } catch (e) { return false; } }

  /* ---- gentle, motivated motion: sections fade up as they enter ----------
     Fail-safe: the hidden state is only ever set by JS, so no-JS shows content;
     already-visible sections are marked in-place so nothing flickers on load. */
  function wireMotion() {
    var ok = window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!ok || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    document.querySelectorAll(".section").forEach(function (s) {
      s.classList.add("reveal");
      if (s.getBoundingClientRect().top < window.innerHeight * 0.92) s.classList.add("is-in"); // in view → no jump
      else io.observe(s);
    });
  }

  /* =========================================================================
     BUILD
     ======================================================================== */
  applyTheme(P.theme);
  var showNumbers = !P.theme || P.theme.sectionNumbers !== false;

  var page = el("div", { class: "page" });

  page.appendChild(el("div", { class: "docrule" }, [
    el("span", { class: "mono", text: "Internal · Introduction" }),
    el("span", { class: "mono docrule__right", text: (P.identity.joined || "") + (P.identity.timezone ? "  ·  " + P.identity.timezone : "") })
  ]));

  page.appendChild(renderMasthead(P.identity, P.intro));

  var main = el("main", { class: "sections", id: "main" });
  var n = 0;
  (P.sections || []).forEach(function (s) {
    if (s.visible === false) return;
    n++;
    main.appendChild(renderSection(s, n, showNumbers));
  });
  page.appendChild(main);

  page.appendChild(el("footer", { class: "colophon" }, [
    el("span", { text: P.identity.name + " · " + P.identity.team }),
    el("span", { text: "Made with the team introduction template" })
  ]));

  var mount = document.getElementById("page");
  mount.innerHTML = "";
  mount.appendChild(page);
  restoreEdits(); // bring back any in-place edits / dropped photo from a prior session

  document.body.appendChild(el("div", { class: "edit-banner", id: "edit-banner", hidden: "" },
    "Editing: click any text to change it · drop a photo on the avatar or a project image · Reset or Export when done"));

  buildDevPanel();
  wireMotion();
  buildSectionNav();
  buildDeckArrows();

  /* ---- landscape deck: ‹ › page through the section cards ------------------
     Hidden by CSS unless data-orientation="landscape". Scrolls the horizontal
     .sections track one card at a time; the dot rail still jumps directly. */
  function buildDeckArrows() {
    var track = document.querySelector(".sections");
    if (!track) return;
    function go(dir) {
      var cards = [].slice.call(track.querySelectorAll(".section")).filter(function (s) { return s.offsetParent !== null; });
      if (!cards.length) return;
      var mid = window.innerWidth / 2, idx = 0, best = Infinity;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        var d = Math.abs((r.left + r.right) / 2 - mid);
        if (d < best) { best = d; idx = i; }
      });
      idx = Math.max(0, Math.min(cards.length - 1, idx + dir));
      cards[idx].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    var prev = el("button", { type: "button", "aria-label": "Previous card", text: "‹" });
    var next = el("button", { type: "button", "aria-label": "Next card", text: "›" });
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    document.body.appendChild(el("div", { class: "deck-arrows" }, [prev, next]));
  }

  /* ---- section navigation: smooth scroll + active dot ---------------------- */
  function buildSectionNav() {
    var targets = [];
    var mast = document.querySelector(".masthead");
    if (mast) { mast.id = mast.id || "top"; targets.push({ id: mast.id, title: "Top" }); }
    [].slice.call(document.querySelectorAll(".sections > .section")).forEach(function (s) {
      if (!s.id) return;
      var tEl = s.querySelector(".section__title");
      targets.push({ id: s.id, title: tEl ? tEl.textContent : s.id });
    });
    if (targets.length < 3) return;

    var links = {};
    var list = el("ul");
    targets.forEach(function (tg) {
      var a = el("a", { href: "#" + tg.id, class: "section-nav__dot", "aria-label": tg.title }, [
        el("span", { class: "section-nav__label", "aria-hidden": "true", text: tg.title }),
        el("span", { class: "section-nav__mark", "aria-hidden": "true" })
      ]);
      links[tg.id] = a;
      list.appendChild(el("li", null, a));
    });
    var nav = el("nav", { class: "section-nav", "aria-label": "Sections" }, list);
    // arrow keys move between dots (and navigate); Home/End jump to ends
    nav.addEventListener("keydown", function (e) {
      var dots = [].slice.call(nav.querySelectorAll(".section-nav__dot"));
      var i = dots.indexOf(document.activeElement);
      if (i < 0) return;
      var n;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = i + 1;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = i - 1;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = dots.length - 1;
      else return;
      e.preventDefault();
      n = Math.max(0, Math.min(dots.length - 1, n));
      dots[n].focus(); // keep focus in the rail so repeated arrows work
      var tgt = document.getElementById(dots[n].getAttribute("href").slice(1));
      if (tgt) tgt.scrollIntoView(); // honours CSS scroll-behavior (smooth / reduced-motion)
    });
    document.body.appendChild(nav);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && links[e.target.id]) {
            Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
            links[e.target.id].setAttribute("aria-current", "true");
          }
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      targets.forEach(function (tg) { var elm = document.getElementById(tg.id); if (elm) io.observe(elm); });
    }
  }

  /* =========================================================================
     DEV PANEL  (optional customiser) + EXPORT
     Development-only. Delete this whole function to remove it entirely.
     ======================================================================== */
  function buildDevPanel() {
    var t = Object.assign({ preset: "paper", fonts: "editorial", radius: 2, density: "comfortable", background: "grid", photo: "square", orientation: "scroll" }, P.theme || {});

    var toggle = el("button", { class: "dev-toggle", id: "dev-toggle", type: "button", "aria-expanded": "false", "aria-controls": "dev-panel", text: "Customise" });
    var panel = el("div", { class: "dev-panel", id: "dev-panel", role: "region", "aria-label": "Template customiser", hidden: "" });

    function selField(label, opts, val, on) {
      var sel = el("select");
      opts.forEach(function (o) { sel.appendChild(el("option", { value: o, text: o, selected: o === val ? "" : null })); });
      sel.addEventListener("change", function () { on(sel.value); });
      return el("label", { class: "dev-field" }, [el("span", { text: label }), sel]);
    }
    function segField(label, opts, val, on) {
      var seg = el("div", { class: "dev-seg", role: "group", "aria-label": label });
      opts.forEach(function (o) {
        var b = el("button", { type: "button", text: o, "aria-pressed": o === val ? "true" : "false" });
        b.addEventListener("click", function () {
          seg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true"); on(o);
        });
        seg.appendChild(b);
      });
      return el("label", { class: "dev-field" }, [el("span", { text: label }), seg]);
    }

    function colorField(label, cssVar, apply) {
      var inp = el("input", { type: "color", value: normHex(getComputedStyle(document.documentElement).getPropertyValue(cssVar)) });
      inp.addEventListener("input", function () { apply(inp.value); });
      return { field: el("label", { class: "dev-field" }, [el("span", { text: label }), inp]), input: inp, cssVar: cssVar };
    }
    var colorInputs = [];
    function syncColors() { colorInputs.forEach(function (c) { c.input.value = normHex(getComputedStyle(document.documentElement).getPropertyValue(c.cssVar)); }); }

    panel.appendChild(el("h3", { text: "Template" }));
    // picking a preset clears any custom colours so the preset shows through
    panel.appendChild(selField("Theme", ["paper", "archive", "technical", "dark"], t.preset, function (v) { t.preset = v; t.accent = t.bg = t.surface = ""; applyTheme(t); syncColors(); }));
    panel.appendChild(selField("Fonts", ["editorial", "grotesk", "humanist", "classic", "display", "archivo"], t.fonts, function (v) { t.fonts = v; applyTheme(t); }));
    panel.appendChild(segField("Density", ["compact", "comfortable", "airy"], t.density, function (v) { t.density = v; applyTheme(t); }));
    panel.appendChild(selField("Backdrop", ["plain", "grid", "dots", "graph"], t.background, function (v) { t.background = v; applyTheme(t); }));
    panel.appendChild(selField("Photo frame", ["square", "circle", "blob"], t.photo || "square", function (v) { t.photo = v; applyTheme(t); }));
    panel.appendChild(segField("Orientation", ["scroll", "landscape"], t.orientation || "scroll", function (v) { t.orientation = v; applyTheme(t); }));

    var accentF = colorField("Accent", "--accent", function (v) { t.accent = v; applyTheme(t); });
    var bgF = colorField("Page colour", "--bg", function (v) { t.bg = v; applyTheme(t); });
    var surfF = colorField("Card colour", "--surface", function (v) { t.surface = v; applyTheme(t); });
    colorInputs = [accentF, bgF, surfF];
    panel.appendChild(accentF.field);
    panel.appendChild(bgF.field);
    panel.appendChild(surfF.field);

    panel.appendChild(segField("Edit text", ["off", "on"], "off", function (v) { toggleEdit(v === "on"); }));

    // section visibility toggles
    var visWrap = el("div", { class: "dev-vis" });
    (P.sections || []).forEach(function (s) {
      var cb = el("input", { type: "checkbox" }); cb.checked = s.visible !== false;
      cb.addEventListener("change", function () {
        var node = [].slice.call(document.querySelectorAll(".section__title")).filter(function (h) { return h.id === "sec-" + s.id; })[0];
        var sec = node ? node.closest(".section") : null;
        if (sec) sec.style.display = cb.checked ? "" : "none";
        // keep the dot rail in sync — a hidden section has no dot
        var dot = document.querySelector('.section-nav a[href="#' + s.id + '"]');
        var li = dot ? dot.closest("li") : null;
        if (li) li.hidden = !cb.checked;
      });
      visWrap.appendChild(el("label", null, [cb, document.createTextNode(s.title || s.id)]));
    });
    panel.appendChild(el("label", { class: "dev-field" }, el("span", { text: "Sections" })));
    panel.appendChild(visWrap);

    var resetBtn = el("button", { type: "button", text: "Reset edits" });
    resetBtn.addEventListener("click", resetEdits);
    var pdfBtn = el("button", { type: "button", text: "Save PDF" });
    pdfBtn.addEventListener("click", function () { window.print(); }); // browser's print → "Save as PDF"
    var exportBtn = el("button", { class: "primary", type: "button", text: "Export HTML" });
    exportBtn.addEventListener("click", exportStandalone);
    panel.appendChild(el("div", { class: "dev-actions" }, [resetBtn, pdfBtn, exportBtn]));
    panel.appendChild(el("p", { class: "dev-note", text: "In-page edits and dropped photos are saved in this browser and baked into the export. Theme and colour tweaks are a preview; save them in profile.js. Export is one static .html that works with JavaScript off." }));

    toggle.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Customise";
    });

    document.body.appendChild(panel);
    document.body.appendChild(toggle);
  }

  function normHex(v) {
    v = (v || "").trim();
    if (v[0] === "#") return v.slice(0, 7);
    var m = v.match(/\d+/g);
    if (!m) return "#5D45B8";
    return "#" + m.slice(0, 3).map(function (x) { return ("0" + (+x).toString(16)).slice(-2); }).join("");
  }

  // Produce ONE portable static .html: local CSS + local images inlined,
  // scripts and dev UI stripped. Works with JavaScript disabled.
  function exportStandalone() {
    var notLocalFont = function (u) { return !/fonts\.(googleapis|gstatic)\.com/.test(u || ""); };
    var localLink = [].slice.call(document.querySelectorAll('link[rel="stylesheet"]')).filter(function (l) { return notLocalFont(l.href); })[0];
    var cssHref = localLink ? localLink.href : "styles.css";

    // gather local images (skip data: and remote) → { originalSrc: dataURI }
    var imgs = [].slice.call(document.querySelectorAll("#page img")).filter(function (i) {
      var s = i.getAttribute("src") || ""; return s && !/^data:/.test(s) && !/^https?:\/\/(?!localhost|127\.)/.test(i.src);
    });

    Promise.all([
      fetch(cssHref).then(function (r) { return r.text(); }),
      Promise.all(imgs.map(function (img) {
        return fetch(img.src).then(function (r) { return r.blob(); }).then(toDataURL)
          .then(function (d) { return { src: img.getAttribute("src"), data: d }; })
          .catch(function () { return null; });
      }))
    ]).then(function (res) {
      var css = res[0];
      var map = {}; res[1].forEach(function (x) { if (x) map[x.src] = x.data; });

      var clone = document.documentElement.cloneNode(true);
      clone.querySelectorAll("script, noscript, #dev-toggle, #dev-panel, .lightbox, #edit-banner, .section-nav, .deck-arrows, .l-projects__add, .l-project__remove, .avatar__hint, .avatar input[type=file], .media__hint, .media input[type=file]").forEach(function (n) { n.remove(); });
      clone.querySelectorAll(".is-drop").forEach(function (n) { n.classList.remove("is-drop"); });
      // freeze in-place edits into static text
      clone.querySelectorAll("[contenteditable]").forEach(function (n) { n.removeAttribute("contenteditable"); });
      clone.querySelectorAll(".reveal").forEach(function (n) { n.classList.remove("reveal", "is-in"); }); // motion is JS-driven; export static
      var body = clone.querySelector("body"); if (body) body.classList.remove("editing");
      clone.querySelectorAll(".avatar").forEach(function (a) { a.removeAttribute("tabindex"); a.removeAttribute("role"); a.style.cursor = "default"; });
      clone.querySelectorAll("img").forEach(function (img) {
        var s = img.getAttribute("src"); if (map[s]) img.setAttribute("src", map[s]);
        img.removeAttribute("tabindex"); img.removeAttribute("role"); // non-interactive without JS
      });
      var linkEl = [].slice.call(clone.querySelectorAll('link[rel="stylesheet"]')).filter(function (l) { return notLocalFont(l.getAttribute("href")); })[0];
      var style = document.createElement("style"); style.textContent = css;
      if (linkEl) linkEl.replaceWith(style); else clone.querySelector("head").appendChild(style);

      var html = "<!doctype html>\n" + clone.outerHTML;
      var a = el("a", { href: URL.createObjectURL(new Blob([html], { type: "text/html" })), download: slug(P.identity.name) + "-introduction.html" });
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 100);
    }).catch(function () { alert("Export needs the page served over http (run a local server), not opened as a file://"); });
  }
  function toDataURL(blob) { return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = rej; fr.readAsDataURL(blob); }); }
  function slug(s) { return (s || "profile").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

})();
