#!/usr/bin/env python3
"""物件比較リスト用ハザード自動判定。

国土地理院のジオコーダで住所を座標にし、重ねるハザードマップと同じラスタタイル
(disaportal.gsi.go.jp/data/raster/...) の該当ピクセルを読んで判定する。
※ disaportaldata.gsi.go.jp はクラウド環境から接続できないため使わない。

使い方:
  python3 hzcheck.py in.json out.json
  in.json  = [{"id": "...", "address": "埼玉県..."}, ...]
  out.json = {"<id>": {hazard オブジェクト} | {"error": "..."}}
必要: Pillow
"""
import io, json, math, re, sys, time, urllib.parse, urllib.request
from datetime import datetime, timezone
from PIL import Image

BASE = "https://disaportal.gsi.go.jp/data/raster/"
Z = 17
UA = {"User-Agent": "bukken-hazard-check/1.0"}

FLOOD = [((247, 245, 169), 1), ((255, 216, 192), 2), ((255, 183, 183), 3),
         ((255, 145, 145), 4), ((242, 133, 201), 4), ((220, 122, 220), 4)]
FLOOD_LABEL = ["想定区域外", "0.5m未満", "0.5〜3m", "3〜5m", "5m以上"]
_cache = {}


def get(url):
    if url in _cache:
        return _cache[url]
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
                v = r.read()
            break
        except urllib.error.HTTPError as e:
            if e.code == 404:
                v = None  # タイル無し＝区域外
                break
            if i == 2:
                raise
        except Exception:
            if i == 2:
                raise
        time.sleep(1 + i)
    _cache[url] = v
    return v


def geocode(addr):
    q = urllib.parse.quote(addr)
    res = json.loads(get(f"https://msearch.gsi.go.jp/address-search/AddressSearch?q={q}") or b"[]")
    if not res:
        return None
    lon, lat = res[0]["geometry"]["coordinates"]
    title = res[0]["properties"].get("title", "")
    # 住所の番地数字がヒット結果に含まれていれば番地付近、なければ町丁目代表点
    z2h = lambda t: t.translate(str.maketrans("０１２３４５６７８９", "0123456789"))
    nums = re.findall(r"[0-9]+", z2h(addr))
    precise = bool(nums) and nums[-1] in z2h(title)
    return lat, lon, title, precise


def pixels(layer, lat, lon, r=2):
    n = 2 ** Z
    fx = (lon + 180) / 360 * n
    rad = math.radians(lat)
    fy = (1 - math.log(math.tan(rad) + 1 / math.cos(rad)) / math.pi) / 2 * n
    x, y = int(fx), int(fy)
    px, py = int((fx - x) * 256), int((fy - y) * 256)
    b = get(f"{BASE}{layer}/{Z}/{x}/{y}.png")
    if not b:
        return []
    im = Image.open(io.BytesIO(b)).convert("RGBA")
    out = []
    for dx in range(-r, r + 1):
        for dy in range(-r, r + 1):
            c = im.getpixel((min(255, max(0, px + dx)), min(255, max(0, py + dy))))
            if c[3] > 0:
                out.append(c[:3])
    return out


def flood_level(cols):
    lv = 0
    for c in cols:
        best = min(FLOOD, key=lambda f: sum((a - b) ** 2 for a, b in zip(c, f[0])))
        lv = max(lv, best[1])
    return lv


def landslide(lat, lon):
    red = yellow = False
    for layer in ("05_dosekiryukeikaikuiki", "05_kyukeishakeikaikuiki", "05_jisuberikeikaikuiki"):
        for r, g, b in pixels(layer, lat, lon):
            if r > 180 and g < 120:
                red = True
            else:
                yellow = True
    return "特別警戒区域（レッド）" if red else "警戒区域（イエロー）" if yellow else "区域外"


def judge(addr):
    g = geocode(addr)
    if not g:
        return {"error": "住所から座標を取得できませんでした"}
    lat, lon, title, precise = g
    fl = flood_level(pixels("01_flood_l2_shinsuishin_data", lat, lon))
    h = {
        "flood": FLOOD_LABEL[fl],
        "inland": "浸水想定あり" if pixels("02_naisui_data", lat, lon) else "想定区域外",
        "storm": "浸水想定あり" if pixels("03_hightide_l2_shinsuishin_data", lat, lon) else "想定区域外",
        "tsunami": "浸水想定あり" if pixels("04_tsunami_newlegend_data", lat, lon) else "想定区域外",
        "landslide": landslide(lat, lon),
        "lat": round(lat, 6), "lon": round(lon, 6), "checked": True,
    }
    bad = []
    if fl:
        bad.append(f"洪水 {h['flood']}")
    if h["landslide"] != "区域外":
        bad.append(f"土砂 {h['landslide']}")
    for k, l in (("tsunami", "津波"), ("storm", "高潮"), ("inland", "内水")):
        if h[k] != "想定区域外":
            bad.append(f"{l} 浸水想定あり")
    high = fl >= 3 or "レッド" in h["landslide"]
    h["level"] = "high" if high else "mid" if bad else "low"
    h["short"] = bad[0] if bad else "該当なし"
    where = f"番地付近（{title}）" if precise else f"町丁目の代表点（{title}）。物件位置とずれる可能性あり"
    h["summary"] = ("、".join(bad) if bad else "洪水・土砂・津波・高潮・内水とも想定区域外") + f"。判定位置：{where}。最終確認は重ねるハザードマップで。"
    h["source"] = "国土地理院データで自動判定"
    h["checkedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    return h


def main():
    items = json.load(open(sys.argv[1], encoding="utf-8"))
    out = {}
    for it in items:
        try:
            out[it["id"]] = judge(it["address"])
        except Exception as e:
            out[it["id"]] = {"error": f"{type(e).__name__}: {e}"}
        print(it["id"], out[it["id"]].get("short") or out[it["id"]].get("error"), file=sys.stderr)
    json.dump(out, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
