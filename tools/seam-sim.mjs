// seam-sim.mjs — validates the guessing-game "babble seam" design:
// rebuild the word stream from the raw transcript with the page's exact rules,
// cross-check it against the shipped DATA tables, replay the page's seeded rolls,
// and segment each roll into maximal runs that occur verbatim within one sentence.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HTML = process.argv[2] ?? fileURLToPath(new URL("../book/language-modeling.html", import.meta.url));
const TRANSCRIPT = process.argv[3];
if (!TRANSCRIPT) {
  console.error("usage: node tools/seam-sim.mjs [page.html] <transcript.md>");
  console.error("note: the CS336 Lecture 1 transcript is not distributed with this repo (see README § Provenance).");
  process.exit(1);
}

// ---- 1. shipped DATA ----
const html = readFileSync(HTML, "utf8");
const m = html.match(/var DATA = (\{.*?\});\n/s);
if (!m) throw new Error("DATA not found");
const DATA = JSON.parse(m[1]);
const W = DATA.W, U = DATA.U, B = DATA.B, T = DATA.T;
const ID = {}; W.forEach((w, i) => (ID[w] = i));
console.log(`shipped: |W|=${W.length}`);

// ---- 2. rebuild stream from transcript (build-notes §1 rules) ----
const raw = readFileSync(TRANSCRIPT, "utf8");
const text = raw
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/\[[A-Z][A-Z ]+\]/g, " ")
  .toLowerCase();
const sentencesRaw = text.split(/[.?!]+|\n{2,}/);
const WORD = /[a-z0-9]+(?:['’\-][a-z0-9]+)*/g;
const sentences = []; // arrays of word ids
let total = 0;
const uniCount = new Map();
for (const s of sentencesRaw) {
  const ws = (s.match(WORD) || []).map(w => w.replace(/’/g, "'"));
  if (!ws.length) continue;
  for (const w of ws) uniCount.set(w, (uniCount.get(w) || 0) + 1);
  total += ws.length;
  sentences.push(ws);
}
console.log(`rebuilt: tokens=${total} vocab=${uniCount.size} sentences=${sentences.length}`);

// cross-check vocab + unigram counts against shipped W/U
let mismatch = 0;
for (let i = 0; i < W.length; i++) {
  if ((uniCount.get(W[i]) || 0) !== U[i]) { mismatch++; if (mismatch < 6) console.log(`  unigram mismatch: ${W[i]} shipped=${U[i]} rebuilt=${uniCount.get(W[i]) || 0}`); }
}
console.log(mismatch ? `UNIGRAM MISMATCHES: ${mismatch}` : "unigram counts: exact match");

// id-encode sentences (drop words not in W — should be none)
const sentIds = sentences.map(ws => ws.map(w => { if (!(w in ID)) throw new Error("oov " + w); return ID[w]; }));

// ---- 3. page's generator, replicated exactly ----
function biList(w) { const a = B[ID[w]]; if (!a) return []; const o = []; for (let i = 0; i < a.length; i += 2) o.push([W[a[i]], a[i + 1]]); return o; }
function triList(w1, w2) { const i1 = ID[w1], i2 = ID[w2]; if (i1 == null || i2 == null) return []; const a = T[i1 + "," + i2]; if (!a) return []; const o = []; for (let i = 0; i < a.length; i += 2) o.push([W[a[i]], a[i + 1]]); return o; }
function uniTop(k) { const o = []; for (let i = 0; i < W.length; i++) o.push([W[i], U[i]]); return o.slice(0, k); }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function sample(list, rng) { let tot = 0; for (const e of list) tot += e[1]; let r = rng() * tot; for (const e of list) { r -= e[1]; if (r < 0) return e[0]; } return list[list.length - 1][0]; }
function gen(startWords, n, len, seed) {
  const rng = mulberry32(seed), out = startWords.slice();
  for (let i = 0; i < len; i++) {
    const a = out[out.length - 2], b = out[out.length - 1]; let list = null;
    if (n >= 3 && a != null) { const t = triList(a, b); if (t.length) list = t; }
    if (!list && n >= 2 && b != null) { const bl = biList(b); if (bl.length) list = bl; }
    if (!list) list = uniTop(60);
    out.push(sample(list, rng));
  }
  return out;
}

// ---- 4. greedy longest-prefix segmentation (within a single sentence) ----
// positions index: id -> [sentence, offset]
const pos = new Map();
sentIds.forEach((s, si) => s.forEach((id, oi) => { if (!pos.has(id)) pos.set(id, []); pos.get(id).push([si, oi]); }));
function longestPrefix(idsRest) {
  // returns max L>=1 such that idsRest[0..L-1] occurs contiguously in one sentence
  let cands = pos.get(idsRest[0]) || [];
  if (!cands.length) return 1; // single unseen word can't happen (vocab = corpus), but guard
  let L = 1;
  while (L < idsRest.length) {
    const next = idsRest[L];
    const kept = [];
    for (const [si, oi] of cands) {
      const s = sentIds[si];
      if (oi + L < s.length && s[oi + L] === next) kept.push([si, oi]);
    }
    if (!kept.length) break;
    cands = kept; L++;
  }
  return L;
}
function segment(words) {
  const ids = words.map(w => ID[w]);
  const runs = []; let i = 0;
  while (i < ids.length) { const L = longestPrefix(ids.slice(i)); runs.push(words.slice(i, i + L)); i += L; }
  return runs;
}
const show = runs => runs.map(r => r.join(" ")).join("  ‖  ");

// ---- 5. replay the page's actual seed chain ----
const SEEDS = [["language", "models"], ["the", "transformer"], ["neural", "machine"]];
const lcg = n => (Math.imul(n, 1664525) + 1013904223) >>> 0;
let chain = [], r = 7;
for (let i = 0; i < 200; i++) { r = lcg(r); chain.push(r); }

for (const seed of SEEDS) {
  console.log(`\n=== seed: "${seed.join(" ")}" — first 5 rolls of the page's chain (n=3, 16 words) ===`);
  for (let k = 0; k < 5; k++) {
    const words = gen(seed, 3, 16, chain[k]);
    const runs = segment(words);
    const firstSeamWord = runs[0].length; // 0-indexed word where run 2 starts
    console.log(` roll#${k + 1} seed=${chain[k]}\n   ${show(runs)}\n   runs=${runs.length} (lens ${runs.map(x => x.length).join(",")}) first-seam after word ${firstSeamWord} of ${words.length}`);
  }
}

// beat 5 view: same roll at memory 2/1/0 (n=3/2/1)
console.log(`\n=== beat 5: first roll of "language models" at memory 2 / 1 / 0 ===`);
for (const n of [3, 2, 1]) {
  const words = gen(["language", "models"], n, 16, chain[0]);
  const runs = segment(words);
  console.log(` n=${n}: ${show(runs)}\n   runs=${runs.length} (lens ${runs.map(x => x.length).join(",")})`);
}

// ---- 6. stats over 60 rolls per seed ----
console.log(`\n=== stats over 60 chain rolls per seed (n=3) ===`);
for (const seed of SEEDS) {
  let zero = 0, seamCounts = [], firstSeam = [];
  for (let k = 0; k < 60; k++) {
    const runs = segment(gen(seed, 3, 16, chain[k]));
    if (runs.length === 1) zero++;
    seamCounts.push(runs.length - 1);
    if (runs.length > 1) firstSeam.push(runs[0].length);
  }
  const avg = a => (a.reduce((x, y) => x + y, 0) / (a.length || 1)).toFixed(1);
  console.log(` "${seed.join(" ")}": zero-seam ${zero}/60 · seams avg ${avg(seamCounts)} (max ${Math.max(...seamCounts)}) · first seam after avg ${avg(firstSeam)} words`);
}

// ---- 7. stream size estimate for embedding ----
const nTok = total + sentences.length; // words + one sentinel per sentence
console.log(`\nstream symbols (words + sentence sentinels): ${nTok} → 2-char encoding ≈ ${(nTok * 2 / 1024).toFixed(1)} KB`);
