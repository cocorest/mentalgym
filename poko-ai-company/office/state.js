// ぽこAIカンパニー オフィスの状態ファイル
// AI社員が仕事をするたびに、ぽこがここを書きかえます。画面は5秒ごとに自動で更新されます。
window.POKO_STATE = {
  "company": "ぽこAIカンパニー",
  "boss": "社長",
  "updated": "2026-10-10 09:00",
  "theme": {
    "main": "#2f8f6b",
    "sub": "#f29b38",
    "wall": "#cfeadb",
    "floor": "#e8cfa6",
    "panel": "#fffaf0"
  },
  "staff": [
    { "id": "poko",    "name": "ぽこ",     "role": "秘書",       "animal": "tanuki", "color": "#a07850", "status": "working", "say": "今日もよろしくお願いします！" },
    { "id": "tsumiki", "name": "つみき",   "role": "アプリ担当", "animal": "bear",   "color": "#6c8fd6", "status": "idle",    "say": "" },
    { "id": "kotoha",  "name": "ことは",   "role": "文章担当",   "animal": "rabbit", "color": "#e9a3b8", "status": "idle",    "say": "" },
    { "id": "soroban", "name": "そろばん", "role": "経理担当",   "animal": "chick",  "color": "#f2c94c", "status": "idle",    "say": "" },
    { "id": "yubin",   "name": "ゆうびん", "role": "メール担当", "animal": "cat",    "color": "#9aa5b1", "status": "idle",    "say": "" }
  ],
  "today": [
    { "text": "「はじめまして」と送って初期設定をする", "done": false }
  ],
  "waiting": [],
  "outputs": [],
  "log": [
    { "time": "09:00", "who": "ぽこ", "text": "オフィスがオープンしました" }
  ]
};
