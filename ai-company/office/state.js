// AIカンパニー オフィスの状態ファイル
// AI社員が仕事をするたびに、エリーがここを書きかえます。画面は5秒ごとに自動で更新されます。
window.POKO_STATE = {
  "company": "AIカンパニー",
  "boss": "社長",
  "updated": "2026-10-10 09:00",
  "theme": {
    "main": "#c4687f",
    "sub": "#a993cf",
    "wall": "#fbe9ec",
    "floor": "#ead9c6",
    "panel": "#ffffff"
  },
  "staff": [
    { "id": "ellie",   "name": "エリー",     "role": "秘書",       "animal": "tanuki",  "color": "#b48a6a", "outfit": "#f3d4dc", "acc": "ribbon",  "accColor": "#c4687f", "status": "working", "say": "今日もよろしくお願いします♡" },
    { "id": "tsumiki", "name": "つみき",   "role": "アプリ担当", "animal": "bear",    "color": "#c9a88c", "outfit": "#d8cbee", "acc": "headset", "accColor": "#a993cf", "status": "idle",    "say": "" },
    { "id": "kotoha",  "name": "ことは",   "role": "文章担当",   "animal": "rabbit",  "color": "#fbf4f1", "outfit": "#eeb3c2", "acc": "beret",   "accColor": "#a993cf", "status": "idle",    "say": "" },
    { "id": "soropon", "name": "そろぽん", "role": "経理担当",   "animal": "hamster", "color": "#efcfa6", "outfit": "#f7e6d2", "acc": "glasses", "accColor": "",        "status": "idle",    "say": "" },
    { "id": "yupin",   "name": "ゆうぴん", "role": "メール担当", "animal": "cat",     "color": "#d9d3dc", "outfit": "#f6cdd7", "acc": "scarf",   "accColor": "#a993cf", "status": "idle",    "say": "" }
  ],
  "today": [
    { "text": "「はじめまして」と送って初期設定をする", "done": false }
  ],
  "waiting": [],
  "outputs": [],
  "log": [
    { "time": "09:00", "who": "エリー", "text": "オフィスがオープンしました" }
  ]
};
