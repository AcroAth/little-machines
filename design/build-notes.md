# Build notes — BPE north-star page

*Built 2026-07-23. Single self-contained fragment: `bpe-north-star.html` (~99 KB, ~32 KB of that is the embedded font). Zero runtime network, no audio, vanilla JS + inline SVG.*

---

## Font embedding — SUCCESS

- **Face embedded:** Patrick Hand (the spec's first choice), `latin` subset only.
- **Bytes:** 23,944 bytes of woff2 → base64 of 31,928 chars, inlined as a `data:font/woff2;base64,…` URI in a single `@font-face` rule.
- Fetched at build time from `fonts.gstatic.com` (URL `…/patrickhand/v25/LDI1apSQOAYtSuYWp8ZhfYe8XsLL.woff2`) via a Chrome UA request to the Google Fonts CSS API, then base64'd into the file. No fallback was needed.
- Verified in-browser: `document.fonts.check('16px "Patrick Hand"') === true`, and the hand face renders in every annotation ("tap it", "drag one onto its neighbour!", "your turn — break it", the vocabulary caption, the sources credit line).
- Fallback stack retained in CSS behind the embedded face: `"Segoe Print","Comic Sans MS",cursive`.

## BPE engine — verified correct (gate 8.2)

Extracted the engine from the **shipped** file and ran it in Node. Faithful to CS336 L01: UTF-8 byte sequence → count adjacent pairs → merge most-frequent (first-seen tie-break) into a new id from 256 → replace **every** occurrence → iterate. Encoding replays learned merges in order.

First four merges on `"the cat in the hat"`:

| # | pair | new id | token |
|---|------|--------|-------|
| 1 | `t` + `h` | 256 | `"th"` |
| 2 | `256` + `e` | 257 | `"the"` |
| 3 | `257` + `␣` | 258 | `"the "` |
| 4 | `a` + `t` | 259 | `"at"` |

- Live token trajectory in the pad: **18 → 16 → 14 → 12 → 10** (each guided merge has exactly 2 occurrences, so it drops by 2).
- `encode("that")` → `["th","at"]`; `encode("Nathan")` → `["N","a","th","a","n"]`; `encode("snorfle")` → 7 raw bytes (no learned merge fires — see deviation below).
- The pad's "which pair may merge next" logic is the *same* `nextMerge()` the engine uses, so beat 4 can only be completed in the lecture's exact order.

## Acceptance gates — all pass

1. **First viewport** — story open + flip sentence above the fold at **1280×800** (flip bottom ≈ y472) and **375×812** (flip + "tap it" end ≈ y535). Verified.
2. **BPE math** — see table above; re-run in Node against the final file.
3. **Gating** — beats 2–8 render `hidden`; each goal reveals the next beat with a fade+rise; "Reveal all steps" unlocks everything; the 8-segment rail fills vermilion as goals fire (full rail on sequential completion).
4. **Anti-slop sweep** — grep + eye: zero `card`/`kicker`/`chip`/`stat-tile`/`pill` classes; every `<button>`/`<input>` is reset (`appearance:none`) and restyled (menu options, hand-drawn "start over", book-underline inputs); no `type="range"` anywhere (the beat-5 variable is a custom `role="slider"` span); no emoji in the UI (all marks are inline SVG — tick, arrows, gesture hand, UNK, start-over); the only non-ASCII glyphs are typographic (`␣ ⏎ · — → … ¹²³⁴⁵`).
5. **Drag-to-merge** — works by **mouse**, **touch** (pointer events + `touch-action:none`; confirmed merging at 375px), and **keyboard** (arrows select a pair, Enter merges, Backspace tears). Tear-apart undo works (drag a merged tile down > 34px, double-click, or Backspace). Non-maximal pairs refuse with a head-shake nudge and the one-time hand-lettered aside "the crowd goes first — count them!".
6. **Both themes** — designed, not inverted (dark gives byte tiles a cool `#1D2436` fill and token tiles a warm `#38201A` fill). AA verified programmatically both themes (see palette note). Reduced-motion path exists and was exercised (this test browser defaults to `prefers-reduced-motion: reduce`). Silent — grep confirms zero audio APIs.
7. **Hand face** — renders (see font section).
8. **Feel check** — answered honestly below.

## §8.8 feel check — honest answers

**Does the merge feel like fusing?** Yes — and I measured it rather than eyeballing it. Sampling the hero tile's transform through a merge (slowed 5×) shows two distinct phases: (a) **squash** — the pair's tiles translate toward a shared midpoint and compress `scaleX 1.0 → 0.72` over ~120 ms; (b) **birth** — a single new tile appears at that midpoint and scales `0.55 → overshoot 1.05 → settle 1.0` on `cubic-bezier(.3,1.6,.4,1)` over ~220 ms, while the surviving neighbours FLIP-slide in to close the gap (~260 ms). It is a birth, not a DOM swap. Because BPE replaces *every* occurrence, a pair's twin across the sentence fuses simultaneously (a gentler pop), which teaches "replace every occurrence" for free. In reduced-motion it degrades to an honest opacity crossfade.

**Does the page read as a place, not a form?** Yes. One warm text column on a warm ground, no cards/borders/kickers/chips/stat-tiles anywhere. The teaching lives *inside* the prose — a mid-sentence multiple-choice blank, a numeric book-underline blank, three target-pointers that light diagram elements, a Tangle-style draggable number with an inline sparkline — and the token pad is directly manipulable (you drag the tokens themselves, never a button about them). Hand-lettered annotations sit *on* the sims with short drawn wobble-arrows; the temperature shift from byte-blue to token-vermilion carries the thesis; UNK is a drawn, slightly-sad character, not a label. The only chrome is a quiet "Reveal all steps" link and a hand-drawn "start over".

## Key decisions

- **Opening sentence = "once upon a time"** (beat 1 flip, and the corpus beat 5 projects its loop onto). A fairy-tale opening that flips to cold bytes — on theme, and it keeps the flip to one crisp line on desktop / two on mobile.
- **Merge-all occurrences on a single drag.** Dragging one `t·h` fuses *both* `th`s at once (18→16), matching real BPE and dramatizing the rule. Both modes (guided beat 4, free beat 8) merge all occurrences of the chosen pair.
- **Guided vs free pads share one component.** Beat 4 enforces BPE legality (only the current best pair merges; others head-shake). Beat 8 ("your turn — break it") drops the legality gate so you can merge any adjacent pair and watch it go weird — delivering on the sign. Both use a merge-stack model (state = replay of the stack on the corpus); tear = pop the stack (LIFO), so undo is always consistent.
- **Blanks as drawn popovers**, not `<select>` chrome: an underlined slot opens a lightly-rotated menu of plain-text options; correct fills green with a drawn tick, wrong shakes + shows a gentle correction line.
- **Byte ribbon** = a compact gradient strip with 256 hairline ticks and four labels (`0 · ␣ · A · a · 255`); "draws itself" via a left→right clip reveal.
- **Reduced-motion is class-driven** (`REDUCED = matchMedia(...).matches` → `.reduced` on the root, plus per-branch JS). All fancy motion (squash/overshoot, wiggle, gesture hand, hop) becomes opacity fades or is disabled; the hot pair gets a static gold underline instead of the wiggle/hand.

## Deviations from the spec (all deliberate, none change the facts)

- **Light-theme vermilion tuned `#D6472E` → `#C93F27`.** The spec's exact `#D6472E` on the warm ground scores 4.19:1 — below AA (4.5) for the small "256" badge text and the normal-size vermilion accent words in beat 7. The spec explicitly sanctions "tune as needed, keep the roles" for AA. `#C93F27` (4.76:1 on ground, 4.28:1 on token-fill for the large-bold tile text) is an imperceptible deepening that keeps the vermilion role and clears AA. **Dark-theme token stays `#FF9377`** (spec value; already AA). This is the only palette value that differs from the literal spec hex.
- **Beat-6 microcopy is adaptive rather than the literal "even snorfle is just bytes and a lucky at."** `snorfle` contains no `th`/`the`/`the␣`/`at`, so no learned merge actually fires on it — the literal line would contradict what the reader sees. Instead: when a merge fires the note names the fused tokens ("look — "th" and "at" fused… no UNK in sight"); when none fire (e.g. snorfle) it says "all raw bytes this time — and that's fine. nothing here is ever unknown." Same teaching (no UNK), stays truthful to what's on screen.
- **Added `<meta name="viewport" content="width=device-width, initial-scale=1">`** as the second line (after charset). Without it the fragment falls back to a ~980 px layout viewport on phones and the 375 px styles never engage — "fully usable at 375px" would fail on real devices. Harmless when hosted as a static page (the host provides its own).
- **Lineage line added in beat 7** ("began life as a way to compress files, got borrowed for translation, and GPT-2 was the first big model to read this way") — this is the source's own lineage fact (CS336 L01, 1:11:55), cited, not invented.

## Notes / minor

- **Async render in reduced-motion:** merges/tears run through a `setTimeout(…, 0)` even in reduced mode (shared code path), so the DOM updates on the next tick. Imperceptible in real use; only visible if you read state synchronously in the same call that triggered the action (which tripped up one of my own test scripts, not the user).
- **Rail on reveal-all:** using the escape valve after partial play lights the segments you actually earned plus segment 8 (you did reveal the end). Sequential play fills 1→8 cleanly.
- **Console:** clean — zero errors/warnings across a full walkthrough in both themes and at mobile width.
- **Test scaffolding removed** before shipping (a temporary `?motion=full` / `?slow` override used to inspect the fusion in this reduced-motion browser is gone; durations are back to the literal spec values).

## Nothing left unfinished

All eight beats, both themes, mobile, keyboard, reduced-motion, and the correctness gate are implemented and verified. The page works opened as a raw local file and served over http.

---

## Fix round 2 (design-lead review: keyboard path + beat-5 number)

The design lead flagged two gate-5 defects. I reproduced their exact tests against the *served* file (cache-busted URLs) in the browser. Findings and fixes below — the honest version is that the structural claims didn't match the current file, but the **interaction symptoms were real**, caused by two gaps my earlier verification masked, and both are now fixed and re-verified.

**What the live DOM actually showed (current file):** `pad4`/`pad8` already had `tabindex="0"` and were reachable by real Tab (pad4 is the 7th tab stop); there was exactly one `.dragnum` (`ew-resize`, `user-select:none`) inside the visible "…would be N tokens long" sentence — no duplicate, no orphan. So the "no tabindex anywhere" / "duplicated dragnum" structural descriptions did not reproduce (most likely a stale cache on the reviewer's side). **But the symptoms were real**, for two reasons I'd missed:

1. **Keyboard "does nothing" — the real gap was click-to-focus, not Tab.** The tile `pointerdown` calls `e.preventDefault()` (needed so a drag doesn't select text), and a side effect is that *clicking the pad never moved focus to it*. So anyone who focused the pad by **clicking** (rather than Tabbing) and then pressed arrows/Enter saw nothing happen — `document.activeElement` stayed on `BODY`, exactly as reported. My earlier "keyboard passes" check used `pad.focus()` (programmatic) and synthetic key events, which sidestepped this gap entirely. *Also note:* the browser-automation `key` action here emits **empty** key events (`key:""`, `keyCode:0`) for some key names — e.g. "Return" — so a handler that (correctly) checks `e.key==="Enter"` looks dead; using the name "Enter" produces a proper event and the merge fires. A reviewer driving keys through the same tooling would see "Arrow/Enter do nothing" even on a correct handler.
   - **Fix:** a tap (pointer-up with no drag) on any tile now calls `pad.focus()` and sets the pair selection, so the keyboard is live immediately after a click. Verified: real click on a tile → `activeElement===pad`, selection visible; real **Enter** merges; real **ArrowRight** moves the selection; real **Backspace** tears. Confirmed on both pads and at 375 px.

2. **The number "produces native text selection" and felt inert.** The original `.dragnum` had `user-select:none` + pointer capture, but the surrounding paragraph was selectable and there was no move-time guard, so a drag that strayed off the small glyph could start a native selection — making the gesture feel broken.
   - **Fix:** generous invisible hit area (`.dragnum::after{ inset:-7px -9px }`, ≥12 px each side beyond the glyph), a `document.body.no-select` guard toggled for the duration of the drag, `preventDefault()` on `pointermove`, and a `pointercancel` handler. Verified: dragging the number updates n, the projected token count, and the sparkline, fires **g5**, and `window.getSelection()` stays empty throughout.

3. **Minor (popover a11y):** after a choice blank resolves, the dismissed popover is now **removed from the DOM** (`menu.remove()`), so its option texts no longer appear in the flattened `textContent` / a11y tree. The answered slot's click is also guarded (`if(solved) return`). Verified: after answering, the wrong-option strings are gone from the section's `textContent`.

**End-to-end re-verification (hard reload, cache-busted, WITHOUT "Reveal all steps"):** flip → blank(g2, popover removed) → 256(g3) → four real drag-merges(g4, 18→10) → tap a target-pointer + drag the number(g5) → **beats 6–8 revealed naturally** → encode "that"→`th`·`at`(g6) → final check(g7) → beat-8 sandbox. Progress rail filled all 8 segments `[1..8]` through genuine progression. Sandbox: real free-merge + keyboard merge both work. Re-confirmed drag **and** keyboard at 375 px, plus the number-drag and rendering in dark mode. Console clean throughout (zero logs).

*Takeaway for future verification: test focus via real Tab **and** real click, and drive keys with real key events using the exact `e.key` names — programmatic `.focus()` + synthetic events can hide precisely these gaps.*

---

## Author-feedback round (six items)

The author played the page end-to-end ("getting closer to what I want to see"); six design-lead decisions implemented.

1. **UNK expanded at first mention.** Beat-2 consequence (`#unkConseq`) now reads: "Every unknown word collapses into the same gray stand-in — UNK, short for *unknown*. The model can't tell *snorfle* from *qwyx*…". First-use definition, voice intact.

2. **Why ids start at 256, said before the first badge.** Beat-4 opening prose gained a parenthetical: "(Bytes already claim the numbers 0–255, so every new token takes the next free id — your very first will be 256.)" And `#beat4after` now reads "…four brand-new tokens — ids 256 to 259, the first numbers past the last byte³ —…" (footnote kept).

3. **Pad annotation rebuilt (real layout bug).** The "drag one onto its neighbour!" note is now one non-wrapping inline unit (`white-space:nowrap`) with a drawn arrow that curves **up into the pad**, anchored under the pad's left edge. At ≤480 px the phrase swaps to the shorter "drag onto a neighbour!" (CSS `@media`, both variants nowrap). Verified the **arrow tip lands inside the pad rect** by geometry (`getBoundingClientRect`) at **375 / 480 / 700 / 900 / 1280 px** — tip inside pad at all five, no column overflow at any. The other annotated notes ("tap it", "try your name — or *snorfle*", the asides) were made nowrap-safe too; the sandbox sign is short and unaffected.
   - *Note:* screenshots could not be captured this round — the test environment was not compositing frames (every screenshot attempt timed out). I substituted precise geometry checks, which test the actual criterion ("tip lands on the pad") more rigorously than eyeballing. The five width results are logged above.

4. **Draggable-value affordance (honor the instinct to grab the dot).**
   - (a) The **sparkline is now an equivalent scrubber**: it's built once as a persistent SVG (`createElementNS`) with `cursor:ew-resize`, `touch-action:none`, pointer capture, and the shared `no-select` guard; pointerdown/drag anywhere on it sets n from the x-fraction and moves the dot (which grows on hover via `.spark:hover .dot{ r:4.5px }`). Scrubbing sets `touched.drag` so it **counts toward g5 exactly like the number drag** — verified: a pointer-tap + a spark-scrub fired g5 and revealed beat 6, and the scrub updated n → 16, projection → 1.
   - (b) The **number is now a visible resting handle**: a faint gold pill at rest (`gold-mark @ 0.13`), deepening to `0.34` on hover/focus, flanked by small gold `‹ ›` chevrons (`.chev`, opacity .5 → .95 on hover). Kept `role="slider"` + `aria-valuenow` (value lives in a `.dn-val` span the code updates) and full keyboard support. Verified resting bg + chevrons present in both light and dark.

5. **Tear/undo made discoverable.** After the **first** merge in beat 4 a one-time hand-lettered aside appears near the pad: "changed your mind? drag the newest warm tile down — or double-tap it — to undo." It hides **permanently on the next merge or any tear** (state flags `undoHintShown`/`undoHintDone`; only ever shown while exactly one merge is applied). The "count them" nudge is also dismissed once merging starts. Verified: shows after merge 1, gone after merge 2, and gone after a double-tap tear (which returned the pad to 18 tokens). Sandbox instruction line now names both gestures: "…tear a token apart (drag it down, or double-tap) to undo…". Copy stays honest about guided mode's newest-merge-only rule ("the newest warm tile").

6. **Process labels removed (amends spec §5/§6).** Header meta is now only "~12 min · Reveal all steps" ("silent" and "you'll need your fingers" deleted). The footer `.foot` block ("the book's north star · hand-crafted" + the "playable introduction… Silent by design." line) is deleted entirely; the **Sources block is now the page's ending**. Per author instruction, these override the spec's original meta/footer requirements.

**Regression (hard reload, cache-busted, NO "Reveal all steps"), driven through the real handlers:** flip (g1) → UNK blank (g2) → 256 (g3) → four drag-merges (g4; undo hint appeared after #1, retired after #2) → target-pointer tap + **sparkline scrub** (g5) → encode "that"→`th`·`at` (g6) → final check (g7) → beat 8. Progress rail filled **all 8 segments `[1..8]`**. Both themes spot-checked via computed styles (dark: ground #171511, token #FF9377, gold handle + chevrons + spark all present). **Console clean throughout (zero logs).** Only gap: no screenshots (the test environment was not compositing frames); layout verified by geometry instead.

---

## Fix round 3 (author feedback: three surgical fixes)

Author: beat-5 pointers "not giving correct response," the number's `‹ ›` chevrons "look very ugly," and the beat-6 "try your name" encode line "cannot recognize the change in dictionary in the previous part." Three targeted fixes; nothing else touched.

### Fix 1 — beat-5 target-pointers were imperceptible (and one was a literal no-op)

Two root causes, both confirmed in the live DOM:
1. **Timing.** The old handler started the ~0.9–1.0s glow *before* the smooth `scrollIntoView` finished, so the glow was over before the target reached the viewport — the reader saw nothing.
2. **A dead selector.** The "brand-new token" pointer targets `#vocab4row`, whose children are `.vtile`s. The old code added `.lit`, but the only rule was `.tile.lit` — `.vtile.lit` has no styling, so that pointer did *literally nothing* even when on-screen.

New behaviour (rewrote the pointer block in `initHooks["5"]`):
- **Click:** if the target is outside the viewport, `scrollIntoView({behavior:'smooth',block:'center'})` runs **first**; the glow starts only when the scroll settles — a `scrollend` listener on `document` **or** a 700ms `setTimeout` fallback, whichever fires first, with both listeners/timers cleaned up (and cancellable on re-click). If already visible, it glows immediately.
- **Glow ≥1.8s ease-out fade.** Dedicated beat-5 classes: `.t5ring-out` (ring, `t5ring 1.9s ease-out`) and the retimed `.flash` (`flash 1.9s ease-out`, gold→ink2). Colors unchanged (gold-mark 70% ring / gold text). Held then cleared at 2s so a repeat click restarts it.
- **Hover** (`pointerenter`/`pointerleave`, mouse/pen only — touch falls through to click) lights the target immediately with a **static** highlight (`.t5ring`/`.t5txt`), removed on leave; paint-only, no layout shift. If a click glow is fading while still hovered, the hover state is re-asserted afterward.
- **Empty-vocab edge case:** if `#vocab4row` has no children (the author tore every merge), the fallback glows the visible `#vocab4` caption (or the wrap) — a click can never visibly do nothing.
- **Reduced-motion:** scroll uses `auto`; the glow is a static highlight that appears then disappears (the JS never adds the animated classes when `REDUCED`), so no animation runs. (The old `.flash` actually animated even in reduced mode — that latent violation is now gone.)

Why dedicated `.t5*` classes instead of mutating `.lit` as the brief literally suggested: `.lit` is **shared** with the pad's tap-hint (`flashTile`, beat 4, 900ms). Retiming `.lit` to 1.9s would truncate/alter that unrelated interaction. `.flash` *is* beat-5-only, so it was retimed in place per the brief. `.lit`/`.tile.lit` left byte-for-byte unchanged.

### Fix 2 — removed the `‹ ›` chevrons from `#dragN`

Deleted the two `.chev` spans from the HTML and both `.chev` CSS rules. **Kept** the `.dn-val` value span: its `min-width:1.05ch; text-align:center` prevents the pill from jittering horizontally as the value crosses 1↔2 digits during a drag — dropping it would *reintroduce* a visible width jump, so it was not a simplification. `setN()` still writes `dnVal.textContent` and `aria-valuenow` on `#dragN`; untouched. Everything else preserved and re-verified: dotted gold underline, faint resting pill (`gold-mark 0.13`), hover/focus deepen (`0.34`), `ew-resize`, generous `::after` hit area, keyboard arrows, pointer drag with the `no-select` guard, and the sparkline scrubber.

### Fix 3 — beat-6 encode line now live-links to the pad

Root cause: `initHooks["6"]` tokenized with the frozen module-level `LEARNED`, ignoring the pad's real merge state. Fix:
- `makePad`'s API gained `getMerges()` (an ordered copy of `state.stack` as fresh `{a,b,id}` objects) and `subscribe(cb)`; a private `subs`/`notify()` calls subscribers at the end of **both** `doMerge` and `doTear`, after `render()`/state settles. No DOM refs are retained by the pad.
- Beat 6 now tokenizes `entry.value` with `pad4.getMerges()` (nullish-guarded, falls back to `LEARNED`) and re-renders on `input` **and** on every `pad4` notification.
- `pad8` (sandbox) is **not** subscribed; beat-6 prose and beat-7's `LEARNED` reconstruction are untouched.

### Verification (served locally, cache-busted, driven through the real handlers)

Natural progression, no "Reveal all steps": g1 flip → g2 UNK blank → g3 "256" → g4 four merges (`10 tokens · 4 new words`, 4 vocab tiles) → g5 pointer + number/spark drag → g6 typing → g7 final check → beat 8 visible; **progress rail filled 8/8**; **console clean throughout (zero logs)**. Dark theme spot-checked via computed styles (ground #171511, token #FF9377 on #38201A, dragnum pill + gold underline, and the new `.t5txt`/`.t5ring` glows resolving to dark gold #E9B85C / gold-mark ring).

- **Fix 1 (reduced, live):** clicking each pointer scrolls its target into view and lights it — status4 flashes gold, all four vtiles ring (the previously-dead "brand-new token"), pad tiles ring; glow auto-clears after 2s; hover lights then clears on leave; empty-vocab click lights the caption fallback; `.t5ring-out`/`.flash` compute to `... 1.9s ease-out`.
- **Fix 1 (full-motion, via a temporary `?motion=full` override that was removed before shipping — grep-confirmed 0 occurrences):** with the target off-screen, the glow is **not** applied in the same tick as the click (proves scroll-first); it appears ~760ms later once the scroll settles (the 700ms fallback fired — `scrollend` doesn't emit in this headless test environment), the target ends centered in view, uses the animated classes, and clears after the hold.
- **Fix 2:** chevron count 0; drag +140px → value/`aria-valuenow` 4→14, projection updates, no native selection, `no-select` cleared; keyboard arrow 14→13; sparkline scrub → 20; dotted underline / pill / `ew-resize` intact.
- **Fix 3:** typed "that" → `th`+`at` (ids 256,259); tearing the pad's merges one-by-one live-updates the encode line to `th`+`a`+`t` … → four raw bytes with the "all raw bytes this time" note; re-merging restores the `th`+`at` fusions.

**Code regions touched:** CSS beat-5 section (added `.t5ring`/`.t5ring-out`/`@keyframes t5ring`/`.t5txt`; retimed `.flash`), CSS `.dragnum` (removed `.chev` rules), HTML `#dragN` (removed chev spans), JS `makePad` (`subs`/`notify()`, `notify()` in `doMerge`+`doTear`, `getMerges`/`subscribe` on the returned API), JS `initHooks["5"]` (pointer block rewritten), JS `initHooks["6"]` (live merges + `pad4.subscribe`). `.lit`/`.tile.lit`, the pad tap-hint, beat-7, and pad8 left unchanged.

---

## Fix round 4 (author feedback: two visual fixes)

Author (screenshot evidence): the interactive parts "are not centered correctly," and beat-1's "tap it" arrow points the wrong way.

### Fix A — the pad broke the column axis

Root cause: `.pad-wide` put the wide treatment on the whole **`.pad-wrap`** (`width:52rem; margin-left:calc((40rem - 52rem)/2)` → -6rem), so the wrap and *everything in it* — tiles (left-aligned, no `justify-content`), the status line, the "your model's first vocabulary" caption+row, and the annotation — all started ~6-7rem left of the prose column and read as misaligned.

Fix (CSS only + one JS math change):
- Moved the wide treatment onto **`.pad-wide > .pad`** so only the pad breathes wide: `--pw:min(52rem, calc(100vw - 2rem)); width:var(--pw); margin-left:calc((100% - var(--pw))/2)`. The `min()` clamp keeps the pad ≥1rem off both viewport edges (the old fixed 52rem overflowed just above the 53rem breakpoint); the `margin-left` centers the pad on the pad-wrap, whose center is the column/viewport center.
- Added `justify-content:center` to `.pad` (base, all widths) so tile rows sit symmetrically on the column axis.
- The wrap is back to normal column width, so `.pad-status`, `.vocab`, and the `.pad-note` (annotation) return to 40rem-column left alignment automatically.
- `positionGesture()` now measures relative to `cfg.gestureHost` (the pad-wrap) instead of the pad, since the pad now overhangs its host symmetrically; the padRect-based math would have shoved the hand right by the overhang.

### Fix B — beat-1 "tap it" arrow pointed the wrong way

The flip sentence is *above* the note, but the arrow (`M2 6 q 12 3 22 9…`) curled down-right at nothing. Redrew it as an up-curling wobble arrow (viewBox 28×40, path `M6 38 q 13 -6 15 -20 q 1 -6 -2 -13`, head at (19,5)) matching the beat-4 `arrow-into` treatment (2px ink stroke, drawn wobble, head clearly aimed up). Positioned it `position:absolute` on the beat-1 `.pad-note` (already `position:relative`) via a `.tapnote`/`.tap-arrow` pair so the head can rise **above** the note into the sentence (an in-flow SVG would just expand the note box and never clear its own top).

### Verification (served, cache-busted, geometry via `getBoundingClientRect` — pane doesn't composite screenshots)

Geometry at **375 / 480 / 700 / 900 / 1280**, all pass:
- (4a) pad content bbox center vs prose column center: **0px** at every width (≤24 required).
- (4b) status / vocab / note left edges vs prose left: **0px** each (≤8 required).
- (4c) beat-4 annotation arrow tip inside the pad rect: **true** at every width.
- (4d) horizontal page overflow: **≤0px** at every width (at 375 the pad sits 18px inside each edge).
- (Fix B) tap-arrow head **13px above** the note top and horizontally within the flipline rect: **true** at every width.
- (A3, full-motion via a temporary `?motion=full` override, removed before shipping — grep-confirmed 0 occurrences) the gesture hand lands **0px** off the hot-pair tile center despite the pad overhanging its host by **118px** (the old padRect math would have been ~+118px off); hand shown, not hidden, sitting just under the tile.
- pad8 (beat 8) also centered: content center = prose center **0px**, status8 left within 1px of prose, no overflow.

Regression (clean reduced load): natural g1→g8 (flip → blank → 256 → four merges → pointer+drag → type → check → sandbox), **rail 8/8**, **console clean (zero logs)**. Dark theme (ground #171511, token #FF9377, `pad justify-content:center`, tap-arrow stroke → dark ink #F1ECE4) and forced light theme (ground #FBFAF7, tap-arrow stroke → #201D1A) both correct. Round-3 fixes still intact (chevron count 0, clean `#dragN`, matchMedia-driven reduced-motion).

**Code regions touched:** CSS `.pad`/`.pad-wide` (only-the-pad wide + `justify-content:center` + `min()` clamp), CSS added `.tap-arrow` (beat-1 section), HTML beat-1 note (`.tapnote` + redrawn up-arrow SVG), JS `positionGesture()` (host-relative math). Nothing else changed; the round-1/2/3 behavior is untouched.

---

## Round 7 — the playable run (recorded-run rail, caption channel, compare strip, lineage, mcShuffle)

*Author directive after the IDSA teardown: playable animated demonstrations are essential; every algorithmic unit carries at least one **playable run** (the algorithm performs on real data; the reader plays/pauses/scrubs time both ways) on top of its **manipulables**. This page is the book's reference implementation of the scrub grammar. The author also approved the full motion layer the same day — no existing animation timing/easing was retuned; new rail motion follows spec §4 at equal-or-lower energy.*

### What changed, per scope item

1. **Beat 5 is now the run rail.** The old endpoint-recompute dragnum+sparkline (over `"once upon a time"`) is replaced by a **time-travel scrub over a recorded BPE training run on this page's own opening paragraph**. New embedded data (`PARA` + `RUN`) sits beside the existing engine; the engine (`byteSeq/nextMerge/applyMergeAll/train/encode`) is unchanged.
   - `PARA` = the beat-1 opening paragraph, **byte-for-byte** (179 bytes, ASCII). `RUN` = the recorded run as `[{a,b,id,c}]`, 23 merges — every merge whose corpus count was still ≥2. `n_max=23` is the exact "no degenerate tail" cutoff (the 24th best pair has count 1).
   - **One playhead `n` drives three linked views** (IDSA's "one timeline, linked views"): the **paragraph strip** re-tokenizes to state-`n` (verbatim text split into token segments — merged tokens get a warm `--token-fill` wash, raw bytes stay plain; the paragraph literally warms up scrubbing forward, cools scrubbing back); the **rule chip** is born wearing its genuine count (`th + e␣ → the␣  seen 3×`, byte-blue inputs / vermilion tokens — honest temperature); the **sparkline** is the rail, a tokens-remaining curve `179→112` with a vermilion **playhead dot + stem**.
   - **Caption** (`#runCap`, `aria-live`) narrates each step with real numbers: `Step 3 of 23: "e" + "r" were the most common neighbours (5 times), so they became token 258 — 165 → 160 tokens.`
   - **Drawn ink play/pause glyph** (inline-SVG hand-drawn triangle / two bars, gold fill + ink stroke — never a default control). Autoplay `setInterval(400ms)` ≈ **2.5 steps/s**; **any reader interaction pauses** (`manual()` → `stopPlay()`); replays from 0 if pressed at the end.
   - **Keyboard**: ArrowLeft/Right = ±1, Home/End = ends (on `#dragN`, `role="slider"`, `aria-valuemin/max/now`). **Pointer**: drag the pill handle (fine) or scrub the sparkline (coarse, PADX-aligned). Column-native — **no frame/card/box**.
   - **Determinism**: state-`n` is always `encode(PARA, RUN.slice(0,n))` — recomputed, so it is **identical arriving 0→n or n_max→n** (no incremental mutation to drift).
2. **Caption channel** added under beats **4 / 5 / 6 / 8** (`.caption`, secondary ink, `aria-live="polite"`, byte-for-byte identical under reduced motion since `setCaption` has no `REDUCED` branch). Pad captions carry the real pre-merge count: `"t" + "h" appeared 2 times — fused into token 256.` / on tear: `pulled token 256 back into "t" and "h".` Beat 6: `4 bytes → 2 tokens, 2 of them merges you taught it.`
3. **Beat 8 compare strip** — the sandbox's editable line rendered three ways with live **tile** counts: **word-level** (words absent from a stated vocabulary become a miniature tired-eyed **UNK blob**, `UNKMINI`, same drawing language as beat 2), **raw bytes** (all blue), **BPE · your merges** (mixed; tracks `pad8.getMerges()` live and shrinks as you teach it). The word vocabulary is **real and stated in-page**: the distinct words of the beat-4 corpus `the cat in the hat` → `{the, cat, in, hat}`. `banana banana` → word 2 (both UNK) / bytes 13 / BPE 13, and BPE drops (→9, →11, …) as you merge.
4. **Beat 6 lineage touch** — tapping a vermilion token in the encoded output shows one transient note `th = t + h — merge #1` (byte-blue parts, vermilion result). One at a time; dismiss on next tap / tap-away / Escape; each merged tile is a real `role="button"`, `tabindex="0"`, `aria-label`, and the note is mirrored to an `#linSR` `.sronly` live region for screen readers. One value at the moment it matters — nothing else decorated.
5. **Scrub grammar** kept consistent with the page's existing affordances: pill+underline `#dragN` handle, drag + arrows + Home/End, playhead dot, drawn play toggle, **no chevrons** (banned by the author; the round-3 removal stands).
8. **MC-blank shuffle** — `mcShuffle` copied **byte-for-byte** from `language-modeling.html` and called `mcShuffle(menu, blankEl.id)` inside `wireMC` **before** `opts` is captured. Both `mc-unk` and `mc-final` now deal. With the book-wide `:mc1` salt: **`mc-unk` → correct 2nd, `mc-final` → correct 3rd**, correct never first, positions differ. `opts[0].focus()` still focuses the first *rendered* option.

### Fix-history ported (earned rules)

- **pointerdown+preventDefault must `.focus()`** — the new `#dragN` and the sparkline `pointerdown` call `e.preventDefault()` (drag-select guard), which suppresses native focus. Added `try{dn.focus();}catch(_){}` to both so **click-then-keyboard works** (verified live: real mouse-click on the pill + real ArrowRight advanced step 5→6). This is the exact idiom that was re-shipped broken in unit 2; it is not broken here.
- **Shared-class check across consumers** — `.caption` is one class used by four elements; the `vis()` extension (`0xFFFD → "·"`) was checked against every consumer (pad, encode, beat-7, compare) — none produce U+FFFD on their fixed corpora, so it only affects arbitrary sandbox input.
- **Reactions are moments, not states** — the paragraph's `.just` flash lands unconditionally (CSS `@keyframes pjust`, 550ms) and is gated off under reduced motion.

### Acceptance-gate results (self-verified; the design lead re-verifies)

Honesty (Node, extracting the **shipped** engine + `PARA` + `RUN` and re-deriving): **20/20 PASS** —
- `PARA` is byte-for-byte the beat-1 opening paragraph (ASCII).
- `RUN` re-derives exactly: every `{a,b,id,count}` matches an independent `train(PARA)`; `n_max=23`; 24th best pair count = 1 (no degenerate tail).
- Scrub determinism: state at every `n` identical from either direction; tokens curve strictly `179→112`.
- Rule-chip integrity: `idText(a)+idText(b) === idText(merged)` for all 23.
- Caption numbers match the run at every `n` (live: steps 3/5/6/10/23 all carry exact count + token delta + token id).
- Compare counts re-derived: `banana banana` → 2(2 UNK)/13/13, `+a·n` merge → BPE 9, `the cat` → 0 UNK.
- `mcShuffle` byte-identical to `language-modeling.html`; positions 2nd / 3rd.

| §8 base gate (could-regress) | Result |
|---|---|
| Gating end-to-end (hard reload, **no** escape valve) | **PASS** — fresh→ g1…g7 fire in order, rail **8/8**; g4 = "10 tokens · 4 new words"; **g5 requires pointer *and* rail** (pointer-only leaves beat 6 hidden) |
| Anti-slop grep sweep | **PASS** — 0 card/kicker/chip/stat-tile/pill classes; 0 `type=range`; every `<button>` reset; 0 emoji; 0 `href="#"`; new controls use the palette only |
| Both themes | **PASS** — dark (warm ground, vermilion token chips on `#38201A`, gold handle) + light both correct in screenshots |
| Console clean | **PASS** — **zero** logs from hard reload through natural playthrough + reveal-all + rail scrub-thrash + play/pause + lineage + compare editing |
| 375px | **PASS** — `scrollWidth==clientWidth` (overflow 0); paragraph wraps at token boundaries; compare tiles wrap; rail spans the column |
| Size budget | **PASS** — **124.9 KB** ≤ 300 KB; 1 data: URI (font); 0 external refs; 0 audio APIs |
| Reduced motion | **Structural PASS, flagged** — see below |

Interaction matrix (mouse / touch-via-pointer / keyboard) verified for the rail (drag pill, scrub spark, arrows/Home/End, play button Enter/Space), lineage (click + Enter/Space + Escape), compare (edits), pads (drag + keyboard merge/tear).

### Deviations from spec (flagged loudly)

- **Beat-1 opening paragraph made ASCII.** The em-dash clause `…in its life — it was born…` became `…in its life. It was born…`. Reason: the recorded-run corpus **must be** the opening paragraph byte-for-byte, and a UTF-8 em-dash (3 bytes) would render as broken lone bytes at n=0. ASCII → byte offsets == char indices → the paragraph strip slices the verbatim string cleanly. This is a one-clause copy-edit outside the numbered scope items; it keeps meaning and improves the run. **The only reader-prose change.**
- **`#encodeOut` lost its `aria-live`.** Now that merged encode tiles are SR-focusable lineage buttons, a live token row + the new `#cap6` caption would double-announce; the caption carries the announcement, the tiles stay SR-navigable. `#cmpCap` (compare summary) is deliberately **not** live so beat 8 keeps exactly two live regions (status + pad caption).
- **`vis()` extended** with `0xFFFD → "·"` (defensive for arbitrary sandbox bytes; no effect on any fixed corpus).
- **No speed slider, no autoplay-on-reveal, no framed panels** — per spec §7 "out of scope, deliberately." Single considered pace (~2.5/s); the reader initiates play.

### Claim → anchor (new displayed facts)

Every new number is the page's own computation on the page's own text — no external/historical claim added, no new footnote.
- Recorded run (23 merges + counts), rule chips, captions, sparkline curve → **this page's opening paragraph, tokenized by this page's engine** (re-derivable in Node; diffed).
- Compare-strip word vocabulary `{the, cat, in, hat}` → **the page's own beat-4 corpus** `the cat in the hat`, stated in-page.
- Beat-6 lineage merge numbers → the reader's own pad-4 merges (guided order), stated at tap.

### Could not verify (flagged, never silently passed)

- **Reduced-motion not exercised live.** This test environment ran **full motion** (`matchMedia('(prefers-reduced-motion: reduce)').matches === false`), and it exposes no motion-emulation. Full-motion was therefore verified directly (the flagship path). Reduced-motion is verified by **code inspection**: captions are set unconditionally (identical text), the rail's `renderPara/renderRule/renderCap/drawHead` run regardless of `REDUCED`, and every new animation (`.ptok.just` flash, squash/pop reuse) is gated on `!REDUCED` — so reduced motion is instant state-swaps + identical captions, exactly the no-motion warmth channel the spec asks for. (Prior rounds saw the opposite default and used a since-removed `?motion` override; there is none in the shipped file — grep-confirmed.)

### Honest feel-check — "does scrubbing feel like holding time in your hand, or like operating a form?"

**Holding time.** You grab the step (a number living inside the sentence) or the curve itself and drag; the paragraph physically warms from cold blue crumbs into warm vermilion tokens as you move forward and cools as you move back, the rule chip is *born* wearing the exact pair and its real count for that instant, the caption speaks the step, and the playhead rides the tokens-remaining curve — three views moving as one timeline. Press play and the algorithm performs on its own at a considered pace; touch anything and it yields control back. There is no field, no submit, no form chrome — the only "control" is the number in the prose and the shape of the curve. **One honest caveat:** scrubbing *backward* is an instant deterministic state reconstruction (chips revert) rather than a per-token un-fusing animation — but that is the correct idiom for time-travelling a *recorded run* (IDSA's reconstruction, not a tear), and the forward `just`-flash plus the warming paragraph carry the felt sense of fusion. It reads as watching and holding a process, not filling in a form.

**Code regions touched (round 7):** CSS — new beat-5 run-rail block (`.runrail/.run-para/.ptok/.rail-row/.playbtn/.railspark/.run-rule/.caption`), `.lin-pop` (beat 6), compare strip (`.wordvocab/.compare/.cmp-*/.ctile`), `.sronly`, `.encode-out:empty`→`.is-empty`. HTML — beat-1 paragraph (ASCII), beat-5 run-rail markup (replaces the draggable-number sentence), `#cap4/#cap6/#cap8/#cmpCap` + `#linSR`, beat-8 word-vocab line + compare rows. JS — `PARA/RUN`, `vis()` guard, `UNKMINI`, `mcShuffle` + `wireMC` call, `makePad` caption (`setCaption/pairCount/bytesOfId`, `doMerge`/`doTear`/`reset`), pad-4 `captionEl`, rewritten `initHooks["5"]` rail (pointers block kept), `initHooks["6"]` (caption + lineage), `initHooks["8"]` (caption + compare). Gating machinery, the pads' merge/tear/drag, beats 1–3/7, and every existing animation timing are untouched.

### Round 7 — adversarial review (same day)

- **Independent honesty rebuild (blind reimplementation, not the page engine):** my own trainer re-derived all 23 recorded merges — pair, count, and id identical; curve 179→112; n_max cutoff exact (24th-best pair count 1); `mcShuffle` byte-identical to `language-modeling.html`; `PARA` pure ASCII and verbatim in beat 1. 17/17 checks.
- **Live (HTTP server, real input where it matters):** natural gating through g3; `mc-unk` dealt correct to 2nd and `mc-final` to 3rd (both answered); rail state at n=0/5/23 **exactly matches the independent derivation** ("i"+"n"→260 seen 4×, 156→152; "a"+"s␣"→278 seen 2×, 114→112) and is identical arriving from either direction; autoplay measured **2.42 steps/s**, pauses on interaction, playhead holds afterwards; all four pad merges executed by keyboard with correct per-step captions (counts 2/2/2/2, 18→10 tokens, vocab 4); encode "that" → `th`·`at` with cap6 "4 bytes → 2 tokens, 2 of them merges you taught it."; lineage pop `th = t + h — merge #1` + SR mirror; compare strip 2 (2 UNK) / 13 / 13 → **BPE 9** after one sandbox `a·n` merge, caption updating live.
- **1 defect found, fixed by reviewer (pre-existing since round 1, exposed now): the target-pointers were bare click-only `<span>`s while g5 *requires* a pointer touch — keyboard-only readers could never unlock beat 6.** Fix: pointers now `role="button"` `tabindex="0"` with Enter/Space → click; the page's global gold `:focus-visible` covers them. Verified live (focus + Enter fires scroll-then-glow on `status4`). Rule added to the skill catalog: audit every *goal's* input path for keyboard, not just the instruments'.
- **Tooling limits, stated honestly:** the test environment's compositor stopped painting screenshots mid-review (DOM/console probes unaffected) — my visual pass is partial; the builder's both-theme screenshots from its own session and the author's next look carry the visual layer. Reduced-motion not re-exercised live (the author's machine now runs full motion; the builder's code-inspection verdict stands). My first pad probe also mis-drove the keyboard (all keypresses in one JS tick → no frames; and I walked selection away from the hot pair) — both were probe bugs, not page bugs; the paced, correctly-aimed driver worked perfectly.
- **Verdict: SHIPPED.** Shipped for review, label `round-7-run-rail`, favicon pinned 🔤.

---

## Round: reveal fade + frontier cue (2026-07-23) — cross-page builder pass

Follow-up to the reduced-motion discovery on the sibling pages (the author turned OS animations on and the gated reveals *popped*). Reveals were `rise .34s translateY(9px)` — imperceptible — and were skipped entirely under `prefers-reduced-motion` (`if(!REDUCED)`), so reduced-motion readers (the author's environment) got an instant pop instead of the book's fades-only path. Implemented identically to the sibling pages per `reveal-motion-cue-spec.md`.

**What changed (current line anchors):**
- Reveal motion CSS (77–90): `rise` → `.9s cubic-bezier(.22,.6,.2,1)` / `translateY(14px)`; new `.reduced .reveal-anim{ animation:fadeReveal .45s ease-out both }` + `@keyframes fadeReveal{ from{opacity:0} }` (reduced path is a felt fade now, never `animation:none`).
- Frontier-cue CSS (81–90): `.cuewrap`, `.cue .d`, `@keyframes cueDot`, `.reduced .cue .d`, `.cue-in`, `.cue-out`, `@keyframes cueOut`.
- **Collision resolved (page-specific):** `.fade-in` already existed here (`animation:fadein .6s`, used by the beat-7 "famous cousins" tiles). Repointed to the shared `.fade-in{ animation:fadeReveal .4s ease-out both }` (326) + `.reduced .fade-in{ animation-duration:.32s }` (327); removed the now-orphaned `@keyframes fadein`. Cousins still fade (opacity 0→1, stagger preserved) — visually equivalent, marginally snappier.
- Frontier-cue markup (404): one `<div class="cuewrap" id="frontierCue">…the page continues when you play…</div>` directly after beat 1's `</section>`.
- `revealBeat`/`revealAll`/`placeCue` (646–699): dropped the `!REDUCED` guard (reveal-anim now always added; `.reduced` swaps to the opacity fade); `revealAll` staggers newly-revealed beats `animationDelay = min(i*90, 540)ms` (0 for all under REDUCED) and clears each inline delay on `animationend`; new `placeCue()` runs on load, after every natural `revealBeat`, and once after `revealAll`.
- Sub-reveal fades: `flipAfter`, `unkConseq`, `byteAfter`, `beat4after`, `vocab4` wrap + cap, `pad4aside`, `pad4undo`.

**initHook audit** (does any hook read geometry across the animated section's transform boundary at init? — all run synchronously at reveal):

| Hook (beat) | init-time geometry | verdict |
|---|---|---|
| 2 (=null) | none | n/a |
| 4 (guided pad) | `positionGesture` = delta of tile-vs-gestureHost rects (both inside the beat → transform cancels); fires on a timer, not at init | safe, no re-run |
| 5 (target pointers) | `inView`/`scrollIntoView` live in the click handler (event-time); init only wires listeners | safe |
| 6 (encode sandbox) | init just paints tokens; footnote pop uses `offsetLeft/offsetTop` (layout coords, transform-immune) at click-time | safe |
| 7 (scale/cousins) | IntersectionObserver fires async, after reveal; `wireMC` wires listeners | safe |
| 8 (free pad) | `positionGesture` delta-based; no init-time viewport positioning | safe |

No hook positions against the viewport / an outside element at init → no `animationend` re-positioning added.

**Sub-reveal classification** (every `hidden=false` site):

| Site | Class | Why |
|---|---|---|
| flipAfter, unkConseq, byteAfter, beat4after | **fade-in** | beat follow-up / consequence paragraphs |
| vocab4 wrap, vocab4 cap | **fade-in** | vocabulary panel + caption (spec names "vocab wraps"/"caption blocks") |
| pad4aside ("count them"), pad4undo | **fade-in** | one-shot teaching asides, shown in a settled state (post illegal-merge / post first-merge) |
| unkScene | already-animated | scene has its own choreography |
| ribbonWrap | already-animated | `ribbon` clip-path entrance |
| cousins wrap + tiles | already-animated | tiles carry `fade-in`+stagger; wrap left instant to avoid double-animating |
| gesture hand | already-animated | `.gesture.tapping` self-animates |
| beat-1 menu, corrections, byteCorrection | latency-critical (instant) | dropdown + wrong-answer feedback |

**Self-verification (headless, spec §5):**
1. Grep: no `!REDUCED` guard on `reveal-anim` (add is unconditional, 652); `fadeReveal`/`cueDot`/`cueOut` each defined exactly once (80/86/90); cue markup once, directly after beat 1 (404); wording byte-identical to sibling pages. PASS.
2. Structural: `revealAll` sets and clears staggered delays; `placeCue` runs on load + every reveal path; cue retires (`cue-out`→remove, `_out` guard + 700ms fallback) on the `anyHidden=false` branch, hit by both the final natural reveal and reveal-all. PASS.
3. Tables above. PASS.
4. `wc -c` = **131,210 B** (≈128 KB ≤ 300 KB). Duplicate-id sweep (node): 0 dups; `id="frontierCue"` appears once. PASS.
5. Bonus: extracted the page `<script>` and compiled with `vm.Script` (node v22) — parses clean (console-clean from a syntax standpoint).

**Not verified headlessly — flagged for the adversarial review + live pass:**
- Motion *feel*: that `.9s` rise reads as "felt," the `.35s` cue lead + cue-out cadence look right, and reduced-motion genuinely fades (no pop). No browser use this pass (per brief).
- Before-byte-size not captured (a local tooling issue prevented the initial measurement). After-size exact, budget passes with wide margin (net add ≈ +2.5 KB).
- Borderline fades (revert to instant if laggy live): `vocab4` wrap/cap and the two `pad4*` asides — classified fade-in per the spec's "asides/vocab wraps/caption blocks," but they sit adjacent to an instrument.
- The `.fade-in` **rule** matches the sibling pages, but on this page it lives at 326 (its pre-existing spot), not beside the reveal block; `fadeReveal` is still defined exactly once.

## Round 8 (2026-07-24, direct fix) — cue register + stacking cleanup · label `round-8-cue-register`

Two book-wide fixes from the author's motion-round review (found on the other pages, idiom shared here): document-level `animationend` cleanup dropping `reveal-anim`/`fade-in`/`cue-in` once `rise`/`fadeReveal` finish (retained `both` fill made revealed beats stacking contexts that trapped popover z-indexes below the frontier cue), and the cue re-registered as a whisper — 1.05rem, `--ink2` words, gold dots only, 3.4rem top margin — so it can't be mistaken for a gold instrument annotation. Verified live: 0 lingering animation classes after reveal-all, cue retires, console clean, colors computed ink2/gold.
