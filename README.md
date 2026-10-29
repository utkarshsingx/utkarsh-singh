# utkarsh-singh

Second personal site for **Utkarsh Singh** — a technical-drawing portfolio:
crosshair frame, hatch rules, one teal signal.

Live: **https://utkarsh-singh.netlify.app/**
Companion site: [utkarshsingx.github.io](https://utkarshsingx.github.io/) (field-report layout)

## Stack

Static HTML, CSS and vanilla JS with no build step. One third-party library:
[Matter.js](https://brm.io/matter-js/) drives the tumbling pill pile in `stack.`,
loaded from cdnjs with subresource integrity.

```
index.html          every section, in order
assets/styles.css   tokens + layout (dark default, light theme)
assets/data.js      heatmap, stack pills, command-palette targets
assets/main.js      theme, clock, heatmap, type-spec overlay, physics, palette
assets/work/*.jpg   live screenshots of each linked project
scripts/refresh.sh  re-pulls the GitHub numbers
```

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

- **Type-spec overlay** on the hero name. Cap height, x-height, baseline and
  descender are *measured*, not guessed: a zero-width inline probe gives the
  exact baseline, and canvas `TextMetrics` gives the rest from the rendered font.
  Resize or switch theme and it re-measures.
- **Contribution heatmap** built from real daily counts, with level thresholds
  taken from quartiles of non-zero days.
- **Physics stack** — Matter.js runs the simulation, but the pills are real DOM
  so they keep the page's font and theming. Falls back to a static pill list if
  the CDN is blocked.
- **Command palette** — `⌘K`, `/` or `?`.

## Running it locally

```bash
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
