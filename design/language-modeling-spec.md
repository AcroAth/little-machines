# Unit spec — "The guessing game" (language-modeling lesson)

*2026-07-23. Art direction + content architecture for the book's opening unit (ch 1, unit 1 — sequenced BEFORE the BPE page). Operationalizes `reference-analysis.md`; inherits the design system established by `bpe-north-star.html` and every rule earned in its six review rounds. Quality is the only success criterion: "could this sit inside Mathigon without embarrassment; would Nicky Case recognize the spirit."*

**Source of truth for content:** the wiki concept page for "language modeling" and its cited transcript, both produced by the ingestion pipeline (a separate project) from the CS336 Lecture 1 source video. **Fidelity boundary:** every historical/definitional claim in the page must be traceable to the wiki page or transcript — no invented years, names, numbers, or mechanisms (the codegen prototype failed exactly here). The game, the machine character, and all visual metaphors are the book's own devices and carry no factual claims. Shannon: say only what the source says (he used language models to measure the entropy of English) — do NOT describe his experimental method.

---

## 1. Concept

The book's first page. One idea, played before it is named: **a language model is anything that plays the guessing game — it assigns probability to what comes next.** The reader plays the game, then meets a real (tiny, honest) machine that plays it, then watches the same game get better guessers for seventy years, and finally learns why this book builds one from scratch.

Working title on the page: **The guessing game** — eyebrow: *Language, from scratch · chapter one*. Meta line: `~12 min` + `Reveal all steps` only (no other labels — process talk never ships to readers).

## 2. Design-system inheritance (mandatory, verbatim)

This is the second page of an existing book. Its identity is already designed:

- **Copy from `book/bpe-north-star.html` verbatim:** the `@font-face` Patrick Hand data-URI block; the full `:root` custom-property set with dark theme (`@media (prefers-color-scheme: dark)`) AND `:root[data-theme="light"]`/`[data-theme="dark"]` overrides; the `.mono`, `.hand`, `.note`, `.arrow`, `.eyebrow`, `.meta`, `.reveal-all`, `sup.fn`, `.slot`/menu (inline blank), `.underline-input`, progress-rail, and focus-visible idioms. Same body stack (system-ui, 18px/1.65, 40rem column), same h1 scale.
- **Palette roles, re-aimed at this page's thesis** ("belief poured into possibility"): **byte blue** = the mechanical/possible — candidate words, the machine, its counts. **Token vermilion** = the resolved/meaningful — the true next word at reveal, learned certainty. **Invitation gold** = the reader's touch only — belief drops, nudges, gesture hand. Green = goal ticks only. No other hues.
- **Rules earned in BPE rounds 1–6 (all apply):**
  1. No intra-page hash links, ever. Footnote superscripts are plain non-interactive flags; one quiet Sources block ends the page.
  2. Drawn arrows: shaft stops 4–5px short of the head's apex, approaches along the barbs' bisector, ≥2px centerline clearance from both barbs. Verify programmatically (`getPointAtLength` sampling).
  3. Annotations with arrows are non-wrapping anchored units that point correctly at every width 375–1440.
  4. Wide interactive elements: only the instrument itself may exceed the column (up to ~52rem, `min()`-clamped, self-centered); its content centers on the column axis; captions/status lines return to the column's left edge.
  5. Linked representations stay live — if two views show the same state, changing one updates the other, always.
  6. Feedback lands where the reader is looking: any action whose effect is off-screen scrolls first, then glows (≥1.8s, after scroll settles); shared-class styling must be checked across every consumer.
  7. Every gesture gets an affordance or a one-time hand-lettered hint (first use only). Nothing is undiscoverable; nothing nags.
  8. No dashboard grammar: zero cards, borders-around-prose, stat tiles, pill chips, numbered kickers, default-styled controls, emoji in UI.
  9. Silent. No audio APIs. Motion is the warmth channel (squash-stretch, staggered settles, drawn ticks). Full `prefers-reduced-motion` path (fades only; static gold underline replaces wiggle/hand).
  10. Reader-facing surfaces carry zero project-internal labels.

## 3. The machine (this page's instrument + character)

A tiny real n-gram model **computed at build time from the actual lecture transcript** (`cs336-l01/transcript.md`) and embedded as pruned count tables. This is the page's honesty contract: every probability shown is a real count from a real corpus the reader is told about — "it has read exactly one lecture: the Stanford lecture this chapter is drawn from."

- Build (a Node script, kept in build notes): tokenize transcript to lowercase word stream (strip timestamps/HTML comments/speaker cruft, keep `'`-words; punctuation `.` `,` `?` as boundary handling of builder's choice, documented); build unigram, bigram, trigram count tables; prune (drop trigram contexts with total count < 2; keep top 6 successors per context, keep counts); emit compact JSON into the page. **Page total ≤ 300KB.** If over budget, prune harder (min counts up, top-4 successors) — never fake numbers.
- Generation: sample next word ∝ counts; trigram context with backoff to bigram to unigram. Seeded RNG so a given seed replays identically until re-rolled.
- The character: the machine is drawn (inline SVG, same ink-line language as the BPE page's UNK blob — 2px ink strokes, blue-gray fill, two curious eyes; NO emoji, no mouth needed). Expressions: level gaze (idle), squint (thinking — brief), wide eyes (surprised by a reveal), soft settle (confident). It is the book's protagonist making its first appearance; keep it small and shy — it sits beside its belief rows, never center stage. Squash-stretch on reactions, ≤300ms.
- Rounds: 6–10 guessing rounds curated at build time FROM the transcript — contexts where the true continuation exists and the count tables offer ≥3 plausible candidates (aim for domain-flavored ones: "language …", "from …", "mixture of …", "the bitter …"). Each round: a real transcript fragment (~8–14 words of context, lightly cleaned), 4 candidate next words (true one + 3 real alternatives drawn from the tables), the machine's counts for each. Verify every round against the tables in Node.

## 4. The eight beats (architecture + gating)

Gated exactly like the north star: `section.beat[data-beat]`, later beats hidden until goals fire; `Reveal all steps` escape valve; 8-segment hairline progress rail filling vermilion. Voice: second person, wonder-first, light humor, lean prose — the instruments carry the teaching.

**Beat 1 — Cold open: you're already playing.** No preamble. The page's first line of body text is a sentence that stops mid-thought — a real transcript fragment — with four candidate words sitting after the gap as quiet blue ink words. Hand-lettered gold nudge with drawn arrow: "pick what comes next". Tap a word → it flies into the gap; the true word resolves vermilion (match = the word warms in place + small settle; miss = your pick fades aside, truth arrives with a gentle correction). Three rounds, quick, no scoring UI beyond a hand-lettered running aside ("2 of 3 — you'd make a decent machine"). THEN the reveal, two sentences: you have just done the only thing a language model knows how to do. A **language model** assigns probability to what comes next — and that's the whole game.¹ *Goal g1: finish 3 rounds.*

**Beat 2 — Guessing is not believing.** The upgrade from picking to *pouring*: "You picked one word. A model does something more honest: it spreads its belief." One round, replayed properly: ten gold **belief drops** in a small tray; drag (or tap-to-place; keyboard: arrows + enter) drops onto any of the 4 candidates — each word's gold underline thickens/washes as it holds more belief. Spend all ten, then the true word resolves. Verdict is hand-lettered and drop-denominated ("you had 6 of 10 on it — barely surprised"). Second round available for the reader who wants it. One sentence naming the move: assigning probability = spreading belief before the answer arrives; being *less surprised, more often* is the whole job.⁵ *Goal g2: complete one poured round (all 10 drops placed).*

**Beat 3 — Meet the machine.** The character enters (one-sentence introduction: it has read exactly one lecture — this one's). It plays the SAME rounds the reader just played: its ten blue drops flow onto the candidates proportional to its real counts (tabular numerals beside each, small, mono), then the reveal. Two ink rows share the candidates — your gold drops vs its blue — no chart block, just words wearing weights. Where its counts come from is said in one line ("it counted every time these words followed each other in the lecture"). Reader can step it through 2–3 rounds; the machine reacts (surprise-eyes when it loses drops). *Goal g3: step the machine through ≥2 rounds.*

**Beat 4 — The flip: a guesser can write.** "Anything that can score the next word can also choose it. That's the entire trick of generation — the same coin, flipped." One styled line (book underline, hand-lettered "give it a start"): 3 offered seed phrases (real transcript openings) — tap one and the machine writes, word by word (~90ms cadence, caret-like), sampling from its own counts. A re-roll (drawn circular arrow, same idiom as the BPE sandbox's start-over) resamples. The babble is the point: locally fluent, globally wandering — and one aside admits it sometimes just quotes the lecture back ("one lecture isn't much of a world"). Tie to lineage truth: this fluency-without-understanding is exactly the part n-gram models supplied to translation and speech systems for decades — not the whole system, the part that kept output sounding like language.¹ *Goal g4: generate once (≥12 words).*

**Beat 5 — The lever: memory.** Tangle-style inline draggable (same dragnum idiom as BPE beat 5 — pill + underline + cursor affordance, NO chevrons): "Right now it remembers just ${n} words of what it wrote." Drag n across 1 / 2 / 3 — the generated line above **re-runs live** (same seed) at unigram/bigram/trigram order: word salad → drunk fluency → near-quotation. One sentence: every step of this book's history is, at heart, a better answer to "how much can the guesser remember — and what should it do with what it remembers?" *Goal g5: visit ≥2 values of n.*

**Beat 6 — Seventy years of better guessers.¹ ²** The lineage as a scrubbable strip (drag the machine along it; keyboard arrows; stops light as reached — same scrubber discipline as BPE's sparkline). Stops, wiki-faithful, one line each, key phrases as **target-pointers** that light the relevant earlier instrument: Shannon in the 1950s measuring the entropy of English with language models → n-gram models inside translation and speech systems (→ points at beat 4's babble line) → LSTMs in the '90s → Bengio 2003, the first neural language model, a feedforward net over a small context (→ points at the n lever) → Seq2Seq: compress a whole sentence into a vector → attention, then the transformer, both built for machine translation → mixture-of-experts and model parallelism in the 2010s → ELMo and BERT, late 2010s: pretrain on lots of text, fine-tune per task. No dates beyond these; no capability claims beyond the source's. *Goal g6: reach the strip's end (all stops visited).*

**Beat 7 — The word keeps shifting; the game doesn't.³ ⁴** Prose beat, two moves. (1) In one decade "a language model" went from something you **fine-tune** → something you **prompt** → something you **chat with** → **agents** that run long tasks — same engine, stricter demands (much longer context; inference efficiency that matters more every year), and underneath, the fundamentals barely moved: GPUs and kernels, gradient-style optimization, the transformer and attention. Next-token prediction is still the default way these models are trained.⁵ (2) So why build one, when you could just prompt? Because abstractions leak — and when the model can't do what you need, prompting leaves you no recourse; real understanding of the stack comes from building it.⁴ Inline check blank (Mathigon idiom, retries allowed, gentle corrections): "Across all four eras, the thing that never changed is [[the game: guess what comes next ✓|the size of the models|the way we talk to them]]." *Goal g7: answer the blank.*

**Beat 8 — Sandbox + the door onward.** Hand-lettered sign: "your turn — interrogate it." Free play, no goals: a typed context line (book underline) shows the machine's live top guesses (its real counts as blue drops/weights on up to 6 words; unseen context → it visibly shrugs, wide-eyed, and falls back to shorter memory — say so in a hand-lettered aside); the seed/re-roll generator and the n lever remain usable; everything stays live-linked. Then the takeaway (three quiet sentences: the game is the definition; better guessers are the history; the rest of this book builds one for real) and the door: to build one, the machine first needs its text turned into numbers it can hold — which is the next chapter's story ("How a computer learns to read" — plain text mention, NO link). Sources block ends the page. *Terminal — no gate.*

## 5. Footnotes → Sources block (page-end idiom identical to BPE)

- ¹ CS336 L01 · 11:45–13:19 — Shannon and entropy of English; n-grams as the fluency component in MT/speech; lineage: LSTMs, Bengio 2003, Seq2Seq, attention, transformer, MoE + model parallelism.
- ² CS336 L01 · 13:19 — ELMo/BERT: pretrain then fine-tune.
- ³ CS336 L01 · 17:09–18:41 — fine-tune → prompt → chat → agents; fundamentals persist; longer context makes inference efficiency matter more.
- ⁴ CS336 L01 · 03:58 — abstractions are leaky; fundamental research needs the whole stack; understanding comes from building.
- ⁵ CS336 L01 · 31:58 — next-token prediction as the default training objective.
- Corpus line: "The little machine's entire vocabulary comes from the transcript of CS336 Lecture 1 — it has read nothing else."

## 6. Engineering constraints (identical to north star)

Single self-contained fragment file `book/language-modeling.html`: `<meta charset="utf-8">` first, then `<style>`, content, `<script>`. No doctype/html/head/body. Zero external resources (Patrick Hand embedded via the existing data URI). Vanilla JS + inline SVG only. Fully usable at 375px (pointer events, `touch-action` managed) and by keyboard end-to-end; `aria-live` where content changes; visible focus; AA contrast both themes; every displayed number exact (counts) or drop-denominated — no fake precision. Works as a raw local file AND as a hosted static page. Absolutely silent.

## 7. Acceptance gates (builder self-verifies ALL before reporting; the design lead re-verifies)

1. **Honesty gate:** extract the embedded tables + game rounds in Node; verify every round's candidates and machine drops match real transcript counts; verify generation at n=1/2/3 reproduces from the seeds; verify backoff. No number on the page that isn't a real count or a drop.
2. **Fidelity gate:** list every historical/definitional sentence with its wiki/transcript anchor; zero unanchored claims.
3. First viewport at 1280×800 AND 375×812: the cold-open round is playable above the fold.
4. Gating: beats 2–8 absent until goals fire; Reveal-all unlocks everything; rail fills; natural progression end-to-end from a hard reload without the escape valve.
5. Anti-slop sweep (grep + eye): zero cards/default controls/kickers/stat tiles/chips/emoji; palette exactly the book's; wide-element centering per rule 4; no hash links (grep `href="#`).
6. Interactions: drops place/remove by mouse, touch, keyboard; dragnum scrubs by all three; scrubber strip likewise; target-pointers scroll-then-glow with the ≥1.8s discipline and empty-target fallback; arrows pass the geometry audit; annotations non-wrapping at all widths.
7. Both themes screenshot-verified (or headless-DOM-verified if the pane won't composite; say which); reduced-motion path exists; silent (grep audio APIs).
8. Patrick Hand renders (or its absence is loudly flagged).
9. Page ≤ 300KB; console clean from hard reload through full natural playthrough.
10. Feel check, honestly answered in notes: does pouring belief feel like *committing*, and the reveal like a small stake paying off? Does the machine read as a character, not a widget? Does the page read as a place?

## 8. Out of scope

No schema/JSON authoring layer, no persistence, no theme toggle UI, no navigation to other pages (the BPE mention is plain text), no share UI, no tutor/chat hooks, no audio ever. Do not modify `bpe-north-star.html`.

---

## 9. Round 7 addendum — the seam view (babble provenance) · specced 2026-07-24

**Author finding (round 7):** when the page claims "a sentence or two in, it wanders off a cliff," the reader should be able to *see* in which part of the generated sentence the babble begins. All rules in the `unit-page` skill apply; this section carries only the round's own design.

### 9.1 The honest signal (definition)

"Where the gibberish starts" is made real and computable as **departure from verbatim lecture text**. The generated line is segmented into **maximal runs**: contiguous stretches that appear word-for-word inside a single sentence of the L01 transcript stream (same tokenization as §3's tables — build-notes §1 rules, n-grams never cross `.?!`/paragraph boundaries). Between runs are **seams** — the points where the machine fell off the stretch it was following and glued on a different one. Empirically (validated 2026-07-24 against the shipped tables + a rebuilt stream; simulator `seam-sim.mjs`, core inlined in build notes round-7 section):

- at n=3, **0/180 rolls are seam-free**; ~4.9 seams per 16-word roll; the first seam lands after ~3–4 words;
- the same roll at memory 2/1/0 segments into 6 → 9 → 15 runs (the lever's story, made visible);
- deterministic reference: first click (chain seed 1025555898) on "language models" → run lengths **3,2,3,2,5,3**.

Segmentation is **greedy longest-prefix** (repeatedly take the longest prefix of the remaining words that occurs within one sentence). Because any substring of a within-sentence span is itself a within-sentence span, greedy is provably minimal in number of pieces — builders must not "improve" it with DP.

### 9.2 Data: the embedded stream (`DATA.S`)

Embed the full cleaned word stream so runs are checked against the *actual lecture*, and the page becomes self-verifying (stream re-derives every shipped table):

- Content: the 11,505-token / 1,729-word / 838-sentence stream from the CS336 Lecture 1 transcript (via the ingestion pipeline, a separate project), build-notes §1 rules **unchanged**.
- Encoding: each word id (index into the existing `W`) as **2 chars** from the 64-alphabet `A-Z a-z 0-9 - _` (id = 64*c0 + c1); sentences joined with `"."` (not in the alphabet). One string, ~24 KB. Decoded once at init into per-sentence id arrays + a word-to-positions index (segmentation must stay cheap per render — beat 5 re-segments during drag).
- **Honesty gate:** a Node script decodes `DATA.S` and re-derives `U` (all counts), pruned `B` (top-16) and pruned `T` (total>=2, top-6) — must deep-equal the shipped tables exactly. Script core + result go in build notes.

### 9.3 Rendering (both `#g4line` and `#g5line` — linked representations)

- **Runs of length >=2 get a continuous quiet underline**: byte-blue, 2px, rounded ends, ~0.22em below baseline, ~55% opacity (dark theme: same token, tuned to stay visible-not-loud). The underline covers the run's inner spaces; it **breaks at seams** (the natural word gap stays — text metrics, wrapping, and x-positions must not change at all). Length-1 runs stay bare — a lone word is not a quote worth marking; at memory 0 the line correctly reads as dust with rare pair-flickers.
- **Words and colors are untouched** (seed words stay vermilion; generated words ink; monospace unchanged). The underline is a provenance channel, not a text restyle.
- **The cliff mark (beat 4 only, seams >=1 only):** a small hand-drawn step-down stroke — a cliff edge in profile (short plateau, then the drop), gold, ~.75em x .95em, slight rotation, anchored to the first word after the first seam, hanging into the seam gap, `aria-hidden`, **zero layout shift** (absolutely positioned within that word's span). If the seam falls at a visual line wrap, the mark sits at the new line's start — acceptable. Not rendered in beat 5 (its captions own that channel; a mark popping during drags would flicker).
- **Timing:** during typing, no underlines (clean text types as today). When the caret finishes: underlines paint left-to-right with a quick per-run stagger (~60ms), then the cliff mark pops (<=320ms scale-in), then the caption updates. Rerolls clear all marks before retyping. Reduced motion: everything appears via the book's fade — never an instant pop, never a wiggle. Beat 5 (no typing animation): underlines render with the words on every lever change, no stagger.

### 9.4 Copy (implement VERBATIM)

- `#g4note` caption, seams >=1 (numbers computed from the actual roll; K = first-run word count incl. the seed words, M = runs minus one):
  `every underline is a stretch of the real lecture — it fell off its first one after K words, then stitched M more.`
- `#g4note`, zero seams (unobserved in 180 sims; keep the path anyway):
  `this whole line sits in the lecture, word for word — one long quote. roll again.`
- `#g4after` paragraph becomes (footnote 1 stays on the historical claim):
  `Locally it <i>is</i> language — every underlined run appears in the lecture, word for word. But a few words in it wanders off a cliff — the little edge-mark shows the exact step — and from there it's stitching real pieces with no destination; you probably never felt the seams. That babble — fluent but aimless — is exactly what machines like this one supplied to translation and speech systems for decades: not the understanding, just the part that kept the output sounding like a person.<sup class="fn">1</sup>`
- Beat 5 `NOTES[2]` becomes: `two words of memory — it writes in whole phrases lifted straight from the lecture.`
  (The old "all but recites" would be falsified by the now-visible 2–5-word runs.) `NOTES[1]`/`NOTES[0]` unchanged.
- Beat 5 after-text, first paragraph's last sentence becomes: `Two, and it writes in whole phrases lifted straight from the lecture — one book isn't much of a world to remember.` (Second paragraph unchanged.)
- aria-labels: `#g4line` becomes `what the machine wrote — underlined stretches appear word-for-word in the lecture`; `#g5line` becomes `the machine's writing at the chosen memory — underlined stretches appear word-for-word in the lecture`.

### 9.5 Acceptance gates (round 7; builder self-verifies, the design lead re-verifies)

1. Stream gate (9.2): decode gives 838 sentences / 11,505 tokens; re-derived U/B/T deep-equal the shipped tables.
2. Segmentation gate: a Node reference (greedy longest-prefix, within-sentence) reproduces the page's runs for >=5 deterministic chain rolls per seed; first-click "language models" roll = lens 3,2,3,2,5,3.
3. Rendering gates: no layout shift (word positions identical before/after underlines paint); continuous underlines incl. inner spaces; clean breaks at seams; no length-1 underlines; no orphan underline stubs at line wraps (verify a seam near a wrap at 375px); both themes; reduced-motion fades.
4. Beat-5 drag: segmentation live per lever value, no jank, no cliff mark there, notes swap correctly.
5. A11y: labels per 9.4; caption still `aria-live`; mark `aria-hidden`; zero new interactive elements; keyboard/focus behavior unchanged.
6. Size <= 260KB reported; console clean (hard reload, natural playthrough, reveal-all, reroll spam, lever drag); charset first line intact; no external resources; anti-slop grep sweep re-run.
7. No changes outside beats 4/5 + the two aria-labels (goals, gating, rounds, sandbox, timeline untouched).

### 9.6 Out of scope (round 7)

Tapping a run to reveal its transcript location/timestamp (candidate for a later round); any change to the sandbox, the beat-6 pointer glow (`data-target="g4line"` keeps working), or other pages; re-tokenization of the corpus.
---

## 10. Round 8 — the fall (supersedes §9.3–9.4 rendering/copy; §9.1–9.2 data+segmentation stand) · 2026-07-24

**Author verdict on round 7:** "Not the effect I want to see. Is that a crack? It looks more like a visual glitch… the underlines increased my confusion." Diagnosis accepted in full: the cliff mark was an unlabeled abstract stroke (reads as a rendering defect), and the underline channel decorated the *acceptable* stretches to imply the broken tail — a new grammar the reader had to learn and then invert. Round 8 removes the apparatus and has the sentence perform its own failure.

**Rendering (both lines, shared `buildRuns`):** the head fragment sits level — it is riding one real lecture sentence. At every seam the line **steps down** a little further: cumulative depths `FALL=[0,6,9,11,12,13]` px by fragment index (cap 13px). Depth applies to every word of the fragment via `translateY` on the (now `inline-block`) word spans — paint-only, so text, wrapping, and x-positions are byte-identical to no-fall. Words land at their depth as they type, so the descent performs itself during writing; no post-hoc grading pass, no new symbols, no underlines, no mark, no entrance animations (reduced motion needs no special path — depths are static positions; the existing word fade is unchanged). Geometry validated numerically on the live page: max drop 13px vs 31px line boxes (no inter-line collision at any width), 24px clearance to the caption at the deepest point.

**Copy:** caption seams≥1 `steady for K words — a real stretch of the lecture — then it stepped off, stitching M more scraps to finish.` · zero seams `this whole line sits level in the lecture, word for word — one long quote. roll again.` · g4after rewritten around the performed fall (keeps "wander off the cliff" and fn 1; see page) · aria-labels: `…the line steps downhill where it leaves the lecture's actual words`. Beat-5 NOTES and after-text from round 7 stand.

**Verification (all passed 2026-07-24, direct fix — round-5 precedent):** script compiles; DATA hashes byte-identical to round 7 (determinism); chain[0] roll depths 0/6/9/11/12/13 with caption K=3/M=5; reroll chain[2] K=4/M=4; reroll-race leaves single consistent caption; lever silhouettes mem2 `0,6,9,11,12` → mem1 `…,13,13` → mem0 floor-bound `13×6`; g5 linked to the current roll; console empty; 223.5 KB. The test environment did not composite frames this session — geometry verified numerically; the aesthetic read is the author's pass (conservative stair parameters chosen; `FALL` is the single tuning knob).

### 10.1 Round 9 addendum — the fade (author request, 2026-07-24)

Falling fragments also lose ink: wrapper opacity per fragment index, `FADE=[1,.85,.76,.7,.65,.62]` (same diminishing rhythm as `FALL`; the seed/head fragment always full ink). Applied on the RUN WRAPPER so the per-word typing fade (0→1) still runs inside it; no interaction with the reveal idiom; no new animation (static levels; reduced motion needs nothing). **Floor rule: the fade floor must keep body-size AA (≥4.5:1) in the binding theme, measured, not assumed** — 0.62 gives 4.66:1 light / 6.53:1 dark against the live computed colors (0.55 measured 3.75:1 light and was rejected). `FALL`, `FADE` and `TILT` are the tuning knobs.

### 10.2 Round 10 addendum — the tilt (author request, 2026-07-24)

Each fallen scrap also leans: `TILT=[0,.9,-1,1.1,-1.2,1.3]`deg by fragment index, sign alternating so adjacent scraps disagree; head level. Within a scrap the baseline drifts along the tilt line (`tan(t)*ADV`, ADV≈62px), capped at 3 word-steps so it stays readable and never re-crosses the level line. Per-word static transforms (translateY+rotate combined) — wrapping, x-metrics, reduced-motion all untouched. **Readability rule: cap the lean ≈1.3° and cap the within-scrap drift — the babble is still content the reader reads.** Three compounding misalignment channels now (depth+fade+tilt); all three are single-array knobs.

