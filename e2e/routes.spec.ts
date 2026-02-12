import { test, expect } from '@playwright/test';

// ------------------------------------------------------------------
// /airlines — AirlinesListPage
// ------------------------------------------------------------------

test.describe('/airlines page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/airlines');
    await page.waitForTimeout(1000);
  });

  test('Loads with "ALL AIRLINES" heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'ALL AIRLINES' });
    await expect(heading).toBeVisible();
  });

  test('Shows search input with placeholder "Search airlines..."', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search airlines..."]');
    await expect(searchInput).toBeVisible();
  });

  test('Shows region groups', async ({ page }) => {
    await expect(page.locator('text=Europe')).toBeVisible();
    await expect(page.locator('text=Americas')).toBeVisible();
    await expect(page.locator('text=Asia Pacific')).toBeVisible();
    await expect(page.locator('text=Middle East & Africa')).toBeVisible();
  });

  test('Airline cards link to detail pages', async ({ page }) => {
    // Find the first airline card link
    const firstLink = page.locator('a[href^="/airlines/"]').first();
    await expect(firstLink).toBeVisible();

    const href = await firstLink.getAttribute('href');
    expect(href).toMatch(/^\/airlines\/[a-z0-9-]+$/);
  });

  test('Search filters airlines', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search airlines..."]');
    await searchInput.fill('Ryanair');
    await page.waitForTimeout(300);

    // Should show at least one result containing Ryanair
    const links = page.locator('a[href^="/airlines/"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // First card should contain Ryanair
    const firstText = await links.first().textContent();
    expect(firstText?.toLowerCase()).toContain('ryanair');
  });

  test('Empty search shows "No airlines found" message', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search airlines..."]');
    await searchInput.fill('xyznonexistentairline123');
    await page.waitForTimeout(300);

    await expect(page.locator('text=/No airlines found/')).toBeVisible();
  });
});

// ------------------------------------------------------------------
// /airlines/ryanair — AirlinePage
// ------------------------------------------------------------------

test.describe('/airlines/ryanair page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/airlines/ryanair');
    await page.waitForTimeout(1000);
  });

  test('Loads Ryanair detail page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ryanair' })).toBeVisible();
  });

  test('Shows breadcrumbs (Home / Airlines / Ryanair)', async ({ page }) => {
    const nav = page.locator('nav', { hasText: 'Home' });
    await expect(nav).toBeVisible();
    await expect(nav.locator('text=Home')).toBeVisible();
    await expect(nav.locator('text=Airlines')).toBeVisible();
    await expect(nav.locator('text=Ryanair')).toBeVisible();
  });

  test('Shows bag allowance cards for cabin, underseat, checked', async ({ page }) => {
    // The AirlineDetailContent shows "Bag allowances" heading
    await expect(page.locator('text=Bag allowances')).toBeVisible();

    // Should have cards for all three bag types (h4 headings from BagTypeAllowanceCard)
    await expect(page.getByRole('heading', { name: 'Cabin Bag' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Under-Seat Bag' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Checked Bag' })).toBeVisible();
  });

  test('Shows "Official baggage policy" link', async ({ page }) => {
    const policyLink = page.locator('a', { hasText: 'Official baggage policy' });
    await expect(policyLink).toBeVisible();

    const href = await policyLink.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });

  test('Shows "Last verified" date', async ({ page }) => {
    await expect(page.locator('text=/Last verified/')).toBeVisible();
  });

  test('Has CTA "Check your bag against Ryanair"', async ({ page }) => {
    const cta = page.locator('a', { hasText: 'Check your bag against Ryanair' });
    await expect(cta).toBeVisible();
  });

  test('CTA navigates to home page', async ({ page }) => {
    const cta = page.locator('a', { hasText: 'Check your bag against Ryanair' });
    await cta.click();
    await page.waitForTimeout(1500);

    // Should navigate to home
    expect(page.url()).toContain('localhost:5173');
    // The path should be "/" (root)
    const path = new URL(page.url()).pathname;
    expect(path).toBe('/');
  });
});

// ------------------------------------------------------------------
// /airlines/nonexistent-airline — Not found airline
// ------------------------------------------------------------------

test.describe('/airlines/nonexistent-airline page', () => {
  test('Shows "Airline Not Found" message', async ({ page }) => {
    await page.goto('/airlines/nonexistent-airline');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Airline Not Found')).toBeVisible();
  });
});

// ------------------------------------------------------------------
// /nonexistent — NotFoundPage (404)
// ------------------------------------------------------------------

test.describe('404 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nonexistent');
    await page.waitForTimeout(500);
  });

  test('Shows "404 — Page Not Found"', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /404 — Page Not Found/i });
    await expect(heading).toBeVisible();
  });

  test('Has link to home page', async ({ page }) => {
    const homeLink = page.locator('a', { hasText: 'Check your bag' });
    await expect(homeLink).toBeVisible();

    const href = await homeLink.getAttribute('href');
    expect(href).toBe('/');
  });

  test('Has link to airlines page', async ({ page }) => {
    const airlinesLink = page.locator('a', { hasText: 'Browse airlines' });
    await expect(airlinesLink).toBeVisible();

    const href = await airlinesLink.getAttribute('href');
    expect(href).toBe('/airlines');
  });
});
