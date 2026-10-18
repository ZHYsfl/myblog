#!/usr/bin/env python3
"""Remap v2 lyric text onto v1 (ASR) timing for aligner-failed songs.

The standalone forced aligner sometimes collapses a song's opening lines to
t=0 (long intros, quiet openings). The ASR pipeline's own timestamps are
grounded but its text is misheard. This script keeps the correct v2 text and
re-derives per-char times from the v1 stream via char-level alignment
(matched chars take v1 times, unmatched ones linearly interpolate).

Songs whose v2 output is clean are copied through untouched.
Final output lands in public/lyrics/ (what the site serves).

Usage: gen-lyrics-remap.py            # all songs
       gen-lyrics-remap.py <title>    # single song, force remap (debug)
"""

from __future__ import annotations

import json
import os
import re
import sys
from difflib import SequenceMatcher

ROOT = "/home/zane/sound/myblog"
V1_DIR = os.path.join(ROOT, "scripts", "lyrics-ref", "asr-v1")
V2_DIR = os.path.join(ROOT, "public", "lyrics-v2")
OUT_DIR = os.path.join(ROOT, "public", "lyrics")

ZERO_WARN = 5  # v2 zero-time char count above this → remap


def norm(s: str) -> str:
    return re.sub(r"[^\w一-鿿]", "", s.lower())


def remap(v2_lines: list[dict], v1_chars: list[dict]) -> list[dict]:
    """Return v2 line structure with times borrowed from the v1 char stream."""
    a_chars: list[str] = []  # v2 norm chars
    # per line: list of (char_idx_in_line, norm_start, norm_end)
    line_spans: list[list[tuple[int, int, int]]] = []
    for li, line in enumerate(v2_lines):
        spans = []
        for ci, ch in enumerate(line["chars"]):
            start = len(a_chars)
            a_chars.extend(norm(ch["c"]))
            spans.append((ci, start, len(a_chars)))
        line_spans.append(spans)

    b_chars = [c for ch in v1_chars for c in norm(ch["c"])]
    b_map: list[int] = []  # norm char idx → v1 char idx
    for vi, ch in enumerate(v1_chars):
        for _ in norm(ch["c"]):
            b_map.append(vi)
    if not a_chars or not b_chars:
        return v2_lines

    sm = SequenceMatcher(None, a_chars, b_chars, autojunk=False)
    a_time: list[float | None] = [None] * len(a_chars)
    a_end: list[float | None] = [None] * len(a_chars)
    for b in sm.get_matching_blocks():
        if b.size < 3:  # spurious single-char matches just get interpolated
            continue
        for k in range(b.size):
            vi = b_map[b.b + k]
            vc = v1_chars[vi]
            if vc["t"] == 0 and vc["end"] > 1.0:
                continue  # broken v1 char (aligner collapse) — interpolate instead
            a_time[b.a + k] = vc["t"]
            a_end[b.a + k] = vc["end"]

    # interpolate unmatched positions between nearest matched neighbours
    matched = [i for i, t in enumerate(a_time) if t is not None]
    if not matched:
        return v2_lines
    import bisect

    for i in range(len(a_chars)):
        if a_time[i] is not None:
            continue
        p = bisect.bisect_left(matched, i)
        lo = matched[p - 1] if p > 0 else None
        hi = matched[p] if p < len(matched) else None
        if lo is None:
            t, e = a_time[hi], a_end[hi]
        elif hi is None:
            t, e = a_time[lo], a_end[lo]
        else:
            frac = (i - lo) / (hi - lo)
            t = a_time[lo] + frac * (a_time[hi] - a_time[lo])
            e = a_end[lo] + frac * (a_end[hi] - a_end[lo])
        a_time[i], a_end[i] = t, e

    out = []
    for li, line in enumerate(v2_lines):
        spans = line_spans[li]
        if not spans:
            continue
        chars = []
        for ci, ch in enumerate(line["chars"]):
            _, start, end = spans[ci]
            if end > start:
                t = a_time[start]
                e = a_end[end - 1]
            else:  # char with no norm content (punctuation) → copy previous
                t, e = (chars[-1]["end"], chars[-1]["end"]) if chars else (0.0, 0.3)
            chars.append({"t": round(float(t), 2), "end": round(float(e), 2), "c": ch["c"]})
        for k, ch in enumerate(chars):
            if ch["end"] <= ch["t"]:
                nxt = chars[k + 1]["t"] if k + 1 < len(chars) else ch["t"] + 0.3
                ch["end"] = round(nxt if nxt > ch["t"] else ch["t"] + 0.3, 2)
        out.append(
            {
                "t": chars[0]["t"],
                "end": max(chars[-1]["end"], chars[0]["t"] + 0.2),
                "text": line["text"],
                "chars": chars,
            }
        )
    return out


def zero_count(lines: list[dict]) -> int:
    return sum(1 for l in lines for c in l.get("chars", []) if c["t"] == 0 and c["end"] <= 0.31)


def main() -> None:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    songs = json.load(open(os.path.join(ROOT, "src", "data", "songs.json")))
    stats = {"v2": 0, "remap": 0, "v1": 0, "missing": 0}

    for s in songs:
        title = s["title"]
        if only and title != only:
            continue
        base = os.path.splitext(os.path.basename(s["file"]))[0]
        v1_path = os.path.join(V1_DIR, f"{base}.json")
        v2_path = os.path.join(V2_DIR, f"{base}.json")
        out_path = os.path.join(OUT_DIR, f"{base}.json")

        v1 = json.load(open(v1_path)) if os.path.exists(v1_path) else None
        v2 = json.load(open(v2_path)) if os.path.exists(v2_path) else None

        if v2 is None and v1 is None:
            stats["missing"] += 1
            print(f"[final] MISSING {title}")
            continue

        z = zero_count(v2["lines"]) if v2 else 10**9
        if v2 and (z <= ZERO_WARN and not only):
            final, how = v2["lines"], "v2"
        elif v1:
            v1_chars = [c for l in v1["lines"] for c in l.get("chars", [])]
            final, how = remap(v2["lines"] if v2 else v1["lines"], v1_chars), "remap"
            if v2 is None:
                how = "v1"
        else:
            final, how = v2["lines"], "v2"

        stats[how] += 1
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({"lines": final}, f, ensure_ascii=False)
        if how != "v2" or only:
            zf = zero_count(final)
            print(f"[final] {title}: {how} (v2-zero={z if v2 else 'NA'} → {zf})")

    print(f"[final] done: {stats}")


if __name__ == "__main__":
    main()
