const { chromium } = require('/tmp/webclone-skill/node_modules/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome',
    args: ['--disable-blink-features=AutomationControlled'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' });
  await p.goto('https://www.bilibili.com/', { waitUntil: 'domcontentloaded', timeout: 40000 }).catch(() => {});
  await p.waitForTimeout(9000);
  const css = await p.evaluate(() => {
    let out = [];
    // 内联 <style> 文本
    document.querySelectorAll('style').forEach(s => out.push(s.innerHTML));
    // 样式表 rules（同域可读）
    for (const sh of document.styleSheets) {
      try {
        for (const r of sh.cssRules) out.push(r.cssText);
      } catch (e) {}
    }
    return out.join('\n');
  });
  fs.writeFileSync('/tmp/bilibili-extract/bili.css', css);
  console.log('收集 CSS:', css.length, 'bytes');
  await b.close();
})();
