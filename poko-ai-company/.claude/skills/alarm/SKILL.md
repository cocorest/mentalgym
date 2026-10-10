---
name: alarm
description: アラーム・リマインダーをセットする。社長が「アラーム」「リマインド」「〇時に知らせて」「忘れないように」と言ったときに使う。
---

# アラーム・リマインダーをセットする

Claude はパソコンを閉じると動けないので、アラームは **カレンダー** にまかせます。スマホにも通知が届くので確実です。

## 手順
1. 確認すること：
   - 何のアラーム？（タイトル）
   - いつ？（日付と時刻。「明日」「来週月曜」などは具体的な日付に直して見せる）
   - 何分前に知らせる？（言われなければ「10分前」と「時間ちょうど」）
   - くり返す？（毎日／毎週／くり返さない）
2. 日時を「2026年10月11日（日）9:00」のように曜日つきで見せて確認する。
3. セットする方法を選ぶ：
   - **A. Googleカレンダーがつながっている場合**：予定を作成し、通知を設定する。
   - **B. つながっていない場合**：`.ics` ファイル（カレンダーに追加できるファイル）をつくり、`できたもの/アラーム/YYYY-MM-DD_タイトル.ics` に保存する。「ダブルクリックするとカレンダーに追加されます。スマホのカレンダーと同期していれば、スマホでも鳴ります」と案内する。

## .ics ファイルの型
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//POKO AI COMPANY//JA
BEGIN:VEVENT
UID:（日時＋ランダムな文字列）@poko-ai
DTSTAMP:（今の日時 UTC 例 20261010T010000Z）
DTSTART;TZID=Asia/Tokyo:20261011T090000
DTEND;TZID=Asia/Tokyo:20261011T091500
SUMMARY:（タイトル）
RRULE:FREQ=WEEKLY（くり返すときだけ）
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:（タイトル）
TRIGGER:-PT10M
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:（タイトル）
TRIGGER:PT0M
END:VALARM
END:VEVENT
END:VCALENDAR
```

## 注意
- 時間帯は日本時間（Asia/Tokyo）。社長が海外在住なら、最初に住んでいる地域を聞く。
- 予定の削除や変更は、社長に確認してから行う。
