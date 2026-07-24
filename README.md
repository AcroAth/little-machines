# Little Machines

Little Machines is a personal learning notebook built as playable pages — explorable books compiled from real source material (lectures, essays), where LLM builders work under a strict design system and rounds of adversarial review. Each unit is a single page you can touch: you manipulate the idea before it is named, and every number on the page is carried in from the source rather than invented. The first book, **Language, from scratch**, is about how language models work — built from a real Stanford course, one playable page per concept.

## Read the book

The front door is here: **https://acroath.github.io/little-machines/book/cover.html**

Three units exist so far; chapter one of the first book is underway. The working plan lives in [design/book-plan.md](design/book-plan.md).

- **The guessing game** (`language-modeling.html`) — a language model is anything that plays the guessing game: it assigns probability to what comes next. You guess the next word, and a little machine that has read exactly one lecture guesses beside you, using the real counts from that lecture.
- **Bigger or cleverer?** (`the-bitter-lesson.html`) — the rumor says the machines just got bigger. You grab both levers, the cleverness built in and the resources poured in, and watch which one actually carries them.
- **How a computer learns to read** (`bpe-north-star.html`) — the book's north-star page. Cold numbers fuse into warm words as you teach a machine its first vocabulary, one byte-pair merge at a time.

Each page is a single self-contained HTML file: no build step, no network calls, silent by design, light/dark aware, and reduced-motion safe. You can read any of them by opening the file directly in a browser.

## How a page gets built

A unit begins as a source transcript. A separate ingestion pipeline (not in this repo) turns that transcript into a structured concept wiki. From the wiki comes a unit spec that fixes the concept, the palette roles, and the sequence of beats. A builder then writes the page under the rules in [skill/unit-page.md](skill/unit-page.md), and the page goes through rounds of adversarial review — each round finds defects, names the rule that would have prevented them, and folds that rule back into the design system. Every claim is checked twice: a headless pass (the scripts in [tools/](tools/)) that re-derives the page's numbers straight from the source, and a live pass that drives the instruments in a real browser.

[JOURNAL.md](JOURNAL.md) is the complete, honest build log — every review round, every defect, every rule earned. [design/](design/) holds the spec and build notes behind each page. The interesting artifact here is as much the process as the pages.

## Authorship and tooling

I set the goals, the design direction, and the acceptance bar, and reviewed every round; the pages were implemented by LLM builder agents working from written specs, under the adversarial review process documented in [JOURNAL.md](JOURNAL.md). Every numerical claim on a page is re-derived from the source material by the scripts in [tools/](tools/).

## Provenance & credits

Book 1 is an unofficial companion to Stanford's CS336, "Language Modeling from Scratch" (instructors Percy Liang and Tatsunori Hashimoto; course site https://cs336.stanford.edu/). It is not affiliated with, or endorsed by, Stanford or the instructors.

The prose is original commentary anchored to timestamped citations from the lectures. The per-claim anchor tables live in the build notes under [design/](design/) — see the fidelity tables in `language-modeling-build-notes.md` and `the-bitter-lesson-build-notes.md`, where each authored claim is tied to a lecture timestamp.

The guessing-game page embeds word-level statistical data derived from the Lecture 1 transcript: pruned n-gram count tables and an id-encoded token stream. That is deliberate, and it is the page's honesty device — every number the reader sees is a real count, and the embedded stream lets the page re-derive its own tables. It has a direct consequence: the page can reproduce short verbatim phrases from the lecture, because reproducing the lecture's own short phrases is exactly the phenomenon it is teaching.

The Bitter Lesson unit is commentary on the "bitter lesson" argument from Rich Sutton's 2019 essay (http://www.incompleteideas.net/IncIdeas/BitterLesson.html), as that argument is taught in the CS336 lecture.

The hand-lettered annotations use the Patrick Hand typeface by Patrick Wagesreiter (SIL Open Font License), embedded in each page as a data URI.

If you are a rights holder and would like something changed or removed, open an issue and it will be honored promptly.

## Licensing

The code — everything under tools/ and skill/, and the JavaScript embedded in the book pages — is released under the MIT License ([LICENSE](LICENSE)). The prose, page content, cast art, design documents, and the journal are released under Creative Commons Attribution 4.0 ([LICENSE-CONTENT.md](LICENSE-CONTENT.md)).
