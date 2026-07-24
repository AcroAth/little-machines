# Build notes — the cover and the contents page ("Language, from scratch")

*Builder pass, 2026-07-24. Deliverables: `book/cover.html`, `book/contents.html`. Spec: `design/cover-contents-spec.md`. All rules in the `unit-page` skill applied except the unit-only ones the spec waives (no gating/beats/goals/rail/reveal-all/frontier-cue).*

---

## ⚠️ READ FIRST — what could NOT be verified headlessly (flagged loudly)

Per the brief, all verification was headless (Node parsing/greps/md5s + reasoned analysis). **No browser was used at any point.** The following therefore rest on code inspection + reasoning, NOT on rendered observation, and must be confirmed in the live adversarial review pass:

1. **Live interaction (gate 7).** That mouse click, touch tap, and keyboard Enter/Space each actually fire the machine/blob reactions; that the gold `:focus-visible` ring paints on the enter mark and both characters; that the `aria-live` region announces each aside once (no double-speak, no trap). Code structure is correct (native `<a>`; `role=button`+`tabindex=0`+`keydown` with exact `"Enter"`/`" "`; one `aria-live=polite` region; visible asides `aria-hidden`). Behavior not observed.
2. **Pixel layout (gate 8).** No character/text overlap at 320/375/768/1280/1600 and "enter above the fold" at 1280×800 and 375×812. Reasoned from a **vertical-banding** scheme (blob 3–23% · title 27–56% · machine 68–78% · whisper 84–93%, so bands never collide regardless of horizontal position), plus a ≤480px media query moving blob/machine to opposite corners. **Not measured** — there is no layout engine headless. The transient asides (shown only on activation) sit near their characters; their exact non-overlap with the title at every width is the least-certain item and should be eyeballed.
3. **Runtime console + ambient rendering (gate 10).** Both `<script>` blocks compile clean (`vm.Script`), but runtime console-cleanliness through load + poking every element needs a DOM. Also unobserved: the CSS-only ambient life — blob breathing/blink (`transform-box:fill-box` on a `<g>`/ellipse), the enter-mark wiggle + `stroke-dashoffset` redraw, the `preserveAspectRatio="none"` ellipse's stroke-width look, and the cue-dot breathing. All present and correct by inspection; visual quality unconfirmed.

Everything else below is mechanically verified (deterministic Node checks). **Verifier result: 105 checks PASS, 0 FAIL, 3 browser-only flags.**

---

## Spec correction applied (mid-build)

The machine was re-pointed from `language-modeling.html` to **`the-bitter-lesson.html`** per the coordinator's correction. Confirmed and applied:
- `machineSVG()` ported byte-identical from TBL (~574–587) — the **lidded** variant with the two per-eye `m-lid` ellipses (`cx=22.5/37.5 cy=30 rx=8 ry=9`); md5 checked against TBL, not LM.
- `.mch` CSS block ported byte-identical from TBL (~157–186), including `m-lid` `transform-origin:center top` (lids close downward — TBL's correction), and the `nap`/`blink`/`think`/`surprised`/`settle` expressions + `pop`/`gasp` reactions.
- Idle life uses **LM's interval idiom** (~4.2s, random half of idle machines, short flash) but toggles **`blink`** (150ms) so the ported lids actually close — NOT LM's `think`-flash workaround (LM flashes `think` only because its machine has no lids; that mismatch is not reproduced here).

---

## Per-gate results (spec §6)

### Gate 1 — DNA identity ✅
- `@font-face` (Patrick Hand data-URI) **byte-identical** to `language-modeling.html`. md5 `77b03d195982bde9424e2c693a9df817` (identical in both deliverables and the source).
- The four palette token blocks (`:root` + dark media + `[data-theme]`×2) **byte-identical** to `language-modeling.html`. md5 `a13f996bfb2c0244141c39383149754e`.
- `--gray`/`--gray-fill` byte-identical to `bpe-north-star.html`'s: light `--gray:#9C968E; --gray-fill:#E7E3DC;`, dark `--gray:#8A857D; --gray-fill:#2A2620;` (LM's values already equal BPE's, so copying LM's token block satisfies both).
- Method: the font-face + token + machine blocks were **extracted programmatically from the sources and injected** (never retyped); byte-identity is guaranteed by construction and re-confirmed by md5 diff.

### Gate 2 — Cast identity ✅
- `machineSVG()` **byte-identical** to `the-bitter-lesson.html`'s lidded variant. md5 `edc974f9cbf6737a10663c58b8151b91`. Two `m-lid` ellipses present.
- `.mch` CSS block **byte-identical** to TBL's. md5 `2083cf47021ddb714f6c946676be5b88`. `m-lid transform-origin:center top` confirmed.
- Blob geometry **byte-identical** to `bpe-north-star.html` beat-2 (`buildUnkScene`): the gray lump `d`, both eye ellipses (`cx 38/62 cy 42 rx 5.5 ry 6`), both pupils (`cx 38/62 cy 44 r 2`), the tired-lid path, and the sad-mouth path all match byte-for-byte. **The mono "UNK" `<text>` label is omitted** (deliberate — the cover carries no untaught initialism; verified `<text>`-count = 0 and the string "UNK" appears **nowhere** in the file, including comments).
- Fix-history ported: `mReact` self-clears its reaction class at **320ms** (a moment, not a state); the cover machine is **never `mExpr`'d**, so its resting pose (`idle`+`look-in`) is never wiped; the document-level **`animationend` cleanup listener** (removes `reveal-anim`/`fade-in`/`cue-in` and clears inline `animationDelay` on `rise`/`fadeReveal` end) is ported verbatim into **both** files.

### Gate 3 — Anti-slop ✅
No cards / borders-around-prose / stat tiles / pill chips / numbered kickers / default-styled controls (`<button>`/`<input>`/`<select>`/`<textarea>` = 0) / emoji / hero gradients. No `href="#"`. `enter` is a real `<a>` wrapping a hand-drawn SVG ellipse `<path pathLength="100">` (not a rounded-rect button). Stray-hue sweep: `var(--green)` unused in both files (green absent); `var(--gray*)` used **only** on the cover blob and **not at all** on contents (gray belongs to the blob alone).

### Gate 4 — Locked strings ✅
- Three titles byte-exact in link position (`>The guessing game</a>`, `>Bigger or cleverer?</a>`, `>How a computer learns to read</a>`).
- Three unit-page hrefs byte-exact, each exactly once.
- Three descriptions byte-exact (extracted from the spec and compared, no hand-transcription).
- Times `~12 / ~7 / ~12 min` (two `~12 min`, one `~7 min`).
- `__CONTENTS_URL__` appears **exactly once** in `cover.html`, in `href=` position; `__COVER_URL__` **exactly once** in `contents.html`, in `href=` position; no cross-contamination.

### Gate 5 — Honesty / fidelity ✅
Every factual sentence traces to `book-plan.md` (arithmetic recomputed in the verifier). Claim→anchor table:

| Claim (page) | Anchor |
|---|---|
| "Chapter one is open" (contents) | book-plan ch1 (L01) anchors language-modeling · the-bitter-lesson · byte-pair-encoding; all three pages exist |
| "one chapter per lecture" | book-plan.md line 3: chapters follow CS336 lecture order L01–L18 |
| "Stanford's CS336 course" | book-plan.md line 3; matches units' own usage (language-modeling foot: "the Stanford CS336 opening") |
| "Seventeen more chapters follow" | book-plan lists **18** chapters (verifier counted 18); 18 − chapter one = 17 |
| "two pages are still being written here" (gap 1) | the **two** ch1 concepts between the-bitter-lesson and byte-pair-encoding: **compute-efficiency + tokenization** |
| "…and two more to close the chapter" (gap 2) | the **two** ch1 concepts after byte-pair-encoding: **transformer + scaling-laws** |
| Description 1 ("guess what comes next; a machine that read one lecture") | language-modeling.html = the guessing game; its machine read one lecture (CS336 opening) |
| Description 2 ("rumor… just got bigger; grab both levers") | the-bitter-lesson.html = scale-vs-cleverness with levers |
| Description 3 ("cold numbers fuse into warm words; first vocabulary") | bpe-north-star.html = byte-pair encoding merging bytes into tokens |

No invented chapter titles, years, names, or numbers. **One honesty caveat:** the `~N min` reading times are the spec's locked estimates (conventional, not measured); reproduced byte-exact, not independently derivable by the builder. The cover asserts nothing factual — its two asides ("it guesses what comes next" / "it swallows what it doesn't know") are the book's own character devices, consistent with the units they belong to.

### Gate 6 — Jargon sweep ✅
Reader-visible text (tags/style/script stripped) scanned for all-caps initialisms and terms of art.
- **Cover**: zero all-caps initialisms; free of "UNK", "token", "language model", "model", "vector", "neural". Names nothing technical (spec voice rule).
- **Contents**: zero unglossed all-caps initialisms. The only all-caps token is **CS336**, and it appears **only** as glossed provenance ("Stanford's CS336 course") — the skill permits source provenance. No other terms of art.

### Gate 7 — Interaction structure ✅ (live behavior flagged, see top)
Enter = native `<a href target=_top rel=noopener>`. Both characters: `role=button`+`tabindex=0`+descriptive `aria-label`+`keydown` handling exact `"Enter"`/`" "` (Space `preventDefault`'d to stop scroll). One `aria-live=polite` region mirrors both asides; visible asides are `aria-hidden` (no double-announce). Contents' decorative machine is `aria-hidden`, handler-free. Every `_top` link carries `rel=noopener`. **No `pointerdown`+`preventDefault` is used** — activation is via `click`+`keydown`, so native focus-on-click is preserved and the focus-suppression footgun (the ported fix) never arises.

### Gate 8 — Layout ⚠️ flagged (reasoned, not measured) — see top.

### Gate 9 — Motion ✅
Full reduced-motion path: on-load fades → instant (`.reduced .fade-in{ animation:none }`), enter wiggle off + static gold underline substituted, ellipse redraw off, blob breathing/blink/squish off, cue dots static, machine transitions/reactions off (from TBL's `.reduced .mch*`), `mReact` early-returns under `REDUCED`, idle-blink loop gated `if(!REDUCED)`, asides skip fade. On-load entrance total = **880ms** (max inline stagger .48s + .4s fade) ≤ 900ms. Character reactions ≤ 320ms (`mchpop .3s`, `mchgasp .32s`, `blobSquish .32s`). Ambient loops (enter wiggle 4s, blob breath 5s, blob blink 7s, cue dots 2.8s) are persistent idle life, not on-load entrances.

### Gate 10 — Engineering ✅ (console flagged, see top)
`<meta charset="utf-8">` is line 1 in both; exactly one `<style>` + one `<script>`; no doctype/html/head/body; cover **50KB**, contents **45KB** (≤300KB); no external `url()` (font is `url(data:)`), no `http://`, no `<link>`/`<script src>`/`@import`; https limited to the 3 unit-page hrefs (contents) / none (cover). Both scripts compile without syntax error. No RNG needed for content (Math.random only jitters blink timing — non-generative).

### Gate 11 — Feel check (honest)
- **Cover** — *does it read as a book's front door with two small residents, quiet and a little empty on purpose?* I believe **yes, structurally**: a centered title + one promise line + a hand-drawn gold "enter" ellipse, the little machine glancing up toward the door from the lower-left, the tired gray blob looking off-page from the upper-right, and a hand-lettered whisper about the unwritten cast in the lower-right — with a wide plain ground between them that is the composition, not a gap to fill. No dashboard grammar; one gold invitation. The two characters carry the warmth. *Honest caveat:* whether the emptiness reads as "intentional" vs "unfinished," and whether the ellipse wraps the word cleanly, is exactly the kind of judgment I cannot make headlessly — it needs eyes.
- **Contents** — *does it read as a living manuscript's index, not a link list?* I believe **yes**: one quiet 40rem column, prose entries (underlined title + one ink2 description + reading time, no boxes/numbers), the "Chapter one" machine at home, and — the part that makes it a *manuscript* — the two hand-lettered gap notes standing in for the unwritten pages ("two pages are still being written here…" with breathing dots; "…and two more to close the chapter."), plus the single "start here" gold arrow. It should feel in-progress and hand-kept, not like a dashboard of links.

---

## Arrow-geometry audit (skill rule) ✅
The "start here" mark's drawn arrow: shaft ends **4.57px** short of the apex (want 4–5px); barb clearance from the shaft centerline **b1=3.22px, b2=3.26px** (want ≥2px); head is two barbs meeting at the apex. Computed in Node from the shipped path data.

---

## Deviations & reconciliations (flagged for the design lead's judgment)

1. **"Exactly one gold mark" vs the gap-note gold dots (contents).** Spec §4 calls "start here" "the page's single gold mark" *and* separately specifies gold breathing dots on gap-note 1. I resolved this by reading **"gold mark" = the single hand-lettered gold *annotation*** (start here + its drawn arrow), while the three breathing dots are the book's **whisper-register continuation idiom** (the frontier-cue dots — ink words, gold dots only), which is a distinct role, not a "mark." This matches the skill's "one hand-lettered register per role — annotations own loud gold, the page-edge cue speaks in ink [with gold dots]." Both were built exactly as the detailed spec instructs. **If the design lead wants literally one gold element at rest, the gap-note dots would need to go ink2** — flagging for the call.
2. **Blob aside styled ink2, not gold.** Spec §3 says the blob gives an "aside"; I rendered it in the ink2 `.mch-say`/`.blob-say` speech register rather than the DNA's gold `.aside` class, to honor spec §1 "**Gold = touch invitation ONLY**." The machine's `.mch-say` is already ink2; the blob now matches. No gold speech anywhere.
3. **`.reduced .fade-in{ animation:none }` (mine) instead of the DNA's `.reduced .fade-in{ animation-duration:.32s }`.** The DNA still *fades* under reduced motion; spec §3/§4 require these on-load **decorations** to be simply visible (instant) under reduced motion, so I wrote the no-animation rule. Intentional, spec-mandated.
4. **Pupil glances are CSS, not geometry.** The machine's "look toward the door" (`.mch.look-in .m-pupil` translate) and the blob's "gaze off-page" (`.blob-pupil` translate) are CSS transforms layered over byte-identical `machineSVG()`/blob geometry — required to keep gate 2's byte-identity while still directing the characters' attention per spec §3. Class attributes were added to the blob's pupil `<circle>`s (needed for the selector); this does not change any geometry attribute (`d`/`cx`/`cy`/`r`/`rx`/`ry`), which the verifier confirms byte-identical.
5. **Blob sleepy blink = eye-white `scaleY` squash** (the spec-sanctioned "eye-squash" option), ~210ms every 7s, distinct from the machine's brisk lid-blink. The pupils (separate 2px dots) stay put during the squash — the same idiom as the machine's `think`/`blink` where pupils are independent of the eye element. Minor, and faithful to the ported drawing.

---

## Build method note
Verbatim DNA blocks (`@font-face`, token blocks, `.mch` CSS, `machineSVG`+`mExpr`+`mReact`, the `animationend` listener) were **extracted from the read-only sources by a Node build script and injected into placeholders** — never retyped — so byte-identity holds by construction. The idle-blink loop and the blob assembly (which must drop the UNK text and add animation hooks) were authored, then their geometry verified byte-identical to source. A separate Node verifier re-checked all 11 gates + the arrow audit. Build/verify scripts lived outside the tracked design tree and were removed after. Only the three deliverables were written; the three existing pages were read-only.

---

## Adversarial review round 1 (2026-07-24, same day) — 1 defect found+fixed; 1 platform finding

**Review:** full code read of both files + live pass (served locally). Interaction, focus ring, and SR announcement verified by OUTCOME (the `#srlive` region carried the machine's aside after keyboard Enter — test-tool latency exceeds the 4s aside lifetime, so screenshots alone were misleading). Console clean on both pages through load + all interactions. Both themes screenshot-verified. Reduced-motion CSS state verified by class injection (static gold underline under `enter`, static dots). Contents hover→gold verified. Layout verified NUMERICALLY (getBoundingClientRect + pairwise intersection, asides visible) at 320×700, 375×812, 1280×800, 1600×900 — the test environment's screenshots at emulated desktop sizes render into a corner and cannot be trusted for layout.

**Defect (fixed in place):** the blob's aside was positioned BELOW the blob (`top:76px` / mobile `top:58px`) — a fixed offset that escapes the blob's percentage band, colliding with the title at ≤480px widths and at short viewports generally (probed at 320×700: aside bottom 143 vs title top 105). Fix: the aside now sits BESIDE the blob at all widths (`right:calc(100% + 10px); top:6px`, mobile `max-width:56vw`), speaking inward — symmetric with the machine's aside grammar. Re-verified: zero overlaps at all four probe sizes with both asides visible. **Rule earned: a character's speech anchors beside its speaker, inside the speaker's own layout band; fixed below-offsets break at short viewports.**

**Platform finding (the spec §5 contingency was insufficient):** the preview environment used during development sandboxed the page in an iframe with no popup/top-navigation permissions. Cross-page links were therefore INERT there: `target="_top"` and `target="_blank"` were BOTH blocked (verified with real clicks in a real Chrome session). The links stay as `target="_blank"` + `rel="noopener"`: correct semantics as raw local files and on the real host, and they self-heal if a future preview environment loosens the sandbox. **Book-level click-through navigation ships with the book's real host; on GitHub Pages the contents page is the map and every unit page is a direct link.**

**Shipped (stable identity, favicons pinned):**
- Cover 📖 (label `round-1-blank-nav`)
- Contents 🗺️ (label `round-1-blank-nav`)
- Cross-links substituted into both files once the real destinations were known; placeholders gone.

---

## Author round 2 (2026-07-24) — the notebook objective: reframing cover + contents

The author clarified the project's objective: **"a very nicely decorated notebook for things that I learn"** — not limited to CS336; course names must not be over-emphasized in titles, headings, etc. Two surfaces changed (direct fix, round-5 precedent); unit pages left alone (they keep CS336 solely in Sources blocks + LM's honesty-contract corpus footer — provenance, not branding).

### Contents — three course-identity strings removed

1. Intro: "Chapter one is open. The rest follows the course this book is built from, one chapter per lecture, opening as it's written." → **"Chapter one is open; the rest is on its way."**
2. Beyond: "**Seventeen** more chapters follow — …" → "**More** chapters follow — …" (never pin reader-facing structure to a source's syllabus shape; stays true under re-planning and added sources).
3. Footer: "The book's spine is Stanford's CS336 course — one chapter per lecture." → **"Every page names its sources."** (provenance moves to where it lives — each unit's Sources block).

Gate-5 bookkeeping: the round-1 claim→anchor rows for "one chapter per lecture" / "Stanford's CS336" / "Seventeen more chapters" are retired with their strings; "More chapters follow" anchors to book-plan (18 planned, 1 open). Verified live on the Edit-hook file tab: all three new strings render, console clean. The test environment wasn't compositing screenshots — copy-only change with zero layout/geometry delta, so no visual gate needed. Shipped for review, label `round-2-notebook-framing` 🗺️.

### Cover — notebook-over-book, titled "little machines" (placeholder)

The cover carried no course *text* (its title names the subject, not the course), but as the whole front door it made **"Language, from scratch"** the notebook's entire identity — over-emphasizing the language-model topic for a notebook meant to hold everything the author learns. Reframed **notebook-over-book**: the cover is now the notebook's door; "Language, from scratch" is demoted to a book *inside* it (it still titles the contents page and the unit eyebrows — only the cover changed).

Final copy (author-directed): title **"little machines"** (the repo name, used as a **placeholder** notebook title — explicitly not final), tagline **"a touchable notebook for the things I'm learning"**. "touchable" carries the old promise's "pages you can touch" (the interactive nature) into one line. "Language, from scratch" no longer appears on the cover.

*Intermediate approach, reverted:* first tried an eyebrow "a notebook for the things I'm learning" *above* a kept "Language, from scratch" title; the author redirected to putting the notebook title itself up top. The eyebrow had added ~33px to the top-anchored title block and dented the cover's **vertical-banding** robustness at short desktop viewports (1280×660: title block dipped −14px into the machine's band — horizontally clear, machine bottom-left vs centered content, so no *visual* collision, but the banding guarantee broke), which had needed three margin trims to fix. The final design **reverts all of that**: no eyebrow, CSS margins back to the round-1 originals, one shorter (one-line) title — so the block is now *shorter* than the verified round-1 baseline and the banding concern is gone by construction.

Verification (final): title/tagline render correctly (page-text extraction: "little machines" + tagline); console clean; layout at **1280×660** = **105px** title→machine clearance (vs +4px with the eyebrow), no overlaps; **375×812** safe by construction (shorter block than the eyebrow stage's 229px-clear mobile measurement). Screenshots uncompositable this session (the compositor was not displaying frames) → visual look rests on numeric verification + the author's pass, per the skill's compositing-fallback rule. Shipped for review, label `round-2-notebook-framing` 📖; page title set to "little machines — cover".

**Repo copy trails:** `book/cover.html` + `book/contents.html` on the public site (github.com/AcroAth/little-machines) still show pre-round-2 text; folded into this same commit (re-export below).
