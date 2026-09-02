---
name: verify
description: Use this AFTER finishing a change in this repository and BEFORE reporting it done, committing, or pushing. Spawns an independent subagent that has no knowledge of this conversation's reasoning to critically score the result against a rubric, so the check isn't biased by the same logic that produced the work. Trigger for LP copy changes, HTML/CSS/JS edits, or any deliverable you're about to hand back as finished.
---

# verify — 独立サブエージェントによる採点

## なぜこれが要る
同じ会話の中で自分が書いたものに「これで良い？」と聞いても、直前の自分の理屈に引っ張られて
甘い判定になりやすい。検証は、経緯を一切知らない別の視点で行って初めて意味を持つ。

## 手順

1. **成果物だけを取り出す。経緯は渡さない。**
   - コード/HTML変更なら `git diff`（該当ファイル・該当範囲のみ）を取得する。
   - コピー（LP文言）の変更なら、変更後の文言そのものを取り出す。
   - なぜその変更をしたか、どんな指示を受けたか、といった「経緯」はこの後のプロンプトに含めない。

2. **Agent ツールで独立したサブエージェント（`subagent_type: general-purpose` または `Explore`）を
   起動し、次のプロンプト（成果物だけを貼った状態）を渡す。** 会話履歴は共有されないので、
   これだけで経緯を知らない第三者としての採点になる。

   ```
   あなたは辛口の編集者兼レビュアーです。これから貼る変更を、作った経緯を一切知らない
   第三者として採点してください。このLPの対象読者は、仕事や育児で頑張りすぎて疲れている
   人（自分に問題があるとは思っていないが、しんどさを感じている大人）です。

   評価軸：
   ① 読者が最初の数行で「自分ごと」だと感じられるか
   ② 専門用語（心理学用語など）に説明がついているか
   ③ 誇張・断定しすぎ・根拠のない数字や実績になっていないか
   ④ 既存の文体（です・ます、煽りすぎない温度感）と一貫しているか
   ⑤ コード変更の場合：HTML構造やCSS変数の一貫性を壊していないか、既存のクラス/IDの
      命名規則から逸脱していないか

   出力形式：
   ・100点満点の点数
   ・減点理由を最大3つ、該当箇所を引用して
   ・直した方がいい順に修正案を最大3つ

   【変更内容】
   （ここに git diff またはコピー本文を貼る）
   ```

3. **返ってきた指摘を鵜呑みにせず、妥当なものだけ反映する。**
   - 指摘が「確認済みの事実」（CLAUDE.md）と矛盾する場合は指摘より事実を優先する。
   - 実際に直した場合は、変更後もう一度この手順を回す必要はない（1周で十分）。
   - 直さなかった指摘がある場合、理由をユーザーへの報告に一言添える。

4. **CLAUDE.md の更新。**
   - 検証で毎回同じ種類の指摘が出た場合、それは「学んだこと」または「未解決の失敗」に
     書き残す価値がある。同じ指摘が2回以上出たら、CLAUDE.md の「ルール」に昇格させる。

## 使わなくてよい場面
- 誤字修正やリンクURLの単純な差し替えなど、判断の余地がない変更。
- ユーザーが明示的に「検証は不要」と指示した場合。
