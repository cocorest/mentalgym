"""今日（日本時間）の note 記事を、お知らせメール用にまとめて出力する。

使い方: python3 note-admin/today.py [YYYY-MM-DD]
出力: JSON {found, day, date, subject, text, html}
"""
import datetime, html, json, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
ADMIN = "https://claude.ai/artifact/PtKhv6LJ4ZVvdRW6DYej49"
today = sys.argv[1] if len(sys.argv) > 1 else datetime.datetime.now(
    datetime.timezone(datetime.timedelta(hours=9))).strftime("%Y-%m-%d")

articles = json.loads((root / "note-admin" / "articles.json").read_text(encoding="utf-8"))
a = next((x for x in articles if x.get("type") != "paid" and x.get("date") == today), None)
if not a:
    print(json.dumps({"found": False, "date": today}, ensure_ascii=False))
    sys.exit(0)


def inline(t):
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", html.escape(t)).replace("*", "")


def to_html(md):
    out, lst, head = [], None, None
    for raw in md.split("\n"):
        line = raw.rstrip()
        if line.strip().startswith("|"):
            if re.fullmatch(r"[\s|:-]+", line.strip()):
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if head is None:
                head = cells
                continue
            out.append("<li>" + " ／ ".join(inline((h + "：" if h else "") + c) for h, c in zip(head, cells)) + "</li>")
            continue
        head = None
        if lst and re.match(r"\s{2,}\S", raw) and out and out[-1].endswith("</li>"):
            out[-1] = out[-1][:-5] + "<br>" + inline(line.strip()) + "</li>"
            continue
        if lst and not re.match(r"\s*(-|\d+\.)\s", line):
            out.append(f"</{lst}>"); lst = None
        if not line.strip():
            continue
        if line.strip() == "---":
            out.append("<hr>")
        elif m := re.match(r"###\s+(.*)", line):
            out.append(f"<h3>{inline(m[1])}</h3>")
        elif m := re.match(r"##\s+(.*)", line):
            out.append(f"<h2>{inline(m[1])}</h2>")
        elif m := re.match(r">\s?(.*)", line):
            out.append(f"<blockquote>{inline(m[1])}</blockquote>")
        elif m := re.match(r"\s*(-|\d+\.)\s+(.*)", line):
            tag = "ul" if m[1] == "-" else "ol"
            if lst != tag:
                if lst: out.append(f"</{lst}>")
                out.append(f"<{tag}>"); lst = tag
            out.append(f"<li>{inline(m[2])}</li>")
        else:
            out.append(f"<p>{inline(line)}</p>")
    if lst: out.append(f"</{lst}>")
    return "\n".join(out)


def to_text(md):
    t = re.sub(r"^#{2,3}\s+", "", md, flags=re.M)
    return re.sub(r"\*\*(.+?)\*\*", r"\1", t)


tags = " ".join("#" + t for t in a["tags"])
subject = f"【今日のnote】Day{a['day']}｜{a['title']}"
text = (f"今日（{a['date']}）は Day{a['day']} の記事です。\n\n■タイトル\n{a['title']}\n\n■ハッシュタグ\n{tags}\n\n"
        f"■本文\n{to_text(a['body'])}\n\n――――\nnoteで書く: https://note.com/notes/new\n管理ページ（見出しつきコピー・投稿済みチェック）: {ADMIN}\n")
body_html = (f"<p>今日（{a['date']}）は <strong>Day{a['day']}</strong> の記事です。</p>"
             f"<p><a href=\"https://note.com/notes/new\">noteで新しい記事を書く</a> ／ <a href=\"{ADMIN}\">管理ページを開く</a></p>"
             f"<p><strong>タイトル</strong><br>{html.escape(a['title'])}</p>"
             f"<p><strong>ハッシュタグ</strong><br>{html.escape(tags)}</p><hr>"
             f"<h1>{html.escape(a['title'])}</h1>{to_html(a['body'])}")
print(json.dumps({"found": True, "day": a["day"], "date": a["date"], "subject": subject,
                  "text": text, "html": body_html}, ensure_ascii=False))
