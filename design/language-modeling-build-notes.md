# Build notes — "The guessing game" (language-modeling.html)

*Builder pass, 2026-07-23. Deliverable pair: `book/language-modeling.html` (the page, 188.8 KB) + this file. Verify against `language-modeling-spec.md`. Honest throughout, including what I could not verify.*

---

## 0. What was built

The book's first page: **a language model is anything that plays the guessing game — it assigns probability to what comes next.** Eight gated beats, same design system as `bpe-north-star.html` (font block, palette, `:root`/dark/`data-theme` blocks, and idioms copied verbatim). A tiny real n-gram machine — computed at build time from the CS336 L01 transcript and embedded as pruned count tables — is the page's instrument and its shy protagonist. Every number the reader sees is a real corpus count or a drop count apportioned from real counts.

Palette roles as briefed: **byte-blue** = candidate words / the machine / its counts; **token-vermilion** = the true word at reveal; **invitation-gold** = the reader's belief drops, nudges, gesture hand; **green** = goal ticks only.

---

## 1. (a) Corpus build — pipeline, parameters, table sizes

### Pipeline
The corpus is built by a Node script (`emit.mjs`, run as a local build step; core logic inlined below for reproducibility). Source: the CS336 Lecture 1 transcript, via the ingestion pipeline (a separate project) — the machine "has read exactly one lecture."

**Tokenization**
```
text = raw
  .replace(/<!--[\s\S]*?-->/g, " ")     // strip  <!-- t=HH:MM:SS -->  markers
  .replace(/\[[A-Z][A-Z ]+\]/g, " ")    // strip [LAUGHTER] [CHUCKLING] stage directions
  .toLowerCase();
sentences = text.split(/[.?!]+|\n{2,}/) // sentence boundaries: . ? ! and paragraph breaks
word     = /[a-z0-9]+(?:['’\-][a-z0-9]+)*/g   // keep internal ' and -  (n-gram, fine-tune, don't, gpt-4)
```
Unigram / bigram / trigram counts are accumulated **within a sentence only** (n-grams never cross a `.?!` boundary). `’` is normalised to `'`.

**Interning:** vocabulary is sorted by descending unigram frequency and each word is assigned an integer id (common words get small ids). Tables store ids, not repeated strings — this is what keeps the JSON small.

**Pruning parameters**
| table | rule | rationale |
|---|---|---|
| unigram | keep all 1,729 words + counts | needed for id↔word map and the n=1 "word-salad" distribution (real counts) |
| bigram | **top-16** successors per context, counts kept | covers the sandbox's top-6 *and* guarantees every curated round distractor (some count-1) is in-table, so the displayed count is never a lie |
| trigram | **drop contexts with total count < 2**, then **top-6** successors, counts kept | exactly the spec §3 rule; bounds size while preserving the "drunk fluency / near-quotation" behaviour |

Generation samples ∝ counts with **trigram → bigram → unigram backoff** and a seeded RNG (`mulberry32`); a given seed replays identically, and the n-lever re-runs the same seed at n = 1/2/3.

### Resulting sizes (measured)
```
word tokens (after cleaning): 11,505      vocabulary: 1,729
bigram contexts:  1,587  (4,575 successor entries, top-16)
trigram contexts kept (total≥2): 1,231  (3,298 successor entries, top-6)
trigram-instance coverage by kept contexts: 50.2%

corpus.json:  85.5 KB   (W 16.6 · U 3.7 · B 37.2 · T 30.0 KB)
Patrick Hand @font-face (copied verbatim): 32.1 KB
PAGE TOTAL:  188.8 KB   (budget 300 KB — OK)
```

### The 6 curated rounds (verified live against the embedded pruned table)
Every candidate is a **real successor of the cue with a non-zero in-table count**; the true word is always present. Machine drops = largest-remainder apportionment of the real counts to 10.

| round | display cue | candidates : real counts | true | machine's top guess |
|---|---|---|---|---|
| models | language | model:11 models:21 rust:1 modeling:2 | **models** | models ✓ (confident, right) |
| scratch | from | the:7 scratch:10 memory:1 experience:1 | **scratch** | scratch ✓ (right, mild tension) |
| hardware | your | hardware:2 model:9 ability:1 vocab:2 | **hardware** | model ✗ (**wrong — you beat it**) |
| budget | compute | efficiency:3 budget:3 cores:1 optimal:2 | **budget** | budget ✓ (barely — a tie) |
| laws | scaling | recipe:7 laws:12 up:1 law:3 | **laws** | laws ✓ (confident) |
| tune | fine | tune:4 tuning:1 but:1 i:1 | **tune** | tune ✓ (easy, thematic) |

Beat 1 plays models/scratch/hardware (picks); beat 2 pours budget → laws → tune; beat 3 replays models/hardware/budget (machine, with the reader's stored belief as the gold row). The "hardware" round is the designed character moment: the machine confidently guesses `model` (9 counts) but the truth is `hardware` — wide-eyed surprise, "you beat it, because you know what the words mean."

---

## 2. (b) Fidelity table — every historical/definitional claim → its anchor

Anchors are transcript timestamps (`t=`) / the concept-wiki page for "language modeling" (via the ingestion pipeline). The game, the machine character ("belief", counting, the pebble), and metaphors are the book's own devices and assert nothing historical. Corpus **vocabulary** contains real lecture tokens (e.g. `gpt-2/3/4`, `chinchilla`) — these can surface in generated babble or the sandbox but are the machine quoting what it read, never an authored claim.

| # | Page sentence (authored prose) | Anchor |
|---|---|---|
| 1 | "Shannon, back in the '50s, was using language [models]" (round + beat 6 stop 1: entropy of English) | t=11:45; wiki "Shannon (1950s) used language models to measure the entropy of English" |
| 2 | "A language model assigns a probability to what comes next." / "The game is the definition: assign probability to the next token." | wiki line 17 "A language model assigns probability to (and can generate) sequences of text" |
| 3 | "it has read exactly one book: this lecture" / "every number on this page is a real count" | honesty contract; corpus = transcript; footnote 6 (t=1:12:43 region) |
| 4 | "machines like this one supplied to translation and speech systems for decades… the part that kept the output sounding like a person" (beat 4 + beat 6 stop 2) | t=11:45; wiki "N-gram models were long used as a component of MT and speech-recognition systems — not the whole system, but the part ensuring fluent output" |
| 5 | beat 6 stop 3: "In the 1990s, LSTMs let a network carry a thread of memory" | t=12:02 "in the '90s, there was LSTMs"; wiki "LSTMs (1990s)" |
| 6 | beat 6 stop 4: "Bengio built the first neural language model — a feedforward net reading a small window of words" (2003) | t=12:32 "Yoshua Bengio wrote the first neural language model… 2003… feedforward network that looked at the small context" |
| 7 | beat 6 stop 5: "Seq2Seq… compress a whole sentence into a single vector" | t=12:32 "Seq2Seq… we can actually compress a whole sentence into a vector" |
| 8 | beat 6 stop 6: "attention, and the transformer built on it — both first developed for machine translation" | t=12:32 "attention mechanism, which was developed for machine translation. The transformer architecture… also developed for machine translation" |
| 9 | beat 6 stop 7: "mixture-of-experts and model parallelism" | t=12:32 "scaling up to a mixture of experts model parallelism… developed in the 2010s" |
| 10 | beat 6 stop 8: "ELMo and BERT were pretrained on huge text, then fine-tuned for each task like question answering" | t=13:19 "ELMo and BERT… trained on lots of text, and then you could fine tune them on some downstream tasks like question answering"; footnote 2 |
| 11 | beat 7: "fine-tune → prompt → chat with → hand a long task to [agents]" | t=17:09 "used to be something that you fine-tuned… then… prompt… ChatGPT era… conversation… now… era of agents"; footnote 3 |
| 12 | beat 7: "much longer memory, and an efficiency that matters more every year" | t=18:41 "we demand greater context lengths, which means that inference efficiency matters even more" |
| 13 | beat 7: "the fundamentals barely moved — the chips and kernels, the gradient-style training, the transformer and its attention" | t=17:55 "we still built on GPUs and kernels… optimize using gradient or stochastic gradient-like approaches… still have the transformer in attention" |
| 14 | beat 7: "Guessing the next token is still the default way these models are taught." + MC answer | t=31:58 "there's next token prediction, which is the default"; footnote 5 |
| 15 | beat 7: "every abstraction leaks… the day it can't do what you need, there's no recourse… understanding comes from building" | t=03:58 "abstractions are leaky… it just can't do it and there's no recourse… full understanding… by building"; footnote 4 |
| 16 | beat 8: "its text has to become numbers it can hold… how a computer learns to read" (the door) | t=27:16/28:04 "a tokenizer converts between raw inputs, which are just bytes, and a sequence of integers"; plain-text mention of the next chapter (no link) |

**No unanchored historical/definitional claim exists in the prose.** No invented years (only the decades the source gives), names, or mechanisms. "Seventy years" = Shannon's 1950s → today, arithmetic from the source's own timeframe.

---

## 3. (c) Acceptance-gate results (§7)

Method: a headless Node harness (`verify.mjs`, **23/23 pass**) re-assembles the file, `node --check`s the embedded script, cross-checks every DOM id reference, re-derives round counts from the *embedded* corpus, tests generation, greps anti-slop/silence/fidelity, and audits arrow geometry numerically. Then a live browser pass (a headless Chromium test environment) drove every instrument via real DOM events and read back state.

1. **Honesty — PASS (headless).** All 6 rounds' candidates + drops match the embedded table (§1 table). Generation reproduces identically per seed at n=1/2/3; n=1 salad is context-independent (unigram); backoff on an unseen context still produces a word. No number on the page that isn't a real count or a drop.
2. **Fidelity — PASS.** Table §2; zero unanchored claims. `gpt-*` etc. are corpus vocabulary, not authored claims (grep of authored prose is clean).
3. **First viewport playable — PASS (visual).** Screenshotted at 1280×800 and 375×812: the cold-open round (stem + 4 candidates + gold nudge/arrow) sits entirely above the fold in both.
4. **Gating — PASS (headless + live).** From a hard reload only beat 1 is visible; each goal reveals exactly the next beat; a full natural playthrough **without** the escape valve lights the rail 8/8 and reveals all beats; "Reveal all steps" unlocks everything and every beat initialises.
5. **Anti-slop + rule-4 layout — PASS (grep + eye + numeric).** No `href="#"`; no cards/chips/kickers/stat-tiles/pill classes; no emoji (codepoint scan); palette is exactly the book's hues. Rule 4: the guessing instrument fits **inside** the 40rem column (its candidate row centres on the column axis; stem/verdict keep the column's left edge). Only the **lineage strip** breathes wide — `min(48rem, 100vw−2rem)`, self-centred on the column axis, its caption + hint returning to the column's left edge. Verified numerically at a 1000px viewport: guess-stem left = lineage-caption left = column content left (194px); the strip overhangs symmetrically (109→877px). Visual pass at 375/1000/1280 confirms ink words, hand-lettered nudges, no boxed exhibits.
6. **Interactions — PASS, with one method caveat.** Belief drops place/remove and the round loop verified live by **click + keyboard**; **pointer-drag** (mouse/touch) handlers are present and are the same `setPointerCapture` idiom as the north-star's verified pad — *not* exercised as true pointer-drags headlessly (see §5). Dragnum and the lineage scrubber: keyboard verified live; pointer handlers present. Target-pointers: scroll-then-glow verified live (the beat-4 babble line received `t5ring-out` on click; ≥1.8s fade via the same discipline as the BPE page; empty-target guarded). Arrow geometry: numeric audit — both annotation arrows' shafts end exactly **5.00 px** short of the head apex (in-range 4–5). Annotations non-wrapping: confirmed single-line at 375px.
7. **Themes + reduced-motion + silence — PASS, headless-DOM-verified.** Light and dark both render (screenshots) and every text/ground pair is **AA** except gold-on-ground in *light* = **3.35 (AA-large)** — see §5, inherited verbatim from the north-star and used only on large hand-lettered display text. Reduced-motion path: the test environment **forces `prefers-reduced-motion: reduce`**, so the reduced path was the one exercised end-to-end — it works (fades only, gap resolves, no wiggle). Silent: grep finds no audio APIs.
8. **Patrick Hand — PASS.** Renders (visible in screenshots as the gold hand-lettered nudges/verdicts); `@font-face` woff2 data-URI embedded.
9. **≤300 KB + console — PASS.** 188.8 KB. Console **clean** from hard reload through a full natural playthrough *and* through reveal-all + poking every instrument (including weird sandbox input and step-button spam).
10. **Feel check — see §4.**

### What I could NOT verify (stated plainly)
- **Full-motion visuals.** The headless test environment forces reduced-motion, so the fly-to-gap flight, the ~90 ms typewriter cadence, drop squash-stretch, and the machine's squash/gasp reactions were verified only by **code path** (each animation branch calls the same completion callback as its reduced counterpart, and the idioms mirror the accepted north-star). A human should confirm the full-motion "juice" and the machine's expression timing on a normal browser.
- **True touch / pointer-drag gestures.** Verified by handler presence + logic inspection + the identical north-star idiom, not by synthetic multi-touch. Recommend a real touch-device pass on: dragging a belief drop onto a word, dragging the n-lever, and dragging the machine along the lineage strip.

---

## 4. (d) Feel check (§7 gate 10) — answered honestly

- **Does pouring belief feel like committing?** Yes. Ten discrete gold drops leave a visible tray; each is placed deliberately (tap, drag, or arrow+Enter) and thickens a word's gold underline; the reveal only fires once all ten are spent — you stake everything *before* the truth arrives, and you can't half-commit.
- **Does the reveal feel like a small stake paying off?** Yes. The true word resolves in vermilion and the verdict is drop-denominated against your bet ("you had 4 of 10 on it — a fair bet"; "the truth blindsided you — zero belief on it"). The stake is scored, not just marked right/wrong.
- **Does the machine read as a character, not a widget?** Yes — this is the strongest part. It's a small drawn pebble with two curious eyes; it squints to "think", widens in surprise when it loses drops on the true word, softens when confident, and blinks idly. In beat 3 it visibly *loses to you* on the hardware round; in beat 6 it is the scrubber you walk along seventy years. It sits beside its belief, small and shy — never a control panel. (Caveat: its reaction *timing* is a reduced-motion approximation here; confirm the squash on a full-motion browser.)
- **Does the page read as a place?** Yes. One continuous column that grows as you play, hand-lettered nudges pointing into the instruments, the same pebble recurring, the exact type and palette of the BPE chapter. It reads as the same book, one chapter earlier.

---

## 5. (e) Deviations from the spec (each with reason)

1. **The machine has a small antenna (ink-outlined, ground-filled bulb) and two tiny feet**, beyond the spec's minimal "two curious eyes; no mouth." Reason: warmth/aliveness in the Nicky-Case creature idiom; **no gold on the machine** (palette rule honoured — the bulb is `--ground`/`--ink`, not gold). Flagged for the design lead — trivially removable if the pebble should be barer.
2. **Gold-on-ground contrast in the light theme is 3.35 (AA-large, below AA-normal 4.5).** Reason: `--gold #B97D0F` is inherited **verbatim** from `bpe-north-star.html` (spec §2 mandates copying the palette). It is used only for large hand-lettered display text (≥1.05rem, heavy casual face) and for decorative dotted underlines — never for small functional body text (which is `--ink`/`--ink2`/`--byte`, all AA). Not "fixed" because deviating from the accepted palette would break book consistency; documented instead. Dark theme gold = 9.96 (AA).
3. **Guessing rounds use the machine's BIGRAM cue (the single preceding word), not trigram.** Reason: it matches beat 3's narration literally ("every word that ever followed 'X'"), gives the richest 4-candidate spreads, and sets up the memory lever. Generation and the sandbox *do* use full trigram→bigram→unigram backoff, so the machine's real character (short memory in the game, longer memory when writing) is consistent and honest.
4. **A beat-1 "pick" is stored as 10 belief on the chosen word** so beat 3's "your gold vs its blue" comparison is present for the picked rounds (beat 1 has no drop mechanic of its own). Reason: it's the honest reading of a pick ("you threw all your weight behind one word", per beat 2's own opening) and makes the you-vs-it contrast land.
5. **Round fragments are lightly cleaned real substrings** (spec §3 sanctions "lightly cleaned"), e.g. "how you want to squeeze…" shown as "You want to squeeze…". The cue→true adjacency is a genuine transcript bigram in every case (verified count>0); only the lead-in wording is trimmed for a standalone read.
6. **Beat 8 does not re-embed a second copy of the generator / n-lever.** The spec lists them as "remaining usable" in the sandbox; because beats stay in the DOM once revealed, the beat-4 generator and beat-5 lever are still on the page and live-linked above the sandbox. Beat 8's own new instrument is the typed-context probe (live top-6 guesses with real counts + visible backoff shrug). Reason: avoids duplicated UI/bloat while satisfying "remain usable, everything stays live-linked."

---

## 6. Build reproduction

Temporary local scripts (not part of the shipped repo): `build-corpus.mjs` (census), `find-rounds.mjs` / `inspect-cues.mjs` (round curation), `emit.mjs` (tokenise → prune → `corpus.json` + round/generation self-tests), `assemble.mjs` (inject the north-star font block into `/*__FONTFACE__*/` and `corpus.json` into `__CORPUS__`, compose `<meta>`+`<style>`+body+`<script>`), `verify.mjs` (the 23-check harness), `serve.mjs` (static server for the browser pass). The deliverable is a single self-contained fragment: `<meta charset="utf-8">` first, one `<style>`, the content, one `<script>` — no doctype/html/head/body wrapper, zero external resources.

## 7. Open risks for adversarial review
- Full-motion feel + touch gestures are code-path-verified only (§3 "could not verify") — needs a human browser/touch pass.
- The antenna/feet embellishment (§5.1) is a judgement call on how minimal the protagonist should be.
- The `tune` round's distractors (`tuning/but/i`) are function-ish — it's the easiest round and only used as beat-2's optional third pour; the cue "fine" simply has no richer real successors.

---

## 8. Design-lead review round (2026-07-23) — 10 defects found, all fixed in place

Independent verification first: a from-scratch corpus rebuild (own script, notes §1 rules only) matched the embedded tables exactly — 11,505 tokens, 1,729 vocab, every unigram/bigram/trigram count, all 24 round-candidate counts. Design DNA checked by md5: font block and `:root` palette byte-identical to `bpe-north-star.html`. Full read of the page + live playthrough (natural progression AND reveal-all paths, light+dark, 375px, console clean).

**Fixed (static review):**
1. Beat 1 lead claimed the first stem was "the real opening" of the lecture — the Shannon stem is from ~11:45. Now "a real sentence from a Stanford lecture."
2. **Memory lever off-by-one (honesty):** "looks back at just 3 words" but order-3 means 2 words of context — the sandbox itself said "both words = full memory." Lever re-denominated to lookback 0/1/2 (display, aria, NOTES, after-text; engine called as `gen(…, cur+1, …)`). The spec's own §4 wording seeded this — spec-side lesson recorded below.
3. `#eras7` was `aria-hidden` with no text alternative — the sentence broke for screen readers. Added a `.sronly` span carrying the era chain inline.
4. Source 6 pinned the corpus statement to `1:12:43`, a timestamp that doesn't support a claim about the page's own build. Label now "this page."
5. The Shannon stop claimed "models exactly like this one" + "next letters" — beyond source. Now exactly the source's claim.
**Fixed (live pass):**
6. Beats 2/3 never completed their stem — the gap stayed dashed after reveal (beat 1 set the pattern). Both now fill the gap with the true word on reveal.
7. `.shownum` had no CSS rule, so zero-drop candidates hid their real count (the round-3 shared-class-consumer trap, again). Rule added.
8–9. **Dragnum and lineage scrubber were dead to click-then-arrow-keys** — `pointerdown` `preventDefault()` suppresses native focus; the exact BPE round-1 click-to-focus defect, re-introduced by porting the idiom without its fix. `focus()` added to both handlers; verified by real click + real arrow key.
10. (Verified non-defect:) beat-3 "hardware" round apportions [1,7,1,1] not [2,6,1,1] — exact remainders for hardware/model are both 3/7, a true tie; float jitter breaks it toward the higher-count word. Valid largest-remainder result, display self-consistent; documented here so nobody "fixes" it into a discrepancy later.

**Spec lessons recorded for the design system:** (a) any displayed quantity must be denominated in what the reader can observe the mechanic doing (the lever now counts *words looked back at*, not n-gram order); (b) porting an interaction idiom means porting its fix history — click-to-focus travels with every `preventDefault` pointerdown handler; (c) every stem completes: a revealed round fills its gap.

**Still for the author (not defects):** full-motion feel + true touch drags (the test environment forces reduced-motion; code paths verified); the machine's antenna/feet embellishment (taste call); gold-on-ground AA-large in light theme (inherited from the accepted north star).

Shipped for review (label round-1-reviewed), page 189.4 KB.

---

## 9. Author review round 1 (2026-07-23) — three findings, all fixed (label round-2-author-fixes)

1. **Beat-1 "pick what comes next" arrow pointed at empty space.** The hint sat at the column's left edge while the candidate row centres — the arrow rose into the row's empty left region (the BPE round-4 arrow lesson recurring in a new form). Fix: the hint unit centres under the row (`text-align:center` on its wrapper); tip verified landing ON a candidate word, 9 px below the row.
2. **Beat-3 machine's surprised eyes never reset.** `mExpr` replaces the class outright; after a lost round nothing restored `idle`, so the enlarged eyes became a permanent state (and the idle-blink loop only targets `.mch.idle`, so it never recovered). Fix: a 1.2 s expression timer back to idle after every reveal, cleared on next-round load. Verified on both win (settle→idle) and lose (surprised→idle) paths. **Rule admitted: a reaction is a moment, not a state — every non-idle expression needs a path back to idle.**
3. **Sandbox weight bars misaligned right under long words ("translation").** Root cause: `.probe` lacked the `.cands` row treatment, so candidate buttons (block-level flex) stacked as a ragged left-aligned column; each word's 3.2 em bar centres under its own word, so long words pushed their bar right relative to the column. Fix: probe is now a wrapping flex row (`gap .55/.7 rem, align-items:flex-end`) — same grammar as beats 1–3; bars verified dead-centred (Δ=0 px) under both "translation" and "learning".

Re-verified after fixes: console clean, honesty audit still green (tables untouched), page 189.6 KB. Shipped for review, label `round-2-author-fixes`.

---

## 10. Author review round 2 (2026-07-23) — the audience declared (label round-3-plain-words)

Author: no CS background; short forms like LSTM/ELMo/BERT are "UNK to me". Fixed every term of art in reader prose (lineage captions expanded/translated/categorized; "MoE" tick → "experts"; "feedforward net" → "a simple network"; "a vector" → "one short list of numbers"; "kernels" glossed; attention/transformer get a later-chapter promise). Same logic caught next-chapter vocabulary used early: "token" → "what comes next" throughout (tokens are the BPE chapter's story). Sources block intentionally keeps the lecture's terms (provenance). BPE page's GPT-2 anchored ("an early ancestor of today's chatbots") and republished. Rule now lives in the `unit-page` skill as a standing project rule. Verification now runs over a local HTTP server — file-tab reloads serve stale snapshots.

---

## Round: reveal fade + frontier cue (2026-07-23) — cross-page builder pass

Reveals were `rise .34s translateY(9px)` — imperceptible — and skipped entirely under `prefers-reduced-motion` (`if(!REDUCED)`), so reduced-motion readers (the author's environment) got an instant pop instead of the book's fades-only path. Implemented identically to the sibling pages per `reveal-motion-cue-spec.md`.

**What changed (current line anchors):**
- Reveal motion CSS (77–80): `rise` → `.9s cubic-bezier(.22,.6,.2,1)` / `translateY(14px)`; the old `.reduced .reveal-anim{ animation:none }` replaced by `.reduced .reveal-anim{ animation:fadeReveal .45s ease-out both }` + `@keyframes fadeReveal{ from{opacity:0} }`.
- Shared sub-reveal utility (81–82): `.fade-in{ animation:fadeReveal .4s ease-out both }` + `.reduced .fade-in{ animation-duration:.32s }`.
- Frontier-cue CSS (83–92): `.cuewrap`, `.cue .d`, `@keyframes cueDot`, `.reduced .cue .d`, `.cue-in`, `.cue-out`, `@keyframes cueOut`.
- Frontier-cue markup (387): one `<div class="cuewrap" id="frontierCue">…the page continues when you play…</div>` directly after beat 1's `</section>`.
- `revealBeat`/`revealAll`/`placeCue` (~630–671): dropped the `!REDUCED` guard (add is now unconditional at 631; `.reduced` swaps to the opacity fade); `revealAll` staggers newly-revealed beats `animationDelay = min(i*90, 540)ms` (0 for all under REDUCED) and clears each on `animationend`; new `placeCue()` on load + after every natural `revealBeat` + once after `revealAll`.
- Sub-reveal fades: `g1after`…`g6after` and the beat-3 round legend.

**initHook audit** (does any hook read geometry across the animated section's transform boundary at init?):

| Hook (beat) | init-time geometry | verdict |
|---|---|---|
| 2 (pour belief) | `candUnder` getBoundingClientRect at pointerup (event-time); `flyWord` event-time + REDUCED-guarded | safe |
| 3 (machine plays) | none | safe |
| 4 (machine writes) | none (words type in via `.in`) | safe |
| 5 (memory lever) | drag via clientX deltas, no rects | safe |
| 6 (lineage strip) | init `place(0,false)` positions via `style.left=%` (layout-relative, transform-immune); `fromClientX` + target `scrollIntoView` at event-time | safe |
| 7 (eras + MC) | eras opacity-fade (already-animated); `wireMC` wires listeners | safe |
| 8 (sandbox) | none | safe |

No hook positions against the viewport / an outside element at init → no `animationend` re-positioning added.

**Sub-reveal classification** (every `hidden=false` site):

| Site | Class | Why |
|---|---|---|
| g1after … g6after | **fade-in** | per-beat follow-up blocks |
| g3 legend | **fade-in** | round legend/caption (not aria-live), shown once |
| g2/g3 verdicts | latency-critical (instant) | `aria-live` status text |
| reroll, "play the next" step | latency-critical (instant) | control / input surfaces |
| beat-1 correction aside | latency-critical (instant) | feedback to a wrong pick |
| beat-7 MC menu + correction | latency-critical (instant) | dropdown + wrong-answer feedback |
| #eras7 | already-animated | opacity stagger |
| generated words (`.w.in`) | already-animated | typing entrance |

**Self-verification (headless, spec §5):**
1. Grep: no `!REDUCED` guard on `reveal-anim` (add unconditional, 631); `fadeReveal`/`cueDot`/`cueOut` each defined exactly once (80/86/90); cue markup once, directly after beat 1 (387); wording byte-identical to sibling pages. PASS.
2. Structural: `revealAll` sets and clears staggered delays; `placeCue` on load + every reveal path; cue retires (`cue-out`→remove, `_out` guard + 700ms fallback) on the `anyHidden=false` branch, hit by both the final natural reveal (beat 8) and reveal-all. PASS.
3. Tables above. PASS.
4. `wc -c` = **198,095 B** (≈193 KB ≤ 300 KB). Duplicate-id sweep (node): 0 dups; `id="frontierCue"` appears once. PASS.
5. Bonus: extracted the page `<script>` and compiled with `vm.Script` (node v22) — parses clean.

**Not verified headlessly — flagged for the adversarial review + live pass:**
- Motion *feel*: `.9s` rise felt-ness, `.35s` cue lead + cue-out cadence, and reduced-motion fading (no pop). No browser use this pass.
- Before-byte-size not captured (a local tooling issue prevented the initial measurement). After-size exact; budget passes with wide margin (net add ≈ +2.9 KB).
- Borderline fade: the beat-3 `legend` — classified fade-in per the spec's "caption blocks"; revert to instant if it reads laggy live.

## Author round 5 (2026-07-24, direct fix) — honest verdict + cue fixes · label `round-5-honest-verdict-cue`

Author findings on the motion round: (1) beat-3 verdict said "you beat it" when the reader's own pour had LESS on the true word than the machine (win checked only the machine's argmax — the reader's numbers were never consulted); (2) the open beat-7 MC menu rendered UNDER the frontier cue; (3) cue indistinguishable from gold instrument annotations. Fixes: verdict rewritten as a two-sided comparison (lead = machine argmax right/wrong with its drops; tail = reader-vs-machine belief on the true word: beat / beaten / draw / nobody-saw-it, or machine-only when no pour exists for the round); document-level `animationend` cleanup removes `reveal-anim`/`fade-in`/`cue-in` when `rise`/`fadeReveal` end (retained `both` fill made every revealed beat a stacking context, trapping `.menu` z-index:20 below the later-DOM transformed cue — A/B-proven live by re-applying an inline animation); cue re-registered as a whisper (1.05rem, `--ink2` words, gold dots only, 3.4rem top margin). Verified live over a local server: menu now paints over the cue, 0 lingering animation classes after reveal-all settles, auto-round verdict text honest, console clean.

## Author round 6 (2026-07-24, direct fix) — one slot, one denomination · label `round-6-drops-denomination`

The author caught the tile number contradicting the verdict ("Number: 21, description: 6 of its 10"). Root cause: beat 2 taught the number-under-a-tile as DROPS (the reader watches their pour write it); beats 3/8 reused the slot for transcript COUNTS while bars stayed in drops. Fix: `setNum(drops[i]||"")` in beats 3 and 8 (numbers now equal the bars; blank at zero, beat-2 precedent); counts relocated into the verdict sentence with their denomination ("the lecture followed with X N times, so D of its 10 drops sat there"); tile aria-labels carry both quantities. Also: "play the next round" now hides after the final round (`idx >= order.length-1`) — a control that can do nothing is not shown. Live-verified: numbers≡bars across all rounds, three verdict variants correct, button lifecycle right, sandbox aligned, console clean. Two catalog rules recorded (slot-denomination corollary; live-action rule).

## Round 6b (2026-07-24, direct fix) — provenance anchor · label `round-6b-provenance-anchor`

The author asked where beat-3's gold bars come from (rounds 1–2 = beat-1 picks stored as all-10 on the picked word; round 3 = the beat-2 "budget" pour; round ids disjoint, no overwrites) and requested the page say so. Added `#g3prov` under the beat-3 legend: one-time hand-lettered gold note "your drops — from when this line came up earlier", revealed with `.fade-in` the first time remembered gold actually renders; never shown on the reveal-all/no-pick path (gold-presence gated, `rbp[w]>0` over the round's candidates). Live-verified both paths + console clean.

---

## Round 7 — the seam view (builder pass) · 2026-07-24

Makes "where the gibberish starts" real and computable: the generated line is segmented into **maximal verbatim-lecture runs**; runs of length ≥2 wear a quiet byte-blue underline; **seams** break the underline; a gold cliff-mark hangs at the first seam (beat 4 only). Full design in `language-modeling-spec.md` §9. All work is fenced to **beats 4 + 5 + the two genline aria-labels** (§9.5 gate 7). `gen()`, `mulberry32`, `sample`, the seed chain, goals/gating, rounds, sandbox and the timeline are byte-untouched.

### (a) How the stream was encoded (`DATA.S`)

The full cleaned word stream is embedded so runs are checked against the *actual lecture* and the page re-derives every shipped table. Same tokenisation as §1 (build-notes §1 rules, unchanged): strip `<!-- t=… -->` and `[STAGE DIRECTION]`, lowercase, split sentences on `[.?!]+|\n{2,}`, `WORD=/[a-z0-9]+(?:['’\-][a-z0-9]+)*/g`, normalise `’→'`. Each word id (index into the existing `W`) is written as **2 chars** over the 64-alphabet `A-Z a-z 0-9 - _` (`id = 64*c0 + c1`); sentences are joined by `"."` (not in the alphabet, so `split(".")` is unambiguous — every part is even-length). Result: **838 sentences / 11,505 tokens → 23,847 chars (23.29 KB)**, injected as a **quoted** `"S"` key on `DATA` (the shipped object is JSON — an unquoted key would have broken `JSON.parse` in seam-sim and the verifiers, though the browser would not care).

Encode core (`emit-S.mjs`, a temporary local script):
```js
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"; // 64
const S = stream.map(sent => sent.map(id => ALPHA[(id/64)|0] + ALPHA[id%64]).join("")).join(".");
```
The page decodes once at init into `SENT` (per-sentence id arrays) + `POS` (word-id → `[[sentIdx,offset],…]`), then segments greedily:
```js
function longestPrefix(ids, start){                 // longest run of ids[start..] inside ONE sentence
  var cands = POS[ids[start]]; if(!cands||!cands.length) return 1; var L=1;
  while(start+L < ids.length){ var next=ids[start+L], kept=[];
    for(var j=0;j<cands.length;j++){ var si=cands[j][0], oi=cands[j][1], s=SENT[si];
      if(oi+L < s.length && s[oi+L]===next) kept.push(cands[j]); }
    if(!kept.length) break; cands=kept; L++; } return L;
}
function segmentIds(ids){ var runs=[], i=0; while(i<ids.length){ var L=longestPrefix(ids,i); runs.push([i,i+L]); i+=L; } return runs; }
```
Greedy is provably minimal in pieces (any substring of a within-sentence span is itself a within-sentence span) — **not** replaced with DP, per §9.1. `buildRuns()` renders each word as its own span; **inner** spaces are text nodes *inside* the run wrapper (covered by the wrapper's `text-decoration` underline) while **seam** spaces are text nodes *outside* every wrapper (bare → the underline breaks). This restructure (§9.3's leading-space gotcha) keeps the rendered character stream byte-identical to the old plain join → zero metric/wrapping change. The underline is `text-decoration` (`text-underline-offset:.22em`, `color-mix(--byte 55%, transparent)`, 2px) — paint only, never border/padding/margin. The cliff-mark is an `aria-hidden` inline SVG absolutely-positioned inside the first word after the first seam.

### (b) Verification (headless Node; scripts run as temporary local scripts — I did **not** use a browser)

Encode/inject: `build-stream.mjs`, `emit-S.mjs`, `inject-S.mjs` (surgical: inserts `,"S":"…"` before `DATA`'s closing brace on line 570, re-parses + re-decodes to confirm). Gates: `verify-honesty.mjs` (gate 1), `verify-seg.mjs` (gates 1+2, **extracts the page's own decode+segment source and runs it**), `verify-text.mjs` (text identity), `verify-struct.mjs` (syntax via `vm.Script`, determinism, anti-slop, size), `diagnose-sort.mjs`/`diagnose2.mjs` (the tie-order investigation, below). Segmentation cross-check core:
```js
// extract the page's ACTUAL decode+segment block and run it; compare to an independent seam-sim reference
const block = html.slice(html.indexOf("var SENT = [], POS = {};"), html.indexOf(endMark)+endMark.length);
const { segmentIds } = new Function(`const DATA=arguments[0];const W=DATA.W,ID={};W.forEach((w,i)=>ID[w]=i);${block}return {segmentIds};`)(DATA);
// for chain[0..4] × 3 seeds × memory 3/2/1: assert segPage(gen(...)) === segRef(gen(...))
```

### (c) Gate-by-gate results (§9.5)

| # | Gate (§9.5) | Result | Evidence / how verified |
|---|---|---|---|
| 1 | Stream: decode → 838 sent / 11,505 tok; re-derived U/B/T **deep-equal** shipped | **PASS on counts + selection; DEVIATION on exact array order — see §(d)** | decode gives 838/11,505 exactly; **U:** all 1,729 counts deep-equal; **B/T:** every shipped `(succ,count)` pair matches the count re-derived from `DATA.S`, and every pruned list is a valid top-k (min included count ≥ max excluded) over all 1,587 B and 1,231 T contexts, total≥2 confirmed for T. Exact successor tie-*order* is an unstable-sort artifact of the vanished `emit.mjs` and is **not** headlessly reproducible (loud flag §d). |
| 2 | Segmentation: page runs === seam-sim for ≥5 chain rolls/seed; first click "language models" = 3,2,3,2,5,3 | **PASS** | Page's *extracted* `segmentIds` === independent seam-sim reference over **15 rolls** (5/seed, exact run boundaries). First-click lens = **3,2,3,2,5,3**. Beat-5 view 6 → 9 → 15 runs at memory 2/1/0 (matches §9.1). |
| 3 | Rendering: no layout shift · continuous underline incl. inner spaces · clean seam breaks · no length-1 underlines · no orphan stubs at 375px wrap · both themes · reduced-motion fades | **PASS (structural) + NEEDS LIVE (composited pixels)** | *No layout shift:* run-wrapped DOM emits a **byte-identical character stream** to the old join across 45 cases (`verify-text.mjs`); underline/mark use paint-only props. *Inner spaces underlined / seams bare / no length-1 underline:* guaranteed by construction (inner spaces inside wrapper, seam spaces outside, `.ul` only on len≥2). *Wrap stubs @375px, both themes, reduced-motion visual:* **needs live review** — cannot composite headlessly and live composited review belongs to the reviewer. Seam spaces are *structurally* bare (the exact gotcha §9.3 called out is closed); `text-decoration` follows wraps without a background-stub; theme colours use existing `--byte`/`--gold` light+dark tokens (`color-mix` auto-adapts). |
| 4 | Beat-5 drag: segmentation live per lever value · no jank · **no cliff mark** · notes swap | **PASS (logic) + NEEDS LIVE (jank feel)** | `render()`→`buildRuns(…,true)` re-segments every `setN`; 6/9/15 runs confirmed; cliff mark is placed only in beat-4 `paintSeams` (never in `render`); `NOTES[cur]` swaps (NOTES[2] copy updated). Drag *smoothness* needs a live/touch pass. |
| 5 | A11y: labels per §9.4 · caption aria-live · mark aria-hidden · **zero new interactive elements** · keyboard/focus unchanged | **PASS** | Both aria-labels updated (grep-confirmed); `#g4note`/`#g5note` keep `aria-live="polite"` (attribute untouched); `cliffSVG()` carries `aria-hidden="true"`; new nodes are only non-interactive `<span>`/text/`aria-hidden` SVG — no tabindex/role/click added; no focus/keyboard handler touched. |
| 6 | Size ≤260KB · console clean · charset line 1 · no external resources · anti-slop grep | **PASS (static) + NEEDS LIVE (runtime console)** | **225.7 KB** (≤260 target, ≤300 cap). Charset is line 1; exactly one `<style>`/`<script>`; zero external `http(s)` href/src, zero `url(http…)`, zero `href="#"`, zero audio APIs, zero emoji; `<script>` compiles clean (`vm.Script`); 0 duplicate ids. Runtime console under live interaction **needs live review** — but every new path is guarded (`POS` non-empty for all ids since vocab = stream; `buildRuns`/`paintSeams` null-guarded; reroll-spam covered by a write-sequence token). |
| 7 | No changes outside beats 4/5 + the two aria-labels | **PASS** | `git diff --no-index` of pre-edit vs edited: every hunk is the seam/cliff CSS, the `DATA.S` line, the decode+segment block, `buildRuns`/`cliffSVG`, the additive `animationend` branches (seamIn/markIn only), beat-4 `write`/`done`/`paintSeams`, beat-5 `render`, `NOTES[2]`, `g4after`, beat-5 after-text, and the two aria-labels. **Determinism:** `gen`/`mulberry32`/`sample`/`biList`/`triList`/`uniTop`/`apportion` are byte-identical pre vs post, and `gen()` outputs are identical for the chain seeds. |

**New page size:** 195.6 KB → **225.7 KB** (Δ **+30.1 KB**: `DATA.S` 23.3 KB + seam CSS ≈ 1.3 KB + decode/segment/render JS ≈ 5.5 KB).

### (d) Deviation — flagged LOUDLY

**Gate 1 exact array-order deep-equal is NOT headlessly reproducible; I verified the stronger honesty properties instead (counts + valid selection) and could not assert byte-exact successor ordering.** Root cause: the shipped `B`/`T` successor lists are ordered by the vanished `emit.mjs`'s pruning sort, and that sort was **unstable**. Proof (`diagnose2.mjs`): within a single context (ctx 0 "the") the equal-count tie groups run in *conflicting* directions relative to every candidate key — the count-8 tie `first,same,transformer` is ascending by insertion position while the count-11 tie `data,number` and the count-7 tie `compression,right` are descending; no stable sort by count-then-{insertion | id | unigram | global-first-occurrence} can produce both (best single rule reproduced only 1117/1587 B and 596/1231 T). Conflicting per-key tie directions inside one array is the signature of V8 QuickSort's unstable partitioning on a >10-element array (old Node). Because `emit.mjs` was an ephemeral local script (not part of the shipped repo), its exact environment/tie-order cannot be reconstructed. **This is immaterial to the page:** (i) generation samples **∝ counts** (`sample()` sums the whole list, order-independent), so babble/segmentation determinism is unaffected — gate 2 passes exactly; (ii) the tables are shipped untouched, so the sandbox's top-6 display order is unchanged from every prior round; (iii) `DATA.S` is proven to encode the *same corpus* that produced the tables — every shipped count is a real count from the stream and every pruned list is a genuine top-k. What a reviewer should know: the honesty contract (every number is real) holds with a full-context proof; only the arbitrary tie-order of equal-count successors is un-re-derivable, and it changes nothing the reader sees or the machine does.

**Needs live review (cannot verify headlessly; live review belongs to the reviewer):** (1) no orphan underline stub where a run wraps at 375px — seam spaces are structurally bare so the specific gotcha is closed, but composited wrap pixels are unverified; (2) both themes' underline/mark contrast (light + dark); (3) reduced-motion *feel* (underline colour-fade, cliff fade-not-pop) and full-motion timing (≈60 ms per-run stagger, cliff pop ≤320 ms, then caption); (4) cliff-mark placement hanging in the seam gap and its wrap fallback; (5) beat-5 drag smoothness; (6) runtime console cleanliness through reroll-spam + lever-drag. Logic/structure for all six is verified above; only composited rendering/feel remains.

### (e) Adversarial review — round 7 (2026-07-24)

**Independent re-verification (own scripts, not the builder's):** `verify-r7.mjs` (a temporary local script; algorithm identical to the committed `seam-sim.mjs`) decoded `DATA.S` with a spec-written decoder and rebuilt the stream from the raw transcript: **exact id-for-id match, all 838 sentences / 11,505 tokens**. Full-table honesty audit against true rebuilt counts: U all 1,729 exact; B 1,587 contexts — 0 bad counts, 0 invalid top-16, 0 missing contexts; T 1,231 contexts — 0 bad counts, 0 invalid top-6, 0 total-rule violations, 0 missing contexts. **The builder's gate-1 deviation is ACCEPTED**: with counts + valid-top-k + zero missing contexts proven, the unreproducible equal-count tie-order is cosmetic (sampling is count-weighted; tables ship untouched). Determinism: first-click roll and lens `3,2,3,2,5,3` reproduced; memory 2/1/0 → 6/9/15 runs.

**Live review (local server, natural playthrough from hard reload — no escape valve — then reveal-all):** all header gates pass. Beat 4: first roll + mark + caption exact vs simulation (K=3, M=5); reroll exact (chain[1], M=4); reroll-spam race test (second click timed into the mark/caption window) leaves a single mark and a caption consistent with the final roll — the `writeSeq` guard works. Beat 5: keyboard lever (click→Arrow) re-segments live; NOTES swap; memory-0 dust with the seed pair honestly underlined. Beat 6 menu paints OVER the frontier cue (animationend cleanup holding); mcShuffle deals correct-not-first. Rail 8/8, frontier cue retired, console **empty** through natural playthrough + reveal-all + reroll spam + lever drag, light AND dark. 375px: font-bump diagnostic inspection of wrapped runs — **no orphan underline stubs** (trailing wrap spaces collapse unpainted; continuations start flush at glyphs); a wrap-coincident seam puts the mark at the new line's start per spec. Dark theme: underline/mark/caption legible-not-loud. Reduced motion: code-path verified (instant type → 80ms paint → `markFade`); the test environment cannot emulate the OS toggle — the author's own Windows toggle is the live check if wanted.

**One defect found and fixed in place (a 3-line edit): linked-representations violation.** Beat 5 rendered `lastGen` only at its own reveal and on lever moves — after a beat-4 REROLL it kept showing the old roll while the intro promises "watch the same roll fall apart." Pre-existing latency (predates round 7), but the underlines made the two lines comparable word-for-word, turning invisible staleness into a visible lie. Fix: module-level `g5refresh` hook — beat 5 registers its renderer; beat-4 `done()` calls it after every finished roll. Verified live: post-reroll, beat 5 shows the rerolled line at the current lever value. (Known residual, pre-existing: under reveal-all with no roll yet, beat 5 shows the default seed-7 roll — the seeds row in beat 4 is the invitation; first roll syncs both lines.)

**Final size: 231,455 bytes (226.0 KB)** — ≤260 target holds. Verdict: round 7 PASSES review with the liveness fix applied. New catalog rule recorded in the skill: adding a new representation of shared state re-opens the linked-liveness audit for every other view of that state.
### (f) Round 8 — the fall (author rejection of round 7's rendering; direct fix, 2026-07-24)

Author: the cliff mark read as "a crack… a visual glitch" and "the underlines increased my confusion." Root cause (recorded as catalog rules): an abstract unlabeled mark reads as a page defect, and the underline channel decorated what was FINE (real stretches) to imply what was broken (the stitched tail) — the reader had to learn a grammar and invert it; sim-validating the DATA had not validated the VISUAL.

Change (spec §10): underline/mark/stagger apparatus removed entirely (CSS block, `seamIn/markIn/markFade` keyframes + animationend branches, `pretype`, `cliffSVG`, run `ul` classes); replaced by **the fall** — per-fragment cumulative `translateY` stairs (`FALL=[0,6,9,11,12,13]`px, words `inline-block`, paint-only), words landing at depth as they type; `paintSeams` → `caption` (writeSeq guard kept); new caption/g4after/aria copy. Beat 5 unchanged except inherited depths (falls sooner/steeper at lower memory). DATA layer, segmentation, `g5refresh` liveness hook: untouched (hashes verified identical).

Verified: r8-check.mjs (compiles; single style/script; charset; FALL present; zero leftovers) + verify-r7.mjs re-run (stream/tables/determinism all exact) + live JS-driven pass on a local server (depths, captions K/M for chain[0]/chain[2], reroll-race single-caption, lever silhouettes 5→7→11 fragments with cap, g5 linkage, console empty). No live compositor this session → no screenshots; geometry numeric (24px caption clearance; 13px max vs 31px line boxes). Size 229,041 B → 223.7 KB. Label `round-8-the-fall`.

### (g) Round 9 — the fade (author: "use lower opacity for the words falling off the cliff"; direct fix, 2026-07-24)

Wrapper-opacity per fragment (`FADE=[1,.85,.76,.7,.65,.62]`) beside the depth stairs; applied on `.run` so the word-level typing fade is untouched. First curve (floor .55) FAILED the measured AA check — 3.75:1 in light theme — and was corrected to floor .62 (4.66:1 light / 6.53:1 dark, computed against live colors in-page). Verified on a local server: fade+depth pairing per fragment on both lines, memory-0 pins to the floor (ghost-dust), captions intact, console clean. No live compositor this session — geometry/contrast numeric; the author's eye is the aesthetic gate. 229,420 B (224.0 KB). Label `round-9-fall-fade`.


### (h) Round 10 — the tilt (author: gentle rotation on the fallen scraps; direct fix, 2026-07-24)

Per-fragment rotation beside depth+fade: `TILT=[0,.9,-1,1.1,-1.2,1.3]`deg, sign alternates so adjacent scraps disagree; head fragment stays level. Within a scrap the baseline drifts along the tilt line (`drift=tan(t)*ADV`, ADV=62px avg advance) so it reads as a pasted strip, not jittered glyphs; drift caps at 3 word-steps so it stays readable and never re-crosses the level line. All transforms stay per-word inline → wrapping and x-metrics unaffected; rotation is static (no animation, reduced-motion safe). Verified live on a local server: angles ≤1.3°, deepest rendered word→caption clearance 21px (rotated bounding rects, no collision), g4 horizontal overflow 0, beat-5 inherits (head level, scraps tilted), console clean. No live compositor this session → geometry numeric, the author's eye is the aesthetic gate. `FALL`/`FADE`/`TILT` are the three tuning knobs. 224.8 KB. Label `round-10-fall-tilt`.
