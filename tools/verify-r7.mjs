// verify-r7.mjs — round-7 adversarial check of the guessing-game page's embedded data:
// decode DATA.S (per spec §9.2) and require it to equal the stream rebuilt from the raw
// transcript; audit the shipped unigram/bigram/trigram tables against true corpus counts
// (exact counts, valid top-k); confirm generation is deterministic vs. reference rolls.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HTML = process.argv[2] ?? fileURLToPath(new URL("../book/language-modeling.html", import.meta.url));
const TRANSCRIPT = process.argv[3];
if (!TRANSCRIPT) {
  console.error("usage: node tools/verify-r7.mjs [page.html] <transcript.md>");
  console.error("note: the CS336 Lecture 1 transcript is not distributed with this repo (see README § Provenance).");
  process.exit(1);
}

const html = readFileSync(HTML, "utf8");
const m = html.match(/var DATA = (\{.*?\});\n/s);
const DATA = JSON.parse(m[1]);
const { W, U, B, T, S } = DATA;
const ID = {}; W.forEach((w, i) => (ID[w] = i));
console.log(`|W|=${W.length}  has S: ${typeof S === "string"}  S.length=${S ? S.length : 0}`);

// ---- decode DATA.S per spec §9.2 (my own decoder, not the page's) ----
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const AIDX = {}; [...ALPHA].forEach((c, i) => (AIDX[c] = i));
const decSent = [];
for (const chunk of S.split(".")) {
  if (chunk.length % 2) throw new Error("odd chunk length");
  const ids = [];
  for (let i = 0; i < chunk.length; i += 2) {
    const a = AIDX[chunk[i]], b = AIDX[chunk[i + 1]];
    if (a == null || b == null) throw new Error("bad char " + chunk.slice(i, i + 2));
    ids.push(64 * a + b);
  }
  if (ids.length) decSent.push(ids);
}
const decTok = decSent.reduce((n, s) => n + s.length, 0);
console.log(`decoded: sentences=${decSent.length} tokens=${decTok}`);

// ---- rebuild stream from raw transcript (build-notes §1 rules) ----
const raw = readFileSync(TRANSCRIPT, "utf8");
const text = raw.replace(/<!--[\s\S]*?-->/g, " ").replace(/\[[A-Z][A-Z ]+\]/g, " ").toLowerCase();
const WORD = /[a-z0-9]+(?:['’\-][a-z0-9]+)*/g;
const rebSent = [];
for (const s of text.split(/[.?!]+|\n{2,}/)) {
  const ws = (s.match(WORD) || []).map(w => w.replace(/’/g, "'"));
  if (ws.length) rebSent.push(ws.map(w => { if (!(w in ID)) throw new Error("oov " + w); return ID[w]; }));
}
console.log(`rebuilt: sentences=${rebSent.length} tokens=${rebSent.reduce((n, s) => n + s.length, 0)}`);

// ---- 1. exact stream equality ----
let streamOK = decSent.length === rebSent.length;
if (streamOK) for (let i = 0; i < rebSent.length; i++) {
  if (decSent[i].length !== rebSent[i].length || decSent[i].some((id, j) => id !== rebSent[i][j])) {
    streamOK = false; console.log(`  FIRST STREAM DIFF at sentence ${i}`); break;
  }
}
console.log(streamOK ? "STREAM: exact match (id-for-id, every sentence)" : "STREAM: MISMATCH");

// ---- 2. true corpus counts from the rebuilt stream ----
const uni = new Map(), bi = new Map(), tri = new Map();
for (const s of rebSent) {
  for (let i = 0; i < s.length; i++) {
    uni.set(s[i], (uni.get(s[i]) || 0) + 1);
    if (i + 1 < s.length) { const k = s[i] + "," + s[i + 1]; bi.set(k, (bi.get(k) || 0) + 1); }
    if (i + 2 < s.length) { const k = s[i] + "," + s[i + 1] + "," + s[i + 2]; tri.set(k, (tri.get(k) || 0) + 1); }
  }
}
// unigrams exact
let uBad = 0; for (let i = 0; i < W.length; i++) if ((uni.get(i) || 0) !== U[i]) uBad++;
console.log(uBad ? `U: ${uBad} MISMATCHES` : "U: all 1,729 counts exact");

// successor maps from true counts
const biSucc = new Map(), triSucc = new Map();
for (const [k, c] of bi) { const [a, b] = k.split(",").map(Number); if (!biSucc.has(a)) biSucc.set(a, []); biSucc.get(a).push([b, c]); }
for (const [k, c] of tri) { const p = k.split(",").map(Number); const ck = p[0] + "," + p[1]; if (!triSucc.has(ck)) triSucc.set(ck, []); triSucc.get(ck).push([p[2], c]); }

// B audit: counts exact; valid top-16 (kept min >= dropped max); context coverage
let bCtx = 0, bBadCount = 0, bBadTopK = 0, bMissingCtx = 0;
for (const [ctxStr, arr] of Object.entries(B)) {
  bCtx++;
  const ctx = Number(ctxStr);
  const truth = new Map((biSucc.get(ctx) || []).map(([w, c]) => [w, c]));
  const kept = []; for (let i = 0; i < arr.length; i += 2) kept.push([arr[i], arr[i + 1]]);
  for (const [w, c] of kept) if (truth.get(w) !== c) bBadCount++;
  const keptSet = new Set(kept.map(([w]) => w));
  const keptMin = Math.min(...kept.map(([, c]) => c));
  const droppedMax = Math.max(0, ...[...truth].filter(([w]) => !keptSet.has(w)).map(([, c]) => c));
  if (kept.length < Math.min(16, truth.size) || (kept.length === 16 && droppedMax > keptMin)) bBadTopK++;
}
for (const ctx of biSucc.keys()) if (!(ctx in B)) bMissingCtx++;
console.log(`B: contexts=${bCtx} badCounts=${bBadCount} badTopK=${bBadTopK} missingContexts=${bMissingCtx}`);

// T audit: contexts exactly those with total>=2; counts exact; valid top-6
let tCtx = 0, tBadCount = 0, tBadTopK = 0, tBadTotalRule = 0, tMissingCtx = 0;
for (const [ctxKey, arr] of Object.entries(T)) {
  tCtx++;
  const truth = new Map((triSucc.get(ctxKey) || []).map(([w, c]) => [w, c]));
  const total = [...truth.values()].reduce((a, b) => a + b, 0);
  if (total < 2) tBadTotalRule++;
  const kept = []; for (let i = 0; i < arr.length; i += 2) kept.push([arr[i], arr[i + 1]]);
  for (const [w, c] of kept) if (truth.get(w) !== c) tBadCount++;
  const keptSet = new Set(kept.map(([w]) => w));
  const keptMin = Math.min(...kept.map(([, c]) => c));
  const droppedMax = Math.max(0, ...[...truth].filter(([w]) => !keptSet.has(w)).map(([, c]) => c));
  if (kept.length < Math.min(6, truth.size) || (kept.length === 6 && droppedMax > keptMin)) tBadTopK++;
}
for (const [ctxKey, succ] of triSucc) {
  const total = succ.reduce((a, [, c]) => a + c, 0);
  if (total >= 2 && !(ctxKey in T)) tMissingCtx++;
}
console.log(`T: contexts=${tCtx} badCounts=${tBadCount} badTopK=${tBadTopK} totalRuleViolations=${tBadTotalRule} missingContexts=${tMissingCtx}`);

// ---- 3. generation determinism: page's exact generator over shipped tables ----
function biList(w) { const a = B[ID[w]]; if (!a) return []; const o = []; for (let i = 0; i < a.length; i += 2) o.push([W[a[i]], a[i + 1]]); return o; }
function triList(w1, w2) { const a = T[ID[w1] + "," + ID[w2]]; if (!a) return []; const o = []; for (let i = 0; i < a.length; i += 2) o.push([W[a[i]], a[i + 1]]); return o; }
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
// segmentation against DECODED DATA.S (what the page actually uses)
const pos = new Map();
decSent.forEach((s, si) => s.forEach((id, oi) => { if (!pos.has(id)) pos.set(id, []); pos.get(id).push([si, oi]); }));
function longestPrefix(rest) {
  let cands = pos.get(rest[0]) || []; if (!cands.length) return 1; let L = 1;
  while (L < rest.length) {
    const kept = [];
    for (const [si, oi] of cands) { const s = decSent[si]; if (oi + L < s.length && s[oi + L] === rest[L]) kept.push([si, oi]); }
    if (!kept.length) break; cands = kept; L++;
  }
  return L;
}
function segment(words) {
  const ids = words.map(w => ID[w]); const runs = []; let i = 0;
  while (i < ids.length) { const L = longestPrefix(ids.slice(i)); runs.push(words.slice(i, i + L)); i += L; }
  return runs;
}
const lcg = n => (Math.imul(n, 1664525) + 1013904223) >>> 0;
let r = 7; const chain = []; for (let i = 0; i < 5; i++) { r = lcg(r); chain.push(r); }
const first = gen(["language", "models"], 3, 16, chain[0]);
const runs1 = segment(first);
console.log(`first-click roll: ${runs1.map(x => x.join(" ")).join(" ‖ ")}`);
console.log(`lens: ${runs1.map(x => x.length).join(",")}  (expect 3,2,3,2,5,3)`);
for (const n of [3, 2, 1]) console.log(`memory ${n - 1}: runs=${segment(gen(["language", "models"], n, 16, chain[0])).length}  (expect ${({3:6,2:9,1:15})[n]})`);
