// grab-dom.js — 抓取 rendered DOM（工作流阶段0）
// 用法: node grab-dom.js <url> [输出文件]
const { chromium } = require('/tmp/webclone-skill/node_modules/playwright');
const fs = require('fs');

(async () => {
  const url = process.argv[2] || 'http://localhost:9999/mtpe-individual/transText#/';
  const out = process.argv[3] || 'rendered.html';
  const b = await chromium.launch({ headless: true, executablePath: '/opt/google/chrome/chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(5000); // 等 React 渲染完成
  const html = await p.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync(out, html);
  console.log(`已保存 rendered DOM: ${out} (${html.length} bytes)`);
  await b.close();
})();
