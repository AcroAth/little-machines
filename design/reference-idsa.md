# Reference analysis — IDSA, "An Interactive Handbook on DSA"

*2026-07-23. Third author-supplied reference, after Mathigon and Nicky Case (see `reference-analysis.md` — this doc extends it, never restates it). Method: ran the official Windows demo (`IDSA_build_38_Win64_demo`, the free ~40-page Strings-chapter preview) end to end — all 45 pages (0–44) walked, every instrument class exercised hands-on (edited diagram values, played + scrubbed visualizations, ran the code-playback, typed and submitted a real solution in the embedded IDE); plus build-folder forensics and product/web recon (cartesian.app, Buy Me a Coffee listings, Show HN).*

---

## Part 0 — What it is

**The Interactive Handbook on Data Structures and Algorithms** ([cartesian.app](https://cartesian.app/)), by solo developer **Elias Yilma** (@ElijahYilma), © 2025. $35 (marked down from $59), Windows/macOS/Linux, offline, no DRM/tracking/subscription. Claimed scale: **670+ interactive pages, 22 chapters, 300+ visualizations, 100+ solved problems, 250+ interactive code snippets**. Modest public splash (Show HN Jul 2025: 29 points, 4 comments) but real sales (~500+ Windows units on BMC alone). Roadmap: dark mode, notes/bookmarks, multi-language.

**Tech (from the shipped build):** Unity (Mono) + TextMeshPro + DOTween, one scene for the whole book, **IronPython embedded** — the in-book Python is real execution, not canned traces. ~110 MB total, ~58 MB content assets. Canvas is **hard-locked 16:9** and scales like a poster — nothing reflows, ever (author confirmed the lock on HN; TOC/FAQ break on odd screens). Custom playback/animation systems built on top of Unity ("plus a bunch of custom tools I built on top" — author).

**The author's thesis, stated in the Preface (p2):** reading code means mentally tracking variables, and switching to an IDE "disrupts the learning process" — so *every* code snippet in the book, including problem solutions, is a playback system: run, rewind, jump, custom inputs. Active learning as elimination-of-context-switch. This is a different diagnosis than Mathigon's (gating/pacing) or Case's (story/empathy): **IDSA's enemy is the gap between the book and the debugger.**

One sentence to place the three references: **Mathigon is the tutor, Case is the theater, IDSA is the laboratory bench.**

---

## Part 1 — The container: a paged handbook, third archetype

- Discrete **pages** on a fixed 16:9 canvas, keyboard ←/→, instant cuts (no page-turn theater). Front matter (cover · terms · preface · author card · 2-page "How to Use") then chapter cover then content pages. Page number bottom-left.
- **No pacing authority whatsoever.** Free random access, nothing gated, no progress state, no reading-time disclosure, no "you are here" beyond the page number. It is a *reference bench*, not a course — the polar opposite of Mathigon's grown-as-you-learn page. (Bookmarks are a roadmap item; today the book doesn't even remember where you were.)
- **Navigation chrome is transient**: giant soft-pink blob buttons (PREVIOUS/NEXT PAGE) at the screen edges + an "OPEN NAVIGATION MENU" pill appear on launch/window events, then fade *permanently* until the next event. The reliable path is undocumented: **the page number is the nav toggle**. The NAVIGATION overlay is a poster card listing the 22 chapters (current one highlighted coral); chapter-level only — no sections, no search, no index.
- **Focus traps:** on problem pages the code editor auto-captures keyboard, silently swallowing the paging keys until you click out. We hit this repeatedly; a reader will too.

## Part 2 — The universal interaction grammar (taught once, pages 4–5)

The whole book runs on one click vocabulary, taught in a two-page illustrated contract up front and never explained again:

- **Left-click increments, right-click decrements** any number. Clicks cycle characters (A→Z / Z→A). Bits flip. Matrix cells edit. Arrays resize with +/− buttons. Weighted-graph edge weights are click-editable. Tree *structure* is edited by clicking **red dots = null slots** — click one and a child grows there.
- With it comes a **manipulable notation system** per data type, reused in all 22 chapters: boxed cells with indices for strings, pills for arrays, circles for nodes, red dots for nulls, hand-drawn red arrows for pointers, a–z count tables, paired/mirrored tables for two-state algorithms, knobs (circled values) for parameters.
- Even the how-to page is live — the instructions demo is a real memoized-Fibonacci playback with its input knob wired to the code by a red thread. Chapter covers are toys too (the Strings cover word cycles through palindrome jokes when clicked: *rotator* → *shortly* → …).

The cost: right-click semantics and the page-number nav are **undiscoverable without the manual page** — the grammar is legible only because the contract page exists. The payoff is enormous consistency at scale.

## Part 3 — The instruments

**3a. Live-calculator diagrams** (definition/operations pages). Every figure computes: substring start/end knobs update a live readout, split/concat/membership/case-conversion all recompute from the editable string. No canned pictures anywhere — the book's honesty contract, independently arrived at.

**3b. Visualization + playback.** Framed "Visualization:" panel: editable input on top, state displays below, one slider with a play button. Play runs at a deliberate ~2–3 steps/sec with per-step highlights (cursor cell gray, touched table cell coral-boxed, changed counts coral; rolling-window pages color the leaving char red / entering char green). The slider is a **time-travel scrubber over reconstructed algorithm state** — drag to 33% and the tables show *exactly* the state after that many steps, play arrow re-armed. Deterministic state reconstruction, not video. Steps narrate themselves through a caption line in coaching voice (*"Let's reset the frequency table."*). Readouts are plain labeled monospace lines (`HASHSET: {}`, `LENGTH: 0`, `PERMUTATION EXISTS:`, `MATCHING INDICES: []`).

**3c. Code playback — the signature invention.** During execution the *source text itself* becomes the debugger display:

- `for chr:h in s:happyandsad:` — loop variable wears its current value inline
- `freq:[0000000100000000000000000][chr:h-'a'] += 1` — the whole array state spliced into the line
- `while left < right :1<11:` — conditions rewritten with live operand values
- `right:12~len(s)` — value plus provenance of where it came from
- a red execution dot walks the lines, with a bracket tracing the call path

…and the same slider drives the code trace AND the data visualization below it in lockstep: **two projections of one execution timeline**. Neither Mathigon nor Case has anything in this territory. The `name:value` decoration is a real notation with a learning cost (code no longer reads as what you'd type), but for "watch the algorithm think," nothing else we've inspected comes close.

**3d. Embedded IDE** (problem pages). Statement + worked examples left; right panel: `</> Code` editor (live syntax coloring, paste works, soft-wrap, current-line band), a **15:00 time budget** with clock icon (interview framing), reset/save/undo/run toolbar, Output pane, Test Cases pane with per-case `input / target / output` and a ‹ › pager, "N/M TESTS PASSED" scoreboard. Real IronPython execution of *your* code.

- **Observed defect worth learning from:** the scoreboard's semantics are opaque — in the demo it went 0/3 → 0/5 → 0/15 across interactions while the visible cases showed `output == target`, and never credited a pass. Whatever the cause, the lesson is crisp: **an evaluator whose ledger doesn't visibly credit success destroys the loop's payoff.** If this book ever scores anything, the ledger must be legible and instantly reconciled with what the reader just saw.

## Part 4 — The page-type system

Pages carry an explicit **type tag** in a boxed label beside the chapter name — DEFINITION, OPERATIONS, TERMINOLOGY, topic tags (CHARACTER FREQUENCIES, PATTERN MATCHING), problem names (VALID PALINDROME…). The archetypes:

1. **Definition page** — prose + live-calculator figures.
2. **Operations gallery** — one editable specimen + grouped live one-liners.
3. **Terminology plate** — the standout: an *anatomical plate* — one central specimen (the string "flower") with 7 callouts wired to exact diagram parts by red-dot connector lines, captions in typewriter face. Text-touches-figure in full-page form.
4. **API reference card** — Python one-liners grouped ACCESS / SUBSEQUENCES / MODIFICATION.
5. **Concept + visualization** — two-column prose with an embedded playback panel.
6. **Procedure + implementation** — numbered plain-English recipe beside commented code playback (comments set in red italic script — a distinct *human voice* register inside machine text; inconsistently gray on some pages).
7. **Problem + IDE.**
8. **Solution intuition** — prose + **Complexity Analysis as iconized structured fields** (clock `Time: O(n)`, memory-chip `Memory: O(1)`, each with a one-sentence justification), + visualization.
9. **Theory section** — late-chapter KMP/Rabin–Karp pages with properly typeset math (blue serif formulas, real superscripts) and full-page implementation splits.

**The solution ladder** is the chapter's spine: each problem = statement+IDE → Solution 1 (usually brute force): intuition/complexity/viz then procedure/code → Solution 2 (the clever one): same pair. Brute-force-before-clever, always; complexity always in the same iconized slots. The demo chapter runs ~6 problems this way, difficulty rising to KMP and rolling hashes.

## Part 5 — Visual language

- **Paper, not screen:** gray-white ground for front matter, warm cream for chapter pages; drop-shadowed double-border poster frames for cards (author note, navigation). It reads as a *printed workbook* — and the frames around instruments are the print idiom's version of exhibits (the one place its grammar overlaps our banned "cards").
- **Three working hues + paper:** coral-red owns data, controls, highlights, page numbers; **blue** owns semantic labels (*start, end, input, substring*), instrument titles, and math; black owns prose. Green appears only as "entering the window." Startlingly close to the book's own discipline (byte blue / token vermilion / invitation gold / green-for-goals) — evidently three-hues-with-strict-roles is what this genre converges on.
- **A poster type-collision that works:** fat serif for headings/prose; tall condensed outline-inline woodtype for display (chapter names, tags, NAVIGATION); red handwritten script for the human voice (*"press any key to continue…"*, code comments, *Purchase!*); typewriter face for plate callouts and readouts; monospace for code. Six voices, each with a fixed register — personality without a single decorative border.
- **Illustration:** thin-line ink with sparse pink fills — the pink-checkered hot-air balloon cover, the author's hand-drawn self-portrait + ink signature, letter-tile toys on chapter covers, a line-art classroom on the exit page, and a stroke-by-stroke **handwriting animation** even on the purchase upsell. No characters, no mascots, no story — the warmth is *authorial*, not narrative.
- **Curated joke data as a humor channel:** example inputs are little winks — `borrow or rob`, `happy and sad`, `rotator`, `tommarvoloriddle` (the Voldemort anagram, placed right after the anagram problem), the `fl-` word family (flower flood float floor floppy flow). Warmth without a single invented number.
- **Silent.** No audio affordances anywhere in 45 pages. A commercially successful, warm, playful interactive book with zero sound — the existence proof for the book's no-audio constraint.

## Part 6 — Scored against the shared-DNA bar (reference-analysis.md Part 3)

| DNA point | IDSA |
|---|---|
| 1. Subject directly manipulable | **Partly.** Everything is editable in place — but by click-cycling parameters, then replaying. It's *set-and-watch*, not *hold-in-your-hands*; no dragging the subject itself. |
| 2. Pace is authored | **No.** Free-roam reference. The one big absence. |
| 3. Prose ∩ interactive one fabric | **Partly.** Terminology plates and procedure-beside-code do wire words to figures; but the dominant layout is prose column beside instrument panel — no blanks/variables inside sentences. |
| 4. Experience before terminology | **No — inverted by design.** Definition first, always; play arrives after theory. The Preface embraces reference order. |
| 5. Designed identity | **Yes, strong.** Paper + coral + woodtype + script; per-chapter cover motifs; instantly recognizable. |
| 6. Warmth | **Partly.** Second-person authorial voice, jokes, an author who says hello — but no characters, no stakes, no story. |
| 7. Reader autonomy | **Yes.** Free navigation, custom inputs everywhere, offline, no DRM, no telemetry. |

Net: **IDSA is the strongest reference for instruments and the weakest for pedagogy-as-narrative** — the exact inverse of Case. It completes the triangle: container/pacing (Mathigon) · soul/story (Case) · instruments/execution (IDSA).

## Part 7 — What the book takes

**Steal (adapted, not copied):**

1. **The execution scrubber as a first-class instrument.** For units in the book that *are* algorithms — BPE's merge loop, sampling, beam search, attention steps — a time-travel slider over real reconstructed state, with per-step caption narration, is the geopad-equivalent. The BPE pad already merges by hand; a scrub rail over a *recorded run* is the natural sibling instrument. Steps at ~2–3/sec, current-element cursor, changed-value flash: IDSA's timing grammar is proven.
2. **State lives inside the representation.** IDSA splices values into code text; the book's port is values living inside *diagrams and equations* — a term in a formula showing its current quantity while scrubbing, exactly in Tangle/dragnum spirit. The deeper principle: don't build a side panel of watches; decorate the thing being read.
3. **One interaction grammar, taught once.** A small universal vocabulary ("anything coral is editable; every slider scrubs time") declared early in the book, honored by every instrument — instead of per-widget affordance invention. the book's version must be self-evident/affordanced rather than manual-dependent (we ban undiscoverable gestures), but the *uniformity contract* is the point.
4. **This is the strongest compiler evidence any reference offers.** Mathigon needs per-lesson bespoke components at its high end; Case is 100% bespoke. IDSA scaled to 670 pages and 22 chapters on a **small primitive set (cell/pill/node/table/knob) + one playback shell + per-algorithm state scripts** — a solo dev shipped it. That is precisely the project's "curated substrate + escape hatch" bet, running commercially. The substrate isn't a compromise; it's how you get volume — craft budget then concentrates on each unit's one hero moment.
5. **Recurring metadata gets a fixed iconized slot** (IDSA: Time/Memory complexity fields). The book's analog: reading time, sources, honesty notes — always the same visual slot, never prose asides.
6. **Curated-joke data.** Example inputs chosen for wit is warmth that costs zero honesty. Our corpora picks can carry charm the same way.
7. **The solution ladder** (brute-force before clever, same problem revisited) is a pacing idea *inside* free-roam — the book's gated beats already do this, but "same instrument, better algorithm, feel the difference" is a beat pattern worth using when the source teaches optimizations.

**Reject:**

1. **Paged free-roam container** — pacing is the book's soul; the page grows as you learn. (Also: no 16:9 lock; we're responsive web with a 40rem column.)
2. **Definition-first order** — the book inverts it, always.
3. **Framed "Visualization:" exhibit boxes** — print-idiom cards. The book's instruments are full citizens of the column, unframed.
4. **Right-click/manual-dependent grammar** — undiscoverable and touch-hostile. Every gesture in the book keeps its inline affordance or one-time hint.
5. **The embedded IDE + countdown timer** — interview-prep furniture for a different reader. The book's checks stay predict-and-reveal, inline blanks, sandboxes.
6. **`name:value` decoration density** — for our no-CS-background reader, full trace decoration would be noise; we show *one* value at the moment it matters (scrub-linked), not every binding.

**File away (defect lessons):**

- **Evaluator ledgers must visibly credit success** the instant it happens (IDSA's 0/15-while-passing scoreboard).
- **Embedded inputs must never swallow global navigation keys** (IDSA's editor focus trap vs our keyboard-for-everything rule).
- **Chrome that fades permanently is discoverability debt** (blobs/nav pill vs our persistent-but-quiet rail).
- **Comment-register inconsistency** (red script vs gray italic on different pages) — a register system only reads as a system if it never wavers; the book's hue/voice roles are absolute.

## Part 8 — Honest limits

Demo build only — the Strings chapter; tree/graph/heap chapters (richer spatial notations, presumably) unseen. Audio: no sound UI or affordances anywhere in 45 pages, but the VM session couldn't confirm actual silence electronically. The test-scoreboard oddity may be demo-build-specific. ↑/↓ keys (taught on the controls page) produced no visible effect on any page tested. Windows build inspected at file level only — no decompilation; all interaction findings are from live use.
