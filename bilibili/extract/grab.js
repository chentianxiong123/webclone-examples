const { chromium } = require('/tmp/webclone-skill/node_modules/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome',
    args: ['--disable-blink-features=AutomationControlled'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' });
  await p.goto('https://www.bilibili.com/', { waitUntil: 'domcontentloaded', timeout: 40000 }).catch(e => console.log('goto warn:', e.message));
  await p.waitForTimeout(10000);
  // 滚动触发懒加载
  for (let i = 0; i < 5; i++) { await p.evaluate(() => window.scrollBy(0, 900)); await p.waitForTimeout(800); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(1500);
  await p.screenshot({ path: '/tmp/bilibili-extract/page.png' });
  const title = await p.title();
  const vw = await p.evaluate(() => window.innerWidth);
  const html = await p.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync('/tmp/bilibili-extract/rendered.html', html);
  // 信息统计
  const info = await p.evaluate(() => ({
    title: document.title,
    bodyText: (document.body.innerText || '').slice(0, 200),
    imgs: document.images.length,
    iframes: document.querySelectorAll('iframe').length,
    scripts: document.querySelectorAll('script').length,
  }));
  console.log('title:', title, '| viewport:', vw, '| DOM:', html.length, 'bytes');
  console.log('内文:', JSON.stringify(info).slice(0, 300));
  await b.close();
})();
