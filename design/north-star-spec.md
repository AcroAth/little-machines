# North-star spec — "How a computer learns to read" (BPE lesson)

> **AMENDMENTS round-7 scope (2026-07-23, author-directed; the full-motion review PASSED the same day — the author approved all existing motion timings, builders must NOT retune them):** Author directive after the IDSA teardown (`reference-idsa.md`): **playable animated demonstrations are essential to this project** (IDSA's play+scrub visualizations; VisuAlgo's play/step/scrub grammar named as a second confirming reference). Doctrine adopted: the book's instruments come in two families — **manipulables** (the reader is the algorithm: pads, drags) and **playable runs** (the algorithm performs on real data; the reader plays, pauses, and scrubs time in both directions). Every algorithmic unit should carry at least one playable run; hands-on always precedes playback (play-before-terminology holds). Scope for this page:
>
> 1. **Beat 5 becomes the run rail.** The Tangle dragnum + sparkline upgrade from endpoint-recompute to a **time-travel scrub over a recorded BPE training run** on real data the page names (the page's own opening paragraph). At playhead `n`: the current rule chip is born beside the sentence wearing its genuine count (`e + r → er — seen 14×`); the paragraph re-tokenizes to exactly state-`n` (fusions scrubbing forward, splits scrubbing back); a one-line caption narrates the step; the sparkline (tokens-remaining curve) stays as the rail, its dot the playhead. A small drawn play/pause glyph (ink SVG, never a default control) auto-advances at ~2.5 steps/s, pausing on any reader interaction. Keyboard: arrows ±1, Home/End. `n_max` chosen so every recorded merge still has count ≥2 — no degenerate tail. Goal g5 unchanged plus: played or scrubbed at least once. The rail is column-native — **no exhibit frame** (IDSA's boxed "Visualization:" panels are explicitly rejected).
> 2. **Caption channel in the pads (beats 4/6/8):** one quiet secondary-ink line under the pad narrating the latest event with its real numbers ("`t`+`h` appeared 6 times — fused into token 256"), `aria-live=polite`, byte-for-byte identical under `prefers-reduced-motion` — captions are the warmth channel that needs no motion (the playable-run essence is scrub/step/run-your-input; tweened motion is garnish on top).
> 3. **Beat 8 compare strip:** the sandbox's editable line rendered three ways with live tile counts — word-tokens (unknown words become a miniature tired-eyed UNK blob: the villain's cameo), raw bytes (all blue), BPE-with-your-merges (the warming middle). The takeaway paragraph becomes playable; counts are denominated in visible tiles.
> 4. **Beat 6 lineage touch:** tapping a vermilion token in the encoded output shows a transient "`th` = `t`+`h` — merge #1" (one at a time, SR-accessible). State worn by the representation at the book's density — one value at the moment it matters; IDSA's full `name:value` trace density stays rejected.
> 5. **Book-level scrub grammar (this page is the reference implementation):** every scrubbable rail in the book shares one idiom — pill+underline handle, drag + arrow-keys ±1 + Home/End, playhead dot, drawn play toggle wherever a recorded run exists. LM page's lineage scrubber retrofits at its next round; rule graduates into the `unit-page` skill once this ships and survives review.
> 6. **New acceptance gates:** run-rail honesty (re-derive the recorded run in Node from the raw paragraph; diff every rule+count shown); scrub determinism (state at `n` identical arriving from either direction); caption text matches state at every `n`; compare-strip counts re-derived independently; full functionality under reduced motion; no new frames/cards; console clean through play, scrub-thrash, and compare-strip editing.
> 7. **Out of scope, deliberately:** no speed slider (one considered pace, ~2–3 steps/s — IDSA's proven register), no autoplay on beat reveal (the reader initiates), no IDE/timer furniture, no framed panels.
> 8. **MC-blank shuffle (a finding from the full-motion pass, 2026-07-23: every choice dropdown in the book rendered the correct answer as the first option).** Source stays authored correct-first; the renderer deals presentation order via the shared seeded idiom — `mcShuffle(menu, blankEl.id)` called inside `wireMC` before `opts` is captured (FNV-1a hash of `id + ":mc1"` seeding xorshift32 Fisher-Yates, then re-append; the `:mc1` salt is book-wide — changing it re-deals every blank). Already applied verbatim to `language-modeling.html` (round-4) and `the-bitter-lesson.html` (round-3), both verified live and republished; port the function byte-for-byte to this page's `mc-unk` and `mc-final`. Expected rendered position of correct with this salt: `mc-unk` → 2nd, `mc-final` → 3rd. Gate: correct first in neither blank; positions differ between the two; keyboard/SR flows unchanged.

> **AMENDMENTS round 3 (2026-07-23):** dragnum chevrons removed (the author: ugly) — affordance = pill + underline + cursor + scrubbable sparkline + prose; target-pointer clicks must scroll-then-glow (glow starts after scroll settles, ≥1.8s, hover lights target too, empty-target fallback); beat-6 encoder must LIVE-LINK to pad4's current merges (tears included) — static recipes are a defect. General principle admitted to the spec: **linked representations stay live; feedback must land where the reader is looking.**
>
> **AMENDMENTS (2026-07-23, author feedback round):** §5 header meta reduced to "~12 min" + reveal-all only (drop "silent" / "you'll need your fingers"); footer "the book's north star · hand-crafted / …Silent by design." removed entirely (Sources block ends the page) — process labels don't belong in the reader's page. Beat 2 must expand UNK ("short for unknown") at first mention. Beat 4 must state why new ids start at 256 (bytes own 0–255) before the first badge, and gets a one-time tear/undo hint after the first merge. Beat 5's sparkline is also a scrubber, and the dragnum shows a resting handle (faint pill + ‹ › chevrons). Pad annotations must be non-wrapping units whose arrows point into the pad at all widths.
>
> **STATUS 2026-07-23: BUILT + VERIFIED (round 1).** `bpe-north-star.html` passes all §8 gates (one fix round: click-to-focus keyboard entry, dragnum hit-area/selection guard; light-vermilion deepened to #C93F27 for AA per §2's "tune as needed"). Shipped for review. Awaiting judgment against the references.

*2026-07-23. This is the art direction and content architecture for the book's first hand-crafted lesson page. It operationalizes `reference-analysis.md`. The page is bespoke — no schema layer required; extraction comes later. Quality is the only success criterion: the test is "could this sit inside Mathigon without embarrassment, and would Nicky Case recognize the spirit."*

---

## 1. Concept

One page that teaches byte-pair encoding as **a story: cold numbers becoming warm meaning**. The reader plays every idea before it is named. The page is silent, gated, and personally addressed to "you."

Working title on the page: **How a computer learns to read** — eyebrow: *Language, from scratch · chapter one*.

## 2. Palette — the thesis in color

The lesson's arc (mechanical bytes → learned, meaningful tokens) is encoded as a temperature shift. This is the page's one bold move; everything else stays quiet.

Light theme (ground-up):
- Ground `#FBFAF7` (warm near-white; NOT cream); ink `#201D1A`; secondary ink `#6B6560`; hairline `#E8E4DC`
- **Byte blue** `#2E56C6` — everything raw/mechanical: byte values, ids, the pre-merge world. Byte tile fill `#EFF2FA`, border `#C9D4F0`, numerals in mono.
- **Token vermilion** `#D6472E` — everything learned/meaningful: merged tokens, the vocabulary, warmth. Token tile fill `#FDEAE4`, border `#F0B8A9`.
- **Invitation gold** `#B97D0F` (text) / `#F5C86A` (marks) — reserved exclusively for "touch here" signals: the wiggle, the gesture hand, hand-lettered nudges. Never decorative.
- Success green `#2E7D4F`, used sparingly (goal-complete ticks only). No other hues exist on the page.

Dark theme (designed, not inverted): ground `#171511`, ink `#F1ECE4`, secondary `#A79F94`, hairline `#2E2A24`; byte blue → `#8FA8F5` on fill `#1D2436`; vermilion → `#FF9377` on fill `#38201A`; gold → `#E9B85C`; green → `#6BC493`. All text AA against its ground; tune as needed, keep the roles.

Both themes via CSS custom properties: `@media (prefers-color-scheme: dark)` + `:root[data-theme="dark"]` / `:root[data-theme="light"]` overrides winning both ways.

## 3. Typography

- **Body**: `system-ui` stack, 18px / 1.65, max-width 40rem column. Headings 600–700, h1 ~42px, `text-wrap: balance`. Plainness is intentional (Mathigon proof); the craft budget goes to interaction.
- **Hand face** — the Case ingredient: an embedded handwriting font for *annotations only*: instruction labels ("drag them together!"), drawn arrows' captions, goal nudges, the sandbox sign. Build-time: download **Patrick Hand** (fallback: Caveat) from Google Fonts, inline as a woff2 `data:` URI `@font-face` (the page must stay fully self-contained; no runtime fetches). If download is impossible, use `"Segoe Print", "Comic Sans MS", cursive` and flag it in build notes — do not silently ship without noting it.
- **Mono**: `ui-monospace` stack for byte values and token ids. Tabular numerals wherever numbers change live.
- Hand face never sets body text. No other faces.

## 4. Motion — the warmth channel (we have no sound)

- Merges: squash-and-stretch fusion — the two tiles compress toward each other (~120ms), overshoot-pop as one (~220ms, `cubic-bezier(.3,1.6,.4,1)`), settle. The new tile is *born*, not swapped.
- Invitation: the current hottest pair does a subtle synchronized wiggle (±1.5°, ~600ms) every ~4s until first touched. A small drawn **gesture hand** (SVG, 2px ink stroke, gold) points at it on first idle (~3s), fades after first successful merge, never returns.
- Step reveal (retimed 2026-07-24, author review round): a *felt* entrance — unlocked beats fade+rise 14px over .9s (`cubic-bezier(.22,.6,.2,1)`, `both` fill); "Reveal all" unfurls with a 90ms stagger (capped 540ms). Narrative sub-reveals inside beats get a .4s opacity fade (`.fade-in`); interaction feedback (corrections, menus, aria-live status) stays instant. A small green tick draws itself (~200ms stroke-dashoffset) beside the completed goal.
- **Frontier cue (standing idiom, 2026-07-24; register revised same day after an author review round):** one hand-lettered line — exactly `the page continues when you play` + three dot spans — sits centered below the last revealed beat (`.cuewrap`/`#frontierCue`, `.note` grammar, rotate −1.5°). It WHISPERS: 1.05rem, words `--ink2`, only the dots `--gold` (a full-gold cue was indistinguishable beside gold instrument annotations — one hand-lettered register per role), top margin 3.4rem. Dots breathe (`cueDot` 2.8s, staggered .35s); the cue trails each reveal (entrance delayed .35s so the section leads) and retires for good (`.cue-out`, then removed from DOM) once no hidden beat remains. Non-interactive, no arrow, never gates.
- **Animation-class hygiene (2026-07-24):** `reveal-anim`/`fade-in`/`cue-in` are removed by a document-level `animationend` listener when `rise`/`fadeReveal` end — retained `both` fill would leave every revealed beat a stacking context, trapping popover z-indexes (`.menu` z:20) under later transformed content. The listener ships with the reveal idiom.
- Celebration at the finale (see beat 7): the vocabulary tiles do one happy synchronized hop. Nothing rains, nothing spins.
- `prefers-reduced-motion`: all of the above become simple opacity fades; wiggle and hand are disabled entirely (the hot pair gets a static gold underline instead). Beat reveals specifically get a .45s opacity-only fade (`fadeReveal`) — **never an instant pop** (`animation:none` on reveals is a defect; reduced-motion readers saw sections pop for the book's whole first month). Cue dots go static at full opacity.

## 5. Layout

- One text column (~40rem) on the plain ground. **Zero cards, zero borders-around-content, zero stat tiles, zero pill chips, zero numbered kicker labels.** Figures and sims sit in the column as full citizens; the token pad may breathe wider (up to ~52rem, centered) at its moments.
- Hand-lettered annotations sit *on* the sims with short drawn SVG arrows (1.5–2px ink strokes, slight wobble in the path so they read as drawn).
- Provenance: superscript footnote markers in prose (`¹`) → one quiet "Sources" block at the end listing CS336 L01 timestamps. No cite chips in the flow.
- Top of page: title, one-line eyebrow, `~12 min · silent · you'll need your fingers` in small secondary text, and a quiet `Reveal all steps` link (the escape valve). A hairline-thin progress rail (8 segments) fixed at the very top edge, filling vermilion as goals complete.
- Footer: "the book's north star · hand-crafted" + sources.

## 6. The eight beats (content architecture + gating)

Each beat is a gated step: later beats do not exist in the DOM's visible flow until the goal fires (render hidden, reveal on goal; "Reveal all steps" unlocks everything). Voice: second person, wonder-first, light humor allowed, no lecture-summary tone. Keep prose lean — the pads carry the teaching.

**Beat 1 — Cold open + first touch.** "This is the story of how a computer learns to read." Two sentences on the strange fact that a language model has never seen a letter. Then, in the first viewport: a sentence displayed as friendly ink text with a hand-lettered nudge — **"tap it"** — one tap flips each character over (card-flip, 3D rotateX) into its byte value (blue, mono). The reader's first act reveals what the machine sees. *Goal g1: flip the sentence.* Footnote ¹ → t=1:11:55.
- The flip must feel physical (per-character stagger ~15ms).

**Beat 2 — The tragedy of UNK.** Meet the old way: a word-level tokenizer with a fixed dictionary. An inline predict moment (Mathigon-style choice blank in the sentence): "When it meets a word it has never seen — say, *snorfle* — it [[replaces it with a blank ✓|learns it on the spot|crashes]]." On answering: a tiny scene — the word *snorfle* walks in (slides), the dictionary shrugs, and the word is swallowed by a gray **UNK** blob (our one villain; a soft gray lump with two tired eyes — the only character with a face in chapter one; more faces come later in the book). One sentence of consequence: every unknown word becomes the same gray nothing. *Goal g2: answer the blank (any choice reveals; wrong choices get a gentle correction line).* 
- UNK is drawn (inline SVG, ink lines + gray fill), not an emoji.

**Beat 3 — Bytes never fail.** The counter-move: bytes. "There are only [[256]] possible bytes — and every text ever written is some sequence of them." Numeric blank, mono entry styled as a book underline (no default input chrome). On correct: the byte alphabet strip (0…255 compressed as a ribbon) draws itself under the sentence. One line: nothing is ever unknown to bytes; the price is that everything is *tiny pieces*. *Goal g3: the blank.* Footnote ² → t=1:12:43.

**Beat 4 — The hero: drag tokens together.** The token pad, wide, on "the cat in the hat" as blue byte tiles (space shown as a faint `␣`). The hottest pair (`t`,`h`) wiggles; the gesture hand points; hand-lettered: **"drag one onto its neighbour!"** Direct manipulation is the point: pointer-drag a tile onto its adjacent partner → fusion animation → a **vermilion** token is born (id badge `256` in mono, small). The pad quietly guides: only the *most frequent* pair accepts a merge (others resist with a gentle head-shake shake + one-time hand-lettered aside: "the crowd goes first — count them!"); tapping any tile shows its count-partner highlights. A small running line under the pad in prose (not a stat grid): "18 tokens · 0 new words learned" updating live. Undo = grab a vermilion tile and tear it apart (drag apart gesture) or keyboard Backspace on focus. Keyboard path: arrows to select a pair, Enter merges (visually identical result). *Goal g4: perform all 4 natural merges (`th`, `the`, `the␣`, `at`).* On the 4th: the pad settles, the four learned tokens line up beneath as "your model's first vocabulary." Footnote ³ → t=1:13:28.
- Merge legality follows real BPE (most-frequent adjacent pair, first-seen tie-break; first merge must be t+h → 256). The correctness gate from the prototypes still applies.

**Beat 5 — What just happened (words touch the picture).** Short prose walking the loop — count, fuse, repeat — where the key phrases are **target-pointers**: "the [most frequent pair](→ highlights the relevant tiles) becomes a [brand-new token](→ highlights the vocabulary row), and the text gets [shorter](→ flashes the running count) while the vocabulary grows." Tapping a pointer lights the referenced element (gold underline on the word; matching glow on the target). Then one inline draggable variable, Tangle-style: "Run the same loop ${n} times and this page's own opening sentence would be ${tokens(n)} tokens long." — drag `n` (0–20), the number and a thin inline spark-line update; no chart block, it lives in the sentence. *Goal g5: touch at least one target-pointer and drag n at least once.*

**Beat 6 — Now encode something new.** "The merges you just taught it are a recipe, replayed in order on anything you type." A single styled entry line (book underline, hand-lettered "try your name — or *snorfle*"): typed text tokenizes live under the caret — bytes fuse into vermilion where the four learned merges fire (with miniature versions of the fusion pop). The reader watches *their own word* survive without UNK. One line after first input: even *snorfle* is just bytes and a lucky `at`. *Goal g6: type ≥3 characters.* Footnote ⁴ → t=1:15:03.

**Beat 7 — The scale reveal (wonder beat).** "You did four merges. GPT-2 did fifty thousand." Two sentences scaling the exact same loop to the internet: common words become single warm tokens, rare ones stay pieces, nothing is ever unknown. The four vocabulary tiles hop once, then a quiet line of famous real GPT-2 tokens (` the`, `ing`, ` of`) fades in beside them as distant cousins. A single check question, inline: "Why can BPE never meet an unknown word? [[Because it can always fall back to raw bytes ✓|Because its dictionary contains every English word|Because it skips words it doesn't know]]" with a one-line explanation on answer. *Goal g7: answer correctly (retries allowed).* Footnote ⁵ → t=1:15:48–1:17:20.

**Beat 8 — Sandbox + takeaway.** Hand-lettered sign: **"your turn — break it."** The token pad again, now free: an editable corpus line (prefilled "banana banana", swappable), unlimited merges, tear-apart undo, a small "start over" hand-drawn circular arrow. No goals, no grading. Beneath: three quiet sentences of takeaway (character/byte/word each lopsided; BPE the data-driven middle; still the default today) and the Sources block + credits. *Terminal — no gate.*

## 7. Engineering constraints (unchanged from prototypes)

Single self-contained fragment file (no doctype/html/head/body; `<meta charset="utf-8">` first, then `<style>`, content, `<script>`). Zero external runtime resources (fonts embedded as data URIs at build time). Absolutely silent — no audio APIs of any kind. Vanilla JS + inline SVG; no libraries. Fully usable at 375px (drag interactions must work with touch: pointer events + `touch-action` management) and with keyboard; aria-live where content changes; visible focus states; AA contrast both themes. Every displayed number rounded. Works when opened as a raw local file AND when hosted as a static page.

## 8. Acceptance gates (self-verify before reporting; the design lead re-verifies all)

1. First viewport: story open + the flip-sentence manipulable, above the fold at 1280×800 AND 375×812.
2. BPE math correct: first merge `t+h → 256` on "the cat in the hat"; all four merges match the lecture; encode replays in learned order (verify by extracting and running the engine in Node).
3. Gating: beats 2–8 hidden until goals fire; "Reveal all steps" unlocks everything; progress rail fills.
4. Anti-slop sweep (grep + eye): zero cards/borders-around-prose, zero default-styled `<button>`/`<input>`/`<range>` appearance, zero numbered kickers, zero stat-tile grids, zero pill-chip rows, zero emoji in UI, palette exactly as specified (no stray hues).
5. Drag-to-merge works by mouse AND touch AND keyboard; tear-apart undo works; resisting pairs head-shake.
6. Both themes designed (screenshot both); reduced-motion path exists; silent (grep for audio APIs).
7. The hand face renders (or its absence is flagged loudly in notes).
8. Feel check, honestly answered in notes: does the merge *feel* like fusing? Does the page read as a place, not a form?

## 9. Out of scope (do not build)

No schema/JSON layer, no compiler hooks, no progress persistence, no theme toggle UI (follow system + honor `data-theme` if the host sets it), no navigation/other chapters, no share buttons.
