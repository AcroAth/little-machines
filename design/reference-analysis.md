# Reference analysis — what Mathigon and Nicky Case actually do

*2026-07-23. Method: live inspection of mathigon.org (Circles & Pi course — DOM component census, computed styles, interaction behavior), Mathigon Studio authoring docs, the `mathigon/textbooks` course source (circles/content.md), ncase.me/trust + /polygons live, and the `ncase/trust` source repo. Written after the project's first two prototypes were rejected as AI slop — correctly. This document defines the quality bar.*

---

## Part 1 — Mathigon: the container

### 1.1 The step contract: the page grows as you learn

The single most important structural fact: a Mathigon lesson is **gated**. The fox tutor (Archie) greets you and states the contract in his first speech bubble: *"Our content is divided into small steps. You have to complete the activities to reveal what's next."* Scroll past your frontier and the page simply **ends** — un-earned steps aren't grayed out, they don't exist yet. The Circles introduction alone is 18 `x-step` elements, each unlocked by goals (answering a blank, using the compass, hovering a target). A "Reveal all steps" escape valve and a "Reading time: ~35 min" badge respect the reader's autonomy and time.

**Contrast with our prototypes:** everything visible at once. No authored pacing at all.

### 1.2 The authoring vocabulary (from the Studio docs + course source)

The complete grammar an author writes lessons in — this is prior art for the book's lesson format, and the bar for what "toolbox" means:

**Inline, inside sentences:**
- Blanks: `[[correct|wrong1|wrong2]]` (multiple choice mid-sentence), `[[100 ± 5]]` (numeric with tolerance), hints `[[100 (hint)]]`
- Draggable inline variables: `${a}{a|2|-8,8,2}` — a number in the prose you drag, and every diagram bound to it updates
- Glossary: `[word](gloss:id)` → tap for a popover definition (11 uses in one section)
- Biographies: `[Ptolemy](bio:ptolemy)` → historical figures as popovers
- **Target pointers: `[these circles](->#geo1 .circle)` — tapping words highlights the matching element in the diagram.** Prose and figure are one fabric, physically cross-referenced
- Colored pills `[text](pill:red)` — the word wears the same color as the diagram element it names
- Action links `[try it](action:fn())`
- Equations are first-class: AsciiMath with blanks, inputs, pills, and variables *inside the math*

**Components (live census, one section):** `x-geopad` (draw and drag actual geometry), `x-solid` (3D), `x-slider`, `x-var`, `x-img`, `x-video`, `x-play-btn`, `x-gesture` (**an animated hand that shows you where to touch** — an invitation, not a label), `x-gloss`, `x-bio`, `x-tutor`, `x-progress`, `x-modal` — and `x-pi-scroll`, a component that exists **for one moment in one course** (an endless scroll of π's digits).

**Step metadata:** `goals:` (events that unlock the next step), `.reveal(when="blank-0 compass")`, per-course `color:`, a `trailer:` video. Narration exists via automatic TTS with `{.no-voice}` opt-out — for this book we invert this: silent by design.

### 1.3 The lesson from `x-pi-scroll`

Mathigon's toolbox is **not fixed**. It's a core grammar (blank / var / gloss / target / slider / geopad) plus **bespoke one-off instruments built wherever the lesson's key moment demands one**. The "curated library vs bespoke code" fork we agonized over is a false binary in the reference: the answer is *both, with the library as the substrate* — exactly the staged hybrid, but with a far higher bar for what a component is.

### 1.4 Visual language

- **Typography is plain**: Source Sans Pro everywhere, 18px/1.6 body, 40px/600 h1. The personality does NOT come from fonts — it comes from color, illustration, and interaction.
- **Per-course theme hue** (Circles: `#5A49C9`), used for links, pills, progress, diagram accents. Each course feels like its own book in a matched set.
- White ground, generous whitespace, **no cards**. Figures sit inside the text column as full citizens, not boxed exhibits.
- Custom illustration and photo collages everywhere (orbits, flowers, planets, soap bubbles); a mascot with speech bubbles; octagonal progress badges.

### 1.5 Prose voice

The Circles course opens: *"For as long as humans have existed, we have looked to the sky and tried to explain life on Earth using the motion of stars, planets and the moon."* Wonder first. History woven through (Ptolemy, Greek astronomers). Second person throughout. Questions to the reader ("Can you think of anything else?"). Concrete anchors (a 100 m rope). And crucially: **experience before terminology** — you unroll a wheel of diameter 1 and *watch* the circumference measure π before anyone writes C = πd.

---

## Part 2 — Nicky Case: the soul

### 2.1 Two forms

- **Trust**: a full-bleed fixed **stage** — no page scroll, no chrome, "**playing** time: 30 min", hand-lettered title. A theater.
- **Polygons**: a "**playable post**" (their own genre name, in the page title) — a scroll article where full-width sims interrupt the text.

### 2.2 The subject is a character

Polygons' shapes have eyes, mouths, little legs; the triangle you must help is visibly sad. Trust's strategies are *personalities* — Copycat, Grudger, the Detective — not labeled algorithms. The reader's empathy is enlisted as a learning instrument. Emotional stakes are the hook: Polygons opens *"This is a story of how harmless choices can make a harmful world."* Story first, always.

### 2.3 Narrative structure (the Case formula)

1. Cold open with stakes, in one sentence.
2. **Play before explanation** — you drag unhappy polygons before "segregation model" is ever named; the first instruction is hand-lettered with an arrow drawn *into* the sim: "DRAG & DROP THE UNHAPPY POLYGONS."
3. One lever per beat; each scene adds exactly one mechanic.
4. A twist (Trust: noise/mistakes enter and break the winning strategy).
5. A free **sandbox** after the guided arc.
6. A moral addressed to *you*, then generous credits.

### 2.4 Craft details

Squash-and-stretch juice on every interaction; humor in microcopy; hand-drawn display lettering over plain body text; instructions that physically point. Sound and music do real emotional work in Case's pieces — **this book drops audio by constraint, so motion and visual feedback must carry that warmth instead** (a design problem to solve deliberately, not ignore).

### 2.5 Engineering shape

Trust separates ~3,300 words in `words.html` from PIXI.js game logic — which is why 40+ community translations exist. Even the fully bespoke end of the spectrum separates **content from mechanics**. Small per-piece codebases, tweened easings, open source.

---

## Part 3 — The shared DNA: an operational definition of "quality"

1. **The subject itself is directly manipulable** — you drag the geometry / the polygon / the token, never an admin control beside a picture of it.
2. **Pace is authored** — gated steps or narrative scenes. Never a wall of everything at once.
3. **Prose and interactive are one fabric** — blanks and draggable numbers live inside sentences; words highlight diagram elements; instructions point into the sim.
4. **Experience precedes terminology.**
5. **A designed identity** — theme hue, illustration language, characters/mascot, motion personality. Zero default-looking controls anywhere.
6. **Warmth** — second person, humor, wonder, celebration of progress.
7. **Reader autonomy respected** — reveal-all escape valve, sandboxes, reading/playing time disclosed.

---

## Part 4 — Why the two prototypes are slop, precisely

Judged against the bar:

| Reference DNA | Prototype A (toolbox) | Prototype B (codegen) |
|---|---|---|
| Subject directly manipulable | Buttons *about* tokens ("Merge top pair") | Tap-to-select tiles — closer, still button-driven |
| Authored pacing / gating | None — full scroll dump | None — six cards, all visible |
| Prose ∩ interactive one fabric | Strictly alternating blocks; text never touches figures | Same |
| Experience before terminology | Lecture order preserved | Slightly better (predict-first) but card-labeled like a syllabus |
| Designed identity | Generic neutral + blue/purple, default controls | **The named slop palette** (warm cream + teal), numbered kicker cards |
| Warmth / character | Competent, bodiless | Some voice, no characters |
| Craft density | Default range inputs, pill chips, stat tiles | Same grammar, more polish |

Both pages are **dashboard grammar** — cards, kickers, chips, stat tiles, segmented controls — a grammar that appears nowhere in either reference. The root cause is upstream: **my briefs specified that grammar** (cards, chips, cite pills, 680px block stack, system-ui). Both agents hit their spec. The spec was the slop.

---

## Part 5 — What changes for the project

1. **A design system comes first, and it's an art-direction task, not compiler output.** Identity per "book" (theme hue system like Mathigon's per-course colors), one warm workhorse text face + a hand-drawn display accent for instruction moments, an illustration/character language for CS-land (bytes and tokens can have faces — Polygons proves advanced audiences accept "cuties" when the model underneath is real), and a motion language that replaces sound as the warmth channel. Silent, always.
2. **The lesson format needs Mathigon's grammar, not a block stack:** gated steps with goals; inline blanks, draggable variables, and glossary popovers *inside prose*; target-pointers binding words to diagram elements; scene beats; a sandbox block; per-lesson hue.
3. **The component bar rises an order of magnitude.** A widget is an *instrument you play* (geopad-grade), not a form you operate. For this book, the geopad-equivalent is probably a direct-manipulation "token pad" — drag tokens together to merge them, tear merged tokens apart, with gesture hints.
4. **The fork conclusion survives, transformed.** Core grammar + domain instruments = the curated substrate; one-off bespoke components per lesson moment (the `x-pi-scroll` pattern) = the escape hatch, generated-then-reviewed in our case. What neither strategy provides — and what actually separated the references from our prototypes — is the **design system and the pacing model**. That's the missing layer.
5. **Process inversion: craft the north star first.** Next build is ONE hand-crafted lesson page, art-directed to pass the test "could this sit inside Mathigon without embarrassment / would Case recognize the spirit" — iterated visually, no throwaway briefs. Only after it exists do we extract the schema and ask what a compiler can fill.
6. **Anti-slop gates for all future work on the project:** no content-in-cards; no default form controls; no numbered kicker labels; no stat tiles; text must touch figures (≥1 target-pointer per section); gating present; wonder-opening present; the subject manipulable within the first screen; palette chosen per-book, never cream+teal-by-default.

*Honest limits: inspected at ~590px width; Trust's full 30-minute arc replayed from repo knowledge rather than end-to-end this session; Mathigon's paid/tutor features not exercised.*
