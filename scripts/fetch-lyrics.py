#!/usr/bin/env python3
"""Fetch reference (official) lyrics for every song from QQ Music.

For each title in src/data/songs.json:
  1. search QQ Music by title (with a stripped-of-parenthetical fallback)
  2. pick the best candidate: exact title match, skip live/remix/cover/instrumental
  3. download the LRC, parse into clean lyric lines (drop metadata & credits)
  4. if the ASR-generated JSON exists, compute text similarity as a sanity flag

Cache: scripts/lyrics-ref/<title>.json  {mid, name, singer, lines, sim}
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from difflib import SequenceMatcher

ROOT = "/home/zane/sound/myblog"
REF_DIR = os.path.join(ROOT, "scripts", "lyrics-ref")
HEADERS = {"Referer": "https://y.qq.com", "User-Agent": "Mozilla/5.0"}

BAD_WORDS = ("live", "remix", "cover", "伴奏", "dj", "纯音", "翻唱", "现场", "版)")


def get(url: str) -> dict:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))


def search(title: str) -> list[dict]:
    q = urllib.parse.quote(title)
    url = f"https://c.y.qq.com/soso/fcgi-bin/client_search_cp?w={q}&format=json&n=10&t=0"
    try:
        return get(url)["data"]["song"]["list"]
    except Exception:
        return []


def pick(title: str, cands: list[dict]) -> dict | None:
    def norm(s: str) -> str:
        return re.sub(r"[\s（）()]", "", s).lower()

    exact = [c for c in cands if norm(c["songname"]) == norm(title)]
    pool = exact or cands
    for c in pool:
        name = c["songname"].lower()
        if not any(w in name for w in BAD_WORDS):
            return c
    return pool[0] if pool else None


def fetch_lrc(mid: str) -> str:
    url = (
        "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"
        f"?songmid={mid}&format=json&nobase64=1"
    )
    try:
        return get(url).get("lyric", "")
    except Exception:
        return ""


CREDIT_RE = re.compile(
    r"(词|曲|编曲|制作人|监制|吉他|贝斯|鼓|和声|录音|混音|母带|OP|SP|作词|作曲|演唱|原唱)\s*[:：]"
)


def parse_lrc(lrc: str) -> list[str]:
    lines = []
    for raw in lrc.splitlines():
        m = re.match(r"^(\[[\d:.]+\])+(.*)$", raw.strip())
        if not m:
            continue
        text = m.group(2).strip()
        if not text or CREDIT_RE.search(text):
            continue
        lines.append(text)
    # de-dup while keeping order (lrc repeats chorus; alignment needs the
    # full sequence though, so DO NOT dedup — covers repeat too)
    return lines


def norm_text(s: str) -> str:
    return re.sub(r"[^\w一-鿿]", "", s.lower())


def asr_similarity(title: str, ref_lines: list[str]) -> float | None:
    p = os.path.join(ROOT, "public", "lyrics", f"{title}_周浩洋.json")
    if not os.path.exists(p):
        return None
    asr = json.load(open(p))
    a = norm_text("".join(l["text"] for l in asr["lines"]))
    b = norm_text("".join(ref_lines))
    if not a or not b:
        return None
    return SequenceMatcher(None, a, b).ratio()


def main() -> None:
    os.makedirs(REF_DIR, exist_ok=True)
    songs = json.load(open(os.path.join(ROOT, "src", "data", "songs.json")))
    only = sys.argv[1] if len(sys.argv) > 1 else None

    for i, s in enumerate(songs, 1):
        title = s["title"]
        if only and title != only:
            continue
        out = os.path.join(REF_DIR, f"{title}.json")
        if os.path.exists(out) and not only:
            print(f"[fetch] ({i}/{len(songs)}) skip {title}")
            continue

        base = re.sub(r"[(（].*$", "", title).strip()
        cand = pick(title, search(title))
        if not cand and base != title:
            cand = pick(base, search(base))
        if not cand:
            print(f"[fetch] ({i}/{len(songs)}) MISS {title}")
            continue

        lines = parse_lrc(fetch_lrc(cand["songmid"]))
        singer = "/".join(a["name"] for a in cand["singer"])
        rec = {
            "mid": cand["songmid"],
            "name": cand["songname"],
            "singer": singer,
            "lines": lines,
            "sim": None,
        }
        sim = asr_similarity(title, lines)
        rec["sim"] = round(sim, 3) if sim is not None else None
        with open(out, "w", encoding="utf-8") as f:
            json.dump(rec, f, ensure_ascii=False, indent=1)
        flag = ""
        if re.sub(r"[\s（）()]", "", cand["songname"]).lower() != re.sub(
            r"[\s（）()]", "", title
        ).lower():
            flag = "  <= TITLE-DIFF"
        sims = f" sim={rec['sim']}" if rec["sim"] is not None else ""
        print(f"[fetch] ({i}/{len(songs)}) {title} -> {cand['songname']} | {singer} | {len(lines)} lines{sims}{flag}")
        time.sleep(0.3)


if __name__ == "__main__":
    main()
