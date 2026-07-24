# Cast registry — "Language, from scratch"

This folder holds one standalone, static SVG per character who has appeared in the book so far, plus this registry describing them. Extracted **2026-07-24**.

## CANON RULE

**The unit pages remain the source of truth.** Every file in this folder is a dated snapshot for reference and reuse — not a second copy of canon. When a character changes on its canonical page (a new expression, a redrawn limb, a new held pose), **this folder must be regenerated** from that page, and the "born"/anchor lines below updated to point at the new location.

Characters are always **ported byte-identical** into new pages, never redrawn — per the `unit-page` skill's design principles ("Characters, not widgets") and its idiom-porting rule. If you are building a new unit page and it needs the machine or the blob, copy the geometry from here (or straight from the canonical page cited below — both are byte-identical as of this extraction) and re-derive the CSS from the target page's own tokens; do not eyeball-redraw a single curve.

---

## The little machine

**Role.** The book's protagonist — small, shy, and always trying to guess what comes next.

**Born.** "The guessing game" (`language-modeling.html`), 2026-07-23 — the book's true opening unit (per `book-plan.md`: language-modeling is sequenced before the BPE page). The base geometry (feet, antenna, bulb, body, brows, two eye whites, two pupils) shipped there with no eyelids.

**Canonical source (as of this extraction).** `book/the-bitter-lesson.html` — this is the most evolved drawing of the two pages that carry the machine (`language-modeling.html`'s copy is **stale**: its `machineSVG()` has no `m-lid` elements at all, and its idle loop flashes `think` instead of blinking because of it — do not port from that page).
- Geometry — `machineSVG()`, lines 574–587.
- CSS — the `.mch` block, lines 153–186 (header comment 153–156, rules 157–186).
- Idle-loop / expression helpers — `mExpr()` / `mReact()`, lines 588–589, immediately below the geometry factory.

**Anatomy note.** The per-eye lids (`m-lid`, one ellipse per eye, `cx` 22.5 / 37.5, `rx` 8, `ry` 9) were a later review-round addition on top of the language-modeling base geometry: "one lid per eye shaped like the eye" — never one slab across the face. Lid `transform-origin` is `center top` (lids close downward); at rest (`transform:scaleY(0)`) they are invisible and the eyes read as open.

**Expression vocabulary** (mutually exclusive; set by replacing the whole class list — `mExpr(el, cls)` → `el.className = "mch " + cls`):

| Class | What it does |
|---|---|
| `idle` | No modifier rule fires — base render: lids at `scaleY(0)` (open), brows hidden (`opacity:0`), eyes/pupils neutral. |
| `think` | Eye whites narrow (`scaleY(.62)`); brows appear (`opacity:1`). |
| `surprised` | Eye whites widen (`scale(1.28)`); pupils shrink (`scale(.72)`). |
| `settle` | Pupils nudge down (`translateY(1.2px)`); eye whites narrow slightly (`scaleY(.9)`). |
| `blink` | Lids close (`scaleY(1)`). |
| `nap` | Lids half-close (`scaleY(.5)` — dozing); pupils drop and shrink slightly. |

**Reaction vocabulary** (a reaction is a moment, not a state — `mReact(el, kind)` adds the class, then an unconditional `setTimeout` removes it 320ms later, landing back on whatever the current resting expression is):

| Class | What it does |
|---|---|
| `pop` | Squash-stretch bounce (`mchpop` keyframes, .3s). |
| `gasp` | Lift + stretch (`mchgasp` keyframes, .32s). |

**Speech.** `.mch-line` (flex row wrapper) + `.mch-say` (Patrick Hand hand-lettered aside, rotated −0.8°) — the machine's spoken asides ride beside it, not inside a speech bubble.

**Variants.**
- **`nap`** is a held expression (a CSS class swap on the existing geometry), not a separate drawing — there is no separate file for it. Added in the `the-bitter-lesson.html` author review round (2026-07-23) alongside the per-eye lids, for the page's waiting vignette.
- No other geometry variant exists yet (no alternate body/pose SVG).

**Character-specific rules.**
- The machine is **small and shy** — keep it modest in scale and placement wherever it appears; it does not compete for attention with the prose or the gold invitation marks.
- Byte blue (`--byte-fill`) is the machine's own fill; it does not borrow gold or vermilion.
- `the-little-machine.svg` in this folder renders the **idle** pose only (eyes open, lids at `scaleY(0)`) — every other expression/reaction is a CSS class swap on this same geometry, not a different file.

---

## The UNK blob

**Role.** The villain — a soft gray lump with two tired eyes that swallows any word the machine hasn't learned.

**Born.** "How a computer learns to read" (`bpe-north-star.html`), 2026-07-23 — built first, chronologically, as the book's design north star (design tokens and idioms were extracted from it into the skill/spec *after* it shipped), then placed as chapter 1's third reading-order unit. The author confirmed the character had landed as shared vocabulary.

**Canonical source.** `book/bpe-north-star.html`.
- Geometry + behavior — `buildUnkScene(host)`, lines 788–835; the blob's own subtree is the `<g id="sc-blob">` at lines 804–812 (lump path, two `blob-eye` ellipses, two pupil circles, tired-lid strokes, sad-mouth stroke, mono "UNK" name-tag text).
- CSS — `.blob-eye`, line 169 (`transform-box:fill-box; transform-origin:center;` — a hook for the scene's own JS-driven transforms; it sets no color itself).
- Wrapper styling when used as a cameo tile — `.ctile.unk`, lines 351–352 (background/border around the drawing; not part of the character's own geometry).

**Expression vocabulary.** Unlike the machine, the blob has no swappable CSS expression classes — its personality is baked permanently into the geometry: the heavy tired upper lids and the downturned mouth are drawn once, as a fixed expression, not toggled. Its one shipped "reaction" is scene-level, inside `buildUnkScene`'s own choreography: on the swallow beat, the blob group scales up to `1.08` and eases back to `1` over ~260ms — a single moment, not a persistent state. (`design/cover-contents-spec.md` §2 separately plans a slow sleepy blink and a squash-stretch reaction for the cover page; as of this extraction that behavior has not shipped into the blob's canonical page, so it is not represented here — flagged, not assumed.)

**Variants.**
- **`UNKMINI`** — a 30×26 miniature cameo drawing, same tired-eyed drawing language, lines 715–720. Used wrapped in a `.ctile.unk` tile (a rounded background chip) for the beat-8 three-way compare strip. Extracted here as its own file, `the-unk-blob-mini.svg`. It carries no "UNK" text label of its own — the tile wrapper's `aria-label` names it instead.
- No other geometry variant exists yet.

**Character-specific rules.**
- **Gray (`--gray` / `--gray-fill`) belongs to the blob alone** — no other character or UI element in the book uses gray.
- **The cover deliberately omits the blob's UNK name-tag** (`design/cover-contents-spec.md` §2): "the cover must carry no initialism the reader hasn't been taught; the blob is just the gray tired lump here." The canonical drawing (and this registry's `the-unk-blob.svg`, which preserves the full character) keeps the tag — omit the `<text>` element only on pages where the reader hasn't met "UNK" yet, per that precedent.

---

## Files in this folder

| File | Contents |
|---|---|
| `the-little-machine.svg` | The machine, idle pose, viewBox `0 0 60 56`. |
| `the-unk-blob.svg` | The canonical blob (lump + tired eyes + UNK tag), viewBox `296 26 104 110` (tight crop; the source's own `translate(300,20)` group transform is preserved rather than baked into the coordinates — see Verification). |
| `the-unk-blob-mini.svg` | The UNKMINI cameo drawing, viewBox `0 0 30 26` (as in source). |
| `README.md` | This registry. |

Each file is a self-contained `.svg` (valid XML, `xmlns` declared, one `<title>`, one embedded `<style>`) that renders correctly opened directly in a browser, with no external resources, no JS, and both a light default and a `@media (prefers-color-scheme: dark)` block using the book's exact token hex values.

**Deliberate, disclosed deviations from a literal full-tag copy** (geometry is untouched in all three; these are presentation/wrapper choices made so the files work *standalone*, and are called out here rather than silently folded in):
- The blob's source `<g id="sc-blob">` carries `style="opacity:0"` in `buildUnkScene` (its pre-reveal state, meant to be flipped to `1` by the scene's own JS timeline). A standalone file has no such JS, so that inline style is omitted here — otherwise the file would render blank. The `id="sc-blob"` and the `transform="translate(300,20)"` are both kept as-is.
- All three source instances carry `aria-hidden="true"` on their root `<svg>` (correct for decorative use inline in a page that already narrates the character in surrounding prose). Standalone reference files instead carry a `<title>` and no `aria-hidden`, so each file is independently identifiable to assistive tech when opened on its own.
- The machine's root `<svg>` additionally carries `class="mch idle"` and `overflow="visible"` — neither is present on `machineSVG()`'s own `<svg>` tag in source (there, `class="mch"` lives on a *wrapper* element the factory function is injected into, and `overflow:visible` comes from a `.mch svg{...}` rule that targets a *nested* svg inside that wrapper). Since this file's root **is** the svg, the class moved onto it so the copied `.mch .m-body` etc. descendant selectors keep matching, and `overflow:visible` was added directly so the antenna bulb (`cy=2.5, r=2.6`, top edge at `y=-0.1`) isn't clipped by the default SVG-root `overflow:hidden`.

None of these touch any geometry attribute (`d`/`cx`/`cy`/`r`/`rx`/`ry`/`x`/`y`/`points`) or class name on the character's own elements — see Verification below for the exact diff that confirms this.

---

## Verification (2026-07-24)

Self-verified headlessly (no browser) with a Node script that re-derives the canonical markup **fresh from the two source `.html` files on disk** — by tokenizing the JS string-literal concatenation in `machineSVG()`, the `sc-blob` subtree inside `buildUnkScene()`, and the `UNKMINI` variable — rather than trusting any transcription, then diffs geometry-attribute and class-name multisets against the three delivered SVGs.

**Checksums:**

| File | MD5 |
|---|---|
| `the-little-machine.svg` | `d94f6086d3334c225191f4d2e2916150` |
| `the-unk-blob.svg` | `df3a9d926c281860cbafc200d391fc17` |
| `the-unk-blob-mini.svg` | `cd92513e1566be447f009361cbfbdc22` |

**Per-check results:**

1. **Geometry multiset diff** (`d`, `cx`, `cy`, `r`, `rx`, `ry`, `x`, `y`, `points`), source vs. delivered file — **exact match, zero differences**, for all three:
   - `the-bitter-lesson.html`'s `machineSVG()` (29 geometry attributes) vs. `the-little-machine.svg` (29) — match.
   - `bpe-north-star.html`'s `sc-blob` subtree (19 geometry attributes) vs. `the-unk-blob.svg` (19) — match.
   - `bpe-north-star.html`'s `UNKMINI` (17 geometry attributes) vs. `the-unk-blob-mini.svg` (17) — match.
2. **Class-name multiset diff** — exact match: the machine's 11 element class attributes (`m-foot`, `m-antenna`, `m-bulb`, `m-body`, `m-brow`, `m-eyew`×2, `m-pupil`×2, `m-lid`×2) and the blob's 2 (`blob-eye`×2) all present, unchanged, nothing added or dropped.
3. **XML well-formedness** — all three files pass a manual tag-balance / single-root / no-stray-`&` check (Node has no built-in `DOMParser`, confirmed by probing `typeof DOMParser` first; a manual well-formedness walk was used instead, as the task allows).
4. **Hex-color provenance** — every hex literal used in each file's embedded `<style>` (6 in the machine file, 8 in the blob file, 6 in the mini file — light + dark values of whichever of `--ground` / `--ink` / `--byte-fill` / `--gray` / `--gray-fill` each character actually uses) was checked for verbatim presence in the relevant source page's `:root` / dark-`:root` token blocks (`the-bitter-lesson.html` lines 22–39 for the machine; `bpe-north-star.html` lines 19–36 for the blob and mini). All confirmed present, none guessed.

Nothing in this extraction came back unverifiable; everything above is a positive, checked result, not an assumption.
