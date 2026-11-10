const L = require("./lib");
const R = require("./refs");
const { HEX } = L;

// PAUSE 5ステップ（全デッキ共通の図）
async function pauseSlide(d, s, y = 1.55, h = 5.15) {
  const { C } = d;
  const steps = [
    ["P", "Pause", "止まる", "ひと呼吸。\n6秒かけて\n長く吐く", "FaHandPaper", C.accent1],
    ["A", "Acknowledge", "認める", "「今、私は\n悔しい」と\n気持ちに名前を", "FaTag", C.accent5],
    ["U", "Unhook", "外す", "「〜という考えが\n浮かんでいる」と\n釣り針を外す", "FaUnlink", C.accent4],
    ["S", "Self-compassion", "思いやる", "「つらいよね。\n誰でもそうなる」\nと自分に", "FaHeart", C.accent1],
    ["E", "Engage", "取り組む", "大切なことに\n沿って\n最小の一歩", "FaShoePrints", C.accent6],
  ];
  const gap = 0.25, w = (12.1 - gap * 4) / 5;
  for (let i = 0; i < 5; i++) {
    const [L1, en, ja, desc, ic, col] = steps[i];
    const x = 0.6 + i * (w + gap);
    L.card(d, s, x, y, w, h);
    s.addShape(d.pres.ShapeType.ellipse, { x: x + (w - 1.3) / 2, y: y + 0.3, w: 1.3, h: 1.3, fill: { color: col }, line: { color: col }, objectName: "letter circle" });
    L.txt(s, L1, { x: x + (w - 1.3) / 2, y: y + 0.3, w: 1.3, h: 1.3, fontSize: 48, bold: true, color: C.background1, align: "center", valign: "middle" });
    L.txt(s, en, { x: x + 0.1, y: y + 1.75, w: w - 0.2, h: 0.4, fontSize: 14, color: C.accent5, align: "center" });
    L.txt(s, ja, { x: x + 0.1, y: y + 2.15, w: w - 0.2, h: 0.6, fontSize: 26, bold: true, color: C.text2, align: "center" });
    L.txt(s, desc, { x: x + 0.2, y: y + 2.95, w: w - 0.4, h: h - 3.15, fontSize: 15, color: C.text1, align: "center" });
  }
}

async function build(out) {
  const d = L.newDeck("入社1年目に学ぶ 職場の心理学");
  const { C, pres } = d;
  d.section = "表紙";
  pres.addSection({ title: "表紙" });

  // 1 表紙
  L.titleSlide(d, "入社1年目に学ぶ 職場の心理学\n心が折れても、自分で立て直せる人になる",
    "新人向けフォロープログラム（本研修 全2回）\nメンタルジム ｜ 臨床心理士・公認心理師 監修",
    "このプログラムの目的は「折れない心」ではなく「折れても自分で戻れる心」を育てることです。");

  // ---------- Part 0 プログラム案 ----------
  L.sectionSlide(d, "PART 0", "プログラムの全体像");

  let s = L.content(d, "現場で起きていること",
    "マネジャー・先輩・新人それぞれの立場で、今起きていることを共有します。企業向け提案ではヒアリング内容に差し替えてください。");
  await L.iconCards(d, s, [
    { icon: "FaUserTie", head: "マネジャー・先輩", body: "心が折れる新人への対応が大変。どこまで言っていいのか分からない。" },
    { icon: "FaPhoneSlash", head: "営業の現場", body: "お客さんに怒られて心が折れ、営業に行けなくなる。「営業だから」が通じなくなってきた。", circle: C.accent5 },
    { icon: "FaUserGraduate", head: "新人本人", body: "評価が怖い。指摘されると頭が真っ白になる。困っても聞けずに抱え込む。", circle: C.accent4 },
  ], { msg: "必要なのは「打たれ強さ」ではなく、打たれた後に自分で立て直す技術" });

  s = L.content(d, "数字で見る「新人のつまずき」",
    "33.8%は厚労省の公的統計。76.6%と32%は民間調査（査読なし）なので参考値として扱います。");
  const stats = [
    ["33.8%", "大卒の3年以内離職率", "厚生労働省（2025年公表）\n令和4年3月卒", C.accent1],
    ["76.6%", "入社後にリアリティ・ショックを\n経験した若手", "パーソル総合研究所 調査\n※民間調査", C.accent5],
    ["32%", "妥当な指摘でも、転職を\n考えたことがあるZ世代", "JobAssist 調査（8,250人）\n※民間調査・参考値", C.accent4],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 4.133, w = 3.833;
    L.card(d, s, x, 1.6, w, 4.9);
    L.txt(s, stats[i][0], { x: x + 0.3, y: 1.95, w: w - 0.6, h: 1.4, fontSize: 64, bold: true, color: stats[i][3], align: "center", valign: "middle" });
    L.txt(s, stats[i][1], { x: x + 0.3, y: 3.5, w: w - 0.6, h: 1.1, fontSize: 18, bold: true, color: C.text2, align: "center" });
    L.txt(s, stats[i][2], { x: x + 0.3, y: 5.0, w: w - 0.6, h: 0.9, fontSize: 12, color: C.accent5, align: "center" });
  }

  s = L.content(d, "「心が折れる」は、脳の防衛反応",
    "既存メンタルジムの「サメモード」と同じ考え方です。評価される場面は脳にとって危険信号。反応は3つに分かれます。");
  await L.iconCards(d, s, [
    { icon: "FaFistRaised", head: "戦う", body: "言い訳する、反論する、「あの客がおかしい」と愚痴り続ける" },
    { icon: "FaRunning", head: "逃げる", body: "電話をかけない、上司を避ける、次の訪問先に行けない", circle: C.accent5 },
    { icon: "FaSnowflake", head: "固まる", body: "頭が真っ白になる、車の中で30分動けない、手が止まる", circle: C.accent4 },
  ], { h: 3.6 });
  L.txt(s, "サメモードになるのは弱いからではない。問題は「戻れないこと」。", { x: 0.6, y: 5.6, w: 12.1, h: 0.8, fontSize: 22, bold: true, color: C.accent1, align: "center", valign: "middle" });

  s = L.content(d, "シャットダウンが癖になる仕組み",
    "ACTの「体験の回避」モデル（Hayes et al., 2006）。避けると一時的に楽になるので、回避が強化されます。意志の弱さではなく学習の仕組みです。");
  const loop = ["つらい出来事", "不快な感情", "避ける\n（聞かない・電話しない）", "一時的に\nホッとする", "仕事が滞り\n自信が下がる"];
  const bw = 2.1, bg = 0.4;
  for (let i = 0; i < 5; i++) {
    const x = 0.6 + i * (bw + bg + 0.0);
    L.card(d, s, x, 2.2, bw, 1.6, { fill: i === 2 ? HEX.accent2 : C.background2 });
    L.txt(s, loop[i], { x: x + 0.1, y: 2.2, w: bw - 0.2, h: 1.6, fontSize: 16, bold: true, color: C.text2, align: "center", valign: "middle" });
    if (i < 4) s.addShape(pres.ShapeType.rightArrow, { x: x + bw + 0.05, y: 2.82, w: 0.3, h: 0.36, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: "arrow" });
  }
  s.addShape(pres.ShapeType.uturnArrow, { x: 6.0, y: 4.0, w: 6.2, h: 0.9, flipH: true, flipV: true, fill: { color: C.accent2 }, line: { color: C.accent2 }, objectName: "loop arrow" });
  L.txt(s, "くり返すほど、回避が癖になる", { x: 1.0, y: 4.15, w: 4.8, h: 0.6, fontSize: 18, bold: true, color: C.accent1, valign: "middle" });
  L.txt(s, "回避・抑制・反すうは不調と関連し、受容・再評価・問題解決は心を守る（Aldao et al., 2010 メタ分析）", { x: 0.6, y: 5.5, w: 12.1, h: 0.8, fontSize: 15, color: C.text1 });

  s = L.content(d, "研究が教えてくれること",
    "プログラムの設計根拠です。詳しくは巻末の参考文献へ。");
  L.table(d, s, [
    ["分かっていること", "研究", "プログラムでは"],
    ["新人の適応は「役割の明確さ・自己効力感・受け入れられている感覚」で決まる", "Bauer et al. 2007（メタ分析）", "自分で立て直す力＋助けを求める力"],
    ["評価を恐れる新人ほど、助けを求められない", "Wang & Zhang 2021（新入社員636名）", "助けの求め方を台本で練習"],
    ["指摘の約1/3は、注意が「自分という人間」に向くと逆効果", "Kluger & DeNisi 1996（メタ分析）", "指摘を「情報」として受け取る"],
    ["感情を押し殺す（表層演技）ほど消耗する", "Hülsheger & Schewe 2011（メタ分析）", "感情は押し殺さず、名前をつける"],
    ["自分を思いやる人は、否定的評価で落ち込みにくく、責任は認める", "Leary et al. 2007", "セルフコンパッションは甘えではない"],
    ["心理的柔軟性は1年後の健康と業績を予測する", "Bond & Bunce 2003", "不安があっても動ける力を育てる"],
  ], { colW: [5.6, 3.4, 3.1], fontSize: 13, headSize: 14, y: 1.45 });

  s = L.content(d, "目指すのは「折れない心」ではない",
    "設計の中心となる考え方です。");
  L.card(d, s, 0.6, 1.6, 5.8, 4.9, { fill: "F4F1F2" });
  L.card(d, s, 6.9, 1.6, 5.8, 4.9);
  L.txt(s, "これまで", { x: 0.95, y: 1.9, w: 5.1, h: 0.5, fontSize: 16, color: C.accent5 });
  L.txt(s, "折れない心をつくる", { x: 0.95, y: 2.4, w: 5.1, h: 0.7, fontSize: 26, bold: true, color: C.accent5 });
  L.bullets(s, ["「営業なんだから慣れろ」", "「気にしないようにしよう」", "「ポジティブに考えよう」", "→ 感情を押し殺し、消耗する"], { x: 0.95, y: 3.3, w: 5.1, h: 3.0, color: C.text1 });
  L.txt(s, "このプログラム", { x: 7.25, y: 1.9, w: 5.1, h: 0.5, fontSize: 16, color: C.accent1 });
  L.txt(s, "折れても、自分で戻れる心", { x: 7.25, y: 2.4, w: 5.1, h: 0.7, fontSize: 26, bold: true, color: C.accent1 });
  L.bullets(s, ["落ち込むのは自然な反応と知る", "感情に名前をつけて受け止める", "考えと事実を分ける", "不安なまま、小さく一歩動く"], { x: 7.25, y: 3.3, w: 5.1, h: 3.0, color: C.text1 });

  s = L.content(d, "中核スキル「PAUSE（ポーズ）」",
    "メンタルジムのオリジナルモデル。各ステップは研究に基づいていますが、PAUSE全体の効果検証はこれからです。PAUSEは英語で「一時停止」。動画の一時停止ボタンのように、いったん止めていいと伝えます。");
  await pauseSlide(d, s);

  s = L.content(d, "PAUSEの各ステップの根拠",
    "日本語で覚えるなら「止まる・認める・外す・思いやる・取り組む」。");
  L.table(d, s, [
    ["ステップ", "背景理論", "主な研究"],
    ["P  Pause｜止まる", "マインドフルネス、ACT「今この瞬間」", "Hayes et al. 2006"],
    ["A  Acknowledge｜認める", "感情ラベリング（名づければ、手なずけられる）", "Lieberman et al. 2007"],
    ["U  Unhook｜外す", "ACT 脱フュージョン（考えの釣り針から外れる）", "Masuda et al. 2004 ／ David & Congleton 2013"],
    ["S  Self-compassion｜思いやる", "セルフコンパッション（やさしさ・共通の人間性・マインドフルネス）", "Neff 2003 ／ Leary et al. 2007 ／ Ferrari et al. 2019"],
    ["E  Engage｜取り組む", "ACT 価値とコミットされた行為、NVC", "Bond & Bunce 2003 ／ Unruh et al. 2022"],
  ], { colW: [3.6, 5.0, 3.5], fontSize: 14, boldFirst: true, y: 1.6, rowH: 0.75 });

  s = L.content(d, "1年間のスケジュール",
    "研修は1回で終わらせず、入社2年目の節目（尾形）と、支援が減っていく時期（Kammeyer-Mueller et al. 2013）に合わせて再接続します。");
  const tl = [
    ["入社1〜2か月", "上司・OJT向け\nセッション", "90分"],
    ["入社1〜2か月", "本研修 第1回\nP・A・S", "3時間"],
    ["〜2週間", "実践課題\nPAUSEログ", "1日30秒"],
    ["入社2〜3か月", "本研修 第2回\nU・E・NVC", "3時間"],
    ["研修後1・3か月", "上司1on1／\nピア・サークル", "30分"],
    ["入社6か月", "フォロー①\n慣れた頃の揺れ", "3時間"],
    ["入社12か月", "フォロー②\n2年目へ", "3時間"],
  ];
  s.addShape(pres.ShapeType.line, { x: 0.9, y: 2.55, w: 11.5, h: 0, line: { color: C.accent2, width: 3 }, objectName: "timeline" });
  for (let i = 0; i < tl.length; i++) {
    const cx = 0.9 + i * (11.5 / 6);
    const big = i === 1 || i === 3 || i === 5 || i === 6;
    const col = i >= 5 ? C.accent4 : big ? C.accent1 : C.accent5;
    s.addShape(pres.ShapeType.ellipse, { x: cx - 0.2, y: 2.35, w: 0.4, h: 0.4, fill: { color: col }, line: { color: C.background1, width: 2 }, objectName: "dot" });
    L.txt(s, tl[i][0], { x: cx - 0.85, y: 1.7, w: 1.7, h: 0.5, fontSize: 12, color: C.accent5, align: "center", valign: "bottom" });
    L.card(d, s, cx - 0.82, 3.05, 1.64, 2.5, { fill: big ? HEX.lt2 : "F6F3F4" });
    L.txt(s, tl[i][1], { x: cx - 0.77, y: 3.2, w: 1.54, h: 1.6, fontSize: 14, bold: true, color: C.text2, align: "center" });
    L.txt(s, tl[i][2], { x: cx - 0.77, y: 4.9, w: 1.54, h: 0.45, fontSize: 13, color: col, align: "center" });
  }
  L.txt(s, "研修では学びやすい順に、第1回で P・A・S（気持ちを受け止める）、第2回で U・E（考えと行動）を扱います。使う時は PAUSE の順。", { x: 0.6, y: 5.85, w: 12.1, h: 0.8, fontSize: 15, color: C.text1 });

  // ---------- 第1回 ----------
  L.sectionSlide(d, "本研修 第1回（3時間）", "「心が折れる仕組み」を知り、\n自分を思いやる",
    "第1回のゴール：心が折れるのは弱さではなく防衛反応だと理解する／P・A・Sを体験する／「自分に優しくする＝甘え」の思い込みをデータで外す。");

  s = L.content(d, "第1回のタイムテーブル");
  L.table(d, s, [
    ["時間", "内容", "形式"],
    ["0:00–0:15", "オープニング・安心の場づくり", "講義"],
    ["0:15–0:45", "ワーク①「入社してからの心の天気」", "個人→ペア"],
    ["0:45–1:15", "講義①「心が折れる」の正体：サメモードと3つの反応", "講義"],
    ["1:15–1:25", "休憩", ""],
    ["1:25–1:55", "ワーク②「止まる・認める」（P・A）", "個人→班"],
    ["1:55–2:25", "講義②＋ワーク③「親友ならなんて言う？」（S）", "講義→個人"],
    ["2:25–2:50", "ワーク④「P・A・S を通してやってみる」", "ペア"],
    ["2:50–3:00", "まとめ・実践課題（PAUSEログ）の説明", "講義"],
  ], { colW: [2.0, 7.7, 2.4], fontSize: 15, y: 1.45, rowH: 0.58 });

  s = L.content(d, "この場の約束",
    "評価を気にしやすい層ほど、最初の安心づくりが効きます。「人事評価に使わない」は事前に人事と書面で合意しておきます。講師自身の新人時代の失敗談を1つ話してください。");
  await L.iconCards(d, s, [
    { icon: "FaHandPaper", head: "パスOK", body: "話したくないことは話さなくていい", headSize: 20 },
    { icon: "FaShieldAlt", head: "ここだけの話", body: "聞いた話は外に出さない", circle: C.accent5 },
    { icon: "FaCheck", head: "正解はない", body: "「そう感じた」がすべて正解", circle: C.accent4 },
    { icon: "FaBan", head: "評価に使わない", body: "この研修の内容は人事評価に一切使わない", circle: C.accent6 },
  ], { msg: "安心できる場でなければ、評価が怖い人は本音を出せない" });

  s = L.content(d, "ワーク①　入社してからの心の天気",
    "共有は話せる範囲だけ。講師は「⛈️がなかった人いますか？」と聞き、ほぼ全員にあることを可視化します（共通の人間性）。データ：4人に3人がリアリティ・ショックを経験。");
  const weather = [["FaSun", "晴れ"], ["FaCloudSun", "晴れ時々くもり"], ["FaCloud", "くもり"], ["FaCloudRain", "雨"], ["FaBolt", "嵐"]];
  for (let i = 0; i < 5; i++) {
    const x = 0.9 + i * 2.4;
    await L.iconCircle(d, s, x + 0.35, 1.65, 1.0, weather[i][0], i < 2 ? C.accent3 : i < 3 ? C.accent2 : C.accent5, i < 2 ? "8A5F67" : "FFFFFF");
    L.txt(s, weather[i][1], { x: x - 0.2, y: 2.75, w: 2.1, h: 0.4, fontSize: 14, color: C.text2, align: "center" });
  }
  L.card(d, s, 0.6, 3.5, 12.1, 3.0);
  L.txt(s, "やり方", { x: 0.95, y: 3.75, w: 3, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
  L.bullets(s, [
    "入社〜今日までの時間軸に、心の天気を書き込む",
    "嵐の日に何があった？　その時どうした？（戦う／逃げる／固まる）",
    "ペアで、話せる範囲だけ共有する",
  ], { x: 0.95, y: 4.3, w: 11.4, h: 2.0, color: C.text1 });

  s = L.content(d, "講義①　サメモードとイルカモード",
    "既存メンタルジムの枠組み。サメモードは悪者ではなく、脳があなたを守ろうとしているサイン。新人期は「初めて」と「評価される」が毎日続くので、誰でもサメモードになりやすい。");
  L.card(d, s, 0.6, 1.6, 5.8, 4.9, { fill: "F3EEF0" });
  L.card(d, s, 6.9, 1.6, 5.8, 4.9, { fill: "EAF3F1" });
  L.txt(s, "サメモード（防衛）", { x: 0.95, y: 1.85, w: 5.1, h: 0.6, fontSize: 24, bold: true, color: C.accent5 });
  L.bullets(s, ["危険を察知して身を守ろうとしている", "指摘を攻撃と感じる・言い訳する", "電話や上司を避ける・頭が真っ白になる", "頭の声：「怒られた＝嫌われた」「向いてない」"], { x: 0.95, y: 2.6, w: 5.1, h: 3.7, color: C.text1, fontSize: 18 });
  L.txt(s, "イルカモード（安心）", { x: 7.25, y: 1.85, w: 5.1, h: 0.6, fontSize: 24, bold: true, color: C.accent6 });
  L.bullets(s, ["安心をベースに、好奇心で動いている", "指摘を「情報」として受け取れる", "分からないことを聞ける・相手の事情を想像できる", "頭の声：「悔しいな」「ここを直せばいい」"], { x: 7.25, y: 2.6, w: 5.1, h: 3.7, color: C.text1, fontSize: 18 });

  s = L.content(d, "ワーク②　止まる（P）・認める（A）",
    "思い出すのは10段階で4〜5程度の出来事に限定します。感情に名前をつけるだけで扁桃体の反応が下がる（Lieberman et al., 2007）。");
  await L.iconCircle(d, s, 0.6, 1.6, 0.9, "FaHandPaper", C.accent1);
  L.txt(s, "P　止まる", { x: 1.7, y: 1.6, w: 4.5, h: 0.9, fontSize: 24, bold: true, color: C.text2, valign: "middle" });
  L.bullets(s, ["60秒、足の裏の感覚に注意を向ける", "4秒吸って、6秒吐く × 3回"], { x: 0.6, y: 2.75, w: 5.6, h: 1.6, color: C.text1 });
  await L.iconCircle(d, s, 6.9, 1.6, 0.9, "FaTag", C.accent5);
  L.txt(s, "A　認める", { x: 8.0, y: 1.6, w: 4.5, h: 0.9, fontSize: 24, bold: true, color: C.text2, valign: "middle" });
  L.bullets(s, ["最近の「嵐」の場面を1つ思い出す", "表のイライラの下にある気持ちを探す", "「今、私は〇〇を感じている」と言う"], { x: 6.9, y: 2.75, w: 5.8, h: 1.8, color: C.text1 });
  L.table(d, s, [
    ["表に出やすい感情", "その下にあるかもしれない感情"],
    ["イライラ・怒り", "悔しい／がっかり／分かってほしい／疲れている"],
    ["落ち込み", "悲しい／恥ずかしい／自信がない／取り残された感じ"],
    ["焦り", "不安／怖い／期待に応えたい"],
  ], { x: 0.6, y: 4.65, colW: [3.0, 9.1], fontSize: 14 });

  s = L.content(d, "講義②　自分を思いやるのは「甘え」じゃない",
    "Breines & Chen (2012)：失敗後にセルフコンパッション条件に割り付けられた人は、改善への意欲が高く、難しいテスト後に長く勉強した。Leary et al. (2007)：否定的評価を受けても落ち込みが小さく、責任を認める度合いは下がらない。");
  L.card(d, s, 0.6, 1.6, 5.8, 2.6, { fill: "F4F1F2" });
  L.txt(s, "甘やかし", { x: 0.95, y: 1.8, w: 5.1, h: 0.6, fontSize: 22, bold: true, color: C.accent5 });
  L.txt(s, "「もういいや」と現実から目を背ける\n→ 停滞する", { x: 0.95, y: 2.5, w: 5.1, h: 1.5, fontSize: 16, color: C.text1 });
  L.card(d, s, 6.9, 1.6, 5.8, 2.6);
  L.txt(s, "自分を思いやる", { x: 7.25, y: 1.8, w: 5.1, h: 0.6, fontSize: 22, bold: true, color: C.accent1 });
  L.txt(s, "「つらいね」と現実を見た上で、自分を支える\n→ 回復して、次の一歩へ", { x: 7.25, y: 2.5, w: 5.1, h: 1.5, fontSize: 16, color: C.text1 });
  const data = [["改善への意欲が上がる", "Breines & Chen 2012"], ["否定的な評価で落ち込みにくい\n（しかも責任は認める）", "Leary et al. 2007"], ["ストレス・抑うつが改善\n（27のRCT）", "Ferrari et al. 2019"]];
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 4.133;
    L.card(d, s, x, 4.5, 3.833, 2.0, { fill: "FFFFFF" });
    L.txt(s, data[i][0], { x: x + 0.25, y: 4.65, w: 3.33, h: 1.15, fontSize: 16, bold: true, color: C.text2 });
    L.txt(s, data[i][1], { x: x + 0.25, y: 5.9, w: 3.33, h: 0.4, fontSize: 12, color: C.accent5 });
  }

  s = L.content(d, "ワーク③　フレンドトレーニング（S）",
    "既存「セルフコンパッション・プレイブック」WORK 01を新人向けに改変。スージングタッチは任意です。");
  const ft = [
    ["1", "想像する", "同期の親友が、あなたと全く同じ失敗をして落ち込んでいる"],
    ["2", "親友への言葉", "その親友に、どんな言葉をかける？　書き出す"],
    ["3", "自分への言葉", "同じ場面で、自分が自分にかけている言葉を書く"],
    ["4", "ギャップを見る", "2と3の違いに気づく。2の言葉を主語を自分にして読む"],
    ["5", "体からも", "手を胸に当てる・腕をさする（任意）"],
  ];
  for (let i = 0; i < 5; i++) {
    const y = 1.55 + i * 1.04;
    s.addShape(pres.ShapeType.ellipse, { x: 0.6, y: y + 0.1, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: "num" });
    L.txt(s, ft[i][0], { x: 0.6, y: y + 0.1, w: 0.7, h: 0.7, fontSize: 22, bold: true, color: C.background1, align: "center", valign: "middle" });
    L.card(d, s, 1.55, y, 11.15, 0.9, { noShadow: true });
    L.txt(s, ft[i][1], { x: 1.85, y: y, w: 2.6, h: 0.9, fontSize: 18, bold: true, color: C.text2, valign: "middle" });
    L.txt(s, ft[i][2], { x: 4.5, y: y, w: 8.0, h: 0.9, fontSize: 16, color: C.text1, valign: "middle" });
  }

  s = L.content(d, "ワーク④　P・A・S を通してやってみる",
    "ペアでケースカードを1枚引く。声に出して（または紙に書いて）P→A→S。相手はただ聞く（アドバイス禁止）。交代。");
  L.card(d, s, 0.6, 1.6, 5.4, 4.9, { fill: HEX.accent2 });
  await L.iconCircle(d, s, 0.95, 1.9, 0.8, "FaComments", C.background1, HEX.accent1);
  L.txt(s, "ケース例", { x: 1.95, y: 1.9, w: 3.8, h: 0.8, fontSize: 22, bold: true, color: C.text2, valign: "middle" });
  L.txt(s, "先輩から、みんなの前で\n「これ、前も言ったよね？」\nと言われた", { x: 0.95, y: 3.0, w: 4.8, h: 3.2, fontSize: 20, color: C.text2 });
  const pas = [["P 止まる", "息を6秒かけて吐く。足の裏を感じる"], ["A 認める", "「今、私は恥ずかしくて、怖い」"], ["S 思いやる", "「みんなの前は誰でもつらい。覚えることが多い時期だもんね」"]];
  for (let i = 0; i < 3; i++) {
    const y = 1.6 + i * 1.7;
    L.card(d, s, 6.4, y, 6.3, 1.5);
    L.txt(s, pas[i][0], { x: 6.7, y: y + 0.15, w: 5.8, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
    L.txt(s, pas[i][1], { x: 6.7, y: y + 0.7, w: 5.8, h: 0.7, fontSize: 16, color: C.text1 });
  }

  s = L.content(d, "実践課題：2週間のPAUSEログ",
    "提出は不要（本人管理）。できなかった日も「今日はできなかった」と書くこと自体がA（認める）です。");
  L.table(d, s, [
    ["日付", "何があった？（事実だけ）", "A 気持ち／強さ", "S 自分にかけた言葉", "後の強さ"],
    ["5/12", "課長に資料を「全然違う」と返された", "恥ずかしい・怖い／7", "「初めての資料だし、直せばいい」", "4"],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ], { colW: [1.1, 4.4, 2.4, 3.2, 1.0], fontSize: 14, y: 1.6, rowH: 0.75 });
  L.bullets(s, ["1日1回、心が少しでも揺れた場面で P・A・S を試す（30秒）", "揺れなかった日は「今日の小さなできた」を1つ書く", "書けなかった日があってもOK。できなかった自分にもS"], { x: 0.6, y: 4.85, w: 12.1, h: 1.8, color: C.text1 });

  // ---------- 第2回 ----------
  L.sectionSlide(d, "本研修 第2回（3時間）", "考えの釣り針を外し、\n動き出す・伝える",
    "第2回のゴール：U・Eを身につける／働く上での価値を言葉にする／NVCで3つの台本を持つ。");

  s = L.content(d, "第2回のタイムテーブル");
  L.table(d, s, [
    ["時間", "内容", "形式"],
    ["0:00–0:20", "PAUSEログの振り返り（「できなかった」報告を一番歓迎する）", "班"],
    ["0:20–1:00", "講義③＋ワーク⑤「考えの釣り針を外す」（U）", "講義→個人→ペア"],
    ["1:00–1:30", "ワーク⑥「私が働く上で大切にしたいこと」（E：価値）", "個人→班"],
    ["1:30–1:40", "休憩", ""],
    ["1:40–2:20", "講義④＋ワーク⑦「NVCで伝える：3つの台本」（E：行動）", "講義→ロールプレイ"],
    ["2:20–2:45", "ワーク⑧「PAUSE フルバージョン」ロールプレイ", "3人組"],
    ["2:45–3:00", "まとめ・「マイ・リカバリープラン」作成", "個人"],
  ], { colW: [2.0, 7.3, 2.8], fontSize: 15, y: 1.45, rowH: 0.62 });

  s = L.content(d, "講義③　頭の声は「事実」ではなく「仮説」",
    "否定的な自己関連思考は、短い脱フュージョン練習で信じ込み度と不快感が下がる（Masuda et al., 2004）。考えを消すのではなく、持ったまま動けるようにするのがゴール（「51％の安心」）。");
  L.card(d, s, 0.6, 1.6, 12.1, 1.9);
  await L.iconCircle(d, s, 0.95, 1.95, 1.2, "FaUnlink", C.accent4);
  L.txt(s, "U ＝ Unhook（外す）", { x: 2.45, y: 1.85, w: 9.9, h: 0.6, fontSize: 24, bold: true, color: C.text2 });
  L.txt(s, "「私は営業に向いてない」\n→「『私は営業に向いてない』という考えが浮かんでいる」", { x: 2.45, y: 2.5, w: 9.9, h: 0.9, fontSize: 17, color: C.text1 });
  L.table(d, s, [
    ["起きたこと（カメラに映る事実）", "頭が言ったこと（解釈・予言）"],
    ["課長が資料を見て「ここ違う」と言った", "「課長は私を無能だと思っている」"],
    ["お客さんが「もういい」と電話を切った", "「会社に迷惑をかけた。もう終わりだ」"],
    ["3件連続で断られた", "「次も断られるに決まっている」"],
  ], { y: 3.8, colW: [6.05, 6.05], fontSize: 15, rowH: 0.62 });

  s = L.content(d, "ワーク⑤　指摘を3つに分けて、①だけ持ち帰る",
    "指摘を人格否定と受け取る癖への対策。注意が「自分」ではなく「課題」に向くようにします（Kluger & DeNisi, 1996）。よく出るネガティブストーリーに名前をつける練習もここで（例：「向いてない物語」）。");
  await L.iconCards(d, s, [
    { icon: "FaClipboardCheck", head: "① 課題の情報", body: "持ち帰るのはここだけ\n\n例：「結論を先に書く」", circle: C.accent6 },
    { icon: "FaCommentDots", head: "② 相手の感情・言い方", body: "相手のもの。自分が背負わなくていい\n\n例：課長が急いでいて口調がきつかった", circle: C.accent5 },
    { icon: "FaUnlink", head: "③ 私についての解釈", body: "釣り針を外す\n\n例：「私は仕事ができない人間だ」という考えが浮かんでいる", circle: C.accent4 },
  ], { msg: "注意を「自分という人間」から「課題」に戻す", h: 4.15, bodySize: 15 });

  s = L.content(d, "ワーク⑥　私が働く上で大切にしたいこと",
    "価値は「方角」で、ゴールとは違う。心理的柔軟性は1年後のメンタルヘルスと業績を予測する（Bond & Bunce, 2003）。価値は評価に左右されない、自分だけのもの。");
  const vals = ["誠実", "成長", "貢献", "つながり", "挑戦", "丁寧さ", "信頼", "学び", "やさしさ", "責任", "好奇心", "チームワーク"];
  for (let i = 0; i < vals.length; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    const x = 0.6 + col * 2.03, y = 1.6 + row * 0.85;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 1.85, h: 0.65, rectRadius: 0.3, fill: { color: i === 2 ? HEX.accent1 : HEX.lt2 }, line: { color: HEX.accent2, width: 1 }, objectName: "value chip" });
    L.txt(s, vals[i], { x, y, w: 1.85, h: 0.65, fontSize: 16, bold: true, color: i === 2 ? C.background1 : C.text2, align: "center", valign: "middle" });
  }
  L.card(d, s, 0.6, 3.5, 12.1, 3.0);
  L.txt(s, "やり方", { x: 0.95, y: 3.7, w: 3, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
  L.bullets(s, ["価値カードを 5枚 → 3枚 → 1枚 に絞る", "「その価値を大切にする私は、明日職場で何をする？」を3つ書く", "営業の例：価値「お客さんの役に立つ」→ 怒られた後の一歩「お客さんが何に困っていたかをメモする」"], { x: 0.95, y: 4.25, w: 11.4, h: 2.1, color: C.text1 });

  s = L.content(d, "講義④　NVC（非暴力コミュニケーション）の4つの要素",
    "ジャッカル語（評価・非難）とキリン語（感情・ニーズ）。相手の怒りも「満たされていないニーズの表現」として聞くと、感情を押し殺す表層演技を減らせます。NVCは小〜中規模の研究のみで、メタ分析はまだありません。");
  const nvc = [["観察", "評価を混ぜずに、起きたことを言う", "FaEye"], ["感情", "そのとき感じていることを言う", "FaHeart"], ["ニーズ", "その奥で大切にしたいこと", "FaSeedling"], ["リクエスト", "具体的で、断ることもできるお願い", "FaHandsHelping"]];
  for (let i = 0; i < 4; i++) {
    const x = 0.6 + i * 3.1;
    L.card(d, s, x, 1.6, 2.8, 3.0);
    await L.iconCircle(d, s, x + 0.95, 1.85, 0.9, nvc[i][2], [C.accent1, C.accent5, C.accent6, C.accent4][i]);
    L.txt(s, nvc[i][0], { x: x + 0.2, y: 2.9, w: 2.4, h: 0.6, fontSize: 22, bold: true, color: C.text2, align: "center" });
    L.txt(s, nvc[i][1], { x: x + 0.2, y: 3.55, w: 2.4, h: 0.95, fontSize: 15, color: C.text1, align: "center" });
    if (i < 3) s.addShape(pres.ShapeType.rightArrow, { x: x + 2.83, y: 2.9, w: 0.24, h: 0.3, fill: { color: C.accent2 }, line: { color: C.accent2 }, objectName: "arrow" });
  }
  L.card(d, s, 0.6, 4.9, 12.1, 1.6, { fill: "FFFFFF" });
  L.txt(s, "台本① 助けを求める", { x: 0.9, y: 5.0, w: 4, h: 0.45, fontSize: 16, bold: true, color: C.accent1 });
  L.txt(s, "「〇〇の作業で△△が分からず手が止まっています。少し焦っていて、期限までに正しく仕上げたいので、進め方だけ教えていただけますか？」", { x: 0.9, y: 5.45, w: 11.5, h: 0.95, fontSize: 15, color: C.text1 });

  s = L.content(d, "台本②・③　フィードバック／怒っている相手",
    "人格否定・暴言・ハラスメントは受け止めるものではありません。その場を離れる、上司に引き継ぐのも正しい選択です。社内の対応ルールを事前に確認し、研修で明示してください。");
  L.card(d, s, 0.6, 1.6, 5.8, 4.9);
  L.txt(s, "台本② フィードバックを取りにいく", { x: 0.9, y: 1.85, w: 5.2, h: 0.5, fontSize: 18, bold: true, color: C.accent1 });
  L.txt(s, "「先ほどの商談、〇〇の説明でお客さんの反応が薄かったと感じました。次はもっと伝わるようにしたいので、1つだけ改善点を教えていただけますか？」", { x: 0.9, y: 2.45, w: 5.2, h: 2.4, fontSize: 16, color: C.text1 });
  L.txt(s, "ポイント：「1つだけ」と量を限定すると、評価が怖い人でも受け取れる", { x: 0.9, y: 5.1, w: 5.2, h: 1.2, fontSize: 14, color: C.accent5 });
  L.card(d, s, 6.9, 1.6, 5.8, 4.9);
  L.txt(s, "台本③ 怒っている相手と向き合う", { x: 7.2, y: 1.85, w: 5.2, h: 0.5, fontSize: 18, bold: true, color: C.accent1 });
  L.txt(s, "心の中で：A「怖い」→ U「『全部台無し』という考えが浮かんでいる」→ S「誰でも怖い」", { x: 7.2, y: 2.45, w: 5.2, h: 1.1, fontSize: 15, color: C.accent4 });
  L.txt(s, "相手のニーズを推測：信頼？　時間？　尊重？", { x: 7.2, y: 3.6, w: 5.2, h: 0.5, fontSize: 15, color: C.text1 });
  L.txt(s, "「ご不便をおかけして、お困りになったと思います。確実に進めたいお気持ち、よく分かりました。今日中に上司と確認して、〇時までにご連絡してもよろしいでしょうか？」", { x: 7.2, y: 4.15, w: 5.2, h: 2.2, fontSize: 15, color: C.text1 });

  s = L.content(d, "営業の現場での PAUSE",
    "ロールプレイ（3人組：新人役・相手役・観察役）のケースにも使えます。観察役は「良かった点」を先に2つ伝えます。");
  L.table(d, s, [
    ["場面", "P 止まる", "A 認める", "U 外す", "S 思いやる", "E 取り組む"],
    ["架電で断られ続ける", "受話器を置いて息を吐く", "「凹んでる、怖い」", "「『次も断られる』という予言が浮かんでいる」", "「断られて平気な人はいない」", "次の1件だけかける"],
    ["商談で厳しく否定された", "車のシートで足裏を感じる", "「恥ずかしい、悔しい」", "「否定されたのは提案。私という人間ではない」", "「頑張って準備したもんね」", "理由を1行メモ→先輩に台本②"],
    ["クレームで怒鳴られた", "心の中でひと呼吸", "「怖い、焦っている」", "「『全部自分のせい』という考え」", "「誰でも動揺する」", "台本③。権限外なら上司に引き継ぐ"],
  ], { colW: [2.1, 2.0, 1.8, 2.5, 1.9, 1.8], fontSize: 14, headSize: 14, y: 1.55, boldFirst: true, rowH: [0.5, 1.4, 1.4, 1.4] });

  s = L.content(d, "マイ・リカバリープラン（1枚）",
    "作ったプランは研修後1か月の上司1on1で共有します（共有範囲は本人が決める）。6か月後のフォローアップに持参してもらいます。");
  const plan = [
    ["FaExclamationTriangle", "サメモードになりやすい場面", "と、そのときの体・頭・行動のサイン"],
    ["FaPause", "私のPAUSEフレーズ", "P・A・U・S・E を自分の言葉で"],
    ["FaCompass", "私の価値と最小の一歩", "落ち込んだ時の5分以内の行動を3つ"],
    ["FaUsers", "頼れる人", "社内2人・社外1人"],
    ["FaComments", "使える台本", "助けを求める／FBをもらう／怒っている相手"],
    ["FaFirstAid", "「研修では足りない」サイン", "眠れない・食べられない日が2週間続く等と、相談先"],
  ];
  for (let i = 0; i < 6; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2, y = 1.55 + row * 1.7;
    L.card(d, s, x, y, 5.9, 1.5);
    await L.iconCircle(d, s, x + 0.3, y + 0.3, 0.9, plan[i][0], i === 5 ? C.accent5 : C.accent1);
    L.txt(s, plan[i][1], { x: x + 1.45, y: y + 0.2, w: 4.25, h: 0.55, fontSize: 18, bold: true, color: C.text2 });
    L.txt(s, plan[i][2], { x: x + 1.45, y: y + 0.75, w: 4.25, h: 0.65, fontSize: 14, color: C.text1 });
  }

  // ---------- 運用 ----------
  L.sectionSlide(d, "運用", "上司・先輩とのセット実施と\n効果測定");

  s = L.content(d, "上司・先輩向け：折れにくくする伝え方の3原則",
    "新人が台本①で助けを求めても「そんなことも分からないの？」と返されたら、回避がかえって強まります。だから上司・先輩向け90分セッションをセットで実施します。");
  await L.iconCards(d, s, [
    { icon: "FaBullseye", head: "人ではなく課題に", body: "×「なんでこんなこともできないの？」\n○「結論を最初に持ってこよう」\n\nKluger & DeNisi 1996" },
    { icon: "FaSeedling", head: "失敗は学びのデータ", body: "×「次ミスしたら許さないよ」\n○「仕組みの穴が見つかった。一緒に見よう」\n\nEdmondson 1999", circle: C.accent6 },
    { icon: "FaFilter", head: "量を絞る", body: "×10個まとめて指摘\n○「今日は1つだけ。ここを直そう」\n\n受け取れる量を超えるとシャットダウンしやすい", circle: C.accent4 },
  ], { msg: "新人が「助けて」と言えた時の最初の一言が、次の相談を決める", h: 4.25, bodySize: 15 });

  s = L.content(d, "効果測定",
    "個人の結果は本人のみに返却し、会社には集団の集計のみを渡します。K6が高得点（目安13点以上）の人は、本人の同意のもと産業医・EAPにつなぎます。尺度の使用許諾条件は事前に確認してください。");
  L.table(d, s, [
    ["時点", "心理指標", "行動・ビジネス指標"],
    ["T0 第1回の直前", "セルフコンパッション（SCS-SF）、心理的柔軟性（AAQ-II／WAAQ）、否定的評価への恐れ（Brief FNE）、回復力（BRS）、K6、UWES-9", "—"],
    ["T1 第2回の直後", "同上＋研修満足度", "「明日使えそうか」"],
    ["T2 6か月後", "同上", "PAUSEの使用頻度、援助要請の頻度"],
    ["T3 12か月後", "同上", "1年後在籍率、休職数、上司評価、（営業）成約数など"],
  ], { colW: [2.4, 6.4, 3.3], fontSize: 14, y: 1.5, rowH: 0.9, boldFirst: true });

  s = L.content(d, "安全に実施するために");
  await L.iconCards(d, s, [
    { icon: "FaFirstAid", head: "研修は治療ではない", body: "強い抑うつ・不眠・「消えたい」などのサインがある人は、専門職へつなぐことを優先する" },
    { icon: "FaBuilding", head: "環境の問題を個人の問題にしない", body: "ハラスメントや過重労働が原因の場合は、新人のスキルで解決すべきものではない。匿名化して人事へフィードバック", circle: C.accent5 },
    { icon: "FaLock", head: "評価と切り離す", body: "研修内容・測定結果は人事評価に使わない。共有はすべて任意", circle: C.accent4 },
  ], { msg: "強い不調のサインがある人は、研修より専門的支援を優先する" });

  // 参考文献
  L.sectionSlide(d, "参考文献", "使用した論文・データ");
  L.refSlides(d, "参考文献", [R.mhlw, R.persol, R.ogata, R.bauer, R.louis, R.km, R.wang, R.kluger, R.anseel, R.arvan, R.sliter, R.hulsheger, R.hayes, R.aldao, R.lieberman, R.masuda, R.david, R.neff, R.leary, R.breines, R.ferrari, R.kotera, R.bond, R.unruh, R.wacker, R.epinat, R.edmondson, R.haimovitz], 8);

  s = L.content(d, "参考文献についての注意");
  L.bullets(s, [
    "厚労省以外のビジネスデータ（76.6%・32%）と尾形氏の連載、David & Congleton（HBR）は査読論文ではありません。参考値として扱ってください",
    "Haimovitz & Dweck (2016) は親子の研究です。上司と新人に当てはめるのは推論です",
    "NVCの研究は小〜中規模のみで、メタ分析はまだありません",
    "PAUSEはメンタルジムのオリジナルモデルです。各ステップには研究の裏付けがありますが、PAUSE全体の効果検証はこれからです",
  ], { x: 0.6, y: 1.6, w: 12.1, h: 4.8, color: C.text1, fontSize: 18 });

  L.titleSlide(d, "サメモードになるのは、弱いからじゃない。\n戻ってこられれば、それでいい。", "心が折れそうになったら、PAUSE（ポーズ）\n止まる・認める・外す・思いやる・取り組む");

  await L.save(d, out);
}
module.exports = { build, pauseSlide };
if (require.main === module) build(process.argv[2] || "main.pptx").catch((e) => { console.error(e); process.exit(1); });
