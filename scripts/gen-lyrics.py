#!/usr/bin/env python3
"""Batch-generate lyric timestamp JSON for every song in public/songs.

Uses the local Qwen3-ASR-1.7B + Qwen3-ForcedAligner-0.6B checkpoints from the
audio_agent_tools catalog (GPU). Output: public/lyrics/<song-basename>.json
with shape {"lines": [{"t": start_sec, "end": end_sec, "text": str}, ...]}.

Usage:
  gen-lyrics.py            # all songs, skip existing
  gen-lyrics.py <file>     # single song file path (for testing)
"""

from __future__ import annotations

import json
import os
import sys
import time

MODELS = "/home/zane/sound/startup_infra/bench/auto_construction_agent/models"
SONGS_DIR = "/home/zane/sound/myblog/public/songs"
OUT_DIR = "/home/zane/sound/myblog/public/lyrics"

os.environ.setdefault("HF_HOME", MODELS)


def main() -> None:
    import torch
    from qwen_asr import Qwen3ASRModel

    single = sys.argv[1] if len(sys.argv) > 1 else None
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.bfloat16 if device == "cuda" else torch.float32

    model = Qwen3ASRModel.from_pretrained(
        f"{MODELS}/Qwen3-ASR-1.7B",
        dtype=dtype,
        device_map=device if device != "cpu" else None,
        forced_aligner=f"{MODELS}/Qwen3-ForcedAligner-0.6B",
        forced_aligner_kwargs={"dtype": dtype, "device_map": device if device != "cpu" else None},
    )
    print(f"[gen-lyrics] model loaded on {device}", file=sys.stderr)

    os.makedirs(OUT_DIR, exist_ok=True)
    files = [single] if single else sorted(
        os.path.join(SONGS_DIR, f) for f in os.listdir(SONGS_DIR) if f.endswith(".m4a")
    )
    total = len(files)

    for i, path in enumerate(files, 1):
        base = os.path.splitext(os.path.basename(path))[0]
        out_path = os.path.join(OUT_DIR, f"{base}.json")
        if not single and os.path.exists(out_path):
            print(f"[gen-lyrics] ({i}/{total}) skip {base}", file=sys.stderr)
            continue
        t0 = time.time()
        try:
            result = model.transcribe(path, language=None, return_time_stamps=True)
            stamps = getattr(result[0], "time_stamps", None) if result else None
            chars = []
            for ts in stamps or []:
                text = ts.text or ""
                if not text.strip():
                    continue
                # word-level pieces have no spaces; re-insert them between
                # adjacent latin pieces so English lyrics read correctly
                if text[0].isascii() and text[0].isalnum() and chars:
                    prev = chars[-1]["c"]
                    if prev and prev[-1].isascii() and prev[-1].isalnum():
                        text = " " + text
                chars.append(
                    {
                        "t": round(float(ts.start_time), 2),
                        "end": round(float(ts.end_time), 2),
                        "c": text,
                    }
                )
            # the aligner sometimes fails on a whole segment and sticks every
            # piece at 0/0 — spread such runs evenly between their neighbours
            i, n = 0, len(chars)
            while i < n:
                if chars[i]["t"] == 0 and chars[i]["end"] == 0:
                    j = i
                    while j < n and chars[j]["t"] == 0 and chars[j]["end"] == 0:
                        j += 1
                    lo = chars[i - 1]["end"] if i > 0 else 0.0
                    hi = chars[j]["t"] if j < n else lo
                    span = (hi - lo) / (j - i) if hi > lo else 0.3
                    for k in range(i, j):
                        chars[k]["t"] = round(lo + (k - i) * span, 2)
                        chars[k]["end"] = round(lo + (k - i + 1) * span, 2)
                    i = j
                else:
                    i += 1
            # zero-duration pieces break karaoke fill; give them a real end
            for k, ch in enumerate(chars):
                if ch["end"] <= ch["t"]:
                    nxt = chars[k + 1]["t"] if k + 1 < n else ch["t"] + 0.3
                    ch["end"] = round(nxt if nxt > ch["t"] else ch["t"] + 0.3, 2)
            # group char-level stamps into lyric lines:
            # always break on real breath gaps; break on smaller gaps once the
            # line is long enough; hard-wrap overlong lines at the next pause
            lines = []
            cur: list[dict] = []
            for ch in chars:
                if cur:
                    gap = ch["t"] - cur[-1]["end"]
                    cur_len = sum(len(x["c"]) for x in cur)
                    if gap >= 0.55 or (cur_len >= 10 and gap > 0.25) or (cur_len >= 24 and gap > 0.12) or cur_len >= 30:
                        lines.append(cur)
                        cur = []
                cur.append(ch)
            if cur:
                lines.append(cur)
            def pack(grp: list[dict]) -> dict:
                grp[0]["c"] = grp[0]["c"].lstrip()
                grp[-1]["c"] = grp[-1]["c"].rstrip()
                return {
                    "t": grp[0]["t"],
                    "end": grp[-1]["end"],
                    "text": "".join(x["c"] for x in grp).strip(),
                    "chars": grp,
                }

            packed = [pack(grp) for grp in lines]
            if not packed:
                print(f"[gen-lyrics] ({i}/{total}) EMPTY {base}", file=sys.stderr)
                continue
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump({"lines": packed}, f, ensure_ascii=False)
            dt = time.time() - t0
            print(f"[gen-lyrics] ({i}/{total}) ok {base}: {len(lines)} lines, {dt:.1f}s", file=sys.stderr)
        except Exception as exc:  # keep batch going on single failures
            print(f"[gen-lyrics] ({i}/{total}) FAIL {base}: {exc}", file=sys.stderr)

    print("[gen-lyrics] done", file=sys.stderr)


if __name__ == "__main__":
    main()
