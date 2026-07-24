# Spec — the cover and the contents page ("Language, from scratch")

*2026-07-24. Two NON-unit pages that give the book a front door and a spine: (1) **the cover** — title, an "enter" mark, and the cast so far spread across an intentionally underpopulated page; (2) **the contents page** — the book's living table of contents, linking the three built units. One spec for the pair (deviation from one-spec-per-unit noted: they ship together and share every idiom). **All rules in the `unit-page` skill apply** (`skill/unit-page.md` — read it first); this file carries only what is specific to these two pages.*

---

## 0. What these pages are NOT

Not lessons. **No gating, no beats, no goals, no progress rail, no "Reveal all steps", no reading-time meta, no frontier cue.** They are static surfaces in the book's design language. The craft budget goes to composition, the cast's idle life, and restraint. The cover is a *place*; the contents page is a *manuscript's index*. Neither may read as a web landing page or a link dashboard.

## 1. Shared DNA (non-negotiable)

- Copy **verbatim** from `book/language-modeling.html` (current DNA source): the `@font-face` Patrick Hand data-URI block, the full `:root` + `@media (prefers-color-scheme: dark)` + `[data-theme]` token blocks, and the shared idiom classes you use (`.hand`, `.note`, focus-ring rules, `.underline-input` not needed here). Verify identity with a diff/md5 against the source in build notes — do not retype.
- The UNK-gray tokens (`--gray`, `--gray-fill`) may be absent from language-modeling's `:root`; port them **verbatim from `book/bpe-north-star.html`** (they are the blob's colors) into both light and dark blocks, keeping BPE's dark values.
- Fragment structure: `<meta charset="utf-8">` first line, one `<style>`, content, one `<script>`. No doctype/html/head/body. Zero external resources. Vanilla JS + inline SVG. ≤300KB per file. Works as a raw local file AND as a hosted static page.
- Both themes designed; full `prefers-reduced-motion` path (`.reduced` class pattern from the DNA source). Silence absolute.
- Body: system-ui 18px/1.65; column 40rem where a column exists. Patrick Hand for hand-lettered annotations ONLY. Gold = touch invitation ONLY. Green absent (no goals here). Gray belongs to the blob alone.

## 2. The cast (port, don't redraw)

- **The little machine** — port `machineSVG()` from **`the-bitter-lesson.html`** (~lines 574–587) byte-identical: it is the most evolved drawing — LM's base geometry unchanged PLUS the two per-eye ellipse lids (`m-lid`, a later review-round addition; one lid per eye shaped like the eye). Port TBL's full `.mch` CSS block (~lines 154–183): expressions `idle/think/surprised/settle/blink/nap`, lid transform-origin `center top` (lids close downward — TBL corrected this), reactions `pop/gasp` (≤320ms), `.mch-say` speech grammar. **Idle life:** use the interval idiom from `language-modeling.html` ~line 1255 (every ~4.2s, random half of idle machines, ≈130–160ms flash) but toggle **`blink`** so the ported lids actually close — note: LM's own loop flashes `think` because LM's machine has no lid elements (its `.blink` CSS is dead code there; do not reproduce that mismatch).
- **The UNK blob** — port the beat-2 blob geometry from `bpe-north-star.html` `buildUnkScene` (~lines 788–835): the gray lump path + the two tired ellipse eyes, exactly its drawing language (ink stroke widths, `--gray`/`--gray-fill`). **Omit the mono "UNK" text label on the cover** — deliberate: the cover must carry no initialism the reader hasn't been taught; the blob is just the gray tired lump here. Give its eyes a slow sleepy blink (scaleY lid or eye-squash ≤300ms, every ~7s, distinct from the machine's brisk blink).
- Character reactions are **moments, not states**: every touched expression sets an unconditional timer back to the current resting pose (earned rule). Reduced motion: reactions and blinks off; static poses only.

## 3. Page 1 — the cover (`book/cover.html`)

**Concept.** The book's front door. One quiet viewport: the title, one line of promise, a hand-drawn "enter" mark, and the two characters who exist so far, spread across a deliberately underpopulated field. The emptiness is the design: the cast grows as chapters open, and the page says so in one hand-lettered whisper. Mood: the cover of a beloved children's hardback, not a product hero section.

**Composition (1280×800 reference).** Full-viewport field (the one page that is not a column), plain ground, no scroll at reference size (soft goal; never clip):
- **Title block**, centered on the column axis, vertically in the upper-middle third: `<h1>Language, from scratch</h1>` (~clamp(2.6rem, 6.5vw, 3.6rem), weight 700, `text-wrap:balance`), beneath it one promise line in `--ink2` (~1.1rem): **"how a machine learns to read, to guess, and to write — told in pages you can touch"**. No eyebrow, no meta, no sources.
- **The enter mark**, ~2.2rem below the promise line, on the same axis: the word **`enter`** in Patrick Hand, gold text (`--gold`), ~1.6rem, wrapped in a hand-drawn SVG ellipse (wobbly path, 2px stroke, `--gold-mark`) — the same drawn-ink language as BPE's start-over arrow. This is a **real `<a>`** with `href="__CONTENTS_URL__"` and `target="_top"` — native click/middle-click/keyboard semantics, visible focus ring (the book's standard gold outline). Invitation idiom: the mark does the book's subtle wiggle (±1.5°, ~600ms) every ~4s until first hover/focus, then rests. Hover/focus: the ellipse re-draws itself once (stroke-dashoffset, ~300ms) and ink of the word deepens slightly. Reduced motion: no wiggle, no redraw; a static gold underline appears under the word instead. No exit transition — navigation is native and instant.
- **The machine**, lower-left region (~12–18% from left, ~68–78% down), ~64px, standing on its feet, **pupils shifted toward the enter mark** (it wants you to go in). Idle: blink loop. On click/tap/Enter/Space: `pop` reaction + a `.mch-say` aside near it: **"it guesses what comes next"** (visible ~4s, then fades; unconditional timer back to idle).
- **The blob**, upper-right region (~10–16% from right, ~14–22% down), ~70px wide, sitting at a distance, gazing off-page (away from the enter mark — it would rather you didn't). Idle: the slow sleepy blink + a barely-there breathing scale (≤1.015, ~5s cycle; off under reduced motion). On activation: a soft squish (squash-stretch ≤320ms) + aside: **"it swallows what it doesn't know"**.
- **The cast whisper**, placed in the emptiest region (lower-right quadrant works at reference size): hand-lettered `--ink2`, ~1.05rem, rotate ≈ −1.5°: **"the rest of the cast hasn't been written yet"** followed by three breathing gold dots (the frontier-cue dot idiom: `cueDot` timing, staggered; static full-opacity under reduced motion). Whisper register exactly like the frontier cue: words in ink2, only the dots gold.
- Both characters: `role="button"`, `tabindex="0"`, descriptive `aria-label` ("the little machine — say hello" / "the gray blob — say hello"), Enter/Space triggers the same reaction; asides mirrored to one `aria-live="polite"` region. If a `pointerdown` handler calls `preventDefault()`, it must call `.focus()` itself (ported fix history).
- **375×812**: single-column vertical flow — title upper third, enter mark below it, blob upper-right at ~54px, machine lower-left at ~56px, whisper near the bottom; nothing overlaps text at any width 320–1600px (characters positioned with % + clamp; media-query slots at ≤480px). Everything reachable; enter above the fold at both reference sizes.
- On-load entrance (cosmetic): title → promise → enter → characters fade in staggered ≤900ms total; under reduced motion everything is simply visible (no animation — this is an on-load decoration, not a beat reveal).

**Voice.** The cover teaches nothing and names nothing. No "UNK", no "token", no "language model". The two asides use only game-language the units themselves open with.

## 4. Page 2 — the contents page (`book/contents.html`)

**Concept.** The book's spine made visible: what is open now, in the order the source gives, with the unwritten parts honestly marked as gaps in a living manuscript. One 40rem column, quiet throughout. Exactly one gold mark on the page.

**Composition, top to bottom:**
- Eyebrow (`.eyebrow` grammar): `Language, from scratch` · h1: **Contents** · one intro line in body ink: **"Chapter one is open. The rest follows the course this book is built from, one chapter per lecture, opening as it's written."**
- **Chapter one** section heading (weight 600, ~1.35rem, hairline rule above it per DNA page section rhythm if any; no cards, no boxes). Beside the heading sits a ~44px machine, purely decorative (`aria-hidden="true"`, no handlers, idle blink only) — chapter one's protagonist at home.
- The unit list, source order, as **prose entries** (not boxes; generous line spacing, ~1.4rem between entries). Each built entry:
  - Title as a real link, ink text, weight 600, ~1.25rem, `border-bottom:2px solid var(--ink)`; hover/focus: border-color → `--gold`; `target="_top"`; visible focus ring. Visited styling unchanged.
  - One description line in `--ink2`, then ` · ~N min` in small `--ink2` at its end.
  - Entries (titles, times, and hrefs are LOCKED — byte-exact):
    1. **The guessing game** — "You guess what comes next; a little machine that read one lecture guesses beside you." · ~12 min → `language-modeling.html`
    2. **Bigger or cleverer?** — "The rumor says the machines just got bigger. Grab both levers and see what really carries them." · ~7 min → `the-bitter-lesson.html`
    3. **How a computer learns to read** — "Cold numbers fuse into warm words; you teach a machine its first vocabulary." · ~12 min → `bpe-north-star.html`
  - Between entry 2 and entry 3, a **gap note** in the hand register (Patrick Hand, `--ink2`, ~1.05rem, slight rotate): **"two pages are still being written here…"** — its trailing three dots use the breathing gold dot idiom. After entry 3, a second gap note: **"…and two more to close the chapter."** (no dots — the ellipsis opened the gap, this one closes it).
- **start here** — the page's single gold mark: hand-lettered gold **"start here"** with a short drawn SVG arrow (arrow-geometry rules from the skill apply: shaft stops 4–5px short of the apex, approach along the barbs' bisector) pointing at entry 1's title. Anchored inside entry 1's block (non-wrapping unit) so it points true at every width 320–1600px.
- After chapter one, the **beyond line**, body ink: **"Seventeen more chapters follow — how these machines are built, trained, fed, and judged. Each opens as it's written."**
- Footer (`.foot` grammar from the DNA page): **"The book's spine is Stanford's CS336 course — one chapter per lecture."** and on its own quiet line a plain ink2 link **"the cover"** → `href="__COVER_URL__"`, `target="_top"`.
- No numbering on entries. No per-unbuilt-unit listings (the gaps carry them). No progress indicators.
- On-load entrance mirroring the cover's (staggered fades ≤900ms; instant under reduced motion).

**Voice.** Zero unglossed terms of art. The descriptions above are locked; do not add technical vocabulary anywhere on the page.

## 5. Cross-page links (the placeholder contract)

- Unit-page hrefs: the three real page paths above, exact.
- Cover → contents: literal placeholder string `__CONTENTS_URL__`. Contents → cover: literal `__COVER_URL__`. The placeholders are replaced with the real paths once they're known; ship the placeholders exactly once each, in `href` position only.
- All cross-page anchors: `target="_blank"` + `rel="noopener"`. No intra-page hash links anywhere. **(AMENDED post-review 2026-07-24: the preview environment used during development sandboxed the page and blocked BOTH `_top` and `_blank` navigation; links were inert there by platform design and work only outside it (local file / the real host). `_blank` kept as the future-proof choice. See build notes.)**

## 6. Acceptance gates (self-verify headlessly; report per-gate in build notes; NO browser use)

1. **DNA identity:** extracted `@font-face` + token blocks byte-identical to `language-modeling.html`'s (md5s in notes); gray tokens byte-identical to `bpe-north-star.html`'s.
2. **Cast identity:** `machineSVG()` path data byte-identical to **`the-bitter-lesson.html`'s** (the lidded variant); blob geometry byte-identical to beat-2's lump+eyes (UNK text omission noted as deliberate); expression/reaction CSS ported with fix history (unconditional return-to-idle timers; `animationend` cleanup listener if any entrance animation classes are used — port the document-level cleanup idiom).
3. **Anti-slop grep + eye:** no cards/borders-around-prose/stat tiles/pill chips/numbered kickers/default-styled controls/emoji in UI/hero gradients; `enter` is a drawn mark, not a rounded-rect button; no stray hues (gray only on the blob; green absent).
4. **Locked strings:** the three unit hrefs byte-exact; titles "The guessing game" / "Bigger or cleverer?" / "How a computer learns to read" byte-exact; times ~12/~7/~12; placeholders `__CONTENTS_URL__` and `__COVER_URL__` present exactly once each, in href position.
5. **Honesty/fidelity:** every factual sentence on both pages checks against `book-plan.md` and the built pages (17-more-chapters count from 18 total; one-chapter-per-lecture; "Stanford's CS336" matches the units' own usage; unit descriptions describe what the pages actually do). Claim→anchor table in notes. No invented chapter titles, years, names, or numbers.
6. **Jargon sweep:** caps/initialism grep over reader-visible text of both pages — zero unglossed terms of art; "UNK" absent from the cover entirely.
7. **Interaction matrix:** enter mark + both characters + all links: mouse, touch, keyboard (Enter/Space), visible focus, `aria-live` asides announced; no keyboard trap; nothing pointer-only.
8. **Layout:** no character/text overlap at 320, 375, 768, 1280, 1600 widths (probe with computed positions headlessly if possible, else reasoned + flagged); enter above the fold at 1280×800 and 375×812.
9. **Motion:** full reduced-motion path (static poses, no wiggle/blink/breathing/dots-breathing, on-load instant); normal path timings within the book's register (nothing >900ms total on load; reactions ≤320ms).
10. **Engineering:** charset first line; single style/script; no external requests; ≤300KB each; console clean on load + poking every interactive element (verify with a DOM-less parse or note as unverifiable-headlessly); seeded/no RNG (none needed).
11. **Feel check, honestly answered:** does the cover read as a book's front door with two small residents — quiet, warm, a little empty on purpose? Does contents read as a living manuscript's index, not a link list?

## 7. Out of scope (do not build)

Retrofitting navigation into the three unit pages; chapter titles; listings for unbuilt units beyond the gap notes; progress/localStorage; theme toggle UI; search; any gating; any sound; any new characters (the whisper promises them — the pages must not invent them).
