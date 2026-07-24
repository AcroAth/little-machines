# Cross-page round: felt reveal fade + hand-lettered frontier cue

Author request 2026-07-23: (1) "fade-in effect when revealing the next sections", (2) a hand-written
"interact to continue…" cue, better-worded, with motion if it earns it.

Root cause of (1): reveals are `rise .34s` — imperceptible — and under `prefers-reduced-motion`
the animation is skipped entirely (`if(!REDUCED)`), so reduced-motion readers (including the author's
own environment until 2026-07-23) get an instant pop. The book DNA says
the reduced path is *fades only*, never nothing.

Applies to all three built pages, identically (book-wide idiom, like `mcShuffle`):
`book/bpe-north-star.html` · `book/language-modeling.html` · `book/the-bitter-lesson.html`.
All rules in the `unit-page` skill apply.

## 1. Reveal motion (beats)

Replace the existing `rise` values in each page (single edit point, keep the keyframe name):

```css
.reveal-anim{ animation:rise .9s cubic-bezier(.22,.6,.2,1) both; }
@keyframes rise{ from{opacity:0; transform:translateY(14px)} to{opacity:1; transform:none} }
.reduced .reveal-anim{ animation:fadeReveal .45s ease-out both; }
@keyframes fadeReveal{ from{opacity:0} }
```

JS in `revealBeat`: **drop the `!REDUCED` guard** — always add `reveal-anim`; the `.reduced` root
class (already set on all three pages) swaps the animation to the opacity-only fade. (language-modeling
and the-bitter-lesson already carry a `.reduced .reveal-anim{animation:none}` override — replace it
with the `fadeReveal` rule; bpe has no override yet, add it.)

`revealAll`: stagger the unfurl — i-th newly-revealed beat gets `style.animationDelay = (i*90)+"ms"`,
capped at 540ms; under REDUCED, delay 0 for all (simultaneous quiet fade). Natural single reveals get
delay 0 (goal feedback must be immediate). Clear the inline delay on `animationend`.

**initHook audit (gate):** initHooks still run synchronously at reveal. For each hook, confirm it does
not read geometry *across the animated section's transform boundary* while the .9s translate is in
flight (measurements fully inside the section are safe — ancestor transform cancels out; layout-based
scrolls are unaffected by transform). If any hook positions something against the viewport or an
outside element at init time, re-run that positioning on the section's `animationend`. Record the
per-hook verdict in build notes.

## 2. Sub-reveal sweep (blocks inside beats)

Audit every `hidden=false` site in each page and classify:

- **Narrative blocks** (asides, follow-up paragraphs, scenes, vocab wraps, caption blocks) that
  currently appear instantly → add a shared utility at the moment of reveal:
  `el.classList.add("fade-in")` with
  `.fade-in{ animation:fadeReveal .4s ease-out both; }` `.reduced .fade-in{ animation-duration:.32s; }`
- **Already-animated entrances** (e.g. bpe `fadein`/`ribbon`/`born`, lm `gwfade`/`gwpop`/`capswap`,
  tbl `gainfade`/`dropborn`, unk-scene choreography) → leave untouched; never double-animate.
- **Latency-critical feedback** (correction lines, dropdown menus, footnote pop, status/caption
  aria-live text, anything the reader just asked for) → leave instant. A fading input surface feels laggy.

List the full classification table (site → class) in build notes.

## 3. The frontier cue

One element per page. Static HTML, placed in source directly after beat 1's `</section>`:

```html
<div class="cuewrap" id="frontierCue"><span class="note cue" aria-label="the page continues when you play">the page continues when you play<span class="d">.</span><span class="d">.</span><span class="d">.</span></span></div>
```

```css
.cuewrap{ text-align:center; margin:2.7rem 0 2.2rem; }
.cuewrap .note{ transform:rotate(-1.5deg); font-size:1.24rem; }
.cue .d{ display:inline-block; animation:cueDot 2.8s ease-in-out infinite; }
.cue .d:nth-child(2){ animation-delay:.35s; } .cue .d:nth-child(3){ animation-delay:.7s; }
@keyframes cueDot{ 0%,55%,100%{opacity:.3} 25%{opacity:1} }
.reduced .cue .d{ animation:none; opacity:1; }
.cue-in{ animation:fadeReveal .45s ease-out both; }
.cue-out{ animation:cueOut .4s ease-out both; }
@keyframes cueOut{ to{opacity:0} }
```

Lifecycle (`placeCue()`, called once on load and from every `revealBeat`/`revealAll` completion):

- If any `.beat[hidden]` remains: move `#frontierCue` to directly after the **last non-hidden beat**;
  restart its entrance (`.cue-in` re-add via reflow), delayed ~.35s after the beat's own reveal starts
  so the section leads and the cue follows.
- If none remain (final natural reveal, or reveal-all): play `.cue-out`, then remove the element from
  the DOM on `animationend` (with a `setTimeout` fallback). It never returns.
- The cue is plain informative text: non-interactive, no `tabindex`, no `aria-live`, not inside any
  live region. It must never gate anything and never be counted by beat/rail logic (it is a `div`,
  beats are `section.beat` — verify no selector collision).
- Wording is book-wide and exact: `the page continues when you play` + three literal `.` dot spans.
  (Chosen over "interact to continue": same contract, book voice, no UI-chrome register.)

## 4. Hard rules

- Do NOT touch `mcShuffle`, its salt, or any blank/menu order. No new hues; the cue is `--gold` via
  `.note`. No arrows (a generic up-arrow pointing at nothing violates the arrow rule). No audio. No
  external resources. Keyframe names must not collide with existing ones (`fadeReveal`, `cueDot`,
  `cueOut` are new; `rise` is redefined in place). Byte budget stays ≤300KB per page.
- Edits are targeted in-place diffs; do not reflow or reformat unrelated content; preserve
  `<meta charset="utf-8">` as first line.
- Console must stay clean from hard reload through: natural full playthrough, reveal-all path,
  and instrument poking, on all three pages.

## 5. Builder self-verification (headless; report in build notes, per page)

1. Grep-level: no `!REDUCED` guard remains on `reveal-anim`; `fadeReveal`/`cueDot`/`cueOut` defined
   exactly once; cue markup present once, directly after beat 1; identical cue wording across pages.
2. Structural: reveal-all path sets and later clears staggered delays; `placeCue` runs on load and on
   every reveal path; cue removal fires when the last beat reveals naturally AND on reveal-all.
3. initHook audit table + sub-reveal classification table (per §1/§2) in build notes.
4. `wc -c` per page (budget); no new ids colliding (grep duplicate `id=` values).
5. Do not launch background jobs; run every check synchronously. Browser verification happens in the
   adversarial review pass, not yours — flag anything you could not verify headlessly, loudly.

## 6. After acceptance

Adversarial review (code + live pass, reduced and forced-full-motion via a temporary local copy
with `REDUCED=false`), ship all three pages for review, then update
`north-star-spec.md` (motion tokens + standing frontier-cue idiom), build notes, `JOURNAL.md`,
and the `unit-page` skill ("Pace is authored" bullet gains the cue + the
fades-under-reduced-motion rule).
