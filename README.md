# Introduction - a reusable personal intro one-pager

A small, dependency-free template for the page a new teammate reads when someone
joins: *who I am, what I'm working on, how I work, and a few things about me
outside work.* One shared visual language; each person owns the personality.

Editorial layout, warm paper background, real type hierarchy. No frameworks, no
build step, zero npm dependencies. Works as plain static files.

There are two ways to make a page: **edit it live in the browser** (no code —
see [Customise & edit in the UI](#customise--edit-in-the-ui)), or **set the
defaults in `profile.js`**. Most people do a bit of both: seed the content in
`profile.js`, then fine-tune in the UI.

## Make a page for someone

Edit **`profile.js`** to set the starting content and theme. It's all content:

```js
window.PROFILE = {
  identity: { name, role, team, location, timezone, pronouns, ... },
  intro:    { lead, body },
  sections: [ /* ordered — reorder, rename, add, remove */ ],
  theme:    { preset, fonts, accent, bg, surface, density, background, photo }
}
```

Each section picks a `layout` (the shape) independent of its topic:

`feature` · `projects` / `project` · `list` · `tags` · `metadata` · `facts` ·
`quote` · `favorites` · `links` · `compact` · `gallery`

Unknown layouts or missing fields degrade instead of breaking, so custom
sections ("Things I collect", "A very specific opinion") just work.

## Run it

Any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. No build.

## Customise & edit in the UI

Click **Customise** (bottom-right) — the whole page is editable in the browser,
no code needed. You do **not** have to touch `profile.js` for any of this.

**Look & feel** (live preview):

- **Theme** — paper · archive · technical · dark · sand · sage · slate · mono
- **Fonts** — editorial · grotesk · humanist · classic · display · archivo
- **Density** — compact · comfortable · airy
- **Backdrop** — plain · grid · dots · graph · lines · diagonal · cross
- **Photo frame** — square · circle · blob
- **Orientation** — scroll · landscape · · **Mode** — professional · fun
- **Accent / Page / Card / Content / Text colour** pickers

**Edit the content** — flip **Edit text** to *on*, then directly on the page:

- **Any text is editable** — click a name, role, heading, paragraph, list item,
  fact, quote, timeline year/title/story, country — and type. Everything you see
  is editable, not just a fixed set of fields.
- **Photos** — drop an image on the big intro portrait or any project/media
  image (or click it to pick a file).
- **Projects** — **+ Add project** / the **✕** on each to remove.
- **Career timeline** — **+ Add milestone** / **✕** to remove; edit the emoji,
  year, title and story text inline.
- **Reorder sections** — the **↑ / ↓** buttons on each section move it up or
  down. Any order works (put the career timeline first, projects last, etc.).
  The dot rail and section numbers follow automatically.
- **Show / hide sections** — the **Sections** checkboxes in the panel.

**Export HTML** — writes one standalone `.html` (CSS + images inlined, scripts
and edit controls stripped) that works with JavaScript disabled.

In-page edits, dropped photos and section order are saved in **this browser**
(localStorage) and baked into the export — so the person editing keeps their
work across reloads. Theme/colour tweaks are a live preview; to make them the
default for everyone, copy the values into `profile.js`. **Reset edits** clears
the saved browser changes and returns to the `profile.js` defaults.

## Navigation

A dot rail (desktop ≥1024px) jumps between sections with smooth scroll; arrow
keys, Home/End, and Enter all work. Scrolling settles section-by-section.

## Files

```
index.html   markup shell + font links
styles.css   the system + 8 theme presets + backdrops (all CSS variables)
script.js    renders PROFILE, wires live editing / reorder / export / nav
profile.js   starting content + theme  ← edit for defaults (or edit live in the UI)
assets/      images (SVG examples)
```

## Accessibility

Semantic landmarks, one `h1` + section `h2`s, keyboard nav, visible focus,
reduced-motion honored, meaningful alt text, no colour-only meaning.
