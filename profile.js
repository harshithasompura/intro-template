/* =============================================================================
   PROFILE  —  this is the only file most people need to edit.
   -----------------------------------------------------------------------------
   Everything here is CONTENT. How it looks lives in styles.css; how it renders
   lives in script.js. You should almost never touch those.

   Three things to know:

   1. `identity` + `intro`  → the masthead (name, role, the one-line "who am I").
   2. `sections`            → an ORDERED list. Reorder = drag lines around.
                              Remove one = delete it (or set visible:false).
                              Add one = copy a block and change it.
                              Rename = change `title`. New topic = write your own.
   3. `theme`               → the knobs that make your page feel like yours.

   Each section picks a `layout`. The layout decides the shape, not the topic —
   so "Things I collect" and "Currently learning" can share a layout, and
   "Currently" can look nothing like "Links". Available layouts:

     feature   — big, prominent statement (use once or twice, max)
     split     — text on one side, media/notes on the other
     project   — a project card-ish block: role, status, stack, links, image
     list      — titled rows with optional notes (principles, collections…)
     tags      — a wrap of short chips (hobbies, skills…)
     metadata  — mono key → value pairs, or small labelled groups
     facts     — 2–5 facts, expandable for the longer story
     quote     — a single pull-quote in your voice
     favorites — labelled picks (book, film, album…)
     links     — labelled links, some copyable (email, slack…)
     gallery   — one or more images treated as editorial material
     compact   — a dense inline list (learning, currently reading…)
     timeline  — a career progress line; each node clicks open to its story
     countries — places visited: a flag grid with a live count and checks

   Unknown layout or missing fields won't break the page — it degrades.
   ========================================================================== */

window.PROFILE = {

  /* ---- WHO ARE YOU ------------------------------------------------------- */
  identity: {
    name: "Ally Smith",
    role: "Design Engineer",
    team: "Platform Interfaces",
    location: "Berlin, DE",
    timezone: "CET · UTC+1",
    // Avatar is optional. Leave it out and you get a typographic monogram.
    // Point it at a real image if you have one, e.g. "assets/nour.jpg".
    avatar: "",              // "" → monogram from initials
    pronouns: "she/her",
    joined: "Joined Sep 2026",
    status: "Around most days 10:00-18:00 CET",
  },

  /* ---- THE ONE LINE ------------------------------------------------------ */
  intro: {
    // Say the true thing, not the LinkedIn thing.
    lead: "I turn fuzzy product ideas into interfaces that feel obvious in hindsight, mostly by deleting things until what’s left explains itself.",
    // A short paragraph is optional. Keep it to a couple of sentences.
    body: "I sit between design and engineering: close enough to the pixels to argue about a 2px border, close enough to the code to actually move it. I like the unglamorous work: empty states, error copy, the fourth loading state nobody remembers.",
  },

  /* ---- SECTIONS (ordered) ------------------------------------------------ */
  sections: [

    {
      id: "currently",
      emoji: "🛠️",
      eyebrow: "Right now",
      title: "What I'm working on",
      layout: "feature",
      visible: true,
      // meta shows up as small mono annotations next to the section.
      meta: { status: "Active", updated: "Sep 2026" },
      content: {
        lead: "Rebuilding our component library so a designer and an engineer are finally looking at the same thing.",
        points: [
          "Shipping a token pipeline that turns Figma variables into typed CSS. No more “which grey is this”.",
          "Untangling the form components. There were nine kinds of input. There will be three.",
          "Writing the docs as I go, because a component nobody can find gets rebuilt from scratch.",
        ],
      },
    },

    // ---- MULTIPLE PROJECTS. Use layout "projects" with a `projects` array.
    //      (For a single project, use layout "project" and put the fields
    //      directly in `content` — the section title becomes the project name.)
    {
      id: "projects",
      emoji: "🚧",
      eyebrow: "Project",
      title: "What I’m building",
      layout: "projects",
      visible: true,
      content: {
        projects: [
          {
            name: "Loom",
            status: "Active",
            role: "Design engineering lead",
            focus: "Design tokens · Docs · Migration",
            summary: "An internal pipeline that takes design decisions from Figma and turns them into a single, typed source of truth every surface reads from. One place to change a colour; everywhere updates.",
            stack: ["TypeScript", "Style Dictionary", "Web Components", "Vite", "Storybook"],
            image: {
              src: "assets/loom.svg",
              alt: "A screenshot of the Loom token browser: a grid of colour and spacing tokens with their code names.",
              treatment: "framed",   // framed | full | thumbnail
              caption: "Loom token browser. Every value has exactly one name.",
            },
            notes: [
              "Adopted by 4 teams so far.",
              "Cut our CSS bundle by ~18% mostly by deleting duplicates.",
            ],
            links: [
              { label: "Repo", href: "#", value: "git/platform/loom" },
              { label: "Docs", href: "#", value: "loom.internal" },
            ],
          },
          {
            name: "Fieldbook",
            status: "Beta",
            role: "Maintainer",
            focus: "Docs · Onboarding",
            summary: "A tiny search-first handbook for the design system: the “how do I use this component” layer that always goes missing. Runs on the same tokens as Loom.",
            stack: ["Astro", "Pagefind", "MDX"],
            image: {
              src: "assets/fieldbook.svg",
              alt: "A screenshot of the Fieldbook handbook: a search box over a list of component documentation entries.",
              treatment: "framed",
              caption: "Fieldbook. Type a component name, get the answer.",
            },
            notes: ["Weekend project that quietly became load-bearing."],
            links: [
              { label: "Site", href: "#", value: "fieldbook.internal" },
            ],
          },
        ],
      },
    },

    {
      id: "how-i-work",
      emoji: "🤝",
      eyebrow: "Working with me",
      title: "How I work",
      layout: "list",
      visible: true,
      content: {
        items: [
          { title: "Async first, then talk", note: "Write it down before we book a call. Half the time the doc is the answer." },
          { title: "Direct feedback is a kindness", note: "I’ll tell you what I actually think about the work. Please do the same; I don’t bruise." },
          { title: "Show the ugly draft", note: "I’d rather react to a rough thing on Tuesday than a polished thing on Friday." },
          { title: "Decisions get written down", note: "If we decided it in a meeting and didn’t record it, we didn’t decide it." },
          { title: "Mornings are for making", note: "I keep 10:00–12:00 meeting-free when I can. Ping me anytime after." },
        ],
      },
    },

    {
      id: "outside",
      emoji: "🌿",
      eyebrow: "Off the clock",
      title: "Outside work",
      layout: "tags",
      visible: true,
      content: {
        note: "Roughly in order of how much of my weekend they eat:",
        tags: [
          "Bouldering", "Film photography", "Sourdough (ongoing feud)",
          "Cycling the canal", "Secondhand bookshops", "Cooking for too many people",
          "Modular synths", "Long walks with no podcast",
        ],
      },
    },

    {
      id: "currently-into",
      emoji: "📌",
      eyebrow: "This month",
      title: "Currently into",
      layout: "metadata",
      visible: true,
      content: {
        rows: [
          { label: "Reading", value: "“The Timeless Way of Building”, slowly, on purpose" },
          { label: "Listening", value: "Hania Rani, and one techno playlist I won’t defend" },
          { label: "Watching", value: "Anything by the Maysles brothers" },
          { label: "Learning", value: "Enough Rust to be dangerous, not yet useful" },
          { label: "Eating", value: "The döner two streets over. No further questions." },
          { label: "Building", value: "A tiny weather display for my desk that lies less than the app" },
        ],
      },
    },

    {
      id: "fun-facts",
      emoji: "🎲",
      eyebrow: "Trivia",
      title: "A few facts",
      layout: "facts",
      visible: true,
      content: {
        facts: [
          {
            fact: "I can read old German blackletter type surprisingly fast.",
            detail: "Side effect of a summer spent digitising a print archive. Genuinely useless, occasionally magic at flea markets.",
          },
          {
            fact: "I’ve visited 40+ typography museums and printing workshops.",
            detail: "It started as a hobby and quietly became the reason I plan trips at all. Ask me where to eat near any of them.",
          },
          {
            fact: "I’m embarrassingly bad at remembering film titles.",
            detail: "I’ll describe the whole plot, the lighting, and one specific shot, and still call it “the boat one”.",
          },
        ],
      },
    },

    {
      id: "talk-to-me",
      emoji: "💬",
      eyebrow: "Conversation",
      title: "Ask me about",
      layout: "list",
      visible: true,
      content: {
        style: "loose",   // "loose" = lighter rows, good for prompts
        items: [
          { title: "Why your favourite website’s type feels “right”", note: "" },
          { title: "How to name things so future-you doesn’t hate present-you", note: "" },
          { title: "Where to boulder near the office (and which gym has the good coffee)", note: "" },
          { title: "Mechanical keyboards, but set a timer, genuinely", note: "" },
        ],
      },
    },

    {
      id: "favorites",
      emoji: "⭐",
      eyebrow: "Picks",
      title: "Favourites",
      layout: "favorites",
      visible: true,
      content: {
        items: [
          { label: "Book", value: "Invisible Cities, by Italo Calvino" },
          { label: "Film", value: "Paris, Texas" },
          { label: "Album", value: "Laughing Stock, by Talk Talk" },
          { label: "Game", value: "Outer Wilds (don’t spoil it)" },
          { label: "Place", value: "Any night train, top bunk" },
          { label: "Tool", value: "A mechanical pencil and a printed grid" },
        ],
      },
    },

    // ---- A CUSTOM SECTION. This is the point of the whole system: it isn't a
    //      predefined field. Rename it, change the layout, write whatever.
    {
      id: "collections",
      emoji: "🗃️",
      eyebrow: "Custom",
      title: "Things I collect",
      layout: "list",
      visible: true,
      content: {
        style: "loose",
        items: [
          { title: "Old transit maps", note: "Especially systems that no longer exist." },
          { title: "Weird packaging", note: "The design crimes are the good part." },
          { title: "Tiny notebooks", note: "Bought, admired, never written in." },
          { title: "Photographs of doors", note: "I have no explanation and I’ve made peace with it." },
        ],
      },
    },

    // ---- A SECOND CUSTOM SECTION, different layout, to prove the point.
    {
      id: "opinion",
      emoji: "🔥",
      eyebrow: "Custom",
      title: "A very specific opinion",
      layout: "quote",
      visible: true,
      content: {
        quote: "Most “simple” interfaces are just complexity someone else had to memorise. Real simplicity is expensive, and worth it.",
        cite: "held with mild aggression since roughly 2019",
      },
    },

    {
      id: "learning",
      emoji: "🌱",
      eyebrow: "In progress",
      title: "Currently learning",
      layout: "compact",
      visible: true,
      content: {
        items: ["Rust", "Reading proofs (again)", "Bouldering V5", "Saying no to meetings", "German dative case"],
      },
    },

    // ---- CAREER as a progress line. layout "timeline"; each node clicks open.
    {
      id: "career",
      emoji: "🧭",
      eyebrow: "The path here",
      title: "Career so far",
      layout: "timeline",
      visible: true,
      content: {
        milestones: [
          { year: "2016", emoji: "🎓", title: "Graduated, then made websites nobody asked for", note: "A design degree and a stubborn habit of shipping side projects on weekends." },
          { year: "2018", emoji: "✏️", title: "Product Designer, Kettle", note: "Learned that a design is only real once someone has to build it. Started reading the codebase." },
          { year: "2021", emoji: "⚙️", title: "Design Engineer, Northwind", note: "Crossed the fence for good: owned the design system end to end, from Figma tokens to shipped CSS." },
          { year: "2026", emoji: "🚀", title: "Design Engineer, Platform Interfaces", note: "Where I am now — rebuilding the component library so design and engineering finally share one source of truth." },
        ],
      },
    },

    // ---- EDUCATION + background. Reuses the "metadata" layout — no new code.
    {
      id: "education",
      emoji: "🎓",
      eyebrow: "Background",
      title: "Education & the rest",
      layout: "metadata",
      visible: true,
      content: {
        rows: [
          { label: "Degree", value: "BA Communication Design, HfG Karlsruhe" },
          { label: "Also studied", value: "One year of CS before switching — kept the useful half" },
          { label: "Certified", value: "Nielsen Norman UX; too many typography workshops" },
          { label: "Languages", value: "English (native), German (working), CSS (fluent)" },
          { label: "First computer", value: "A hand-me-down running an OS I wasn't allowed to reinstall" },
        ],
      },
    },

    // ---- PLACES I'VE BEEN. layout "countries"; a flag grid with a live count.
    {
      id: "countries",
      emoji: "🗺️",
      eyebrow: "On the map",
      title: "Countries I've been to",
      layout: "countries",
      visible: true,
      content: {
        note: "Work trips, typography museums, and one very long train year. Dashed = still on the list.",
        countries: [
          { name: "Germany", flag: "🇩🇪" },
          { name: "France", flag: "🇫🇷" },
          { name: "Italy", flag: "🇮🇹" },
          { name: "Portugal", flag: "🇵🇹" },
          { name: "Netherlands", flag: "🇳🇱" },
          { name: "Japan", flag: "🇯🇵" },
          { name: "Iceland", flag: "🇮🇸" },
          { name: "Morocco", flag: "🇲🇦" },
          { name: "Brazil", flag: "🇧🇷", been: false },
          { name: "Vietnam", flag: "🇻🇳", been: false },
        ],
      },
    },

    {
      id: "links",
      emoji: "🔗",
      eyebrow: "Find me",
      title: "Links",
      layout: "links",
      visible: true,
      content: {
        // Placeholder links — swap href/value for the real ones.
        links: [
          { label: "Email", value: "ally.smith@example.com", href: "mailto:ally.smith@example.com", copy: true },
          { label: "Slack", value: "@ally", href: "#" },
          { label: "GitHub", value: "github.com/example", href: "#" },
          { label: "Site", value: "example.com", href: "#" },
          { label: "Internal", value: "people/ally-smith", href: "#" },
        ],
      },
    },

  ],

  /* ---- THEME  —  the knobs that make it yours --------------------------- */
  theme: {
    preset: "paper",        // paper | archive | technical | dark
    fonts: "editorial",     // editorial | grotesk | humanist | classic | display | archivo
    accent: "",             // "" → preset's accent, or set e.g. "#9A3428"
    bg: "",                 // "" → preset's page colour, or set e.g. "#EFE9DA"
    surface: "",            // "" → preset's card colour, or set e.g. "#FBF8F1"
    density: "comfortable", // compact | comfortable | airy
    orientation: "scroll",  // scroll (vertical) | landscape (horizontal card deck)
    mode: "professional",   // professional | fun (emoji, timeline, springier motion)
    background: "grid",     // backdrop pattern: plain | grid | dots | graph
    photo: "square",        // avatar frame: square | circle | blob
    sectionNumbers: true,   // the "02 /" catalogue marks
  },
  // Tip: open “Customise” (bottom-right) to try themes, fonts and colours live,
  // turn on “Edit text” to type directly on the page, drop a photo on the avatar,
  // then “Export HTML” for a standalone file. Copy anything you like back here.

};
