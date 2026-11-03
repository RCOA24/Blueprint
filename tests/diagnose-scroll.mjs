import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('out');
const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const target = path.resolve(root, '.' + decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) { response.writeHead(404); response.end(); return; }
  const mime = target.endsWith('.css') ? 'text/css' : target.endsWith('.js') ? 'text/javascript' : target.endsWith('.html') ? 'text/html' : 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': mime }); fs.createReadStream(target).pipe(response);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const routes = ['', 'contact/', 'products/', 'projects/', 'about/', 'services/'];
  for (const width of [320, 375, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(`${base}/${route}`);
      for (const zoom of [1, 1.25]) {
        const result = await page.evaluate(zoom => {
          document.documentElement.style.zoom = String(zoom);
          const viewport = document.documentElement.clientWidth;
          const offenders = [...document.querySelectorAll('*')].map(element => {
            const bounds = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return { element, width: Math.round(bounds.width), right: Math.round(bounds.right), scroll: element.scrollWidth - element.clientWidth, overflow: style.overflowX };
          }).filter(item => item.right > viewport + 2 || item.scroll > 2).sort((a, b) => b.right - a.right).slice(0, 5).map(item => ({ tag: item.element.tagName, className: String(item.element.className).slice(0, 60), section: item.element.closest('section')?.className ?? '', outer: item.element.outerHTML.slice(0, 120), width: item.width, right: item.right, scroll: item.scroll, overflow: item.overflow }));
          return { viewport, root: document.documentElement.scrollWidth, body: document.body.scrollWidth, scrollLeft: document.scrollingElement?.scrollLeft, offenders };
        }, zoom);
        if (result.root > result.viewport + 1 || result.body > result.viewport + 1 || result.offenders.length) console.log(JSON.stringify({ width, route, zoom, ...result }));
      }
    }
  }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
