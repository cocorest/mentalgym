const L = require("./lib");
const R = require("./refs");
const { pauseSlide } = require("./build_main");
const { HEX } = L;

async function sixMonth(out) {
  const d = L.newDeck("6か月後フォローアップ研修");
  const { C, pres } = d;
  d.section = "表紙"; pres.addSection({ title: "表紙" });
  L.titleSlide(d, "6か月後フォローアップ研修\n慣れた頃に来る揺れと、自分を守るやさしさ",
    "入社1年目に学ぶ 職場の心理学 ｜ 3時間\nメンタルジム ｜ 臨床心理士・公認心理師 監修",
    "研修直後の効果は時間とともに薄れやすく（Unruh et al., 2022）、入社直後の手厚い支援は90日で減っていきます（Kammeyer-Mueller et al., 2013）。だから6か月で再接続します。");

  L.sectionSlide(d, "PART 1", "なぜ今、もう一度");
  let s = L.content(d, "半年経った頃に起きやすいこと",
    "最初のショックは越えたけれど、別の種類の揺れが来る時期です。参加者に当てはまるものを聞いてみてください。");
  await L.iconCards(d, s, [
    { icon: "FaUserClock", head: "「できて当然」扱い", body: "支援が減っていく。\n「もう新人じゃないのに、まだできない」" },
    { icon: "FaBalanceScale", head: "同期との差", body: "配属・成績・評価の差が見え始める。\n「あいつはもう任されてるのに」", circle: C.accent5 },
    { icon: "FaBatteryQuarter", head: "疲れが溜まる", body: "「なんとなくやる気が出ない」\n「朝がしんどい」", circle: C.accent4 },
    { icon: "FaHandPaper", head: "断れない", body: "理不尽な要求が増える。\n「断ったら評価が下がる」", circle: C.accent6 },
  ], { msg: "6か月の今日は「回復の実績」を確認し、新しい揺れへの備えをつくる日" });

  s = L.content(d, "今日のゴール");
  const goals = [
    ["1", "6か月間の自分の回復の「実績」を確認し、自己効力感を高める"],
    ["2", "「やさしいセルフコンパッション」に加えて「守るセルフコンパッション」を身につける"],
    ["3", "比較の罠から抜けて、「過去の自分」と比べる"],
    ["4", "NVCで「断る」「意見を言う」台本を持つ"],
  ];
  for (let i = 0; i < 4; i++) {
    const y = 1.6 + i * 1.25;
    s.addShape(pres.ShapeType.ellipse, { x: 0.6, y: y + 0.1, w: 0.85, h: 0.85, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: "num" });
    L.txt(s, goals[i][0], { x: 0.6, y: y + 0.1, w: 0.85, h: 0.85, fontSize: 26, bold: true, color: C.background1, align: "center", valign: "middle" });
    L.card(d, s, 1.7, y, 11.0, 1.05, { noShadow: true });
    L.txt(s, goals[i][1], { x: 2.0, y, w: 10.5, h: 1.05, fontSize: 20, color: C.text2, valign: "middle" });
  }

  s = L.content(d, "タイムテーブル（3時間）");
  L.table(d, s, [
    ["時間", "内容", "形式"],
    ["0:00–0:20", "チェックイン「この半年の心の天気」", "個人→班"],
    ["0:20–0:50", "ワーク①「私の回復の実績」：リカバリープランの見直し", "個人→ペア"],
    ["0:50–1:20", "講義①＋ワーク②「比較の罠」と過去の自分への手紙", "講義→個人"],
    ["1:20–1:30", "休憩", ""],
    ["1:30–2:10", "講義②＋ワーク③「守るセルフコンパッション」とコントロールの円", "講義→個人"],
    ["2:10–2:45", "ワーク④ NVCで「断る・意見を言う」ロールプレイ", "3人組"],
    ["2:45–3:00", "マイ・リカバリープラン ver.2", "個人"],
  ], { colW: [2.0, 7.6, 2.5], fontSize: 15, y: 1.45, rowH: 0.65 });

  s = L.content(d, "おさらい：PAUSE", "6か月前に学んだPAUSE。今日はどのステップが一番使えたかを思い出しながら見てください。");
  await pauseSlide(d, s);

  L.sectionSlide(d, "PART 2", "回復の実績を確認する");
  s = L.content(d, "チェックイン　この半年の心の天気",
    "第1回の「心の天気」を6か月分に延長します。注目するのは嵐そのものではなく、嵐から戻れた場面です。");
  const weather = [["FaSun", C.accent3, "8A5F67"], ["FaCloud", C.accent2, "FFFFFF"], ["FaCloudRain", C.accent5, "FFFFFF"], ["FaBolt", C.accent5, "FFFFFF"], ["FaCloudSun", C.accent3, "8A5F67"], ["FaSun", C.accent3, "8A5F67"]];
  const months = ["4月", "5月", "6月", "7月", "8月", "9月"];
  s.addShape(pres.ShapeType.line, { x: 0.9, y: 2.15, w: 11.5, h: 0, line: { color: C.accent2, width: 2, dashType: "dash" }, objectName: "timeline" });
  for (let i = 0; i < 6; i++) {
    const x = 0.6 + i * 2.05;
    await L.iconCircle(d, s, x + 0.4, 1.6, 1.1, weather[i][0], weather[i][1], weather[i][2]);
    L.txt(s, months[i], { x: x, y: 2.8, w: 1.9, h: 0.4, fontSize: 14, color: C.accent5, align: "center" });
  }
  L.card(d, s, 0.6, 3.5, 12.1, 3.0);
  L.txt(s, "書いてみよう", { x: 0.95, y: 3.7, w: 4, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
  L.bullets(s, ["入社〜今日までの心の天気を書く（例は一例です）", "嵐から、くもりや晴れに戻れた時、何がきっかけだった？", "誰が助けてくれた？　自分は何をした？"], { x: 0.95, y: 4.25, w: 11.4, h: 2.1, color: C.text1 });

  s = L.content(d, "ワーク①　私の回復の実績",
    "自己効力感の一番の源は「自分でできた」という体験。回復を記録して思い出すことが、次に折れた時の土台になります。ペアでは「戻れた話」だけを共有し、聞き手は「その時、何を大切にしていたと思う？」と価値を返します。");
  await L.iconCards(d, s, [
    { icon: "FaStar", head: "一番使えたステップ", body: "PAUSEのうち、一番使えたのは？\n一番使えなかったのは？" },
    { icon: "FaRedoAlt", head: "戻れた場面", body: "「前の自分なら固まっていたけど、今回は戻れた」場面を1つ", circle: C.accent6 },
    { icon: "FaSearch", head: "戻れなかった場面", body: "何が足りなかった？\nスキル？　環境？　疲れ？", circle: C.accent5 },
  ], { msg: "戻れなかった場面は「失敗」ではなく、次のプランの材料" });

  L.sectionSlide(d, "PART 3", "比較の罠と、守るセルフコンパッション");
  s = L.content(d, "講義①　比較の罠",
    "既存教材「誰かになろうとする努力は失敗に終わる」と接続。比較は止められないので、比べてしまったら U（外す）を使います。");
  L.card(d, s, 0.6, 1.6, 5.8, 4.9, { fill: "F4F1F2" });
  L.txt(s, "同期と比べる", { x: 0.95, y: 1.85, w: 5.1, h: 0.6, fontSize: 24, bold: true, color: C.accent5 });
  L.bullets(s, ["他人の「表」と、自分の「裏」を比べている", "自分に不利な面ばかりを選んで比べやすい", "比べるほど「劣っている」証拠が集まる"], { x: 0.95, y: 2.6, w: 5.1, h: 2.4, color: C.text1, fontSize: 17 });
  L.txt(s, "U：「『あいつより劣っている』という考えが浮かんでいる」", { x: 0.95, y: 5.15, w: 5.1, h: 1.1, fontSize: 16, bold: true, color: C.accent4 });
  L.card(d, s, 6.9, 1.6, 5.8, 4.9);
  L.txt(s, "過去の自分と比べる", { x: 7.25, y: 1.85, w: 5.1, h: 0.6, fontSize: 24, bold: true, color: C.accent1 });
  L.bullets(s, ["比べる材料は全部自分の中にある", "「できるようになったこと」が見える", "成長の実感が、次の一歩のエネルギーになる"], { x: 7.25, y: 2.6, w: 5.1, h: 2.4, color: C.text1, fontSize: 17 });
  L.txt(s, "ワーク②：4月の自分に、今の自分から手紙を書く", { x: 7.25, y: 5.15, w: 5.1, h: 1.1, fontSize: 16, bold: true, color: C.accent1 });

  s = L.content(d, "ワーク②　4月の自分への手紙", "共有は任意です。書くだけで十分。");
  await L.iconCircle(d, s, 0.6, 1.6, 1.2, "FaEnvelopeOpenText", C.accent1);
  L.txt(s, "入社したばかりの自分へ", { x: 2.1, y: 1.6, w: 10.6, h: 1.2, fontSize: 26, bold: true, color: C.text2, valign: "middle" });
  const letter = [["あの時できなかったけど、今できること", "例：電話を1人でかけられる"], ["あの時心配していたけど、大丈夫だったこと", "例：怒られても、ちゃんと戻ってこられた"], ["あの時の自分に、かけてあげたい言葉", "例：「怖くて当然。ちゃんとやれてるよ」"]];
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 4.133;
    L.card(d, s, x, 3.1, 3.833, 3.4);
    L.txt(s, letter[i][0], { x: x + 0.3, y: 3.35, w: 3.23, h: 1.4, fontSize: 18, bold: true, color: C.text2 });
    L.txt(s, letter[i][1], { x: x + 0.3, y: 4.9, w: 3.23, h: 1.4, fontSize: 15, color: C.accent5 });
  }

  s = L.content(d, "講義②　セルフコンパッションの2つの顔",
    "半年経つと「断れない」「全部引き受ける」による消耗が増えます。評価が気になる人ほど「断る＝評価が下がる」と考えやすい。自分を守ることもセルフコンパッションです。");
  L.card(d, s, 0.6, 1.6, 5.8, 4.9);
  await L.iconCircle(d, s, 0.95, 1.9, 0.9, "FaHeart", C.accent1);
  L.txt(s, "やさしいセルフコンパッション", { x: 2.05, y: 1.9, w: 4.2, h: 0.9, fontSize: 20, bold: true, color: C.text2, valign: "middle" });
  L.bullets(s, ["「つらいね」と自分をいたわる", "傷ついた後のケア", "本研修で学んだ S"], { x: 0.95, y: 3.1, w: 5.1, h: 3.0, color: C.text1, fontSize: 18 });
  L.card(d, s, 6.9, 1.6, 5.8, 4.9, { fill: "EDE8F4" });
  await L.iconCircle(d, s, 7.25, 1.9, 0.9, "FaShieldAlt", C.accent4);
  L.txt(s, "守るセルフコンパッション", { x: 8.35, y: 1.9, w: 4.2, h: 0.9, fontSize: 20, bold: true, color: C.text2, valign: "middle" });
  L.bullets(s, ["「これ以上は無理」と自分を守る", "傷つく前の境界線", "今日学ぶ：断る・調整する・課題を分ける"], { x: 7.25, y: 3.1, w: 5.1, h: 3.0, color: C.text1, fontSize: 18 });

  s = L.content(d, "ワーク③　コントロールの円",
    "既存教材「課題の分離・境界線」と接続。内側から最小の一歩を1つ選び（E）、外側には心の中で「今、手放す」と言います（ACTのアクセプタンス）。");
  s.addShape(pres.ShapeType.ellipse, { x: 0.8, y: 1.45, w: 5.4, h: 5.3, fill: { color: HEX.lt2 }, line: { color: HEX.accent2, width: 2 }, objectName: "outer circle" });
  s.addShape(pres.ShapeType.ellipse, { x: 1.95, y: 2.55, w: 3.1, h: 3.1, fill: { color: HEX.accent1 }, line: { color: HEX.accent1 }, objectName: "inner circle" });
  L.txt(s, "コントロール\nできる", { x: 1.95, y: 3.3, w: 3.1, h: 1.6, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle" });
  L.txt(s, "コントロールできない", { x: 0.8, y: 1.7, w: 5.4, h: 0.6, fontSize: 16, bold: true, color: C.accent5, align: "center" });
  L.txt(s, "内側（自分で選べる）", { x: 6.8, y: 1.6, w: 5.9, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
  L.bullets(s, ["自分の行動・準備", "誰に相談するか", "断り方・伝え方"], { x: 6.8, y: 2.15, w: 5.9, h: 1.6, color: C.text1, fontSize: 17 });
  L.txt(s, "外側（手放す）", { x: 6.8, y: 4.0, w: 5.9, h: 0.5, fontSize: 20, bold: true, color: C.accent5 });
  L.bullets(s, ["上司の機嫌・お客さんの反応", "評価の結果", "同期の成績"], { x: 6.8, y: 4.55, w: 5.9, h: 1.6, color: C.text1, fontSize: 17 });

  s = L.content(d, "ワーク④　NVCで「断る」「意見を言う」",
    "3人組（新人役／上司役／観察役）。上司役には最初は渋る役をしてもらい、2往復目でどう返すかを練習します。NVCの「NO」は、相手のニーズへの「YES」と一緒に伝えます。");
  L.card(d, s, 0.6, 1.6, 5.8, 4.9);
  L.txt(s, "台本④ 断る・調整する", { x: 0.9, y: 1.85, w: 5.2, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
  L.txt(s, "「今、〇〇と△△の2件を今週中に進めています。新しい件もお役に立ちたいのですが、このままだと全部が中途半端になりそうで不安です。どれも質を落とさず仕上げたいので、優先順位を一緒に決めていただけますか？」", { x: 0.9, y: 2.5, w: 5.2, h: 3.8, fontSize: 16, color: C.text1 });
  L.card(d, s, 6.9, 1.6, 5.8, 4.9);
  L.txt(s, "台本⑤ 違う意見を言う", { x: 7.2, y: 1.85, w: 5.2, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
  L.txt(s, "「〇〇の進め方について、お客さんに一番伝わる形にしたいと思っていて、一点だけ、別の案をお話ししてもいいですか？」", { x: 7.2, y: 2.5, w: 5.2, h: 2.2, fontSize: 16, color: C.text1 });
  L.txt(s, "ポイント：先に「ニーズ（何のために）」を言うと、反論ではなく提案として届く", { x: 7.2, y: 4.9, w: 5.2, h: 1.3, fontSize: 15, color: C.accent5 });

  s = L.content(d, "マイ・リカバリープラン ver.2", "本研修で作ったプランを更新します。12か月後のフォローアップに持参してもらいます。");
  await L.iconCards(d, s, [
    { icon: "FaExclamationTriangle", head: "新しい揺れ", body: "新しく分かった「サメモードになりやすい場面」" },
    { icon: "FaComments", head: "新しい台本", body: "断る・調整する・意見を言う", circle: C.accent5 },
    { icon: "FaUsers", head: "頼れる人の更新", body: "半年で増えた人を書き足す", circle: C.accent6 },
    { icon: "FaShieldAlt", head: "守るフレーズ", body: "「私の時間とエネルギーも大切にしていい」", circle: C.accent4 },
  ], { msg: "6か月後の効果測定（T2）もこのタイミングで実施" });

  L.sectionSlide(d, "参考文献", "使用した論文");
  L.refSlides(d, "参考文献", [R.km, R.unruh, R.ogata, R.neff, R.leary, R.breines, R.hayes, R.masuda, R.wacker, R.epinat], 8);
  L.titleSlide(d, "比べるなら、4月の自分と。\n守ることも、やさしさ。", "次は12か月後のフォローアップで会いましょう\nマイ・リカバリープラン ver.2 を持ってきてください");
  await L.save(d, out);
}

async function twelveMonth(out) {
  const d = L.newDeck("12か月後フォローアップ研修");
  const { C, pres } = d;
  d.section = "表紙"; pres.addSection({ title: "表紙" });
  L.titleSlide(d, "12か月後フォローアップ研修\n1年目の物語を書き直す",
    "2年目へ、そして後輩を迎える側へ ｜ 3時間\nメンタルジム ｜ 臨床心理士・公認心理師 監修",
    "キャリア初期の適応のターニングポイントは入社2年目（尾形）。後輩が入る前に、1年を振り返り、自分のスキルを人との関わりにも使えるようにします。");

  L.sectionSlide(d, "PART 1", "1年経った今");
  let s = L.content(d, "この時期に起きやすいこと",
    "2年目の憂鬱は、慣れによる単調さと成長実感の低下から起きやすいと言われています（尾形）。");
  await L.iconCards(d, s, [
    { icon: "FaUserFriends", head: "後輩が入ってくる", body: "「先輩らしくしなきゃ」\n「後輩より劣ってたらどうしよう」" },
    { icon: "FaUserTie", head: "「新人だから」が通用しない", body: "「もう言い訳できない」というプレッシャー", circle: C.accent5 },
    { icon: "FaCloud", head: "2年目の憂鬱", body: "慣れて単調に。\n「この仕事、このままでいいのかな」", circle: C.accent4 },
    { icon: "FaBatteryQuarter", head: "1年分の疲れ", body: "「頑張ってきたけど、なんのため？」", circle: C.accent6 },
  ], { msg: "今日は、1年を「回復と成長の物語」として持ち帰る日" });

  s = L.content(d, "今日のゴール");
  const goals = [
    ["1", "1年間を「失敗の物語」ではなく「回復と成長の物語」として書き直す"],
    ["2", "2年目に向けて、働く上での価値を再確認・更新する"],
    ["3", "PAUSEとNVCを、後輩・同僚との関わりにも使う（イルカモードを人にも）"],
    ["4", "2年目のセルフケア計画を立てる"],
  ];
  for (let i = 0; i < 4; i++) {
    const y = 1.6 + i * 1.25;
    s.addShape(pres.ShapeType.ellipse, { x: 0.6, y: y + 0.1, w: 0.85, h: 0.85, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: "num" });
    L.txt(s, goals[i][0], { x: 0.6, y: y + 0.1, w: 0.85, h: 0.85, fontSize: 26, bold: true, color: C.background1, align: "center", valign: "middle" });
    L.card(d, s, 1.7, y, 11.0, 1.05, { noShadow: true });
    L.txt(s, goals[i][1], { x: 2.0, y, w: 10.5, h: 1.05, fontSize: 20, color: C.text2, valign: "middle" });
  }

  s = L.content(d, "タイムテーブル（3時間）");
  L.table(d, s, [
    ["時間", "内容", "形式"],
    ["0:00–0:20", "チェックイン：1年間の心の天気・総集編", "個人"],
    ["0:20–1:00", "ワーク①「1年目の物語を書き直す」", "個人→ペア"],
    ["1:00–1:30", "ワーク②「2年目の私が大切にしたいこと」", "個人→班"],
    ["1:30–1:40", "休憩", ""],
    ["1:40–2:20", "講義＋ワーク③「後輩を迎える側の心理学」", "講義→ロールプレイ"],
    ["2:20–2:45", "ワーク④「2年目のセルフケア計画」", "個人"],
    ["2:45–3:00", "クロージング：同期への感謝と応援のメッセージ", "全体"],
  ], { colW: [2.0, 7.3, 2.8], fontSize: 15, y: 1.45, rowH: 0.65 });

  s = L.content(d, "おさらい：PAUSE", "4月・10月・今の「PAUSEの使いやすさ」を10段階でつけてもらいます。");
  await pauseSlide(d, s);

  L.sectionSlide(d, "PART 2", "1年目の物語を書き直す");
  s = L.content(d, "ワーク①　3幕で書く「私の1年目」",
    "人は経験を物語として記憶します。同じ1年でも、どの場面に焦点を当てるかで物語は変わります。つらかったことをなかったことにする必要はありません（A・S）。");
  const acts = [
    ["第1幕", "つまずき", "一番つらかった場面を\n「事実」として書く（U）", "FaCloudRain", C.accent5],
    ["第2幕", "立て直し", "その時・その後、何をした？\n誰が助けてくれた？\n何を大切にしていた？", "FaHandsHelping", C.accent1],
    ["第3幕", "今の自分", "その経験があったから\n今できること・分かること", "FaSeedling", C.accent6],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 4.133;
    L.card(d, s, x, 1.6, 3.833, 3.7);
    await L.iconCircle(d, s, x + 0.3, 1.9, 0.9, acts[i][3], acts[i][4]);
    L.txt(s, acts[i][0], { x: x + 1.4, y: 1.9, w: 2.2, h: 0.4, fontSize: 14, color: C.accent5 });
    L.txt(s, acts[i][1], { x: x + 1.4, y: 2.28, w: 2.2, h: 0.55, fontSize: 22, bold: true, color: C.text2 });
    L.txt(s, acts[i][2], { x: x + 0.3, y: 3.15, w: 3.23, h: 2.0, fontSize: 16, color: C.text1 });
    if (i < 2) s.addShape(pres.ShapeType.rightArrow, { x: x + 3.86, y: 3.25, w: 0.24, h: 0.32, fill: { color: C.accent2 }, line: { color: C.accent2 }, objectName: "arrow" });
  }
  L.card(d, s, 0.6, 5.6, 12.1, 0.95, { fill: HEX.accent2, noShadow: true });
  L.txt(s, "最後にタイトルをつける　例：「怒られて、聞けるようになった1年」", { x: 0.9, y: 5.6, w: 11.5, h: 0.95, fontSize: 18, bold: true, color: C.text2, valign: "middle" });

  s = L.content(d, "ワーク②　2年目の私が大切にしたいこと",
    "本研修で選んだ価値カードを再び並べます。既存教材「領域ごとに価値を明確化する」と接続。");
  L.bullets(s, ["1年前に選んだ価値は、今も一番？", "新しく大切になったものは？"], { x: 0.6, y: 1.6, w: 12.1, h: 1.1, color: C.text2, fontSize: 20 });
  await L.iconCards(d, s, [
    { icon: "FaBriefcase", head: "仕事", body: "その価値に沿って、2年目にとる行動を1つ" },
    { icon: "FaUsers", head: "人との関わり", body: "同僚・後輩・お客さんとの関わりで1つ", circle: C.accent5 },
    { icon: "FaSpa", head: "自分のケア", body: "自分を大切にする行動を1つ", circle: C.accent6 },
  ], { y: 2.9, h: 3.6 });

  L.sectionSlide(d, "PART 3", "後輩を迎える側の心理学");
  s = L.content(d, "講義　イルカモードを、人にも",
    "新人が助けを求められる場をつくるのは、制度より身近な先輩の反応（Edmondson, 1999）。先輩の「失敗の見方」は後輩に伝わる（Haimovitz & Dweck, 2016 の職場への当てはめ。推論である点に注意）。既存イルカマスターコース「何かするんじゃなくて、まずは理解から」。");
  await L.iconCards(d, s, [
    { icon: "FaQuestionCircle", head: "思い出す", body: "1年前の自分が、一番言ってほしかった言葉は何だった？" },
    { icon: "FaSeedling", head: "失敗はデータ", body: "「失敗＝学びのデータ」と言える先輩になる", circle: C.accent6 },
    { icon: "FaEye", head: "まず理解から", body: "後輩がサメモードの時は、アドバイスより先に理解する", circle: C.accent4 },
  ], { msg: "教えることは最大の学習。ただし抱え込みすぎない（守るセルフコンパッション）" });

  s = L.content(d, "ワーク③　後輩へのPAUSE（対人版）",
    "ロールプレイ：後輩役がケースカードの状況を話し、先輩役が下の関わりを試します。");
  L.table(d, s, [
    ["後輩の状態", "先輩の関わり", "ステップ"],
    ["固まっている", "「今どんな感じ？」", "A 気づくのを手伝う"],
    ["「自分はダメだ」と言う", "「そう思っちゃうよね。で、実際に起きたことは何だった？」", "U 事実と考えを分ける"],
    ["自分を責めている", "「自分も1年目に同じことやったよ」", "S 共通の人間性"],
    ["動けない", "「次の一歩、一番小さくすると何？」", "E 最小の一歩"],
  ], { colW: [3.0, 6.3, 2.8], fontSize: 16, y: 1.6, rowH: 0.95, boldFirst: true });

  s = L.content(d, "ワーク④　2年目のセルフケア計画",
    "既存教材の「心身の土台5要素」。マイ・リカバリープラン ver.3（最終版）として、手帳やスマホに保存してもらいます。");
  const base = [["FaBed", "睡眠"], ["FaSun", "朝の光"], ["FaAppleAlt", "食事"], ["FaWalking", "運動"], ["FaLeaf", "自然"]];
  for (let i = 0; i < 5; i++) {
    const x = 0.6 + i * 2.47;
    L.card(d, s, x, 1.6, 2.2, 2.1);
    await L.iconCircle(d, s, x + 0.65, 1.85, 0.9, base[i][0], [C.accent1, C.accent3, C.accent5, C.accent6, C.accent4][i]);
    L.txt(s, base[i][1], { x, y: 2.9, w: 2.2, h: 0.6, fontSize: 20, bold: true, color: C.text2, align: "center" });
  }
  L.card(d, s, 0.6, 4.0, 12.1, 2.5);
  L.bullets(s, ["2年目に予想される「揺れ」と、その対策", "「研修では足りない」サインと相談先の再確認", "PAUSE・台本・頼れる人をまとめた ver.3 を保存する"], { x: 0.95, y: 4.3, w: 11.4, h: 2.0, color: C.text1, fontSize: 18 });

  s = L.content(d, "効果測定と企業への報告",
    "個人の結果は本人にのみ返却。会社には集団集計のみを報告します。");
  L.table(d, s, [
    ["報告書の構成", "内容"],
    ["1. 心理指標の推移", "T0→T1→T2→T3 の集団平均（セルフコンパッション、心理的柔軟性、評価への恐れ、回復力、K6、エンゲイジメント）"],
    ["2. 定着・健康", "1年後在籍率・休職数の前年度比較"],
    ["3. 参加者の声", "「1年間で一番役に立ったスキル」「後輩に伝えたいこと」（匿名）"],
    ["4. 職場環境への提案", "研修で見えた課題（匿名化）と改善の提案"],
  ], { colW: [3.2, 8.9], fontSize: 15, y: 1.6, rowH: 0.95, boldFirst: true });

  s = L.content(d, "クロージング　同期への感謝と応援のメッセージ",
    "カードは匿名でも可。講師から最後に：1年間、何度もサメモードになりながら、ここまで戻ってきたこと自体が、あなたの回復力の証拠です。");
  L.card(d, s, 2.2, 1.7, 8.9, 4.6, { fill: HEX.lt2 });
  await L.iconCircle(d, s, 6.05, 1.95, 1.2, "FaEnvelopeOpenText", C.accent1);
  L.txt(s, "＿＿＿＿＿＿ さんへ", { x: 2.7, y: 3.4, w: 7.9, h: 0.6, fontSize: 22, bold: true, color: C.text2 });
  L.txt(s, "1年間、一緒にいてくれてありがとう。\nあなたの＿＿＿＿＿＿なところに助けられました。\n2年目も応援しています。", { x: 2.7, y: 4.1, w: 7.9, h: 2.0, fontSize: 18, color: C.text1 });

  L.sectionSlide(d, "参考文献", "使用した論文");
  L.refSlides(d, "参考文献", [R.ogata, R.km, R.edmondson, R.haimovitz, R.bauer, R.neff, R.hayes, R.bond], 8);
  L.titleSlide(d, "1年間、何度も戻ってきた。\nそれが、あなたの回復力の証拠。", "心が折れそうになったら、PAUSE（ポーズ）\n止まる・気づく・外す・思いやる・取り組む");
  await L.save(d, out);
}

(async () => {
  await sixMonth(process.argv[2] || "six.pptx");
  await twelveMonth(process.argv[3] || "twelve.pptx");
})().catch((e) => { console.error(e); process.exit(1); });
