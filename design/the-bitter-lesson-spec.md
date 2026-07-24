# Unit spec — "Bigger or cleverer?" (the-bitter-lesson)

*2026-07-23. Chapter 1, unit 2 — after "The guessing game", before compute-efficiency. **All rules in the project skill `unit-page` apply** (read it first: pipeline, design principles, the earned-rules catalog, verification protocol, audience rule). This spec carries only what is unique to this unit.*

**Content source of truth:** the wiki concept page for "the bitter lesson," produced by the ingestion pipeline (a separate project), plus its cited transcript segments (CS336 L01, t≈09:22–10:59; the profile-and-benchmark mindset line lives at t≈07:47). **Unit boundary:** the 44× ImageNet result and the budget framing belong to the NEXT unit (compute-efficiency) — do not use them here; the door may tease "the receipts are the next page's story" without numbers.

**Fidelity inventory (every claim this page may make):** the common misreading ("scale is all that matters; algorithms don't matter") and the right reading ("algorithms that scale are what matter"); the identity accuracy ≈ efficiency × resources with efficiency = output/input, resources = the input; efficiency matters more at larger scale; at small scale a 2× slower run just means waiting; at frontier scale the same inefficiency can cost hundreds of millions of dollars; even a ~5% improvement can be a big deal; the consequence-mindset: profile and benchmark everything, optimise for efficiency. Nothing else — no Sutton, no essay history (the lecture only says the phrase "has been circulating"), no dollar axes, no invented model names or years.

## 1. Concept

A short, sharp unit (~7 min, 6 beats). The reader bets on a question, plays a shape that settles it, and re-bets. Thesis: **cleverness is a multiplier, not an addend** — and multipliers matter more the bigger the other factor gets.

Page title: **Bigger or cleverer?** — eyebrow: *Language, from scratch · chapter one*. Meta: `~7 min` + `Reveal all steps`. The phrase "the bitter lesson" is introduced inside beat 1 as the field's name for this argument (a term of art the page itself glosses — audience rule).

## 2. Design-system inheritance

Tokens verbatim from `bpe-north-star.html` (md5-identical to `language-modeling.html`). Idioms from **`language-modeling.html`, WITH their fix history** (the skill's porting rule): the belief-drop tray (pointer-drag + tap + keyboard, focus discipline), the machine character (`machineSVG()`, `mExpr`/`mReact` + the expression-timer pattern — a reaction is a moment, not a state), the inline blank/menu, `.sronly`, the candidate row grammar, gated beats + rail (6 segments here), scroll-then-glow target-pointers.

**Palette thesis:** resources = **byte blue** (the raw pour: machines, money, width). Cleverness/efficiency = **token vermilion** (the learned factor: height). The reader's touch = **gold** only (drag handles, belief drops, hand-lettered nudges). Area gains flash as vermilion fill at the moment they're earned; the resting area is a quiet neutral wash (ink-tint), never a new hue. Green = goal ticks only.

**Character:** the little machine recurs (same drawn pebble — book continuity; the reader met it last page). New expression: a held half-lid "napping" state (reuse the `.m-lid` geometry at partial scaleY) for the waiting vignette. Reactions ≤320ms with timed return to idle.

## 3. The instrument — the multiplication rectangle

One instrument carries the page: **capability = cleverness × resources**, drawn as a rectangle the reader resizes by its edges.

- Width = resources (blue edge/axis label, plain-words gloss "the computing power you pour in — machines, time, money"). Height = cleverness (vermilion, gloss "how much the method squeezes out of every drop"). Area = capability, shown as a live multiple of the starting size ("×1.0", "×2.0"…) in tabular numerals.
- Drag either edge by its **gold handle** (pointer capture + `touch-action:none` + keyboard arrows on a focusable handle + **`.focus()` inside the `pointerdown` handler** — the ported fix). Resizing animates the rectangle; newly gained area flashes vermilion then settles to the neutral wash; lost area fades out. The machine sits beside it, reacting (pop on growth, gasp at the beat-3 strip moment).
- **Honesty:** every displayed number is live arithmetic on the reader's lever positions (area multiple, percentage deltas). The page imports exactly three quantities from the source, all in prose with anchors: "twice as long", "~5%", "hundreds of millions of dollars". No currency axes, no invented data.
- Scale-aware display: beat 3 rescales the width axis to "frontier" (the rectangle goes wide-treatment per the layout rule — instrument may breathe to ~52rem, content centered, captions on the column edge). At any width the rectangle must stay fully visible at 375px (vertical proportions adjust; geometry math independent of rendered pixels).

## 4. The six beats

Gating discipline per the skill; 6-segment rail; every beat completes naturally from a hard reload without the escape valve.

**Beat 1 — Place your bet (cold open).** No preamble. The rumor, stated as speech on the page (two sentences, book voice): machines that read went from lab curiosities to writing half the internet's code — and the loudest explanation is that only one thing changed: *size*. The clever ideas, the rumor says, stopped mattering. Then the tray: **ten gold belief drops**, three positions in the candidate-row grammar — **sheer size** · **clever methods** · **size × cleverness, multiplied**. Hand-lettered: "pour honestly — the same question is waiting at the end of the page." Store the placement. After all ten land: one sentence naming the argument — the field calls this fight *the bitter lesson*, and it is usually misread.¹ *Goal g1: 10 drops placed.*

**Beat 2 — The machine's two levers.** The rectangle appears at a small, friendly size; the machine beside it. Prose sets the frame in plain words: a reading machine's capability comes from two things — what you pour in, and what the method squeezes out of every drop. Invite: "make it twice as capable." The reader discovers **both roads**: doubling the blue edge doubles the area; so does doubling the vermilion edge. The page detects each road the first time it is taken (a quiet green tick beside each). *Goal g2: reach ×2 by width once AND by height once (order free; page resets area between attempts with a gentle hand-lettered cue).* After: the naming moment, set as the book sets definitions — this is the lecture's own arithmetic: **accuracy ≈ efficiency × resources** — efficiency is what you get out per what you put in; resources are the input itself.¹ (Terms arrive AFTER the play — and "efficiency"/"resources" are hereby the page's words for the two edges, glossed in the same sentence.)

**Beat 3 — Scale breaks the symmetry.** A scrubber (same discipline as the lineage strip: drag + keyboard + stops) slides the rectangle's world from "your laptop" to "frontier" — the width grows enormous while height holds. At frontier, the invitation: "now add just 5% of cleverness." One gold tap/drag → a thin vermilion strip lights across the ENTIRE width — small lever, huge sweep — with the live area multiple jumping visibly. The machine gasps. Prose carries the source's vignette²: at small scale, a run that's twice as slow just means waiting — the machine naps through it (half-lid) — but at frontier scale the same slowness costs hundreds of millions of dollars; suddenly even five percent is a fortune. A **target-pointer** in this prose ("that thin strip") lights the strip on tap (scroll-then-glow discipline). *Goal g3: reach frontier on the scrubber + fire the +5% moment.*

**Beat 4 — The lesson, read right.** The inline blank: "So the bitter lesson actually says [[cleverness that survives scaling is what wins | only size matters | clever ideas stopped mattering]]." Wrong choices get gentle corrections that quote the misreading back (source's wrong reading: "scale is all that matters; algorithms don't matter"). On correct: the corrected reading set plainly — **methods that scale are what matter**: cleverness doesn't lose to size; cleverness *multiplies* size, so the bigger the pour, the more every point of cleverness pays.¹ *Goal g4: answer correctly (retries allowed).*

**Beat 5 — Re-pour.** The same three positions return; the reader's beat-1 pour is shown as **faint ghost drops** in place (their own data, exact). Ten fresh drops. After all ten land: an honest, warm verdict comparing only their two pours ("you moved three drops toward *multiplied*" / "you stood your ground — conviction noted"). No grading; the page argued, the reader decides. *Goal g5: 10 drops re-placed.*

**Beat 6 — The mindset + the door (terminal, no gate).** Consequence, two quiet moves. (1) This is why this book — like the course it reads from — treats **efficiency as a first-class obsession**: measure where every second and every chip-hour goes, and squeeze³ ("profile and benchmark everything", glossed in exactly those plain words). (2) The door: the next page takes the lens deeper — *Compute efficiency: the mindset* — and brings the receipts; plain-text mention, no numbers borrowed from it. The rectangle stays live above as the sandbox (extended lever ranges unlock; hand-lettered "push both levers — see what a multiplier feels like"). Sources block ends the page.

## 5. Footnotes → Sources

- ¹ CS336 L01 · 09:22 — the misreading vs the right reading; accuracy ≈ efficiency × resources; efficiency = output/input.
- ² CS336 L01 · 10:09 — small scale: wait twice as long; frontier scale: hundreds of millions; even ~5% is a big deal.
- ³ CS336 L01 · 07:47 — profile and benchmark everything; efficiency as the mindset the course bakes in.

## 6. Engineering

Per the skill (fragment file, charset first, self-contained, silent, both themes, reduced motion, a11y matrix). **No corpus/data blob this unit** — target ≤ **120 KB** total. No RNG needed (everything is reader-driven arithmetic — deterministic by construction). File: `book/the-bitter-lesson.html`; notes: `design/the-bitter-lesson-build-notes.md`.

## 7. Acceptance gates (beyond the skill's standard sweep)

1. **Honesty:** extract the area/delta math into Node; assert the displayed multiple and percentage always equal the arithmetic of the lever state; assert the beat-3 strip's geometry equals exactly 5% of current height across the full current width; assert beat-5 ghosts equal the stored beat-1 placement.
2. **Fidelity table** covering every sentence against the inventory above; zero claims outside it (notably: no Sutton, no essay content, no 44×).
3. **Both-roads detection** in beat 2 (width-double and height-double each individually detected and ticked).
4. **Audience sweep:** caps-pattern grep + read-through — no unglossed term of art; "the bitter lesson", "efficiency", "resources", "profile and benchmark" each glossed at first appearance in plain words.
5. Standard: gating end-to-end natural, anti-slop greps, drag+tap+keyboard on handles/drops/scrubber (with focus-on-click), themes, 375px (rectangle fully visible and draggable), reduced motion, console clean, feel-check ("does dragging the edge feel like feeding the machine? does the +5% strip land as a gasp?").

## 8. Out of scope

No 44×/ImageNet content (next unit). No schema layer, persistence, navigation, theme UI, audio. Do not modify existing pages. The rectangle is not a chart — no axes grid, no plot chrome; it is a shape you hold.
