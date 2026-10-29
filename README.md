# utkarsh-singh

Second personal site for **Utkarsh Singh** — a technical-drawing portfolio:
crosshair frame, hatch rules, one teal signal.

Live: **https://utkarsh-singh-dev.netlify.app/**
Companion site: [utkarshsingx.github.io](https://utkarshsingx.github.io/) (field-report layout)

## Stack

Hand-written HTML, CSS and vanilla JS for the page itself, plus one compiled
React island for three [React Bits](https://reactbits.dev) components.

| Component | Where | What it does |
|---|---|---|
| `TechText` | hero | The wordmark, drawn on canvas with live font metrics — cap height, x-height, baseline, descender — a selection frame that glides between glyphs, and letters you can drag or kick. |
| `FallingText` | `stack.` | Every tool in the stack as a tile that drops, piles up, and springs back into place. |
| `TargetCursor` | everywhere | A reticle that locks onto anything tagged `.cursor-target`. Fine pointers only, so touch is untouched. |

```
index.html            every section, in order
assets/styles.css     tokens + layout (dark default, light theme)
assets/data.js        heatmap and command-palette data
assets/main.js        theme, clock, heatmap, nav, palette, cursor targets
assets/work/*.jpg     live screenshots of each linked project
src/*.tsx             the React Bits components, unmodified
src/island.tsx        mounts them and feeds them the design tokens
scripts/refresh.sh    re-pulls the GitHub numbers
```

The components are copied in verbatim so they can be refreshed from React Bits
later; everything site-specific lives in `src/island.tsx`. Tailwind is built with
preflight **off** — the components need its utilities, but the rest of the page
has its own design system and must not be reset.

## Build

```bash
npm install
npm run build      # tailwind utilities -> assets/tailwind.css, island -> assets/techtext.js
npm run watch      # rebuild the island on change
```

Netlify runs `npm ci && npm run build` on deploy, so the two build outputs are
gitignored.

## Design system

| Token | Dark | Light |
|---|---|---|
| Surface | `#0e0e11` | `#e9e9ec` |
| Ink | `#f4f4f6` | `#121217` |
| Rule | `#26262b` | `#d2d2d8` |
| Signal | `#49ab9e` | `#266b61` |

Type: **Outfit** (display and body), **Geist Mono** (labels and data). The light
theme re-steps the teal to `#266b61` so it clears WCAG AA on a cream surface —
it is not an inverted dark theme.

## Notable pieces

- **Contribution heatmap** built from real daily counts, with level thresholds
  taken from quartiles of non-zero days.
- **Command palette** — `⌘K`, `/` or `?`.
- **Theme-aware components.** `main.js` dispatches a `themechange` event after
  flipping `data-theme`; the island listens and re-renders the React Bits
  components with the new `--fg` and `--accent` token values, because canvas
  `fillStyle` cannot resolve a CSS variable.

## Running it locally

```bash
npm install && npm run build
python3 -m http.server 4188
# → http://localhost:4188
```

## Refreshing the numbers

```bash
./scripts/refresh.sh      # needs: gh auth login
```

Prints the heatmap array, the contribution total and merged-PR counts per repo.
Paste the array into `assets/data.js` and update the matching figures in
`index.html` (the `merged.` stat chips and repo cards).
