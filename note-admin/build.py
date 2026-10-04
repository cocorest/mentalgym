"""note-articles/*.md を管理ページ用の articles.json にまとめる。"""
import json, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
out = []
for p in sorted((root / "note-articles").glob("day*.md")):
    text = p.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    meta, body = m.group(1), m.group(2).strip()
    d = {}
    for line in meta.splitlines():
        k, v = line.split(":", 1)
        v = v.strip()
        if v.startswith("["):
            v = [t.strip() for t in v[1:-1].split(",") if t.strip()]
        d[k.strip()] = v
    out.append({
        "id": p.stem,
        "day": int(d["day"]),
        "date": d["date"],
        "title": d["title"],
        "summary": d["summary"],
        "tags": d["tags"],
        "inspiration": d["inspiration"],
        "body": body,
        "chars": len(body),
    })
(root / "note-admin" / "articles.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(out), "articles")
