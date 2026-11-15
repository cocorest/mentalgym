# パートナーシップ特別無料講座ページ

恋愛研究所の無料講座アーカイブと同じ仕組みです（チケット型の回一覧／動画＋要約／感想とスタンプ／本講座への導線）。

## 中身を変える
`public/content.js` だけ編集します。
- `course` … 本講座の名前・説明・価格・申込URL（`url` を入れるとボタンが有効になります）
- `rounds` … 各回。YouTube（限定公開）のURLを貼り、要約を書き、`sample: true` を消す

## 公開する（Cloudflare Workers）
感想の保存にサーバーが要るため、元ページと同じ Cloudflare Workers で公開します。
1. `npx wrangler login`
2. `npx wrangler kv namespace create COMMENTS` → 表示された id を `wrangler.toml` に貼る
3. `npx wrangler deploy` → `https://mentalgym-partnership.<あなたのアカウント>.workers.dev` で公開

`public/` だけを普通のサーバーに置いても表示はされますが、感想の送信・一覧は動きません（スタンプも押されません）。
