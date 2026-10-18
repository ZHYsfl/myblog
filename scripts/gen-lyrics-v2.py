#!/usr/bin/env python3
"""Lyric pipeline v2: official lyrics + forced alignment.

Instead of displaying raw ASR text (mishearings included), this:
  1. takes the official lyric lines (scripts/lyrics-ref/<title>.json)
  2. monotonically aligns ASR lines (what was actually sung, public/lyrics
     from gen-lyrics.py) to official lines — producing the exact text of the
     cover (official lines the singer skipped are dropped; ad-libs the
     official lyrics lack are kept as ASR heard them)
  3. runs Qwen3-ForcedAligner with that text against the audio, giving
     char/word-level timestamps for correct lyrics
  4. splits the aligned item stream back into lyric lines using the
     aligner's own tokenizer per line

Output: public/lyrics-v2/<song>.json + a sanity report on stdout.
Songs without usable references are skipped (keep the v1 ASR json).

Usage:
  gen-lyrics-v2.py             # all songs
  gen-lyrics-v2.py <title>     # single song (e.g. 晴天)
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
from difflib import SequenceMatcher

MODELS = "/home/zane/sound/startup_infra/bench/auto_construction_agent/models"
ROOT = "/home/zane/sound/myblog"
SONGS_DIR = os.path.join(ROOT, "public", "songs")
ASR_DIR = os.path.join(ROOT, "public", "lyrics")
REF_DIR = os.path.join(ROOT, "scripts", "lyrics-ref")
OUT_DIR = os.path.join(ROOT, "public", "lyrics-v2")

os.environ.setdefault("HF_HOME", MODELS)


def norm(s: str) -> str:
    return re.sub(r"[^\w一-鿿]", "", s.lower())


def cjk_ratio(s: str) -> float:
    chars = [c for c in s if c.isalnum()]
    if not chars:
        return 0.0
    return sum(1 for c in chars if "一" <= c <= "鿿") / len(chars)


def align_sequences(asr_lines: list[str], ref_lines: list[str]) -> list[str]:
    """Pick the exact text of the cover: official lines the singer actually
    sang (char-level evidence from the ASR transcript) plus ASR ad-lib lines
    the official lyrics lack (count-ins, humming).

    Works at character level so merged/split ASR lines still vote for every
    official line they touch.
    """
    # norm'd full texts with position → line-index maps
    a_pos: list[int] = []
    a_chars: list[str] = []
    for i, t in enumerate(asr_lines):
        for c in norm(t):
            a_chars.append(c)
            a_pos.append(i)
    r_pos: list[int] = []
    r_chars: list[str] = []
    ref_lens: list[int] = []
    for j, t in enumerate(ref_lines):
        n = norm(t)
        ref_lens.append(len(n))
        for c in n:
            r_chars.append(c)
            r_pos.append(j)
    if not a_chars or not r_chars:
        return asr_lines

    sm = SequenceMatcher(None, a_chars, r_chars, autojunk=False)
    blocks = sm.get_matching_blocks()

    # per-line matched char counts + evidence: ref line j ← asr lines i
    a_len = [0] * len(asr_lines)
    a_hit = [0] * len(asr_lines)
    r_hit = [0] * len(ref_lines)
    evidence: list[set[int]] = [set() for _ in ref_lines]
    for p in a_pos:
        a_len[p] += 1
    for b in blocks:
        for k in range(b.size):
            i = a_pos[b.a + k]
            j = r_pos[b.b + k]
            a_hit[i] += 1
            r_hit[j] += 1
            evidence[j].add(i)

    # official lines with enough sung evidence are kept
    keep = {j for j in range(len(ref_lines)) if ref_lens[j] and r_hit[j] / ref_lens[j] >= 0.4}

    # walk ASR lines in performance order: emit ad-libs, otherwise the
    # kept official lines this ASR line provides evidence for
    emitted: set[int] = set()
    out: list[str] = []
    for i, t in enumerate(asr_lines):
        cov = a_hit[i] / a_len[i] if a_len[i] else 0
        if cov < 0.3 and a_len[i] >= 6:
            out.append(t)  # ad-lib, keep ASR text
            continue
        for j in sorted(j for j in keep - emitted if i in evidence[j]):
            out.append(ref_lines[j])
            emitted.add(j)
    return out or asr_lines


def main() -> None:
    import torch
    from qwen_asr.inference.qwen3_forced_aligner import Qwen3ForcedAligner

    only = sys.argv[1] if len(sys.argv) > 1 else None
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.bfloat16 if device == "cuda" else torch.float32
    aligner = Qwen3ForcedAligner.from_pretrained(
        f"{MODELS}/Qwen3-ForcedAligner-0.6B",
        dtype=dtype,
        device_map=device if device != "cpu" else None,
    )
    print(f"[v2] aligner loaded on {device}", file=sys.stderr)

    os.makedirs(OUT_DIR, exist_ok=True)
    songs = json.load(open(os.path.join(ROOT, "src", "data", "songs.json")))
    total = len(songs)

    for i, s in enumerate(songs, 1):
        title = s["title"]
        if only and title != only:
            continue
        audio = os.path.join(ROOT, "public", s["file"].lstrip("/"))
        asr_path = os.path.join(ASR_DIR, os.path.splitext(os.path.basename(s["file"]))[0] + ".json")
        ref_path = os.path.join(REF_DIR, f"{title}.json")
        out_path = os.path.join(
            OUT_DIR, os.path.splitext(os.path.basename(s["file"]))[0] + ".json"
        )
        if not only and os.path.exists(out_path):
            print(f"[v2] ({i}/{total}) skip {title}", file=sys.stderr)
            continue
        if not (os.path.exists(audio) and os.path.exists(asr_path) and os.path.exists(ref_path)):
            print(f"[v2] ({i}/{total}) MISS-INPUT {title}", file=sys.stderr)
            continue
        ref = json.load(open(ref_path))
        if not ref.get("lines"):
            print(f"[v2] ({i}/{total}) NO-REF {title}", file=sys.stderr)
            continue
        asr = json.load(open(asr_path))
        asr_texts = [l["text"] for l in asr["lines"]]

        t0 = time.time()
        try:
            sung = align_sequences(asr_texts, ref["lines"])
            lang = "Chinese" if cjk_ratio("".join(sung)) >= 0.5 else "English"

            result = aligner.align(audio, text="\n".join(sung), language=lang)
            items = [
                {"t": round(float(it.start_time), 2), "end": round(float(it.end_time), 2), "c": it.text}
                for it in result[0]
            ]

            # split the flat item stream back into lines, using the aligner's
            # own tokenizer to learn how many items each line should consume
            proc = aligner.aligner_processor
            counts = [len(proc.encode_timestamp(line, lang)[0]) for line in sung]
            lines = []
            pos = 0
            ok = sum(counts) == len(items)
            for k, line in enumerate(sung):
                cnt = counts[k]
                grp = items[pos : pos + cnt] if ok else []
                pos += cnt
                if not grp:  # tokenizer drift — fall back to asr timing
                    grp = asr["lines"][k].get("chars", [])
                    grp = [{"t": g["t"], "end": g["end"], "c": g["c"]} for g in grp]
                if not grp:
                    continue
                lines.append(
                    {
                        "t": grp[0]["t"],
                        "end": grp[-1]["end"],
                        "text": line,
                        "chars": grp,
                    }
                )
            # fix zero-duration items for karaoke fill
            for ln in lines:
                chs = ln["chars"]
                for k, ch in enumerate(chs):
                    if ch["end"] <= ch["t"]:
                        nxt = chs[k + 1]["t"] if k + 1 < len(chs) else ch["t"] + 0.3
                        ch["end"] = round(nxt if nxt > ch["t"] else ch["t"] + 0.3, 2)
                ln["end"] = max(ln["end"], ln["chars"][-1]["end"], ln["t"] + 0.2)

            zero = sum(1 for ln in lines for c in ln["chars"] if c["t"] == 0 and c["end"] <= 0.31)
            mono = all(
                lines[k + 1]["t"] >= lines[k]["t"] - 0.01 for k in range(len(lines) - 1)
            )
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump({"lines": lines}, f, ensure_ascii=False)
            dt = time.time() - t0
            warn = "" if (mono and zero == 0) else f"  WARN mono={mono} zero={zero}"
            print(
                f"[v2] ({i}/{total}) ok {title}: {len(lines)} lines, {dt:.1f}s{warn}",
                file=sys.stderr,
            )
        except Exception as exc:
            print(f"[v2] ({i}/{total}) FAIL {title}: {exc}", file=sys.stderr)

    print("[v2] done", file=sys.stderr)


if __name__ == "__main__":
    main()
