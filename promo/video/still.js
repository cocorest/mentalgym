// 確認用: 指定した秒のコマを PNG で保存  node still.js <html> <幅> <高さ> <出力フォルダ> <フォントCSS> 秒 秒 ...
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
(async () => {
  const [html, w, h, outDir, fontDir, ...times] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined });
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  await page.goto("file://" + path.resolve(html));
  for (const f of ["500.css", "700.css"]) await page.addStyleTag({ url: "file://" + path.resolve(fontDir, f) });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([500,700].map(wt => document.fonts.load(`${wt} 40px "Zen Maru Gothic"`, document.body.innerText))); });
  await page.waitForTimeout(300);
  for (const t of times) {
    await page.evaluate(ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), Number(t) * 1000);
    await page.screenshot({ path: path.join(outDir, `t${t}.png`) });
  }
  await browser.close();
})();
