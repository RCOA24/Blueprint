import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('out');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((request, response) => {
  const requested = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const file = path.resolve(root, '.' + requested, requested.endsWith('/') ? 'index.html' : '');
  const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file;
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'content-type': types[path.extname(target)] ?? 'application/octet-stream' });
  fs.createReadStream(target).pipe(response);
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const routes = ['', 'about/', 'services/', 'services/general-construction/', 'services/architectural-services/', 'services/remodeling/', 'services/blueprint-fencing/', 'projects/', 'projects/north-side/', 'projects/cayman-brac-airport/', 'projects/owen-roberts-airport/', 'products/', 'careers/', 'contact/'];
  const reference = process.env.BLUEPRINT_REFERENCE_DIR;
  for (const route of routes) {
    const response = await page.goto(`${base}/${route}`);
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, route);
    assert.equal(await page.locator('img:not([alt])').count(), 0, route);
    if (reference && route !== 'contact/' && fs.existsSync(path.join(reference, route, 'index.html'))) {
      const original = fs.readFileSync(path.join(reference, route, 'index.html'), 'utf8');
      const extractMain = html => html.split('<main id="main">')[1]?.split('</main>')[0];
      const migrated = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
      const wrapper = extractMain(migrated)?.slice('<div>'.length);
      const migratedOriginal = wrapper?.slice(0, -6);
      assert.equal(migratedOriginal, extractMain(original), `reference content differs: ${route}`);
    }
  }
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(`${base}/${route}`);
      const scroll = await page.evaluate(() => {
        const root = document.documentElement;
        root.scrollLeft = 100;
        return { overflow: root.scrollWidth - root.clientWidth, left: root.scrollLeft, mode: getComputedStyle(root).overflowX, scrollbar: getComputedStyle(root).scrollbarWidth, webkitWidth: getComputedStyle(root, '::-webkit-scrollbar').width };
      });
      assert.equal(scroll.mode, 'hidden', `root horizontal scrollbar at ${width}px on ${route}`);
      assert.equal(scroll.scrollbar, 'none', `visible root scrollbar at ${width}px on ${route}`);
      assert.equal(scroll.webkitWidth, '0px', `visible Chrome scrollbar at ${width}px on ${route}`);
      assert.ok(scroll.overflow <= 1 && scroll.left === 0, `horizontal overflow at ${width}px on ${route}: ${JSON.stringify(scroll)}`);
    }
  }
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of routes) {
      await page.goto(`${base}/${route}`);
      const overflow = await page.evaluate(() => {
        document.documentElement.style.zoom = '1.25';
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });
      assert.ok(overflow <= 1, `horizontal overflow at ${width}px and 125% zoom on ${route}: ${overflow}px`);
    }
  }
  await page.goto(base);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.mouse.wheel(0, 600);
  await page.waitForFunction(() => window.scrollY > 0);
  assert.ok(Math.abs(await page.locator('.header').evaluate(header => header.getBoundingClientRect().top)) <= 1, 'sticky header while scrolling vertically');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.setViewportSize({ width: 375, height: 800 });
  await page.locator('.menu-btn').click();
  assert.equal(await page.locator('.menu-btn').getAttribute('aria-expanded'), 'true');
  await page.locator('.nav a[href="/projects/"]').click();
  assert.match(page.url(), /\/projects\/$/);
  await page.locator('[data-filter="Fencing"]').click();
  assert.equal(await page.locator('.filter-grid > [data-category]:visible').count(), 2);
  await page.goto(`${base}/projects/north-side/`);
  await page.locator('.gallery-open').first().click();
  assert.equal(await page.locator('#lightbox').evaluate(dialog => dialog.open), true);
  await page.locator('.close-dialog').click();
  await page.goto(`${base}/contact/`);
  assert.equal(await page.locator('#enquiry').count(), 0);
  assert.equal(await page.locator('#appointment-form').count(), 1);
  assert.match(await page.locator('.contact-info').textContent(), /Unit 3C, Grand Cayman, 80 Shedden Road/);
  assert.equal(await page.locator('.cta').count(), 0);
  await page.locator('.appointment-section button[type="submit"]').click();
  assert.equal(await page.locator('.appointment-section input[name="name"]').evaluate(input => input.validity.valueMissing), true);
  await page.locator('.appointment-section input[name="name"]').fill('Test Visitor');
  await page.locator('.appointment-section input[name="email"]').fill('visitor@example.com');
  await page.locator('.appointment-section select[name="service"]').selectOption({ label: 'Architectural services' });
  const requestedDate = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  await page.locator('.appointment-section input[name="date"]').fill(requestedDate);
  let submitted;
  await page.route('**/api/appointment.php', async route => {
    submitted = route.request().postData();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"message":"Request accepted."}' });
  });
  await page.locator('.appointment-section button[type="submit"]').click();
  await page.getByText('Your request and a copy for you were accepted for sending.').waitFor();
  assert.match(submitted, /visitor@example.com/);
  assert.match(submitted, /Architectural services/);
  assert.ok(submitted.includes(requestedDate));
  assert.equal(await page.locator('.appointment-section input[name="name"]').inputValue(), '');
  assert.equal(await page.locator('text=Gmail draft').count(), 0);
  await page.unroute('**/api/appointment.php');
  await page.route('**/api/appointment.php', route => route.fulfill({ status: 429, contentType: 'application/json', body: '{"message":"Please wait before trying again."}' }));
  await page.locator('.appointment-section input[name="name"]').fill('Test Visitor');
  await page.locator('.appointment-section input[name="email"]').fill('visitor@example.com');
  await page.locator('.appointment-section select[name="service"]').selectOption({ label: 'Architectural services' });
  await page.locator('.appointment-section input[name="date"]').fill(requestedDate);
  await page.locator('.appointment-section button[type="submit"]').click();
  await page.getByText('Too many requests. Please wait a few minutes and try again.').waitFor();
  assert.equal(await page.locator('.appointment-section input[name="name"]').inputValue(), 'Test Visitor');
  await page.unroute('**/api/appointment.php');
  await page.route('**/api/appointment.php', route => route.fulfill({ status: 200, contentType: 'text/html', body: 'Unexpected response' }));
  await page.locator('.appointment-section button[type="submit"]').click();
  await page.getByText('We could not confirm whether your request was sent.').waitFor();
  assert.equal(await page.locator('.appointment-section input[name="name"]').inputValue(), 'Test Visitor');
  await page.goto(`${base}/contact/?service=General%20construction`);
  assert.equal(await page.locator('#appointment-form select[name="service"]').inputValue(), 'General construction');
  await page.goto(`${base}/contact/?product=Wood%20fence%20systems`);
  assert.match(await page.locator('#appointment-form textarea[name="message"]').inputValue(), /Wood fence systems/);
  await page.goto(`${base}/careers/`);
  await page.locator('.job summary').first().click();
  assert.equal(await page.locator('.job').first().getAttribute('open'), '');
  console.log('Browser smoke tests passed: 14 routes, 6 widths each, reference content, navigation, filters, gallery, careers, prefill, address, and appointment form submission.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
