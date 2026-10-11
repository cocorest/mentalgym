// 使い方: node render.js <html> <幅> <高さ> <秒数> <出力.mp4> [fps] [フォントCSSのフォルダ]
// アニメーションを1コマずつ止めて撮影し、ffmpeg で MP4 にします。
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

(async () => {
  const [html, w, h, secs, out, fpsArg, fontDir] = process.argv.slice(2);
  const fps = Number(fpsArg || 30), W = Number(w), H = Number(h), total = Math.round(Number(secs) * fps);
  const exe = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
  const browser = await chromium.launch({ executablePath: exe });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto("file://" + path.resolve(html));
  if (fontDir) for (const f of ["500.css", "700.css"]) await page.addStyleTag({ url: "file://" + path.resolve(fontDir, f) });
  await page.evaluate(async () => {
    document.body.offsetHeight;
    await document.fonts.ready;
    // 画面内の文字で使うフォントを先に読み込んでおく
    const text = document.body.innerText;
    await Promise.all([500, 700].map(wt => document.fonts.load(`${wt} 40px "Zen Maru Gothic"`, text)));
    await document.fonts.ready;
    document.getAnimations().forEach(a => a.pause());
  });
  await page.waitForTimeout(300);

  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-movflags", "+faststart", out],
    { stdio: ["pipe", "inherit", "inherit"] });

  for (let i = 0; i < total; i++) {
    const ms = (i / fps) * 1000;
    await page.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }), ms);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % (fps * 5) === 0) process.stdout.write(`  ${Math.round(ms / 1000)}s / ${secs}s\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await browser.close();
  console.log("done:", out);
})();
