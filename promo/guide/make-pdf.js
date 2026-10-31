// 使い方: node make-pdf.js <フォントCSSのフォルダ> <出力.pdf>
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
(async () => {
  const [fontDir, out] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined });
  const page = await browser.newPage();
  await page.goto("file://" + path.resolve(__dirname, "guide.html"));
  for (const f of ["500.css", "700.css"]) await page.addStyleTag({ url: "file://" + path.resolve(fontDir, f) });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([500, 700].map(w => document.fonts.load(`${w} 16px "Zen Maru Gothic"`, document.body.innerText))); await document.fonts.ready; });
  await page.waitForTimeout(500);
  await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
  await browser.close(); console.log("done", out);
})();
