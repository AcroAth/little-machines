# Book plan — "Language, from scratch"

*2026-07-23. Author decision: **the book's contents are sequential to the source video list** — chapters follow CS336's lecture order (L01–L18); no invented curriculum. This generalizes as a project principle: a book's spine is its source's own order (course → lectures; book sources → chapters). Within a chapter, units are ordered by first-citation timestamp in the lecture (refinement pass pending — timestamps live in each concept page's citations).*

*Objective note (the author, 2026-07-24): the project is a decorated notebook of everything the author learns — not limited to CS336. The lecture-order spine is internal organization only; reader-facing surfaces never name the course or pin structure to its shape (rule in the `unit-page` skill). Future non-CS336 sources join as new chapters/books.*

**Placement rule:** a concept anchors at its **first** source lecture; later lectures that deepen it become "revisited in chapter N" cross-references (not duplicate lessons).

**Status note:** chapter 1's BPE unit exists (the north star). Strict sequence puts a few L01 units *before* it (course framing, language modeling); the page's "chapter one" eyebrow stays correct.

## Table of contents (chapter = lecture; units = concepts anchored there)

1. **Ch 1 · L01** — language-modeling · the-bitter-lesson · compute-efficiency (the CS336 mindset) · tokenization · **byte-pair-encoding ← BUILT** · transformer (overview) · scaling-laws (intro; deepened ch 9/11/13)
2. **Ch 2 · L02** — einops · training-resource-accounting · numerical-precision · roofline-analysis
3. **Ch 3 · L03** — pre-norm-vs-post-norm · rmsnorm · gated-linear-units · rotary-position-embeddings · transformer-hyperparameters · training-stability · attention-variants (MQA/GQA/MLA)
4. **Ch 4 · L04** — mixture-of-experts · moe-routing-and-load-balancing · indexed-sparse-attention · linear-attention-and-state-space-models
5. **Ch 5 · L05** — gpu-execution-model · gpu-kernel-optimization · flash-attention
6. **Ch 6 · L06** — triton-kernel-programming · gpu-performance-measurement
7. **Ch 7 · L07** — distributed-training-interconnects · distributed-collective-operations · data-parallel-training · tensor-parallelism · pipeline-parallelism
8. **Ch 8 · L08** — sharded-data-parallelism (ZeRO/FSDP) · sequence-and-context-parallelism · multidimensional-parallelism
9. **Ch 9 · L09** — critical-batch-size · scaling-law-experimental-design
10. **Ch 10 · L10** — language-model-inference · kv-cache · continuous-batching-and-paged-attention · speculative-decoding · model-compression-for-inference
11. **Ch 11 · L11** — maximal-update-parameterization (muP) · muon-optimizer · warmup-stable-decay-learning-rate
12. **Ch 12 · L12** — language-model-evaluation · perplexity-evaluation · benchmark-validity-and-contamination · open-ended-response-evaluation · agent-benchmarking
13. **Ch 13 · L13** — pretraining-data-provenance · training-data-licensing-and-access · pretraining-data-filtering · code-corpus-construction
14. **Ch 14 · L14** — corpus-deduplication · pretraining-data-mixtures · synthetic-post-training-data
15. **Ch 15 · L15** — instruction-tuning-and-midtraining · preference-data-and-reward-modeling · reinforcement-learning-from-human-feedback · direct-preference-optimization
16. **Ch 16 · L16** — reinforcement-learning-from-verifiable-rewards · verifiable-reward-design · group-relative-policy-optimization
17. **Ch 17 · L17** — multimodal-tokenization · contrastive-vision-language-pretraining · vision-language-models
18. **Ch 18 · L18** — recurrent-depth-transformers

68 units / 18 chapters. Unit order within chapters above is a first approximation (lecture-flow guess); the timestamp pass replaces it with exact first-citation order.

## Next candidates to build (sequence-respecting)

- **language-modeling** ("the guessing game" — playable predict-the-next-token) — the true opening unit of ch 1.
- **tokenization** (the unit immediately before BPE — character/word/byte trade-offs; partially covered inside the BPE page already; may merge or stay thin).
- Then continue down ch 1 (transformer overview) or jump with the author's priorities.

## Open questions for extraction phase

- Unit granularity: one page per concept, or merge thin neighbours (e.g., tokenization + BPE)?
- "Revisited" mechanics: how a later chapter deepens an anchored concept (link? new page with recap?).
- Whether the ~7-unit chapters (1, 3) need splitting for pacing.
