# Build notes — "Bigger or cleverer?" (`the-bitter-lesson.html`)

*"Language, from scratch" · chapter 1, unit 2. Built 2026-07-23. Single self-contained fragment, 103.9 KB (budget 120 KB). Silent, both themes, full reduced-motion path, keyboard + touch + mouse throughout.*

The page carries one instrument — a **multiplication rectangle** (capability = cleverness × resources) the reader resizes by its gold edges — across six gated beats: place a bet (belief tray) → find the two levers → watch scale break their symmetry (+5% at the frontier) → read the lesson right (inline blank) → re-pour the bet → the mindset + the door.

---

## 1. Design-system inheritance (verified, not retyped)

Tokens were **extracted programmatically** and spliced in, then re-checked by md5 against **both** DNA pages. All five token regions are byte-identical across `bpe-north-star.html` and `language-modeling.html`, and the spliced result matches:

| Region | md5 (all three files) |
|---|---|
| `@font-face` (Patrick Hand, 32,129 B incl. woff2 data-URI) | `77b03d195982bde9424e2c693a9df817` |
| `:root` (light default) | `b2ed8a68e24d5fe49bf699cc5e9c1e8c` |
| `@media (prefers-color-scheme:dark)` | `0e7674e7389c28275738953540f22e43` |
| `:root[data-theme="light"]` | `22bafe747a0753ea08d39e9d70a8ca99` |
| `:root[data-theme="dark"]` | `cdd2561851345ce4b524b88eac47fc25` |

Idioms ported from `language-modeling.html` **with their fix history**: belief-drop tray (pointer-drag + tap + keyboard), the machine (`machineSVG`/`mExpr`/`mReact` + expression-timer discipline), inline blank/menu (`wireMC` pattern), `.sronly`, candidate-row grammar (`.cands`/`.cw`), gated beats + rail, the lineage-strip scrubber (reused for the world scrubber), scroll-then-glow target-pointer, and — critically — **`.focus()` inside every `preventDefault` pointerdown** (width handle, height handle, world scrubber).

Palette thesis honored: **byte blue** = resources (the width you pour in) · **token vermilion** = cleverness/efficiency (the height squeezed out) + the earned-area flash · **gold** = the reader's touch only (belief drops, edge handles, scrubber grip, hand-lettered notes) · **green** = goal ticks only. Resting area is the neutral `--gray-fill` wash, never a new hue.

---

## 2. Fidelity table — every claim → anchor

Content source of truth: the concept-wiki page for "the bitter lesson" (via the ingestion pipeline) + the CS336 L01 transcript. **Only** the spec's fidelity inventory is used. Nothing from Sutton, essay history, the 44×/ImageNet result, the compute-budget framing, dollar axes, or invented names/years appears anywhere (grep-confirmed: `Sutton|ImageNet|OpenAI|44×|B200|175B|budget|compute-optimal|Shannon|essay|2012|2019|2020` → 0 matches).

| # | Claim in reader prose | Anchor | Note |
|---|---|---|---|
| 1 | The rumor: reading/writing machines went from lab curiosities to "drafting a fair slice of the world's code" | — | **Framed as rumor** ("if you believe the noise"), the book's own device; the page immediately sets out to take it apart. Asserts nothing as page-fact. Spec §4 beat-1 authorizes this framing. |
| 2 | "the field calls it the bitter lesson … almost always misread" | L01 08:35 ("has been circulating … people talk about it") + 09:22 ("common misconception") | Names the term of art, glosses it as the fight the reader just bet on. No provenance beyond "circulating". |
| 3 | "double what you pour in, or double what you squeeze out — either one doubles the machine" | instrument arithmetic | The rectangle's own device, consistent with the identity below. |
| 4 | `accuracy ≈ efficiency × resources`; "efficiency is what you get out for what you put in; resources are the input" | L01 09:22 | Verbatim identity; efficiency = output/input, resources = input. Footnote 1. |
| 5 | "a method that runs twice as slow just costs you a longer wait" | L01 09:22 ("run takes twice as long … just wait twice as long") | Footnote 1. |
| 6 | "at the frontier, the same slowness can burn hundreds of millions of dollars — even a five-percent gain is a fortune" | L01 10:09 | Footnote 2. The only imported dollar phrase; kept in anchored prose, separated from the instrument's unit-play. |
| 7 | Correct reading: "cleverness that keeps paying as the machine grows is what wins"; "methods that scale are what matter … cleverness multiplies size" | L01 09:22 ("algorithms that scale are what matter") | "algorithms" → "clever methods/cleverness" (audience rule). Footnote 1. |
| 8 | Wrong-answer correction: "the popular misreading: that size is all that matters and the clever ideas don't" | L01 09:22 ("scale is all that matters; algorithms don't matter") | Quotes the misreading back, translated to the page's vocabulary. Footnote 1. |
| 9 | "treats efficiency as … an obsession … profiling and benchmarking, which is really just measuring, relentlessly" | L01 07:47 ("profile and benchmark everything and … optimize for efficiency") | Gloss of the two terms in plain words. Footnote 3. |
| 10 | The door: "Compute efficiency: the mindset … brings receipts — where the seconds and the dollars really go" | — | Plain-text mention of the next unit. **No numbers borrowed** from it (no 44×, no budget figures). |
| 11 | "frontier — the largest machines anyone is building" | gloss | Qualitative gloss of the scrubber's top stop; no numeric claim. |
| 12 | Every `×N`, the +5% strip, "one whole laptop's worth" | reader's lever state | Honesty contract: live arithmetic on `RectMath`, denominated in the starting rectangle. See §3. |

Sources block cites L01 · 09:22 / 10:09 / 07:47 + a "this page" line stating that every multiple is the page's own arithmetic and the only imported quantities are the three quoted ("twice as long", "~5%", "hundreds of millions of dollars"). Provenance block keeps the lecture's own terms ("algorithms", "scale"), per the skill.

---

## 3. Honesty core & the §7.1 gate (extracted into Node, all pass)

All displayed numbers derive from one pure object, `RectMath` (baseline `w0=h0=2`, `AREA0=4`). The Node test (a temporary local script, `verify-page.mjs`) extracts it from the shipped HTML and asserts:

- `multiple(2,2)=×1.0`, `multiple(4,2)=×2.0` (width road), `multiple(2,4)=×2.0` (height road), `multiple(10,2)=×5.0` (cluster), `multiple(40,2)=×20.0` (frontier), `multiple(40,2,+5%)=×21.0`. **PASS.**
- `multipleStr` equals an independent reimplementation `"×"+(w·hEff/4).toFixed(1)` across a **4,080-state sweep** (w 1–40 × h 1.0–6.0 step 0.1 × {strip,no-strip}). **PASS.**
- **Beat-3 strip geometry** — `stripRender` returns height `= 0.05 × current rendered height` spanning the **full** rendered width, sitting on top. Checked for three rect sizes. **PASS.** Confirmed again in the *live DOM*: `strip.height / area.height = 0.0500`, `strip.width === area.width` at the frontier.
- **Engineered coincidence** — `stripAreaUnits(40,2) = 4 = AREA0`, and the frontier +5% raises the multiple by exactly `+1.0×`. So "that 5% slab is worth your whole laptop's start" is a *provable* statement about the instrument's units, not a claim about the world. **PASS.**
- **Beat-5 ghosts = stored beat-1 placement** — the ghost fill height and the "was N" label both read `beat1Placement[id]` directly, no transform. Live: with a completed beat 1, 3 ghost meters render; via the reveal-all escape valve (no beat 1), 0 ghosts and a neutral verdict (no crash). **PASS.**

---

## 4. Acceptance gates

### Spec §7
1. **Honesty** — see §3. All pass, verified headless *and* in the live DOM.
2. **Fidelity table** — §2; zero claims outside the inventory; forbidden-term grep clean.
3. **Both-roads detection (beat 2)** — width-double and height-double each detected and ticked independently; live test reached `×2.0` by each road, both edge-ticks shown, then g2 → beat 3. **PASS.** (Plus the spec's "reset between attempts": the doubled edge gently auto-returns to baseline after ~950 ms with a hand-lettered cue, and the reset itself re-triggers detection if the reader grew the other edge early.)
4. **Audience sweep** — caps-pattern grep over reader prose (style/script/sources/sr-only stripped) for `LSTM, BERT, GPT-2/3/4, transformer, attention, algorithm(s), vector, kernel(s), token(s), …` → **0 hits**. Required first-appearance glosses all present: "the bitter lesson" (named as the reader's fight), "efficiency" (what you get out per what you put in), "resources" (the input / what you pour in), "profiling and benchmarking" (just measuring, relentlessly), "frontier" (the largest machines anyone is building). **PASS.**
5. **Standard sweep** — below.

### Skill standard sweep
- **Gating end-to-end, natural (no escape valve)** — live playthrough beats 1→6, all goals fire in order, rail fills 6/6, `after` blocks reveal, **zero console errors**. **PASS.**
- **Escape valve** — Reveal-all reveals 2–6; every instrument still works; beat 5 with no first bet degrades gracefully; **zero errors**. Rail honestly shows only goals actually completed. **PASS.**
- **Wrong-answer path (beat 4)** — wrong option shakes + shows a correction quoting the misreading; blank stays open; correct option fills with green tick → g4. **PASS.**
- **Anti-slop greps** — no `href` at all, no `<a>`, no `AudioContext`/`Audio`/`speechSynthesis`/`.play(`, no `<audio|video|input|select|textarea|link|@import|script src>`, no external URLs (only the SVG namespace URI), no emoji, no `hand-crafted`/dashboard labels. **PASS.**
- **Drag + tap + keyboard w/ focus-on-click** — belief drops (drag/tap/↑↓ on the candidate, `preventDefault`+drops aria-hidden), edge handles (drag/arrows/Home/End, `.focus()` in pointerdown), world scrubber (drag/arrows/Home/End, `.focus()` in pointerdown). **PASS** (driven through the real handlers).
- **Both themes** — `--ground` resolves `#FBFAF7` (light) / `#171511` (dark) via `data-theme`; tokens byte-identical to the proven pages. **PASS** (variable resolution; see limitation below re: pixels).
- **375 px** — SVG 340 px wide inside the 375 viewport (fully visible), both handles land on the rectangle edges and track the lever, no horizontal scroll. **PASS.** Desktop: figure 800 px centered within 949 px, `scrollWidth == clientWidth`. **PASS.**
- **Reduced motion** — the test environment forces `prefers-reduced-motion: reduce`; the entire natural + escape-valve playthroughs ran in that mode with correct numbers and no errors, so the reduced path is confirmed playable. **PASS.**
- **Console clean** — no errors on load, nor through natural play, reveal-all, wrong answers, edge cases. **PASS.**
- **Arrow geometry** — only two arrows, both the proven idiom (beat-1 hint = verbatim `g1hint`; scrubber hint = shaft `M3 10 h12`, head apex `(20,10)`, shaft ends `(15,10)` → 5 px gap along the horizontal bisector). No new arrow points at an instrument part (handles + text-pointer used instead), so no "arrow into empty space" risk. **PASS.**
- **Size** — 103.9 KB (< 120 KB). **PASS.**

### Not fully verifiable here (flagged, not silently passed)
- **True visual screenshot / pixel-level aesthetics.** The test environment was **not compositing frames**, so `screenshot`/`zoom` failed the whole session. I verified structure, behaviour, geometry, arithmetic, layout **metrics** (getBoundingClientRect), theme-variable resolution, and console via the live DOM + headless Node — but I could not *eyeball* the rendered rectangle, the vermilion gain-flash, the machine's nap, or dark-mode rendering. Mitigations: the visual grammar is grep-verified (no cards/chrome/emoji), the design is 100% inherited verbatim tokens/idioms, and the nap eyelid element + its non-identity transform are confirmed present. **A human visual pass in a live browser is still recommended before shipping.**
- **Motion-on feel.** The test environment forced reduced motion, so the gain-flash timing, squash/stretch reactions, and gasp were exercised as logic but not *seen* animating.

---

## 5. Feel-check (spec §7.5)

- **"Does dragging the edge feel like feeding the machine?"** — I believe yes, with a caveat. Gold handles sit on the blue (resources) and vermilion (cleverness) edges; pulling either grows the area, leaps the `×N`, and (motion on) flashes the newly-earned slab vermilion while the little machine reacts beside it. In the reduced-motion path the number/area still update instantly, which reads as direct manipulation; the flash + reactions add the warmth I couldn't watch. Confidence: high on mechanics, medium on the animated "feeding" warmth until a motion-on visual pass.
- **"Does the +5% strip land as a gasp?"** — Yes. At the frontier the thin vermilion strip lights the full enormous width, the multiple jumps `×20 → ×21` (a whole laptop-worth), the machine gasps, and the prose closes it: "as much as your whole laptop started with, from a rounding error." The arithmetic *coincidence* (strip area == the entire starting rectangle) is the emotional hook and it is provably exact. The contrast is built into the interaction: the same nudge at the laptop stop is a visible whisker.

---

## 6. Deviations from the spec (with reasons)

1. **Footnote anchoring split.** The spec's footnote map grouped "wait twice as long" under ² (10:09). The transcript speaks that line at **09:22**, so I anchored it to footnote ¹ (09:22) and kept ² for the frontier "hundreds of millions / 5%" (10:09). This is a fidelity *tightening* — the skill forbids pinning a claim to a timestamp that doesn't support it.
2. **The +5% is one boolean, not a second height value.** Beat 3 holds height at `h=2` and toggles `state.strip`; `multiple(w,2,true)` applies the 5% exactly once. This prevents any double-count and isolates the +5% into a single named, testable quantity. The strip is drawn as exactly 5 % of the base rendered height on top.
3. **Beat-2 auto-reset.** Rather than telling the reader to drag the edge back, the page gently animates the doubled edge to baseline (~950 ms) with a hand-lettered cue — matching the spec's "resets area between attempts" and making the second road frictionless. Robust to either interaction order.
4. **Beat-6 sandbox opens at the canonical ×1.0** baseline (2,2) with extended ranges [1..12], so "the starting size" means the same thing across the whole page.
5. **Rendering ≠ math (spec-sanctioned).** The rectangle's rendered *width* is compressed (per-stop fractions at the frontier; gentle linear fractions in beats 2/6) so every scale stays visible and grabbable at 375 px, while **all displayed numbers come from `RectMath` on true units** ("geometry math independent of rendered pixels," spec §3). Rendered *height* is linear within a beat, so the strip renders at a true 5 %. The rectangle is "a shape you hold," deliberately not a true-scale plot (no gridlines/ticks/axes chrome).
6. **The machine gained a real `.m-lid` element.** `language-modeling.html` defined `.m-lid` in CSS but never drew the element; I added it (drawn last, over the pupils) so it can close over the eyes for the new **nap** (half-lid, `scaleY .5`) and so the ambient idle tic is now a genuine blink.
7. **Wrapper class `.bl`** (was `.lm`), scoping only the three wrapper rules; all standalone idiom classes copied unchanged.

---

## 7. Open risks for adversarial review

- **Visual/motion pass outstanding** (see §4) — the one gap. Worth a displayed-pane look at: the vermilion gain-flash, the nap eyelid shape over the round eyes (a rectangular lid on a simple ink creature — acceptable but worth a glance), dark-mode contrast of the neutral area wash, and the wide-treatment rectangle at ~1200 px.
- **Compression legibility.** At the frontier the rectangle is a wide, short band (≈4.6:1); the +5% strip is a true-5 % sliver (~8 px at desktop, ~3 px at 375 px). It's exact by mandate; legibility leans on colour + the number-jump + the machine. If a reviewer wants it *bolder*, the honest levers are a min *stroke/label* on the strip (not a taller strip).
- **Beat-2 auto-reset timing.** 950 ms feels right in logic; a reviewer on a real device should confirm it doesn't feel like it "undid" an intentional drag (the hand-lettered cue is there to frame it).
- **Scrubber vs. two edges in beat 3.** Three controls share the beat (world scrubber, height/+5% handle, the machine). Verified all reachable and non-overlapping at 375 px, but a human should confirm it doesn't feel busy.

---

## 8. Design-lead review round (2026-07-23) — 1 defect found + fixed (label round-1-reviewed)

Independent verification: a from-scratch reimplementation of the multiplication arithmetic matched `RectMath` across my own 4,080-state sweep, the strip-equals-one-laptop coincidence, and the `×N` formatting; forbidden-term and URL greps re-run with wider patterns (all hits proved to be SVG coordinates, pixel math, or the font data-URI); full read of style/body/script.

**Defect (fixed in place):** beat 3's strip-gasp branch checked `reachedFrontier` but not the *current stop* — after visiting the frontier, re-toggling the +5% back at the laptop produced frontier-praising narration at the laptop stop, and the expression timer only reset at stop 2, stranding the machine in `surprised` (the stuck-expression pattern in conditional-reset form). Fix: the gasp branch requires `curStop === 2`, and the timer now always lands on the stop's resting face (`nap` at the laptop, `idle` elsewhere). Verified live: frontier+strip → surprised + "×21.0 … as much as your whole laptop"; back at the laptop, strip re-toggle → machine keeps dozing with the honest "×1.1 … small here" status. **Catalog implication: a conditional expression-reset is the stuck-expression bug wearing a guard — reset unconditionally to the current context's resting face.**

**Also verified live:** reveal-all initializes all six beats; console clean throughout. **Not verified by anyone's eyes:** the test environment would not composite frames for the builder or for me this session, so the rendered look (gain-flash, nap lid shape, dark-mode area wash, frontier band proportions, strip sliver legibility) ships eyeballed-by-no-one — flagged to the author as the first thing their pass covers. Shipped for review, 104.0 KB.

---

## 9. Author review round 1 (2026-07-23) — three findings (label round-2-author-fixes)

1. **"Rectangle on its face" (nap lid).** The single rectangular `.m-lid` slab across both eyes — the exact risk §7 flagged — read as a box, not eyelids. Rebuilt as **two per-eye ellipse lids** (slightly larger than the eye whites, body-fill, ink stroke) closing from the **top** (`transform-origin:center top`); nap = scaleY(.5) half-lids, blink = full close. Verified live: 2 ellipse lids per machine, origin at eye-top, nap transform correct. **Catalog note: character anatomy follows the creature's own geometry — one shape per eye, never one slab per face.**
2. **The premature third option.** "size × cleverness, multiplied" sat beside the rumor's two answers before the page had taught multiplication — un-set-up and answer-telegraphing (a spec-seeded flaw, not a builder one). Restructured: **beat 1 offers only the rumor's two answers; beat 5 introduces the third as "the answer the rectangle just put on the table."** Ghosts mark only the original two ("was N"); the newcomer wears a small "new"; the verdict celebrates or respects the reader's call ("You handed 4 drops to the newcomer…" / "The newcomer got nothing — conviction noted"). Beat-2's opener ("size, cleverness, or the two of them tangled together?") now *foreshadows* the third answer instead of competing with it. **Catalog note: an option a page will argue for is earned mid-page, not offered pre-taught.**
3. **"I don't see any animation in all built pages."** Not a page defect — a discovery: every page honors `prefers-reduced-motion`, and the author's environment reports it (as does the test environment). Proved live: lifting our gate attaches real CSS animations (machine gasp 1, pop 1, gain-flash 1, drop-birth 2 via `getAnimations()`). The full-motion layer exists and has NEVER been seen by anyone — instructions were provided to the author (Windows: Settings → Accessibility → Visual effects → Animation effects ON). Once flipped, the author's next pass is the book's first-ever full-motion review.

Re-verified after fixes: two-then-three tray flows, ghosts/"new" labels, verdict variants, lid geometry, console clean. Shipped for review, 104.6 KB.

---

## Round: reveal fade + frontier cue (2026-07-23) — cross-page builder pass

Direct follow-up to round-1 finding #3 (the reduced-motion discovery): with OS animations on, the gated reveals *popped* — `rise .34s translateY(9px)` was imperceptible, and `.reduced .reveal-anim{ animation:none }` gave reduced-motion readers (the author's environment) an instant pop instead of the book's fades-only path. Implemented identically to the sibling pages per `reveal-motion-cue-spec.md`.

**What changed (current line anchors):**
- Reveal motion CSS (79–82): `rise` → `.9s cubic-bezier(.22,.6,.2,1)` / `translateY(14px)`; the old `.reduced .reveal-anim{ animation:none }` replaced by `.reduced .reveal-anim{ animation:fadeReveal .45s ease-out both }` + `@keyframes fadeReveal{ from{opacity:0} }`.
- Shared sub-reveal utility (83–84): `.fade-in{ animation:fadeReveal .4s ease-out both }` + `.reduced .fade-in{ animation-duration:.32s }`.
- Frontier-cue CSS (85–94): `.cuewrap`, `.cue .d`, `@keyframes cueDot`, `.reduced .cue .d`, `.cue-in`, `.cue-out`, `@keyframes cueOut`.
- Frontier-cue markup (362): one `<div class="cuewrap" id="frontierCue">…the page continues when you play…</div>` directly after beat 1's `</section>`.
- `revealBeat`/`revealAll`/`placeCue` (512–553): dropped the `!REDUCED` guard (add unconditional at 513; `.reduced` swaps to the opacity fade); `revealAll` staggers newly-revealed beats `animationDelay = min(i*90, 540)ms` (0 for all under REDUCED, capped at 540 → only ~450ms max with 6 beats) and clears each on `animationend`; new `placeCue()` on load + after every natural `revealBeat` + once after `revealAll`.
- Sub-reveal fades: `after1`…`after5` (721 / 996 / 1095 / 1166 / 1195).

**initHook audit** (does any hook read geometry across the animated section's transform boundary at init?):

| Hook (beat) | init-time geometry | verdict |
|---|---|---|
| 2 (scaling rectangle) | **`positionHandles` DOES run at init** (via rAF + 60ms, inside the .9s window) — but `toPx` reads only `svg.getBoundingClientRect().width/height`; `translateY` changes neither, and the HTML handles sit inside the same transformed `fig`, so the transform cancels | **safe, no re-run** — the only init-time geometry hook, immune by construction |
| 3 (frontier + target pointer) | target `scrollIntoView` and handle-drag rect reads are event-time (click / drag) | safe |
| 4 (MC dropdown) | none | safe |
| 5 | none | safe |
| 6 (terminal) | none | safe |

The tbl `positionHandles` case is the sharpest of the three pages (a genuine init-time `getBoundingClientRect`), and it is precisely the "measurement fully inside the section" the spec calls safe — it reads intrinsic size, not viewport position, so no re-positioning on `animationend` is needed.

**Sub-reveal classification** (every `hidden=false` site):

| Site | Class | Why |
|---|---|---|
| after1 … after5 | **fade-in** | per-beat follow-up blocks |
| hint3 ("nudge the top edge up 5%") | **latency-critical (instant)** | appears *mid-drag* the instant the reader reaches the frontier — a fade would delay a next-move instruction (spec cat-3, "anything the reader just asked for"). Deliberate deviation from a blanket "fade all asides." |
| edge-ticks (tickW/tickH) | already-animated | `.draw` stroke entrance |
| r-gain flash | already-animated | `gainfade`/flash |
| menu4, corr4 | latency-critical (instant) | dropdown + wrong-answer feedback |

**Self-verification (headless, spec §5):**
1. Grep: no `!REDUCED` guard on `reveal-anim` (add unconditional, 513); `fadeReveal`/`cueDot`/`cueOut` each defined exactly once (82/88/92); cue markup once, directly after beat 1 (362); wording byte-identical to sibling pages. PASS.
2. Structural: `revealAll` sets and clears staggered delays; `placeCue` on load + every reveal path; cue retires (`cue-out`→remove, `_out` guard + 700ms fallback) on the `anyHidden=false` branch, hit by both the final natural reveal (beat 6, terminal via g5) and reveal-all. PASS.
3. Tables above. PASS.
4. `wc -c` = **110,712 B** (≈108 KB ≤ 300 KB). Duplicate-id sweep (node): 0 dups; `id="frontierCue"` appears once. PASS.
5. Bonus: extracted the page `<script>` and compiled with `vm.Script` (node v22) — parses clean.

**Not verified headlessly — flagged for the adversarial review + live pass:**
- Motion *feel*: `.9s` rise felt-ness, `.35s` cue lead + cue-out cadence, and reduced-motion fading (no pop). No browser use this pass.
- Before-byte-size not captured (a local tooling issue prevented the initial measurement). After-size exact; budget passes with wide margin (net add ≈ +2.9 KB from the 104.6 KB round-2 baseline).
- Deliberate deviation: `hint3` left instant (see table) rather than faded, on the spec's own latency-critical principle — confirm this reads right live.

## Author round 4 (2026-07-24, direct fix) — cue fixes · label `round-4-cue-fixes`

Author finding (their screenshot was this page's beat 1): the frontier cue sat directly under the gold "pour honestly" hint in the same hand-lettered gold register — indistinguishable. Fix (book-wide): cue re-registered as a whisper (1.05rem, `--ink2` words, gold dots only, 3.4rem top margin); plus the shared `animationend` stacking-context cleanup (see LM round-5 notes for the mechanism). Verified live: registers visibly distinct at the exact author composition, 0 lingering animation classes, cue retires on reveal-all, console clean.
