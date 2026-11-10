// 共通：テーマ・レイアウト・部品
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const fs = require("fs");
const { execFileSync } = require("child_process");
const path = require("path");

const FONT = "Yu Gothic";
const THEME = {
  name: "Mental Gym",
  headFontFace: FONT,
  bodyFontFace: FONT,
  colors: {
    dk1: "4A3035", lt1: "FFFFFF", dk2: "5C3D42", lt2: "FDF0F2",
    accent1: "C4697A", accent2: "E8A5B0", accent3: "F2C4A8", accent4: "8E7AB5",
    accent5: "8A5F67", accent6: "5E9C8F", hlink: "C4697A", folHlink: "8A5F67",
  },
};
const HEX = THEME.colors;
const W = 13.333, H = 7.5;
const FOOTER = "メンタルジム ｜ 入社1年目に学ぶ 職場の心理学";

// ---------- icons ----------
const iconCache = {};
async function icon(name, color) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  if (!fa[name]) throw new Error("no icon " + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(fa[name], { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}

function newDeck(title) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = title;
  pres.author = "メンタルジム（臨床心理士・公認心理師 監修）";
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "Title Dark",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 2.1, w: 11.5, h: 1.9, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left" }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.9, y: 4.2, w: 11.5, h: 1.6, fontSize: 20, color: C.accent2, valign: "top", align: "left" }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "Section",
    background: { color: C.accent1 },
    objects: [
      { placeholder: { options: { name: "body", type: "body", x: 0.9, y: 2.0, w: 11.5, h: 0.7, fontSize: 18, bold: true, color: C.background2, align: "left" }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 2.7, w: 11.5, h: 1.6, fontSize: 40, bold: true, color: C.background1, valign: "top", align: "left" }, text: "" } },
    ],
    slideNumber: { x: 12.3, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.background2 },
  });
  pres.defineSlideMaster({
    title: "Content",
    background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 12.1, h: 0.85, fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left" }, text: "" } },
      { text: { text: FOOTER, options: { x: 0.6, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.accent5 } } },
    ],
    slideNumber: { x: 12.3, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
  });
  return { pres, C };
}

// ---------- slide builders ----------
function titleSlide(d, title, sub, notes) {
  const s = d.pres.addSlide({ masterName: "Title Dark", sectionTitle: d.section });
  s.addText(title, { placeholder: "title" });
  s.addText(sub, { placeholder: "body" });
  if (notes) s.addNotes(notes);
  return s;
}
function sectionSlide(d, eyebrow, title, notes) {
  d.section = eyebrow + " " + title.replace(/\n/g, " ");
  d.pres.addSection({ title: d.section });
  const s = d.pres.addSlide({ masterName: "Section", sectionTitle: d.section });
  s.addText(eyebrow, { placeholder: "body" });
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}
function content(d, title, notes) {
  const s = d.pres.addSlide({ masterName: "Content", sectionTitle: d.section });
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}
const shadow = () => ({ type: "outer", color: "C9A5AD", blur: 6, offset: 2, angle: 90, opacity: 0.35 });

function card(d, s, x, y, w, h, opt = {}) {
  const { C } = d;
  s.addShape(d.pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.12, fill: { color: opt.fill || C.background2 },
    line: { color: opt.fill || C.background2, width: 0.5 }, shadow: opt.noShadow ? undefined : shadow(), objectName: opt.name || "card",
  });
}
async function iconCircle(d, s, x, y, size, iconName, circleColor, iconHex = "FFFFFF") {
  s.addShape(d.pres.ShapeType.ellipse, { x, y, w: size, h: size, fill: { color: circleColor }, line: { color: circleColor }, objectName: "icon circle" });
  const pad = size * 0.25;
  s.addImage({ data: await icon(iconName, iconHex), x: x + pad, y: y + pad, w: size - 2 * pad, h: size - 2 * pad, altText: iconName });
}
function txt(s, text, o) { s.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: "top", fontSize: 16 }, o)); }

// cards row: items = [{icon, head, body}]
async function iconCards(d, s, items, o = {}) {
  const { C } = d;
  const n = items.length, gap = 0.3, x0 = 0.6, totalW = 12.1;
  const w = (totalW - gap * (n - 1)) / n;
  const y = o.y || 1.6, h = o.h || (o.msg ? 3.7 : 4.9);
  for (let i = 0; i < n; i++) {
    const it = items[i], x = x0 + i * (w + gap);
    card(d, s, x, y, w, h, { fill: it.fill });
    if (it.icon) await iconCircle(d, s, x + 0.35, y + 0.35, 0.8, it.icon, it.circle || C.accent1);
    const hy = it.icon ? y + 1.35 : y + 0.35;
    txt(s, it.head, { x: x + 0.35, y: hy, w: w - 0.7, h: 0.9, fontSize: o.headSize || 20, bold: true, color: it.headColor || C.text2, valign: "top" });
    txt(s, it.body, { x: x + 0.35, y: hy + 0.95, w: w - 0.7, h: h - (hy - y) - 1.2, fontSize: o.bodySize || 16, color: C.text1, paraSpaceAfter: 6 });
  }
  if (o.msg) txt(s, o.msg, { x: 0.6, y: y + h + 0.3, w: 12.1, h: 6.75 - (y + h + 0.3), fontSize: 22, bold: true, color: C.accent1, align: "center", valign: "middle" });
}

function table(d, s, rows, o = {}) {
  const { C } = d;
  const head = rows[0].map((t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: HEX.accent1 }, fontSize: o.headSize || 14, valign: "middle" } }));
  const body = rows.slice(1).map((r, i) =>
    r.map((t, j) => ({ text: t, options: { fontSize: o.fontSize || 14, color: C.text1, bold: o.boldFirst && j === 0, fill: { color: i % 2 ? HEX.lt2 : "FFFFFF" }, valign: "middle" } }))
  );
  s.addTable([head, ...body], {
    x: o.x || 0.6, y: o.y || 1.5, w: o.w || 12.1, colW: o.colW, rowH: o.rowH,
    border: { type: "solid", pt: 0.75, color: "E8C8CF" }, margin: 0.08, autoPage: false,
  });
}

function bullets(s, items, o) {
  s.addText(
    items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 8 } })),
    Object.assign({ isTextBox: true, margin: 0.05, valign: "top", fontSize: 16 }, o)
  );
}

// 参考文献スライド（10.5pt）
function refSlides(d, title, refs, perSlide = 9) {
  for (let i = 0; i < refs.length; i += perSlide) {
    const chunk = refs.slice(i, i + perSlide);
    const s = content(d, title + (refs.length > perSlide ? `（${Math.floor(i / perSlide) + 1}/${Math.ceil(refs.length / perSlide)}）` : ""));
    s.addText(
      chunk.map((r, k) => [
        { text: r.cite + " ", options: { fontSize: 12, color: d.C.text1 } },
        { text: r.url, options: { fontSize: 12, color: d.C.accent1, hyperlink: { url: r.url }, breakLine: k < chunk.length - 1 } },
      ]).flat().map((run, idx, arr) => run),
      { isTextBox: true, x: 0.6, y: 1.4, w: 12.1, h: 5.45, margin: 0, valign: "top", paraSpaceAfter: 7 }
    );
  }
}

async function save(d, file) {
  await d.pres.writeFile({ fileName: file });
  const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
  await applyTheme(file, THEME);
  // 東アジア（日本語）フォントをテーマに設定
  const tmp = file + ".dir";
  fs.rmSync(tmp, { recursive: true, force: true });
  execFileSync("python3", ["-c", "import sys,zipfile;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])", file, tmp]);
  const tp = path.join(tmp, "ppt/theme/theme1.xml");
  let x = fs.readFileSync(tp, "utf8");
  x = x.replace(/<a:ea typeface="[^"]*"\s*\/>/g, `<a:ea typeface="${FONT}"/>`);
  fs.writeFileSync(tp, x);
  fs.rmSync(file);
  execFileSync("bash", ["-c", `cd "${tmp}" && zip -qXrD "${path.resolve(file)}" '[Content_Types].xml' _rels docProps ppt`]);
  fs.rmSync(tmp, { recursive: true, force: true });
}

module.exports = { newDeck, titleSlide, sectionSlide, content, card, iconCircle, iconCards, table, bullets, txt, refSlides, save, HEX, W, H };
