"""note-articles/*.md を管理ページ用の articles.json にまとめる。"""
import json, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
out = []
files = sorted((root / "note-articles").glob("day*.md")) + sorted((root / "note-paid").glob("paid*.md"))
for p in files:
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
    item = {
        "id": p.stem,
        "type": d.get("type", "daily"),
        "day": int(d.get("day", 0)),
        "date": d.get("date", ""),
        "title": d["title"],
        "summary": d["summary"],
        "tags": d["tags"],
        "inspiration": d["inspiration"],
        "body": body,
        "chars": len(body.replace("===有料ライン===", "")),
    }
    if "price" in d:
        item["price"] = int(d["price"])
    out.append(item)
(root / "note-admin" / "articles.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(out), "articles")
