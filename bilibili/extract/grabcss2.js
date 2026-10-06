const { chromium } = require('/tmp/webclone-skill/node_modules/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome',
    args: ['--disable-blink-features=AutomationControlled'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' });
  const cssFiles = [];
  p.on('response', async r => {
    const ct = r.headers()['content-type'] || '';
    if (ct.includes('text/css') || r.url().match(/\.css(\?|$)/)) {
      try {
        const body = await r.body();
        if (body.length > 100) cssFiles.push({ url: r.url(), size: body.length, body: body.toString('utf8') });
      } catch (e) {}
    }
  });
  await p.goto('https://www.bilibili.com/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(3000);
  let all = '';
  for (const f of cssFiles) { all += `/* SOURCE: ${f.url} */\n` + f.body + '\n'; }
  fs.writeFileSync('/tmp/bilibili-extract/bili.css', all);
  console.log('捕获 CSS 文件数:', cssFiles.length, '| 合计:', all.length, 'bytes');
  cssFiles.slice(0, 8).forEach(f => console.log('  -', f.size, 'bytes', f.url.slice(0, 90)));
  await b.close();
})();
