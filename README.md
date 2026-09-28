# Introduction — a reusable team intro one-pager

A small, dependency-free template for the page a new teammate reads when someone
joins: *who I am, what I'm working on, how I work, and a few things about me
outside work.* One shared visual language; each person owns the personality.

Editorial layout, warm paper background, real type hierarchy. No frameworks, no
build step, zero npm dependencies. Works as plain static files.

## Make a page for someone

Edit **`profile.js`** — that's the only file you normally touch. It's all content:

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

## Customise live (dev only)

Click **Customise** (bottom-right) to preview without editing files:

- **Theme** — paper · archive · technical · dark
- **Fonts** — editorial · grotesk · humanist · classic · display · archivo
- **Density**, **Backdrop** (grid/dots/graph), **Photo frame** (square/circle/blob)
- **Accent / Page / Card colour** pickers
- **Edit text** — click any text on the page to change it; drop a photo on the
  avatar or a project image; add or remove projects
- **Export HTML** — writes one standalone `.html` (CSS + images inlined, scripts
  stripped) that works with JavaScript disabled

In-page edits and dropped photos are saved in the browser and baked into the
export. Theme/colour tweaks are a preview — copy the ones you like back into
`profile.js`. **Reset edits** clears saved changes.

## Navigation

A dot rail (desktop ≥1024px) jumps between sections with smooth scroll; arrow
keys, Home/End, and Enter all work. Scrolling settles section-by-section.

## Files

```
index.html   markup shell + font links
styles.css   the system + 4 theme presets (all CSS variables)
script.js    renders PROFILE, wires editing / export / nav
profile.js   employee content + theme  ← edit this
assets/      images (SVG examples)
```

## Accessibility

Semantic landmarks, one `h1` + section `h2`s, keyboard nav, visible focus,
reduced-motion honored, meaningful alt text, no colour-only meaning.
