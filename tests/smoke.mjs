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
  const routes = ['', 'about/', 'services/', 'services/general-construction/', 'services/architectural-services/', 'services/remodeling/', 'services/blueprint-fencing/', 'projects/', 'projects/north-side/', 'projects/fence-installation-and-repair/', 'projects/architectural-design-plans/', 'products/', 'careers/', 'contact/'];
  const reference = process.env.BLUEPRINT_REFERENCE_DIR;
  for (const route of routes) {
    const response = await page.goto(`${base}/${route}`);
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, route);
    assert.equal(await page.locator('img:not([alt])').count(), 0, route);
    if (reference && fs.existsSync(path.join(reference, route, 'index.html'))) {
      const original = fs.readFileSync(path.join(reference, route, 'index.html'), 'utf8');
      const migrated = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
      const signatures = await page.evaluate(([before, after]) => {
        const signature = html => {
          const document = new DOMParser().parseFromString(html, 'text/html');
          return [...document.querySelectorAll('header, header *, main, main *, footer, footer *')].map(element => ({
            tag: element.tagName,
            text: element.textContent.replace(/\s+/g, ''),
            attributes: [...element.attributes]
              // React sets the video's muted property instead of serializing the attribute.
              .filter(attribute => attribute.name !== 'muted')
              .map(attribute => [attribute.name, attribute.value.trim()])
              .sort(([a], [b]) => a.localeCompare(b)),
          }));
        };
        return [signature(before), signature(after)];
      }, [original, migrated]);
      assert.deepEqual(signatures[1], signatures[0], `exported content differs: ${route}`);
    }
  }
  await page.goto(base);
  await page.locator('.client-carousel').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  assert.equal(await page.locator('.client-group').first().locator('img').count(), 17);
  await page.waitForFunction(() => document.querySelector('.client-group img').naturalWidth > 0);
  for (const source of await page.locator('.client-group').first().locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')))) {
    assert.ok(fs.existsSync(path.join(root, decodeURIComponent(source))), source);
  }
  const initialTransform = await page.locator('.client-track').evaluate(track => getComputedStyle(track).transform);
  await page.waitForFunction(initial => getComputedStyle(document.querySelector('.client-track')).transform !== initial, initialTransform);
  await page.locator('.client-carousel').hover();
  assert.equal(await page.locator('.client-track').evaluate(track => getComputedStyle(track).animationPlayState), 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.client-track').evaluate(track => getComputedStyle(track).animationName), 'clients-scroll');
  assert.equal(await page.locator('.client-group').first().evaluate(group => getComputedStyle(group).flexWrap), 'nowrap');
  assert.equal(await page.getByRole('button', { name: /carousel/i }).count(), 0);
  assert.ok(await page.locator('.client-logo img').evaluateAll(images => images.every(image => {
    const card = image.parentElement.getBoundingClientRect();
    const bounds = image.getBoundingClientRect();
    return bounds.height <= card.height && bounds.top >= card.top && bounds.bottom <= card.bottom;
  })), 'logos fit inside their cards');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${base}/projects/fence-installation-and-repair/`);
  assert.equal(await page.locator('.gallery-open').count(), 8);
  await page.goto(`${base}/projects/architectural-design-plans/`);
  assert.equal(await page.locator('.gallery-open').count(), 0);
  assert.equal(await page.locator('#lightbox').count(), 0);
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
  assert.equal(await page.locator('.filter-grid > [data-category]:visible').count(), 1);
  await page.goto(`${base}/projects/north-side/`);
  await page.locator('.gallery-open').first().click();
  assert.equal(await page.locator('#lightbox').evaluate(dialog => dialog.open), true);
  const galleryImages = await page.locator('.gallery-open').evaluateAll(buttons => buttons.map(button => '/assets/' + button.dataset.image));
  const lightboxImage = page.locator('#lightbox img');
  await page.getByRole('button', { name: 'Next image', exact: true }).click();
  assert.equal(await lightboxImage.getAttribute('src'), galleryImages[1]);
  await page.keyboard.press('ArrowLeft');
  assert.equal(await lightboxImage.getAttribute('src'), galleryImages[0]);
  await page.getByRole('button', { name: 'Previous image', exact: true }).click();
  assert.equal(await lightboxImage.getAttribute('src'), galleryImages.at(-1));
  await page.keyboard.press('ArrowRight');
  assert.equal(await lightboxImage.getAttribute('src'), galleryImages[0]);
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
  await page.locator('.appointment-section select[name="service"]').selectOption({ label: 'Blueprint Architecture' });
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
  assert.match(submitted, /Blueprint Architecture/);
  assert.ok(submitted.includes(requestedDate));
  assert.equal(await page.locator('.appointment-section input[name="name"]').inputValue(), '');
  assert.equal(await page.locator('text=Gmail draft').count(), 0);
  await page.unroute('**/api/appointment.php');
  await page.route('**/api/appointment.php', route => route.fulfill({ status: 429, contentType: 'application/json', body: '{"message":"Please wait before trying again."}' }));
  await page.locator('.appointment-section input[name="name"]').fill('Test Visitor');
  await page.locator('.appointment-section input[name="email"]').fill('visitor@example.com');
  await page.locator('.appointment-section select[name="service"]').selectOption({ label: 'Blueprint Architecture' });
  await page.locator('.appointment-section input[name="date"]').fill(requestedDate);
  await page.locator('.appointment-section button[type="submit"]').click();
  await page.getByText('Too many requests. Please wait a few minutes and try again.').waitFor();
  assert.equal(await page.locator('.appointment-section input[name="name"]').inputValue(), 'Test Visitor');
  await page.unroute('**/api/appointment.php');
  await page.route('**/api/appointment.php', route => route.fulfill({ status: 200, contentType: 'text/html', body: 'Unexpected response' }));
  await page.locator('.appointment-section button[type="submit"]').click();
  await page.getByText('We could not confirm whether your request was sent.').waitFor();
  assert.equal(await page.locator('.appointment-section input[name="name"]').inputValue(), 'Test Visitor');
  await page.goto(`${base}/contact/?service=Blueprint%20Construction`);
  assert.equal(await page.locator('#appointment-form select[name="service"]').inputValue(), 'Blueprint Construction');
  await page.goto(`${base}/contact/?product=Wood%20fence%20systems`);
  assert.match(await page.locator('#appointment-form textarea[name="message"]').inputValue(), /Wood fence systems/);
  await page.goto(`${base}/careers/`);
  assert.equal(await page.getByRole('heading', { name: 'JOIN OUR TEAM!' }).count(), 1);
  assert.equal(await page.getByRole('link', { name: 'Apply now!' }).getAttribute('href'), '/contact/');
  console.log('Browser smoke tests passed: 14 routes, 6 widths each, reference content, navigation, filters, gallery, careers, prefill, address, and appointment form submission.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
