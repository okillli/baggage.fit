/**
 * Post-build prerender script.
 * Launches Puppeteer, serves dist/, visits each route, and saves the
 * rendered HTML so search engines get real content.
 *
 * Usage: node scripts/prerender.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const PORT = 4173;
const MAX_CONCURRENT = 4;

// Build route list from airlines.json
const airlines = JSON.parse(
  readFileSync(resolve(__dirname, '../public/data/airlines.json'), 'utf-8')
);
const airlineRoutes = airlines.map(
  (a) => `/airlines/${a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
);
const staticRoutes = ['/', '/airlines', '/about', '/data-sources'];
const routes = [...staticRoutes, ...airlineRoutes];

// Minimal static file server for dist/
function startServer() {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      let filePath = resolve(DIST, `.${req.url}`);
      // SPA fallback: serve index.html for routes without extensions
      if (!filePath.match(/\.\w+$/)) {
        filePath = resolve(DIST, 'index.html');
      }
      try {
        const data = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const mimeTypes = {
          html: 'text/html', js: 'application/javascript', css: 'text/css',
          json: 'application/json', png: 'image/png', svg: 'image/svg+xml',
          jpg: 'image/jpeg', jpeg: 'image/jpeg',
          woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf',
        };
        resp.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        resp.end(data);
      } catch {
        // Fallback to index.html for SPA routing
        const html = readFileSync(resolve(DIST, 'index.html'));
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.end(html);
      }
    });
    server.listen(PORT, () => res(server));
  });
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 15000 });
    // Wait for #root to have content
    await page.waitForSelector('#root *', { timeout: 10000 });
    // Wait for airline data to render (table rows or airline cards)
    await page.waitForFunction(
      () => {
        const rows = document.querySelectorAll('table tbody tr, [data-airline]');
        const heading = document.querySelector('h1, h2');
        return rows.length > 0 || (heading && heading.textContent.trim().length > 0);
      },
      { timeout: 10000 }
    ).catch(() => {
      // Fallback: wait 2s if no specific elements found (e.g. home page)
    });
    // Small buffer for remaining async renders
    await new Promise((r) => setTimeout(r, 500));
    const html = await page.content();

    // Write to dist/<route>/index.html
    const outDir = resolve(DIST, `.${route}`);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, 'index.html'), html, 'utf-8');
    console.log(`  ✓ ${route}`);
  } catch (err) {
    console.error(`  ✗ ${route}: ${err.message}`);
  } finally {
    await page.close();
  }
}

// Generate sitemap.xml from routes
function generateSitemap(baseUrl) {
  const today = new Date().toISOString().split('T')[0];
  const urls = routes.map((route) => {
    const priority = route === '/' ? '1.0'
      : route === '/airlines' ? '0.8'
      : route.startsWith('/airlines/') ? '0.7'
      : '0.5';
    const changefreq = route === '/' ? 'weekly'
      : route === '/airlines' ? 'weekly'
      : 'monthly';
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

async function main() {
  console.log(`[prerender] Starting — ${routes.length} routes`);
  const server = await startServer();
  const browser = await puppeteer.launch({ headless: true });

  // Process in batches
  for (let i = 0; i < routes.length; i += MAX_CONCURRENT) {
    const batch = routes.slice(i, i + MAX_CONCURRENT);
    await Promise.all(batch.map((route) => renderRoute(browser, route)));
  }

  // Generate sitemap
  const sitemap = generateSitemap('https://baggage.fit');
  writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✓ sitemap.xml');

  await browser.close();
  server.close();
  console.log(`[prerender] Done — ${routes.length} routes prerendered + sitemap`);
}

main().catch((err) => {
  console.error('[prerender] Fatal:', err);
  process.exit(1);
});
