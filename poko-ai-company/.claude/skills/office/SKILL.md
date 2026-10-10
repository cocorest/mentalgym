---
name: office
description: オフィス画面。社長が「オフィスを開いて」「オフィス画面」「みんな何してる？」と言ったとき、またはオフィスの色や名前を変えたいときに使う。
---

# オフィス画面 🏢

## 開く
- `office/index.html` をブラウザで開く。Mac なら `open office/index.html`、Windows なら `start office\index.html` で開ける。
- 開けないときは「`office` フォルダの中の `index.html` をダブルクリックしてください」と案内する。
- 画面は5秒ごとに自動で新しくなるので、開きっぱなしでOKと伝える。

## 見た目を変える
社長が「色を変えたい」「会社名を変えたい」「社員の色を変えたい」と言ったら、`office/state.js` の次の場所を書きかえる。
- `company`：会社名
- `boss`：社長の呼び名
- `theme`：`main`（メインの色）、`sub`（差し色）、`wall`（壁）、`floor`（床）、`panel`（カードの色）
- `staff` の `color`（体の色）、`animal`（tanuki / bear / rabbit / chick / cat）、`name`、`role`
色の案を出すときは、3パターンほど言葉で説明して選んでもらう（例：「さくら色のやさしいオフィス」）。
