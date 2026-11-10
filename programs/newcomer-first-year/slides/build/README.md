# スライド生成スクリプト

スライドを修正したいときは、このフォルダのスクリプトを編集して再生成します。

```bash
npm install pptxgenjs react-icons react react-dom sharp
export PPTX_SKILL=<pptx スキルのディレクトリ>   # apply_theme.js を使用
export NODE_PATH=$PWD/node_modules
node build_main.js main.pptx
node build_follow.js six.pptx twelve.pptx
```

- `lib.js`：テーマ（メンタルジムのピンク／ブラウン）、レイアウト、カードなどの部品
- `refs.js`：参考文献（`../../05_references.md` と同じ内容）
- `build_main.js`：本研修（プログラム全体像＋第1回・第2回＋運用）
- `build_follow.js`：6か月後・12か月後フォローアップ
