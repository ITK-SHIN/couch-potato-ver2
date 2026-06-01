# -*- coding: utf-8 -*-
"""Generate portfolio items TS from scripts/channel-videos.jsonl"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
lines = (ROOT / "scripts" / "channel-videos.jsonl").read_text(encoding="utf-8-sig").splitlines()

def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')

def fmt_duration(ds: str) -> str:
    if not ds:
        return ""
    if ":" in ds:
        return ds
    if ds.isdigit():
        sec = int(ds)
        m, s = divmod(sec, 60)
        return f"{m}:{s:02d}" if m else f"0:{s:02d}"
    return ds

items = []
for line in lines:
    if not line.strip():
        continue
    d = json.loads(line)
    vid = d["id"]
    title = d.get("title") or "YouTube"
    dur = fmt_duration(d.get("duration_string") or "")
    items.append(
        f"""      {{
        id: "yt-{vid}",
        category: "유튜브",
        title: "{esc(title)}",
        client: "Try to 신감독",
        image: "https://img.youtube.com/vi/{vid}/hqdefault.jpg",
        duration: "{esc(dur)}",
        videoType: "youtube",
        youtubeUrl: "https://www.youtube.com/watch?v={vid}",
        videoUrl: "",
      }}"""
    )

block = ",\n".join(items)
out = ROOT / "scripts" / "portfolio-items.generated.ts"
out.write_text("export const generatedPortfolioItems = [\n" + block + "\n] as const;\n", encoding="utf-8")
print(f"Wrote {len(items)} items to {out}")
