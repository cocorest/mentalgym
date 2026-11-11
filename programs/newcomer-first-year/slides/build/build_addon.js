// 手元で編集中のデッキに差し込む用：研究対応表＋PAUSEの順番・背景（3枚）
const L = require("./lib");
const M = require("./build_main");
(async () => {
  const d = L.newDeck("差し込み用スライド");
  d.section = "差し込み用"; d.pres.addSection({ title: "差し込み用" });
  await M.researchSlide(d);
  await M.pauseOrderSlide(d);
  await M.pauseBackgroundSlide(d);
  await L.save(d, process.argv[2] || "addon.pptx");
})().catch((e) => { console.error(e); process.exit(1); });
